const Corestore = require('corestore')

const { KeyChain } = require('../core.js')

const store = new Corestore('./temp/creator')

const newKey = process.argv[2]

async function run () {
    const keychain = await new KeyChain('restqa', { store })
        .ready(newKey ? [newKey] : undefined)
    
    // await keychain.addKey("GITHUB", "3828883");
    // await keychain.addKey("GITLAB", "DKDKSKSK");
    await keychain.addKey('ZOOO', 'DJJZHDBDB')
    
    console.log(await keychain.lastChain())
    console.log('public key', keychain.getConnectionInfo())
}

run()
