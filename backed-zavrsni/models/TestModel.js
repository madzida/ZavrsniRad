const db = require("../db");

//razred Class prestavlja razred
module.exports = class Test {
  //konstruktor korisnika
  constructor(classId, subjectId, raz, list, subject) {
    this.testId = undefined;
    this.classId = classId;
    this.dateOf = undefined;
    this.status = undefined;
    this.subjectId = subjectId;
    this.subject = subject;
    this.raz = raz;
    this.list = list;
  }

  //pohrana razreda u bazu podataka
  async makeTest() {
    try {
      this.testId = await dbNewTest(this);
      return this.testId;
    } catch (err) {
      console.log("ERROR persisting user data: " + JSON.stringify(this));
      throw err;
    }
  }
  static async getQuestionsForGivenTest(testId, subjectId) {
    try {
      return await dbGetQuestionsForGivenTest(testId, subjectId);
    } catch (err) {
      console.log("ERROR persisting user data: " + JSON.stringify(this));
      throw err;
    }
  }

  static async checkIfTheresOngoingTest(classId) {
    try {
      let number = await dbCheckIfTheresOngoingTest(classId);
      return number.broj === "1";
    } catch (err) {
      console.log("backend error " + JSON.stringify(this));
      throw err;
    }
  }
  static async getAllLecturesForGivenSubject(subjectId, raz) {
    try {
      return await dbGetAllLectures(subjectId, raz);
    } catch (err) {
      console.log("backend error " + JSON.stringify(this));
      throw err;
    }
  }

  static async getOngoingTestId(classId) {
    try {
      const obj = await dbGetOngoingTestId(classId);
      return obj;
    } catch (err) {
      console.log("backend error " + JSON.stringify(this));
      throw err;
    }
  }
  static async getSubject(subjectId) {
    try {
      const subject = await dbGetSubject(subjectId);
      return subject;
    } catch (err) {
      console.log("backend error " + JSON.stringify(this));
      throw err;
    }
  }
  static async getLectureId(subjectId, lecture, raz) {
    try {
      const lectureId = await dbGetLectureId(subjectId, lecture, raz);
      return lectureId;
    } catch (err) {
      console.log("backend error " + JSON.stringify(this));
      throw err;
    }
  }
  static async getAllTestsForGivenClass(classId, subject) {
    try {
      return await dbGetAllTestsForGivenClass(classId, subject);
    } catch (err) {
      console.log("backend error " + JSON.stringify(this));
      throw err;
    }
  }
  static async getAllTestsForGivenClassNotFiltered(classId) {
    try {
      return await dbGetAllTestsForGivenClassNotFiltered(classId);
    } catch (err) {
      console.log("backend error " + JSON.stringify(this));
      throw err;
    }
  }

  static async getResultsForTheGivenTest(testId) {
    try {
      return await dbGetResultsForTheGivenTest(testId);
    } catch (err) {
      console.log("backend error " + JSON.stringify(this));
      throw err;
    }
  }

  static async getLiveResultsForTheGivenTest(testId) {
    try {
      return await dbGetLiveResultsForTheGivenTest(testId);
    } catch (err) {
      console.log("backend error " + JSON.stringify(this));
      throw err;
    }
  }

  static async saveTestResultsForStudent(
    testId,
    studentId,
    result,
    totalTimeTaken
  ) {
    try {
      await dbSaveTestResultsForStudent(
        testId,
        studentId,
        result,
        totalTimeTaken
      );
    } catch (err) {
      console.log("backend error " + JSON.stringify(this));
      throw err;
    }
  }

  static async getStudentCalculationsForGivenTest(testId, studentId) {
    try {
      return await dbGetStudentCalculationsForGivenTest(testId, studentId);
    } catch (err) {
      console.log("backend error " + JSON.stringify(this));
      throw err;
    }
  }

  static async stopTest(classId) {
    try {
      await dbStopTest(classId);
      return true;
    } catch (err) {
      console.log("backend error " + JSON.stringify(this));
      throw err;
    }
  }
  static async getAllLectures(subjectId, raz) {
    try {
      return await dbGetAllLecturesForGivenSubject(subjectId, raz);
    } catch (err) {
      console.log("backend error " + JSON.stringify(this));
      throw err;
    }
  }
};

