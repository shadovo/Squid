```bash
# Install dependencies and run the app
npm install && npm start
```

```bash
# Build for mac
docker run --rm -ti -v ${PWD}:/project -v ${PWD##*/}-node-modules:/project/node_modules -v ~/.electron:/root/.electron electronuserland/electron-builder:latest /bin/bash -c "npm install && npm run dist-mac"
# Build for linux
docker run --rm -ti -v ${PWD}:/project -v ${PWD##*/}-node-modules:/project/node_modules -v ~/.electron:/root/.electron electronuserland/electron-builder:latest /bin/bash -c "npm install && npm run dist-linux"
```