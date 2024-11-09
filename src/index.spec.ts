import { describe, beforeEach, it } from "node:test";
import assert from "node:assert";
import { VFS } from "./domain/vfs";
import { PrimitiveFileStorage } from "./PrimitiveFS";
import { FileStorage } from "./domain/interfaces";

const mockData = {
  "/index": "Tratr-trasdf-dsfs",
  "/dir/second": "asdd asdd",
  "/dir/subdir/file1": "some content",
  "/dir/subdir/file2": "another content",
};

describe("vfs test", () => {
  let primitiveFS: FileStorage;
  let vfs: VFS;

  beforeEach(async () => {
    primitiveFS = new PrimitiveFileStorage(structuredClone(mockData));
    vfs = new VFS(primitiveFS);
  });

  it("should open file and read content", async () => {
    const path = "/dir/subdir/file1";
    const fileContent = await vfs.open(path);

    assert.equal(fileContent, mockData[path]);
  });

  it("should scan directory", async () => {
    const path = "/dir";
    const scanResultEntries = await vfs.scanDir(path);
    const parsedEntries = scanResultEntries?.map((dentry) => dentry.name);

    assert.deepStrictEqual(parsedEntries, ["second", "subdir"]);
  });

  it("should move upper", async () => {
    const filePath = "/dir/subdir/file1";
    const targetPath = "/";

    const isMoved = await vfs.move(filePath, targetPath);

    const isExistInFS = await primitiveFS.exist("/file1");
    const isExistInFSOldPath = await primitiveFS.exist(filePath);

    assert.ok(isMoved);
    assert.ok(isExistInFS);
    assert.ok(!isExistInFSOldPath);

    const scanResultTarget = await vfs.scanDir(targetPath);
    const parsedTargetEntries = scanResultTarget?.map((dentry) => dentry.name);
    const newEntry = scanResultTarget?.find(
      (dentry) => dentry.name === "file1"
    );

    assert.equal(newEntry?.parent?.name, "/");
    assert.deepStrictEqual(parsedTargetEntries, ["index", "dir", "file1"]);

    const scanResultOldPath = await vfs.scanDir("/dir/subdir");
    const parsedOldPathEntries = scanResultOldPath?.map(
      (dentry) => dentry.name
    );

    assert.deepStrictEqual(parsedOldPathEntries, ["file2"]);
  });

  it("should move down", async () => {
    const filePath = "/index";
    const targetPath = "/dir/subdir/";

    const isMoved = await vfs.move(filePath, targetPath);
    const isExistInFS = await primitiveFS.exist("/dir/subdir/index");
    const isExistInFSOldPath = await primitiveFS.exist(filePath);

    assert.ok(isMoved);
    assert.ok(isExistInFS);
    assert.ok(!isExistInFSOldPath);

    const scanResultTarget = await vfs.scanDir(targetPath);
    const parsedTargetEntries = scanResultTarget?.map((dentry) => dentry.name);
    const newEntry = scanResultTarget?.find(
      (dentry) => dentry.name === "index"
    );

    assert.equal(newEntry?.parent?.name, "subdir");
    assert.deepStrictEqual(parsedTargetEntries, ["file1", "file2", "index"]);

    const scanResultOldPath = await vfs.scanDir("/");
    const parsedOldPathEntries = scanResultOldPath?.map(
      (dentry) => dentry.name
    );

    assert.deepStrictEqual(parsedOldPathEntries, ["dir"]);
  });

  it("should remove file", async () => {
    const filePath = "/dir/subdir/file1";
    const filePath2 = "/index";

    const isDeleted = await vfs.remove(filePath);
    const isDeleted2 = await vfs.remove(filePath2);

    assert.ok(isDeleted);
    assert.ok(isDeleted2);

    const isExistFile = await primitiveFS.exist(filePath);
    const isExistFile2 = await primitiveFS.exist(filePath2);
    
    assert.ok(!isExistFile);
    assert.ok(!isExistFile2);

    const fileNotInDir = !(await vfs.scanDir("/dir/subdir"))?.some(
      (dentry) => dentry.name === "file1"
    );
    const fileNotInDir2 = !(await vfs.scanDir("/"))?.some(
      (dentry) => dentry.name === "index"
    );

    assert.ok(fileNotInDir);
    assert.ok(fileNotInDir2);
  });
});
