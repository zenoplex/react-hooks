const loadImage = async (url: string): Promise<HTMLImageElement> => {
  /* eslint-disable functional/immutable-data */
  return new Promise((resolve, reject) => {
    const img = new Image();
    // eslint-disable-next-line functional/immutable-data
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      resolve(img);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    img.src = url;
  });
  /* eslint-enable functional/immutable-data */
};

const scanImage = async (url: string) => {
  const img = await loadImage(url);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not create canvas context');
  }
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, img.width, img.height);
  const pixelData = imageData.data;
  let isFullColor = false;

  for (let i = 0; i < pixelData.length; i += 4) {
    const r = pixelData[i];
    const g = pixelData[i + 1];
    const b = pixelData[i + 2];
    const a = pixelData[i + 3];

    if (a === 0) {
      // Transparent pixel
      continue;
    }

    if (r !== g || g !== b) {
      isFullColor = true;
      break;
    }
  }

  const color = isFullColor ? 'full' : 'limited';

  const resolution = img.width > img.height ? img.width : img.height;

  return { resolution, color };
};

self.addEventListener('message', async (event: MessageEvent<string>) => {
  const url = event.data;
  try {
    const data = await scanImage(url);
    self.postMessage({ type: 'success', payload: data });
  } catch (error) {
    self.postMessage({ type: 'error', payload: error });
  }
});

export {};
