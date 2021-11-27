import React from 'react';
import {NextSeo} from "next-seo";

const BICHE_LOGO = 'https://firebasestorage.googleapis.com/v0/b/biche-designs.appspot.com/o/images%2Fbiche-designs.png?alt=media&token=48305783-6af7-4bc6-bdd9-bea3b5f8a40d';

function SeoTags({title, description = "", imageUrl = BICHE_LOGO}) {
    return(
        <NextSeo
            title={`${title} - BICHE Designs`}
            description={description}
            canonical="https://www.canonical.ie/"
            openGraph={{
                url: 'https://www.bichedesigns.com',
                title,
                description,
                images: [
                    {
                        url: imageUrl,
                        width: 800,
                        height: 600,
                        alt: 'biche designs',
                    }
                ],
                site_name: 'Biche Designs',
            }}
        />
    )
}

export default SeoTags;
