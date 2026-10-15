import { useState } from "react";
import {
  ArrowUpRight,
  Copy,
  Check,
  RotateCcw,
  CalendarCheck,
} from "lucide-react";
import { useDemo } from "../../context/DemoContext";
import type { Appointment } from "../../domain/appointments";
import { statusLabels } from "../../domain/appointments";
import { professionalName } from "../../data/professionals";
import { money, services } from "../../data/business";
import { displayDate } from "../../utils/booking";
export default function DemoReservationCompletion({
  appointment,
  onRestart,
}: {
  appointment: Appointment;
  onRestart: () => void;
}) {
  const { appointments } = useDemo();
  const current =
    appointments.find((a) => a.id === appointment.id) || appointment;
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");
  const service = services.find((s) => s.id === current.serviceId);
  const message = `AGENDAMENTO SIMULADO — SEM RESERVA REAL\n\nCliente fictício: ${current.customerAlias}\nProfissional: ${professionalName(current.professionalId)}\nServiço: ${service?.name}\nData: ${displayDate(current.date)}\nHorário: ${current.time}\nValor: ${money(current.price)}\nStatus simulado: ${statusLabels[current.status]}\n\nRegistro apenas nesta sessão do navegador.`;
  async function copy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
    } catch {
      setCopyError(
        "Não foi possível copiar automaticamente. Selecione a mensagem para copiar.",
      );
    }
  }
  return (
    <div className="demo-reservation-completion">
      <div className="completion-symbol">
        <CalendarCheck size={30} />
      </div>
      <p className="completion-title">AGENDAMENTO SIMULADO CONCLUÍDO</p>
      <p className="completion-copy">
        Ambiente demonstrativo. Nenhuma reserva real foi realizada. Seu exemplo
        já aparece no painel e ocupa este horário apenas durante esta sessão.
      </p>
      <span className={`status-badge status-${current.status}`}>
        {statusLabels[current.status]} · simulado
      </span>
      <dl className="reservation-receipt" id="demo-reservation-summary">
        {[
          ["Cliente fictício", current.customerAlias],
          ["Profissional", professionalName(current.professionalId)],
          ["Serviço", service?.name],
          ["Data", displayDate(current.date)],
          ["Horário", current.time],
          ["Valor divulgado", money(current.price)],
        ].map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <div className="reservation-actions">
        <a className="button primary" href="#/admin">
          VISUALIZAR PAINEL DEMONSTRATIVO
          <span>
            <ArrowUpRight size={20} />
          </span>
        </a>
        <a className="text-link" href="#demo-reservation-summary">
          VER RESUMO <ArrowUpRight size={16} />
        </a>
        <button type="button" className="back-button" onClick={onRestart}>
          <RotateCcw size={16} /> Fazer outro agendamento
        </button>
      </div>
      <details className="reservation-message">
        <summary>Mensagem do exemplo e opção de copiar</summary>
        <label className="sr-only" htmlFor="demo-receipt-message">
          Mensagem do agendamento simulado
        </label>
        <textarea id="demo-receipt-message" value={message} readOnly rows={9} />
        <button type="button" onClick={copy}>
          {copied ? <Check size={16} /> : <Copy size={16} />}{" "}
          {copied ? "Mensagem copiada" : "Copiar mensagem"}
        </button>
        <p role="status">
          {copied ? "Cópia concluída. Nenhuma reserva real." : copyError}
        </p>
      </details>
    </div>
  );
}
