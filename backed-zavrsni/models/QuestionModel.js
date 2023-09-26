const db = require("../db");

module.exports = class Question {
  constructor(question, correct, suggested) {
    this.questionId = undefined;
    this.question = question;
    this.correct = correct;
    this.suggested = suggested;
  }

  //pohrana korisnika u bazu podataka
  static async makeNewQuestion(
    question,
    correct,
    suggested,
    lectureId,
    questionId
  ) {
    try {
      await dbNewQuestion(question, correct, suggested, lectureId, questionId);
    } catch (err) {
      console.log(err);
      console.log("ERROR persisting user data: " + JSON.stringify(this));
      throw err;
    }
  }

  //pohrana korisnika u bazu podataka
  static async editQuestion(question, correct, suggested, questionId) {
    try {
      await dbEditQuestion(question, correct, suggested, questionId);
    } catch (err) {
      console.log("ERROR persisting user data: " + JSON.stringify(this));
      throw err;
    }
  }
  static async getMaxQuestionId() {
    try {
      const questionId = await dbGetMaxQuestionId();
      return questionId;
    } catch (err) {
      console.log("backend error " + JSON.stringify(this));
      throw err;
    }
  }
  static async removeQuestion(questionId) {
    try {
      await dbRemoveQuestion(questionId);
    } catch (err) {
      console.log("ERROR persisting user data: " + JSON.stringify(this));
      throw err;
    }
  }
};

//umetanje zapisa o korisniku u bazu podataka
dbNewQuestion = async (question, correct, suggested, lectureId, questionId) => {
  const sql = `
  INSERT INTO question (question_id,lecture_id,question, suggested, correct,isdeleted)
                 select ${
                   questionId + 1
                 },${lectureId},'${question}',parts, '${correct}',0
                 from string_to_array('${suggested}', ',') AS parts
                 `;
  try {
    const result = await db.query(sql, []);
    return result.rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  }
};

//brisanje zapisa o korisniku u bazi podataka
dbRemoveQuestion = async (questionId) => {
  const sql = `UPDATE question
                SET isDeleted = 1
                 where question_id = ${questionId};`;
  try {
    await db.query(sql, []);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

//umetanje zapisa o korisniku u bazu podataka
//from(select from string_to_array('${question.suggested}', ',')) as parts
dbEditQuestion = async (question, correct, suggested, questionId) => {
  const sql = ` UPDATE question
                 SET question='${question}',
                     correct='${correct}',
                     suggested=parts.array
                     from(select string_to_array('${suggested}', ',') as array) as parts
                     WHERE question_id = ${questionId};`;
  try {
    await db.query(sql, []);
  } catch (err) {
    console.log(err);
    throw err;
  }
};
dbGetMaxQuestionId = async () => {
  const sql = `SELECT question_id
                 FROM question
                 WHERE question_id=(select max(question_id) from question);`;
  try {
    const result = await db.query(sql);
    return result.rows[0].question_id;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
