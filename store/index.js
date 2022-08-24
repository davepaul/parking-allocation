import { createStore, applyMiddleware, AnyAction } from "redux";
import { composeWithDevTools } from "@redux-devtools/extension";
import thunkMiddleware from "redux-thunk";
import { HYDRATE, createWrapper } from "next-redux-wrapper";
import { combinedReducers as combinedReducer } from "./reducers";

const reducer = (state, action) =>
  action.type === HYDRATE ? action.payload : combinedReducer(state, action);

const initStore = () => createStore(reducer, composeWithDevTools(applyMiddleware(thunkMiddleware)));

export const wrapper = createWrapper(initStore);