type ResponsiveImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export function ResponsiveImage({
  src,
  alt,
  width,
  height,
  className,
  sizes = "100vw",
  priority = false,
}: ResponsiveImageProps) {
  const base = src.replace(/\.jpe?g$/i, "");

  return (
    <picture className={className}>
      <source
        type="image/webp"
        srcSet={`${base}-640.webp 640w, ${base}-960.webp 960w, ${base}.webp ${width}w`}
        sizes={sizes}
      />
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
      />
    </picture>
  );
}
