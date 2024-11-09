import { FileStorage } from "./domain/interfaces";
import { VFS } from "./domain/vfs";
import { PrimitiveFileStorage } from "./PrimitiveFS";

const primitiveFS = new PrimitiveFileStorage({});
const vfs = new VFS(primitiveFS);

const main = async () => {
  // const dentry = await vfs.find('/dir/second');
  await vfs.move('/dir/subdir/file2', '/');
  const dentry = await vfs.scanDir('/');

  console.log(primitiveFS.fileStorage);
  console.log(dentry);

  await vfs.move('/file2', '/dir/subdir');
  const dentry2 = await vfs.scanDir('/dir/subdir');

  console.log(primitiveFS.fileStorage);
  console.log(dentry2);
};

main();
