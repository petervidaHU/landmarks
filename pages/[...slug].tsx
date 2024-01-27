import path from 'path';
import fs from 'fs';
import React, { FC } from 'react';
import { filterImages, imageObjectBuilder } from '@/func/images';
import { filterFolders, getFolderContent, getSubContent } from '@/func/folders';
import { getMarkDownContent } from '@/func/markdown';
import { DynamicProps, Frontmatter, ImageObject, SubContent, TypeOfEntity } from '@/types/DataSource';
import CityTemplate from '@/components/page-templates/CityTemplate';
import PoiTemplate from '@/components/page-templates/PoiTemplate';
import { getCityContent } from '@/func/cityContent';

type pathsObject = {
  paths: Array<{ params: { slug: Array<string> } }>
};

// ---- PATHS ----
const sourceFile = (fil: string) => path.join(__dirname, path.relative(__dirname, '../landmarks/source-handler'), fil);

const slugFiles = {
  cityFile: sourceFile('slugs-city.json'),
  listFile: sourceFile('slugs-list.json'),
  poiFile: sourceFile('slugs-poi.json'),
}

export async function getStaticPaths() {

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
  const ownImages = await Promise.all(ownImageFiles.map(async (img) => await imageObjectBuilder(img, fullSlug, dirPath)));


  const { data: ownData, content: ownContent } = getMarkDownContent(ownFolderContent, dirPath)
  ownData.fullSlug = fullSlug;
  const typ = ownData.type;

  let extraContent: any;

  if (typ === TypeOfEntity.city) {
    getCityContent(dirPath, fullSlug);
  }

  const subFolders = filterFolders(dirPath, ownFolderContent);
  const subContent = await getSubContent(subFolders, dirPath, fullSlug);


  return {
    props: {
      data: ownData,
      ownContent,
      subContent,
      ownImages,
    },
  };
}

const DynamicPage: FC<DynamicProps> = ({
  data, ownContent, ownImages, subContent,
}) => {
  const type: TypeOfEntity = data.type;

  if (!type) {
    throw new Error(`bad page template type: ${type}`);
  };

  const template = () => {
    switch (type) {
      case TypeOfEntity.city:
        return (
          <CityTemplate />
        )
      case TypeOfEntity.poi:
        return (
          <PoiTemplate
            data={data}
            ownContent={ownContent}
            ownImages={ownImages}
          />
        )
    }
  }

  return (
    <>{template()}</>
  )
}

export default DynamicPage;
