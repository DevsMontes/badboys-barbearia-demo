import { test } from "node:test";
import assert from "node:assert/strict";
import {
  bookingMessage,
  closingTime,
  localDay,
  validPreference,
  whatsappLink,
  validPhone,
  demoMessage,
  deliveryLink,
} from "../src/utils/booking.ts";
test("demonstração nunca abre WhatsApp, mesmo se houver contato configurado", () => {
  const message = demoMessage("Conteúdo de teste");
  assert.ok(message.startsWith("DEMONSTRAÇÃO — NENHUMA RESERVA REAL"));
  assert.equal(deliveryLink("demo", "5561999999999", message), null);
  assert.equal(deliveryLink("client", "", "Teste"), null);
  assert.ok(
    deliveryLink("client", "5561999999999", "Teste")?.includes(
      "wa.me/5561999999999",
    ),
  );
});
test("telefone opcional exige dígitos suficientes quando preenchido", () => {
  assert.equal(validPhone(""), true);
  assert.equal(validPhone("----------"), false);
  assert.equal(validPhone("(61) 99999-9999"), true);
  assert.equal(validPhone("123"), false);
});
test("data usa o fuso de Brasília na virada do dia UTC", () => {
  assert.equal(localDay(new Date("2026-10-16T01:00:00Z")), "2026-10-15");
});
test("domingo fecha às 13h; segunda fecha às 20h", () => {
  assert.equal(closingTime("2026-10-18"), "13:00");
  assert.equal(closingTime("2026-10-19"), "20:00");
});
test("preferências respeitam passado, funcionamento e horário atual", () => {
  const valid = (d: string, t: string) =>
    validPreference(d, t, "2026-10-15", "15:00");
  assert.equal(valid("2026-10-14", "16:00"), false);
  assert.equal(valid("2026-10-15", "14:59"), false);
  assert.equal(valid("2026-10-16", "08:59"), false);
  assert.equal(valid("2026-10-16", "20:01"), false);
  assert.equal(valid("2026-10-18", "13:01"), false);
  assert.equal(valid("2026-10-18", "12:37"), true);
  assert.equal(valid("2026-10-16", "19:47"), true);
});
test("mensagem preserva acentos e omite campos opcionais vazios", () => {
  const message = bookingMessage({
    service: "Luzes / Reflexo",
    price: 120,
    professional: "Qualquer profissional disponível",
    date: "2026-10-18",
    time: "12:37",
    name: " André ",
    phone: "",
    note: "",
  });
  assert.ok(message.includes("Nome: André"));
  assert.ok(message.includes("18/10/2026"));
  assert.ok(!message.includes("Telefone:"));
  assert.ok(!message.includes("Observações:"));
  assert.ok(message.includes("Aguardo a confirmação."));
  const link = whatsappLink("5561999999999", message);
  assert.equal(decodeURIComponent(link!.split("?text=")[1]), message);
  assert.equal(whatsappLink("", message), null);
});
