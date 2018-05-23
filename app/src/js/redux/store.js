'use strict';

const redux = require('redux');
const thunk = require('redux-thunk').default
const reducers = require('./reducers/reducers');

const store = redux.createStore(reducers, redux.applyMiddleware(thunk));

module.exports = store;
