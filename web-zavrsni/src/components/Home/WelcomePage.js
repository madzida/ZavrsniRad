import React from "react";

import {
  Link,
  withRouter,
  useLocation,
  useNavigate,
  createSearchParams,
} from "react-router-dom";

const WelcomePage = () => {
  let navigate = useNavigate();
  const login = () => {
    navigate("/login");
  };
  const register = () => {
    navigate("/signup");
  };
  return (
    <div className="welcome-background">
      <nav>
        <div className="header">
          <img width="450" height="83" src={"../images/logoo.png"} />
          <div>
            <button className="welcome-link pointer" onClick={login}>
              Prijava
            </button>
            <button className="welcome-link pointer" onClick={register}>
              Registracija
            </button>
          </div>
        </div>
      </nav>
      <div className="welcome-container">
        <div className="welcome-text">
          <p className="w-font">Dobrodošli!</p>
          <p>
            Igraj i uči! Space Invaders aplikacija je kreirana kako bi djeca
            lakše savladala školsko gradivo kroz zabavu. Prilagođena je uzrastu
            od 6 do 11 godina. Ispituje se gradivo iz prirode i društva,
            hrvatskog jezika i matematike.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
