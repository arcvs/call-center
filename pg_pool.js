const { Pool, Client } = require('pg')

//const client = new Client({
//  host: '127.0.0.1',
//  port: 5432,
//  database: 'callcenter',
//  user: 'postgres',
//  password: '1',
//})
//
//client.connect((err) => {
//  if (err) {
//    console.error('connection error', err.stack)
//  } else {
//    console.log('connected')
//  }
//})


const pool = new Pool({
  host: '10.10.10.234', // 127.0.0.1
  port: 5432,
  database: 'callcenter',
  user: 'postgres',
  password: '111-00-A', // 1
  //max: 20,
  //idleTimeoutMillis: 3000,
  //connectionTimeoutMillis: 3000,
})

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

pool.connect()
  .then(client => {
    return client.query('SELECT * FROM users LIMIT 1')
    .then(res => {
        client.release()
        console.log('Pool connected ') //res.rows[0])
      })
    .catch(e => {
      client.release()
      console.error(e.stack)
    })
  })
  .catch(e => {
    console.error(e.stack)
  })

exports.query = function() {
  return pool
}
