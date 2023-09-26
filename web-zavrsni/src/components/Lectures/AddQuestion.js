import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import valid from "./valid";
const AddQuestion = () => {
  const token = localStorage.getItem("token");
  let location = useLocation();
  let navigate = useNavigate();
  console.log(location.state);
  const [values, setValues] = useState({
    question: location.state.question,
    correct: location.state.correct,
    suggested: location.state.suggested,
    subjectId: location.state.subjectId,
    raz: location.state.raz,
    gradivo: location.state.gradivo,
    classId: location.state.classId,
  });
  const [edit, setEdit] = useState(location.state.edit);
  const [errors, setErrors] = useState({});
  const [error1, setError1] = useState({ msg: "" });
  Object.keys(errors).length = 1;
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setErrors(valid(values));
    if (
      Object.keys(errors).length === 0 &&
      document.getElementById("question").value.length > 0 &&
      document.getElementById("correct").value.length > 0 &&
      ((values.suggested.indexOf(values.correct) > -1 &&  
      values.suggested.split(",").length > 1 && values.suggested.split(",").length <= 3) ||
      document.getElementById("suggested").value.length === 0) //prettier-ignore
    ) {
      fetch(
        "https://backend-zavrsni-rad-mirta.herokuapp.com/web/question/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "same-origin",
          body: JSON.stringify(values),
        }
      )
        .then(function (response) {
          console.log("the response is" + response);
          return response.json();
        })
        .then((data) => {
          if (data.err) {
            setError1({ msg: data.err });
          } else {
            navigate("/lectures", {
              state: {
                raz: location.state.raz,
                subjectId: location.state.subjectId,
                classId: location.state.classId,
              },
            });
          }
        });
    }
  };
  const editQuestion = (e) => {
    e.preventDefault();
    setErrors(valid(values));
    console.log(values);
    if (
      Object.keys(errors).length === 0 &&
      document.getElementById("question").value.length > 0 &&
      document.getElementById("correct").value.length > 0 &&
      ((values.suggested.indexOf(values.correct) > -1 &&  
      values.suggested.split(",").length > 1 && values.suggested.split(",").length <= 3) ||
      document.getElementById("suggested").value.length === 0) //prettier-ignore
    ) {
      fetch(
        "https://backend-zavrsni-rad-mirta.herokuapp.com/web/question/edit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "same-origin",
          body: JSON.stringify({
            values: values,
            questionId: location.state.questionId,
          }),
        }
      )
        .then(function (response) {
          return response.json();
        })
        .then((data) => {
          console.log(data);
          navigate("/lectures", {
            state: {
              raz: location.state.raz,
              subjectId: location.state.subjectId,
              classId: location.state.classId,
            },
          });
        });
    }
  };
  const goToLectures = () => {
    navigate("/lectures", {
      state: {
        raz: location.state.raz,
        subjectId: location.state.subjectId,
        classId: location.state.classId,
      },
    });
  };
  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    console.log("value");
    console.log(values);
  }, [values]);
  return (
    <div className="container">
      <div className="app-wrapper_add">
        <div>
          {!edit && <h2 className="title_add title-all">Novo pitanje</h2>}
          {edit && <h2 className="title_add title-all">Uređivanje pitanja</h2>}
        </div>
        <form className="form-wrapper">
          <div className="name">
            <label className="label">Pitanje</label>
            <input
              id="question"
              className="input "
              name="question"
              type="text"
              value={values.question}
              onChange={handleChange}
            />
            {errors.question && <p className="error">{errors.question}</p>}
          </div>
          <div className="email">
            <label className="label">Točan odgovor</label>
            <input
              id="correct"
              className="input"
              type="text"
              name="correct"
              value={values.correct}
              onChange={handleChange}
            />
            {errors.correct && <p className="error">{errors.correct}</p>}
          </div>
          <div className="email">
            <label className="label">Ponuđeni odgovori</label>
            <input
              id="suggested"
              className="input"
              type="text"
              name="suggested"
              placeholder="Ponuđene odgovore odvojite zarezom"
              value={values.suggested}
              onChange={handleChange}
            />
            {errors.suggested && <p className="error">{errors.suggested}</p>}
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
                onClick={editQuestion}
              >
                Uredi
              </button>
            )}
          </div>
          <div className="class-code top pointer" onClick={goToLectures}>
            Prethodna stranica
          </div>
        </form>
      </div>
    </div>
  );
};
export default AddQuestion;
