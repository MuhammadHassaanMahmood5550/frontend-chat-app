import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice";
import appApi from "./services/appApi";

//persist our store = means after refreshing page or state wont change
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist"
//redux-thunk help us make async operations
import thunk from "redux-thunk";

//combineReducers it make one reducer
const reducer = combineReducers({
    user: userSlice,
    [appApi.reducerPath]: appApi.reducer,
});

//configurations for persist
const persistConfig = {
    key: 'root',
    storage,
    //blackList means we dont wont to persist reducerPath
    blackList: [appApi.reducerPath],
};

//persist our store

const persistedReducer =  persistReducer(persistConfig, reducer);

//creating the store

const store = configureStore({
    reducer: persistedReducer,
    //middleware this allow us to make asyns request
    middleware: [thunk, appApi.middleware], 
});

export default store;