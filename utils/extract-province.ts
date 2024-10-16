export function extractProvince(address: string): string {
  const parts = address.split(",");
  return parts[parts.length - 1].trim();
};