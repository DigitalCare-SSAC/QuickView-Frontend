import JSZip from "jszip";

export default async function loadDicomImagesFromZip(url: string): Promise<string[]> {
    const response = await fetch(url);
    const blob = await response.blob();
    const zip = await JSZip.loadAsync(blob);
    const imageIds: string[] = [];

    for (const fileName in zip.files) {
        if (fileName.endsWith(".dcm")) {
            const fileData = await zip.file(fileName).async("blob");
            const imageId = URL.createObjectURL(fileData);
            imageIds.push(imageId);
        }
    }

    return imageIds;
}
