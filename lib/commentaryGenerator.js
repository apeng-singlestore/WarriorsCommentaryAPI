import { generateCommentaryWithGroq } from './groqClient';
import { processFrame } from './frameProcessor';

export async function generateCommentary(imageData, width, height, videoTimestamp) {
  try {
    console.log('Generating commentary for frame:', width, 'x', height, 'at timestamp:', videoTimestamp);
    console.log('Image data type:', typeof imageData);
    console.log('Image data length:', imageData ? imageData.length : 'N/A');

    if (!imageData) {
      throw new Error('No image data provided');
    }

    const { encodedImage } = await processFrame(imageData, width, height);
    console.log('Encoded image length:', encodedImage.length);
    
    try {
      const { commentary, embedding } = await generateCommentaryWithGroq(encodedImage, videoTimestamp);
      console.log('Generated commentary:', commentary);
      console.log('Generated embedding:', embedding);
      return {
        timestamp: new Date().toISOString(),
        text: commentary,
        embedding: embedding,
        videoTimestamp: videoTimestamp,
      };
    } catch (groqError) {
      console.error('Error in generateCommentaryWithGroq:', groqError);
      return {
        timestamp: new Date().toISOString(),
        text: 'Error generating commentary with Groq API.',
        embedding: null,
        videoTimestamp: videoTimestamp,
      };
    }
  } catch (error) {
    console.error('Error in generateCommentary:', error);
    return {
      timestamp: new Date().toISOString(),
      text: 'Error processing frame or generating commentary.',
      embedding: null,
      videoTimestamp: videoTimestamp,
    };
  }
}
