import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import type {
  Appointment,
  AppointmentStatus,
  CreateAppointment,
} from "../domain/appointments";
import { LocalAppointmentRepository } from "../services/LocalAppointmentRepository";

type DemoState = {
  appointments: Appointment[];
  loading: boolean;
  error: string;
  lastCreated: Appointment | null;
  create: (input: CreateAppointment) => Promise<Appointment>;
  update: (id: string, status: AppointmentStatus) => Promise<void>;
  restore: () => Promise<void>;
  refresh: () => Promise<void>;
};
const DemoContext = createContext<DemoState | null>(null);
export function DemoProvider({ children }: { children: ReactNode }) {
  const [repository] = useState(() => new LocalAppointmentRepository());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [lastCreated, setLastCreated] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setAppointments(await repository.list());
    } catch {
      setError(
        "Não foi possível carregar os registros locais. Tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  }, [repository]);
  useEffect(() => {
    void refresh();
  }, [refresh]);
  const create = async (input: CreateAppointment) => {
    const result = await repository.create(input);
    setLastCreated(result);
    await refresh();
    return result;
  };
  const update = async (id: string, status: AppointmentStatus) => {
    await repository.updateStatus(id, status);
    await refresh();
  };
  const restore = async () => {
    await repository.reset();
    setLastCreated(null);
    await refresh();
  };
  return (
    <DemoContext.Provider
      value={{
        appointments,
        loading,
        error,
        lastCreated,
        create,
        update,
        restore,
        refresh,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}
export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error("DemoProvider ausente");
  return context;
}
