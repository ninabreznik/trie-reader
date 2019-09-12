const SDK = require('dat-sdk')
const { Hypercore, Hyperdrive, resolveName, deleteStorage, destroy } = SDK()
const hypertrie = require('hypertrie')

const discoveryCoreKey = 'dat://3ce27d84cfc0f5581e7f60503f1afa603728dbfd029e620926ff389da7a4d666'
const db = hypertrie(null,
  { feed: new Hypercore(discoveryCoreKey), extensions: ['discovery']})

db.createReadStream()
  .on('data', data => console.log(data.key))
  .on('end', _ => console.log('(end)'))

// db.get('16238cc7c846ef7e27a3d084ef7c679a36f5b820c3d9b079e24a2d75e7787a64', (err, node) => {
//   console.log(db)
//   console.log('Got key: ', node.key)
//   console.log('Loaded value from trie: ', node.value.toString())
// })


const myCore = Hypercore(null, {
  valueEncoding: 'json',
  persist: false
})


// Add some data to it
myCore.append(JSON.stringify({
  name: 'Alice'
}), () => {
  // Use extension messages for sending extra data over the p2p connection
  const discoveryCoreKey = 'dat://3ce27d84cfc0f5581e7f60503f1afa603728dbfd029e620926ff389da7a4d666'
  console.log(discoveryCoreKey)

  const discoveryCore = new Hypercore(discoveryCoreKey, {
    extensions: ['discovery']
  })

  // When you find a new peer, tell them about your core
  discoveryCore.on('peer-add', (peer) => {
    console.log('Got a peer!')
    peer.extension('discovery', myCore.key)
  })

  // When a peer tells you about their core, load it
  discoveryCore.on('extension', (type, message) => {
    console.log('Got extension message', type, message)
    if (type !== 'discovery') return
    discoveryCore.close()

    const otherCore = new Hypercore(message, {
      valueEncoding: 'json',
      persist: false
    })

    // Render the peer's data from their core
    otherCore.get(0, console.log)
  })
})
