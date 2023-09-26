const db = require("../db");

//razred Students prestavlja učenika nekog razreda
module.exports = class Student {
  //konstruktor korisnika
  constructor(name, surname, pictureKey, classId) {
    this.studentId = undefined;
    this.name = name;
    this.surname = surname;
    this.pictureKey = pictureKey;
    this.classId = classId;
  }

  //pohrana korisnika u bazu podataka
  async makeNewStudent() {
    try {
      this.studentId = await dbNewStudent(this);
    } catch (err) {
      console.log("ERROR persisting user data: " + JSON.stringify(this));
      throw err;
    }
  }

  //pohrana korisnika u bazu podataka
  async editStudent() {
    try {
      await dbEditStudent(this);
    } catch (err) {
      console.log("ERROR persisting user data: " + JSON.stringify(this));
      throw err;
    }
  }

  //dohvat učenika na osnovu id (tablica students)
  static async fetchByStudentId(studentId) {
    let results = await dbGetStudentById(studentId);
    let newStudent = new Student();
    if (results.length > 0) {
      newStudent = new Student(
        results[0].name,
        results[0].surname,
        results[0].picture_key,
        results[0].class_id
      );
      newStudent.studentId = results[0].student_id;
    }
    return newStudent;
  }

  //provjera zaporke
  checkPassword(pictureKey) {
    return this.pictureKey ? this.pictureKey === pictureKey : false;
  }

  static async removeStudent(studentId) {
    try {
      await dbRemoveStudent(studentId);
    } catch (err) {
      console.log("ERROR persisting user data: " + JSON.stringify(this));
      throw err;
    }
  }
};

//dohvat korisnika iz baze podataka na osnovu id korisnika (stupac id)
dbGetStudentById = async (studentId) => {
  const sql = `SELECT student_id, name, surname, picture_key, class_id
                 FROM student
                 WHERE student_id = ${studentId} and isdeleted=0`;
  try {
    return (await db.query(sql, [])).rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

//umetanje zapisa o korisniku u bazu podataka
dbNewStudent = async (student) => {
  const sql = `INSERT INTO student (name, surname, picture_key, class_id, isDeleted)
                 VALUES ('${student.name}', '${student.surname}', '${student.pictureKey}', '${student.classId}', 0)
                 RETURNING student_id`;
  try {
    const result = await db.query(sql, []);
    return result.rows[0].student_id;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

//brisanje zapisa o korisniku u bazi podataka
dbRemoveStudent = async (studentId) => {
  const sql = `UPDATE student
                SET isDeleted = 1
                 where student_id = '${studentId}';`;
  try {
    await db.query(sql, []);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

//umetanje zapisa o korisniku u bazu podataka
dbEditStudent = async (student) => {
  const sql = `UPDATE student
                 SET name       ='${student.name}',
                     surname='${student.surname}',
                     picture_key='${student.pictureKey}'
                     WHERE student_id = ${student.studentId};`;
  try {
    await db.query(sql, []);
  } catch (err) {
    console.log(err);
    throw err;
  }
};
