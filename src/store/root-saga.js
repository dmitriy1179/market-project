import { 
  loginRequestSaga, 
  registrationRequestSaga,
  changePasswordRequestSaga,
} from "./../services/auth/login-sagas"
import { all } from "redux-saga/effects";


function* rootSaga() {
  yield all([
    loginRequestSaga(),
    registrationRequestSaga(),
    changePasswordRequestSaga(),
  ]);
}

export default rootSaga


