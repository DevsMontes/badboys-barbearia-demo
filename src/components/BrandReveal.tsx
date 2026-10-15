import { asset } from "../data/business";
import { useEffect, useRef } from "react";
import { heroArt, heroDesktopMedia } from "../data/heroArt";
export default function BrandReveal() {
  const frame = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const container = frame.current,
      img = image.current;
    if (!container || !img) return;
    const media = window.matchMedia(heroDesktopMedia);
    const fit = () => {
      const { width: w, height: h } = container.getBoundingClientRect();
      if (!w || !h) return;
      const art = media.matches ? heroArt.desktop : heroArt.mobile;
      container.style.setProperty(
        "--hero-backdrop",
        `url("${asset(`editorial/badboys-hero-${media.matches ? "desktop" : "mobile"}.webp`)}")`,
      );
      const clamp = (n: number, a: number, b: number) =>
        Math.max(a, Math.min(n, b));
      const placement = (scale: number) => {
        const freeX = w - art.width * scale,
          freeY = h - art.height * scale;
        const x = clamp(
          w / 2 - art.focal[0] * scale,
          Math.min(0, freeX),
          Math.max(0, freeX),
        );
        const y = clamp(
          h / 2 - art.focal[1] * scale,
          Math.min(0, freeY),
          Math.max(0, freeY),
        );
        return {
          x,
          y,
          px: Math.abs(freeX) < 0.01 ? 50 : (x / freeX) * 100,
          py: Math.abs(freeY) < 0.01 ? 50 : (y / freeY) * 100,
          logo: art.logo.map((v, i) => v * scale + (i % 2 === 0 ? x : y)),
        };
      };
      const cover = Math.max(w / art.width, h / art.height);
      let p = placement(cover);
      // Protect the entire logo from the header, footer and narrow/extreme viewports.
      const side = Math.min(16, w * 0.02),
        top = Math.min(98, h * 0.2),
        bottom = Math.min(78, h * 0.16);
      const coverSafe =
        p.logo[0] >= side &&
        p.logo[1] >= top &&
        p.logo[2] <= w - side &&
        p.logo[3] <= h - bottom;
      if (!coverSafe) {
        const scale = Math.min(
          cover,
          (w - side * 2) / (art.logo[2] - art.logo[0]),
          (h - top - bottom) / (art.logo[3] - art.logo[1]),
        );
        p = placement(scale);
        p.x = clamp(
          p.x,
          side - art.logo[0] * scale,
          w - side - art.logo[2] * scale,
        );
        p.y = clamp(
          p.y,
          top - art.logo[1] * scale,
          h - bottom - art.logo[3] * scale,
        );
        p.logo = art.logo.map((v, i) => v * scale + (i % 2 === 0 ? p.x : p.y));
        Object.assign(img.style, {
          position: "absolute",
          width: `${art.width * scale}px`,
          height: `${art.height * scale}px`,
          left: `${p.x}px`,
          top: `${p.y}px`,
        });
      } else
        Object.assign(img.style, {
          position: "static",
          width: "100%",
          height: "100%",
          left: "",
          top: "",
        });
      img.style.objectFit = coverSafe ? "cover" : "contain";
      img.style.objectPosition = coverSafe ? `${p.px}% ${p.py}%` : "50% 50%";
      container.dataset.fit = coverSafe ? "cover" : "contain";
      container.dataset.art = media.matches ? "desktop" : "mobile";
      container.dataset.logoBounds = JSON.stringify(p.logo);
    };
    fit();
    const observer =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(fit) : null;
    observer?.observe(container);
    media.addEventListener("change", fit);
    window.addEventListener("resize", fit);
    return () => {
      observer?.disconnect();
      media.removeEventListener("change", fit);
      window.removeEventListener("resize", fit);
    };
  }, []);
  return (
    <div className="brand-reveal responsive-hero" ref={frame}>
      <div className="reveal-register register-left" aria-hidden="true" />
      <div className="reveal-register register-right" aria-hidden="true" />
      <picture>
        <source
          media={heroDesktopMedia}
          srcSet={asset("editorial/badboys-hero-desktop.webp")}
          width="1169"
          height="654"
        />
        <img
          ref={image}
          className="reveal-logo"
          src={asset("editorial/badboys-hero-mobile.webp")}
          width="419"
          height="889"
          alt="Arte oficial da Bad Boys Barbearia, com logomarca vermelha, instrumentos e iluminação vermelha sobre fundo preto"
          fetchPriority="high"
        />
      </picture>
      <div className="hero-shutter hero-shutter-top" aria-hidden="true" />
      <div className="hero-shutter hero-shutter-bottom" aria-hidden="true" />
      <div className="construction-line" aria-hidden="true" />
    </div>
  );
}
