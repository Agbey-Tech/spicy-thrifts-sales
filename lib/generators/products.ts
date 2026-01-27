type SKUOptions = {
  size?: string;
  color?: string;
  uniqueSuffix?: boolean;
};

export function generateSKU(name: string, options?: SKUOptions): string {
  if (!name) return "";

  // 1. Clean the name
  const cleaned = name.replace(/[^a-zA-Z0-9\s]/g, "").trim();

  const words = cleaned.split(/\s+/);

  let baseSKU = "";

  // 2. Handle single-word vs multi-word
  if (words.length === 1) {
    baseSKU = words[0].substring(0, 3);
  } else {
    baseSKU = words.map((word) => word[0]).join("");
  }

  // 3. Optional parts
  const sizePart = options?.size ? `-${options.size.toUpperCase()}` : "";
  const colorPart = options?.color
    ? `-${options.color.substring(0, 3).toUpperCase()}`
    : "";

  const uniquePart = options?.uniqueSuffix
    ? `-${Math.random().toString(36).substring(2, 5).toUpperCase()}`
    : "";

  return `${baseSKU.toUpperCase()}${sizePart}${colorPart}${uniquePart}`;
}
