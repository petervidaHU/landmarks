import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import { getFolderContent } from './folders';

export const getMarkDownContent = (folderContent: Array<string>, dirPath: string) => {
    const mdFile = folderContent.filter(file => file.endsWith('.md'))[0];
    const fileContent = fs.readFileSync(path.join(
        dirPath,
        mdFile
    ), 'utf-8');

    const { data, content } = matter(fileContent);
    return { data, content };
}
