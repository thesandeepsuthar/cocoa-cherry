"use client";

import Image from "next/image";
import { getRandomFallbackImage } from "@/lib/constants";
import { useState } from "react";

// Client Component for handling image fallback
export function FallbackImage({
  src,
  alt,
  className = "",
  fill = false,
  width,
  height,
  priority = false,
  unoptimized = false,
  itemProp,
  useNextImage = false,
  ...props
}) {
  const [imageSrc, setImageSrc] = useState(src || getRandomFallbackImage());

  const handleError = (e) => {
    setImageSrc(getRandomFallbackImage());
  };

  // Use Next.js Image component if fill is true or useNextImage is true
  if (fill || useNextImage) {
    return (
      <Image
        src={imageSrc}
        alt={alt}
        fill={fill}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        className={className}
        onError={handleError}
        priority={priority}
        unoptimized={unoptimized}
        itemProp={itemProp}
        {...props}
      />
    );
  }

  // Use regular img tag for better compatibility
  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      onError={handleError}
      width={width}
      height={height}
      itemProp={itemProp}
      {...props}
    />
  );
}
