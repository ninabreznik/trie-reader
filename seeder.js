const hypertrie = require('hypertrie')
const ram = require('random-access-memory')
const hyperswarm = require('hyperswarm')

const trie = hypertrie(ram)
const swarm = hyperswarm()

trie.ready(() => {
  storeToTrie()
  swarm.join(trie.key, {
    live: true,
    lookup: true, // find & connect to peers
    announce: true // optional- announce self as a connection target
  })
  swarm.on('connection', (connection, info) => {
    console.log('new connection!')
    connection.pipe(trie.feed.replicate(info.client)).pipe(connection)
  })
})
function viewTrie () {
  trie.list('', (err, results) => {
  	if(err) return log('Error reading from trie', err.message)
  	for(let {key, value} of results) {
		console.log('key:', key, 'value:', Buffer.from(value).toString('utf8'))
  	}
  })
}
function storeToTrie () {
  const key = 'foo'
  const value = 'bar'
  trie.put(key, value, (err) => {
    if (err) console.log('Error writing', err.message)
    else console.log('wrote', key, '-', value)
    console.log(trie.key.toString('hex'))
    viewTrie()
  })
}
