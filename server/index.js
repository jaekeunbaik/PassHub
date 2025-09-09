const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

const dbPath = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('서버가 실행 중입니다.');
});

app.get('/exams', (req, res) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('데이터를 읽는 중 오류가 발생했습니다.');
      return;
    }
    const jsonData = JSON.parse(data);
    res.json(jsonData.exams);
  });
});

app.get('/exams/:examId/questions', (req, res) => {
  const { examId } = req.params;
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('데이터를 읽는 중 오류가 발생했습니다.');
      return;
    }
    const jsonData = JSON.parse(data);
    const exam = jsonData.exams.find((e) => e.id === examId);
    if (!exam) {
      res.status(404).send('시험을 찾을 수 없습니다.');
      return;
    }

    const allQuestions = jsonData.questions;
    const questionsBySubject = {};

    exam.details.subjects.forEach((subject) => {
      const subjectQuestions = allQuestions.filter((q) => q.subjectId === subject.id);
      const shuffledQuestions = subjectQuestions.sort(() => 0.5 - Math.random());
      questionsBySubject[subject.id] = shuffledQuestions.slice(0, subject.questionCount);
    });

    res.json(questionsBySubject);
  });
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
