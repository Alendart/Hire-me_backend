export interface FileEntity {
    id: number | null;
    userFileName: string;
    fileName: string;
    userId: string;
}

export interface NewFileEntity extends Omit<FileEntity,"id"> {
    id?: number;
}

export type SimpleFileEntity = Omit<FileEntity,"id" | "userId">


