# READ data from the hypertrie structure

```js
$ git clone https://github.com/ninabreznik/trie-reader.git

$ cd trie-reader

$ npm install

$ npm start
// open dev tools and check the console for the logs
```

Additionally:
---

- run a seeder (`node seeder.js`) => logs a feed key
- in src/index.js line 11 replace the const dat (feed key) with the one from seeder.js
- run a hyperswarm gateway (`node hyperswarm-gateway.js`)
