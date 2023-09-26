import React, { useEffect, useState } from "react";
import {
  Link,
  withRouter,
  useLocation,
  useNavigate,
  createSearchParams,
} from "react-router-dom";
import ReactHover, { Trigger, Hover } from "react-hover";
const Lectures = () => {
  const [lectures, setLectures] = useState({ list: [] });
  const [question, setQuestion] = useState({ list: [] });
  const [check, setCheck] = useState({});
  const [test, setTest] = useState({ msg: false });
  const [image, setImageForQuestion] = useState({});
  const [state, setState] = useState({ isOpen: false });
  let location = useLocation();
  let navigate = useNavigate();
  let list = [];
  let list2 = [];
  const token = localStorage.getItem("token");
  useEffect(() => {
    fetch("https://backend-zavrsni-rad-mirta.herokuapp.com/web/test/lecture", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "same-origin",
      body: JSON.stringify({
        subjectId: location.state.subjectId,
        raz: location.state.raz,
      }),
    })
      .then(function (response) {
        return response.json();
      })
      .then((data) => {
        try {
          console.log(data);
          var br = 0;
          for (var i = 0; i < data.length; i++) {
            list2[i] = data[i];
          }
          console.log(list2);
          //setLectures({ list: list });
          setQuestion({ list: list2 });
          console.log(question);
        } catch {
          console.log(data);
        }
      });
  }, []);
  useEffect(() => {
    console.log(state.isOpen);
    setState({ isOpen: false });
    fetch(
      "https://backend-zavrsni-rad-mirta.herokuapp.com/web/test/lectureForSubject",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "same-origin",
        body: JSON.stringify({
          subjectId: location.state.subjectId,
          raz: location.state.raz,
        }),
      }
    )
      .then(function (response) {
        return response.json();
      })
      .then((data) => {
        try {
          console.log(data);
          for (var i = 0; i < data.length; i++) {
            list[i] = data[i].lecture;
          }
          //console.log(list2);
          setLectures({ list: list });
        } catch {
          console.log(data);
        }
      });
  }, []);
  const startTest = () => {
    if (Object.keys(check).length !== 0) {
      fetch(
        "https://backend-zavrsni-rad-mirta.herokuapp.com/web/test/makeTest?classId=" +
          location.state.classId,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "same-origin",
          body: JSON.stringify({
            subjectId: location.state.subjectId,
            raz: location.state.raz,
            checkbox: check,
          }),
        }
      )
        .then(function (response) {
          console.log("the response is" + JSON.stringify(response));
          return response.json();
        })
        .then((data) => {
          if (!data.err) setTest({ msg: true });
          else setTest({ msg: false });
        });
      navigate("/home", {
        state: {
          raz: location.state.raz,
          classId: location.state.classId,
        },
      });
    }
  };
  const goHome = () => {
    navigate("/home", {
      state: {
        raz: location.state.raz,
        classId: location.state.classId,
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
  const checkedLecture = (e) => {
    setCheck({ ...check, [e.target.name]: e.target.checked });
  };
  const makeSure = (q) => {
    if (window.confirm("Želite li zaista obrisati pitanje?")) {
      deleteQuestion(q);
    }
  };
  const deleteQuestion = (questionId) => {
    console.log(questionId);
    fetch(
      "https://backend-zavrsni-rad-mirta.herokuapp.com/web/question/remove",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
        body: JSON.stringify({
          subjectId: location.state.subjectId,
          questionId: questionId,
        }),
      }
    )
      .then(function (response) {
        return response.json();
      })
      .then((data) => {
        console.log(data);
      });
    var elem = document.getElementById(questionId);
    elem.parentNode.removeChild(elem);
  };

  useEffect(() => {
    console.log(check);
  }, [check]);
  const addQuestion = (gradivo) => {
    navigate("/addQuestion", {
      state: {
        raz: location.state.raz,
        subjectId: location.state.subjectId,
        classId: location.state.classId,
        gradivo: gradivo,
        question: "",
        correct: "",
        suggested: "",
        edit: false,
      },
    });
  };
  const editQuestion = (gradivo, question, suggested, correct, questionId) => {
    navigate("/addQuestion", {
      state: {
        raz: location.state.raz,
        subjectId: location.state.subjectId,
        classId: location.state.classId,
        gradivo: gradivo,
        question: question,
        correct: correct,
        suggested: suggested,
        edit: true,
        questionId: questionId,
      },
    });
  };
  const setImage = (image2) => {
    setState({ isOpen: !state.isOpen });
    console.log("cliked");
    setImageForQuestion(image2);
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
                goHome();
              }}
            >
              <img
                width="300"
                height="80"
                alt="logo"
                src={"../images/logoo.png"}
              />
            </div>
            <div>
              <button className="link  pointer" id="stop" onClick={startTest}>
                Pokreni test
              </button>
              <button className="link pointer" onClick={logout}>
                Odjavi se
              </button>
            </div>
          </div>
        </nav>
      </div>
      {state.isOpen && (
        <div>
          <div className="popup-text">
            Kliknite sliku za povratak na prethodnu stranicu
          </div>
          <div className="popup">
            <img
              width="500"
              height="500"
              alt="nezz"
              onClick={() => setImage()}
              src={"../images/" + image + ".jpg"}
            />
          </div>
        </div>
      )}
      {state.isOpen === false && (
        <div>
          <div>
            {" "}
            {lectures.list.map((item, i) => (
              <div key={i}>
                <div>
                  <div className="margin">
                    <label className="list-container-lectures bold">
                      <input
                        type="checkbox"
                        className="checkbox"
                        name={item}
                        value={item}
                        onChange={(e) => checkedLecture(e)}
                      />
                      {item}
                    </label>
                    <button
                      className="link border"
                      onClick={() => addQuestion(item)}
                    >
                      Dodaj pitanje
                    </button>
                  </div>
                  {question.list.length !== 0 && (
                    <div className="width-lectures">
                      <h5 className="test-list container-list">
                        <span>Pitanje</span>
                        <span>Ponuđeni odgovori</span>
                        <span>Točan odgovor</span>
                        <span>Obriši/uredi</span>
                      </h5>
                      <hr />
                      {question.list.map((q, i) => (
                        <div key={i}>
                          {q.lecture === item && (
                            <div
                              id={q.questionId}
                              className="test-list border-bottom container-list"
                            >
                              {q.image === null && <span>{q.question}</span>}
                              {q.image !== null && (
                                <span className="image-question">
                                  <span>
                                    <ReactHover
                                      options={optionsCursorTrueWithMargin}
                                    >
                                      <Trigger type="trigger">
                                        <img
                                          width="80"
                                          height="80"
                                          alt="nezz"
                                          onClick={() => setImage(q.image)}
                                          src={"../images/" + q.image + ".jpg"}
                                        />
                                      </Trigger>
                                      <Hover type="hover">
                                        <p className="hover-text">
                                          Kliknite za bolji pregled slike{" "}
                                        </p>
                                      </Hover>
                                    </ReactHover>
                                  </span>
                                  <span>{q.question}</span>
                                </span>
                              )}
                              <span>
                                {q.suggested !== null &&
                                  q.suggested.map((s, i) => (
                                    <p key={i} className="suggested-font">
                                      {i + 1}. {s}{" "}
                                    </p>
                                  ))}
                                {q.suggested.length === 0 && (
                                  <p key={i} className="suggested-font">
                                    **Pitanje s unosom točnog odgovora**
                                  </p>
                                )}
                                {q.suggested === null && (
                                  <p key={i} className="suggested-font">
                                    **Pitanje s unosom točnog odgovora**
                                  </p>
                                )}
                              </span>
                              <span>{q.correct}</span>
                              <span>
                                <button className="image">
                                  <img
                                    alt="delete"
                                    width="40"
                                    height="20"
                                    src={"../images/delete.svg"}
                                    onClick={() => makeSure(q.questionId)}
                                  />
                                </button>
                                <button className="image">
                                  <img
                                    alt="edit"
                                    width="40"
                                    height="20"
                                    src={"../images/pencil.svg"}
                                    onClick={() =>
                                      editQuestion(
                                        item,
                                        q.question,
                                        q.suggested,
                                        q.correct,
                                        q.questionId
                                      )
                                    }
                                  />
                                </button>
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default Lectures;
