const SDK = require('dat-sdk')
const { Hypercore, Hyperdrive, resolveName, deleteStorage, destroy } = SDK()
const hypertrie = require('hypertrie')

const discoveryCoreKey = 'dat://c5b5d188cf5a3fc570e56beb54ac9ca2df14e8d97e93cde27006a859f274eedb'
const db = hypertrie(null, { feed: new Hypercore(discoveryCoreKey) })

// db.createReadStream()
//   .on('data', data => console.log(data.key))
//   .on('end', _ => console.log('(end)'))
//
db.get('16238cc7c846ef7e27a3d084ef7c679a36f5b820c3d9b079e24a2d75e7787a64', (err, node) => {
  console.log(db)
  console.log('Got key: ', node.key)
  console.log('Loaded value from trie: ', node.value.toString())
})
