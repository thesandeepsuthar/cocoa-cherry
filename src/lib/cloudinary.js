import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload image to Cloudinary
 * @param {string} imageData - Image URL, base64 data URL, or Cloudinary URL
 * @param {object} options - Upload options
 * @returns {Promise<{url: string, public_id: string, secure_url: string}>}
 */
export async function uploadToCloudinary(imageData, options = {}) {
  try {
    // Validate input
    if (!imageData || typeof imageData !== 'string') {
      throw new Error('Image data is required and must be a string');
    }

    // If it's already a Cloudinary URL, return it without uploading
    if (imageData.includes('cloudinary.com')) {
      // Extract public_id from URL if possible
      const publicIdMatch = imageData.match(/\/v\d+\/([^\.]+)/);
      const publicId = publicIdMatch ? publicIdMatch[1] : null;
      
      return {
        url: imageData,
        public_id: publicId,
        secure_url: imageData,
        width: null,
        height: null,
        format: 'avif',
        bytes: null,
        original_url: imageData,
      };
    }

    // Validate that it's either a URL or base64 data URL
    const isBase64 = imageData.startsWith('data:image/');
    const isUrl = imageData.startsWith('http://') || imageData.startsWith('https://');
    
    if (!isBase64 && !isUrl) {
      throw new Error('Image data must be a valid URL or base64 data URL');
    }

    const {
      folder = 'cocoa-cherry',
      resourceType = 'image',
      transformation = [],
      publicId = null,
      overwrite = false,
    } = options;

    // Upload to Cloudinary with AVIF format transformation
    const uploadOptions = {
      folder,
      resource_type: resourceType,
      overwrite,
      transformation: [
        {
          quality: 'auto',
          fetch_format: 'avif', // Request AVIF format from Cloudinary
          ...transformation,
        },
      ],
    };

    if (publicId) {
      uploadOptions.public_id = publicId;
    }

    // Cloudinary's uploader.upload() can handle:
    // - Remote URLs (http/https)
    // - Base64 data URLs (data:image/...)
    // - File paths (for local files)
    const result = await cloudinary.uploader.upload(imageData, uploadOptions);

    // Construct AVIF format URL by adding transformation to the base URL
    // Cloudinary URL format: https://res.cloudinary.com/cloud_name/image/upload/v123/public_id
    // We add: f_avif,q_auto transformation for AVIF format
    let avifUrl = result.secure_url;
    
    // Ensure AVIF transformation is in the URL
    if (avifUrl && avifUrl.includes('/upload/')) {
      // Check if transformation already exists
      if (!avifUrl.includes('f_avif')) {
        // Insert AVIF transformation after /upload/
        avifUrl = avifUrl.replace('/upload/', '/upload/f_avif,q_auto/');
      }
    }

    return {
      url: avifUrl,
      public_id: result.public_id,
      secure_url: avifUrl,
      width: result.width,
      height: result.height,
      format: 'avif',
      bytes: result.bytes,
      original_url: result.secure_url,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    console.error('Image data type:', typeof imageData);
    console.error('Image data preview:', imageData?.substring(0, 100));
    throw new Error(`Failed to upload image to Cloudinary: ${error.message}`);
  }
}

/**
 * Upload multiple images to Cloudinary
 * @param {string[]} imageDataArray - Array of image URLs or base64 data URLs
 * @param {object} options - Upload options
 * @returns {Promise<Array>}
 */
export async function uploadMultipleToCloudinary(imageDataArray, options = {}) {
  try {
    const uploadPromises = imageDataArray.map((imageData, index) => {
      const imageOptions = {
        ...options,
        publicId: options.publicId ? `${options.publicId}-${index}` : null,
      };
      return uploadToCloudinary(imageData, imageOptions);
    });

    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('Cloudinary multiple upload error:', error);
    throw new Error(`Failed to upload images to Cloudinary: ${error.message}`);
  }
}

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<object>}
 */
export async function deleteFromCloudinary(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error(`Failed to delete image from Cloudinary: ${error.message}`);
  }
}

/**
 * Extract public ID from Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {string|null}
 */
export function extractPublicId(url) {
  if (!url || typeof url !== 'string') return null;
  
  try {
    // Match Cloudinary URL pattern
    const match = url.match(/\/v\d+\/(.+)\.(jpg|jpeg|png|gif|webp|svg)/i);
    if (match && match[1]) {
      return match[1];
    }
    
    // If it's already a public_id format
    if (!url.includes('http')) {
      return url;
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting public ID:', error);
    return null;
  }
}

/**
 * Check if URL is a Cloudinary URL
 * @param {string} url - URL to check
 * @returns {boolean}
 */
export function isCloudinaryUrl(url) {
  if (!url || typeof url !== 'string') return false;
  return url.includes('cloudinary.com') || url.includes('res.cloudinary.com');
}
