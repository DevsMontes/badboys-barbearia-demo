import { FlaskConical, ArrowUpRight } from "lucide-react";
export type BookingMode = "client" | "demo";
export default function BookingDemoMode({
  mode,
  onChange,
}: {
  mode: BookingMode;
  onChange: (mode: BookingMode) => void;
}) {
  return (
    <div className="booking-mode">
      <div>
        <span className="eyebrow">ESCOLHA COMO CONTINUAR</span>
        <p>
          {mode === "demo"
            ? "Crie um exemplo e acompanhe-o no painel. Nada será reservado de verdade."
            : "Prepare seu pedido. A confirmação será feita pela barbearia."}
        </p>
      </div>
      <div
        className="mode-buttons"
        role="group"
        aria-label="Modo do agendamento"
      >
        <button
          type="button"
          aria-pressed={mode === "client"}
          onClick={() => onChange("client")}
        >
          PREPARAR MENSAGEM <ArrowUpRight size={16} />
        </button>
        <button
          type="button"
          aria-pressed={mode === "demo"}
          onClick={() => onChange("demo")}
        >
          <FlaskConical size={16} /> EXPLORAR DEMONSTRAÇÃO
        </button>
      </div>
    </div>
  );
}
