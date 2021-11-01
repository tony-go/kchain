#!/usr/bin/env node

import Autobase from "autobase";
import Corestore from "corestore";
import HyperSwarm from "hyperswarm";
import RAM from "random-access-memory";

const store = new Corestore(RAM);
const autobase = new Autobase();
await autobase.ready();

export class KeyChain {
  constructor(name) {
    this.name = name;
    this.autobase = autobase;
    this.swarm = new HyperSwarm();
    this.swarm.on("connection", (connection) => {
      store.replicate(connection);
    });
  }

  async ready() {
    this.core = store.get({ name: "local", valueEncoding: "json" });
    await this.core.ready();

    this.swarm.join(this.core.discoveryKey);

    autobase.addInput(this.core);

    return this;
  }

  async fetchDistantCore(distantCoreKey) {
    this.core = store.get(Buffer.from(distantCoreKey, "hex"), { valueEncoding: "json" });
    await this.core.ready();
    console.log("core ready");

    await autobase.addInput(this.core);
    console.log("core added to autobase");

    this.swarm.join(this.core.discoveryKey);
    console.log("swarm joined");
  
    await this.swarm.flush();
    console.log("swarm flushed");
    await this.core.update();
    console.log("core updated");

    return this;
  }

  getConnectionInfo() {
    return this.core.key.toString("hex");
  }

  async addKey(key, value) {
    if (this.core.length) {
      const currentKeyChain = await this.core.get(this.core.length - 1);
      
      currentKeyChain[key] = value;
      await this.core.append(currentKeyChain);
    } else {
      await this.core.append({ [key]: value });
    }
  }

  async all () {
    const data = await this.core.get(this.core.length - 1);

    return data instanceof Buffer ? JSON.parse(data.toString()) : data;
  }
}