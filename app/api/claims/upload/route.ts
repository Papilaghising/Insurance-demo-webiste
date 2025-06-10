import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import formidable from 'formidable'
import { type Part } from 'formidable'

export async function POST(request: Request) {
  try {
    const form = formidable({
      multiples: true,
      filter: (part: Part): boolean => {
        const mimetype = part.mimetype || ''
        console.log('Processing file with mimetype:', mimetype)
        return mimetype === 'application/pdf' || mimetype.startsWith('image/')
      }
    })

    // Convert the Request to a Node.js readable stream
    const readableStream = request.body
    if (!readableStream) {
      return NextResponse.json({ error: 'No request body' }, { status: 400 })
    }

    console.log('Parsing form data...')
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(readableStream, (err, fields, files) => {
        if (err) reject(err)
        else resolve([fields, files])
      })
    })
    
    console.log('Received files:', Object.keys(files))

    const supabase = getSupabase()

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

    // Process files and upload to Supabase storage
    const uploadResults = []
    for (const file of Object.values(files)) {
      // Upload file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('trueclaim')
        .upload(`claims/${file.newFilename}`, file)

      if (uploadError) {
        console.error('Upload error:', uploadError)
        return NextResponse.json({
          error: 'Failed to upload file',
          details: uploadError
        }, { status: 500 })
      }

      uploadResults.push({
        originalName: file.originalFilename,
        storedName: file.newFilename,
        size: file.size,
        type: file.mimetype
      })
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
