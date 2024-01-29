export function getGreeting() {
  const date = new Date();
  const hour = date.getHours();

  if (hour >= 6 && hour < 12) {
    return "Bom dia";
  } else if (hour >= 12 && hour < 18) {
    return "Boa tarde";
  } else {
    return "Boa noite";
  }
}

export function dataFormatada() {
  const diasDaSemana = [
    "domingo",
    "segunda-feira",
    "terça-feira",
    "quarta-feira",
    "quinta-feira",
    "sexta-feira",
    "sábado",
  ];
  const meses = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];

  const dataAtual = new Date();
  const diaDaSemana = diasDaSemana[dataAtual.getDay()];
  const dia = dataAtual.getDate();
  const mes = meses[dataAtual.getMonth()];

  return `Hoje é ${diaDaSemana}, ${dia < 10 ? "0" + dia : dia} de ${mes}`;
}

export function convertStringToDate(dateString: string) {
  const [date, time] = dateString.split(", ");
  const [day, month, year] = date.split("/").map(Number);
  const [hours, minutes, seconds] = time.split(":").map(Number);

  return new Date(year, month - 1, day, hours, minutes, seconds);
}

// delay function
export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}