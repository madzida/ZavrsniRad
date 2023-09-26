const db = require("../db");

//razred Class prestavlja razred
module.exports = class Class {
  //konstruktor korisnika
  constructor(class_number, class_letter, class_name, teacherEmail) {
    this.classId = undefined;
    this.class_number = class_number;
    this.class_letter = class_letter;
    this.class_name = class_name;
    this.teacherEmail = teacherEmail;
  }

  //pohrana razreda u bazu podataka
  async makeNewClass() {
    try {
      this.classId = await dbNewClass(this);
      return this.classId;
    } catch (err) {
      console.log("ERROR persisting user data: " + JSON.stringify(this));
      throw err;
    }
  }

  static async checkIfClassExists(classId) {
    try {
      let number = await dbCheckIfClassExists(classId);
      return number.broj === "1";
    } catch (err) {
      console.log("backend error " + JSON.stringify(this));
      throw err;
    }
  }
  static async removeClass(classId) {
    try {
      await dbRemoveClass(classId);
    } catch (err) {
      console.log("ERROR persisting user data: " + JSON.stringify(this));
      throw err;
    }
  }
  static async getStudentsByClassId(classId) {
    try {
      return await dbGetStudentsByClassId(classId);
    } catch (err) {
      console.log("backend error " + JSON.stringify(this));
      throw err;
    }
  }
  static async getSubjects() {
    try {
      return await dbGetSubjects();
    } catch (err) {
      console.log("backend error " + JSON.stringify(this));
      throw err;
    }
  }

  static async getAllClassesByTeacherEmail(email) {
    try {
      return await dbGetAllClassesByTeacherEmail(email);
    } catch (err) {
      console.log("backend error " + JSON.stringify(this));
      throw err;
    }
  }
};
dbRemoveClass = async (classId) => {
  const sql = `UPDATE class
                SET isdeleted = 1
                 where class_id = '${classId}';`;
  try {
    await db.query(sql, []);
  } catch (err) {
    console.log(err);
    throw err;
  }
};
//umetanje zapisa o razredu u bazu podataka
dbNewClass = async (razred) => {
  const sql = `INSERT INTO class (class_number,class_letter,school_name, teacher_email,isdeleted)
                 VALUES ('${razred.class_number}','${razred.class_letter}','${razred.class_name}','${razred.teacherEmail}',0)
                 RETURNING class_id`;
  try {
    const result = await db.query(sql, []);
    return result.rows[0].class_id;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

//check number of rows where class_id = classId
dbCheckIfClassExists = async (classId) => {
  const sql = `SELECT count(*) as broj
                 FROM class
                 WHERE class_id = ${classId};`;
  try {
    const result = await db.query(sql);
    return result.rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  }
};

//get all students from class
dbGetStudentsByClassId = async (classId) => {
  const sql = `SELECT student_id, name, surname, picture_key
                 FROM student
                 WHERE class_id = ${classId} and isDeleted = 0;`;
  try {
    const result = await db.query(sql);
    return result.rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

//get all classes for teacher
dbGetAllClassesByTeacherEmail = async (email) => {
  const sql = `Select *
                 from class
                 where teacher_email = '${email}' and isdeleted=0;`;
  try {
    const result = await db.query(sql);
    return result.rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
dbGetSubjects = async () => {
  const sql = `Select *
                 from subject;`;
  try {
    const result = await db.query(sql);
    return result.rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
