import { INode } from "./inode";
import { FileStorage } from "./interfaces";

export class DEntry {
  fileStorage: FileStorage;
  name: string;
  indexNode: INode;
  parent: DEntry | null;
  subdir: DEntry[] | null;

  constructor(
    name: string,
    parent: DEntry | null = null,
    fileStorage: FileStorage
  ) {
    this.name = name;
    this.parent = parent;
    this.fileStorage = fileStorage;

    if (!parent) {
      this.indexNode = new INode(fileStorage);
      this.indexNode.type = "directory";
      this.subdir = [];
    }
  }

  getDentryPath() {
    let currentDentry: DEntry = this;
    let path = currentDentry.name;

    while (currentDentry.parent && currentDentry.parent?.name !== "/") {
      path = `${currentDentry.parent?.name}/${path}`;
      currentDentry = currentDentry.parent;
    }

    return `/${path}`;
  }

  async linkIndexNode() {
    const dentryPath = this.getDentryPath();
    this.indexNode = new INode(this.fileStorage);
    const type = await this.indexNode.setType(dentryPath);

    if (type === "directory") {
      this.subdir = [];

      if (this.parent) {
        this.parent.subdir = [...(this.parent.subdir || []), this];
      }
    }
  }
}
