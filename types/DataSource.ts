export enum TypeOfEntity {
    city = 'city',
    poi = 'poi',
};

export type CoordinatesType = [number, number];

export interface Frontmatter {
    country: string,
    type: TypeOfEntity,
    id: string,
    name: string,
    population: number,
    coordinates: CoordinatesType,
    county: string,
    slug: string,
    excerpt?: string,
    poiList?: Array<string>
};

export interface ImageObject {
    url: string,
    altText: {
        desc: string,
        caption: string,
    },
}

export interface SubContent {
    data: Frontmatter,
    content: string,
    images: Array<ImageObject>,
}

export interface DynamicProps {
    data: Frontmatter,
    ownContent: string,
    ownImages: Array<ImageObject>,
    subContent: Array<SubContent>
  }