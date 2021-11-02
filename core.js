import HyperSwarm from "hyperswarm";

/**
 * TODO:
 * - really use autobase
 * - try multiple writer
 * 
 * - have a '-e' option to export a key chain as a DOTENV file
 */

export class KeyChain {
  constructor(name, options) {
    this.store = options.store;
    this.autobase = options.autobase;
    this.name = name;

    this.swarm = new HyperSwarm();
    this.swarm.on("connection", (connection) => {
      this.store.replicate(connection);
    });
  }

  async ready() {
    this.core = this.store.get({ name: "local", valueEncoding: "json" });
    await this.core.ready();

    this.swarm.join(this.core.discoveryKey);

    this.autobase.addInput(this.core);

    return this;
  }

  async fetchDistantCore(distantCoreKey) {
    this.core = this.store.get(Buffer.from(distantCoreKey, "hex"), { valueEncoding: "json" });
    await this.core.ready();
    console.log("core ready");

    await this.autobase.addInput(this.core);
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