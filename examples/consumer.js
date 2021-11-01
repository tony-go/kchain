import { KeyChain } from "../bin.js";

const keychain = await new KeyChain("rqa")
  .fetchDistantCore(process.argv[2]);

console.log(await keychain.all());
console.log(keychain.getConnectionInfo());