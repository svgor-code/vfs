export interface FileStorage {
    read(name: string): Promise<any>;
    write(name: string, content: string): Promise<boolean>;
    remove(name: string): Promise<boolean>;
    exist(name: string): Promise<boolean>;
    list(path: string): Promise<string[]>;
}
