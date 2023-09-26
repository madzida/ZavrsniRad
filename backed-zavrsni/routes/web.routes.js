const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");

const bodyParser = require("body-parser");
const camelcaseKeys = require("camelcase-keys");
const Student = require("../models/StudentModel");
const Class = require("../models/ClassModel");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
const cors = require("cors");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const { authJwt } = require("../middleware");
const Test = require("../models/TestModel");
const Question = require("../models/QuestionModel");
router.get("/", function (req, res, next) {
  res.send("<h1>Hello xD!</h1>");
});

//provjera da li neki razred ima aktivan test - prima classId kroz parametre
//SECURITY DODATNO: TREBALO BI PROVJERITI DA LI DANI CLASSID PRIPADA TOJ UČITELJICI (email se dohvati iz tokena)
router.get("/test/checkOngoing", async function (req, res, next) {
  let classId = parseInt(req.query.classId);

  try {
    let ongoingTestStatus = await Test.checkIfTheresOngoingTest(classId);
    return res.status(200).send({
      status: ongoingTestStatus,
      message: "Ako je 0 onda ne postoji test, ako je 1 postoji aktivan test",
    });
  } catch {
    return res.status(418).send({
      err: "Neuspješno dodavanje učenika.",
    });
  }
});

//izrada testa  //primam classId kroz parametre
//SECURITY DODATNO: TREBALO BI PROVJERITI DA LI DANI CLASSID PRIPADA TOJ UČITELJICI (email se dohvati iz tokena)
router.post(
  "/test/makeTest",
  authJwt.verifyTokenWeb,
  async function (req, res, next) {
    let subjectId = parseInt(req.body.subjectId);
    const raz = req.body.raz;
    const checkbox = req.body.checkbox;
    var list = "";
    Object.entries(checkbox).map((item, i) => {
      if (item[1] === true) {
        if (i != 0) {
          list += "," + item[0];
        } else {
          list += item[0];
        }
      }
    });
    let subject = await Test.getSubject(subjectId);
    let test = new Test(
      parseInt(req.query.classId),
      subjectId,
      raz,
      list,
      subject
    );

    let testId;
    try {
      status = await Test.checkIfTheresOngoingTest(test.classId);
      if (!status) {
        //ako ne postoji test
        testId = await test.makeTest();
        return res.status(200).send({
          message: "Test uspjesno napravljen",
        });
      } else {
        return res.status(418).send({
          err: "Vec postoji test za ovaj razred",
        });
      }
    } catch {
      return res.status(418).send({
        err: "Neuspjesna izrada testa",
      });
    }
  }
);

//izrada testa  //primam classId kroz parametre
//SECURITY DODATNO: TREBALO BI PROVJERITI DA LI DANI CLASSID PRIPADA TOJ UČITELJICI (email se dohvati iz tokena)
router.get(
  "/test/stopTest",
  authJwt.verifyTokenWeb,
  async function (req, res, next) {
    let classId = parseInt(req.query.classId);

    try {
      await Test.stopTest(classId);

      return res.status(200).send({
        message: "Test uspjesno zaustavljen",
      });
    } catch {
      return res.status(418).send({
        err: "Neuspjesno stopiranje testa",
      });
    }
  }
);

// /test/getTestsForClass

//gets all test for the given class - I want classId from parameters
//SECURITY DODATNO: TREBALO BI PROVJERITI DA LI DANI CLASSID PRIPADA TOJ UČITELJICI (email se dohvati iz tokena)
router.post(
  "/test/getTestsForClass",
  authJwt.verifyTokenWeb,
  async function (req, res, next) {
    let classId = parseInt(req.query.classId);
    let subjectId = req.body.subjectId;
    let testovi;
    if (classId) {
      if (subjectId !== "") {
        let subjectId = parseInt(req.body.subjectId);
        testovi = await Test.getAllTestsForGivenClass(classId, subjectId);
        return res.send(camelcaseKeys(testovi));
      } else {
        testovi = await Test.getAllTestsForGivenClassNotFiltered(classId);
        return res.send(camelcaseKeys(testovi));
      }
    } else {
      return res.status(401).send({
        err: "Trebam classId preko parametara!",
      });
    }
  }
);
router.get(
  "/subjects",
  authJwt.verifyTokenWeb,
  async function (req, res, next) {
    try {
      let rezultati;
      rezultati = await Class.getSubjects();
      return res.send(camelcaseKeys(rezultati));
    } catch {
      return res.status(401).send({
        err: "Neuspjelo dohvaćanje predmeta!",
      });
    }
  }
);
//gets results for the given test // I want classId from paremeters!
//SECURITY DODATNO: TREBALO BI PROVJERITI DA LI DANI CLASSID PRIPADA TOJ UČITELJICI (email se dohvati iz tokena)
router.get(
  "/test/liveResults",
  authJwt.verifyTokenWeb,
  async function (req, res, next) {
    let classId = parseInt(req.query.classId);

    let rezultati;
    if (classId) {
      let testJePokrenut = Test.checkIfTheresOngoingTest(classId); //provjeri da li je test uopće pokrenut

      if (!testJePokrenut) {
        return res.status(200).send({
          message:
            "Nema trenutno pokrenutog testa, stoga nema niti live standings!",
        });
      }
      //inače, test je pokrenut
      let obj = await Test.getOngoingTestId(classId);
      let testId = obj.test_id;
      rezultati = await Test.getLiveResultsForTheGivenTest(testId);
      return res.send(camelcaseKeys(rezultati));
    } else {
      return res.status(401).send({
        err: "Trebam classId preko parametara!",
      });
    }
  }
);

