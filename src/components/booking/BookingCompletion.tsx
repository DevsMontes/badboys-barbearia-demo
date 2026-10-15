import {
  ArrowUpRight,
  Check,
  Copy,
  RotateCcw,
  ArrowLeft,
  FlaskConical,
} from "lucide-react";
import type { BookingMode } from "./BookingDemoMode";
export default function BookingCompletion({
  mode,
  message,
  wa,
  copied,
  onCopy,
  onRestart,
  onEdit,
  validate,
}: {
  mode: BookingMode;
  message: string;
  wa: string | null;
  copied: boolean;
  onCopy: () => void;
  onRestart: () => void;
  onEdit: () => void;
  validate: () => boolean;
}) {
  return (
    <div className="booking-completion">
      <div className="completion-symbol">
        {mode === "demo" ? (
          <FlaskConical size={30} strokeWidth={1.5} />
        ) : (
          <ArrowUpRight size={30} />
        )}
      </div>
      <p className="completion-title">
        {mode === "demo" ? "SIMULAÇÃO CONCLUÍDA." : "SUA MENSAGEM ESTÁ PRONTA."}
      </p>
      <p className="completion-copy">
        {mode === "demo"
          ? "Você experimentou o fluxo completo. Nenhum dado foi enviado e nenhum horário foi reservado."
          : "Sua solicitação ainda não foi enviada. A confirmação do atendimento depende da barbearia."}
      </p>
      {mode === "client" && !wa && (
        <p className="notice">
          O contato oficial do WhatsApp ainda não foi configurado. Você pode
          copiar a mensagem da solicitação.
        </p>
      )}
      <label className="message-label" htmlFor="booking-message">
        {mode === "demo"
          ? "Mensagem de demonstração"
          : "Mensagem da solicitação"}
      </label>
      <textarea
        id="booking-message"
        className="message"
        value={message}
        readOnly
        rows={11}
      />
      <div className="completion-buttons">
        {mode === "client" && wa && (
          <a
            className="button primary"
            href={wa}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => {
              if (!validate()) e.preventDefault();
            }}
          >
            SOLICITAR PELO WHATSAPP
            <span>
              <ArrowUpRight />
            </span>
          </a>
        )}
        <button
          className={`button ${mode === "demo" || !wa ? "primary" : "secondary"}`}
          type="button"
          onClick={onCopy}
        >
          {copied ? "MENSAGEM COPIADA" : "COPIAR MENSAGEM"}
          <span>{copied ? <Check /> : <Copy />}</span>
        </button>
      </div>
      <p role="status" className="copy-status">
        {copied ? "Mensagem copiada. Nenhuma reserva foi confirmada." : ""}
      </p>
      <div className="completion-links">
        <button type="button" onClick={onEdit}>
          <ArrowLeft size={16} /> Revisar escolhas
        </button>
        <button type="button" onClick={onRestart}>
          <RotateCcw size={16} />
          {mode === "demo" ? "Reiniciar demonstração" : "Nova solicitação"}
        </button>
      </div>
    </div>
  );
}
