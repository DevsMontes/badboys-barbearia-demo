import { useEffect, useRef, useState } from "react";
import { Check, Copy, X } from "lucide-react";
import { whatsappNumber } from "../data/business";
import { whatsappLink } from "../utils/booking";
const message =
  "Olá, Bad Boys! Gostaria de saber mais sobre os serviços e o atendimento. Mensagem de exemplo da demonstração.";
function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="27"
      height="27"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.52 3.48A11.9 11.9 0 0 0 12.04 0C5.43 0 .05 5.38.05 12c0 2.11.55 4.17 1.6 5.99L0 24l6.15-1.61A11.96 11.96 0 0 0 12.04 24C18.65 24 24 18.62 24 12c0-3.21-1.24-6.22-3.48-8.52zM12.04 22a9.91 9.91 0 0 1-5.04-1.38l-.36-.21-3.65.96.97-3.56-.24-.37A9.95 9.95 0 0 1 2.05 12C2.05 6.49 6.53 2 12.04 2a9.9 9.9 0 0 1 7.07 2.93A9.93 9.93 0 0 1 22 12c0 5.51-4.46 10-9.96 10zm5.49-7.48c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.8-1.49-1.78-1.67-2.08-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.49.71.31 1.27.49 1.7.62.71.22 1.36.19 1.87.11.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35z" />
    </svg>
  );
}
export default function WhatsAppContact({
  enabled = true,
}: {
  enabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const wa = whatsappLink(whatsappNumber, message);
  const [overBooking, setOverBooking] = useState(false);
  useEffect(() => {
    const section = document.getElementById("agendamento");
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setOverBooking(entry.isIntersecting);
        if (entry.isIntersecting) setOpen(false);
      },
      { rootMargin: "-120px 0px -80px 0px" },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!open) return;
    root.current
      ?.querySelector<HTMLElement>(".contact-popover button")
      ?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    const outside = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", key);
    window.addEventListener("pointerdown", outside);
    return () => {
      window.removeEventListener("keydown", key);
      window.removeEventListener("pointerdown", outside);
    };
  }, [open]);
  async function copy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setError("");
    } catch {
      setError("Selecione a mensagem abaixo para copiar manualmente.");
    }
  }
  if (!enabled || overBooking) return null;
  return (
    <div className="whatsapp-contact" ref={root}>
      {open && (
        <section
          className="contact-popover"
          aria-labelledby="contact-popover-title"
        >
          <div className="contact-popover-top">
            <span>CONTATO · DEMONSTRAÇÃO</span>
            <button
              onClick={() => {
                setOpen(false);
                trigger.current?.focus();
              }}
              aria-label="Fechar contato"
            >
              <X size={18} />
            </button>
          </div>
          <h2 id="contact-popover-title">Fale com a Bad Boys</h2>
          <p>
            O WhatsApp comercial ainda será configurado. Esta mensagem é um
            exemplo e não será enviada automaticamente.
          </p>
          <label htmlFor="contact-example" className="sr-only">
            Mensagem de exemplo para contato
          </label>
          <textarea id="contact-example" value={message} readOnly rows={4} />
          <button className="contact-copy" onClick={copy}>
            {copied ? <Check size={17} /> : <Copy size={17} />}{" "}
            {copied ? "MENSAGEM COPIADA" : "COPIAR MENSAGEM"}
          </button>
          <p role="status">
            {copied ? "Copiada. Nenhuma mensagem foi enviada." : error}
          </p>
        </section>
      )}
      {wa ? (
        <a
          className="whatsapp-trigger"
          href={wa}
          target="_blank"
          rel="noreferrer"
          aria-label="Abrir WhatsApp da Bad Boys"
        >
          <WhatsAppIcon />
        </a>
      ) : (
        <button
          ref={trigger}
          className="whatsapp-trigger"
          aria-label="Abrir contato demonstrativo do WhatsApp"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <WhatsAppIcon />
          <span>DEMO</span>
        </button>
      )}
    </div>
  );
}
