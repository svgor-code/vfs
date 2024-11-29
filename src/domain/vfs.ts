import { DEntry } from "./dentry";
import { FileStorage } from "./interfaces";

export class VFS {
  dentryTree: DEntry;
  fileStorage: FileStorage;
  dentryTreeCash: Record<string, DEntry>;

  constructor(fileStorage: FileStorage) {
    this.dentryTree = new DEntry("/", null, fileStorage);
    this.fileStorage = fileStorage;
    this.dentryTreeCash = { "/": this.dentryTree };
  }

  async find(path: string): Promise<DEntry> {
    const components = path.split("/").filter(Boolean);
    let currentDentry = this.dentryTree;

    for (const component of components) {
      const newPath =
        currentDentry.name === "/"
          ? `/${component}`
          : `${currentDentry.name}/${component}`;

      if (!this.dentryTreeCash[newPath]) {
        const newDentry = new DEntry(
          component,
          currentDentry,
          this.fileStorage
        );

        await newDentry.linkIndexNode();

        this.dentryTreeCash[newPath] = newDentry;
      }

      currentDentry = this.dentryTreeCash[newPath];
    }

    return currentDentry;
  }

  // TODO: change method main to read
  async open(path: string) {
    const dentry = await this.find(path);

    if (dentry.indexNode.type === "file") {
      const content = await this.fileStorage.read(path);
      return content;
    }

    throw new Error(`Cannot open directory as file: ${path}`);
  }

  async create(path: string, content: string) {
    const dentry = await this.find(path);
    return await this.fileStorage.write(dentry.getDentryPath(), content);
  }

  async touch(path: string, content: string) {
    if (!content) {
      throw new Error("content is required to create file");
    }

    const isWritten = await this.fileStorage.write(path, content);

    if (isWritten) {
      return await this.find(path);
    }

    throw new Error("touch method error");
  }

  async mkdir(path: string) {
    const isWritten = await this.fileStorage.write(path, null);

    if (isWritten) {
      return await this.find(path);
    }

    throw new Error("mkdir method error");
  }

  async scanDir(path: string): Promise<DEntry[] | null> {
    const dentry = await this.find(path);

    if (dentry.indexNode.type !== "directory") {
      throw new Error(
        `scanDir method is only applicable to directories: ${path}`
      );
    }

    const list = await this.fileStorage.list(path);

    const subEntries: DEntry[] = [];

    for (let entryPath of list) {
      if (!this.dentryTreeCash[entryPath]) {
        const newDentry = new DEntry(entryPath, dentry, this.fileStorage);
        await newDentry.linkIndexNode();

        this.dentryTreeCash[entryPath] = newDentry;
        subEntries.push(newDentry);
      }
    }

    return subEntries;
  }

  async move(name: string, target: string): Promise<boolean> {
    const currentDentry = await this.find(name);
    const targetDentry = await this.find(target);

    if (currentDentry.parent) {
      const currentParent = this.dentryTreeCash[currentDentry.parent.name];

      if (currentParent && currentParent.subdir) {
        currentParent.subdir = currentParent.subdir.filter(
          (dentry) => dentry.name !== currentDentry.name
        );
      }
    }

    currentDentry.parent = targetDentry;
    targetDentry.subdir = [...(targetDentry.subdir || []), currentDentry];

    const newPath = `${targetDentry.getDentryPath().replace("//", "/")}/${
      currentDentry.name
    }`.replace("//", "/");
    delete this.dentryTreeCash[currentDentry.name];

    currentDentry.name = newPath;
    this.dentryTreeCash[newPath] = currentDentry;

    const currentRecord = await this.fileStorage.read(name);
    const isSuccessRecord = await this.fileStorage.write(
      currentDentry.name,
      currentRecord
    );

    if (isSuccessRecord) {
      const isSuccessRemove = await this.fileStorage.remove(name);

      if (!isSuccessRemove) {
        throw new Error(
          "Error removing old record after successful save: ${name}"
        );
      }
    } else {
      throw new Error(
        `Error creating new record, old record not removed: ${name}`
      );
    }

    return true;
  }

  async remove(name: string): Promise<boolean> {
    const dentry = await this.find(name);

    const isRemovedFromStorage = await this.fileStorage.remove(
      dentry.getDentryPath()
    );

    if (!isRemovedFromStorage) {
      throw new Error(`Error removing record from storage: ${name}`);
    }

    if (dentry.parent && dentry.parent.subdir) {
      dentry.parent.subdir = dentry.parent.subdir.filter(
        (child) => child.name !== dentry.name
      );
    }

    delete this.dentryTreeCash[name];

    return true;
  }
}
