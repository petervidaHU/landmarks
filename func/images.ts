import path from "node:path";
import ExifReader from 'exifreader';

const getImageExif = async (img: string, dirPath: string) => {
    const tags: any = await ExifReader.load(`${dirPath}/${img}`);

    return {
        desc: tags['ImageDescription']?.value[0],
        caption: tags['Caption/Abstract']?.value.map((byte: number) => String.fromCharCode(byte)).join(''),
    };
};

export const filterImages = (folder: Array<string>) => folder.filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);
});

export const imageObjectBuilder = async (img: string, slug: string, imagePath: string) => {
    const { desc = null, caption = null } = await getImageExif(img, imagePath);

    return {
        url: `/dataSource/${slug}/${img}`,
        altText: { desc, caption },
    }
}