export function convertImageToBase64(image: Express.Multer.File) {
  const mimeType = image.mimetype;
  const base64Image = image.buffer.toString("base64");

  return `data:${mimeType};base64,${base64Image}`;
};