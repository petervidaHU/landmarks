import React, { FC } from 'react'
import Image from 'next/image';
import { DynamicProps } from '@/types/DataSource';

const PoiTemplate: FC<Omit<DynamicProps, 'subContent'>> = ({
    data, content, images, 
}) => {
    console.log('oi poi', images)
    console.log('oi poi', data)
    console.log('oi poi', content)

    return (
    <>
        <div>{data.name}</div>
        <div>{content}</div>
       
    </>
    )
}

export default PoiTemplate;

/*
 <Image src={ownImages[0].url} alt={ownImages[0].altText.desc} width={300} height={300} />
        <Image src={subContent[0].images[0].url} alt="sss" width={300} height={300} />
*/
