import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import React from 'react';
import ExifReader from 'exifreader';
import Image from 'next/image';

type pathsObject = {
  paths: Array<{ params: { slug: Array<string> } }>
};

// ---- PATHS ----

const sourceFile = (fil: string) => path.join(__dirname, path.relative(__dirname, '../landmarks/source-handler'), fil);

export async function getStaticPaths() {
  const slugFiles = {
    cityFile: sourceFile('slugs-city.json'),
    listFile: sourceFile('slugs-list.json'),
    poiFile: sourceFile('slugs-poi.json'),
  }

  const slugsData = Object.values(slugFiles).reduce((acc: Array<pathsObject>, curr) => [
    ...acc,
    ...JSON.parse(fs.readFileSync(curr, 'utf-8'))
  ], [])

  return {
    paths: slugsData,
    fallback: false,
  };
}

// ---- PROPS ---- 

export async function getStaticProps({ params }: { params: { slug: Array<string> } }) {
  // base variables
  const fullSlug = params.slug.join('/');
  const dirPath = path.join(
    __dirname,
    path.relative(__dirname, '../landmarks/dataSource'),
    fullSlug
  );
  const ownFolderContent = fs.readdirSync(dirPath);

  // helpers
  const getImagesFrom = (folder: Array<string>) => folder.filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);
  });

  const getImagesWithSlug = (img: string) => `/dataSource/${fullSlug}/${img}`

  const getImageExif = async (img: string) => {
    const tags: any = await ExifReader.load(`${dirPath}/${img}`);

    return {
      desc: tags['ImageDescription']?.value[0],
      caption: tags['Caption/Abstract']?.value.map((byte: number) => String.fromCharCode(byte)).join(''),
    };
  };

  const getMarkDownContent = (folderContent: Array<string>) => {
    const ownMdFile = folderContent.filter(file => file.endsWith('.md'))[0];
    const ownFileContent = fs.readFileSync(path.join(
      dirPath,
      ownMdFile
    ), 'utf-8');

    const { data, content } = matter(ownFileContent);
    return { data, content };
  }

  const imageObjectBuilder = async (img: string) => {
    const { desc, caption } = await getImageExif(img);

    return {
      url: getImagesWithSlug(img),
      altText: { desc, caption },
    }
  }

  // logic
  const ownImageFiles = getImagesFrom(ownFolderContent);

  const { data: ownData, content: ownContent } = getMarkDownContent(ownFolderContent)
  ownData.fullSlug = fullSlug;

  const ownImageArray = await Promise.all(ownImageFiles.map( async (img) => await imageObjectBuilder(img)));

  return {
    props: {
      data: ownData,
      content: ownContent,
      images: {
        own: ownImageArray,
      }
    },
  };
}


const PoiPage = ({ data, content, images }: { data: any, content: any, images: any }) => {
  console.log('data:', images);
  // console.log('content:', content);
  return (
    <>
      <div>{data.name}{content}</div>
<Image src={images.own[0].url} alt={images.own[0].altText.desc} width={300} height={300} />
    </>
  )
}

export default PoiPage;
/*
*/