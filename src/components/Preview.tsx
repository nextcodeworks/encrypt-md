import React from 'react';
import { markdownToHtml } from '@/utils/markdownUtils';
import 'highlight.js/styles/atom-one-dark.css'; // For code highlighting

interface PreviewProps {
  markdown: string;
  isEncrypted: boolean;
}

export const Preview: React.FC<PreviewProps> = ({ markdown, isEncrypted }) => {
  const html = isEncrypted 
    ? '<div class="p-10 text-center text-muted-foreground"><p>Content is encrypted</p><p>Decrypt to view content</p></div>'
    : markdownToHtml(markdown);

  return (
    <div className="h-full overflow-auto bg-card rounded custom-scrollbar">
      <div
        className="markdown-preview"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};
