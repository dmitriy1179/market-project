import React from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ children, redirectTo, isAuth, ...rest }) => {
  console.log("isAuth", isAuth);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuth ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: redirectTo,
              state: { from: location }
            }}
          />
        )
      }
    />
  );
};
ProtectedRoute.defaultProps = {
  redirectTo: "/"
};

const mapStateToProps = (state) => ({
  isAuth: state.auth.isLoggedIn
});

export default connect(mapStateToProps)(ProtectedRoute);