//gets results for the given test // I want testId from parameters
//SECURITY DODATNO: TREBALO BI PROVJERITI DA LI DANI testId PRIPADA TOJ UČITELJICI (email se dohvati iz tokena)
router.get(
  "/test/getResultsForTest",
  authJwt.verifyTokenWeb,
  async function (req, res, next) {
    let testId = parseInt(req.query.testId);
    let rezultati;
    if (testId) {
      rezultati = await Test.getResultsForTheGivenTest(testId);
      console.log(rezultati);
      return res.send(camelcaseKeys(rezultati));
    } else {
      return res.status(401).send({
        err: "Trebam testId preko parametara!",
      });
    }
  }
);

//gets results for the given test // I want testId and studentId from parameters
//SECURITY DODATNO: TREBALO BI PROVJERITI DA LI DANI test PRIPADA TOJ UČITELJICI (email se dohvati iz tokena)
router.get(
  "/test/studentCalculationsForGivenTest",
  authJwt.verifyTokenWeb,
  async function (req, res, next) {
    let testId = parseInt(req.query.testId);
    let studentId = parseInt(req.query.studentId);

    let rezultati;
    if (testId) {
      rezultati = await Test.getStudentCalculationsForGivenTest(
        testId,
        studentId
      );
      return res.send(camelcaseKeys(rezultati));
    } else {
      return res.status(401).send({
        err: "Trebam testId i studentId preko parametara!",
      });
    }
  }
);
//gradiva
router.post(
  "/test/lecture",
  authJwt.verifyTokenWeb,
  async function (req, res, next) {
    let subjectId = parseInt(req.body.subjectId);
    let raz = req.body.raz;
    try {
      let lectures = await Test.getAllLectures(subjectId, raz);
      return res.send(camelcaseKeys(lectures));
    } catch {
      return res.status(401).send({
        err: "Neuspjelo dohvacanje gradiva!",
      });
    }
  }
);
router.post(
  "/test/lectureForSubject",
  authJwt.verifyTokenWeb,
  async function (req, res, next) {
    let subjectId = parseInt(req.body.subjectId);
    let raz = req.body.raz;
    try {
      //let subjectId = await Test.getSubjectId(subject);
      let lectures = await Test.getAllLecturesForGivenSubject(subjectId, raz);
      return res.send(camelcaseKeys(lectures));
    } catch {
      return res.status(401).send({
        err: "Neuspjelo dohvacanje gradiva za taj predmet nezz!",
      });
    }
  }
);
//PRIJASNJE DOHVACANJE GRADIVA
// router.post(
//   "/test/lecture",
//   authJwt.verifyTokenWeb,
//   async function (req, res, next) {
//     let subject = req.body.subject;
//     let raz = req.body.raz;
//     try {
//       let lectures = await Test.getAllLectures(subject, raz);
//       return res.send(camelcaseKeys(lectures));
//     } catch {
//       return res.status(401).send({
//         err: "Neuspjelo dohvacanje gradiva!",
//       });
//     }
//   }
// );
//dodavanje pitanja
router.post(
  "/question/add",
  authJwt.verifyTokenWeb,
  async function (req, res, next) {
    let subjectId = parseInt(req.body.subjectId);
    let raz = req.body.raz;
    let lecture = req.body.gradivo;
    let question = req.body.question;
    let correct = req.body.correct;
    let suggested = req.body.suggested;

    try {
      //let subjectId = await Test.getSubjectId(subject);
      let lectureId = await Test.getLectureId(subjectId, lecture, raz);
      let questionId = await Question.getMaxQuestionId();
      await Question.makeNewQuestion(
        question,
        correct,
        suggested,
        lectureId,
        questionId
      );
      return res.json(true);
    } catch {
      return res.status(418).send({
        err: "Neuspješno dodavanje pitanja.",
      });
    }
  }
);
//dodavanje učenika. Kroz body se šalje ime, prezime, slicica, idRazred
//SECURITY DODATNO: TREBALO BI PROVJERITI DA LI DANI idRazred PRIPADA TOJ UČITELJICI (email se dohvati iz tokena)
router.post(
  "/student/add",
  authJwt.verifyTokenWeb,
  async function (req, res, next) {
    let student = new Student(
      req.body.ime,
      req.body.prezime,
      req.body.slicica,
      req.body.idRazred
    );

    try {
      await student.makeNewStudent();
      return res.json(true);
    } catch {
      return res.status(418).send({
        err: "Neuspješno dodavanje učenika.",
      });
    }
  }
);
//brisanje pitanja
router.post(
  "/question/remove",
  authJwt.verifyTokenWeb,
  async function (req, res, next) {
    const questionId = req.body.questionId;

    try {
      await Question.removeQuestion(questionId);
      return res.json(true);
    } catch {
      return res.status(418).send({
        err: "Neuspješno brisanje pitanja.",
      });
    }
  }
);
router.post(
  "/question/edit",
  authJwt.verifyTokenWeb,
  async function (req, res, next) {
    let question = req.body.values.question;
    let correct = req.body.values.correct;
    let suggested = req.body.values.suggested.toString();
    let questionId = req.body.questionId;
    try {
      await Question.editQuestion(question, correct, suggested, questionId);
      return res.json(true);
    } catch {
      return res.status(418).send({
        err: "Neuspješno uređivanje pitanja.",
      });
    }
  }
);
//brisanje učenika - šalješ mi studentId iz body
//SECURITY DODATNO: TREBALO BI PROVJERITI DA LI DANI studentId PRIPADA nekom razredu od te UČITELJICE (email se dohvati iz tokena)
router.post(
  "/student/remove",
  authJwt.verifyTokenWeb,
  async function (req, res, next) {
    const studentId = req.body.studentId;

    try {
      await Student.removeStudent(studentId);
      return res.json(true);
    } catch {
      return res.status(418).send({
        err: "Neuspješno brisanje učenika.",
      });
    }
  }
);
router.post("/remove", authJwt.verifyTokenWeb, async function (req, res, next) {
  const classId = req.body.classId;

  try {
    await Class.removeClass(classId);
    return res.json(true);
  } catch {
    return res.status(418).send({
      err: "Neuspješno brisanje razreda.",
    });
  }
});

