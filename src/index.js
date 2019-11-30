// const SDK = require('dat-sdk')
// const { Hypercore, Hyperdrive, resolveName, deleteStorage, destroy } = SDK()
// const hypertrie = require('hypertrie')
// const raidb = require('random-access-idb')
//
// document.title = 'READER'
//
// window.onmessage = ({ source, data}) => {
//   if (source === window.opener) {
//     const daturl = data
//     start(daturl)
//   }
// }
// window.opener.postMessage('ready', '*')
//
// function start (daturl) {
//   console.log('Trying to initialize:')
//   console.log(daturl)

  // const db = hypertrie(null, daturl, {
  //   valueEncoding: 'json',
  //   feed: new Hypercore(filename => (console.log({filename}), raidb())),
  //   // extensions: ['discovery']
  // })

  // reallyReady(db, () => {
  //   console.log('READY')
  //   db.list((err, nodes) => nodes.forEach(node => {
  //     console.log(`${node.key}: ${node.value.toString('utf-8')}`)
  //   }))
  // })

  //
  // // This make sure you sync up with peers before trying to do anything with the archive
  // function reallyReady (archive, cb) {
  //   debugger
  //   if (archive.metadata.peers.length) {
  //     archive.metadata.update({ ifAvailable: true }, cb)
  //   } else {
  //     archive.metadata.once('peer-add', () => {
  //       archive.metadata.update({ ifAvailable: true }, cb)
  //     })
  //   }
  // }

  // db.createReadStream()
  //   .on('data', data => console.log(data.key))
  //   .on('end', _ => console.log('(end)'))

  // db.get('16238cc7c846ef7e27a3d084ef7c679a36f5b820c3d9b079e24a2d75e7787a64', (err, node) => {
  //   console.log(db)
  //   console.log('Got key: ', node.key)
  //   console.log('Loaded value from trie: ', node.value.toString())
  // })
// }
