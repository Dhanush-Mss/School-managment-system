import formidable from 'formidable';
import fs from 'fs-extra';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // In production (Vercel), we can't write to the file system
    // Return a placeholder image URL instead
    if (process.env.NODE_ENV === 'production') {
      return res.status(200).json({ 
        success: true, 
        imageUrl: 'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=School+Image' // Placeholder image
      });
    }

    // For local development, use file upload
    const uploadDir = path.join(process.cwd(), 'public', 'schoolImages');
    await fs.ensureDir(uploadDir);

    const form = formidable({
      uploadDir: uploadDir,
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB limit
      filter: ({ mimetype }) => {
        return mimetype && mimetype.includes('image');
      },
    });

    const [fields, files] = await form.parse(req);
    
    if (!files.image || !files.image[0]) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const file = files.image[0];
    const fileName = `school_${Date.now()}_${file.originalFilename}`;
    const newPath = path.join(uploadDir, fileName);
    
    await fs.move(file.filepath, newPath);
    
    const imageUrl = `/schoolImages/${fileName}`;
    
    res.status(200).json({ success: true, imageUrl });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
}
