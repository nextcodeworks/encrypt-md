
import React from 'react';
import { Button } from '@/components/ui/button';
import { FilePlusIcon, FolderOpenIcon, SaveIcon } from 'lucide-react';

interface FileControlsProps {
  onNew: () => void;
  onOpen: () => void;
  onSave: () => void;
}

export const FileControls: React.FC<FileControlsProps> = ({ onNew, onOpen, onSave }) => {
  return (
    <div className="flex items-center space-x-2">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onNew}
        className="flex items-center gap-1"
        title="Create New File"
      >
        <FilePlusIcon size={16} />
        <span className="sr-only md:not-sr-only">New</span>
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onOpen}
        className="flex items-center gap-1"
        title="Open File from Disk"
      >
        <FolderOpenIcon size={16} />
        <span className="sr-only md:not-sr-only">Open</span>
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onSave}
        className="flex items-center gap-1"
        title="Save File to Disk"
      >
        <SaveIcon size={16} />
        <span className="sr-only md:not-sr-only">Save</span>
      </Button>
    </div>
  );
};
