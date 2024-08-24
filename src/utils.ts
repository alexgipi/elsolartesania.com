export function formatCurrency(number:number) {
  if (number !== undefined) {
    return number.toLocaleString('es', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    });
  }
}

export function formatDate(dateString: string) {
  // Verificar si el dateString es válido
  if (!dateString) {
    return 'Fecha no válida';
  }

  // Intentar crear una instancia de Date
  const date = new Date(dateString);

  // Verificar si la fecha es válida
  if (isNaN(date.getTime())) {
    return 'Fecha no válida';
  }

  const dateFormat = new Intl.DateTimeFormat('es', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: 'UTC', // Ajusta esto según tu zona horaria
  });

  return dateFormat.format(date);
}

export function slugify(str:string) {
  return String(str)
    .normalize('NFD') // Normalizes the string to separate base characters and diacritical marks
    .replace(/[\u0300-\u036f]/g, '') // Removes diacritical marks (accents)
    .trim() // Trims leading or trailing whitespace
    .toLowerCase() // Converts to lowercase
    .replace(/[^a-z0-9 -]/g, '') // Removes non-alphanumeric characters
    .replace(/\s+/g, '-') // Replaces spaces with hyphens
    .replace(/-+/g, '-'); // Removes consecutive hyphens
}