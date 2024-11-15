export const createProjection = (defaultFields: string[], exclude?: string): Record<string, number> => {
  const projection: Record<string, number> = {};
  let excludeFields: string[] = [];

  if (exclude) {
    excludeFields = exclude.split(",").map((field) => field.trim());
  }

  defaultFields.forEach((field) => {
    if (!excludeFields.includes(field)) {
      projection[field] = 1;
    }
  });

  return projection;
};