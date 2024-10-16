export function generatePassword(fullname: string): string {
  const randomNumbers = Math.floor(10000000 + Math.random() * 90000000);
  return `${fullname}${randomNumbers}`;
};