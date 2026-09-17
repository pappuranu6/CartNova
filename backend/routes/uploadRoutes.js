import path from 'path'
import express from 'express'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { Readable } from 'stream'

const router = express.Router()

// Check image type
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/

  const extname = filetypes.test(
    path.extname(file.originalname).toLowerCase()
  )

  const mimetype = filetypes.test(file.mimetype)

  if (extname && mimetype) {
    return cb(null, true)
  }

  cb(new Error('Images only!'))
}

// Store image temporarily in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb)
  },
})

// Upload buffer to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    // Configure Cloudinary here
    // This is done when request comes, so .env is already loaded.
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'cartnova/products',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      }
    )

    Readable.from(buffer).pipe(stream)
  })
}

// Upload route
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'No image uploaded',
      })
    }

    const result = await uploadToCloudinary(req.file.buffer)

    res.json({
      image: result.secure_url,
    })
  } catch (error) {
    console.error('Cloudinary upload error:', error)

    res.status(500).json({
      message: 'Image upload failed',
      error: error.message,
    })
  }
})

export default router