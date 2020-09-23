import React from "react";
import { Link } from "react-router-dom";

const NavBar = ({ children }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="collapse navbar-collapse d-flex justify-content-between" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="/">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/ad/curUser">
              My ads
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/ad/find">
              Find ad
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/ad/post">
              Post ad
            </Link>
          </li>
        </ul>
        {children}
      </div>
    </nav>
  );
};

export default NavBar;
