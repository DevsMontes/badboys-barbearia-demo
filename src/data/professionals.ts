export const professionals = [
  { id: "guilherme", name: "Guilherme", nickname: "Gui", initials: "G" },
  { id: "joao-pedro", name: "João Pedro", nickname: "Balinha", initials: "JP" },
] as const;
export const professionalName = (id: string) => {
  const person = professionals.find((p) => p.id === id);
  return person
    ? `${person.name} (${person.nickname})`
    : "Qualquer profissional disponível";
};
