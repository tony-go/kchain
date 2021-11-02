import Autobase from "autobase";
import Corestore from "corestore";
import RAM from "random-access-memory";

import { KeyChain } from "../core.js";

const store = new Corestore(RAM);
const autobase = new Autobase();
await autobase.ready();

const keychain = await new KeyChain("rqa", { store, autobase })
  .fetchDistantCore(process.argv[2]);

console.log(await keychain.all());
console.log(keychain.getConnectionInfo());