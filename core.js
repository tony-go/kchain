import crypto from "crypto";

import Autobase from "autobase";
import HyperSwarm from "hyperswarm";

/**
 * TODO:
 * - [x] really use autobase
 * - [x] try multiple writer
 * - [ ] try multiple writer -> a write, b write, a read with b updates
 * - [x] implement distant core
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
    process.once('SIGINT', () => this.swarm.destroy()) // for faster restarts
  }

  async ready(distantCoreKeys) {
    this.core = this.store.get({ name: "local" });
    this.autobaseIndex = this.store.get({ name: "index" });

    this.autobase = new Autobase([this.core], { indexes: this.autobaseIndex });

    if (distantCoreKeys?.length) {
      for await (const writer of distantCoreKeys) {
        await this.autobase.addInput(this.store.get(Buffer.from(writer, 'hex')))
      }
    }

    if (!distantCoreKeys) {
      await this.autobase.append(JSON.stringify({}));
    }

    this.swarm.join(Buffer.from(this.topic, "hex"));
    await this.swarm.flush();

    this.index = this.autobase.createRebasedIndex();
    await this.index.update();

    return this;
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