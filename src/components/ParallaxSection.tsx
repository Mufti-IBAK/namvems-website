import React from 'react';

interface ParallaxSectionProps {
  children: React.ReactNode;
  backgroundImageUrl: string;
  height?: string;
  overlayOpacity?: number;
  className?: string;
}

const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  backgroundImageUrl,
  height = 'h-96',
  overlayOpacity = 0.5,
  className = ''
}) => {
  return (
    <div 
      className={`relative overflow-hidden ${height} ${className} parallax-element`}
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div 
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity }}
      ></div>
      <div className="relative z-10 h-full flex items-center">
        {children}
      </div>
    </div>
  );
};

export default ParallaxSection;