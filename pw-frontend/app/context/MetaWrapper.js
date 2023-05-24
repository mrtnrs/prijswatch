// components/MetaWrapper.js
import React, { useContext } from 'react';
import MetaContext from './MetaContext';

const MetaWrapper = () => {
  const { meta } = useContext(MetaContext);

  return (
    <head>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta property="og:title" content={meta.ogTitle} />
      <meta property="og:description" content={meta.ogDescription} />
      <meta property="og:image" content={meta.ogImage} />
      <meta property="og:url" content={meta.ogUrl} />
      <meta property="og:type" content={meta.ogType} />
      <meta property="og:site_name" content={meta.ogSiteName} />
      <meta property="product:price:amount" content={meta.productPriceAmount} />
      <meta property="product:price:currency" content={meta.productPriceCurrency} />
      <meta name="twitter:card" content={meta.twitterCard} />
      <meta name="twitter:title" content={meta.twitterTitle} />
      <meta name="twitter:description" content={meta.twitterDescription} />
      <meta name="twitter:site" content={meta.twitterSite} />
      <meta name="keywords" content={meta.keywords} />
    </head>
  );
};

export default MetaWrapper;
