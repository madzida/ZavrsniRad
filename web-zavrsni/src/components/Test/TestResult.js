import React, { useState, useEffect } from "react";
import {
  Link,
  withRouter,
  useLocation,
  useNavigate,
  createSearchParams,
} from "react-router-dom";
import moment from "moment";
import Header from "../Home/Header";
import ReactHover, { Trigger, Hover } from "react-hover";
const TestResult = () => {
  let location = useLocation();
  let navigate = useNavigate();
  let list = [];
  const token = localStorage.getItem("token");
  const [results, setResults] = useState({ list: [] });
  const optionsCursorTrueWithMargin = {
    followCursor: true,
    shiftX: 20,
    shiftY: 0,
  };
  console.log(location.state);
  useEffect(() => {
    fetch(
      "https://backend-zavrsni-rad-mirta.herokuapp.com/web/test/getResultsForTest?testId=" +
        location.state,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    )
      .then(function (response) {
        return response.json();
      })
      .then((data) => {
        console.log(data.length);
        for (var i = 0; i < data.length; i++) {
          console.log(data);
          list[i] = data[i];
        }
        setResults({ list: list });
      });
  }, []);
  const studentResult = (studentId) => {
    navigate("/studentResult", {
      state: { testId: location.state, studentId: studentId },
    });
  };
  return (
    <div className="background">
      <div>
        <Header />
      </div>
      <div className="result-list container-list">
        <span>Ime i prezime</span>
        <span>Broj eliminiranih čudovišta</span>
        <span>Trajanje igre</span>
      </div>
      <hr />
      {results.list.map((item, i) => {
        return (
          <div className="result-list container-list" key={i}>
            <ReactHover options={optionsCursorTrueWithMargin}>
              <Trigger type="trigger">
                <p
                  onClick={() => studentResult(item.studentId)}
                  className="pointer underline"
                >
                  {item.name} {item.surname}
                </p>
              </Trigger>
              <Hover type="hover">
                <p className="hover-text">Kliknite za rezultate učenika</p>
              </Hover>
            </ReactHover>
            <span>{item.result}</span>
            <span>
              {Math.floor(item.timeOf / 60)}m : {(item.timeOf % 60).toFixed(0)}s
            </span>
          </div>
        );
      })}
    </div>
  );
};
export default TestResult;
