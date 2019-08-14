import {
  ChangeStreamOptions,
  ClientSession,
  Collection,
  Timestamp
} from 'mongodb';

function changeStreamToAsyncIterator(
  collection: Collection,
  pipeline?: object[],
  options?: ChangeStreamOptions & {
    startAtOperationTime?: Timestamp;
    session?: ClientSession;
  }
): AsyncIterator<any> {
  const pipelineArg = pipeline || [];
  const optionsArg = options || {};

  const changeStream = collection.watch(pipelineArg, optionsArg);

  return {
    next(): Promise<IteratorResult<any>> {
      if (changeStream.isClosed()) {
        return this.return();
      }
      return changeStream.next().then(data => {
        return { value: data, done: false };
      });
    },
    return(): Promise<IteratorResult<any>> {
      if (changeStream.isClosed()) {
        return Promise.resolve({ value: undefined, done: true });
      }
      return changeStream
        .close()
        .then(() => ({ value: undefined, done: true }));
    },
    throw(error: Error): Promise<IteratorResult<any>> {
      if (!changeStream.isClosed()) {
        changeStream.close();
      }
      return Promise.reject({ value: error, done: true });
    }
  };
}

export default changeStreamToAsyncIterator;
