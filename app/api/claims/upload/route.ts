import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { cookies } from 'next/headers'

interface FileMetadata {
  originalName: string;
  storedName: string;
  size: number;
  type: string;
  url: string;
}

interface UploadResults {
  identity_files: FileMetadata | null;
  supporting_files: FileMetadata | null;
  invoice_files: FileMetadata | null;
}

interface FileTypes {
  [key: string]: keyof UploadResults;
}

// Configure the API route to handle large files
export const config = {
  api: {
    bodyParser: false,
    responseLimit: '50mb',
  },
}

export async function POST(request: Request) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      console.error('No authorization header')
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const supabase = getSupabase()

    // Get the user session using the token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      console.error('Auth error:', userError)
      return NextResponse.json({ 
        error: 'Unauthorized', 
        details: userError?.message || 'Invalid token'
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

    const uploadResults: UploadResults = {
      identity_files: null,
      supporting_files: null,
      invoice_files: null
    }

    // Process each file type
    const fileTypes: FileTypes = {
      'identityDocs': 'identity_files',
      'supportingDocs': 'supporting_files',
      'invoices': 'invoice_files'
    }
    
    for (const [formKey, dbColumn] of Object.entries(fileTypes)) {
      const file = formData.get(formKey) as File | null
      if (file && file instanceof File) {
        try {
          // Create a unique filename
          const fileExt = file.name.split('.').pop()
          const fileName = `${claimId}/${formKey}_${Date.now()}.${fileExt}`

          // Convert File to ArrayBuffer
          const arrayBuffer = await file.arrayBuffer()
          const fileBuffer = new Uint8Array(arrayBuffer)

          console.log(`Uploading ${formKey}:`, {
            fileName,
            fileSize: file.size,
            fileType: file.type
          })

          // Upload to Supabase storage with the session
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('trueclaim')
            .upload(fileName, fileBuffer, {
              contentType: file.type,
              upsert: true
            })

          if (uploadError) {
            console.error(`Error uploading ${formKey}:`, uploadError)
            throw uploadError
          }

          console.log(`Successfully uploaded ${formKey}:`, uploadData)

          // Get the public URL
          const { data: { publicUrl } } = supabase.storage
            .from('trueclaim')
            .getPublicUrl(fileName)

          uploadResults[dbColumn] = {
            originalName: file.name,
            storedName: fileName,
            size: file.size,
            type: file.type,
            url: publicUrl
          }
        } catch (error) {
          console.error(`Error processing ${formKey}:`, error)
          return NextResponse.json({
            error: `Failed to process ${formKey}`,
            details: error
          }, { status: 500 })
        }
      }
    }

    // Update the claim record with file URLs if any files were uploaded
    if (Object.values(uploadResults).some(result => result !== null)) {
      console.log('Updating claim with file URLs:', uploadResults)
      const { error: updateError } = await supabase
        .from('claims')
        .update(uploadResults as unknown as Record<string, unknown>)
        .eq('claim_id', claimId)

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
      files: uploadResults
    })

  } catch (error: any) {
    console.error('Handler error:', error)
    return NextResponse.json({
      error: 'Failed to process upload',
      details: error.message
    }, { status: 500 })
  }
}
