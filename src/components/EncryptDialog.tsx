
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { EyeIcon, EyeOffIcon, CopyIcon, CheckIcon } from 'lucide-react';

interface EncryptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  encryptionKey: string | null;
}

export const EncryptDialog: React.FC<EncryptDialogProps> = ({
  open,
  onOpenChange,
  encryptionKey,
}) => {
  const [showEncryptionKey, setShowEncryptionKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyKeyToClipboard = () => {
    if (encryptionKey) {
      navigator.clipboard.writeText(encryptionKey);
      setCopied(true);
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>File Encrypted Successfully</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Save this encryption key in a secure location. Without it, you won't be able to decrypt your file.
          </p>
          
          <div className="flex items-center space-x-2 mb-2">
            <Label htmlFor="encryptionKey" className="text-left">
              Encryption Key:
            </Label>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowEncryptionKey(!showEncryptionKey)}
              className="h-8 w-8 p-0"
            >
              {showEncryptionKey ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
            </Button>
          </div>
          
          <div className="flex">
            <Input
              id="encryptionKey"
              readOnly
              value={encryptionKey || ''}
              type={showEncryptionKey ? 'text' : 'password'}
              className="font-mono flex-1"
            />
            <Button 
              onClick={copyKeyToClipboard} 
              className="ml-2"
            >
              {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
              {copied ? 'Copied!' : 'Copy Key'}
            </Button>
          </div>
          
          <p className="text-sm text-destructive mt-4 font-bold">
            WARNING: If you lose this key, your data will be permanently inaccessible!
          </p>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            I've Saved My Key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
