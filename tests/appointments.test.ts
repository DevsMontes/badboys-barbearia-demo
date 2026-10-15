import { test } from "node:test";
import assert from "node:assert/strict";
import { LocalAppointmentRepository } from "../src/services/LocalAppointmentRepository.ts";
import {
  getAvailability,
  simulatedBlocks,
  simulatedTimes,
} from "../src/services/availability.ts";
import { AppointmentError } from "../src/domain/appointments.ts";
const clock = () => new Date("2026-10-15T12:00:00Z");
const date = "2026-11-02";
function input(time: string, professionalId = "guilherme") {
  return {
    serviceId: "corte",
    professionalId,
    date,
    time,
    customerAlias: "Cliente fictício de teste",
    note: "Somente simulação.",
  };
}
async function free(repo: LocalAppointmentRepository, prof = "guilherme") {
  return getAvailability(date, prof, await repo.list(), clock()).find(
    (s) => s.available,
  )!.time;
}
test("bloqueios são determinísticos por data e profissional, sem horários fora do funcionamento", () => {
  assert.deepEqual(
    simulatedBlocks(date, "guilherme"),
    simulatedBlocks(date, "guilherme"),
  );
  assert.notDeepEqual(
    simulatedBlocks(date, "guilherme"),
    simulatedBlocks(date, "joao-pedro"),
  );
  assert.notDeepEqual(
    simulatedBlocks(date, "guilherme"),
    simulatedBlocks("2026-11-03", "guilherme"),
  );
  assert.deepEqual(simulatedTimes("2026-11-01"), [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
  ]);
  assert.equal(simulatedTimes(date).at(-1), "19:00");
});
test("criação ocupa o horário, lista filtra por profissional e cancelamento libera", async () => {
  const repo = new LocalAppointmentRepository(clock),
    time = await free(repo);
  const a = await repo.create(input(time));
  assert.equal(a.status, "pending");
  assert.equal(a.price, 30);
  assert.equal(a.simulated, true);
  assert.ok(
    (
      await repo.list({ professionalId: "guilherme", from: date, to: date })
    ).some((row) => row.id === a.id),
  );
  assert.ok(
    !(
      await repo.list({ professionalId: "joao-pedro", from: date, to: date })
    ).some((row) => row.id === a.id),
  );
  assert.equal(
    getAvailability(date, "guilherme", await repo.list(), clock()).find(
      (s) => s.time === time,
    )?.available,
    false,
  );
  await repo.updateStatus(a.id, "cancelled");
  assert.equal(
    getAvailability(date, "guilherme", await repo.list(), clock()).find(
      (s) => s.time === time,
    )?.available,
    true,
  );
});
test("duas solicitações concorrentes no mesmo repositório local: apenas uma é aceita", async () => {
  const repo = new LocalAppointmentRepository(clock),
    time = await free(repo);
  const result = await Promise.allSettled([
    repo.create(input(time)),
    repo.create(input(time)),
  ]);
  assert.equal(result.filter((r) => r.status === "fulfilled").length, 1);
  const rejection = result.find(
    (r) => r.status === "rejected",
  ) as PromiseRejectedResult;
  assert.equal((rejection.reason as AppointmentError).code, "CONFLICT");
});
test("qualquer profissional atribui o primeiro livre e depois o outro, em ordem determinística", async () => {
  const repo = new LocalAppointmentRepository(clock);
  const rows = await repo.list();
  const time = getAvailability(date, "guilherme", rows, clock()).find(
    (s) =>
      s.available &&
      getAvailability(date, "joao-pedro", rows, clock()).some(
        (other) => other.time === s.time && other.available,
      ),
  )!.time;
  const gui = await repo.create(input(time, "any"));
  const joao = await repo.create(input(time, "any"));
  assert.equal(gui.professionalId, "guilherme");
  assert.equal(joao.professionalId, "joao-pedro");
  await assert.rejects(
    repo.create(input(time, "any")),
    (e) => e instanceof AppointmentError && e.code === "CONFLICT",
  );
});
test("ciclo de status, validações e restauração da sessão", async () => {
  const repo = new LocalAppointmentRepository(clock);
  const original = await repo.list();
  const time = await free(repo);
  const a = await repo.create(input(time));
  await assert.rejects(
    repo.updateStatus(a.id, "completed"),
    (e) => e instanceof AppointmentError && e.code === "STATUS",
  );
  await repo.updateStatus(a.id, "confirmed");
  await repo.updateStatus(a.id, "in_progress");
  await repo.updateStatus(a.id, "completed");
  await assert.rejects(
    repo.updateStatus(a.id, "cancelled"),
    (e) => e instanceof AppointmentError && e.code === "STATUS",
  );
  await assert.rejects(
    repo.create({ ...input("03:00"), customerAlias: "A" }),
    (e) => e instanceof AppointmentError && e.code === "INVALID",
  );
  await assert.rejects(
    repo.create({ ...input(time), date: "2026-02-31" }),
    (e) => e instanceof AppointmentError && e.code === "INVALID",
  );
  await repo.reset();
  assert.deepEqual(await repo.list(), original);
  const another = new LocalAppointmentRepository(clock);
  assert.deepEqual(await another.list(), original);
});
