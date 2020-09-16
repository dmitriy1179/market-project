import React from "react";
import API from "../../API";
import { gql } from "graphql-request";
import Spinner from "../../shared/components/spinner";

const changePasswordMutation = gql`
  mutation change($login: String!, $password: String!, $newPassword: String!) {
    changePassword(login: $login, password: $password, newPassword: $newPassword) {
      _id
      login
    }
  }
`;

const StatusResolver = ({ status, noData, children }) => {
    if (status === "searching") {
      return <Spinner />;
    }
    if (noData) {
      return <span>No Data</span>;
    }
    if (status === "rejected") {
      return <span>Something went wrong</span>;
    }
    if (status === "idle") {
      return null;
    }
    if (status === "resolved") {
      return children;
    }
  };

const ChangeUserPassword = () => {
  const [values, setValues] = React.useState({});
  const [result, setResult] = React.useState(null);
  const [status, setStatus] = React.useState("idle");
  const onSubmit = (e) => {
    e.preventDefault();
    try {
      setStatus("searching");
      API.request(changePasswordMutation, values)
       .then((res) => {
          console.log("res", res)
          setResult(res);
          setStatus("resolved");
        });
      } catch (e) {
          setStatus("rejected");
      }  
    };
  console.log(result, "result", result !== null && result.length !== 0); 
    
 
  const onChange = (e) => {
    const target = e.target;
    setValues((prev) => ({
      ...prev,
      [target.name]: target.value
    }));
  };
  return (
    <>
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
            name="password"
            onChange={onChange}
          />
        </div>
      </div>
      <button className="btn btn-primary">Change</button>
    </form>
    <StatusResolver
      noData={result !== null && result.length === 0}
      status={status}
      >
      <span>OK!</span>      
    </StatusResolver>
    </>
  );
};
export default ChangeUserPassword