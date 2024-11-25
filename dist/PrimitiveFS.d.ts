import { FileStorage } from "./domain/interfaces";
export declare class PrimitiveFileStorage implements FileStorage {
    fileStorage: any;
    constructor(data: Record<string, string>);
    read(name: string): Promise<any>;
    write(name: string, content: string): Promise<boolean>;
    remove(name: string): Promise<boolean>;
    exist(name: string): Promise<boolean>;
    list(path: string): Promise<string[]>;
}
