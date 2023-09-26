import React from "react";
import { Link } from "react-router-dom";
const Header = () => {
  const logout = () => {
    fetch("https://backend-zavrsni-rad-mirta.herokuapp.com/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
    }).then(function (response) {
      console.log("the response is" + JSON.stringify(response));
      return response.json();
    });
    window.location.href = "/";
    localStorage.clear();
  };
  return (
    <nav>
      <div className="header">
        <div
          className="pointer"
          onClick={() => {
            window.location.href = "/class";
          }}
        >
          <img width="300" height="80" src={"../images/logoo.png"} />
        </div>
        <button className="link pointer" onClick={logout}>
          Odjavi se
        </button>
      </div>
    </nav>
  );
};
export default Header;
