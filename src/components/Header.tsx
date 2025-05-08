
import React from 'react';
import { FileControls } from './FileControls';
import { Button } from '@/components/ui/button';
import { LockIcon, UnlockIcon } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  isEncrypted: boolean;
  encryptionKey: string | null;
  onEncrypt: () => void;
  onDecrypt: () => void;
  onNewFile: () => void;
  onOpenFile: () => void;
  onSaveFile: () => void;
  wordCount: number;
  readingTime: number;
}

export const Header: React.FC<HeaderProps> = ({
  isEncrypted,
  onEncrypt,
  onDecrypt,
  onNewFile,
  onOpenFile,
  onSaveFile,
  wordCount,
  readingTime,
}) => {
  return (
    <header className="w-full bg-card border-b border-border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-encrypt-primary to-encrypt-accent bg-clip-text text-transparent">
            Encrypt.MD
          </h1>
          <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
            {isEncrypted ? 'Encrypted' : 'Plaintext'}
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          <div className="text-sm text-muted-foreground">
            <span>{wordCount} words</span>
            <span className="mx-2">•</span>
            <span>{readingTime} min read</span>
          </div>
          
          <FileControls 
            onNew={onNewFile}
            onOpen={onOpenFile}
            onSave={onSaveFile}
          />
          
          {isEncrypted ? (
            <Button variant="outline" onClick={onDecrypt} className="flex items-center gap-2">
              <UnlockIcon size={16} />
              Decrypt
            </Button>
          ) : (
            <Button onClick={onEncrypt} className="bg-encrypt-primary hover:bg-encrypt-secondary flex items-center gap-2">
              <LockIcon size={16} />
              Encrypt
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
