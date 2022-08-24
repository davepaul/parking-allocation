import * as types from "./types";
import { initState } from "./state";
import { Action } from "redux";

const reducer = (state = initState, action) => {
  switch (action.type) {
    case types.INCREMENT:
      return {
        ...state,
      };
      break;
    case types.DECREMENT:
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default reducer;

