import { useEffect, useRef, useState } from "react";

/** A single passive listener updates CSS; React only tracks the reveal boundary. */
export function useIntroProgress(onReveal: (visible: boolean) => void) {
  const scene = useRef<HTMLElement>(null);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let previous = -1;
    const update = () => {
      frame = 0;
      const element = scene.current;
      if (!element) return;
      const travel = element.offsetHeight - window.innerHeight;
      const scrollProgress = media.matches
        ? 1
        : Math.max(
            0,
            Math.min(
              1,
              -element.getBoundingClientRect().top / Math.max(1, travel),
            ),
          );
      const progress = Math.min(1, scrollProgress / 0.85);
      if (Math.abs(progress - previous) < 0.0001) return;
      previous = progress;
      element.style.setProperty("--reveal", String(progress));
      const aperture = progress * progress * (3 - 2 * progress);
      element.style.setProperty("--aperture", String(aperture));
      element.style.setProperty("--logo-scale", String(1.28 - progress * 0.28));
      element.style.setProperty("--crop-top", `${9 * (1 - progress)}%`);
      element.style.setProperty("--crop-bottom", `${54 * (1 - progress)}%`);
      element.style.setProperty(
        "--brand-opacity",
        String(0.7 + progress * 0.3),
      );
      element.style.setProperty(
        "--statement-opacity",
        String(Math.max(0, Math.min(1, (progress - 0.6) / 0.2))),
      );
      element.style.setProperty(
        "--fragment-opacity",
        String(Math.max(0, 1 - progress * 2)),
      );
      element.style.setProperty(
        "--construction-opacity",
        String(Math.max(0, 1 - Math.abs(progress - 0.4) / 0.35)),
      );
      onReveal(media.matches || progress >= 0.85);
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const preference = () => {
      setReduced(media.matches);
      update();
    };
    preference();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    media.addEventListener("change", preference);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      media.removeEventListener("change", preference);
    };
  }, [onReveal]);
  return { scene, reduced };
}
