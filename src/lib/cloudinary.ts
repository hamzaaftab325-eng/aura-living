/**
 * ============================================================================
 * Cloudinary Image Upload
 * ============================================================================
 *
 * Server-side image upload to Cloudinary. Cloudinary provides:
 * - 25 GB free storage (vs 1 GB for Vercel Blob / Supabase Storage)
 * - Automatic image optimization (WebP, AVIF, responsive sizes)
 * - CDN delivery (fast globally)
 * - No need to manage files ourselves
 *
 * SETUP:
 *   1. Create free account at https://cloudinary.com
 *   2. Get Cloud Name from dashboard
 *   3. Create an Upload Preset (Settings → Upload → Upload presets)
 *      - Set signing mode to "Unsigned" (for direct browser uploads)
 *      - Or use API key/secret for server-side signed uploads
 *   4. Set env vars:
 *      CLOUDINARY_CLOUD_NAME=your-cloud-name
 *      CLOUDINARY_API_KEY=your-api-key
 *      CLOUDINARY_API_SECRET=your-api-secret
 *      NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name (for browser uploads)
 *
 * This file uses server-side signed uploads (more secure — API secret never
 * exposed to browser).
 */

import { v2 as cloudinary } from "cloudinary";

// ----------------------------------------------------------------------------
// Configure Cloudinary (server-side only)
// ----------------------------------------------------------------------------

if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------

export interface CloudinaryUploadResult {
  publicId: string;
  url: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

// ----------------------------------------------------------------------------
// Upload from buffer (for server-side uploads from form data)
// ----------------------------------------------------------------------------

/**
 * Upload an image buffer to Cloudinary.
 *
 * @param buffer - The image file as a Buffer
 * @param folder - Cloudinary folder (e.g., "aura-living/products")
 * @param filename - Optional filename (without extension)
 * @returns Upload result with secure URL
 */
export async function uploadImageBuffer(
  buffer: Buffer,
  folder: string = "aura-living/products",
  filename?: string,
): Promise<CloudinaryUploadResult> {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error(
      "Cloudinary credentials not set. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET to .env.local",
    );
  }

  return new Promise((resolve, reject) => {
    const uploadOptions: Record<string, unknown> = {
      folder,
      resource_type: "image",
      // Auto-generate format (WebP for modern browsers)
      fetch_format: "auto",
      // Auto-quality (reduces file size without visible quality loss)
      quality: "auto",
      // Unique filename to avoid collisions
      unique_filename: true,
      overwrite: false,
    };

    if (filename) {
      uploadOptions.public_id = filename;
    }

    cloudinary.uploader
      .upload_stream(uploadOptions, (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        if (!result) {
          reject(new Error("Cloudinary returned no result"));
          return;
        }
        resolve({
          publicId: result.public_id,
          url: result.url,
          secureUrl: result.secure_url,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
        });
      })
      .end(buffer);
  });
}

// ----------------------------------------------------------------------------
// Delete image
// ----------------------------------------------------------------------------

/**
 * Delete an image from Cloudinary by its public ID.
 */
export async function deleteImage(publicId: string): Promise<void> {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    return; // No-op if not configured
  }

  await new Promise<void>((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error) => {
      if (error) reject(error);
      else resolve();
    });
  });
}

// ----------------------------------------------------------------------------
// Extract public ID from URL
// ----------------------------------------------------------------------------

/**
 * Extract the Cloudinary public ID from a URL.
 * Example: https://res.cloudinary.com/mycloud/image/upload/v123/aura-living/products/abc.jpg
 * Returns: aura-living/products/abc
 */
export function extractPublicIdFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    if (!urlObj.hostname.includes("cloudinary.com")) {
      return null;
    }
    // Path: /image/upload/v1234567890/aura-living/products/abc.jpg
    const parts = urlObj.pathname.split("/");
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return null;
    // Skip version number (v1234567890) if present
    const startIndex = parts[uploadIndex + 1]?.startsWith("v")
      ? uploadIndex + 2
      : uploadIndex + 1;
    const publicIdWithExt = parts.slice(startIndex).join("/");
    // Remove file extension
    const lastDot = publicIdWithExt.lastIndexOf(".");
    return lastDot !== -1
      ? publicIdWithExt.substring(0, lastDot)
      : publicIdWithExt;
  } catch {
    return null;
  }
}

// ----------------------------------------------------------------------------
// Check if Cloudinary is configured
// ----------------------------------------------------------------------------

export function isCloudinaryConfigured(): boolean {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}
