export interface File {
    id: string;
    name: string;
    content: string;
    isEncrypted: boolean;
    encryptedContent: string | null;
    unsavedChanges: boolean;
}