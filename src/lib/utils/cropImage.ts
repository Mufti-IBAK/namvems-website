// src/lib/utils/cropImage.ts
export type CropArea = { x: number; y: number; width: number; height: number }

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

export async function getCroppedImageBlob(
  imageSrc: string,
  crop: CropArea,
  outWidth = 1600,
  outHeight = 900,
  mimeType: 'image/jpeg' | 'image/png' = 'image/jpeg',
  quality = 0.9
): Promise<Blob> {
  const image = await loadImage(imageSrc)

  const canvas = document.createElement('canvas')
  canvas.width = outWidth
  canvas.height = outHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D context not available')

  // Draw cropped region scaled to the output canvas
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    outWidth,
    outHeight
  )

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error('Canvas toBlob produced null'))
      resolve(blob)
    }, mimeType, quality)
  })
}

