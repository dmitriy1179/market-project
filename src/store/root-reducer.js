import { combineReducers } from "redux";
import { authReducer } from "./../services/auth";

export default combineReducers({ auth: authReducer });
