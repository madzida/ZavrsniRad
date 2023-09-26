import React, { useState, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
const TopResults = () => {
  let listResults = [];
  let location = useLocation();
  let navigate = useNavigate();
  const colors = [
    "color1",
    "color2",
    "color3",
    "color4",
    "color5",
    "color6",
    "color7",
    "color8",
  ];

  const [results, setResults] = useState({ list: [] });
  const [state, setState] = useState({ list: [] });
  const token = localStorage.getItem("token");
  const proba = [
    {
      studentId: 1,
      name: "Mirta",
      surname: "Vučinić",
      broj: 2,
    },
    {
      studentId: 2,
      name: "Jan",
      surname: "Roland",
      broj: 22,
    },
    {
      studentId: 3,
      name: "Mislav",
      surname: "Vučinić",
      broj: 21,
    },
    {
      studentId: 4,
      name: "Borna",
      surname: "Vučinić",
      broj: 1,
    },
    {
      studentId: 5,
      name: "Maja",
      surname: "Jurković",
      broj: 100,
    },
    {
      studentId: 6,
      name: "Maja",
      surname: "Vučinić",
      broj: 101,
    },
    {
      studentId: 7,
      name: "Davor",
      surname: "Vučinić",
      broj: 103,
    },
    {
      studentId: 8,
      name: "Ivan",
      surname: "Hajpek",
      broj: 104,
    },
    {
      studentId: 9,
      name: "Martina",
      surname: "Galić",
      broj: 105,
    },
    {
      studentId: 10,
      name: "Tomislav",
      surname: "Jagušt",
      broj: 106,
    },
  ];
  useEffect(() => {
    console.log(results);
    console.log(location.state);
  }, [results]);
  const topResults = async () => {
    listResults = [];
    try {
      await fetch(
        "https://backend-zavrsni-rad-mirta.herokuapp.com/web/test/liveResults?classId=" +
          location.state.classId,
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
            listResults[i] = data[i];
          }
          setResults({ list: listResults });
          //setResults({ list: proba });
        });
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    topResults();
    const interval = setInterval(() => {
      topResults();
    }, 10000);

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    let sortedProducts;
    sortedProducts = [...results.list].sort((a, b) => {
      return parseInt(b.broj) - parseInt(a.broj);
    });
    setState({ list: sortedProducts });
    console.log(state);
  }, [results]);
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
  const goHome = () => {
    navigate("/home", {
      state: { classId: location.state.classId, raz: location.state.raz },
    });
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
              <img width="300" height="80" src={"../images/logoo.png"} />
            </div>
            <button className="link pointer" onClick={logout}>
              Odjavi se
            </button>
          </div>
        </nav>
      </div>
      <h5 className="topResult-container container-list">
        <span>Poredak na ljestvici</span>
        <span>Ime</span>
        <span>Prezime</span>
        <span>Uništeno čudovišta</span>
      </h5>
      <hr />
      <div className="rows-toplist">
        {state.list.slice(0, 10).map((item, i) => {
          return (
            <div
              key={i}
              className={
                "topResult-container container-list top10 " +
                colors[Math.floor(Math.random() * 8)]
              }
            >
              <span>{i + 1}</span>
              <span>{item.name}</span>
              <span>{item.surname}</span>
              <span>{item.broj}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default TopResults;
