# Hey 👋🏼

Issue: the index generate by `autobase.createRebasedIndex` has a length of `1`. But when I'm trying to access the first index (`0`) I got an error (see below).

Steps top reproduce my issue:

- `npm i`
- `node examples/creator.js`
- it should output (I add logs to help tracking the error):
<details>
<summary>Error here</summary>
<code>
/Users/tonygorez/projects/key-chain/node_modules/compact-encoding/index.js:282
      const b = state.buffer.subarray(state.start, state.start += n)
                             ^

TypeError: state.buffer.subarray is not a function
</code>
</details>
