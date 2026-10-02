import imageLoader from "@/sanity/imageLoader";

const WIDTHS = [480, 768, 1080, 1440, 1920];

/**
 * Responsive image for CMS (Sanity) pictures: a plain <img> with a srcset of
 * Sanity CDN sizes (AVIF/WebP picked automatically). Same result as next/image
 * with the custom loader, but it also works under `next dev --turbopack`,
 * which ignores custom image loaders. `fill` covers the positioned parent.
 */
export function CmsImage({
  src,
  alt,
  sizes,
  priority = false,
  fill = false,
  width,
  height,
  className,
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
}) {
  const srcSet = WIDTHS.map((w) => `${imageLoader({ src, width: w })} ${w}w`).join(", ");
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageLoader({ src, width: 1080 })}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={`${fill ? "absolute inset-0 h-full w-full" : ""} ${className ?? ""}`}
    />
  );
}
