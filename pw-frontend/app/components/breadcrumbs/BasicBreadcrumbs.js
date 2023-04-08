import React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from 'next/link';
import Typography from '@mui/material/Typography';

const BasicBreadcrumbs = ({ categoryTree, productName }) => {
  return (
    <Breadcrumbs aria-label="breadcrumb">
      <Link href="/" passHref>
        <Typography color="inherit">Home</Typography>
      </Link>
      {categoryTree.map((category, index) => (
        <Link key={index} href={`/${category.url}`} passHref>
          <Typography color="inherit">{category.name}</Typography>
        </Link>
      ))}
      {productName && <Typography color="textPrimary">{productName}</Typography>}
    </Breadcrumbs>
  );
};

export default BasicBreadcrumbs;
