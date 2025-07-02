import { cn, isUrl } from "@reactive-resume/utils";

import { useArtboardStore } from "../store/artboard";

type PictureProps = {
  className?: string;
};

export const Picture = ({ className }: PictureProps) => {
  const picture = useArtboardStore((state) => state.resume.basics.picture);
  const fontSize = useArtboardStore((state) => state.resume.metadata.typography.font.size);

  console.log("🖼️ Picture component debug:", {
    url: picture.url,
    isValidUrl: isUrl(picture.url),
    hidden: picture.effects.hidden,
    size: picture.size,
    aspectRatio: picture.aspectRatio
  });

  if (!isUrl(picture.url) || picture.effects.hidden) {
    console.log("🚫 Picture not rendering - invalid URL or hidden");
    return null;
  }

  return (
    <img
      src={picture.url}
      alt="Profile"
      className={cn(
        "relative z-20 object-cover",
        picture.effects.border && "border-primary",
        picture.effects.grayscale && "grayscale",
        className,
      )}
      style={{
        maxWidth: `${picture.size}px`,
        aspectRatio: `${picture.aspectRatio}`,
        borderRadius: `${picture.borderRadius}px`,
        borderWidth: `${picture.effects.border ? fontSize / 3 : 0}px`,
      }}
      onLoad={() => console.log("✅ Picture loaded successfully:", picture.url)}
      onError={(e) => console.error("❌ Picture failed to load:", picture.url, e)}
    />
  );
};
