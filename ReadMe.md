# ddb
An attempt at a realtime, decentralized, key:value, pub:sub database intended for mesh networking

No dependencies, web and nodejs compatible.

Not ready for production environments, not even close.

## Implemented
- Provider base class
- LocalStorageProvider
- WebSocketProvider - partial, untested
- ddb.setItem
- ddb.getItem
- ddb.onItem

## Example
```ts
//for data on localStorage
ddb.link({
  provider: new LocalStorageProvider()
});

//for remote data in a browser over ws
ddb.link({
  provider: new WebSocketProvider("ws://localhost:32423")
});

//try to get the value for key "name" once
ddb.getItem("name").then((value)=>{
  console.log("got value of 'name'", value);
});

//listen to changes of the value of key "name" continuously
ddb.onItem("name", (value)=>{
  console.log("'name' changed to", value);
});

```

## Descriptions
- Provider : A base-class for all providers to extend
  - All providers are looped over to find data that local code asks for
  - The providers are sorted by their 'quick average' response time
  - Local storage based providers should always appear first in the providers list
