/**
 * Created by xeonwell on 2019/9/19.
 *
 * index
 *
 *
 */

const net        = require('net');
const Client     = require('ssh2').Client;
const ClickHouse = require('@apla/clickhouse');

async function connectSSH(sshConfig) {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    conn
      .on('ready', () => resolve(conn))
      .on('error', reject)
      .connect(sshConfig);
  });
}

async function createServer(conn, chConfig) {
  return new Promise((resolve, reject) => {
    const server = net.createServer(sock => {
      conn.forwardOut(sock.remoteAddress, sock.remotePort, chConfig.host, chConfig.port || 8123, (err, stream) => {
        if (err) {
          sock.end();
        } else {
          sock.pipe(stream).pipe(sock);
        }
      });
    });
    server.on('error', reject).listen(0, () => resolve(server));
  });
}

module.exports = {
  async connect(sshConfig, chConfig) {
    const conn   = await connectSSH(sshConfig);
    const server = await createServer(conn, chConfig);
    const client = new ClickHouse({
      ...chConfig,
      host: '127.0.0.1',
      port: server.address().port,
    });

    return {
      client,
      conn,
      server,
      close: () => {
        server.close();
        conn.end();
      },
    };
  },
};
