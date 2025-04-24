import JSZip from "jszip";

export default async function loadDicomImagesFromZip(url: string): Promise<string[]> {
    const response = await fetch(url);
    const blob = await response.blob();
    const zip = await JSZip.loadAsync(blob);
    const imageIds: string[] = [];

    for (const fileName in zip.files) {
        if (!fileName) {
            throw new Error("File name is empty or undefined");
        }
        if (!fileName.endsWith(".dcm")) {
            throw new Error(`File ${fileName} is not a DICOM file`);
        }
        const file = zip.file(fileName);
        if (!file) {
            throw new Error(`File ${fileName} not found in the zip archive`);
        }
        const fileData = await file.async("blob");
        const imageId = URL.createObjectURL(fileData);
        imageIds.push(imageId);
    }

    return imageIds;
}
