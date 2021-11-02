import Autobase from "autobase";
import Corestore from "corestore";
import RAM from "random-access-memory";

import { KeyChain } from "../core.js";

const store = new Corestore(RAM);
const autobase = new Autobase();
await autobase.ready();

const keychain = await new KeyChain("restqa", { store, autobase })
  .ready();

await keychain.addKey("GITHUB", "3828883");
await keychain.addKey("GITLAB", "DKDKSKSK");
await keychain.addKey("TWITTER", "DJJZHDBDB");

console.log(keychain.getConnectionInfo());
console.log(await keychain.all());