import React from 'react';
import { Button } from '@/components/ui/button';
import { FilePlusIcon, FolderOpenIcon } from 'lucide-react';

interface WelcomeScreenProps {
  onNewFile: () => void;
  onOpenFile: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNewFile, onOpenFile }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-muted/40">
      <h1 className="text-4xl font-bold text-muted-foreground mb-8">Encrypt.MD</h1>
      
      <div className="flex flex-col gap-4 items-center">
        <Button 
          variant="link" 
          size="lg" 
          onClick={onNewFile}
          className="text-blue-500 hover:text-blue-700 flex items-center gap-2"
        >
          <FilePlusIcon size={20} />
          New File
        </Button>
        
        <Button 
          variant="link"
          size="lg"
          onClick={onOpenFile}
          className="text-blue-500 hover:text-blue-700 flex items-center gap-2"
        >
          <FolderOpenIcon size={20} />
          Open a File
        </Button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
