import { FileStorage } from "./domain/interfaces";

export class PrimitiveFileStorage implements FileStorage {
  fileStorage;

  constructor(data: Record<string, string | undefined>) {
    this.fileStorage = data;
  }

  async read(path: string): Promise<any> {
    return this.fileStorage[path];
  }

  async write(path: string, content: string): Promise<boolean> {
    this.fileStorage[path] = content;

    return true;
  }

  async remove(path: string): Promise<boolean> {
    delete this.fileStorage[path];
    return true;
  }

  async isDir(path: string): Promise<boolean> {
    // console.log(Object.keys(this.fileStorage), path, this.fileStorage[path]);
    return Object.keys(this.fileStorage).includes(path) && !this.fileStorage[path];
  }

  async list(path: string): Promise<string[]> {
    const paths: string[] = [];
    const pathWithTrailingSlash = path.endsWith("/") ? path : path + "/";

    for (const key of Object.keys(this.fileStorage)) {
      if (key.startsWith(pathWithTrailingSlash)) {
        const remainingPath = key.slice(pathWithTrailingSlash.length);
        const [firstSegment, ...rest] = remainingPath.split("/");

        paths.push(firstSegment);
      }
    }

    return paths;
  }
}