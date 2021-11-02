import Corestore from "corestore";
import RAM from "random-access-memory";

import { KeyChain } from "../core.js";

const store = new Corestore(RAM);

const keychain = await new KeyChain("restqa", { store })
  .ready();

await keychain.addKey("GITHUB", "3828883");
await keychain.addKey("GITLAB", "DKDKSKSK");
await keychain.addKey("TWITTER", "DJJZHDBDB");

console.log(await keychain.all());
console.log("public key", keychain.getConnectionInfo());