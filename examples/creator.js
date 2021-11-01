import { KeyChain } from "../bin.js";

const keychain = await new KeyChain("restqa")
  .ready();

await keychain.addKey("GITHUB", "3828883");
await keychain.addKey("GITLAB", "DKDKSKSK");
await keychain.addKey("TWITTER", "DJJZHDBDB");

console.log(keychain.getConnectionInfo());
console.log(await keychain.all());