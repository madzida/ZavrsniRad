const db = require("../db");

//razred Class prestavlja razred
module.exports = class TestEntry {
  //konstruktor korisnika
  constructor(answer, enemyKilled, timeTaken, question, studentId, testId) {
    this.zapisId = undefined;
    this.answer = answer;
    this.enemyKilled = enemyKilled;
    this.timeTaken = timeTaken;
    this.studentId = studentId;
    this.testId = testId;
    this.question = question;
  }

  //pohrana razreda u bazu podataka
  async saveTestEntry() {
    try {
      this.testId = await dbSaveTestEntry(this);
      return this.zapisId;
    } catch (err) {
      console.log("ERROR persisting user data: " + JSON.stringify(this));
      throw err;
    }
  }

  static async getTestEntriesForGivenTestStudent(testId, studentId) {
    try {
      return await dbGetTestEntryForGivenTestStudent(testId, studentId);
    } catch (err) {
      console.log("backend error " + JSON.stringify(this));
      throw err;
    }
  }
};

//izrada novog testa
dbSaveTestEntry = async (entry) => {
  const sql = `INSERT INTO test_student_entry (answer, enemy_killed_status, time_taken,student_id,test_id,question)
                 VALUES ('${entry.answer}','${entry.enemyKilled}','${entry.timeTaken}', '${entry.studentId}', '${entry.testId}','${entry.question}')
                 RETURNING entry_id`;
  try {
    const result = await db.query(sql, []);
    return result.rows[0].entry_id;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

//database query for getting all calculations for given test
dbGetTestEntryForGivenTestStudent = async (testId, studentId) => {
  const sql = `SELECT time_taken, answer, enemy_killed_status
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
