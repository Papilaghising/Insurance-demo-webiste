import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '../../../../lib/supabase'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'

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
  url: string;
}

type FolderType = 'identity' | 'invoice' | 'supporting';

const STORAGE_FOLDERS = {
  identity: 'identity-docs',
  invoice: 'invoices',
  supporting: 'supporting-docs',
  other: 'other-docs'
};

export async function POST(req: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      console.error('No authorization header found')
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    if (!token) {
      console.error('No token found in authorization header')
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const supabase = getSupabase()
    
    // Verify the token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    if (userError || !user) {
      console.error('User validation error:', userError)
      return NextResponse.json({ 
        error: 'Invalid session',
        details: userError?.message || 'User validation failed'
      }, { status: 401 })
    }

    // Parse form data
    const form = formidable({
      multiples: true,
      maxFileSize: 50 * 1024 * 1024, // 50MB
      filter: (part) => {
        return part.mimetype?.startsWith('image/') || part.mimetype === 'application/pdf';
      }
    })

    const formData = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const { fields, files } = formData as { fields: any, files: any };

    // Check and create bucket if needed
    const { data: buckets, error: bucketListError } = await supabase.storage.listBuckets()
    
    if (bucketListError) {
      console.error('Error listing buckets:', bucketListError)
      return NextResponse.json({ error: 'Storage error', details: bucketListError.message }, { status: 500 })
    }

    if (!buckets?.some(b => b.name === 'trueclaim')) {
      console.log('Creating claims bucket...')
      const { error: createError } = await supabase.storage.createBucket('trueclaim', {
        public: true,
        fileSizeLimit: 52428800 // 50MB
      })
      if (createError) {
        console.error('Error creating bucket:', createError)
        return NextResponse.json({ error: 'Storage error', details: createError.message }, { status: 500 })
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

    // Upload files
    const uploadId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
    const uploadedFiles: FileInfo[] = []

    for (const [fieldName, fileArray] of Object.entries(files)) {
      const file = Array.isArray(fileArray) ? fileArray[0] : fileArray;
      if (!file) continue;

      const storageFolder = STORAGE_FOLDERS[fieldName as keyof typeof STORAGE_FOLDERS] || STORAGE_FOLDERS.other;
      const safeFileName = `${uploadId}-${path.basename(file.originalFilename || 'file').replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = `${storageFolder}/${safeFileName}`;

      try {
        console.log(`Reading file: ${safeFileName}`)
        const fileBuffer = fs.readFileSync(file.filepath)
        
        console.log(`Uploading file to ${filePath}`)
        const { data, error: uploadError } = await supabase.storage
          .from('trueclaim')
          .upload(filePath, fileBuffer, {
            contentType: file.mimetype || 'application/octet-stream',
            cacheControl: '3600',
            upsert: true
          })

        if (uploadError) throw uploadError;

        console.log(`Successfully uploaded ${safeFileName}`)
        const { data: { publicUrl } } = supabase.storage
          .from('trueclaim')
          .getPublicUrl(data.path)

        uploadedFiles.push({
          path: data.path,
          name: file.originalFilename || 'unnamed',
          type: storageFolder,
          size: file.size,
          url: publicUrl
        })

        // Clean up temp file
        fs.unlinkSync(file.filepath)
      } catch (error: any) {
        console.error(`Error uploading ${file.originalFilename}:`, error)
        // Continue with other files even if one fails
      }
    }

    if (uploadedFiles.length === 0) {
      return NextResponse.json({ error: 'No files were uploaded successfully' }, { status: 400 })
    }

    console.log(`Successfully uploaded ${uploadedFiles.length} files`)

    return NextResponse.json({
      message: 'Files uploaded successfully',
      upload_id: uploadId,
      files: uploadedFiles.map(file => ({
        name: file.name,
        type: file.type,
        url: file.url
      }))
    }, { status: 200 })
  } catch (error: any) {
    console.error('Upload handler error:', error)
    return NextResponse.json({
      error: 'Upload failed',
      details: error.message
    }, { status: 500 })
  }
} 