import { Marked, Renderer } from 'marked';
import DOMPurify from 'dompurify';

export type DocumentHeading = { id: string; text: string; depth: number };

export function renderRequirements(source: string) {
  if (!source.trim()) throw new Error('需求文档为空');
  const headings: DocumentHeading[] = [];
  const renderer = new Renderer();
  renderer.heading = function ({ tokens, depth }) {
    const content = this.parser.parseInline(tokens);
    const id = `requirement-${headings.length + 1}`;
    const plainText = DOMPurify.sanitize(content, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
    const decoder = document.createElement('textarea');
    decoder.innerHTML = plainText;
    headings.push({ id, text: decoder.value, depth });
    return `<h${depth} id="${id}" tabindex="-1">${content}</h${depth}>\n`;
  };
  const parser = new Marked({ gfm: true, renderer });
  const html = DOMPurify.sanitize(parser.parse(source, { async: false }), {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ['style', 'form', 'input', 'button', 'iframe'],
  });
  return { html, headings };
}
