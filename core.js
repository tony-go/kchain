const crypto = require('crypto')

const Autobase = require('autobase')
const HyperSwarm = require('hyperswarm')

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

// const kNamespaceDbPrefix = "POCKET_DB";

// class Namespace {
//   constructor(name = "default", options) {
//     this.store = options.store;
//     this.name = `${kNamespaceDbPrefix}-${name}`;

//     this.coreDb = this.store.get({ name: this.name });
//     this.db = null // add a bee here;
//   }
// }

class KeyChain {
  constructor (name, options) {
    this.store = options.store
    this.name = name
    this.topic = sha256('key-chain')

    this.swarm = new HyperSwarm()
    process.once('SIGINT', () => this.swarm.destroy()) // for faster restarts
  }

  async ready (distantCoreKeys) {
    this.core = this.store.get({ name: this.name })
    this.autobaseIndex = this.store.get({ name: 'index' })

    this._listenOnSwarmConnection()

    this.autobase = new Autobase([this.core], { indexes: this.autobaseIndex })

    if (distantCoreKeys?.length) {
      for await (const writer of distantCoreKeys) {
        await this.autobase.addInput(this.store.get(Buffer.from(writer, 'hex')))
        console.log(`Key ${writer.slice(0, 5)} added !`)
      }
    }

    if (!distantCoreKeys && !this.core.length) {
      await this.autobase.append(JSON.stringify({}))
    }

    this.swarm.join(Buffer.from(this.topic, 'hex'))
    await this.swarm.flush()

    this.index = this.autobase.createRebasedIndex()
    await this.index.update()

    return this
  }

  // async open () {
  //   // TODO: should look in the nameSpace
  //   this.core = this.store.get({ name: this.name })
  //   this.autobaseIndex = this.store.get({ name: 'index' })

  //   this.autobase = new Autobase([this.core], { indexes: this.autobaseIndex })

  //   this.swarm.join(Buffer.from(this.topic, 'hex'))
  //   await this.swarm.flush()

  //   this.index = this.autobase.createRebasedIndex()
  //   await this.index.update()

  //   return this
  // }

  async close () {
    await this.swarm.destroy()
  }

  getConnectionInfo () {
    return this.core.key.toString('hex')
  }

  async put (key, value) {
    if (this.index.length) {
      const currentKeyChain = await this.last()

      currentKeyChain[key] = value

      await this.autobase.append(JSON.stringify(currentKeyChain))
    } else {
      await this.autobase.append(JSON.stringify({ [key]: value }))
    }

    await this.index.update()
  }

  async last () {
    const rawBuffer = await this.index.get(this.index.length - 1)
    const stringValue = rawBuffer.value.toString()

    return JSON.parse(stringValue)
  }

  // Private
  async _addNewWriter(connection) {
    const newKey = connection.remotePublicKey.toString('hex')
    const newWriter = this.store.get(Buffer.from(newKey, 'hex'))
    await this.autobase.addInput(newWriter)
    await this?.index?.update()
  }

  _listenOnSwarmConnection() {
    this.swarm.on('connection', (connection) => {
      this._debugIncomingPeer(connection)

      this._addNewWriter(connection)

      this.store.replicate(connection)
    })
  }

  // Debug
  _debugIncomingPeer(connection) {
    if (process.env.DEBUG) {
      console.debug({
        name: this.name,
        currentCore: this.getConnectionInfo(),
        publicKey: connection.publicKey.toString('hex'),
        remotePublicKey: connection.remotePublicKey.toString('hex')
      })
    }
  }
}

/**
 * HELPERS
 */

function sha256 (inp) {
  return crypto.createHash('sha256').update(inp).digest('hex')
}

/**
 * EXPORTS
 */

 module.exports = {
  KeyChain
}