//editanje učenika. šalješ studentId, name, surname, pictureKey kroz body
//SECURITY DODATNO: TREBALO BI PROVJERITI DA LI DANI studentId PRIPADA nekom razredu od te UČITELJICE (email se dohvati iz tokena)
router.post(
  "/student/edit",
  authJwt.verifyTokenWeb,
  async function (req, res, next) {
    let student = new Student(
      req.body.name,
      req.body.surname,
      req.body.pictureKey,
      null
    );
    student.studentId = req.body.studentId;

    try {
      await student.editStudent(student);
      return res.json(true);
    } catch {
      return res.status(418).send({
        err: "Neuspješno uređivanje studenta.",
      });
    }
  }
);

//gets all classes for the given teacher - I get email from token
router.get(
  "/teacherClass",
  authJwt.verifyTokenWeb,
  async function (req, res, next) {
    let razredi;
    let email = authJwt.getTeacherEmail();

    if (email) {
      razredi = await Class.getAllClassesByTeacherEmail(email);
      return res.send(camelcaseKeys(razredi));
    } else {
      return res.status(401).send({
        err: "Trebam email preko parametara!",
      });
    }
  }
);

// izrada novog razreda - šalješ className i email iz body
router.post(
  "/makeClass",
  authJwt.verifyTokenWeb,
  async function (req, res, next) {
    const class_number = req.body.class_number;
    const class_letter = req.body.class_letter;
    const class_name = req.body.class_name;
    const email = authJwt.getTeacherEmail();
    let razred = new Class(class_number, class_letter, class_name, email);

    if (email) {
      await razred.makeNewClass();
      return res.status(200).send({
        classId: razred.classId,
        message: "Class successfully made",
      });
    } else {
      return res.status(401).send({
        err: "Please login first!",
      });
    }
  }
);

