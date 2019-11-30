const hypercore = require('hypercore')
const hypertrie = require('hypertrie')
const ram = require('random-access-memory')
const eos = require('end-of-stream')

const HyperswarmClient = require('hyperswarm-proxy-ws/client')
const swarm = new HyperswarmClient({ proxy: 'ws://localhost:3472' })
//const swarm = new ClientSwarm('ws://localhost:4200')
//const { ClientSwarm } = require('hyperswarm-ws')

const dat = '619fe4c3bf83c0db8020596a3416ae48d966409bd30480811f8f4b5f1d0b83e8'

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
      // viewTrie()
      getStream()
      //getCount()
    })
  })

  function viewTrie () {
    const query = 'foo'
    trie.get(query, (err, res) => {
      console.log('Query', query)
      console.log('Response', res.value.toString('utf8'))
    })
  }

  function getStream () {
    trie.createReadStream()
    .on('data', console.log)
    .on('end', console.log.bind(console, '\n(end)'))
  }

  function getCount () {

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
