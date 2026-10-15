export type AppointmentStatus =
  "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
export type Appointment = {
  id: string;
  serviceId: string;
  professionalId: string;
  date: string;
  time: string;
  customerAlias: string;
  note: string;
  price: number;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
  simulated: true;
};
export type CreateAppointment = Pick<
  Appointment,
  "serviceId" | "professionalId" | "date" | "time" | "customerAlias" | "note"
>;
export const statusLabels: Record<AppointmentStatus, string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  in_progress: "Em atendimento",
  completed: "Concluído",
  cancelled: "Cancelado",
};
export const statusTransitions: Record<AppointmentStatus, AppointmentStatus[]> =
  {
    pending: ["confirmed", "cancelled"],
    confirmed: ["in_progress", "cancelled"],
    in_progress: ["completed", "cancelled"],
    completed: [],
    cancelled: [],
  };
export type AppointmentQuery = {
  professionalId?: string;
  from?: string;
  to?: string;
};
/** Future API adapter boundary. This version has no remote or authenticated adapter. */
export interface AppointmentRepository {
  list(query?: AppointmentQuery): Promise<Appointment[]>;
  create(input: CreateAppointment): Promise<Appointment>;
  updateStatus(id: string, status: AppointmentStatus): Promise<Appointment>;
  reset(): Promise<void>;
}
export class AppointmentError extends Error {
  code: "CONFLICT" | "INVALID" | "NOT_FOUND" | "STATUS";
  constructor(
    code: "CONFLICT" | "INVALID" | "NOT_FOUND" | "STATUS",
    message: string,
  ) {
    super(message);
    this.name = "AppointmentError";
    this.code = code;
  }
}
