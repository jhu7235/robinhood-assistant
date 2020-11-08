# robinhood-assistant
This is a web app to help manage your robinhood account.

# Codebase Structure
- ui/trade-assistant/src: - front-end ui code
- appengine - backend code
  
# Setup 
Create `credentials.json` file in `./appengine/`. You can find the data's shape [here](https://github.com/jhu7235/robinhood-assistant/blob/master/appengine/robinhood/credentials.type.ts)

install all dependencies
```
cd appengine
yarn
cd ../ui/trade-assistant
yarn
```

## Initialize Backend

Setup the `credentials.json` and run the following code to initialize the backend server.
```bash
cd appengine
yarn start
```

## Initialize Frontend

Run the following code to initialize the frontend server, and then open up the app on localhost:4200
```bash
cd ui/trade-assistant
yarn start
```