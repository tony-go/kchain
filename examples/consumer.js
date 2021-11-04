import Autobase from "autobase";
import Corestore from "corestore";
import RAM from "random-access-memory";

import { KeyChain } from "../core.js";

const store = new Corestore(RAM);

const keychain = await new KeyChain("rqa", { store })
  .ready([process.argv[2]]);

await keychain.addKey("FOO", new Date().toDateString());
console.log(await keychain.all());
console.log(await keychain.getConnectionInfo());