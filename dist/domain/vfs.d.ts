import { DEntry } from "./dentry";
import { FileStorage } from "./interfaces";
export declare class VFS {
    dentryTree: DEntry;
    fileStorage: FileStorage;
    dentryTreeCash: Record<string, DEntry>;
    constructor(fileStorage: FileStorage);
    find(path: string): Promise<DEntry>;
    open(path: string): Promise<any>;
    create(path: string, content: string): Promise<boolean>;
    touch(path: string, content: string): Promise<DEntry>;
    mkdir(path: string): Promise<DEntry>;
    scanDir(path: string): Promise<DEntry[] | null>;
    move(name: string, target: string): Promise<boolean>;
    remove(name: string): Promise<boolean>;
}
