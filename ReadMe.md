# ddb

NOTICE: Work in progress, not stable or usable

A decentralized database intended for mesh networking.

- 0 dependencies
- Targets ESM node.js, web, and deno environments

## Implemented
- Data creation, modification, events
- Database, events
- Query, events
- EventDispatcher w/ type generics

## Example
```ts
//create a database
let ddb = new Database();

//assume unique public cryptography key as a string
let publicKey = 3.14159.toString();

//get data in a tree structure path
ddb
  .get("players")
  .get(publicKey)
  .get("position")
  .get("x")
  
  //listen to changes of this data
  .on("change", (evt) => {
  console.log(evt.datum.value as string);
});

//data gets set somewhere else in code (or over network)
ddb
  .get("players")
  .get(publicKey)
  .get("position")
  .get("x")

  //set the data
  .set( Math.floor( Math.random() * 512 ).toString() );

```

## Example Web
See [index.html](./src/index.html) and [index.ts](./src/index.ts)

### Localhost
Use an http/s server in the same directory as src (not build directory, as a node module is relatively imported for development testing)

`npm install https-localhost -g` or `npm install serve` work well
Note: https-localhost option requires `sudo` on linux due to network securety
