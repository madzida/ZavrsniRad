import React, { useEffect, useState } from "react";

import {
  Link,
  withRouter,
  useLocation,
  useNavigate,
  createSearchParams,
} from "react-router-dom";
import Header from "./Header";
import "react-datepicker/dist/react-datepicker.css";
import useInterval from "use-interval";
const Home = () => {
  var emoji_array = [
    "elephant",
    "dog",
    "wolf",
    "fox_face",
    "cat",
    "frog",
    "tiger",
    "bird",
    "bear",
    "bat",
    "butterfly",
    "baby_chick",
    "crocodile",
    "dolphin",
    "fish",
    "monkey",
    "mouse",
    "octopus",
    "panda_face",
    "penguin",
    "rhinoceros",
    "snail",
    "snake",
    "turtle",
    "sheep",
  ];
  const emoji = require("emoji-dictionary");
  let location = useLocation();
  let navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [values, setValues] = useState({
    name: "",
    surname: "",
    pictureKey: "",
    studentId: "",
  });
  const [subject, setSubject] = useState({ id: "" });
  let list = [];
  let list2 = [];
  const [test, setTest] = useState({ msg: false });
  const [students, setStudents] = useState({ list: [] });
  const [results, setResults] = useState({ list: [] });
  const [options, setOptions] = useState([]);
  console.log(location.state);
  useEffect(() => {
    fetch(
      "https://backend-zavrsni-rad-mirta.herokuapp.com/web/class?classId=" +
        location.state.classId,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "same-origin",
      }
    )
      .then(function (response) {
        return response.json();
      })
      .then((data) => {
        try {
          console.log(data);
          for (var i = 0; i < data.length; i++) {
            list[i] = data[i];
          }
          setStudents({ list: list });
        } catch {
          console.log(data);
        }
      });
  }, []);
  useEffect(() => {
    fetch(
      "https://backend-zavrsni-rad-mirta.herokuapp.com/web/test/checkOngoing?classId=" +
        location.state.classId,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "same-origin",
      }
    )
      .then(function (response) {
        return response.json();
      })
      .then((data) => {
        setTest({ msg: data.status });
      });
  }, []);
  useEffect(() => {
    fetch("https://backend-zavrsni-rad-mirta.herokuapp.com/web/subjects", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "same-origin",
    })
      .then(function (response) {
        return response.json();
      })
      .then((data) => {
        try {
          console.log(data.length);
          for (var i = 0; i < data.length; i++) {
            list2[i] = data[i];
          }
          console.log(list2);
          setOptions(list2);
          //setSubject({ name: data[0].subject });
          setSubject({ id: data[0].subjectId });
        } catch {
          console.log(data);
        }
      });
  }, []);
  useEffect(() => {
    console.log(options);
  }, [options]);
  useEffect(() => {
    console.log(subject);
  }, [subject]);
  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };
  const subjectChange = (e) => {
    setSubject({
      ...subject,
      [e.target.name]: e.target.value,
    });
    console.log(e.target.value);
  };
  const makeSure = (studentId) => {
    if (window.confirm("Želite li zaista obrisati učenika?")) {
      deleteStudent(studentId);
    }
  };
  const deleteStudent = (studentId) => {
    fetch(
      "https://backend-zavrsni-rad-mirta.herokuapp.com/web/student/remove",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
        body: JSON.stringify({ studentId: studentId }),
      }
    )
      .then(function (response) {
        return response.json();
      })
      .then((data) => {
        console.log(data);
      });
    var elem = document.getElementById(studentId);
    elem.parentNode.removeChild(elem);
  };
  const editStudent = (studentId, name, surname, pictureKey) => {
    navigate("/add", {
      state: {
        emoji_array: emoji_array,
        classId: location.state.classId,
        name: name,
        surname: surname,
        studentId: studentId,
        edit: true,
        pictureKey: pictureKey,
        raz: location.state.raz,
      },
    });
  };

  const addingStudent = () => {
    navigate("/add", {
      state: {
        emoji_array: emoji_array,
        classId: location.state.classId,
        name: "",
        surname: "",
        studentId: "",
        edit: false,
        pictureKey: "",
        raz: location.state.raz,
      },
    });
  };
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
  const stopTest = () => {
    fetch(
      "https://backend-zavrsni-rad-mirta.herokuapp.com/web/test/stopTest?classId=" +
        location.state.classId,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "same-origin",
      }
    )
      .then(function (response) {
        console.log("the response is" + JSON.stringify(response));
        return response.json();
      })
      .then((data) => {
        if (!data.err) setTest({ msg: false });
        else setTest({ msg: true });
      });
  };
  const lectures = () => {
    navigate("/lectures", {
      state: {
        raz: location.state.raz,
        subjectId: subject.id,
        classId: location.state.classId,
      },
    });
  };
  const topResults = () => {
    navigate("/topResults", {
      state: { classId: location.state.classId, raz: location.state.raz },
    });
  };
  const goToClass = () => {
    navigate("/class", { state: { home: location.state.classId } });
  };
  return (
    <div className="background">
      <div>
        <nav>
          <div className="header">
            <div className="pointer" onClick={goToClass}>
              <img width="300" height="80" src={"../images/logoo.png"} />
            </div>
            <div>
              <button className="link pointer" onClick={addingStudent}>
                Dodaj Učenika
              </button>
              {test.msg && (
                <button className="link pointer" onClick={topResults}>
                  Top rezultati
                </button>
              )}
              {test.msg && (
                <button className="link pointer" id="stop" onClick={stopTest}>
                  Zaustavi test
                </button>
              )}
              {!test.msg && (
                <select
                  className="link pointer"
                  id="dropdown"
                  type="text"
                  name="id"
                  onChange={subjectChange}
                >
                  {options.map((item, i) => (
                    <option className="link" key={i} value={item.subjectId}>
                      {item.subject}
                    </option>
                  ))}
                </select>
              )}
              {!test.msg && (
                <button className="link pointer" id="start" onClick={lectures}>
                  Upravljaj gradivom
                </button>
              )}
              <button className="link pointer" onClick={logout}>
                Odjavi se
              </button>
            </div>
          </div>
        </nav>
      </div>
      <div className="class-code font-code">
        Oznaka razreda: {location.state.classId}
      </div>
      <div className="studentContainer">
        {students.list.length !== 0 && (
          <div className="margin-top">
            {" "}
            {students.list.map((item, i) => (
              <div id={item.studentId} key={i} className="flex-row">
                <p className="list-container bold">
                  {item.name} {item.surname}
                  <span>{emoji.getUnicode(item.pictureKey)}</span>
                </p>{" "}
                <button className="image">
                  <img
                    width="40"
                    height="20"
                    alt="delete"
                    src={"../images/delete.svg"}
                    onClick={() => makeSure(item.studentId)}
                  />
                </button>
                <button className="image">
                  <img
                    width="40"
                    alt="edit"
                    height="20"
                    src={"../images/pencil.svg"}
                    onClick={() =>
                      editStudent(
                        item.studentId,
                        item.name,
                        item.surname,
                        item.pictureKey
                      )
                    }
                  />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default Home;
