import React, { useEffect, useState } from "react";
import { Link, useNavigate, createSearchParams } from "react-router-dom";
const Login = () => {
  let navigate = useNavigate();
  const [error, setError] = React.useState({ msg: "" });
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [errorEmail, setErrorEmail] = React.useState({ msg: "" });
  const [errorPassword, setErrorPassword] = React.useState({ msg: "" });
  const handleFormSubmit = (e) => {
    setError("");
    setErrorEmail("");
    setErrorPassword("");
    if (values.password.length === 0) {
      setErrorPassword({ msg: "Potrebno je unijeti lozinku" });
    }
    if (values.email.length === 0) {
      setErrorEmail({ msg: "Potrebno je unijeti email" });
    }
    fetch("https://backend-zavrsni-rad-mirta.herokuapp.com/web/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
      body: JSON.stringify(values),
    })
      .then(function (response) {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (data.err) {
          setError({ msg: data.err });
        } else {
          localStorage.setItem("token", data.token);
          navigate("/class", { state: values.email });
        }
      });
    e.preventDefault();
  };
  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <div className="container">
      <div className="app-wrapper">
        <div>
          <h2 className="title title-all">Prijava</h2>
        </div>
        <form>
          <div className="email">
            <label className="label">E-mail</label>
            <input
              className="input"
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
            />
            {errorEmail.msg && <p className="error">{errorEmail.msg}</p>}
          </div>
          <div className="password">
            <label className="label">Lozinka</label>
            <input
              className="input"
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
            />
            {errorPassword.msg && <p className="error">{errorPassword.msg}</p>}
            {error.msg && <p className="error">{error.msg}</p>}
          </div>
          <div>
            <button className="submit pointer" onClick={handleFormSubmit}>
              Prijavi se
            </button>
          </div>
          <div className="register-text">Stvaranje korisničkog računa</div>
          <div>
            <Link to={"/signup"}>
              <button className="register pointer">Registriraj se</button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Login;
