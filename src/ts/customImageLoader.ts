export function loadImage(imageId: string): {
    promise: Promise<Record<string, unknown>>;
    cancelFn?: () => void;
    decache?: () => void;
  } {

    const promise = new Promise((resolve, reject) => {
        const oReq = new XMLHttpRequest();
        oReq.open('get', imageId, true);
        oReq.responseType = 'arraybuffer';

        oReq.onreadystatechange = function () {
            if (oReq.readyState === 4) {
                if (oReq.status === 200) {
                    const image = createImageObject(imageId);
                    resolve(image);
                } else {
                    reject(new Error(oReq.statusText));
                }
            }
        };

        oReq.send();
    });

    return {
        promise: promise as Promise<Record<string, unknown>>,
        cancelFn: undefined
    };
}

function createImageObject(imageId: string) {
    const width = 512;
    const height = 512;
    const numPixels = width * height;
    const pixelData = new Uint8Array(numPixels);
    const rnd = Math.round(Math.random() * 255);

    for (let i = 0; i < numPixels; i++) {
        pixelData[i] = (i % width + rnd) % 256;
    }

    const getPixelData = () => pixelData;

    return {
        imageId,
        minPixelValue: 0,
        maxPixelValue: 255,
        slope: 1.0,
        intercept: 0,
        windowCenter: 127,
        windowWidth: 256,
        getPixelData,
        // render: cornerstone.renderGrayscaleImage, // Requerido por Cornerstone
        rows: height,
        columns: width,
        height,
        width,
        color: false,
        columnPixelSpacing: 1.0,
        rowPixelSpacing: 1.0,
        invert: false,
        sizeInBytes: numPixels
    };
}
