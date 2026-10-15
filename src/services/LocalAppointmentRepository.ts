import { services } from "../data/business.ts";
import { professionals } from "../data/professionals.ts";
import { demoConfig } from "../data/demo.ts";
import { AppointmentError, statusTransitions } from "../domain/appointments.ts";
import type {
  Appointment,
  AppointmentQuery,
  AppointmentRepository,
  AppointmentStatus,
  CreateAppointment,
} from "../domain/appointments.ts";
import { localDay } from "../utils/booking.ts";
import { addDays, getAvailability } from "./availability.ts";

export class LocalAppointmentRepository implements AppointmentRepository {
  private rows: Appointment[] = [];
  private sequence = 0;
  private now: () => Date;
  constructor(now: () => Date = () => new Date()) {
    this.now = now;
    this.seed();
  }
  private seed() {
    this.rows = [];
    this.sequence = 0;
    for (let offset = 0; offset < demoConfig.seedDays; offset++)
      for (const [index, p] of professionals.entries()) {
        const date = addDays(localDay(this.now()), offset);
        const slot = getAvailability(date, p.id, this.rows, this.now()).find(
          (s) => s.available,
        );
        if (!slot) continue;
        const service = services[index];
        const timestamp = this.now().toISOString();
        this.rows.push({
          id: `example-${offset}-${p.id}`,
          serviceId: service.id,
          professionalId: p.id,
          date,
          time: slot.time,
          customerAlias: `Cliente exemplo ${String(offset * 2 + index + 1).padStart(2, "0")}`,
          note: "Registro fictício de exemplo.",
          price: service.price,
          status: offset % 2 ? "pending" : "confirmed",
          createdAt: timestamp,
          updatedAt: timestamp,
          simulated: true,
        });
      }
  }
  async list(query: AppointmentQuery = {}) {
    return this.rows
      .filter(
        (a) =>
          (!query.professionalId ||
            a.professionalId === query.professionalId) &&
          (!query.from || a.date >= query.from) &&
          (!query.to || a.date <= query.to),
      )
      .map((a) => ({ ...a }));
  }
  async create(input: CreateAppointment) {
    const service = services.find((s) => s.id === input.serviceId);
    const parsed = new Date(`${input.date}T12:00:00-03:00`);
    if (
      !service ||
      !/^\d{4}-\d{2}-\d{2}$/.test(input.date) ||
      Number.isNaN(parsed.getTime()) ||
      parsed.toISOString().slice(0, 10) !== input.date ||
      input.customerAlias.trim().length < 2 ||
      input.customerAlias.trim().length > 80 ||
      input.note.length > 500
    )
      throw new AppointmentError(
        "INVALID",
        "Revise o serviço, a data e o nome fictício.",
      );
    const slot = getAvailability(
      input.date,
      input.professionalId,
      this.rows,
      this.now(),
    ).find((s) => s.time === input.time);
    const professionalId = slot?.professionalIds[0];
    if (!slot?.available || !professionalId)
      throw new AppointmentError(
        "CONFLICT",
        "Este horário acabou de ser ocupado na simulação. Escolha outro.",
      );
    const stamp = this.now().toISOString();
    const appointment: Appointment = {
      ...input,
      customerAlias: input.customerAlias.trim(),
      note: input.note.trim(),
      professionalId,
      id: `demo-${++this.sequence}`,
      price: service.price,
      status: "pending",
      createdAt: stamp,
      updatedAt: stamp,
      simulated: true,
    };
    // No await between validation and insertion: atomic within this one JS instance only.
    this.rows.push(appointment);
    return { ...appointment };
  }
  async updateStatus(id: string, status: AppointmentStatus) {
    const appointment = this.rows.find((a) => a.id === id);
    if (!appointment)
      throw new AppointmentError(
        "NOT_FOUND",
        "Agendamento demonstrativo não encontrado.",
      );
    if (!statusTransitions[appointment.status].includes(status))
      throw new AppointmentError(
        "STATUS",
        "Essa alteração de status não é permitida neste estágio da simulação.",
      );
    appointment.status = status;
    appointment.updatedAt = this.now().toISOString();
    return { ...appointment };
  }
  async reset() {
    this.seed();
  }
}
