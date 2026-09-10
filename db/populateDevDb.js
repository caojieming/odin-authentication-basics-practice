const { Client } = require("pg");
const { argv } = require('node:process');

// connects to .env file in root folder, this is needed here because just running this file misses the loadEnvFile() in app.js
try {
  process.loadEnvFile();
} catch(error) {}


// DROP TABLE IF EXISTS messages;
// the above can be added or removed from the start as needed
const SQL = `
DROP TABLE IF EXISTS category_items;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS items;

CREATE TABLE IF NOT EXISTS categories (
  name VARCHAR (255),
  description VARCHAR (255),
  PRIMARY KEY (name)
);
CREATE TABLE IF NOT EXISTS items (
  name VARCHAR (255),
  description VARCHAR (255),
  stock INTEGER,
  PRIMARY KEY (name)
);
CREATE TABLE IF NOT EXISTS category_items (
  category_name VARCHAR (255),
  item_name VARCHAR (255),
  PRIMARY KEY (category_name, item_name),
  FOREIGN KEY (category_name) REFERENCES categories(name) ON DELETE CASCADE,
  FOREIGN KEY (item_name) REFERENCES items(name) ON DELETE CASCADE
);

INSERT INTO categories (name, description) 
VALUES
  ('food', 'stuff you eat'),
  ('protein', 'good source of medium-term energy'),
  ('toys', 'Items you really don''t want your toddlers to eat');
INSERT INTO items (name, description, stock) 
VALUES
  ('watermelon', 'a watery melon', 11),
  ('steak', 'some good quality beef', 4), 
  ('Pokemon Cards', 'Playing cards. If you see a scalper, do us all a favor and hospitalize them.', 100);
INSERT INTO category_items (category_name, item_name) 
VALUES
  ('food', 'watermelon'),
  ('food', 'steak'),
  ('protein', 'steak'),
  ('toys', 'Pokemon Cards');
`;

/*

*/

async function main() {
  console.log("seeding...");
  let client;

  // default "npm run app" has 2 arguments: [0] node and [1] app.js. Extra argv[2] would be the URL to the DB
  if(argv.length > 3) {
    throw new Error("Too many arguments detected!");
  }
  else if(argv.length < 3) {
    // default to .env DB
    client = new Client({
      connectionString: process.env.LOCAL_DB_URL,
    });
  }
  else {
    client = new Client({
      connectionString: argv[2],
    });
  }

  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();