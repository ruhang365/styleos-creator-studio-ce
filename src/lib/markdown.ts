export function bullets(items: string[]) {
  return items.filter(Boolean).map((item) => `- ${item}`).join("\n");
}

export function heading(title: string, body: string) {
  return `## ${title}\n\n${body.trim()}`;
}

export function copyableMarkdown(markdown: string) {
  return markdown.trim() + "\n";
}
