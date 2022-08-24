import * as types from "./types";
import { initState } from "./state";

const reducer = (state = initState, action) => {
  switch (action.type) {
    case types.UPDATE_MAP:
      return {
        ...state,
        parkingMap: action.payload,
      };
      break;
    case types.UPDATE_RESERVED_VEHICLE:
      return {
        ...state,
        reservedVehicles: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;

