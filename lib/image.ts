export async function LoadImage(path: string): Promise<File> {
    const response: Response = await fetch(path);
    const blob: Blob = await response.blob();
    const splitPath: string[] = path.split('/');
    const imageName: string = splitPath.pop() as string;
    const file: File = new File([blob], imageName, {type: blob.type});

    return file;
}

export async function ImagePath2Base64(path: string): Promise<string> {
    return await Image2Base64(await LoadImage(path));
}

export async function Image2Base64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const fileReader: FileReader = new FileReader();

        fileReader.onload = () => {
            const result: string | ArrayBuffer | null = fileReader.result;

            if (typeof result === 'string') {
                //console.log(result);
                resolve(result);
            }
            else {
                reject('Fail to parse file to Base64.');
            }
        };

        fileReader.onerror = () => {
            reject('File reader error.');
        };

        fileReader.readAsDataURL(file);
    });
}

export async function Images2Base64s(files: FileList | null): Promise<string[]> {
    const base64s: Promise<string>[] = [];

    if (files !== null && files.length > 0) {
        for (let fileIndex: number = 0; fileIndex < files.length; fileIndex++) {
            base64s.push(Image2Base64(files.item(fileIndex) as File));
        }
    }

    return await Promise.all(base64s);
}

export async function IsValidImage(base64: string): Promise<boolean> {
    const image = new Image();

    return new Promise((resolve) => {
        image.onload = () => {resolve(true);};
        image.onerror = () => {resolve(false);};
        image.src = base64;
    });
}
/**
 * Resize + JPEG-compress an image in the browser before it goes anywhere
 * near Firestore (documents cap at ~1 MB). Returns a data-URL.
 */
export async function compressImage(file: File, maxDim = 1024, quality = 0.7): Promise<string> {
    const dataUrl = await Image2Base64(file);

    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
            const canvas = document.createElement('canvas');
            canvas.width = Math.round(img.width * scale);
            canvas.height = Math.round(img.height * scale);
            const ctx = canvas.getContext('2d');
            if (!ctx) return reject(new Error('Canvas unavailable.'));
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = () => reject(new Error('Could not load image.'));
        img.src = dataUrl;
    });
}
