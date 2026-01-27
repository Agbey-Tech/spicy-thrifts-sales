const MAX_CATEGORY_CODE_LENGTH = 20;

export function generateCategoryCode(name: string): string {
  if (!name) return "";

  const cleaned = name.trim().replace(/[^a-zA-Z0-9\s]/g, "");

  const words = cleaned.split(/\s+/);

  let code = "";

  if (words.length === 1) {
    // Single word → first 5 chars
    code = words[0].length <= 10 ? words[0] : words[0].substring(0, 5);
  } else if (words.length === 2) {
    // Two words → 3 + 3 chars
    code = `${words[0].substring(0, 3)}_${words[1].length <= 10 ? words[1] : words[1].substring(0, 3)}`;
  } else {
    // 3+ words → initials
    code = words.map((w) => w[0]).join("");
  }

  return code.toUpperCase().substring(0, MAX_CATEGORY_CODE_LENGTH);
}
