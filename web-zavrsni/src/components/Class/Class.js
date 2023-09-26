import React, { useEffect, useState } from "react";
import {
  Link,
  withRouter,
  useLocation,
  useNavigate,
  createSearchParams,
} from "react-router-dom";
import ClassHeader from "../Home/ClassHeader";
import valid from "./valid";
import ReactHover, { Trigger, Hover } from "react-hover";
import "react-datepicker/dist/react-datepicker.css";
const Class = () => {
  let navigate = useNavigate();
  let location = useLocation();
  let list = [];

  const [classname, setClassName] = useState({
    number: "",
    letter: "",
    name: "",
  });
  const token = localStorage.getItem("token");
  const [classes, setClasses] = useState({ list: [] });
  const [error, setError] = React.useState({ msg: "" });
  const [errors, setErrors] = useState({});
  useEffect(() => {
    console.log(token);
    const getDatas = async () => {
      const response = await fetch(
        "https://backend-zavrsni-rad-mirta.herokuapp.com/web/teacherClass",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      const data = await response.json();
      // .then(function (response) {
      //   return response.json();
      // })
      // .then((data) => {
      console.log(data);
      try {
        for (var i = 0; i < data.length; i++) {
          list[i] = data[i];
        }
        setClasses({ list: list });
      } catch {
        console.log(data);
      }
      // });
    };
    getDatas();
  }, []);
  const addClass = (e) => {
    setErrors(valid(classname));
    if (
      Object.keys(errors).length === 0 &&
      document.getElementById("number").value.length > 0 &&
      document.getElementById("letter").value.length > 0 &&
      document.getElementById("name").value.length > 0 &&
      classname.number > 0 &&
      classname.number < 5 &&
      isNaN(classname.letter)
    ) {
      fetch("https://backend-zavrsni-rad-mirta.herokuapp.com/web/makeClass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "same-origin",
        body: JSON.stringify({
          class_number: classname.number,
          class_letter: classname.letter,
          class_name: classname.name,
          email: location.state,
        }),
      })
        .then(function (response) {
          return response.json();
        })
        .then((data) => {
          console.log(data);
          window.location.href = "/class";
          // navigate("/home",{state:{classId:data.classId}})
        });
    }
    e.preventDefault();
  };
  const getTests = (classId) => {
    fetch(
      "https://backend-zavrsni-rad-mirta.herokuapp.com/web/test/getTestsForClass?classId=" +
        classId,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "same-origin",
        body: JSON.stringify({ subjectId: "" }),
      }
    )
      .then(function (response) {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        navigate("/test", {
          state: { data: data, classId: classId },
        });
      });
  };
  const makeSure = (classId) => {
    if (window.confirm("Želite li zaista obrisati razred?")) {
      deleteClass(classId);
    }
  };
  const deleteClass = (classId) => {
    fetch("https://backend-zavrsni-rad-mirta.herokuapp.com/web/remove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
      body: JSON.stringify({ classId: classId }),
    })
      .then(function (response) {
        return response.json();
      })
      .then((data) => {
        console.log(data);
      });
    var elem = document.getElementById(classId);
    elem.parentNode.removeChild(elem);
  };
  const handleSubmit = (e, br_raz) => {
    navigate("/home", { state: { classId: e, raz: br_raz } });
  };
  const handleChange = (e) => {
    setClassName({
      ...classname,
      [e.target.name]: e.target.value,
    });
    console.log(classname);
  };
  const optionsCursorTrueWithMargin = {
    followCursor: true,
    shiftX: 20,
    shiftY: 0,
  };
  return (
    <div className="background">
      <div>
        <div>
          <ClassHeader />
        </div>
        <div className="classContainer">
          <div className="flex">
            <label className="label2">Razredi:</label>
            {classes.list.map((item, i) => {
              let broj = item.classNumber;
              return (
                <div id={item.classId} className="flex-row" key={i}>
                  <p className="list-container bold">
                    {item.classNumber}.{item.classLetter} {item.schoolName}
                  </p>
                  <ReactHover options={optionsCursorTrueWithMargin}>
                    <Trigger type="trigger">
                      <button
                        className="link pointer"
                        onClick={() => getTests(item.classId)}
                      >
                        Pregled testova
                      </button>
                    </Trigger>
                    <Hover type="hover">
                      <p className="hover-text">
                        Kliknite za pregled rezultata testova{" "}
                      </p>
                    </Hover>
                  </ReactHover>
                  <ReactHover options={optionsCursorTrueWithMargin}>
                    <Trigger type="trigger">
                      <button
                        className="link pointer"
                        onClick={() => handleSubmit(item.classId, broj)}
                      >
                        Odaberi
                      </button>
                    </Trigger>
                    <Hover type="hover">
                      <p className="hover-text">Kliknite za odabir razreda </p>
                    </Hover>
                  </ReactHover>
                  <ReactHover options={optionsCursorTrueWithMargin}>
                    <Trigger type="trigger">
                      <button className="image">
                        <img
                          width="40"
                          height="35"
                          className="fit"
                          alt="delete"
                          src={"../images/bin.jpg"}
                          onClick={() => makeSure(item.classId)}
                        />
                      </button>
                    </Trigger>
                    <Hover type="hover">
                      <p className="hover-text">
                        Kliknite za brisanje razreda{" "}
                      </p>
                    </Hover>
                  </ReactHover>
                </div>
              );
            })}
          </div>
          <div className="flex">
            <div className="label2">Dodaj razred</div>
            <form className="add_class">
              <div>
                <label className="label">Broj razreda</label>
                <input
                  className="input_class"
                  id="number"
                  name="number"
                  type="text"
                  placeholder="Unesite broj razreda, vrijednost od 1 do 4"
                  value={classname.number}
                  onChange={handleChange}
                />
                {errors.number && <p className="error">{errors.number}</p>}
              </div>
              <div>
                <label className="label">Slovo razreda</label>
                <input
                  className="input_class"
                  id="letter"
                  name="letter"
                  type="text"
                  placeholder="Unesite slovo razreda"
                  value={classname.letter}
                  onChange={handleChange}
                />
                {errors.letter && <p className="error">{errors.letter}</p>}
              </div>
              <div>
                <label className="label">Ime škole</label>
                <input
                  className="input_class"
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Unesite ime škole"
                  value={classname.name}
                  onChange={handleChange}
                />
                {errors.name && <p className="error">{errors.name}</p>}
              </div>
              {error.msg && <p className="error">{error.msg}</p>}
              <button className="submit_class pointer" onClick={addClass}>
                Dodaj
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Class;
