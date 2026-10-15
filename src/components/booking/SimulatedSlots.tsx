import { Check, LockKeyhole } from "lucide-react";
import { getAvailability } from "../../services/availability";
import { useDemo } from "../../context/DemoContext";
export default function SimulatedSlots({
  date,
  professionalId,
  value,
  onChange,
}: {
  date: string;
  professionalId: string;
  value: string;
  onChange: (time: string) => void;
}) {
  const { appointments } = useDemo();
  const slots = getAvailability(date, professionalId, appointments);
  return (
    <div className="simulated-slots">
      <p className="helper">
        Horários fictícios para experimentar o sistema. Grade de 60 minutos, sem
        relação com a duração real dos serviços.
      </p>
      <div className="slot-legend">
        <span>Disponível (simulado)</span>
        <span>Ocupado (simulado)</span>
        <span>
          <Check size={12} /> Selecionado
        </span>
      </div>
      <div className="slot-picker" role="group" aria-label="Horários simulados">
        {slots.map((slot) => (
          <button
            key={slot.time}
            type="button"
            disabled={!slot.available}
            aria-pressed={value === slot.time}
            aria-label={`${slot.time} — ${slot.reason === "past" ? "Encerrado" : slot.available ? "Disponível (simulado)" : "Ocupado (simulado)"}`}
            onClick={() => onChange(slot.time)}
          >
            <strong>{slot.time}</strong>
            <span>
              {value === slot.time ? (
                <>
                  <Check size={12} /> Selecionado
                </>
              ) : slot.available ? (
                "Disponível"
              ) : (
                <>
                  <LockKeyhole size={11} />
                  {slot.reason === "past" ? "Encerrado" : "Ocupado"}
                </>
              )}
            </span>
          </button>
        ))}
      </div>
      {slots.every((s) => !s.available) && (
        <p className="notice">
          Nenhum horário simulado livre. Experimente outro dia ou profissional.
        </p>
      )}
    </div>
  );
}
