import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import React from 'react';

type pathsObject = {
  paths: Array<{ params: { slug: Array<string>} }>
}

export async function getStaticPaths() {
  const slugFiles = {
    cityFile: path.join(__dirname, path.relative(__dirname, '../landmarks/source-handler'), 'slugs-city.json'),
    listFile: path.join(__dirname, path.relative(__dirname, '../landmarks/source-handler'), 'slugs-list.json'),
    poiFile: path.join(__dirname, path.relative(__dirname, '../landmarks/source-handler'), 'slugs-poi.json'),
  }

  const slugsData = Object.values(slugFiles).reduce((acc: Array<pathsObject>, curr) => {
    const t = [...acc, ...JSON.parse(fs.readFileSync(curr, 'utf-8'))]
    return t;
  }, [])

  return {
    paths: slugsData,
    fallback: false,
  };
}

export async function getStaticProps({ params }: {params: { slug: Array<string>}}) {
  const dirPath = path.join(__dirname, path.relative(__dirname, '../landmarks/dataSource'), params.slug.join('/'));
  const mdFile = fs.readdirSync(dirPath).filter(file => file.endsWith('.md'))[0];
  const fileContent = fs.readFileSync( path.join(dirPath, mdFile), 'utf-8');

  const { data, content } = matter(fileContent);

  return {
    props: {
      data,
      content,
    },
  };
}


const PoiPage = ({ data, content }) => {
  console.log('data:', data);
  console.log('content:', content);
  return (
    <div>{data.name}{content}</div>
  )
}

export default PoiPage;

