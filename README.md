# Hey 👋🏼

Issue: the index generate by `autobase.createRebasedIndex` has a length of `1`. But when I'm trying to access the first index (`0`) I got an error (see below).

Steps top reproduce my issue:

- `npm i`
- `node node examples/creator.js`
- it should output:
<details>
<summary>Error here</summary>
<code>
/Users/tonygorez/projects/key-chain/node_modules/compact-encoding/index.js:283
      if (b.length !== n) throw new Error('Out of bounds')
                                ^

Error: Out of bounds
    at Object.decode (/Users/tonygorez/projects/key-chain/node_modules/compact-encoding/index.js:283:33)
    at Object.decode (/Users/tonygorez/projects/key-chain/node_modules/autobase/lib/nodes/messages.js:95:25)
    at Object.decode (/Users/tonygorez/projects/key-chain/node_modules/compact-encoding/index.js:376:14)
    at Function.decode (/Users/tonygorez/projects/key-chain/node_modules/autobase/lib/nodes/index.js:119:26)
    at RebasedHypercore._get (/Users/tonygorez/projects/key-chain/node_modules/autobase/lib/rebase.js:204:19)
    at processTicksAndRejections (node:internal/process/task_queues:96:5)
    at async RebasedHypercore.get (/Users/tonygorez/projects/key-chain/node_modules/autobase/lib/rebase.js:212:17)
    at async KeyChain.lastChain (file:///Users/tonygorez/projects/key-chain/core.js:76:23)
    at async KeyChain.addKey (file:///Users/tonygorez/projects/key-chain/core.js:59:31)
    at async file:///Users/tonygorez/projects/key-chain/examples/creator.js:11:1
</code>
</details>
-
