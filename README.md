<div align="center" id="top"> 
  <img src="https://manuelmartin.dev/assets/img/commons/logo.png"
    width="150" height="150"
   alt="PortFolio Back" />

&#xa0;

</div>

<h1 align="center">PortFolio Back</h1>

<p align="center">
  <img alt="Github top language" src="https://img.shields.io/github/languages/top/manuelmartin-developer/portfolio_back?color=56BEB8">

  <img alt="Github language count" src="https://img.shields.io/github/languages/count/manuelmartin-developer/portfolio_back?color=56BEB8">

  <img alt="Repository size" src="https://img.shields.io/github/repo-size/manuelmartin-developer/portfolio_back?color=56BEB8">

  <img alt="License" src="https://img.shields.io/github/license/manuelmartin-developer/portfolio_back?color=56BEB8">

  <img alt="Github stars" src="https://img.shields.io/github/stars/manuelmartin-developer/portfolio_back?color=56BEB8" />
</p>

<h4 align="center">
	🚧  Always under contruction  🚧
</h4>

<hr>

<p align="center">
  <a href="#dart-about">About</a> &#xa0; | &#xa0; 
  <a href="#sparkles-features">Features</a> &#xa0; | &#xa0;
  <a href="#rocket-technologies">Technologies</a> &#xa0; | &#xa0;
  <a href="#white_check_mark-requirements">Requirements</a> &#xa0; | &#xa0;
  <a href="#checkered_flag-starting">Starting</a> &#xa0; | &#xa0;
  <a href="#memo-license">License</a> &#xa0; | &#xa0;
  <a href="https://github.com/manuelmartin-developer" target="_blank">Author</a>
</p>

<br>

## :dart: About

This project was developed to have a robust backend for my portfolio, it is a CRUD API developed in NodeJS with TypeScript, it has a database in PostgreSQL and is deployed in Docker.

## :sparkles: Features

:heavy_check_mark: Create infrastructure with Docker;
:heavy_check_mark: Create a database with PostgreSQL;
:heavy_check_mark: Create a full CRUD API with NodeJS and TypeScript;

## :rocket: Technologies

The following tools were used in this project:

- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Docker](https://www.docker.com/)

## :white_check_mark: Requirements

Before starting :checkered_flag:, you need to have [Git](https://git-scm.com) and [Node](https://nodejs.org/en/) installed.

## :checkered_flag: Starting

```bash
# Clone this project
$ git clone https://github.com/manuelmartin-developer/portfolio_back

# Access
$ cd portfolio_back

# Install dependencies
$ yarn

# Add the .env file with the environment variables
$ cp .env

# Add environment variables
NODE_ENV=development
API_BASE_URL=http://localhost
API_BASE_PATH=/api/v1
PORT=8082
PG_HOST=localhost
PG_USER=postgres
PG_PASSWORD=12345
PG_DB=postgres
DOCS_AUTH_USER=test@test.com
DOCS_AUTH_PASSWORD=12345

# Create a docker container with PostgreSQL
docker run --name postgres -e POSTGRES_PASSWORD=12345 -p 5432:5432 -d postgres

# Run the project
$ yarn start

# The server will initialize in the <http://localhost:8082>
```

## :bulb: API Documentation

Once the project is running, you can access the API documentation at the following URL: <http://localhost:8082/api/v1/docs> with the credentials that you have defined in the .env file. (:warning: documentation is partially completed)

## :memo: License

This project is under license from MIT. For more details, see the [LICENSE](LICENSE.md) file.

Made with :muscle: by <a href="https://github.com/manuelmartin-developer" target="_blank">Manuel Martín</a>

&#xa0;

<a href="#top">Back to top</a>
