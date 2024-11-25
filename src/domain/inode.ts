import { FileStorage } from "./interfaces";

export class INode {
  fileStorage: FileStorage;
  type: "directory" | "file";

  constructor(fileStorage: FileStorage) {
    this.fileStorage = fileStorage;
  }

  async setType(path: string) {
    const isDir = await this.fileStorage.isDir(path);
    this.type = isDir ? "directory" : "file";

    return this.type;
  }
}
