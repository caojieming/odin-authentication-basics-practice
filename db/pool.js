const { argv } = require('node:process');
const { Pool } = require("pg");

function getPool() {
  console.log(`Detected ${argv.length - 2} extra arg(s)`);

  // default "npm run app" has 2 arguments: [0] node and [1] app.js
  if(argv.length < 3) {
    return new Pool({
      host: process.env.HOST, 
      user: process.env.USER,
      database: process.env.DATABASE,
      password: process.env.PASSWORD,
      port: Number(process.env.DBPORT)
    });
  }
  else if(argv.length > 3) {
    throw new Error("Too many arguments detected");
  }
  else {
    // looking at the extra arg, aka arg[2]
    // should be in the general format of: `postgresql://${process.env.USER}:${process.env.PASSWORD}@localhost:${process.env.DBPORT}/${process.env.DATABASE}`
    return new Pool({
      connectionString: argv[2]
    })
  }
}

module.exports = getPool();