//get all students from given class - takes classId from parameters
//SECURITY DODATNO: TREBALO BI PROVJERITI DA LI je dani classId razred od UČITELJICE (email se dohvati iz tokena)
router.get("/class", authJwt.verifyTokenWeb, async function (req, res, next) {
  let classId = parseInt(req.query.classId);
  let students;

  if (await Class.checkIfClassExists(classId)) {
    //ako postoji taj razred
    students = await Class.getStudentsByClassId(classId); //dohvati sve učenike
    return res.status(200).send(camelcaseKeys(students)); //vrati sve učenike
  } else {
    return res.status(200).send({
      message: "There are no students in the class or class doesn't exist",
    });
  }
});

//------------------------ISPOD OVE LINIJE JE SAMO LOGIN I SIGN UP----------------------------------------------------------------
//------------------------LOGIN I SIGUN UP----------------------------------------------------------------------------------------
//------------------------LOGIN I SIGUN UP----------------------------------------------------------------------------------------
//------------------------LOGIN I SIGUN UP----------------------------------------------------------------------------------------
//------------------------LOGIN I SIGUN UP----------------------------------------------------------------------------------------
//------------------------LOGIN I SIGUN UP----------------------------------------------------------------------------------------
//------------------------LOGIN I SIGUN UP----------------------------------------------------------------------------------------

//trenutno mi se ne da raditi teacher model xD bit će jednog dana
//teacher signup -- dodati verifikaciju za ...
router.post("/signup", function (req, res, next) {
  const email = req.body.email;
  const fullname = req.body.fullname;
  const password = req.body.password;
  let teacher;

  (async () => {
    let cryptedPassword = bcrypt.hashSync(password, 10);

    //dobavi podatke o korisniku iz baze podataka
    const sql_get_teacher_by_email = `select count(*) as broj
                                          from teacher
                                          where email = '${email}';`;

    //provjeri da li se već email koristi
    try {
      await (async () => {
        teacher = await db.query(sql_get_teacher_by_email);
      })();
    } catch {
      return res.status(401).send({
        err: "Neuspješna izrada profila.",
      });
    }

    //ako se email već koristi prijavi grešku
    if (teacher.rows[0].broj === "1") {
      return res.status(401).send({
        err3: "Email je već iskorišten.",
      });
    }

    //ako se email ne koristi, napravi tog korisnika
    const sql_create_teacher = `INSERT into teacher(email, fullname, password)
                                    values ('${email}', '${fullname}', '${cryptedPassword}')`;

    console.log(sql_create_teacher);
    try {
      await (async () => {
        await db.query(sql_create_teacher);
      })();

      let token = jwt.sign({ email: email }, config.secretWeb, {
        expiresIn: 86400, // 24 hours
      });

      return res.json({
        email: email,
        fullname: fullname,
        token: token,
      });
    } catch {
      res.status(401).send({
        err: "Neuspješna izrada korisničkog računa.",
      });
    }
  })();
});

//teacher login
router.post("/login", function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  let teacher;

  (async () => {
    //ako za signup na frontu ima provjera za email oblik, ona treba pogotovo biti i za login

    //dobavi podatke o korisniku iz baze podataka
    let sql_get_teacher_by_email = `select *
                                        from teacher
                                        where email = '${email}';`;

    //provjeri da li takav korisnik postoji
    try {
      await (async () => {
        teacher = await db.query(sql_get_teacher_by_email);
      })();
    } catch {
      return res.status(401).send({
        err: "Neuspješna veza s bazom",
      });
    }

    //neispravan email ili lozinka
    try {
      if (!bcrypt.compareSync(password, teacher.rows[0].password)) {
        return res.status(401).send({
          err: "Neispravan email ili lozinka",
        });
      }
    } catch {
      return res.status(401).send({
        err: "Neispravan email ili lozinka",
      });
    }

    let sql_get_teacher_fullName_by_email = `select fullname
                                                 from teacher
                                                 where email = '${email}';`;

    let fullname;
    try {
      await (async () => {
        fullname = await db.query(sql_get_teacher_fullName_by_email);
      })();
    } catch {
      return res.status(401).send({
        err: "Neuspješna veza s bazom",
      });
    }

    let token = jwt.sign({ email: email }, config.secretWeb, {
      expiresIn: 86400, // 24 hours
    });

    return res.json({
      email: email,
      fullname: fullname.rows[0].fullname,
      token: token,
      status: 1,
    });
  })();
});

// ovaj link ne trebaš niti zvati, to je prvobitno bilo ako bi imali sesije
router.get("/logout", function (req, res, next) {
  return res.json(true);
});

module.exports = router;
