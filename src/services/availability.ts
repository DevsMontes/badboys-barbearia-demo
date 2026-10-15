import { business } from "../data/business.ts";
import { demoConfig } from "../data/demo.ts";
import { professionals } from "../data/professionals.ts";
import type { Appointment } from "../domain/appointments.ts";
import { closingTime, localDay, localTime } from "../utils/booking.ts";
export function addDays(day: string, amount: number) {
  const date = new Date(`${day}T12:00:00-03:00`);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}
export function simulatedTimes(date: string) {
  const start =
    Number(business.hours.open.slice(0, 2)) * 60 +
    Number(business.hours.open.slice(3));
  const close = closingTime(date, business.hours).split(":").map(Number);
  const end = close[0] * 60 + close[1];
  const times: string[] = [];
  for (
    let minute = start;
    minute + demoConfig.slotMinutes <= end;
    minute += demoConfig.slotMinutes
  )
    times.push(
      `${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`,
    );
  return times;
}
export function simulatedBlocks(date: string, professionalId: string) {
  const times = simulatedTimes(date);
  const index = professionals.findIndex((p) => p.id === professionalId);
  const hash =
    [...date].reduce((n, c) => n + c.charCodeAt(0), 0) + Math.max(0, index) * 3;
  return times.filter(
    (_, i) =>
      i === hash % times.length ||
      i === (hash + Math.ceil(times.length / 2)) % times.length,
  );
}
export type SimulatedSlot = {
  time: string;
  available: boolean;
  professionalIds: string[];
  reason: "free" | "occupied" | "past";
};
export function getAvailability(
  date: string,
  professionalId: string,
  appointments: readonly Appointment[],
  now = new Date(),
): SimulatedSlot[] {
  const today = localDay(now),
    clock = localTime(now);
  const candidates =
    professionalId === "any"
      ? professionals
      : professionals.filter((p) => p.id === professionalId);
  return simulatedTimes(date).map((time) => {
    const past = date < today || (date === today && time <= clock);
    const available = candidates
      .filter(
        (p) =>
          !simulatedBlocks(date, p.id).includes(time) &&
          !appointments.some(
            (a) =>
              a.professionalId === p.id &&
              a.date === date &&
              a.time === time &&
              a.status !== "cancelled",
          ),
      )
      .map((p) => p.id);
    return {
      time,
      available: !past && available.length > 0,
      professionalIds: past ? [] : available,
      reason: past ? "past" : available.length ? "free" : "occupied",
    };
  });
}
