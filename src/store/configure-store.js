import { createStore, applyMiddleware } from "redux";
import rootReducer from "./root-reducer";
import Thunk from "redux-thunk";
import API from "./../API";

const store = createStore(
  rootReducer,
  applyMiddleware(Thunk.withExtraArgument(API))
);

export default store;
