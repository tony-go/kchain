# key-chain

Virtual distributed key-chain for remote teams. Based on [hypercore protocol stack](https://hypercore-protocol.org/).

# 👷‍♀️ Work in progress

## Preview (specifications)

It's a command-line tool. Here is a list of (future/potential) available commands:

```bash
# create a new key-chain
$ key-chain new <name>

# create a new key-chain from a distant one
$ key-chain new -k <key>

# put a value
$ key-chain put <name>.<key> <value>

# read a full key chain
$ key-chain last <name>

# read a key from key chain
$ key-chain last <name>.<key>

# get hypercore key (watch command)
$ key-chain open <name>
```