//izrada novog testa
dbNewTest = async (test) => {
  const sql = `INSERT INTO test (class_id, date_of, status,subject_id,subject,class_number,lecture_list)
                 select '${test.classId}', CURRENT_DATE, '1','${test.subjectId}','${test.subject}','${test.raz}',parts
                 from string_to_array('${test.list}', ',') AS parts
                 RETURNING test_id`;
  try {
    const result = await db.query(sql, []);
    return result.rows[0].testId;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

//spremanje rezultata testa za nekog učenika
dbSaveTestResultsForStudent = async (
  testId,
  studentId,
  result,
  totalTimeTaken
) => {
  const sql = `INSERT INTO test_student (result, time_of, student_id, test_id)
                VALUES('${result}', '${totalTimeTaken}', '${studentId}', '${testId}');`;

  try {
    const result = await db.query(sql, []);
    return true;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

//zaustavljanje testa
dbStopTest = async (classId) => {
  const sql = `UPDATE test 
                SET status = '0' 
                WHERE class_id = ${classId};`;

  try {
    await db.query(sql);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

//check number of rows where class_id = classId
dbCheckIfTheresOngoingTest = async (classId) => {
  const sql = `SELECT count(*) as broj
                 FROM test
                 WHERE class_id = ${classId} and status='1';`;
  try {
    const result = await db.query(sql);
    return result.rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  }
};

//check number of rows where class_id = classId
dbGetOngoingTestId = async (classId) => {
  const sql = `SELECT test_id,subject_id
                 FROM test
                 WHERE class_id = ${classId} and status='1';`;
  try {
    const result = await db.query(sql);
    return result.rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  }
};
dbGetSubject = async (subjectId) => {
  const sql = `SELECT subject
                 FROM subject
                 WHERE subject_id = ${subjectId};`;
  try {
    const result = await db.query(sql);
    return result.rows[0].subject;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
dbGetLectureId = async (subjectId, lecture, raz) => {
  const sql = `SELECT lecture_id
                 FROM lecture
                 WHERE subject_id = ${subjectId} and class=${raz} and lecture='${lecture}';`;
  try {
    const result = await db.query(sql);
    return result.rows[0].lecture_id;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
//database query for getting all tests for given class
dbGetAllTestsForGivenClass = async (classId, subjectId) => {
  const sql = `SELECT test.test_id,test.class_id,test.date_of,test.status,test.subject,test.class_number,test.lecture_list
                 FROM test join subject on test.subject_id=subject.subject_id
                 WHERE class_id = ${classId} and test.subject_id=${subjectId};`;
  try {
    const result = await db.query(sql);
    return result.rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
dbGetAllTestsForGivenClassNotFiltered = async (classId) => {
  const sql = `SELECT *
                 FROM test
                 WHERE class_id = ${classId};`;
  try {
    const result = await db.query(sql);
    return result.rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
dbGetQuestionsForGivenTest = async (testId, subjectId) => {
  const sql = `SELECT *
                 FROM lecture
                inner join test on test_id=${testId}
                inner join question on lecture.lecture_id=question.lecture_id where isdeleted=0 
                and lecture.lecture in (select unnest(test.lecture_list)) and lecture.subject_id=${subjectId};`;
  try {
    const result = await db.query(sql);
    return result.rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
//
//and CHAR_LENGTH(time_of)<5
//database query for getting all results for given test
dbGetResultsForTheGivenTest = async (testId) => {
  const sql = `SELECT s.student_id,  s.name, s.surname, result, time_of
                 FROM test_student 
                JOIN student s on s.student_id = test_student.student_id
                 WHERE test_id = ${testId}
                ORDER BY surname asc ;`;
  try {
    const result = await db.query(sql);
    return result.rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

//database query for getting all results for given test
dbGetLiveResultsForTheGivenTest = async (testId) => {
  const sql = `SELECT s.student_id,  s.name, s.surname, count(*) as broj
                 FROM test_student_entry 
                    JOIN student s on s.student_id = test_student_entry.student_id 
                    WHERE test_id = '${testId}' and enemy_killed_status = 'true' 
                    group by   s.name, s.student_id, s.surname
                    ORDER BY broj desc;`;
  try {
    const result = await db.query(sql);
    return result.rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

//database query for getting all calculations for given test
dbGetStudentCalculationsForGivenTest = async (testId, studentId) => {
  const sql = `SELECT student_id, time_taken, answer, enemy_killed_status,question
                 FROM test_student_entry
                 WHERE test_id = ${testId} and student_id = ${studentId}
                ORDER BY entry_id;`;
  try {
    const result = await db.query(sql);
    return result.rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

dbGetAllLecturesForGivenSubject = async (subjectId, raz) => {
  const sql = `Select *
                 from question join lecture on subject_id=${subjectId} and lecture.lecture_id=question.lecture_id where lecture.class='${raz}' and question.isdeleted=0`;
  try {
    const result = await db.query(sql);
    return result.rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
dbGetAllLectures = async (subjectId, raz) => {
  const sql = `Select *
                 from lecture where subject_id=${subjectId} and lecture.class='${raz}';`;
  try {
    const result = await db.query(sql);
    return result.rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
