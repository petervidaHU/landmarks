import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import React from 'react';
import Image from 'next/image';
import { filterImages, imageObjectBuilder } from '@/func/images';
import { filterFolders, getFolderContent } from '@/func/folders';

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

  const ownFolderContent = getFolderContent(dirPath);
  // console.log('ownfoldercontent', ownFolderContent);

  // helpers
  const getMarkDownContent = (folderContent: Array<string>) => {
    const mdFile = folderContent.filter(file => file.endsWith('.md'))[0];
    const fileContent = fs.readFileSync(path.join(
      dirPath,
      mdFile
    ), 'utf-8');

    const { data, content } = matter(fileContent);
    return { data, content };
  }

  // logic
  const ownImageFiles = filterImages(ownFolderContent);

  const childFolders = filterFolders(dirPath, ownFolderContent);
  console.log('childfolders:', childFolders)

  const { data: ownData, content: ownContent } = getMarkDownContent(ownFolderContent)
  ownData.fullSlug = fullSlug;

  const ownImageArray = await Promise.all(ownImageFiles.map(async (img) => await imageObjectBuilder(img, fullSlug, dirPath)));

  return {
    props: {
      data: ownData,
      content: ownContent,
      childContent: null,
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