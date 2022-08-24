import { combineReducers } from "redux";
import parking from "./parking/reducers";

export const combinedReducers = combineReducers({
  parking,
});

