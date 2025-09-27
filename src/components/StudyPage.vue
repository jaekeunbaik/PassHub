<template>
  <div class="study-page">
    <div class="container">
      <div v-if="isLoading" class="loading-indicator">
        <h2>데이터를 불러오는 중...</h2>
      </div>
      <!-- Study Header -->
      <div v-else class="study-header">
        <div class="study-info">
          <h1>{{ (exam && exam.name) || "자격증 학습" }}</h1>
          <p>
            {{
              (exam && exam.description) ||
              "체계적인 학습으로 목표를 달성하세요"
            }}
          </p>
        </div>
        <div class="study-progress">
          <div class="progress-info">
            <span>{{ currentQuestionIndex + 1 }} / {{ totalQuestions }}</span>
            <span>{{ safeProgressPercent }}%</span>
          </div>
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: safeProgressPercent + '%' }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Study Mode Selection -->
      <div class="study-modes" v-if="!isQuizStarted">
        <h2>학습 모드를 선택하세요</h2>
        <div class="mode-cards">
          <div class="mode-card" @click="startQuiz('practice')">
            <div class="mode-icon">📚</div>
            <h3>연습 모드</h3>
            <p>시간 제한 없이 천천히 학습하세요</p>
            <ul>
              <li>즉시 정답 확인</li>
              <li>해설 제공</li>
              <li>오답 노트 자동 저장</li>
            </ul>
          </div>
          <div class="mode-card" @click="startQuiz('exam')">
            <div class="mode-icon">⏰</div>
            <h3>시험 모드</h3>
            <p>실제 시험과 같은 환경에서 연습하세요</p>
            <ul>
              <li>시간 제한</li>
              <li>시험 후 결과 확인</li>
              <li>성적 분석</li>
            </ul>
          </div>
          <div class="mode-card" @click="startQuiz('review')">
            <div class="mode-icon">🔄</div>
            <h3>복습 모드</h3>
            <p>틀린 문제만 다시 풀어보세요</p>
            <ul>
              <li>오답 문제만 출제</li>
              <li>집중 복습</li>
              <li>약점 보완</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Quiz Interface -->
      <div class="quiz-interface" v-if="isQuizStarted && currentQuestion">
        <div class="question-card">
          <div class="question-header">
            <div class="question-number">
              문제 {{ currentQuestionIndex + 1 }}
            </div>
            <div class="question-timer" v-if="studyMode === 'exam'">
              ⏰ {{ formatTime(timeLeft) }}
            </div>
          </div>

          <div class="question-content">
            <h3>{{ currentQuestion.question }}</h3>
            <div class="question-image" v-if="currentQuestion.image">
              <img
                :src="currentQuestion.image"
                :alt="currentQuestion.question"
              />
            </div>
          </div>

          <div class="answer-options">
            <div
              v-for="(option, index) in currentQuestion.options"
              :key="index"
              :class="[
                'option',
                {
                  selected: selectedAnswer === index,
                  correct: showAnswer && index === correctAnswerIndex,
                  incorrect:
                    showAnswer &&
                    selectedAnswer === index &&
                    index !== correctAnswerIndex,
                },
              ]"
              @click="selectAnswer(index)"
            >
              <span class="option-letter">{{
                String.fromCharCode(65 + index)
              }}</span>
              <span class="option-text">{{ option }}</span>
            </div>
          </div>

          <div class="question-actions">
            <button
              class="btn btn-primary"
              @click="submitAnswer"
              :disabled="selectedAnswer === null"
            >
              답안 제출
            </button>
            <button class="btn btn-secondary" @click="skipQuestion">
              건너뛰기
            </button>
          </div>

          <!-- Answer Explanation -->
          <div class="explanation" v-if="showAnswer">
            <h4>정답: {{ String.fromCharCode(65 + correctAnswerIndex) }}</h4>
            <p>{{ currentQuestion.explanation }}</p>
            <button class="btn btn-success" @click="nextQuestion">
              {{ isLastQuestion ? "결과 보기" : "다음 문제" }}
            </button>
          </div>
        </div>
      </div>

      <!-- Quiz Results -->
      <div class="quiz-results" v-if="showResults">
        <div class="results-card">
          <h2>{{ studyMode === "exam" ? "시험 완료!" : "학습 완료!" }}</h2>

          <!-- 시험 모드에서만 합격/불합격 표시 -->
          <div v-if="studyMode === 'exam'" class="exam-result">
            <div :class="['result-badge', { pass: isPassed, fail: !isPassed }]">
              {{ isPassed ? "합격" : "불합격" }}
            </div>
            <p class="result-message">
              {{
                isPassed
                  ? "축하합니다! 시험에 합격하셨습니다."
                  : "아쉽게도 불합격입니다. 다시 도전해보세요!"
              }}
            </p>
          </div>

          <div class="score-display">
            <div class="score-circle">
              <span class="score-number">{{
                Math.round((correctAnswers / totalQuestions) * 100)
              }}</span>
              <span class="score-label">점</span>
            </div>
          </div>

          <div class="results-stats">
            <div class="stat-item">
              <span class="stat-label">정답</span>
              <span class="stat-value correct">{{ correctAnswers }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">오답</span>
              <span class="stat-value incorrect">{{ incorrectAnswers }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">건너뛴 문제</span>
              <span class="stat-value">{{ skippedAnswers }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">정답률</span>
              <span class="stat-value"
                >{{
                  Math.round((correctAnswers / totalQuestions) * 100)
                }}%</span
              >
            </div>
          </div>

          <div class="results-actions">
            <button class="btn btn-primary" @click="restartQuiz">
              다시 풀기
            </button>
            <button class="btn btn-secondary" @click="goToHome">홈으로</button>
            <button
              class="btn btn-success"
              @click="reviewWrongAnswers"
              v-if="incorrectAnswers > 0"
            >
              오답 복습
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from "../lib/supabase";

export default {
  name: "StudyPage",
  props: {
    examId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      exam: null,
      isLoading: true,
      isQuizStarted: false,
      studyMode: "practice", // practice, exam, review
      currentQuestionIndex: 0,
      selectedAnswer: null,
      showAnswer: false,
      showResults: false,
      timeLeft: 0,
      timer: null,
      correctAnswers: 0,
      incorrectAnswers: 0,
      skippedAnswers: 0,
      questions: [],
      userAnswers: [],
    };
  },
  created() {
    this.fetchExamData();
  },
  computed: {
    totalQuestions() {
      return this.questions.length;
    },
    currentQuestion() {
      return this.questions[this.currentQuestionIndex];
    },
    isLastQuestion() {
      return this.currentQuestionIndex === this.totalQuestions - 1;
    },
    safeProgressPercent() {
      const total = this.totalQuestions;
      if (!total) return 0;
      return Math.round(((this.currentQuestionIndex + 1) / total) * 100);
    },
    correctAnswerIndex() {
      if (!this.currentQuestion) return -1;
      return this.currentQuestion.options.indexOf(this.currentQuestion.answer);
    },
    isPassed() {
      if (!this.exam) return false;
      const score = (this.correctAnswers / this.totalQuestions) * 100;
      return score >= this.exam.details.passScore;
    },
  },
  methods: {
    async fetchExamData() {
      this.isLoading = true;
      try {
        // 1) 시험 메타데이터 조회
        // 단일: id로 조회
        const { data: examRows, error: examErr } = await supabase
          .from("exams")
          .select("*")
          .eq("id", this.examId)
          .limit(1);
        if (examErr) throw examErr;
        const rawExam = examRows && examRows.length > 0 ? examRows[0] : null;

        this.exam = rawExam
          ? (() => {
              const baseDetails =
                rawExam.details ?? rawExam.details_json ?? rawExam.meta ?? null;
              const synthesized = {
                totalQuestions: rawExam.total_questions ?? undefined,
                passScore: rawExam.pass_score ?? undefined,
                subjectPassScore: rawExam.subject_pass_score ?? undefined,
              };
              return {
                id:
                  rawExam.id ?? rawExam.exam_id ?? rawExam.code ?? rawExam.slug,
                name: rawExam.name ?? rawExam.exam_name ?? rawExam.title ?? "",
                type: rawExam.type ?? rawExam.exam_type ?? undefined,
                details: baseDetails ? baseDetails : synthesized,
              };
            })()
          : null;

        // 2) 과목 리스트 추출 (exams.details가 비어있으면 subjects 테이블에서 조회)
        let subjects =
          this.exam?.details?.subjects || this.exam?.details?.Subjects || [];
        if (!subjects || subjects.length === 0) {
          const { data: subjectRows, error: subjErr } = await supabase
            .from("subjects")
            .select("*")
            .eq("exam_id", this.examId);
          if (subjErr) {
            // eslint-disable-next-line no-console
            console.warn("과목 조회 중 경고:", subjErr);
          }
          subjects = (subjectRows || []).map((r) => ({
            id: r.id,
            name: r.name ?? r.title ?? "",
            questionCount: r.questionCount ?? r.question_count ?? 0,
          }));
        }
        const subjectIds = subjects.map((s) => s.id);

        // 3) 질문 조회 (subjectId IN (...))
        let allQuestions = [];
        if (subjectIds.length > 0) {
          // 우선 subjectId 컬럼으로 조회
          let { data: questionRows, error: qErr } = await supabase
            .from("questions")
            .select("*")
            .in("subjectId", subjectIds);
          // 컬럼이 없다면 subject_id로 재시도
          if (qErr || !questionRows) {
            const { data: questionRows2, error: qErr2 } = await supabase
              .from("questions")
              .select("*")
              .in("subject_id", subjectIds);
            if (qErr2) throw qErr2;
            questionRows = questionRows2;
          }

          // 과목별 제한 수만큼 슬라이스
          const questionsBySubject = {};
          for (const subj of subjects) {
            const perSubject = (questionRows || []).filter(
              (q) => (q.subjectId ?? q.subject_id) === subj.id
            );
            // 간단 셔플
            const shuffled = [...perSubject].sort(() => 0.5 - Math.random());
            const declaredLimit = subj.questionCount ?? subj.question_count;
            // 정보처리기사(C001): 과목당 5문제(10개 예제 중 랜덤 5개 가정)
            const enforcedLimit = this.exam?.id === "C001" ? 5 : undefined;
            const limit =
              typeof enforcedLimit === "number"
                ? enforcedLimit
                : typeof declaredLimit === "number" && declaredLimit > 0
                ? declaredLimit
                : undefined;
            questionsBySubject[subj.id] =
              typeof limit === "number"
                ? shuffled.slice(0, Math.min(limit, shuffled.length))
                : shuffled; // 개수 정보가 없으면 전부 사용
          }
          for (const sid of Object.keys(questionsBySubject)) {
            allQuestions = [
              ...allQuestions,
              ...questionsBySubject[sid].map((q) => ({
                id: q.id,
                subjectId: q.subjectId ?? q.subject_id,
                question: q.question ?? q.title ?? "",
                options: q.options ?? q.choices ?? [],
                answer: q.answer ?? q.correct ?? "",
                explanation: q.explanation ?? q.explain ?? "",
                image: q.image ?? null,
              })),
            ];
          }
        }
        this.questions = allQuestions;

        // 4) Supabase에서 비어오면 로컬 서버로 폴백 시도
        if (!this.questions || this.questions.length === 0) {
          try {
            // 시험 메타 폴백
            if (!this.exam) {
              const examsRes = await fetch(
                "passhub-backend-production.up.railway.app/exams"
              );
              if (examsRes.ok) {
                const examsJson = await examsRes.json();
                const found = (examsJson || []).find(
                  (e) => e.id === this.examId
                );
                if (found) this.exam = found;
              }
            }
            // 질문 폴백
            const qRes = await fetch(
              `passhub-backend-production.up.railway.app/exams/${this.examId}/questions`
            );
            if (qRes.ok) {
              const questionsBySubject = await qRes.json();
              let merged = [];
              for (const sid in questionsBySubject) {
                merged = [...merged, ...questionsBySubject[sid]];
              }
              if (merged.length > 0) this.questions = merged;
            }
          } catch (_) {
            /* ignore */
          }
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("시험 데이터를 불러오는 중 오류가 발생했습니다:", error);
      } finally {
        this.isLoading = false;
      }
    },
    startQuiz(mode) {
      this.studyMode = mode;
      this.isQuizStarted = true;
      this.currentQuestionIndex = 0;
      this.selectedAnswer = null;
      this.showAnswer = false;
      this.showResults = false;
      this.correctAnswers = 0;
      this.incorrectAnswers = 0;
      this.skippedAnswers = 0;
      this.userAnswers = [];

      if (mode === "exam") {
        this.timeLeft = 60 * 30; // 30분 제한
        this.startTimer();
      }
    },
    selectAnswer(option) {
      if (!this.showAnswer) {
        this.selectedAnswer = option;
      }
    },
    submitAnswer() {
      if (this.selectedAnswer === null) return;

      const isCorrect = this.selectedAnswer === this.correctAnswerIndex;
      if (isCorrect) {
        this.correctAnswers++;
      } else {
        this.incorrectAnswers++;
      }
      this.userAnswers.push({
        questionId: this.currentQuestion.id,
        selected: this.selectedAnswer,
        isCorrect: isCorrect,
      });

      if (this.studyMode === "exam") {
        this.nextQuestion();
      } else {
        this.showAnswer = true;
      }
    },
    skipQuestion() {
      this.skippedAnswers++;
      this.nextQuestion();
    },
    nextQuestion() {
      if (this.isLastQuestion) {
        this.showResults = true;
        this.stopTimer();
      } else {
        this.currentQuestionIndex++;
        this.selectedAnswer = null;
        this.showAnswer = false;
        if (this.studyMode === "exam") {
          this.timeLeft = 60;
          this.startTimer();
        }
      }
    },
    startTimer() {
      if (this.timer) return;
      this.timer = setInterval(() => {
        this.timeLeft--;
        if (this.timeLeft <= 0) {
          this.submitAnswer();
        }
      }, 1000);
    },
    stopTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    },
    restartQuiz() {
      this.isQuizStarted = false;
      this.showResults = false;
    },
    goToHome() {
      this.$router.push({ name: "home" });
    },
    reviewWrongAnswers() {
      this.startQuiz("review");
    },
  },
  beforeUnmount() {
    this.stopTimer();
  },
};
</script>

<style scoped>
.loading-indicator {
  text-align: center;
  padding: 50px;
  font-size: 1.5rem;
  color: #666;
}

.study-page {
  padding: 40px 0;
}

.study-header {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.study-info h1 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.study-info p {
  color: #666;
  margin: 0;
}

.study-progress {
  min-width: 200px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
  color: #666;
}

.study-modes {
  text-align: center;
  margin-bottom: 40px;
}

.study-modes h2 {
  margin-bottom: 30px;
  color: #2c3e50;
}

.mode-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.mode-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease;
}

.mode-card:hover {
  transform: translateY(-5px);
}

.mode-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.mode-card h3 {
  margin-bottom: 15px;
  color: #2c3e50;
}

.mode-card p {
  color: #666;
  margin-bottom: 20px;
}

.mode-card ul {
  list-style: none;
  text-align: left;
}

.mode-card li {
  padding: 5px 0;
  color: #666;
}

.mode-card li:before {
  content: "✓ ";
  color: #28a745;
  font-weight: bold;
}

.quiz-interface {
  max-width: 800px;
  margin: 0 auto;
}

.question-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.question-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.question-number {
  font-size: 1.2rem;
  font-weight: bold;
}

.question-timer {
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
}

.question-content {
  padding: 30px;
}

.question-content h3 {
  margin-bottom: 20px;
  color: #2c3e50;
  line-height: 1.6;
}

.question-image {
  margin: 20px 0;
  text-align: center;
}

.question-image img {
  max-width: 100%;
  border-radius: 8px;
}

.answer-options {
  padding: 0 30px 30px;
}

.option {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  margin-bottom: 10px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.option:hover {
  border-color: #007bff;
  background-color: #f8f9fa;
}

.option.selected {
  border-color: #007bff;
  background-color: #e3f2fd;
}

.option.correct {
  border-color: #28a745;
  background-color: #d4edda;
}

.option.incorrect {
  border-color: #dc3545;
  background-color: #f8d7da;
}

.option-letter {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background-color: #6c757d;
  color: white;
  border-radius: 50%;
  margin-right: 15px;
  font-weight: bold;
}

.option.selected .option-letter {
  background-color: #007bff;
}

.option.correct .option-letter {
  background-color: #28a745;
}

.option.incorrect .option-letter {
  background-color: #dc3545;
}

.option-text {
  flex: 1;
}

.question-actions {
  padding: 0 30px 30px;
  display: flex;
  gap: 15px;
}

.explanation {
  background-color: #f8f9fa;
  padding: 30px;
  border-top: 1px solid #e9ecef;
}

.explanation h4 {
  color: #28a745;
  margin-bottom: 15px;
}

.explanation p {
  color: #666;
  margin-bottom: 20px;
  line-height: 1.6;
}

.quiz-results {
  max-width: 600px;
  margin: 0 auto;
}

.results-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.results-card h2 {
  color: #2c3e50;
  margin-bottom: 30px;
}

.exam-result {
  margin-bottom: 30px;
}

.result-badge {
  display: inline-block;
  padding: 10px 20px;
  border-radius: 25px;
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 15px;
}

.result-badge.pass {
  background-color: #d4edda;
  color: #155724;
  border: 2px solid #28a745;
}

.result-badge.fail {
  background-color: #f8d7da;
  color: #721c24;
  border: 2px solid #dc3545;
}

.result-message {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
}

.score-display {
  margin-bottom: 30px;
}

.score-circle {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin: 0 auto;
}

.score-number {
  font-size: 2.5rem;
  font-weight: bold;
}

.score-label {
  font-size: 1rem;
}

.results-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.stat-item {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
}

.stat-value.correct {
  color: #28a745;
}

.stat-value.incorrect {
  color: #dc3545;
}

.results-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .study-header {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .mode-cards {
    grid-template-columns: 1fr;
  }

  .question-header {
    flex-direction: column;
    gap: 10px;
  }

  .question-actions {
    flex-direction: column;
  }

  .results-stats {
    flex-direction: column;
    gap: 15px;
  }

  .results-actions {
    flex-direction: column;
  }
}
</style>
