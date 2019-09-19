# clickhouse-ssh
connect clickhouse server over ssh tunnel.

## API

### `.connect(sshConfig, chConfig)`
 
* `sshConfig` should be an object according to the `ssh2` package. see [options](https://github.com/mscdex/ssh2#client-methods).
* `chConfig` should be an object according to the `clickhouse` package. see [options](https://github.com/apla/node-clickhouse#new-clickhouse-options)
* Returns a Object, containing a `client` from the `clickhouse` package and `close` function.


## Usage
Don't forget to `close()` the tunnel connection when you're done with clickhouse.

```javascript

(async () => {
  const { client, close } = await require('clickhouse-ssh').connect({
    host:     '127.0.0.1',
    port:     22,
    username: 'user',
    password: 'pass',
  }, {
    host: '127.0.0.1',
    port: 8123,
    auth: 'user:pass'
  });

  try {
    const result = await client.querying('select 1 as c');
    console.log(result);
  } catch (e) {
    console.log(e);
  } finally {
    close();
  }
})();

```

## REF
- [redis-ssh](https://raw.githubusercontent.com/nicolazj/redis-ssh)
