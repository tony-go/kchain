import crypto from "crypto";

import Autobase from "autobase";
import HyperSwarm from "hyperswarm";

/**
 * TODO:
 * - [x] really use autobase
 * - [ ] try multiple writer
 * - [ ] implement distant core
 * 
 * IDEAS:
 * - [ ] have a '-e' option to export a key chain as a DOTENV file
 */

export class KeyChain {
  constructor(name, options) {
    this.store = options.store;
    this.name = name;
    this.topic = sha256("key-chain");

    this.swarm = new HyperSwarm();
    this.swarm.on("connection", (connection) => {
      this.store.replicate(connection);
    });
  }

  async ready() {
    this.core = this.store.get({ name: "local" });
    this.autobaseIndex = this.store.get({ name: "index" });
    
    await this.core.ready();

    this.autobase = new Autobase([this.core], { indexes: this.autobaseIndex });
    await this.autobase.ready();
    await this.autobase.append(JSON.stringify({}));

    this.swarm.join(Buffer.from(this.topic, "hex"));
    await this.swarm.flush();

    this.index = this.autobase.createRebasedIndex();
    await this.index.update();

    return this;
  }

  async fetchDistantCore(distantCoreKeys) {
    // TODO
  }

  getConnectionInfo () {
    return this.autobase.inputs.map(input => input.key.toString("hex"));
  }

  async addKey (key, value) {
    if (this.index.length) {
      const currentKeyChain = await this.lastChain()
      
      currentKeyChain[key] = value;
  
      await this.autobase.append(JSON.stringify(currentKeyChain));
    } else {
      await this.autobase.append(JSON.stringify({ [key]: value }));
    }

    await this.index.update();
  }

  async all () {
    return await this.lastChain();
  }

  async lastChain () {
    const rawBuffer = await this.index.get(this.index.length - 1);
    const stringValue = rawBuffer.value.toString();

    return JSON.parse(stringValue);
  }
}

/**
 * HELPERS
 */

 function sha256 (inp) {
  return crypto.createHash('sha256').update(inp).digest('hex')
}