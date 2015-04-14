# How do I put this baby to work?
Easy peasy lemon squeezy my friend.
<br>
Just fire up a pretty little MySQL instance with the info you can get from the server.js file and set all them environment variables!
<br>
Then go into the project folder and run:
```sh
$ npm install
$ node server.js
```
<br>
Now we have all some things 'envified', so we got to run:
```sh
$ npm install -g envify
$ envify public/js/app.js > public/js/app.env.js
```
Awesome, the server is up and running on localhost:3010 considering you set all the needed environment variables ;).
