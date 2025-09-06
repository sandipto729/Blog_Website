import * as nsfwjs from 'nsfwjs';

let model = null;

async function loadModel() {
  if (!model) {
    model = await nsfwjs.load();
  }
  return model;
}

async function isNSFWImage(imageElement) {
  try {
    const loadedModel = await loadModel();
    const predictions = await loadedModel.classify(imageElement);
    
    // Check if any prediction is NSFW (e.g., 'Porn', 'Hentai', 'Sexy')
    const nsfwClasses = ['Porn', 'Hentai', 'Sexy'];
    const isNSFW = predictions.some(pred => 
      nsfwClasses.includes(pred.className) && pred.probability > 0.8
    );
    
    console.log('NSFW Predictions:', predictions);
    return isNSFW;
  } catch (error) {
    console.error('NSFW detection error:', error);
    return false; // Allow image if detection fails
  }
}

export { isNSFWImage, loadModel };