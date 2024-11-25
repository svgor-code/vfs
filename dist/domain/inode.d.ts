import { FileStorage } from "./interfaces";
export declare class INode {
    fileStorage: FileStorage;
    type: 'directory' | 'file';
    constructor(fileStorage: FileStorage);
    setType(path: string): Promise<"directory" | "file">;
}
