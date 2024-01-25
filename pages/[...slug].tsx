import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import React from 'react';
import { data } from 'autoprefixer';
import Image from 'next/image';

type pathsObject = {
  paths: Array<{ params: { slug: Array<string> } }>
};

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

export async function getStaticProps({ params }: { params: { slug: Array<string> } }) {
  const fullSlug = params.slug.join('/');
  const dirPath = path.join(
    __dirname,
    path.relative(__dirname, '../landmarks/dataSource'),
    fullSlug
  );

  const ownFolder = fs.readdirSync(dirPath);
  console.log('ditr', params.slug.join('/'));

  const ownImageFiles = ownFolder.filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);
   }).map(image => `/dataSource/${fullSlug}/${image}`);

  const ownMdFile = ownFolder.filter(file => file.endsWith('.md'))[0];

  const ownFileContent = fs.readFileSync(path.join(
    dirPath,
    ownMdFile
  ), 'utf-8');

  const { data: ownData, content: ownContent } = matter(ownFileContent);
  ownData.fullSlug = fullSlug;

  return {
    props: {
      data: ownData,
      content: ownContent,
      images: {
        own: ownImageFiles
      }
    },
  };
}


const PoiPage = ({ data, content, images }: {data: any, content: any, images: any}) => {
  console.log('data:', images);
  // console.log('content:', content);
  return (
    <>
      <div>{data.name}{content}</div>
      <Image src={images.own[0]} alt="alt" width={300} height={300}/>
    </>
  )
}

export default PoiPage;

