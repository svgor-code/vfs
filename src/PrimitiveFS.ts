import { FileStorage } from "./domain/interfaces";

export class PrimitiveFileStorage implements FileStorage {
  fileStorage;

  constructor(data: Record<string, string>) {
    this.fileStorage = data;
  }

  async read(name: string): Promise<any> {
    return this.fileStorage[name];
  }

  async write(name: string, content: string): Promise<boolean> {
    this.fileStorage[name] = content;

    return true;
  }

  async remove(name: string): Promise<boolean> {
    delete this.fileStorage[name];
    return true;
  }

  async exist(name: string): Promise<boolean> {
    return Boolean(this.fileStorage[name]);
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