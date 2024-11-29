import { FileStorage } from "./domain/interfaces";
export declare class PrimitiveFileStorage implements FileStorage {
    fileStorage: any;
    constructor(data: Record<string, string | undefined>);
    read(path: string): Promise<any>;
    write(path: string, content: string): Promise<boolean>;
    remove(path: string): Promise<boolean>;
    isDir(path: string): Promise<boolean>;
    list(path: string): Promise<string[]>;
}
