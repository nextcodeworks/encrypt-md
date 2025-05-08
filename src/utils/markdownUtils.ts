import { marked } from 'marked';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css'; // We'll import this directly in Preview.tsx instead

// Configure marked with highlight.js for code highlighting
marked.setOptions({
  // @ts-ignore - The highlight property exists in the MarkedOptions but TypeScript doesn't recognize it
  highlight: function(code: string, lang: string) {
    try {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value;
      }
      return hljs.highlightAuto(code).value;
    } catch (e) {
      console.error('Highlight error:', e);
      return code;
    }
  },
  breaks: true,
  gfm: true,
  langPrefix: 'language-' // Add a prefix for language-specific styling
});

// Custom renderer to add language labels to code blocks
const renderer = new marked.Renderer();
const originalCodeRenderer = renderer.code;

// Fixed renderer function signature to match the expected type in marked library
renderer.code = function(code: string, language?: string, escaped?: boolean) {
  // Get the base rendering from the original renderer
  const renderedCode = originalCodeRenderer.call(this, code, language, escaped);
  
  if (language) {
    // Add language label and wrap in a container
    return `
      <div class="code-block-container">
        <div class="code-language-label">${language}</div>
        ${renderedCode}
      </div>
    `;
  }
  
  return renderedCode;
};

marked.use({ renderer });

// Convert markdown to HTML with sanitization
export const markdownToHtml = (markdown: string): string => {
  try {
    // First convert markdown to HTML
    const rawHtml = marked.parse(markdown) as string;
    
    // Then sanitize the HTML to prevent XSS attacks
    const sanitizedHtml = DOMPurify.sanitize(rawHtml);
    
    return sanitizedHtml;
  } catch (error) {
    console.error('Markdown conversion error:', error);
    return `<p>Error rendering markdown</p>`;
  }
};

// Count words in markdown
export const countWords = (markdown: string): number => {
  // Strip markdown syntax and count words
  const text = markdown
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`.*?`/g, '') // Remove inline code
    .replace(/\[.*?\]\(.*?\)/g, '') // Remove links
    .replace(/[#*_~`]/g, '') // Remove single characters used in markdown
    .trim();
    
  const words = text.split(/\s+/).filter(Boolean);
  return words.length;
};

// Estimate reading time
export const estimateReadingTime = (markdown: string): number => {
  const words = countWords(markdown);
  // Average reading speed: 200 words per minute
  const minutes = Math.ceil(words / 200);
  return Math.max(1, minutes); // At least 1 minute
};