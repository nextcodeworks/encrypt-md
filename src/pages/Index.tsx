import React, { useState, useEffect, useCallback } from 'react';
import { Editor } from '@/components/Editor';
import { Preview } from '@/components/Preview';
import { Header } from '@/components/Header';
import WelcomeScreen from '@/components/WelcomeScreen';
import { 
  encryptContent, 
  decryptContent, 
  generateEncryptionKey, 
  isValidKey 
} from '@/utils/encryptionUtils';
import { countWords, estimateReadingTime } from '@/utils/markdownUtils';
import { useToast } from '@/components/ui/use-toast';
import { 
  ResizablePanelGroup, 
  ResizablePanel, 
  ResizableHandle 
} from '@/components/ui/resizable';
import { DecryptDialog } from '@/components/DecryptDialog';
import { EncryptDialog } from '@/components/EncryptDialog';
import { UnsavedChangesDialog } from '@/components/UnsavedChangesDialog';
import { useFileManager } from '@/components/FileManager';
import { File } from '@/types/fileTypes';
import { FileTab } from '@/components/FileTab';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_MARKDOWN = `# Welcome to Encrypt.MD!

This is a **privacy-focused** markdown editor with encryption support.

## Getting Started

1. Write your content in markdown format
2. Use the **Encrypt** button when you're ready to secure your document
3. Save your encryption key in a safe place

## Features

- Live markdown preview
- AES encryption
- Word count and reading time estimation
- Syntax highlighting

> Your privacy matters! All encryption happens locally in your browser.

\`\`\`javascript
// Example code block with syntax highlighting
function secureYourNotes() {
  const content = "My secret notes";
  const key = generateEncryptionKey();
  return encrypt(content, key);
}
\`\`\`

Enjoy writing in a secure environment!
`;

const createNewFile = (name: string = 'untitled.md', content: string = DEFAULT_MARKDOWN): File => ({
  id: uuidv4(),
  name,
  content,
  isEncrypted: false,
  encryptedContent: null,
  unsavedChanges: false
});

