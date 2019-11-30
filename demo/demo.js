const hypercore = require('hypercore')
const hypertrie = require('hypertrie')
const ram = require('random-access-memory')
const { ClientSwarm } = require('hyperswarm-ws')
const eos = require('end-of-stream')

const dat = '4105b44cf82ae557e7c0d73b270bc98e8e7ab107e21f4f22d349e2dca023c491'
const swarm = new ClientSwarm('ws://localhost:4200')


start(dat)

function start (dat) {

  const key = Buffer.from(dat, "hex")
  const feed = new hypercore(ram, key)
  const trie = hypertrie(null, { feed })
  swarm.join(key, { live: true })
  swarm.on('connection', (connection, info) => {
    console.log('connection found')
    connection.pipe(feed.replicate(info.client)).pipe(connection)
  })

  trie.ready(() => {
    console.log('Loaded trie', dat)
    reallyReady(trie, () => {
      console.log('READY')
      viewTrie()
    })
  })

  function viewTrie () {
    const query = 'foo'
    trie.get(query, (err, res) => {
      console.log('Query', query)
      console.log('Response', res.value.toString('utf8'))
    })
  }

  function reallyReady (trie, cb) {
    if (trie.feed.peers.length) {
      trie.feed.update({ ifAvailable: true }, cb)
    } else {
      trie.feed.once('peer-add', () => {
        trie.feed.update({ ifAvailable: true }, cb)
      })
    }
  }

}
