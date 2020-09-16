import { gql } from "graphql-request";

const loginQuery = gql`
  query auth($login: String!, $password: String!) {
    login(login: $login, password: $password) 
  }
`;

export const login = (values) => async (dispatch, _, api) => {
  try {
    dispatch({ type: "login/pending" });
    const { login } = await api.request(loginQuery, values);

    console.log("login", login);
    if (login === null) {
      dispatch({ type: "login/notRegistered" });
    }
    else {
      localStorage.setItem("token", login);
      api.setHeader("Authorization", `Bearer ${login}`);
      dispatch({ type: "login/resolved" });
    }

  } catch (error) {
    dispatch({ type: "login/rejected" });
  }
};

const createMutation = gql`
  mutation create($login: String!, $password: String!) {
    createUser(login: $login, password: $password) {
      _id
      login
    }
  }
`;

export const registration = (values) => async (dispatch, _, api) => {
  try {
    dispatch({ type: "login/pending" });
    const { createUser } = await api.request(createMutation, values);

    console.log("createUser", createUser);
    if (createUser === null) {
      dispatch({ type: "registration/isRegistered" });
    }
    else {
      dispatch({ type: "registration/registered" });
    }
  } catch (error) {
    dispatch({ type: "login/rejected" });
  }
};


const changePasswordMutation = gql`
  mutation change($login: String!, $password: String!, $newPassword: String!) {
    changePassword(login: $login, password: $password, newPassword: $newPassword) {
      _id
      login
    }
  }
`;

export const change = (values) => async (dispatch, _, api) => {
  try {
    dispatch({ type: "login/pending" });
    const { changePassword } = await api.request(changePasswordMutation, values);

    console.log("changePassword", changePassword);
    if (changePassword === null) {
      dispatch({ type: "login/notRegistered" });
    }
    else {
      dispatch({ type: "password/changed" });
    }
  } catch (error) {
    dispatch({ type: "login/rejected" });
  }
};

export const logoutUser = (dispatch) => dispatch({ type: "user/logout" })


