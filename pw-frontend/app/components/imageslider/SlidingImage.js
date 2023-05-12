import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { styled, keyframes } from '@mui/system';
import ProductCard from '@/components/imageslider/ProductCard';
import Image from 'next/image';

const fadeInOut = keyframes`
  0% {
    opacity: 0;
    transform: scale(1.1) translateX(5%);
  }
  8.3% {
    opacity: 1;
    transform: scale(1) translateX(0%);
  }
  16.6% {
    opacity: 1;
    transform: scale(1) translateX(0%);
  }
  24.9% {
    opacity: 0;
    transform: scale(1.1) translateX(-5%);
  }
  100% {
    opacity: 0;
  }
`;


const SlidingImage = styled('div')(({ theme, animationDelay }) => ({
  position: 'absolute',
  width: '100%',
  willChange: 'transform',
  height: '100%',
  borderRadius: theme.shape.borderRadius,
  opacity: 0,
  transform: 'translateZ(0)',
  animation: `${fadeInOut} 19.8s ${animationDelay}s linear infinite`,
}));

const SlidingImages = () => {
  const images = [
    '/Slider/camera-right.png',
    '/Slider/clock-left.png',
    '/Slider/fan-right.webp',
    '/Slider/imac-left.png',
    '/Slider/macbook-left.png',
    '/Slider/phone-right.png',
  ];

  const cardContent = [
    '-50%',
    '-6%',
    '+5%',
    '-6%',
    '+10%',
    '-8%',
  ];

  const [isLoaded, setIsLoaded] = useState(false);

  const onLastImageLoad = () => {
    setIsLoaded(true);
    console.log('Last image probably loaded');
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: { xs: '100%', md: '27rem'},
        height: { xs: '20rem', md: '33rem'},
        borderRadius: 1,
        overflow: 'hidden',
        margin: '0 auto',
        height: '100%',
        paddingLeft: '4%',
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 1s',
        scale: { xs: '1', md: '1'},

      }}
    >
      {images.map((image, index) => {
        const animationDelay = index * 3.3; // 3.3 seconds delay for each image

        return (
          <SlidingImage key={image} animationDelay={animationDelay}>
            <Image
              src={image}
              alt={`Sliding image ${index}`}
              layout="fill"
              objectFit="cover"
              onLoad={index === images.length - 1 ? onLastImageLoad : null}
            />
          </SlidingImage>
        );
      })}
      {isLoaded && <ProductCard cardContent={cardContent} />}
    </Box>
  );
};

export default SlidingImages;
