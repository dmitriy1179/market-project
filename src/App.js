import React from "react";
import "./styles.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/configure-store";
import ProtectedRoute from "./shared/components/protected-route";
import HomeScreen from "./screens/home";
import LoginScreen from "./screens/login";
import AdFind from "./screens/ad-find" 
import PostAdUswer from "./screens/ad-post"

const NotFound = () => <div> Page not found</div>;

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Router>
          <Switch>
            <ProtectedRoute exact path="/" redirectTo="/login">
              <HomeScreen />
            </ProtectedRoute>
            <ProtectedRoute exact path="/ad/find" redirectTo="/login">
              <AdFind />
            </ProtectedRoute>

            <ProtectedRoute exact path="/ad/post" redirectTo="/login">
              <PostAdUswer />
            </ProtectedRoute>

            <Route path="/login" exact>
              <LoginScreen />
            </Route>
            <Route>
              <NotFound />
            </Route>
          </Switch>
        </Router>
      </Provider>
    </div>
  );
}

export default App;
