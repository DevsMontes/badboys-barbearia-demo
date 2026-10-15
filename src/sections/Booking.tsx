import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Scissors,
  UserRound,
  CalendarDays,
  Clock,
  MessageCircle,
  FlaskConical,
} from "lucide-react";
import Calendar from "../components/Calendar";
import BookingDemoMode from "../components/booking/BookingDemoMode";
import type { BookingMode } from "../components/booking/BookingDemoMode";
import BookingCompletion from "../components/booking/BookingCompletion";
import DemoReservationCompletion from "../components/booking/DemoReservationCompletion";
import SimulatedSlots from "../components/booking/SimulatedSlots";
import { useDemo } from "../context/DemoContext";
import { professionals, professionalName } from "../data/professionals";
import type { Appointment } from "../domain/appointments";
import { getAvailability } from "../services/availability";
import { business, money, services } from "../data/business";
import {
  bookingMessage,
  closingTime,
  displayDate,
  localDay,
  validPreference,
  validPhone,
  deliveryLink,
  demoMessage,
} from "../utils/booking";
const steps = [
  "Serviço",
  "Atendimento",
  "Data",
  "Horário",
  "Seus dados",
  "Resumo",
  "Conclusão",
];
export default function BookingSection({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}) {
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<BookingMode>("demo");
  const demo = useDemo();
  const [created, setCreated] = useState<Appointment | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const service = services.find((s) => s.id === selected);
  useEffect(() => {
    setStep(0);
    setError("");
    setCreated(null);
  }, [selected]);
  const [professional, setProfessional] = useState("any");
  const close = date
    ? closingTime(date, business.hours)
    : business.hours.weekdayClose;
  const requestMessage =
    service && date && time
      ? bookingMessage({
          service: service.name,
          price: service.price,
          professional: professionalName(professional),
          date,
          time,
          name,
          phone,
          note,
        })
      : "";
  const message =
    mode === "demo" ? demoMessage(requestMessage) : requestMessage;
  const wa = deliveryLink(mode, business.whatsapp, message);
  function reset(nextMode: BookingMode = mode) {
    setMode(nextMode);
    onSelect("");
    setDate("");
    setTime("");
    setName("");
    setPhone("");
    setNote("");
    setProfessional("any");
    setCreated(null);
    go(0);
  }
  function validateFinal() {
    if (
      !service ||
      !validPreference(date, time, undefined, undefined, business.hours)
    ) {
      setError("Atualize o serviço, a data e o horário antes de concluir.");
      return false;
    }
    if (name.trim().length < 2 || !validPhone(phone)) {
      setError("Revise seu nome e telefone antes de concluir.");
      return false;
    }
    if (
      mode === "demo" &&
      !getAvailability(date, professional, demo.appointments).some(
        (slot) => slot.time === time && slot.available,
      )
    ) {
      setError(
        "Esse horário está ocupado na simulação. Volte e escolha outro.",
      );
      return false;
    }
    return true;
  }
  function go(next: number) {
    setError("");
    setCopied(false);
    setStep(next);
    requestAnimationFrame(() => {
      heading.current?.focus({ preventScroll: true });
      heading.current?.scrollIntoView({ block: "start", behavior: "instant" });
    });
  }
  async function next() {
    if (step === 5 && !validateFinal()) return;
    if (step === 5 && mode === "demo") {
      setSubmitting(true);
      try {
        const appointment = await demo.create({
          serviceId: selected,
          professionalId: professional,
          date,
          time,
          customerAlias: name,
          note,
        });
        setCreated(appointment);
        go(6);
      } catch (e) {
        go(3);
        setError(
          e instanceof Error
            ? e.message
            : "Não foi possível registrar a simulação. Tente novamente.",
        );
      } finally {
        setSubmitting(false);
      }
      return;
    }
    if (step === 0 && !service) {
      setError("Selecione um serviço para continuar.");
      return;
    }
    if (step === 2 && (!date || date < localDay())) {
      setError("Escolha uma data a partir de hoje.");
      return;
    }
    if (
      step === 3 &&
      (!validPreference(date, time, undefined, undefined, business.hours) ||
        (mode === "demo" &&
          !getAvailability(date, professional, demo.appointments).some(
            (slot) => slot.time === time && slot.available,
          )))
    ) {
      setError(
        `Escolha um horário entre ${business.hours.open} e ${close}. Para hoje, informe um horário futuro.`,
      );
      return;
    }
    if (step === 4) {
      if (name.trim().length < 2) {
        setError("Informe seu nome com pelo menos 2 caracteres.");
        return;
      }
      if (!validPhone(phone)) {
        setError(
          "Confira o telefone informado, incluindo o DDD, ou deixe o campo vazio.",
        );
        return;
      }
      if (!validPreference(date, time, undefined, undefined, business.hours)) {
        setError(
          "A data ou o horário precisa ser atualizado. Volte às etapas anteriores.",
        );
        return;
      }
    }
    go(step + 1);
  }
  async function copy() {
    if (!validateFinal()) return;
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
    } catch {
      setError(
        "Não foi possível copiar automaticamente. Selecione e copie a mensagem abaixo.",
      );
    }
  }
  return (
    <section id="agendamento" className="booking section" tabIndex={-1}>
      <div className="shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">04 / SEU PRÓXIMO PASSO</p>
            <h2>
              BORA COLOCAR
              <br />
              <span>O ESTILO EM DIA?</span>
            </h2>
          </div>
          <p>
            Seu estilo começa com uma escolha.
            <br />
            Conheça o fluxo ou prepare sua solicitação.
          </p>
        </div>
        <ol className="process">
          {[
            [Scissors, "Escolha seu serviço"],
            [UserRound, "Selecione o atendimento"],
            [CalendarDays, "Indique dia e horário"],
            [
              MessageCircle,
              mode === "demo" ? "Explore o resumo" : "Solicite pelo WhatsApp",
            ],
          ].map(([Icon, title], i) => {
            const I = Icon as typeof Scissors;
            return (
              <li key={i}>
                <span>0{i + 1}</span>
                <I size={21} />
                <p>{title as string}</p>
              </li>
            );
          })}
        </ol>
        <BookingDemoMode
          mode={mode}
          onChange={(nextMode) => {
            if (nextMode !== mode || nextMode === "demo") reset(nextMode);
          }}
        />
        <div className={`booking-layout mode-${mode}`}>
          <aside className="booking-sidebar">
            <span className="eyebrow">
              {mode === "demo"
                ? "DEMONSTRAÇÃO INTERATIVA"
                : "SOLICITAÇÃO DE AGENDAMENTO"}
            </span>
            <h3>
              SEU VISUAL.
              <br />
              SUA ESCOLHA.
            </h3>
            <ol className="step-list">
              {steps.map((label, i) => (
                <li key={label}>
                  <button
                    type="button"
                    disabled={i > step || (!!created && i !== 6)}
                    aria-current={i === step ? "step" : undefined}
                    onClick={() => go(i)}
                  >
                    <span>
                      {i < step ? (
                        <Check size={14} />
                      ) : (
                        String(i + 1).padStart(2, "0")
                      )}
                    </span>
                    {label}
                  </button>
                </li>
              ))}
            </ol>
            <dl className="live-selection" aria-label="Suas escolhas">
              <div>
                <dt>SERVIÇO</dt>
                <dd>{service?.name || "Seu próximo visual"}</dd>
              </div>
              <div>
                <dt>VALOR DIVULGADO</dt>
                <dd>{service ? money(service.price) : "—"}</dd>
              </div>
              <div>
                <dt>DIA / HORÁRIO DESEJADO</dt>
                <dd>
                  {date ? displayDate(date) : "A escolher"}
                  {time ? ` · ${time}` : ""}
                </dd>
              </div>
            </dl>
            <div className="booking-disclaimer">
              <Clock size={18} />
              <p>
                A confirmação final é feita pela barbearia. Esta solicitação não
                reserva um horário.
              </p>
            </div>
          </aside>
          <div className="booking-form">
            <div
              className={`mode-indicator ${mode === "demo" ? "is-demo" : ""}`}
            >
              {mode === "demo" ? (
                <FlaskConical size={14} />
              ) : (
                <Scissors size={14} />
              )}
              <span>
                {mode === "demo"
                  ? "DEMONSTRAÇÃO · SEM RESERVA REAL"
                  : "MODO CLIENTE · SUJEITO A CONFIRMAÇÃO"}
              </span>
            </div>
            <div className="booking-progress">
              <progress
                max={7}
                value={step + 1}
                aria-label="Progresso do agendamento"
              />
              <span>{String(step + 1).padStart(2, "0")} / 07</span>
            </div>
            <p className="eyebrow">
              ETAPA {String(step + 1).padStart(2, "0")} / 07
            </p>
            <h3 ref={heading} tabIndex={-1}>
              {
                [
                  "Qual é o seu próximo estilo?",
                  "Quem vai atender você?",
                  "Qual dia combina com você?",
                  "Qual horário você prefere?",
                  "Como podemos chamar você?",
                  "Confira sua solicitação.",
                  mode === "demo"
                    ? "Seu exemplo está na agenda."
                    : "Próximo passo: falar com a Bad Boys.",
                ][step]
              }
            </h3>
            {step === 0 && (
              <div className="booking-options">
                {services.map((s) => (
                  <button
                    type="button"
                    key={s.id}
                    className="option"
                    aria-pressed={selected === s.id}
                    onClick={() => onSelect(s.id)}
                  >
                    <span>
                      {selected === s.id ? (
                        <Check size={17} />
                      ) : (
                        <Scissors size={17} />
                      )}{" "}
                      {s.name}
                    </span>
                    <b>{money(s.price)}</b>
                  </button>
                ))}
              </div>
            )}
            {step === 1 && (
              <>
                <div className="booking-options">
                  {[
                    { id: "any", label: "Qualquer profissional disponível" },
                    ...professionals.map((p) => ({
                      id: p.id,
                      label: professionalName(p.id),
                    })),
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      className="option professional"
                      aria-pressed={professional === option.id}
                      onClick={() => {
                        setProfessional(option.id);
                        setTime("");
                        setError("");
                      }}
                    >
                      <span>
                        <UserRound size={20} />
                        {option.label}
                      </span>
                      {professional === option.id && <Check size={20} />}
                    </button>
                  ))}
                </div>
                <p className="helper">
                  {mode === "demo"
                    ? "A agenda e os bloqueios são fictícios. Em “qualquer profissional”, o simulador atribui o primeiro profissional livre na ordem Guilherme, João Pedro."
                    : "Preferência para uma mensagem de solicitação. Não há reserva ou envio automático."}
                </p>
              </>
            )}
            {step === 2 && (
              <Calendar
                value={date}
                onChange={(day) => {
                  setDate(day);
                  setTime("");
                  setError("");
                }}
              />
            )}
            {step === 3 && mode === "demo" && (
              <SimulatedSlots
                date={date}
                professionalId={professional}
                value={time}
                onChange={(value) => {
                  setTime(value);
                  setError("");
                }}
              />
            )}
            {step === 3 && mode === "client" && (
              <div className="time-choice">
                <label htmlFor="booking-time">Horário desejado</label>
                <input
                  id="booking-time"
                  type="time"
                  value={time}
                  min={business.hours.open}
                  max={close}
                  onChange={(e) => {
                    setTime(e.target.value);
                    setError("");
                  }}
                  aria-describedby="time-help"
                  required
                />
                <p id="time-help" className="helper">
                  Funcionamento em {date ? displayDate(date) : "sua data"}:{" "}
                  {business.hours.open} às {close}. Escolha livremente dentro
                  desse período.
                </p>
                <p className="notice">
                  Preferência sujeita a confirmação. Os horários comerciais não
                  indicam vagas na agenda.
                </p>
              </div>
            )}
            {step === 4 && (
              <div className="contact-fields">
                {mode === "demo" && (
                  <div className="demo-fill">
                    <p>
                      Use informações fictícias para experimentar. Nada será
                      enviado. O registro fictício fica em memória nesta sessão.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setName("Visitante de demonstração");
                        setPhone("");
                        setNote("Dados fictícios para testar o agendamento.");
                        setError("");
                      }}
                    >
                      USAR DADOS FICTÍCIOS <FlaskConical size={15} />
                    </button>
                  </div>
                )}
                <label htmlFor="booking-name">
                  {mode === "demo" ? "Nome fictício" : "Nome"}{" "}
                  <span>(obrigatório)</span>
                </label>
                <input
                  id="booking-name"
                  autoComplete={mode === "demo" ? "off" : "given-name"}
                  value={name}
                  maxLength={80}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                {mode === "client" && (
                  <>
                    <label htmlFor="booking-phone">
                      Telefone <span>(opcional)</span>
                    </label>
                    <input
                      id="booking-phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={phone}
                      maxLength={22}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="DDD + número"
                    />
                  </>
                )}
                <label htmlFor="booking-note">
                  Observação <span>(opcional)</span>
                </label>
                <textarea
                  id="booking-note"
                  value={note}
                  maxLength={500}
                  rows={3}
                  onChange={(e) => setNote(e.target.value)}
                />
                <p className="helper">
                  Os dados ficam apenas na memória desta página. Nada é enviado
                  automaticamente.
                </p>
              </div>
            )}
            {step === 5 && (
              <>
                <dl className="summary">
                  {[
                    ["Serviço", service?.name || "", 0],
                    ["Valor divulgado", money(service?.price || 0), 0],
                    ["Atendimento", professionalName(professional), 1],
                    ["Data desejada", date ? displayDate(date) : "", 2],
                    ["Horário desejado", time, 3],
                    ["Nome", name.trim(), 4],
                    ...(phone.trim() ? [["Telefone", phone, 4]] : []),
                    ...(note.trim() ? [["Observação", note, 4]] : []),
                  ].map(([label, value, edit]) => (
                    <div key={label as string}>
                      <dt>{label}</dt>
                      <dd>
                        {value}
                        <button
                          type="button"
                          onClick={() => go(edit as number)}
                          aria-label={`Editar ${label}`}
                        >
                          Editar
                        </button>
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="notice">
                  {mode === "demo"
                    ? "Ao confirmar, este exemplo entrará no painel e bloqueará o horário somente nesta sessão. Use apenas dados fictícios."
                    : "Confira suas preferências. Na próxima etapa, você poderá preparar o envio da solicitação."}{" "}
                  Nenhum horário foi reservado.
                </p>
              </>
            )}
            {step === 6 && mode === "demo" && created && (
              <DemoReservationCompletion
                appointment={created}
                onRestart={() => reset()}
              />
            )}
            {step === 6 && mode === "client" && (
              <BookingCompletion
                mode={mode}
                message={message}
                wa={wa}
                copied={copied}
                onCopy={copy}
                onRestart={() => reset()}
                onEdit={() => go(5)}
                validate={validateFinal}
              />
            )}
            {error && (
              <p role="alert" className="form-error">
                {error}
              </p>
            )}
            <div className="booking-actions">
              {step > 0 && step < 6 && (
                <button
                  type="button"
                  className="back-button"
                  onClick={() => go(step - 1)}
                >
                  <ArrowLeft size={17} /> Voltar
                </button>
              )}
              {step < 6 && (
                <button
                  type="button"
                  className="button primary"
                  onClick={() => void next()}
                  disabled={submitting}
                >
                  {step === 5
                    ? mode === "demo"
                      ? submitting
                        ? "REGISTRANDO EXEMPLO…"
                        : "CONFIRMAR SIMULAÇÃO"
                      : "PREPARAR SOLICITAÇÃO"
                    : "CONTINUAR"}{" "}
                  <span>
                    <ArrowRight size={19} />
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
