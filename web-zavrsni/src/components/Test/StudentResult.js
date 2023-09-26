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
const StudentResult = () => {
  let location = useLocation();
  let navigate = useNavigate();
  let list = [];
  const token = localStorage.getItem("token");
  const [results, setResults] = useState({ list: [] });
  useEffect(() => {
    fetch(
      "https://backend-zavrsni-rad-mirta.herokuapp.com/web/test/studentCalculationsForGivenTest?studentId=" +
        location.state.studentId +
        "&testId=" +
        location.state.testId,
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
        for (var i = 0; i < data.length; i++) {
          console.log(data);
          list[i] = data[i];
        }
        setResults({ list: list });
      });
  }, []);

  return (
    <div className="background">
      <div>
        <Header />
      </div>
      <div className="test-list container-list">
        <span>Proteklo vrijeme</span>
        <span>Pitanje</span>
        <span>Učenikov odgovor</span>
        <span>Čudovište eliminirano?</span>
      </div>
      <hr />
      {results.list.map((item, i) => {
        return (
          <div className="test-list container-list" key={i}>
            <span>{item.timeTaken} s</span>
            <span>{item.question}</span>
            <span>{item.answer}</span>
            {item.enemyKilledStatus == "false" && <span>Ne</span>}
            {item.enemyKilledStatus == "true" && <span>Da</span>}
          </div>
        );
      })}
    </div>
  );
};
export default StudentResult;
