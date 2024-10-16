function normalizeString(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "")
    .trim();
};

export function generateEmail(fullname: string): string {
  const randomNumbers = Math.floor(1000 + Math.random() * 9000);
  const normalizedFullname = normalizeString(fullname);
  return `${normalizedFullname.toLowerCase()}${randomNumbers}@gmail.com`;
};