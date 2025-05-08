import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface DecryptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDecrypt: (key: string) => void;
  decryptError: string;
}

export const DecryptDialog: React.FC<DecryptDialogProps> = ({
  open,
  onOpenChange,
  onDecrypt,
  decryptError,
}) => {
  const [decryptKey, setDecryptKey] = useState('');

  const handleDecrypt = () => {
    onDecrypt(decryptKey);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Decrypt Content</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="decryptKey" className="text-left block mb-2">
            Enter your encryption key
          </Label>
          <Input
            id="decryptKey"
            className="font-mono"
            type="password"
            value={decryptKey}
            onChange={(e) => {
              setDecryptKey(e.target.value);
            }}
            placeholder="Paste your encryption key here"
          />
          {decryptError && (
            <p className="text-sm text-destructive mt-2">{decryptError}</p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleDecrypt}>
            Decrypt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};