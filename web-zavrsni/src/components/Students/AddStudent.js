import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import valid from "./valid";
const AddStudent = () => {
  const token = localStorage.getItem("token");
  let location = useLocation();
  let navigate = useNavigate();
  console.log(location.state);
  const [values, setValues] = useState({
    ime: location.state.name,
    prezime: location.state.surname,
    slicica: location.state.pictureKey,
    idRazred: location.state.classId,
  });
  const [edit, setEdit] = useState(location.state.edit);
  const [errors, setErrors] = useState({});
  const [index, setIndex] = useState({ num: "" });
  const [error1, setError1] = useState({ msg: "" });
  Object.keys(errors).length = 1;
  const emoji = require("emoji-dictionary");
  const [dataIsCorrect, setDataIsCorrect] = useState(false);
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setErrors(valid(values));
    console.log(errors.ime !== undefined);
    if (
      Object.keys(errors).length === 0 &&
      document.getElementById("name").value.length > 0 &&
      document.getElementById("surname").value.length > 0 &&
      values.slicica !== ""
    ) {
      fetch("https://backend-zavrsni-rad-mirta.herokuapp.com/web/student/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "same-origin",
        body: JSON.stringify(values),
      })
        .then(function (response) {
          console.log("the response is" + response);
          return response.json();
        })
        .then((data) => {
          if (data.err) {
            setError1({ msg: data.err });
          } else {
            navigate("/home", {
              state: { classId: values.idRazred, raz: location.state.raz },
            });
          }
        });
    }
  };
  const goHome = () => {
    navigate("/home", {
      state: { classId: values.idRazred, raz: location.state.raz },
    });
  };
  useEffect(() => {
    if (values.slicica != "" && edit) {
      document.getElementById(values.slicica).style.background = "#d88a40";
    }
  }, [values]);
  const editStudent = (e) => {
    e.preventDefault();
    setErrors(valid(values));
    if (
      Object.keys(errors).length === 0 &&
      document.getElementById("name").value.length > 0 &&
      document.getElementById("surname").value.length > 0 &&
      values.slicica !== ""
    ) {
      fetch(
        "https://backend-zavrsni-rad-mirta.herokuapp.com/web/student/edit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "same-origin",
          body: JSON.stringify({
            name: values.ime,
            surname: values.prezime,
            pictureKey: values.slicica,
            studentId: location.state.studentId,
          }),
        }
      )
        .then(function (response) {
          return response.json();
        })
        .then((data) => {
          console.log(data);
          navigate("/home", {
            state: { classId: values.idRazred, raz: location.state.raz },
          });
        });
    }
  };
  const handleChange = (e) => {
    let upper =
      e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
    setValues(
      {
        ...values,
        [e.target.name]: upper,
      },
      function () {
        console.log(values);
      }
    );
  };
  const addImage = (i, index, e) => {
    if (values.slicica != "") {
      document.getElementById(values.slicica).style.background = "white";
    }
    setIndex({ ...index, num: index });
    setValues({
      ...values,
      slicica: i,
    });
    console.log(values);
    document.getElementById(i).style.background = "#d88a40";
  };
  return (
    <div className="container">
      <div className="app-wrapper_add">
        <div>
          {!edit && <h2 className="title_add title-all">Dodavanje učenika</h2>}
          {edit && <h2 className="title_add title-all">Uređivanje učenika</h2>}
        </div>
        <form className="form-wrapper">
          <div className="name">
            <label className="label">Ime</label>
            <input
              id="name"
              className="input capitalize"
              name="ime"
              type="text"
              value={values.ime}
              onChange={handleChange}
            />
            {errors.ime && <p className="error">{errors.ime}</p>}
          </div>
          <div className="email">
            <label className="label">Prezime</label>
            <input
              id="surname"
              className="input capitalize"
              type="text"
              name="prezime"
              value={values.prezime}
              onChange={handleChange}
            />
            {errors.prezime && <p className="error">{errors.prezime}</p>}
          </div>
          <div className="password bottom">
            <div className="image-container">
              {location.state.emoji_array.map((i, ind) => (
                <span
                  key={ind}
                  className="emoji pointer"
                  id={i}
                  onClick={() => addImage(i, ind)}
                >
                  {emoji.getUnicode(i)}
                </span>
              ))}
            </div>
            {errors.slicica && <p className="error">{errors.slicica}</p>}
          </div>
          <div>
            {!edit && (
              <button
                type="submit"
                className="submit pointer"
                onClick={handleFormSubmit}
              >
                Dodaj
              </button>
            )}
            {edit && (
              <button
                type="submit"
                className="submit pointer"
                onClick={editStudent}
              >
                Uredi
              </button>
            )}
          </div>
          <div className="class-code top pointer" onClick={goHome}>
            Prethodna stranica
          </div>
        </form>
      </div>
    </div>
  );
};
export default AddStudent;
