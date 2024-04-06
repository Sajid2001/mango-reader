# Desktop Client 

* Made using Electron Vite - React template
* TypeScript set as default language

## Project dependencies

Run `npm install` to install these dependencies
* TailwindCSS
* React router
* Axios
* Redux (just in case)
* JSON-Server

### JSON-Server
1. To run the json-server, use the command `json-server --watch db.json`
* You can add an extra flag `--port` to change the port where the json server will run
    * EX: `json-server --port 8080 --watch db.json`
2. If everything goes well, you should see a message like this pop up in the terminal: 
```
\{^_^}/ hi!

  Loading db.json
  Done

  Resources
  http://localhost:5000/manga

  Home
  http://localhost:5000

  Type s + enter at any time to create a snapshot of the database
  Watching...
```
3. Navigate to the api route in the browser and you should see some json information

You are free to add more json to the `db.json` file located in the desktop directory


