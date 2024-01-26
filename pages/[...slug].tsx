import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import React from 'react';
import Image from 'next/image';
import { filterImages, imageObjectBuilder } from '@/func/images';
import { filterFolders, getFolderContent, getSubContent } from '@/func/folders';
import { getMarkDownContent } from '@/func/markdown';
import { Frontmatter, ImageObject, SubContent } from '@/types/DataSource';

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

  // logic
  const ownImageFiles = filterImages(ownFolderContent);

  const subFolders = filterFolders(dirPath, ownFolderContent);

  const { data: ownData, content: ownContent } = getMarkDownContent(ownFolderContent, dirPath)
  ownData.fullSlug = fullSlug;

  const subContent = await getSubContent(subFolders, dirPath, fullSlug);

  const ownImages = await Promise.all(ownImageFiles.map(async (img) => await imageObjectBuilder(img, fullSlug, dirPath)));

  return {
    props: {
      data: ownData,
      ownContent,
      subContent,
      ownImages,
    },
  };
}


const PoiPage = (
  { data, ownContent, ownImages, subContent }:
    { data: Frontmatter, ownContent: string, ownImages: Array<ImageObject>, subContent: Array<SubContent> }
) => {
  console.log('data:', ownImages);
  console.log('subcontent:', subContent);
  return (
    <>
      <div>{data.name}{ownContent}</div>
      <Image src={ownImages[0].url} alt={ownImages[0].altText.desc} width={300} height={300} />
      <Image src={subContent[0].images[0].url} alt="sss" width={300} height={300} />
    </>
  )
}

export default PoiPage;
/*
*/