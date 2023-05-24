'use client'
import Metadata from 'next/head';

function MetaWrapper({title, description}){


	// return children;
	return  <Metadata title={title} description={description} />
}

export default MetaWrapper;


                  