import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';

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