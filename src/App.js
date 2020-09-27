import React from "react";
import "./styles.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ProtectedRoute from "./shared/components/protected-route";
import HomeScreen from "./screens/home";
import LoginScreen from "./screens/login";
import AdFind from "./screens/ad-find" 
import PostAdUser from "./screens/ad-post"
import MyAdsScreen from "./screens/ad-my"
import MyAdOneSreen from "./screens/ad-my-one"
import MyAdEditSreen from "./screens/ad-my-edit"
import Navbar from "./shared/components/navbar"

const NotFound = () => <div> Page not found</div>;

function App() {
  return (
    <div className="d-flex flex-column App">
      <Router>
        <Navbar />
        <Switch>
          <ProtectedRoute exact path="/" redirectTo="/login">
            <HomeScreen />
          </ProtectedRoute>
          <ProtectedRoute exact path="/ad/find" redirectTo="/login">
            <AdFind />
          </ProtectedRoute>
          <ProtectedRoute exact path="/ad/curUser" redirectTo="/login">
            <MyAdsScreen />
          </ProtectedRoute>
          <ProtectedRoute exact path="/ad/curUser/:_id" redirectTo="/login">
            <MyAdOneSreen />
          </ProtectedRoute>
          <ProtectedRoute exact path="/ad/curUser/edit/:_id" redirectTo="/login">
            <MyAdEditSreen />
          </ProtectedRoute>
          <ProtectedRoute exact path="/ad/post" redirectTo="/login">
            <PostAdUser />
          </ProtectedRoute>
          <Route path="/login" exact>
            <LoginScreen />
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </Router>
      <footer className="bg-secondary mt-3" id="footer">
        <div></div>
      </footer>
    </div>
  );
}

export default App;
