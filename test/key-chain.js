const Corestore = require('corestore')
const test = require('tape')

const { KeyChain } = require('../core')

const computerA = new Corestore('temp/comp-a')
const computerB = new Corestore('temp/comp-b')

test('that KeyChain should share content', async t => {
  // Given
  const chainA = await new KeyChain('a', { store: computerA }).ready()
  await chainA.put('first-key', 'first-value')
  const publicKeyA = chainA.getConnectionInfo()
  
  // When
  const chainB = await new KeyChain('a-replica', { store: computerB }).ready([publicKeyA])

  // Then
  t.deepEqual(await chainA.last(), await chainB.last())

  await chainA.close()
  await chainB.close()
})
