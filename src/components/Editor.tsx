
import React, { useEffect, useRef, useState } from 'react';

interface EditorProps {
  value: string;
  onChange: (content: string) => void;
  isEncrypted: boolean;
}

export const Editor: React.FC<EditorProps> = ({ value, onChange, isEncrypted }) => {
  const [lineNumbers, setLineNumbers] = useState<number[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Update line numbers when content changes
  useEffect(() => {
    const lines = value.split('\n').length;
    const newLineNumbers = Array.from({ length: lines }, (_, i) => i + 1);
    setLineNumbers(newLineNumbers);
  }, [value]);

  // Handle textarea changes
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = event.target.value;
    onChange(newContent);
  };

  // Tab key handling for indentation
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      
      const textarea = textareaRef.current;
      if (!textarea) return;
      
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);
      
      // Set cursor position after indent
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div className="editor-container h-full relative">
      {!isEncrypted && (
        <div className="editor-line-numbers">
          {lineNumbers.map((num) => (
            <div key={num} className="editor-line-number">
              {num}
            </div>
          ))}
        </div>
      )}
      <textarea
        ref={textareaRef}
        className="editor-textarea custom-scrollbar"
        style={{ paddingLeft: isEncrypted ? '1.5rem' : '3.5rem' }}
        value={isEncrypted ? '*** This content is encrypted ***' : value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Start writing in Markdown..."
        disabled={isEncrypted}
        spellCheck={false}
      />
    </div>
  );
};
