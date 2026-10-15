import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Brand from "./Brand";
import { navigation } from "../data/business";
export default function Header({ visible = true }: { visible?: boolean }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("inicio");
  const [scrolled, setScrolled] = useState(false);
  const header = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!visible) setOpen(false);
  }, [visible]);
  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", scroll, { passive: true });
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-20% 0px -60% 0px" },
    );
    navigation.forEach(([id]) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", scroll);
    };
  }, []);
  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        document.getElementById("menu-toggle")?.focus();
      }
      if (e.key === "Tab" && window.matchMedia("(max-width: 850px)").matches) {
        const links = Array.from(
          header.current?.querySelectorAll<HTMLElement>("a, button") || [],
        ).filter((el) => el.getClientRects().length);
        const first = links[0],
          last = links[links.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  return (
    <header
      ref={header}
      className={`header ${scrolled ? "scrolled" : ""} ${visible ? "header-visible" : "header-hidden"}`}
      inert={!visible}
      aria-hidden={!visible}
    >
      <div className="header-inner">
        <a
          href="#inicio"
          aria-label="Bad Boys, início"
          onClick={() => setOpen(false)}
        >
          <Brand />
        </a>
        <nav
          className={open ? "nav open" : "nav"}
          id="main-nav"
          aria-label="Navegação principal"
        >
          {navigation.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={active === id ? "location" : undefined}
              onClick={() => {
                setOpen(false);
                requestAnimationFrame(() => {
                  document.getElementById(id)?.focus({ preventScroll: true });
                });
              }}
            >
              {label}
            </a>
          ))}
        </nav>
        <a href="#agendamento" className="header-cta">
          AGENDAR <ArrowUpRight size={17} />
        </a>
        <button
          className="menu-toggle"
          id="menu-toggle"
          aria-expanded={open}
          aria-controls="main-nav"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
