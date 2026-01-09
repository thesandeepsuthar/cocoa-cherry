/**
 * Image Processing Utility using Sharp
 * 
 * Compresses and optimizes images before storing as Base64 in MongoDB.
 * Reduces image size by 60-90% while maintaining visual quality.
 */

import sharp from 'sharp';

/**
 * Configuration presets for different image types
 */
const IMAGE_PRESETS = {
  gallery: {
    maxWidth: 1200,
    maxHeight: 1200,
    quality: 80,
  },
  menu: {
    maxWidth: 800,
    maxHeight: 800,
    quality: 75,
  },
  thumbnail: {
    maxWidth: 600,
    maxHeight: 600,
    quality: 70,
  },
};

/**
 * Decode Base64 image string to Buffer
 * @param {string} base64String - The Base64 data URL
 * @returns {Buffer} - The image buffer
 */
function decodeBase64(base64String) {
  if (!base64String || !base64String.startsWith('data:image/')) {
    throw new Error('Invalid image data URL');
  }
  
  const matches = base64String.match(/^data:image\/\w+;base64,(.+)$/);
  if (!matches || !matches[1]) {
    throw new Error('Could not parse Base64 data');
  }
  
  return Buffer.from(matches[1], 'base64');
}

/**
 * Encode Buffer to Base64 WebP data URL
 * @param {Buffer} buffer - The image buffer
 * @returns {string} - The Base64 data URL
 */
function encodeToBase64(buffer) {
  return `data:image/webp;base64,${buffer.toString('base64')}`;
}

/**
 * Compress and optimize an image
 * 
 * @param {string} base64Input - Input Base64 image string
 * @param {Object} options - Compression options
 * @param {number} options.maxWidth - Maximum width (default: 1200)
 * @param {number} options.maxHeight - Maximum height (default: 1200)
 * @param {number} options.quality - Quality 1-100 (default: 80)
 * @returns {Promise<{base64: string, originalSize: number, compressedSize: number, savings: string}>}
 */
export async function compressImage(base64Input, options = {}) {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 80,
  } = options;

  // Decode input
  const inputBuffer = decodeBase64(base64Input);
  const originalSize = inputBuffer.length;

  // Process with Sharp
  const outputBuffer = await sharp(inputBuffer)
    // Resize while maintaining aspect ratio
    .resize(maxWidth, maxHeight, {
      fit: 'inside',
      withoutEnlargement: true, // Don't upscale small images
    })
    // Auto-rotate based on EXIF data
    .rotate()
    // Convert to WebP with quality setting
    .webp({ 
      quality,
      effort: 4, // Balance between speed and compression
    })
    .toBuffer();

  const compressedSize = outputBuffer.length;
  const savings = ((1 - compressedSize / originalSize) * 100).toFixed(1);

  return {
    base64: encodeToBase64(outputBuffer),
    originalSize,
    compressedSize,
    savings: `${savings}%`,
  };
}

/**
 * Compress image using a preset configuration
 * 
 * @param {string} base64Input - Input Base64 image string
 * @param {'gallery' | 'menu' | 'thumbnail'} preset - Preset name
 * @returns {Promise<{base64: string, originalSize: number, compressedSize: number, savings: string}>}
 */
export async function compressWithPreset(base64Input, preset = 'gallery') {
  const config = IMAGE_PRESETS[preset] || IMAGE_PRESETS.gallery;
  return compressImage(base64Input, config);
}

/**
 * Validate image before processing
 * 
 * @param {string} base64String - The Base64 image string
 * @param {number} maxSizeMB - Maximum allowed size in MB
 * @returns {{valid: boolean, error?: string}}
 */
export function validateImage(base64String, maxSizeMB = 20) {
  if (!base64String || typeof base64String !== 'string') {
    return { valid: false, error: 'Invalid image data' };
  }

  if (!base64String.startsWith('data:image/')) {
    return { valid: false, error: 'Invalid image format' };
  }

  // Check allowed formats
  const formatMatch = base64String.match(/^data:image\/(\w+);base64,/);
  if (!formatMatch) {
    return { valid: false, error: 'Could not determine image format' };
  }

  const format = formatMatch[1].toLowerCase();
  const allowedFormats = ['jpeg', 'jpg', 'png', 'gif', 'webp'];
  if (!allowedFormats.includes(format)) {
    return { valid: false, error: `Invalid format: ${format}. Allowed: ${allowedFormats.join(', ')}` };
  }

  // Check size
  const base64Data = base64String.split(',')[1];
  if (base64Data) {
    const sizeBytes = (base64Data.length * 3) / 4;
    const sizeMB = sizeBytes / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      return { valid: false, error: `Image size (${sizeMB.toFixed(2)}MB) exceeds maximum (${maxSizeMB}MB)` };
    }
  }

  return { valid: true };
}

export { IMAGE_PRESETS };
