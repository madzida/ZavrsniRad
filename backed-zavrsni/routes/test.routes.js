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
const TestEntry = require("../models/TestEntryModel");

router.get("/", function (req, res, next) {
  res.send("<h1>Hello xD!</h1>");
});
router.get(
  "/testQuestions",
  authJwt.verifyToken,
  async function (req, res, next) {
    try {
      let student = authJwt.getStudent();
      let studentId = student.studentId;
      let classId = student.classId;
      let status = await Test.checkIfTheresOngoingTest(classId); //true ako ima ongoing test

      if (status) {
        let obj = await Test.getOngoingTestId(classId); //dohvati njegov id
        let testId = obj.test_id;
        let subjectId = obj.subject_id;
        //let subjectId = await Test.getSubjectId(subject);
        let rezultati = await Test.getQuestionsForGivenTest(testId, subjectId);
        return res.send(camelcaseKeys(rezultati));
      }
    } catch {
      return res.status(403).send({
        err: "Neuspješno dodavanje zapisa ucenika o testu.",
      });
    }
    return res.status(200).send({
      message: "Nema aktivnog testa!",
    });
  }
);
//dodavanje zapisa o jednom pucanju -- primam calculation, enemyKilled, timeTaken iz body
router.post("/testEntry", authJwt.verifyToken, async function (req, res, next) {
  try {
    let student = authJwt.getStudent();
    let studentId = student.studentId;
    let classId = student.classId;
    let status = await Test.checkIfTheresOngoingTest(classId); //true ako ima ongoing test

    if (status) {
      let obj = await Test.getOngoingTestId(classId); //dohvati njegov id
      let testId = obj.test_id;
      let subject = obj.subject;
      let testEntry = new TestEntry(
        req.body.calculation,
        req.body.enemyKilled,
        req.body.timeTaken,
        req.body.question,
        studentId,
        testId
      );
      await testEntry.saveTestEntry(); //spremi ga

      return res.status(200).send({
        message: "Test entry uspješno spremljen!",
      });
    }
  } catch {
    return res.status(403).send({
      err: "Neuspješno dodavanje zapisa ucenika o testu.",
    });
  }
  return res.status(200).send({
    message: "Nema aktivnog testa!",
  });
});

//dodavanje zapisa o jednom pucanju -- primam result, totalTimeTaken
router.post(
  "/testResult",
  authJwt.verifyToken,
  async function (req, res, next) {
    try {
      let student = authJwt.getStudent();
      let studentId = student.studentId;
      let classId = student.classId;

      let status = await Test.checkIfTheresOngoingTest(classId); //true ako ima ongoing test
      if (status) {
        let obj = await Test.getOngoingTestId(classId); //dohvati njegov id
        let testId = obj.test_id;
        let subject = obj.subject;
        await Test.saveTestResultsForStudent(
          testId,
          studentId,
          req.body.result,
          req.body.totalTimeTaken
        );
        return res.status(200).send({
          message: "Test entry uspješno spremljen!",
        });
      }
      return res.status(200).send({
        message: "Nema aktivnih testova",
      });
    } catch {
      return res.status(403).send({
        err: "Neuspješno dodavanje zapisa ucenika o testu.",
      });
    }
  }
);
router.post("/checkOngoing", async function (req, res, next) {
  try {
    let classId = req.body.classId;
    let status = await Test.checkIfTheresOngoingTest(classId); //true ako ima ongoing test
    return res.status(200).send({
      status: status,
    });
  } catch {
    return res.status(200).send({
      message: "Neuspješno!",
    });
  }
});

module.exports = router;
