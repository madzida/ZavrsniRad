import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactHover, { Trigger, Hover } from "react-hover";
import moment from "moment";
const Test = () => {
  let location = useLocation();
  let navigate = useNavigate();
  const [state, setState] = useState({ list: [] });
  const [subject, setSubject] = useState({ id: "" });
  const [fil, setFilter] = useState({ value: 0 });
  const [options, setOptions] = useState([]);
  const [init, setInit] = useState({ value: "" });
  let list2 = [];
  const token = localStorage.getItem("token");
  console.log(location.state);
  const testResults = (testId) => {
    navigate("/testResults", { state: testId });
  };
  useEffect(() => {
    let sortedProducts;
    sortedProducts = [...location.state.data].sort((a, b) => {
      return parseInt(b.testId) - parseInt(a.testId);
    });
    setState({ list: sortedProducts });
    console.log(state);
  }, [location.state]);
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
          setSubject({ id: data[0].subjectId });
          setInit({ value: data[0].subjectId });
          for (var i = 0; i < data.length; i++) {
            list2[i] = data[i];
          }
          setOptions(list2);
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
  const filter = () => {
    setFilter({
      value: 1,
    });
  };
  const subjectChange = (e) => {
    setSubject({
      ...subject,
      [e.target.name]: e.target.value,
    });
  };
  const showSubjectTest = () => {
    setInit({ value: 1 });
    console.log(subject.id);
    fetch(
      "https://backend-zavrsni-rad-mirta.herokuapp.com/web/test/getTestsForClass?classId=" +
        location.state.classId,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "same-origin",
        body: JSON.stringify({ subjectId: subject.id }),
      }
    )
      .then(function (response) {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setState({ list: data });
        navigate("/test", {
          state: { data: data, classId: location.state.classId },
        });
        //navigate("/test", { state: data });
      });
    setFilter({
      value: 0,
    });
    setSubject({ id: init.value });
  };
  const optionsCursorTrueWithMargin = {
    followCursor: true,
    shiftX: 20,
    shiftY: 0,
  };
  return (
    <div className="background">
      <div>
        <nav>
          <div className="header">
            <div
              className="pointer"
              onClick={() => {
                window.location.href = "/class";
              }}
            >
              <img
                width="300"
                height="80"
                alt="filter "
                src={"../images/logoo.png"}
              />
            </div>
            {
              // subject.name === "mat" && init.value === 1 && (
              //   <div className="headerTitle header">MATEMATIKA</div>
              // )}
              // {subject.name === "pid" && init.value === 1 && (
              //   <div className="headerTitle header">PRIRODA I DRUŠTVO</div>
              // )}
              // {subject.name === "hrv" && init.value === 1 && (
              //   <div className="headerTitle header">HRVATSKI JEZIK</div>
              // )
            }
            <div className="header">
              {fil.value === 0 && (
                <ReactHover options={optionsCursorTrueWithMargin}>
                  <Trigger type="trigger">
                    <div className="pointer" onClick={filter}>
                      <img
                        width="55"
                        height="40"
                        alt="filter"
                        src={"../images/filter.png"}
                      />
                    </div>
                  </Trigger>
                  <Hover type="hover">
                    <p className="hover-text">
                      Filtriranje testova po predmetu{" "}
                    </p>
                  </Hover>
                </ReactHover>
              )}
              {fil.value === 1 && (
                <select
                  className="link  pointer"
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
              {fil.value === 1 && (
                <button className="link pointer" onClick={showSubjectTest}>
                  Filtriraj
                </button>
              )}
              <button className="link pointer" onClick={logout}>
                Odjavi se
              </button>
            </div>
          </div>
        </nav>
      </div>
      <h5 className="test-list container-list">
        <span>Predmet</span>
        <span>Datum stvaranja testa</span>
        <span>Status testa</span>
        <span>Pregled rezultata učenika</span>
      </h5>
      <hr />
      {state.list.map((test, i) => {
        return (
          <div className="test-list container-list" key={i}>
            {test.subject === "mat" && <span>Matematika</span>}
            {test.subject === "pid" && <span>Priroda i društvo</span>}
            {test.subject === "hrv" && <span>Hrvatski jezik</span>}
            <span>{moment(test.dateOf).format("DD.MM.YYYY")}</span>
            {test.status === 1 && <span>U tijeku</span>}
            {test.status === 0 && <span>Završen test</span>}
            <span>
              <button
                className="link pointer"
                onClick={() => testResults(test.testId)}
              >
                Pregledaj
              </button>
            </span>
          </div>
        );
      })}
    </div>
  );
};
export default Test;
