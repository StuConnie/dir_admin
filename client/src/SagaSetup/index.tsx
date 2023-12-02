import createSagaMiddleware from '@redux-saga/core';
import { combineReducers, applyMiddleware, createStore } from '@reduxjs/toolkit';
import persistStore from 'redux-persist/es/persistStore';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';


//All imports_____________________________________________
import ReducerS from './ReducerS/index';
import SagasS from './SagaS/index';


const persistConfig = {
    key: 'root',
    storage,
};

const sagaMiddleware = createSagaMiddleware();
const rootReducer = combineReducers(ReducerS);
const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(persistedReducer, applyMiddleware(sagaMiddleware));
const persistor = persistStore(store);

SagasS.forEach((element:any) => {
    sagaMiddleware.run(element);
});


export const Store = () => store;
export const Persistor = () => persistor;

