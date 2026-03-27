/**
 * Compresses an image file before upload using an HTML5 Canvas down-scaler.
 * @param {File} file - The original image file retrieved from the input
 * @param {number} maxWidth - Maximum allowed width mapping
 * @param {number} maxHeight - Maximum allowed height mapping
 * @param {number} quality - JPEG compression quality ratio (0.0 to 1.0)
 * @returns {Promise<File>} - A Promise that resolves to the compressed File object.
 */
export const compressImage = (file, maxWidth = 1000, maxHeight = 1000, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    // 1. Ensure the file is actually an image
    if (!file.type.startsWith('image/')) {
      resolve(file); // if not an image (e.g. PDF), bypass compression
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // 2. Algorithmically constrain the dimensions keeping Aspect Ratio intact
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round(height * (maxWidth / width));
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round(width * (maxHeight / height));
            height = maxHeight;
          }
        }

        // 3. Draw the image to an invisible Virtual Canvas buffer
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // 4. Extract as optimized JPEG Data Blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas payload was empty'));
              return;
            }
            // Retain original name, replace extension internally mapping as JPEG
            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          'image/jpeg',
          quality
        );
      };
      
      img.onerror = (error) => reject(error);
    };
    
    reader.onerror = (error) => reject(error);
  });
};
