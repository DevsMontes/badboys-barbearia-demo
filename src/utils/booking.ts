export type Booking = {
  service: string;
  price: number;
  professional: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  note: string;
};
export function localDay(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const get = (key: string) => parts.find((p) => p.type === key)!.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}
export function localTime(now = new Date()) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(now);
}
export function closingTime(
  date: string,
  hours = { weekdayClose: "20:00", sundayClose: "13:00" },
) {
  return new Date(`${date}T12:00:00-03:00`).getUTCDay() === 0
    ? hours.sundayClose
    : hours.weekdayClose;
}
export function validPreference(
  date: string,
  time: string,
  today = localDay(),
  currentTime = localTime(),
  hours = { open: "09:00", weekdayClose: "20:00", sundayClose: "13:00" },
) {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(date) &&
    /^\d{2}:\d{2}$/.test(time) &&
    date >= today &&
    time >= hours.open &&
    time <= closingTime(date, hours) &&
    (date !== today || time > currentTime)
  );
}
export const displayDate = (date: string) =>
  new Date(`${date}T12:00:00-03:00`).toLocaleDateString("pt-BR", {
    timeZone: "America/Sao_Paulo",
  });
export function bookingMessage(b: Booking) {
  return `Olá! Gostaria de solicitar um agendamento na Bad Boys Barbearia.\n\nNome: ${b.name.trim()}\nServiço: ${b.service}\nValor divulgado: ${b.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}\nProfissional: ${b.professional}\nData desejada: ${displayDate(b.date)}\nHorário desejado: ${b.time}${b.phone.trim() ? `\nTelefone: ${b.phone.trim()}` : ""}${b.note.trim() ? `\nObservações: ${b.note.trim()}` : ""}\n\nAguardo a confirmação. Obrigado!`;
}
export const whatsappLink = (number: string, message: string) =>
  /^\d{10,15}$/.test(number)
    ? `https://wa.me/${number}?text=${encodeURIComponent(message)}`
    : null;
export function validPhone(value: string) {
  if (!value.trim()) return true;
  const digits = value.replace(/\D/g, "");
  return (
    /^\+?[\d\s().-]+$/.test(value.trim()) &&
    digits.length >= 10 &&
    digits.length <= 15
  );
}
export const demoMessage = (message: string) =>
  `DEMONSTRAÇÃO — NENHUMA RESERVA REAL\n\n${message}`;
export const deliveryLink = (
  mode: "client" | "demo",
  number: string,
  message: string,
) => (mode === "client" ? whatsappLink(number, message) : null);
