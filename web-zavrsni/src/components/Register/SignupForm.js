import React, { useEffect, useState } from "react";
import { Link, useNavigate, createSearchParams } from "react-router-dom";
import validation from "./validation";
const SignupForm = ({ submitForm }) => {
  let navigate = useNavigate();
  const [values, setValues] = useState({
    fullname: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [error1, setError1] = useState({ msg: "" });
  const [error2, setError2] = useState({ msg: "" });
  const [dataIsCorrect, setDataIsCorrect] = useState(false);
  const handleFormSubmit = (e) => {
    setError1({ msg: "" });
    setError2({ msg: "" });
    if (
      Object.keys(errors).length === 0 &&
      values.fullname.length > 0 &&
      values.email.length > 0 &&
      values.password.length > 0
    ) {
      fetch("https://backend-zavrsni-rad-mirta.herokuapp.com/web/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify(values),
      })
        .then(function (response) {
          console.log("the response is" + JSON.stringify(response));
          return response.json();
        })
        .then((data) => {
          console.log(data);
          if (data.err) {
            setError1({ msg: data.err });
          } else if (data.err3) {
            setError2({ msg: data.err3 });
          } else {
            localStorage.setItem("token", data.token);
            navigate("/class", { state: values.email });
          }
        });
    }
    e.preventDefault();
    setErrors(validation(values));
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
          <h2 className="title title-all">Registracija</h2>
        </div>
        <form className="form-wrapper">
          <div className="name">
            <label className="label">Ime i prezime</label>
            <input
              className="input capitalize"
              name="fullname"
              type="text"
              value={values.fullname}
              onChange={handleChange}
            />
            {errors.fullname && <p className="error">{errors.fullname}</p>}
          </div>
          <div className="email">
            <label className="label">E-mail</label>
            <input
              className="input"
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
            />
            {errors.email && <p className="error">{errors.email}</p>}
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
            {errors.password && <p className="error">{errors.password}</p>}
            {error1.msg && <p className="error">{error1.msg}</p>}
            {error2.msg && <p className="error">{error2.msg}</p>}
          </div>
          <div>
            <button
              type="submit"
              className="submit pointer"
              onClick={handleFormSubmit}
            >
              Registriraj se
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default SignupForm;
