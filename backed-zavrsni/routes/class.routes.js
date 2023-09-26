const express = require("express");
const router = express.Router();
const db = require("../db");
const camelcaseKeys = require("camelcase-keys");
const authJwt = require("../middleware/authJwt");

router.get("/", async function (req, res, next) {
  let id = parseInt(req.query.classId);
  let soba;
  let students;
  let teacher;

  await (async () => {
    soba = await db.query(
      `SELECT count(*) as broj FROM class WHERE class_id = ` + id + ";"
    );
  })();

  if (soba.rows[0].broj === "1") {
    //ako postoji taj razred vrati učenike
    await (async () => {
      students = await db.query(`SELECT student_id, name, surname
                                       FROM student
                                       WHERE class_id = ${id} and isDeleted=0
                                       order by surname;`);
    })();

    let sql_teacher_name = `select fullname
                                from teacher t
                                         join class r on r.teacher_email = t.email
                                where r.class_id = '${id}'`;
    await (async () => {
      teacher = await db.query(sql_teacher_name);
    })();
    try {
      res.send({
        teacherName: camelcaseKeys(teacher.rows[0].fullname),
        students: camelcaseKeys(students.rows),
      });
    } catch (err) {
      //do nothing
    }
  } else {
    res.status(401).send({
      err: "Ne postoji taj razred - 401 po želji kolegice haha",
    });
  }
});

router.get("/tokenTest", authJwt.verifyToken, async function (req, res, next) {
  let studentId = authJwt.getStudent().studentId;
  console.log(studentId);
  res
    .send({
      studentId: studentId,
      message: "Okej tokeni ti rade",
    })
    .status(200);
});

module.exports = router;
