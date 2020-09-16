import React from "react";
import { Redirect } from "react-router-dom";
//import API from "./../../API";
//import { gql } from "graphql-request";
import { connect } from "react-redux";
import Spinner from "../../shared/components/spinner";
import { login, registration, change } from "./../../services/auth";

/*const createMutation = gql`
  mutation create($login: String!, $password: String!) {
    createUser(login: $login, password: $password) {
      _id
      login
    }
  }
`;*/

const CreateUserForm = ({ dispatch }) => {
  const [values, setValues] = React.useState({});
  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(registration(values));
    //API.request(createMutation, values).then(console.log);
  };

  const onChange = (e) => {
    const target = e.target;
    setValues((prev) => ({
      ...prev,
      [target.name]: target.value
    }));
  };
  return (
    <form onSubmit={onSubmit}>
      <div className="form-group row">
        <label className="col-sm-2 col-form-label">Login</label>
        <div className="col-sm-10">
          <input
            type="text"
            className="form-control"
            placeholder="Login"
            name="login"
            onChange={onChange}
          />
        </div>
      </div>
      <div className="form-group row">
        <label className="col-sm-2 col-form-label">Password</label>
        <div className="col-sm-10">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            name="password"
            onChange={onChange}
          />
        </div>
      </div>
      <button className="btn btn-primary">Create</button>
    </form>
  );
};

const LoginForm = ({ dispatch }) => {
  const [values, setValues] = React.useState({});
  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login(values));
  };

  const onChange = (e) => {
    const target = e.target;
    setValues((prev) => ({
      ...prev,
      [target.name]: target.value
    }));
  };
  return (
    <form onSubmit={onSubmit}>
      <div className="form-group row">
        <label className="col-sm-2 col-form-label">Login</label>
        <div className="col-sm-10">
          <input
            type="text"
            className="form-control"
            placeholder="Login"
            name="login"
            onChange={onChange}
          />
        </div>
      </div>
      <div className="form-group row">
        <label className="col-sm-2 col-form-label">Password</label>
        <div className="col-sm-10">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            name="password"
            onChange={onChange}
          />
        </div>
      </div>
      <button type="submit" className="btn btn-primary">
        Enter
      </button>
    </form>
  );
};

const ChangeUserPasswordForm = ({ dispatch }) => {
  const [values, setValues] = React.useState({});

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(values)
    dispatch(change(values));
  };

  const onChange = (e) => {
    const target = e.target;
    setValues((prev) => ({
      ...prev,
      [target.name]: target.value
    }));
  };
  return (
    <form onSubmit={onSubmit}>
      <div className="form-group row">
        <label className="col-sm-2 col-form-label">Login</label>
        <div className="col-sm-10">
          <input
            type="text"
            className="form-control"
            placeholder="Login"
            name="login"
            onChange={onChange}
          />
        </div>
      </div>
      <div className="form-group row">
        <label className="col-sm-2 col-form-label">Password</label>
        <div className="col-sm-10">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            name="password"
            onChange={onChange}
          />
        </div>
      </div>
      <div className="form-group row">
        <label className="col-sm-2 col-form-label">New password</label>
        <div className="col-sm-10">
          <input
            type="password"
            className="form-control"
            placeholder="New password"
            name="newPassword"
            onChange={onChange}
          />
        </div>
      </div>
      <button className="btn btn-primary">Change</button>
    </form>
  );
};

const Login = ({ dispatch, authStatus }) => {
  const [isNewUser, setNewUser] = React.useState("auth");

  const handleChange = (event) => {
    setNewUser(event.target.value)
  }
 
  if (authStatus === "resolved") {
    return <Redirect to="/" />;
  }
  return (
    <div>
       <div className="btn-group-toggle mt-5" data-toggle="buttons">
        <label className={`btn btn-outline-secondary ${isNewUser === "auth" ? "active" : ""}`}>
          <input type="radio" name="login" value="auth" onChange={handleChange} /> Authorization 
        </label>
        <span> or </span>
        <label className={`btn btn-outline-secondary ${isNewUser === "reg" ? "active" : ""}`}>
          <input type="radio" name="login" value="reg" onChange={handleChange} /> Registration
        </label>
        <span> or </span>
        <label className={`btn btn-outline-secondary ${isNewUser === "chng" ? "active" : ""}`}>
          <input type="radio" name="login" value="chng" onChange={handleChange} /> Chage password
        </label>
      </div>
      <h1 className="m-3">{isNewUser === "auth" ? "Authorization" :
      (isNewUser === "reg" ? "Registration" : "Change password")} </h1>
      <div className="col-sm-12 col-md-5 mx-auto">
        {isNewUser === "auth" ? <LoginForm dispatch={dispatch} /> :
        (isNewUser === "reg" ? <CreateUserForm dispatch={dispatch} /> : <ChangeUserPasswordForm dispatch={dispatch} />)}
      </div>
      <div className="my-3">
        {authStatus === "pending" ? <Spinner /> : null}
      </div>
      <div className="mt-2">
        {authStatus === "rejected" ? (
          <span className="text-danger">Something went wrong</span>
        ) : null}
      </div>
      <div className="mt-2">
        {authStatus === "notRegistered" ? (
          <span className="text-warning">
            You entered an incorrect password or login or you are not registered, please enter the correct data or register
          </span>
        ) : null}
      </div>
      <div className="mt-2">
        {authStatus === "isRegistered" ? (
          <span className="text-info">
            The user with the specified data is registered
          </span>
        ) : null}
      </div>
      <div className="mt-2">
        {authStatus === "registered" ? (
          <span className="text-primary">You are registered, please log in</span>
        ) : null}
      </div>
      <div className="mt-2">
        {authStatus === "notChanged" ? (
          <span className="text-warning">
            You entered an incorrect data 
          </span>
        ) : null}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isLoggedIn: state.auth.isLoggedIn,
  authStatus: state.auth.status
});
export default connect(mapStateToProps)(Login);
