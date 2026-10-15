export const business = {
  name: "Bad Boys Barbearia",
  address: "QNP 12, Conjunto X, Lote 2 — Setor P. Sul, Brasília/DF",
  mapsUrl: "https://maps.app.goo.gl/LGtAAxrBPFRAXufR6",
  instagram: "https://www.instagram.com/badboys_barbearia00/",
  instagramHandle: "@badboys_barbearia00",
  timezone: "America/Sao_Paulo",
  whatsapp: "", // Somente dígitos, com país e DDD. Confirmar com o proprietário.
  hours: { open: "09:00", weekdayClose: "20:00", sundayClose: "13:00" },
};
export const whatsappNumber = business.whatsapp; // Única fonte; somente contato real autorizado, sem número de teste inventado.
export const services = [
  {
    id: "corte",
    name: "Qualquer corte",
    price: 30,
    tag: "SEU ESTILO, DO SEU JEITO",
  },
  { id: "barba", name: "Barba", price: 15, tag: "PRESENÇA EM CADA DETALHE" },
  {
    id: "sobrancelha",
    name: "Sobrancelha",
    price: 5,
    tag: "O DETALHE FAZ PARTE",
  },
  {
    id: "pigmentacao",
    name: "Pigmentação",
    price: 20,
    tag: "EXPRESSE SUA IDENTIDADE",
  },
  {
    id: "platinado",
    name: "Platinado",
    price: 120,
    tag: "UMA NOVA VERSÃO DE VOCÊ",
  },
  { id: "luzes", name: "Luzes / Reflexo", price: 120, tag: "MUDE O TOM" },
  { id: "pezinho", name: "Pezinho", price: 5, tag: "FINALIZE SEU VISUAL" },
];
export const navigation = [
  ["inicio", "Início"],
  ["sobre", "Sobre"],
  ["servicos", "Serviços"],
  ["experiencia", "Experiência"],
  ["agendamento", "Agendamento"],
  ["contato", "Contato"],
];
export const money = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export const asset = (path: string) =>
  `${import.meta.env.BASE_URL}assets/${path}`;
// Conteúdo futuro: manter vazio até receber material e autorização oficiais.
export const gallery: { src: string; alt: string }[] = [];
export const team: { id: string; name: string }[] = [];
