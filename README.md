# Germicule

![Node.js CI](https://github.com/derwentx/germicule/workflows/Node.js%20CI/badge.svg)
[![codecov](https://codecov.io/gh/derwentx/germicule/branch/master/graph/badge.svg)](https://codecov.io/gh/derwentx/germicule)

React web app for visualising your contacts and their covid risk factors

Risk factors are based off [this Medium article](https://medium.com/@evelindacker/covid-care-e2ede67428d4)

![Germicule Screenshot](img/germicule.png)

[Python prototype](https://github.com/derwentx/python-germicule/)

## Installing

```bash
npm install
```

## Testing

re-test on changes

```bash
npm test
```

## Building

```bash

```

## Usage - Development mode

recompile on change, and host a development server on port 3000

```bash
npm run start:local
```

## Usage - Production

host a production server on port the value of environment variable `PORT` or `8080` if not set.

```bash
npm run start
```