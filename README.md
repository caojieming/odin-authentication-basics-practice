# odin-authentication-basics-practice

Odin Project, NodeJS Course, Authentication, Authentication Basics, practicing contents.


Run `npm install` to install all packages/dev dependencies.<br>
Run `npm outdated` to check if any packages are outdated (can generally ignore yellow packages: current version is the wanted version, but not the latest version).<br>
Run `npm update` to update outdated packages.

## Extra (personal) notes on deploying servers
1. create new project in Render, and a new DB in Neon
2. populate DB in Neon using Connect -> Node.js -> .env -> plug the link into SERVER_DB_URL in your own .env
- add ""&sslmode=verify-full"" to the end of the link (otherwise the connection will fail)
- make sure populateProdDb.js SQL is correct
- run `npm run popprod`, then check Neon DB tables (terminal execution will keep running for some reason even if the DB has finished populating, just ctr + c out of it)
3. deploy git repo to Render
- build command: `npm install`
- start command: `npm run app '{your Neon link here}'`
- you will need to add a credit card if you removed it before, you can remove it after setting up the project to ensure you don't get charged

## npm scripts included:
`npm run app`<br>
The equivalent of `node --watch app.js`.<br>
Opens an Express server for viewing changes in real time without needing to build.<br>
Default server link: http://localhost:8080/

## Packages included
- express
- ejs
- express-validator
- pg