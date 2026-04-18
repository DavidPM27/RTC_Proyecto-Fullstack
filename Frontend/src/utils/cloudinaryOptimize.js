/**
 * Transforms a Cloudinary URL to serve an optimized version.
 * Applies: resize, quality reduction, and WebP auto-format.
 *
 * @param {string} url — Original Cloudinary image URL
 * @param {number} options.width — Target width in pixels (default: 400)
 * @param {number} options.quality — Quality 1-100 (default: 40)
 * @returns {string} — Transformed URL, or the original if not a Cloudinary URL
 */
export const getOptimizedImageUrl = (url, { width = 400, quality = 40 } = {}) => {
  if (!url || !url.includes("res.cloudinary.com")) return url;

  // Cloudinary transformations pattern
  const transformations = `w_${width},q_${quality},f_auto,c_fill`;

  return url.replace(
    "/upload/",
    `/upload/${transformations}/`
  );
};

export const getPlaceholderUrl = (url) => {
  if (!url || !url.includes("res.cloudinary.com")) return "";

  const transformations = "w_30,q_10,f_auto,e_blur:800";

  return url.replace(
    "/upload/",
    `/upload/${transformations}/`
  );
};
