import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FileTabProps {
  name: string;
  isActive: boolean;
  isUnsaved: boolean;
  isEncrypted: boolean;
  onClick: () => void;
  onClose: () => void;
}

export const FileTab: React.FC<FileTabProps> = ({
  name,
  isActive,
  isUnsaved,
  isEncrypted,
  onClick,
  onClose
}) => {
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <div 
      className={cn(
        "flex items-center h-8 px-3 cursor-pointer border-r border-border",
        isActive ? "bg-card" : "bg-muted hover:bg-muted/80"
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-2 max-w-[180px]">
        <span className="truncate text-sm">{name}</span>
        {isUnsaved && (
          <span className="text-encrypt-primary">*</span>
        )}
        {isEncrypted && (
          <span className="text-xs text-muted-foreground">(encrypted)</span>
        )}
      </div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-5 w-5 ml-2 rounded-sm opacity-60 hover:opacity-100"
        onClick={handleClose}
      >
        <X size={14} />
      </Button>
    </div>
  );
};
