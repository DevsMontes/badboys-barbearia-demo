import { useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  CalendarDays,
  Clock,
  Check,
  X,
} from "lucide-react";
import Brand from "../components/Brand";
import { useDemo } from "../context/DemoContext";
import { professionals, professionalName } from "../data/professionals";
import { services, money } from "../data/business";
import { statusLabels, statusTransitions } from "../domain/appointments";
import type { AppointmentStatus } from "../domain/appointments";
import { addDays, getAvailability } from "../services/availability";
import { displayDate, localDay } from "../utils/booking";

export default function AdminDemo() {
  const demo = useDemo();
  const [profile, setProfile] = useState("all");
  const [date, setDate] = useState(demo.lastCreated?.date || localDay());
  const [view, setView] = useState<"daily" | "weekly">("daily");
  const [detail, setDetail] = useState<string | null>(
    demo.lastCreated?.id || null,
  );
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const filtered = demo.appointments.filter(
    (a) => profile === "all" || a.professionalId === profile,
  );
  const dayAppointments = filtered
    .filter((a) => a.date === date)
    .sort(
      (a, b) =>
        a.time.localeCompare(b.time) ||
        a.professionalId.localeCompare(b.professionalId),
    );
  const start = addDays(
    date,
    -((new Date(`${date}T12:00:00-03:00`).getUTCDay() + 6) % 7),
  );
  const week = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  const selected = dayAppointments.find((a) => a.id === detail);
  const availability = getAvailability(
    date,
    profile === "all" ? "any" : profile,
    demo.appointments,
  );
  async function changeStatus(id: string, status: AppointmentStatus) {
    setBusy(true);
    setError("");
    try {
      await demo.update(id, status);
      setFeedback(`Status simulado atualizado: ${statusLabels[status]}.`);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Não foi possível atualizar a demonstração.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function restore() {
    if (
      !window.confirm(
        "Restaurar demonstração? Os registros fictícios criados nesta sessão serão apagados e os exemplos iniciais voltarão.",
      )
    )
      return;
    setBusy(true);
    try {
      await demo.restore();
      setDetail(null);
      setDate(localDay());
      setFeedback("Demonstração restaurada.");
      setError("");
    } catch {
      setError("Não foi possível restaurar. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="admin-demo">
      <a className="skip-link" href="#admin-content">
        Pular para a agenda
      </a>
      <header className="admin-header shell">
        <a href="#inicio" aria-label="Voltar ao site Bad Boys">
          <Brand />
        </a>
        <span>BAD BOYS / AGENDA</span>
        <a href="#agendamento">
          <ArrowLeft size={16} /> VOLTAR AO SIMULADOR
        </a>
      </header>
      <main id="admin-content" className="shell" tabIndex={-1}>
        <div className="public-demo-notice">
          <span>DEMONSTRAÇÃO PÚBLICA</span>
          <p>
            Dados fictícios em memória. Sem login, controle de acesso real ou
            reservas reais. Recarregar restaura os exemplos.
          </p>
        </div>
        <div className="admin-title">
          <div>
            <p className="eyebrow">DO PRIMEIRO CLIQUE AO ATENDIMENTO</p>
            <h1>
              A AGENDA.
              <br />
              <span>DO SEU JEITO.</span>
            </h1>
          </div>
          <button className="restore-demo" onClick={restore} disabled={busy}>
            <RotateCcw size={17} /> Restaurar demonstração
          </button>
        </div>
        <div
          className="profile-picker"
          role="group"
          aria-label="Perfil demonstrativo"
        >
          <button
            aria-pressed={profile === "all"}
            onClick={() => {
              setProfile("all");
              setDetail(null);
            }}
          >
            <span className="profile-avatar">BB</span>
            <span>
              VISÃO GERAL<small>Os dois profissionais</small>
            </span>
            {profile === "all" && <Check size={17} />}
          </button>
          {professionals.map((p) => (
            <button
              key={p.id}
              aria-pressed={profile === p.id}
              onClick={() => {
                setProfile(p.id);
                setDetail(null);
              }}
            >
              <span className="profile-avatar">{p.initials}</span>
              <span>
                {p.name}
                <small>{p.nickname}</small>
              </span>
              {profile === p.id && <Check size={17} />}
            </button>
          ))}
        </div>
        <p className="profile-disclaimer">
          A seleção de perfil é um filtro de apresentação, sem autenticação ou
          isolamento de segurança.
        </p>
        <div className="agenda-toolbar">
          <div className="agenda-date">
            <button
              aria-label="Semana anterior"
              onClick={() => {
                setDate(addDays(date, -7));
                setDetail(null);
              }}
            >
              <ChevronLeft size={20} />
            </button>
            <label htmlFor="agenda-day">
              DATA DA AGENDA
              <input
                id="agenda-day"
                type="date"
                value={date}
                onChange={(e) => {
                  if (e.target.value) {
                    setDate(e.target.value);
                    setDetail(null);
                  }
                }}
              />
            </label>
            <button
              aria-label="Próxima semana"
              onClick={() => {
                setDate(addDays(date, 7));
                setDetail(null);
              }}
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <div
            className="agenda-view"
            role="group"
            aria-label="Visualização da agenda"
          >
            <button
              aria-pressed={view === "daily"}
              onClick={() => setView("daily")}
            >
              DIÁRIA
            </button>
            <button
              aria-pressed={view === "weekly"}
              onClick={() => setView("weekly")}
            >
              SEMANAL
            </button>
          </div>
        </div>
        <div className="agenda-week" aria-label="Dias da semana">
          {week.map((day) => {
            const count = filtered.filter(
              (a) => a.date === day && a.status !== "cancelled",
            ).length;
            return (
              <button
                key={day}
                aria-pressed={date === day}
                onClick={() => {
                  setDate(day);
                  setDetail(null);
                }}
              >
                <span>
                  {new Date(`${day}T12:00:00-03:00`).toLocaleDateString(
                    "pt-BR",
                    { weekday: "short", timeZone: "America/Sao_Paulo" },
                  )}
                </span>
                <strong>{day.slice(8)}</strong>
                <small>
                  {count} {count === 1 ? "registro" : "registros"}
                </small>
              </button>
            );
          })}
        </div>
        {(error || demo.error) && (
          <p role="alert" className="form-error">
            {error || demo.error}{" "}
            <button onClick={() => void demo.refresh()}>
              Tentar novamente
            </button>
          </p>
        )}
        <p role="status" className="admin-feedback">
          {feedback}
        </p>
        {demo.loading ? (
          <p role="status" className="agenda-empty">
            Carregando agenda demonstrativa…
          </p>
        ) : view === "weekly" ? (
          <div className="weekly-overview">
            {week.map((day) => {
              const rows = filtered
                .filter((a) => a.date === day && a.status !== "cancelled")
                .sort((a, b) => a.time.localeCompare(b.time));
              const free = getAvailability(
                day,
                profile === "all" ? "any" : profile,
                demo.appointments,
              ).filter((s) => s.available).length;
              return (
                <section key={day}>
                  <div className="weekly-day-title">
                    <h2>{displayDate(day).slice(0, 5)}</h2>
                    <span>{free} horários livres simulados</span>
                  </div>
                  {rows.length ? (
                    rows.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => {
                          setDate(day);
                          setView("daily");
                          setDetail(a.id);
                        }}
                      >
                        <b>{a.time}</b>
                        <span>
                          {a.customerAlias}
                          <small>{professionalName(a.professionalId)}</small>
                        </span>
                        <ArrowUpRight size={16} />
                      </button>
                    ))
                  ) : (
                    <p>Sem agendamentos simulados neste dia.</p>
                  )}
                  <button
                    className="weekly-open"
                    onClick={() => {
                      setDate(day);
                      setView("daily");
                      setDetail(null);
                    }}
                  >
                    VER AGENDA DO DIA <ArrowUpRight size={15} />
                  </button>
                </section>
              );
            })}
          </div>
        ) : (
          <div className="daily-agenda">
            <div className="daily-heading">
              <h2>{displayDate(date)}</h2>
              <span>
                <CalendarDays size={16} />
                {dayAppointments.length} registros demonstrativos
              </span>
            </div>
            <div className="daily-layout">
              <div className="appointment-list">
                {dayAppointments.length ? (
                  dayAppointments.map((a) => (
                    <button
                      className={`appointment-row ${detail === a.id ? "is-active" : ""}`}
                      key={a.id}
                      onClick={() => setDetail(a.id)}
                      aria-expanded={detail === a.id}
                      aria-label={`Ver atendimento ${a.customerAlias}, ${professionalName(a.professionalId)}, ${a.time}`}
                    >
                      <strong>{a.time}</strong>
                      <span>
                        <b>{a.customerAlias}</b>
                        <small>
                          {services.find((s) => s.id === a.serviceId)?.name} ·{" "}
                          {professionalName(a.professionalId)}
                        </small>
                      </span>
                      <span className={`status-badge status-${a.status}`}>
                        {statusLabels[a.status]}
                      </span>
                      <ArrowUpRight size={18} />
                    </button>
                  ))
                ) : (
                  <div className="agenda-empty">
                    <Clock size={28} />
                    <h3>ESPAÇO PARA O PRÓXIMO VISUAL.</h3>
                    <p>
                      Nenhum agendamento demonstrativo para este perfil e dia.
                    </p>
                    <a href="#agendamento">
                      EXPERIMENTAR O SIMULADOR <ArrowUpRight size={16} />
                    </a>
                  </div>
                )}
              </div>
              <aside
                className="appointment-detail"
                aria-label="Detalhes do atendimento"
              >
                {selected ? (
                  <>
                    <div className="detail-heading">
                      <span className="eyebrow">
                        REGISTRO FICTÍCIO · {selected.id}
                      </span>
                      <button
                        onClick={() => setDetail(null)}
                        aria-label="Fechar detalhes"
                      >
                        <X size={18} />
                      </button>
                    </div>
                    <h3>{selected.customerAlias}</h3>
                    <span className={`status-badge status-${selected.status}`}>
                      {statusLabels[selected.status]}
                    </span>
                    <dl>
                      {[
                        [
                          "Profissional",
                          professionalName(selected.professionalId),
                        ],
                        [
                          "Serviço",
                          services.find((s) => s.id === selected.serviceId)
                            ?.name,
                        ],
                        ["Valor", money(selected.price)],
                        [
                          "Data / horário",
                          `${displayDate(selected.date)} · ${selected.time}`,
                        ],
                        ["Observação", selected.note || "Sem observação."],
                      ].map(([label, value]) => (
                        <div key={label}>
                          <dt>{label}</dt>
                          <dd>{value}</dd>
                        </div>
                      ))}
                    </dl>
                    <p className="detail-timestamp">
                      Criado:{" "}
                      {new Date(selected.createdAt).toLocaleString("pt-BR", {
                        timeZone: "America/Sao_Paulo",
                      })}
                      <br />
                      Atualizado:{" "}
                      {new Date(selected.updatedAt).toLocaleString("pt-BR", {
                        timeZone: "America/Sao_Paulo",
                      })}
                    </p>
                    <div className="status-actions">
                      {statusTransitions[selected.status].map((status) => (
                        <button
                          key={status}
                          className={
                            status === "cancelled" ? "cancel-action" : ""
                          }
                          disabled={busy}
                          onClick={() => void changeStatus(selected.id, status)}
                        >
                          {status === "confirmed"
                            ? "Confirmar (simulado)"
                            : status === "in_progress"
                              ? "Iniciar atendimento (simulado)"
                              : status === "completed"
                                ? "Concluir (simulado)"
                                : "Cancelar (simulado)"}
                        </button>
                      ))}
                    </div>
                    {!statusTransitions[selected.status].length && (
                      <p className="helper">
                        Ciclo deste registro encerrado na simulação.
                      </p>
                    )}
                  </>
                ) : (
                  <div className="detail-placeholder">
                    <ArrowUpRight size={25} />
                    <p>
                      Selecione um registro para explorar o atendimento e
                      alterar seu status fictício.
                    </p>
                  </div>
                )}
              </aside>
            </div>
            <section className="admin-availability">
              <div>
                <h3>O DIA, HORÁRIO POR HORÁRIO.</h3>
                <p>
                  Disponibilidade exclusivamente simulada. Grade fictícia de 60
                  minutos; não representa duração real dos serviços.
                </p>
              </div>
              <div className="admin-slot-grid">
                {availability.map((slot) => (
                  <span
                    key={slot.time}
                    className={slot.available ? "is-free" : "is-occupied"}
                  >
                    <b>{slot.time}</b>
                    <small>
                      {slot.reason === "past"
                        ? "Encerrado"
                        : slot.available
                          ? "Livre (simulado)"
                          : "Ocupado (simulado)"}
                    </small>
                  </span>
                ))}
              </div>
            </section>
          </div>
        )}
        <div className="admin-footer">
          <a href="#agendamento">
            CRIAR OUTRO AGENDAMENTO DEMONSTRATIVO <ArrowUpRight size={16} />
          </a>
          <span>Montes Dev · Demonstração conceitual</span>
        </div>
      </main>
    </div>
  );
}
