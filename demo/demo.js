const SDK = require('dat-sdk')
const { Hypercore } = SDK()
const hypertrie = require('hypertrie')
const RAI = require('random-access-idb')
var Discovery = require('hyperdiscovery')

document.title = 'READER'

const daturl = `dat://23f86a22bb80790119d22b68c828b209439ec092385943c40055caf3143ac732`

start(daturl)

function start (daturl) {
  const feed = new Hypercore(daturl, { storage: RAI})
  var discovery = Discovery(feed)
  discovery.on('connection', function (peer, type) {
    console.log('got', peer, type)
    console.log('connected to', discovery.connections, 'peers')
    peer.on('close', function () {
      console.log('peer disconnected')
    })
  })

  feed.on('peer-add', (peer) => {
    console.log('got peer', peer)
  })

  const trie = hypertrie(null, { feed })

  window.trie = trie

  trie.ready(() => {
    console.log('Loaded trie', daturl)
    console.log(`DATURL IS: ${daturl} `)
    reallyReady(trie, () => {
      console.log('READY')
      viewTrie()
      //createReadStream()
    })
  })

  function viewTrie () {
    const query = 'contract/0x0e0989b1f9b8a38983c2ba8053269ca62ec9b195.json'
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
  function createReadStream () {
    trie.createReadStream()
    .on('data', data => console.log(data.key))
    .on('end', _ => console.log('(end)'))
  }

}
