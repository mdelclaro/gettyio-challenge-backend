# GETTY.io Challenge - Node.js API

This API has all the basic CRUD operations for managing "projects" with MongoDB using [mongoose](https://github.com/Automattic/mongoose).

All the routes are authenticated by using JWT tokens, so the API also creates users.

Before anything, run `npm install` to install the modules.

### Running:
``` 
$ npm install 
$ npm start
```
### Testing:
On the .env file change "TEST" to true, and then:
```
$ npm test
```
