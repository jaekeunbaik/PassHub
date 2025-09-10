const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

const dbPath = path.join(__dirname, "db.json");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("서버가 실행 중입니다.");
});

app.get("/exams", (req, res) => {
  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("데이터를 읽는 중 오류가 발생했습니다.");
      return;
    }
    const jsonData = JSON.parse(data);
    res.json(jsonData.exams);
  });
});

// Exam 생성
app.post("/exams", (req, res) => {
  const newExam = req.body;
  if (!newExam || !newExam.id || !newExam.name || !newExam.details) {
    return res
      .status(400)
      .json({ message: "id, name, details 필드는 필수입니다." });
  }

  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "데이터를 읽는 중 오류가 발생했습니다." });
    }
    const jsonData = JSON.parse(data);
    const exists = jsonData.exams.find((e) => e.id === newExam.id);
    if (exists) {
      return res
        .status(409)
        .json({ message: "동일한 id의 시험이 이미 존재합니다." });
    }
    jsonData.exams.push(newExam);
    fs.writeFile(dbPath, JSON.stringify(jsonData, null, 2), "utf8", (werr) => {
      if (werr) {
        return res
          .status(500)
          .json({ message: "데이터를 저장하는 중 오류가 발생했습니다." });
      }
      return res.status(201).json(newExam);
    });
  });
});

app.get("/exams/:examId/questions", (req, res) => {
  const { examId } = req.params;
  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("데이터를 읽는 중 오류가 발생했습니다.");
      return;
    }
    const jsonData = JSON.parse(data);
    const exam = jsonData.exams.find((e) => e.id === examId);
    if (!exam) {
      res.status(404).send("시험을 찾을 수 없습니다.");
      return;
    }

    const allQuestions = jsonData.questions;
    const questionsBySubject = {};

    exam.details.subjects.forEach((subject) => {
      const subjectQuestions = allQuestions.filter(
        (q) => q.subjectId === subject.id
      );
      const shuffledQuestions = subjectQuestions.sort(
        () => 0.5 - Math.random()
      );
      questionsBySubject[subject.id] = shuffledQuestions.slice(
        0,
        subject.questionCount
      );
    });

    res.json(questionsBySubject);
  });
});

// Question 생성
app.post("/questions", (req, res) => {
  const newQuestion = req.body;
  if (
    !newQuestion ||
    !newQuestion.id ||
    !newQuestion.subjectId ||
    !newQuestion.question ||
    !newQuestion.options ||
    !newQuestion.answer
  ) {
    return res.status(400).json({
      message: "id, subjectId, question, options, answer 필드는 필수입니다.",
    });
  }

  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "데이터를 읽는 중 오류가 발생했습니다." });
    }
    const jsonData = JSON.parse(data);
    const exists = jsonData.questions.find((q) => q.id === newQuestion.id);
    if (exists) {
      return res
        .status(409)
        .json({ message: "동일한 id의 문제가 이미 존재합니다." });
    }
    jsonData.questions.push(newQuestion);
    fs.writeFile(dbPath, JSON.stringify(jsonData, null, 2), "utf8", (werr) => {
      if (werr) {
        return res
          .status(500)
          .json({ message: "데이터를 저장하는 중 오류가 발생했습니다." });
      }
      return res.status(201).json(newQuestion);
    });
  });
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
