import type { NextApiRequest, NextApiResponse } from 'next'
import { getSupabase } from '@/lib/supabase'
import formidable, { Part } from 'formidable'
import fs from 'fs'
import { createWorker } from 'tesseract.js'

export const config = {
  api: {
    bodyParser: false,
  },
}

interface FileInfo {
  path: string;
  name: string;
  type: string;
  size: number;
  url?: string;
  text?: string;
}

const STORAGE_FOLDERS = {
  identityDocs: 'identity-documents',
  supportingDocs: 'supporting-documents',
  invoices: 'invoices'
} as const

type FolderType = keyof typeof STORAGE_FOLDERS

// Function to extract text from image/PDF
async function extractTextFromFile(filePath: string, mimeType: string): Promise<string> {
  if (mimeType.startsWith('image/')) {
    const worker = await createWorker('eng');
    const { data: { text } } = await worker.recognize(filePath);
    await worker.terminate();
    return text;
  } else if (mimeType === 'application/pdf') {
    // For PDF files, we'll need to implement PDF text extraction
    // You can use libraries like pdf-parse or pdf2json
    // For now, returning empty string
    return '';
  }
  return '';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const form = formidable({
      multiples: true,
      filter: (part: Part): boolean => {
        const mimetype = part.mimetype || ''
        console.log('Processing file with mimetype:', mimetype)
        return mimetype === 'application/pdf' || mimetype.startsWith('image/')
      }
    })

    console.log('Parsing form data...')
    const [fields, files] = await form.parse(req)
    console.log('Received files:', Object.keys(files))

    const supabase = getSupabase()
    const claimId = fields.claimId?.[0]
    
    if (!claimId) {
      return res.status(400).json({ error: 'Missing claim ID' })
    }

    // Get claim data for verification
    const { data: claimData, error: claimError } = await supabase
      .from('claims')
      .select('*')
      .eq('id', claimId)
      .single()

    if (claimError || !claimData) {
      return res.status(400).json({ error: 'Failed to fetch claim data' })
    }

    // Check and create bucket if needed
    console.log('Checking bucket...')
    const { data: buckets, error: bucketListError } = await supabase.storage.listBuckets()
    
    if (bucketListError) {
      console.error('Error listing buckets:', bucketListError)
      return res.status(500).json({
        error: 'Failed to check storage bucket',
        details: bucketListError
      })
    }

    if (!buckets?.some(b => b.name === 'trueclaim')) {
      console.log('Creating claims bucket...')
      const { error: createError } = await supabase.storage.createBucket('trueclaim', {
        public: false, // Changed to private
        fileSizeLimit: 52428800 // 50MB
      })
      if (createError) {
        console.error('Error creating bucket:', createError)
        return res.status(500).json({
          error: 'Failed to create storage bucket',
          details: createError
        })
      }
    }

    // Create folders in the bucket if they don't exist
    for (const folder of Object.values(STORAGE_FOLDERS)) {
      const { error: folderError } = await supabase.storage
        .from('trueclaim')
        .list(folder)
        .catch(() => ({ error: true }))

      if (folderError) {
        const { error: createFolderError } = await supabase.storage
          .from('trueclaim')
          .upload(`${folder}/.keep`, new Uint8Array())

        if (createFolderError) {
          console.error(`Error creating folder ${folder}:`, createFolderError)
        }
      }
    }

    // Generate a unique ID for this upload
    const uploadId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`

    const uploadPromises = Object.entries(files).map(async ([fieldName, fileArray]) => {
      if (!fileArray?.[0]) return null
      
      const file = fileArray[0]
      console.log(`Processing file: ${file.originalFilename}, size: ${file.size}, type: ${file.mimetype}`)
      
      const folderType = fieldName as FolderType
      const storageFolder = STORAGE_FOLDERS[folderType] || 'other'
      
      // Create a clean filename
      const fileExtension = file.originalFilename 
        ? file.originalFilename.split('.').pop() 
        : (file.mimetype?.split('/').pop() || 'bin')
      const safeFileName = `${uploadId}-${file.originalFilename?.split('.')[0].replace(/[^a-zA-Z0-9]/g, '-') || 'unnamed'}.${fileExtension}`
      
      // Construct the full storage path
      const filePath = `${storageFolder}/${safeFileName}`

      try {
        console.log(`Reading file: ${safeFileName}`)
        const fileBuffer = fs.readFileSync(file.filepath)
        
        // Extract text from the file
        const extractedText = await extractTextFromFile(file.filepath, file.mimetype || '')
        
        console.log(`Uploading file to ${filePath}`)
        const { data, error: uploadError } = await supabase.storage
          .from('trueclaim')
          .upload(filePath, fileBuffer, {
            contentType: file.mimetype || 'application/octet-stream',
            cacheControl: '3600',
            upsert: true
          })

        if (uploadError) {
          console.error(`Error uploading ${safeFileName}:`, uploadError)
          throw uploadError
        }

        console.log(`Successfully uploaded ${safeFileName}`)
        
        // Generate signed URL that expires in 1 hour
        const { data: { signedUrl } } = await supabase.storage
          .from('trueclaim')
          .createSignedUrl(data.path, 3600)

        return {
          path: data.path,
          name: file.originalFilename || 'unnamed',
          type: storageFolder,
          size: file.size,
          url: signedUrl,
          text: extractedText
        } as FileInfo
      } catch (error) {
        console.error(`Error processing ${file.originalFilename}:`, error)
        throw error
      } finally {
        // Clean up temporary file
        try {
          fs.unlinkSync(file.filepath)
        } catch (unlinkError) {
          console.error(`Error cleaning up temp file ${file.filepath}:`, unlinkError)
        }
      }
    })

    const uploadResults = await Promise.all(uploadPromises)
    const successfulUploads = uploadResults.filter(Boolean) as FileInfo[]

    if (successfulUploads.length === 0) {
      return res.status(400).json({ error: 'No files were uploaded successfully' })
    }

    // Store file metadata in claim_files table
    const fileRecords = successfulUploads.map(file => ({
      claim_id: claimId,
      file_path: file.path,
      file_name: file.name,
      file_type: file.type,
      file_size: file.size,
      document_type: file.type,
      uploaded_by: req.headers['x-user-id']
    }))

    const { error: filesError } = await supabase
      .from('claim_files')
      .insert(fileRecords)

    if (filesError) {
      console.error('Error storing file metadata:', filesError)
      return res.status(500).json({ error: 'Failed to store file metadata' })
    }

    // Send documents for AI verification
    const verificationResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/claims/verify-documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        claimId,
        formData: claimData,
        documents: {
          identityDocs: successfulUploads.find(f => f.type === 'identity-documents'),
          invoices: successfulUploads.find(f => f.type === 'invoices'),
          supportingDocs: successfulUploads.find(f => f.type === 'supporting-documents')
        }
      })
    })

    const verificationResult = await verificationResponse.json()

    console.log(`Successfully uploaded ${successfulUploads.length} files`)

    return res.status(200).json({
      message: 'Files uploaded and verified successfully',
      upload_id: uploadId,
      files: successfulUploads.map(file => ({
        name: file.name,
        type: file.type,
        url: file.url
      })),
      verification: verificationResult
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return res.status(500).json({
      error: 'Failed to upload files',
      details: error.message || error
    })
  }
} 