import { useEffect } from 'react';
import Image from 'next/image';
import Typography from '@mui/material/Typography';

// Import Swiper
import Swiper, { Navigation } from 'swiper';
import 'swiper/swiper.min.css';
Swiper.use([Navigation]);

export default function Carousel() {
  useEffect(() => {
    const carousel = new Swiper('.carousel', {
      breakpoints: {
        320: {
          slidesPerView: 1,
        },
        640: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 4,
        },
      },
      grabCursor: true,
      loop: false,
      centeredSlides: false,
      initialSlide: 0,
      spaceBetween: 24,
      watchSlidesProgress: true,
      navigation: {
        nextEl: '.carousel-next',
        prevEl: '.carousel-prev',
      },
    });
  }, []);

  // Placeholder images array
  const images = [
    { src: 'https://placehold.co/600x400' },
    { src: 'https://placehold.co/600x400' },
    { src: 'https://placehold.co/600x400' },
    { src: 'https://placehold.co/600x400' },
    { src: 'https://placehold.co/600x400' },
    { src: 'https://placehold.co/600x400' },
    { src: 'https://placehold.co/600x400' },
    { src: 'https://placehold.co/600x400' },
  ];

  return (
    <>
      <Typography className='text-gradient' variant="h4" style={{ marginTop: 50, width: '100%', marginBottom: 20, fontWeight: 600 }}>Onlangs gezakt in prijs</Typography>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          {/* Carousel built with Swiper.js [https://swiperjs.com/] */}
          {/* * Custom styles in src/css/additional-styles/theme.scss */}
          <div className="carousel swiper-container max-w-sm mx-auto sm:max-w-none ">
            <div className="swiper-wrapper">
              {/* Carousel items */}
              {images.map((image, index) => (
                <div key={index} className="swiper-slide h-auto flex flex-col">
                  {/* Image */}
                  <img className="w-full aspect-[7/4] object-cover" src={image.src} width={259} height={148} alt={`Carousel ${index + 1}`} />
                  {/* White box */}
                  <div className="grow bg-white px-4 pb-6">
                    {/* Remaining content */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
