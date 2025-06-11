import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { cookies } from 'next/headers'

// Configure the API route to handle large files
export const config = {
  api: {
    bodyParser: false,
    responseLimit: '50mb',
  },
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabase()
    
    // Get cookies using the new cookies() API
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('sb-access-token')?.value
    
    // Get the session using the Supabase client
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    
    if (authError || !session) {
      return NextResponse.json({ 
        error: 'Unauthorized', 
        details: authError?.message || 'No session found'
      }, { status: 401 })
    }

    // Check and create bucket if needed
    console.log('Checking bucket...')
    const { data: buckets, error: bucketListError } = await supabase.storage.listBuckets()
    
    if (bucketListError) {
      console.error('Error listing buckets:', bucketListError)
      return NextResponse.json({
        error: 'Failed to check storage bucket',
        details: bucketListError
      }, { status: 500 })
    }

    if (!buckets?.some(b => b.name === 'trueclaim')) {
      console.log('Creating claims bucket...')
      const { error: createError } = await supabase.storage.createBucket('trueclaim', {
        public: true,
        fileSizeLimit: 52428800 // 50MB
      })
      if (createError) {
        console.error('Error creating bucket:', createError)
        return NextResponse.json({
          error: 'Failed to create storage bucket',
          details: createError
        }, { status: 500 })
      }
    }

    // Get form data from the request
    const formData = await request.formData()
    const claimId = formData.get('claimId') as string
    
    if (!claimId) {
      return NextResponse.json({ error: 'Claim ID is required' }, { status: 400 })
    }

    const uploadResults = []
    const uploadedUrls = {}

    // Process each file type
    const fileTypes = ['identityDocs', 'supportingDocs', 'invoices']
    
    for (const fileType of fileTypes) {
      const file = formData.get(fileType) as File
      if (file) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${claimId}/${fileType}_${Date.now()}.${fileExt}`

        // Convert File to ArrayBuffer
        const arrayBuffer = await file.arrayBuffer()
        const fileBuffer = new Uint8Array(arrayBuffer)

        // Upload to Supabase storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('trueclaim')
          .upload(fileName, fileBuffer, {
            contentType: file.type,
            upsert: true
          })

        if (uploadError) {
          console.error(`Error uploading ${fileType}:`, uploadError)
          return NextResponse.json({
            error: `Failed to upload ${fileType}`,
            details: uploadError
          }, { status: 500 })
        }

        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from('trueclaim')
          .getPublicUrl(fileName)

        uploadResults.push({
          fileType,
          originalName: file.name,
          storedName: fileName,
          size: file.size,
          type: file.type,
          url: publicUrl
        })

        uploadedUrls[fileType] = publicUrl
      }
    }

    // Update the claim record with file URLs if any files were uploaded
    if (uploadResults.length > 0) {
      const { error: updateError } = await supabase
        .from('claims')
        .update({ file_urls: uploadedUrls })
        .eq('id', claimId)

      if (updateError) {
        console.error('Error updating claim with file URLs:', updateError)
        return NextResponse.json({
          error: 'Failed to update claim with file URLs',
          details: updateError
        }, { status: 500 })
      }
    }

    return NextResponse.json({
      message: 'Files uploaded successfully',
      files: uploadResults,
      urls: uploadedUrls
    })

  } catch (error: any) {
    console.error('Handler error:', error)
    return NextResponse.json({
      error: 'Failed to process upload',
      details: error.message
    }, { status: 500 })
  }
}
