import type { SanityImage } from "@/sanity/lib/types";
import { imageUrl } from "@/sanity/lib/image";

type BlogImageProps = {
  image?: SanityImage;
  className?: string;
  width?: number;
  height?: number;
  loading?: "eager" | "lazy";
};

export function BlogImage({ image, className, width = 1200, height, loading = "lazy" }: BlogImageProps) {
  const src = imageUrl(image, width, height);
  if (!src) return <span className={`blog-image-placeholder${className ? ` ${className}` : ""}`} aria-hidden="true" />;

  const sourceWidth = image?.asset?.metadata?.dimensions?.width || width;
  const sourceHeight = image?.asset?.metadata?.dimensions?.height || height || Math.round(width * 0.625);

  return <img className={className} src={src} alt={image?.alt || ""} width={sourceWidth} height={sourceHeight} loading={loading} decoding="async" />;
}
