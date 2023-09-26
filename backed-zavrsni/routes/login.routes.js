const express = require('express');
const router = express.Router();
const db = require('../db');
const camelcaseKeys = require('camelcase-keys');
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const Student = require("../models/StudentModel");


//base/login
router.post('/', async function (req, res, next) {
    let studentId = req.body.studentId;
    let pictureKey = req.body.pictureKey;


    let student;
    let token;
    await (async () => {
        try {
            student = await Student.fetchByStudentId(studentId);

            if (!(student.checkPassword(pictureKey))) {
                return res.status(401).send({error: "Unauthorized"});
            }

            token = jwt.sign({studentId: student.studentId, classId:student.classId}, config.secret, {
                expiresIn: 86400 // 24 hours
            });

            res.send(camelcaseKeys({
                studentId: student.studentId,
                name: student.name,
                surname: student.surname,
                classId: student.classId,
                token: token
            }));

        } catch {
            return res.status(401).send({error: "Unauthorized"});
        }
    })();

});


module.exports = router;
