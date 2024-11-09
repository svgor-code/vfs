import { FileStorage } from "./interfaces";

export class INode {
  fileStorage: FileStorage;
  type: 'directory' | 'file';
  
  constructor(fileStorage: FileStorage) {
    this.fileStorage = fileStorage;
  }

  async setType(path: string) {
    const fileExist = await this.fileStorage.exist(path);
    console.log('path =======',path, fileExist)
    this.type = fileExist ? 'file' : 'directory';

    return this.type;
  }
}