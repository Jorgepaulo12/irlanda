import { LiveSlideBackground } from "@/components/LiveSlideBackground";
import { PreloadedCoverImage } from "@/components/PreloadedCoverImage";
import { mediaUrl, type ScreenMode } from "@/lib/api";

const DEFAULT_FALLBACK = "/branding/logo-30.png";

type TelaScreenBackdropProps = {
  mode: ScreenMode;
  liveSlides: { id: number; url: string }[];
  activeMedia: { url: string; media_type: string } | null | undefined;
  fallbackSrc?: string;
};

export function TelaScreenBackdrop({
  mode,
  liveSlides,
  activeMedia,
  fallbackSrc = DEFAULT_FALLBACK,
}: TelaScreenBackdropProps) {
  const bg = activeMedia?.url ? mediaUrl(activeMedia.url) : fallbackSrc;
  const isVideo = mode !== "live" && activeMedia?.media_type === "video";

  return (
    <>
      {mode === "live" ? (
        <LiveSlideBackground slides={liveSlides} fallbackSrc={fallbackSrc} />
      ) : isVideo ? (
        <video
          src={bg}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        <PreloadedCoverImage src={bg} />
      )}
    </>
  );
}