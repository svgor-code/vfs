import { INode } from "./inode";
import { FileStorage } from "./interfaces";
export declare class DEntry {
    fileStorage: FileStorage;
    name: string;
    indexNode: INode;
    parent: DEntry | null;
    subdir: DEntry[] | null;
    constructor(name: string, parent: DEntry | null, fileStorage: FileStorage);
    getDentryPath(): string;
    linkIndexNode(): Promise<void>;
}