const Index = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [encryptionKey, setEncryptionKey] = useState<string | null>(null);
  
  const [isDecryptDialogOpen, setIsDecryptDialogOpen] = useState(false);
  const [isEncryptDialogOpen, setIsEncryptDialogOpen] = useState(false);
  const [isFileUnsavedDialogOpen, setIsFileUnsavedDialogOpen] = useState(false);
  const [decryptError, setDecryptError] = useState('');
  const [pendingAction, setPendingAction] = useState<{
    type: 'close' | 'new' | 'open';
    fileId?: string;
  } | null>(null);
  
  const { toast } = useToast();
  const { openFile, saveFile } = useFileManager();
  
  const activeFile = files.find(file => file.id === activeFileId);
  
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);

  // Initialize with empty state instead of a default file
  useEffect(() => {
    // Start with no files open - will show the welcome screen
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Save with Ctrl+S / Cmd+S
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (activeFileId) {
          handleSaveFile();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeFileId, files]);

  // Update word count and reading time when content changes
  useEffect(() => {
    if (activeFile && !activeFile.isEncrypted) {
      const words = countWords(activeFile.content);
      const time = estimateReadingTime(activeFile.content);
      setWordCount(words);
      setReadingTime(time);
    } else {
      setWordCount(0);
      setReadingTime(0);
    }
  }, [activeFile]);

  // Update content of the active file
  const updateActiveFileContent = (content: string) => {
    if (!activeFileId) return;
    
    setFiles(prevFiles => 
      prevFiles.map(file => 
        file.id === activeFileId 
          ? { ...file, content, unsavedChanges: true } 
          : file
      )
    );
  };

  // Switch to a different file tab
  const handleTabChange = (fileId: string) => {
    setActiveFileId(fileId);
  };

  // Close a file tab
  const handleCloseTab = (fileId: string) => {
    const fileToClose = files.find(file => file.id === fileId);
    
    if (fileToClose?.unsavedChanges) {
      setPendingAction({ type: 'close', fileId });
      setIsFileUnsavedDialogOpen(true);
      return;
    }
    
    closeTab(fileId);
  };

  // Actually close the tab
  const closeTab = (fileId: string) => {
    // Remove the file
    setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
    
    // Handle active file selection after closing
    if (activeFileId === fileId) {
      const remainingFiles = files.filter(file => file.id !== fileId);
      
      if (remainingFiles.length > 0) {
        // Set active tab to the one before this one, or the next one if this is the first tab
        const fileIndex = files.findIndex(file => file.id === fileId);
        const newActiveIndex = Math.max(0, fileIndex - 1);
        setActiveFileId(remainingFiles[newActiveIndex].id);
      } else {
        // No files left, clear active ID
        setActiveFileId(null);
      }
    }
  };

  // Encrypt the current file
  const handleEncrypt = () => {
    if (!activeFileId) return;
    
    try {
      const key = generateEncryptionKey();
      const encrypted = encryptContent(activeFile!.content, key);
      
      setEncryptionKey(key);
      
      setFiles(prevFiles => 
        prevFiles.map(file => 
          file.id === activeFileId 
            ? { 
                ...file, 
                isEncrypted: true, 
                encryptedContent: encrypted,
                unsavedChanges: true 
              } 
            : file
        )
      );
      
      setIsEncryptDialogOpen(true);
    } catch (error) {
      toast({
        title: "Encryption Failed",
        description: "There was an error encrypting your content.",
        variant: "destructive",
      });
    }
  };

  // Open decrypt dialog
  const handleDecryptClick = () => {
    setDecryptError('');
    setIsDecryptDialogOpen(true);
  };

  // Attempt to decrypt with provided key
  const handleDecrypt = (key: string) => {
    if (!activeFileId || !activeFile?.encryptedContent) return;
    
    try {
      if (!isValidKey(activeFile.encryptedContent, key)) {
        setDecryptError('Invalid encryption key');
        return;
      }
      
      const decrypted = decryptContent(activeFile.encryptedContent, key);
      
      setFiles(prevFiles => 
        prevFiles.map(file => 
          file.id === activeFileId 
            ? { 
                ...file, 
                content: decrypted,
                isEncrypted: false, 
                encryptedContent: null,
                unsavedChanges: true
              } 
            : file
        )
      );
      
      setEncryptionKey(null);
      setIsDecryptDialogOpen(false);
      
      toast({
        title: "Content Decrypted",
        description: "Your content has been successfully decrypted.",
      });
    } catch (error) {
      setDecryptError('Invalid encryption key');
    }
  };

  // Save the current file
  const handleSaveFile = async () => {
    if (!activeFileId) return;
    
    const fileContent = activeFile!.isEncrypted 
      ? activeFile!.encryptedContent 
      : activeFile!.content;
      
    if (!fileContent) return;
    
    const saved = await saveFile(fileContent, activeFile!.isEncrypted);
    
    if (saved) {
      // Extract filename from save dialog if available (implementation varies)
      let fileName = activeFile!.name;
      
      setFiles(prevFiles => 
        prevFiles.map(file => 
          file.id === activeFileId 
            ? { ...file, name: fileName, unsavedChanges: false } 
            : file
        )
      );
      
      setIsFileUnsavedDialogOpen(false);
      
      if (pendingAction?.type === 'close' && pendingAction.fileId) {
        closeTab(pendingAction.fileId);
        setPendingAction(null);
      }
    }
  };

  // Create a new file
  const handleNewFile = () => {
    const newFile = createNewFile();
    setFiles(prevFiles => [...prevFiles, newFile]);
    setActiveFileId(newFile.id);
    
    toast({
      title: "New File Created",
      description: "Started a new markdown document.",
    });
  };

  // Handle open file button click
  const handleOpenFile = async () => {
    try {
      const result = await openFile();
      
      // Create new file with the opened content
      const fileExtension = result.isEncrypted ? '.mdlock' : '.md';
      const newFileName = `document${fileExtension}`;
      
      const newFile: File = {
        id: uuidv4(),
        name: newFileName,
        content: result.isEncrypted ? '' : result.content,
        isEncrypted: result.isEncrypted,
        encryptedContent: result.isEncrypted ? result.encrypted || null : null,
        unsavedChanges: false
      };
      
      setFiles(prevFiles => [...prevFiles, newFile]);
      setActiveFileId(newFile.id);
      
      toast({
        title: "File Opened",
        description: `Your ${result.isEncrypted ? 'encrypted' : 'markdown'} file has been loaded.`,
      });
      
      if (result.isEncrypted) {
        handleDecryptClick();
      }
    } catch (error) {
      // User cancelled or error occurred, handled in FileManager
    }
  };

  // Handle pending action after unsaved changes dialog
  const handlePendingAction = () => {
    setIsFileUnsavedDialogOpen(false);
    
    if (pendingAction?.type === 'close' && pendingAction.fileId) {
      closeTab(pendingAction.fileId);
    } else if (pendingAction?.type === 'new') {
      handleNewFile();
    } else if (pendingAction?.type === 'open') {
      handleOpenFile();
    }
    
    setPendingAction(null);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header
        isEncrypted={activeFile?.isEncrypted || false}
        encryptionKey={encryptionKey}
        onEncrypt={handleEncrypt}
        onDecrypt={handleDecryptClick}
        onNewFile={handleNewFile}
        onOpenFile={handleOpenFile}
        onSaveFile={handleSaveFile}
        wordCount={wordCount}
        readingTime={readingTime}
      />
      
      {files.length > 0 ? (
        <>
          {/* File Tabs */}
          <div className="flex items-center bg-muted border-b border-border overflow-x-auto">
            {files.map(file => (
              <FileTab 
                key={file.id}
                name={file.name}
                isActive={file.id === activeFileId}
                isUnsaved={file.unsavedChanges}
                isEncrypted={file.isEncrypted}
                onClick={() => handleTabChange(file.id)}
                onClose={() => handleCloseTab(file.id)}
              />
            ))}
          </div>
          
          {activeFile && (
            <ResizablePanelGroup 
              direction="horizontal" 
              className="flex-1 overflow-hidden p-4 gap-4"
            >
              <ResizablePanel defaultSize={50} minSize={20} className="h-full overflow-hidden rounded border border-border">
                <Editor
                  value={activeFile.content}
                  onChange={updateActiveFileContent}
                  isEncrypted={activeFile.isEncrypted}
                />
              </ResizablePanel>
              
              <ResizableHandle withHandle />
              
              <ResizablePanel defaultSize={50} minSize={20} className="h-full overflow-hidden rounded border border-border">
                <Preview
                  markdown={activeFile.content}
                  isEncrypted={activeFile.isEncrypted}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          )}
        </>
      ) : (
        <WelcomeScreen onNewFile={handleNewFile} onOpenFile={handleOpenFile} />
      )}

      {/* Decrypt Dialog */}
      <DecryptDialog 
        open={isDecryptDialogOpen} 
        onOpenChange={setIsDecryptDialogOpen}
        onDecrypt={handleDecrypt}
        decryptError={decryptError}
      />

      {/* Encrypt Dialog */}
      <EncryptDialog
        open={isEncryptDialogOpen}
        onOpenChange={setIsEncryptDialogOpen}
        encryptionKey={encryptionKey}
      />

      {/* Unsaved Changes Dialog */}
      <UnsavedChangesDialog
        open={isFileUnsavedDialogOpen}
        onOpenChange={setIsFileUnsavedDialogOpen}
        onSave={handleSaveFile}
        onDiscard={handlePendingAction}
      />
    </div>
  );
};

export default Index;
