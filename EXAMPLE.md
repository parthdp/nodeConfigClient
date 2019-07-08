# Example

- Create a new node project. Create directory sampleClient. Inside sampleClient ...

```
npm init
```
- Create a github directory inside parent directory of sampleClient.

```
git clone https://github.com/parthdp/nodeConfigClient
```

- Inside sampleClient. Add the below dependencies to package.json

```
  "dependencies": {
    "@types/es6-promise": "^3.3.0",
    "@types/request": "^2.47.1",
    "es6-symbol": "^3.1.1",
    "express": "^4.17.1",
    "nodeConfigClient": "file:../github/nodeConfigClient/lib",
    "request": "^2.87.0"
  },
  "devDependencies": {
    "@types/jest": "^23.3.1",
    "@types/node": "^12.0.10",
    "jest": "^23.4.1",
    "prettier": "^1.14.0",
    "ts-jest": "^23.0.1",
    "tslint": "^5.18.0",
    "tslint-config-prettier": "^1.14.0"
  }
```
- Create a properties js file e.g. sample.properties.js which will be consumed by node config client to load the properties from config server. Add appropriate values for config server.

```
const properties = {
    hostname: 'localhost',
    port: 8888,
    httpProtocol: "http",
    authRequired: true,
    username: 'user',
    password: 'f09828e4-c73e-4bcc-a732-1cbd0305cc9a',
    profiles: ['development', 'staging'],
    label: 'master',
    applicationName: 'sampleClient'
}

module.exports = properties;

```

- Add the below code to index.js

```
const nodeConfigClient = require('nodeConfigClient')
const express = require('express');
const app = express();

const loader = new nodeConfigClient.Loader();
const properties = loader.loadProperties();
const logger = new nodeConfigClient.SimpleLogger();
const springConfigController = new nodeConfigClient.SpringConfigController(properties, logger);

springConfigController.loadConfig().then(() => {
    logger.logInfo("Spring configuration properties loaded successfully");
});

app.get('/config', (req, res) => {
    const profile = req.query.profile;
    const applicationName = 'sampleClient';
    const configName = req.query.configName;

    let configStore = springConfigController.getConfigStore(applicationName);
    const config = configStore.getConfig(configName, profile);
    logger.logInfo(config.name + ":" + config.value);

    res.send(config);
});

app.get('/config/all', (req, res) => {
    const applicationName = 'sampleClient';
    let configStore = springConfigController.getConfigStore(applicationName);
    res.send(configStore);
});

app.post('/refresh', (req, res) => {
    springConfigController.refreshConfigStore()
    .then(() => res.send({success: true}))
    .catch((error) => res.send({success: false, error}))
});

app.listen(3000, () => console.log('SamplieClient app listening on port 3000!'));
```

- Run the app

```
node index.js <FullPathTo{sample.properties.js}>

```
- curl http://localhost:3000/config/all
    response e.g. {
        "configs": {
            "profileStore": {
                "development": {
                    "user.role": {
                        "name": "user.role",
                        "value": "AwsomeDeveloper"
                    }
                },
                "staging": {
                    "user.role": {
                        "name": "user.role",
                        "value": "Staging"
                    },
                    "user.privilege": {
                        "name": "user.privilege",
                        "value": "Admin"
                    }
                }
            }
        }
    }
- curl http://localhost:3000/config?profile=staging&configName=user.privilege
    response e.g. { "name": "user.privilege", "value": "Admin" }
- curl -X POST 'http://localhost:3000/refresh'
    response e.g. {"success":true}