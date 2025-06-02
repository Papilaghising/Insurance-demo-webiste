import type { NextApiRequest, NextApiResponse } from 'next'
import { getSupabase } from '@/lib/supabase'
import formidable, { Part } from 'formidable'
import fs from 'fs'

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
}

const STORAGE_FOLDERS = {
  identityDocs: 'identity-documents',
  supportingDocs: 'supporting-documents',
  invoices: 'invoices'
} as const

type FolderType = keyof typeof STORAGE_FOLDERS

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

    if (!buckets?.some(b => b.name === 'claims')) {
      console.log('Creating claims bucket...')
      const { error: createError } = await supabase.storage.createBucket('claims', {
        public: true,
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
        .from('claims')
        .list(folder)
        .catch(() => ({ error: true }))

      if (folderError) {
        const { error: createFolderError } = await supabase.storage
          .from('claims')
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
        
        console.log(`Uploading file to ${filePath}`)
        const { data, error: uploadError } = await supabase.storage
          .from('claims')
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
        const { data: { publicUrl } } = supabase.storage
          .from('claims')
          .getPublicUrl(data.path)

        return {
          path: data.path,
          name: file.originalFilename || 'unnamed',
          type: storageFolder,
          size: file.size,
          url: publicUrl
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

    console.log(`Successfully uploaded ${successfulUploads.length} files`)

    return res.status(200).json({
      message: 'Files uploaded successfully',
      upload_id: uploadId,
      files: successfulUploads.map(file => ({
        name: file.name,
        type: file.type,
        url: file.url
      }))
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return res.status(500).json({
      error: 'Failed to upload files',
      details: error.message || error
    })
  }
} 