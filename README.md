# change-stream-to-async-iterator

[![npm version](https://badge.fury.io/js/change-stream-to-async-iterator.svg)](https://badge.fury.io/js/change-stream-to-async-iterator)

Turn any [MongoDB ChangeStream](https://docs.mongodb.com/manual/changeStreams/) into an async iterator.

GraphQL subscriptions expect to be passed an async iterator. Now you can turn any MongoDB ChangeStream into one. I hope it's useful for you!

## Install

```sh
npm i -S change-stream-to-async-iterator
```

## Usage

### Quickstart

This is an example of a subscription resolver using [graphql-yoga](https://github.com/prisma/graphql-yoga). It turns a ChangeStream that listens for _insert_ operations on the _items_ collection into an async iterator which the subscription resolver uses to push messages to the client through a WebSocket connection:

```JS
import changeStreamToAsyncIterator from 'change-stream-to-async-iterator';

const onCreateItem = {
  subscribe: (parent, args, context, info) =>
    changeStreamToAsyncIterator(context.db.collection('items'), [
      {
        $match: { operationType: 'insert' }
      }
    ], {
        fullDocument: true,
    }),
  resolve: payload => payload.fullDocument
};

export default {
  onCreateItem
};
```

This is another example using [for-await...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of):

```JS
(async function() {
    let asyncIterable = changeStreamToAsyncIterator(db.collection('items'), [
      {
        $match: { operationType: 'insert' }
      }
    ], {
        fullDocument: true,
    });

    for await (let data of asyncIterable) {
        console.log(data);
    }
})();
```

### API

#### `changeStreamToAsyncIterator(collection: Collection, pipeline: object[], options: ChangeStreamOptions & {startAtOperationTime?: Timestamp; session?: ClientSession;}): AsyncIterator<any>`

Follow this [link](https://mongodb.github.io/node-mongodb-native/3.3/api/Collection.html) for documentation on `colletion` argument.

Follow this [link](https://docs.mongodb.com/manual/changeStreams/) to learn more about `pipeline` and `options` arguments.

## License

Licensed under the MIT License, Copyright copyright 2019 Maximilian Stoiber. See [LICENSE](https://github.com/alfredoqt/change-stream-to-async-iterator/blob/master/LICENSE) for more information.
