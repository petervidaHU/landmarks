import React, { FC } from 'react'
import NextImage from 'next/image';
import { Image } from "@nextui-org/react";
import { Button, ButtonGroup } from "@nextui-org/react";
import { DynamicProps } from '@/types/DataSource';

const PoiTemplate: FC<Omit<DynamicProps, 'subContent'>> = ({
    data, ownContent, ownImages,
}) => {
    console.log('oi poi', ownImages)
    console.log('oi poi', data)
    console.log('oi poi', ownContent)
    return (
        <>
            <Button color="primary" variant="bordered">
                Bordered
            </Button>
            <Button color="primary" variant="light">
                Light
            </Button>
            <Button color="primary" variant="flat">
                Flat
            </Button>
            <div>{data.name}</div>
            <div>{ownContent}</div>
            <Image as={NextImage}
                src={ownImages[0].url} alt={ownImages[0].altText.desc} width={300} height={300} />

        </>
    )
}

export default PoiTemplate;

/*
        <Image src={subContent[0].images[0].url} alt="sss" width={300} height={300} />
*/
