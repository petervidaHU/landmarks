import path from 'path';
import fs from 'fs';
import { getMarkDownContent } from './markdown';
import { filterImages, imageObjectBuilder } from './images';

export const getFolderContent = (folderPath: string): Array<string> => {
    try {
        const content = fs.readdirSync(folderPath);

        return content;
    } catch (error) {
        console.error(`Error reading folder content: ${error}`);
        throw new Error(error as any);
    }
}

export const filterFolders = (dirPath: string, folderContent: Array<string>): Array<string> => {
    try {
        const folders = folderContent.filter(item => {
            const isDirectory = fs.statSync(path.join(dirPath, item)).isDirectory();
            return isDirectory;
        });

        return folders;
    } catch (error) {
        console.error(`Error filtering folders: ${error}`);
        throw new Error(error as any);
    }
}

export const getSubContent = async (folders: Array<string>, dirPath: string, parentFullSlug: string) => await Promise.all(
    folders.map(async (folder) => {
        const subFolderPath = `${dirPath}/${folder}`;
        const publicFullslug = `${parentFullSlug}/${folder}`;
        
        const thisContent = getFolderContent(subFolderPath);

        const thisMd = getMarkDownContent(thisContent, subFolderPath);
        thisMd.data.fullSlug = publicFullslug;

        const thisImages = filterImages(thisContent);
        const imageObject = await Promise.all(thisImages
            .map(async (image) => await imageObjectBuilder(image, publicFullslug, subFolderPath)));

        return {
            data: thisMd.data,
            content: thisMd.content,
            images: imageObject,
        };
    }));