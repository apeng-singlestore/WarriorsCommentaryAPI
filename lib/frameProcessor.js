import sharp from 'sharp';

export async function processFrame(imageData, width, height) {
  try {
    console.log("Processing frame:", width, "x", height);

    let buffer;
    if (typeof imageData === 'string') {
      // If imageData is a base64 string, remove the prefix and convert to buffer
      const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
      buffer = Buffer.from(base64Data, 'base64');
    } else if (Buffer.isBuffer(imageData)) {
      // If imageData is already a Buffer, use it directly
      buffer = imageData;
    } else {
      throw new Error('Invalid imageData format');
    }

    // Compress the image using sharp
    const compressedImage = await sharp(buffer)
      .resize({ width: 640, height: 360, fit: 'inside' })
      .jpeg({ quality: 80 })
      .toBuffer();

    const encodedImage = `data:image/jpeg;base64,${compressedImage.toString('base64')}`;
    console.log("Image compressed, new size:", encodedImage.length);

    // Generate a simple frame description
    const frameDescription = `Frame size ${width}x${height}`;
    console.log("Generated frame description:", frameDescription);

    return { frameDescription, encodedImage };
  } catch (error) {
    console.error("Error in processFrame:", error);
    throw error;
  }
}
