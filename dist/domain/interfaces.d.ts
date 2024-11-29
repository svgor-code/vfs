export interface FileStorage {
    read(path: string): Promise<any>;
    write(path: string, content?: string): Promise<boolean>;
    remove(path: string): Promise<boolean>;
    isDir(path: string): Promise<boolean>;
    list(path: string): Promise<string[]>;
}
