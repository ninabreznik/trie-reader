const SDK = require('dat-sdk')
const { Hypercore } = SDK()
const hypertrie = require('hypertrie')
//const raidb = require('random-access-idb')

document.title = 'READER'
//
// window.onmessage = ({ source, data}) => {
//   if (source === window.opener) {
//     const daturl = data
//     start(daturl)
//   }
// }
// window.opener.postMessage('ready', '*')

// POLO c5b5d188cf5a3fc570e56beb54ac9ca2df14e8d97e93cde27006a859f274eedb
const daturl = `dat://bcb472471c2787fa8a5d3cd4f702f9d0d319ed63289d6a6136df6e2ccad19be0`
start(daturl)

function start (daturl) {

  const feed = new Hypercore(daturl, {valueEncoding: 'binary', sparse: false})

  feed.on('peer-add', (peer) => {
    console.log('got peer', peer)
  })

  const trie = hypertrie(null, { feed })

  window.trie = trie

  trie.ready(() => {
    console.log('Loaded trie', daturl)
    reallyReady(trie, () => {
      console.log('READY')
      viewTrie()
    })
  })

  function viewTrie () {
    window.trie.list('', (err, results) => {
    	if(err) return log('Error reading from trie', err.message)
    	for(let {key, value} of results) {
  		console.log('key:', key, 'value:', Buffer.from(value).toString('utf8'))
    	}
    })
  }

  // const db = hypertrie(null, daturl, {
  //   valueEncoding: 'json',
  //   feed: new Hypercore(url, {valueEncoding: 'binary', sparse: false}),
  //
  //   // extensions: ['discovery']
  // })
  //

  //
  // // This make sure you sync up with peers before trying to do anything with the archive
  function reallyReady (trie, cb) {
    if (trie.feed.peers.length) {
      trie.feed.update({ ifAvailable: true }, cb)
      viewTrie()
    } else {
      trie.feed.once('peer-add', () => {
        trie.feed.update({ ifAvailable: true }, cb)
      })
    }
  }

  // db.createReadStream()
  //   .on('data', data => console.log(data.key))
  //   .on('end', _ => console.log('(end)'))

  // db.get('16238cc7c846ef7e27a3d084ef7c679a36f5b820c3d9b079e24a2d75e7787a64', (err, node) => {
  //   console.log(db)
  //   console.log('Got key: ', node.key)
  //   console.log('Loaded value from trie: ', node.value.toString())
  // })
}
