# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## Available Docker Compose [v0.0.0](https://github.com/museMKUltra/accounting-no-trouble/tree/v0.0.0)

### Copy `.env.template`

To create `.env` with environment variables

- How to get asana [PAT](https://developers.asana.com/docs/personal-access-token)
- How to get asana [GID](https://developers.asana.com/docs/asana)

### Build Image & Start Container

```shell
docker compose up
```

### See the Result

[localhost:8080](http://localhost:8080/)

### Stop & Delete Container

```shell
docker compose down
```

## Development with Server & Client [v1.0.0](https://github.com/museMKUltra/accounting-no-trouble/tree/v1.0.0)

### Express Server

```shell
# install packages
$ npm install

# running Express
$ node index.js
```
> http://localhost:3030

### React Client

```shell
# root of client
$ cd client/

# install packages
$ npm install

# running React
$ npm run start
```
> http://localhost:3000

### How to Publish on Heroku
1. Create an account on [Heroku](https://dashboard.heroku.com/) (now you should fill up the form of *Billing Information*)
2. Install [the Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
3. Login with account on terminal (you might need to create authorization in *Account settings*)
4. Set [engines](https://github.com/museMKUltra/accounting-no-trouble/blob/v1.0.0/package.json#L4-L7) in package.json for [Specifying a Node.js & an npm Version](https://devcenter.heroku.com/articles/nodejs-support#specifying-a-node-js-version)
5. Set [scripts](https://github.com/museMKUltra/accounting-no-trouble/blob/v1.0.0/package.json#L9-L12) in package.json for [Customizing the build process](https://devcenter.heroku.com/articles/nodejs-support#customizing-the-build-process)
6. Use *Heroku CLI* set environment variables in production
7. Then `git push` certain branch to publish the project
```shell
# rook of repository
$ git push heroku main
```

#### References
- [Deploy React and Express to Heroku](https://daveceddia.com/deploy-react-express-app-heroku/)
- [When NPM miss with Heroku, How To Solve (npm ERR! Failed at the <module> start script).](https://dev.to/mohammedayman2018/when-npm-miss-with-heroku-how-to-solve-npm-err-failed-at-the-module-start-script-9nh)

## Deploy [v1.2.0](https://github.com/museMKUltra/accounting-no-trouble/tree/v1.2.0) on [Render](https://render.com/)

### Method 1. - UI Configuration
1. Create a *Web Service* to connect repository on *Render*.
2. Fill up relative settings in *Docker* environment.
3. Set *Environment Variables* on target service.
4. Go to following *Process*.

### Method 2. - [Blueprint Specification](https://render.com/docs/blueprint-spec)
1. Create `render.yaml` for *Web Service* setting in repository.
2. Create a new *Web Service* to connect repository on *Render*.
3. Set *Environment Variables* on target service.
3. Go to following *Process*.

### Docker Process
- Folder `/client` for front end client.
- Folder `/` for back end server.
- Dockerfile implementing for building web service.
  1. copy `package*.json` to root directory
  2. install packages for server in root
  3. copy `/client` to `/client` directory
  4. set environment for front end（optional）
  5. `npm run build` to build client files for server service
