const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

if (process.env.CLOUDINARY_URL) {
  // If CLOUDINARY_URL is present, Cloudinary automatically configures itself.
  // We just need to make sure it's available.
} else if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('❌ Cloudinary configuration missing in .env file (either CLOUDINARY_URL or CLOUD_NAME/API_KEY/API_SECRET required)');
}

// Cloudinary's SDK will automatically pick up CLOUDINARY_URL if it's in process.env.
// But we'll also keep the explicit config for fallback support.
if (!process.env.CLOUDINARY_URL) {
    cloudinary.config({
      cloud_name: (process.env.CLOUDINARY_CLOUD_NAME || '').trim(),
      api_key: (process.env.CLOUDINARY_API_KEY || '').trim(),
      api_secret: (process.env.CLOUDINARY_API_SECRET || '').trim(),
    });
}

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'cidcell',
    format: async (req, file) => {
        const extension = file.mimetype.split('/')[1];
        return ['jpg', 'png', 'jpeg', 'webp'].includes(extension) ? extension : 'jpg';
    },
    public_id: (req, file) => `file-${Date.now()}`,
  },
});

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };
