import React from 'react';
import { styled, keyframes } from '@mui/system';

const cardPositions = [
  { top: '30%', left: '35%' },
  { top: '60%', left: '60%' },
  { top: '30%', left: '60%' },
  { top: '30%', right: '10%' },
  { top: '40%', right: '10%' },
  { top: '60%', right: '17%' },
];

const cardKeyframes = cardPositions.map((position, index) => {
  const animationStart = index * 16.6667;
  const animationMid = animationStart + 8.3;
  const animationEnd = animationStart + 16.6667;

  return keyframes`
    0%, ${animationStart}%, 100% {
      opacity: 0;
      transform: rotateX(-90deg);
      top: ${position.top};
      left: ${position.left};
      right: ${position.right};
    }
    ${animationMid - 1.5}%, ${animationMid + 5.5}% {
      opacity: 1;
      transform: rotateX(0deg);
      top: ${position.top};
      left: ${position.left};
      right: ${position.right};
    }
    ${animationEnd - 1.8}% {
      opacity: 0;
      transform: rotateX(-90deg);
      top: ${position.top};
      left: ${position.left};
      right: ${position.right};
    }
  `;
});





const Card = styled('div')(({ theme, content }) => ({
  position: 'absolute',
  width: '5rem',
  willChange: 'transform',
  height: '5rem',
  borderRadius: theme.shape.borderRadius,
  background: 'rgba(255, 255, 255, 0.1)',
  boxShadow: '0 25px 45px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.5)',
  borderRight: '1px solid rgba(255, 255, 255, 0.2)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(5px)',
  borderRadius: '10px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(2),
  flexDirection: 'column',
  fontWeight: 900,
  animation: `${cardKeyframes[content]} 19.8s linear infinite`,
}));

const ProductCard = ({ cardContent }) => {
  return cardContent.map((content, index) => (
    <Card key={index} content={index}>
      {content}
    </Card>
  ));
};

export default ProductCard;
