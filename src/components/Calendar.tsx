import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { displayDate, localDay } from "../utils/booking";
export default function Calendar({
  value,
  onChange,
}: {
  value: string;
  onChange: (date: string) => void;
}) {
  const today = localDay();
  const [month, setMonth] = useState((value || today).slice(0, 7));
  const [year, m] = month.split("-").map(Number);
  const count = new Date(year, m, 0).getDate();
  const offset = new Date(year, m - 1, 1).getDay();
  function move(delta: number) {
    const date = new Date(year, m - 1 + delta, 1);
    setMonth(
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
    );
  }
  const title = new Date(`${month}-15T12:00:00-03:00`).toLocaleDateString(
    "pt-BR",
    { month: "long", year: "numeric", timeZone: "America/Sao_Paulo" },
  );
  return (
    <div className="calendar">
      <div className="calendar-heading">
        <button
          type="button"
          onClick={() => move(-1)}
          disabled={month <= today.slice(0, 7)}
          aria-label="Mês anterior"
        >
          <ChevronLeft size={19} />
        </button>
        <strong aria-live="polite">{title}</strong>
        <button type="button" onClick={() => move(1)} aria-label="Próximo mês">
          <ChevronRight size={19} />
        </button>
      </div>
      <div className="calendar-grid">
        <div className="weekdays" aria-hidden="true">
          {["D", "S", "T", "Q", "Q", "S", "S"].map((day, i) => (
            <span key={i}>{day}</span>
          ))}
        </div>
        {Array.from({ length: offset }, (_, i) => (
          <span key={`empty${i}`} aria-hidden="true" />
        ))}
        {Array.from({ length: count }, (_, i) => {
          const date = `${month}-${String(i + 1).padStart(2, "0")}`;
          return (
            <button
              key={date}
              type="button"
              disabled={date < today}
              aria-pressed={value === date}
              aria-label={displayDate(date)}
              aria-current={date === today ? "date" : undefined}
              onClick={() => onChange(date)}
            >
              {i + 1}
              {value === date && (
                <span className="day-dot" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>
      <p className="section-note">
        Datas no fuso de Brasília. A escolha não representa disponibilidade
        confirmada.
      </p>
    </div>
  );
}
