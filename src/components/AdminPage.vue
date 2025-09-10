<template>
    <div class="admin-page">
        <div class="container">
            <h1>관리자: 데이터 추가</h1>

            <div class="card">
                <h2>시험 추가 (POST /exams)</h2>
                <form @submit.prevent="createExam">
                    <div class="form-row">
                        <label>시험 ID</label>
                        <input v-model="examForm.id" placeholder="예: C004" required />
                    </div>
                    <div class="form-row">
                        <label>시험명</label>
                        <input v-model="examForm.name" placeholder="예: 새 시험" required />
                    </div>
                    <div class="form-row">
                        <label>유형</label>
                        <input v-model="examForm.type" placeholder="예: 필기" />
                    </div>
                    <div class="form-row">
                        <label>총 문항 수</label>
                        <input type="number" v-model.number="examForm.totalQuestions" min="1" />
                    </div>
                    <div class="form-row">
                        <label>합격 점수</label>
                        <input type="number" v-model.number="examForm.passScore" min="0" max="100" />
                    </div>
                    <div class="form-row">
                        <label>과목 목록(JSON)</label>
                        <textarea v-model="examForm.subjectsJson" rows="5" placeholder='[
  { "id": "S21", "name": "과목A", "questionCount": 5 },
  { "id": "S22", "name": "과목B", "questionCount": 5 }
]'></textarea>
                    </div>
                    <button class="btn btn-primary" type="submit">시험 추가</button>
                </form>
                <p v-if="examMessage" class="message">{{ examMessage }}</p>
            </div>

            <div class="card">
                <h2>문제 추가 (POST /questions)</h2>
                <form @submit.prevent="createQuestion">
                    <div class="form-row">
                        <label>문제 ID</label>
                        <input v-model="questionForm.id" placeholder="예: Q9001" required />
                    </div>
                    <div class="form-row">
                        <label>과목 ID</label>
                        <input v-model="questionForm.subjectId" placeholder="예: S21" required />
                    </div>
                    <div class="form-row">
                        <label>문제 내용</label>
                        <textarea v-model="questionForm.question" rows="3" required placeholder="문제 내용을 입력"></textarea>
                    </div>
                    <div class="form-row">
                        <label>보기(콤마 구분)</label>
                        <input v-model="questionForm.optionsCsv" placeholder="A,B,C,D" required />
                    </div>
                    <div class="form-row">
                        <label>정답(보기 텍스트)</label>
                        <input v-model="questionForm.answer" placeholder="예: A" required />
                    </div>
                    <div class="form-row">
                        <label>해설(선택)</label>
                        <textarea v-model="questionForm.explanation" rows="3" placeholder="정답에 대한 해설을 입력"></textarea>
                    </div>
                    <button class="btn btn-primary" type="submit">문제 추가</button>
                </form>
                <p v-if="questionMessage" class="message">{{ questionMessage }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'AdminPage',
    data() {
        return {
            examForm: {
                id: '',
                name: '',
                type: '필기',
                totalQuestions: 0,
                passScore: 60,
                subjectsJson: ''
            },
            examMessage: '',
            questionForm: {
                id: '',
                subjectId: '',
                question: '',
                optionsCsv: '',
                answer: '',
                explanation: ''
            },
            questionMessage: ''
        };
    },
    methods: {
        async createExam() {
            this.examMessage = '';
            try {
                let subjects = [];
                if (this.examForm.subjectsJson && this.examForm.subjectsJson.trim().length > 0) {
                    subjects = JSON.parse(this.examForm.subjectsJson);
                }
                const body = {
                    id: this.examForm.id,
                    name: this.examForm.name,
                    type: this.examForm.type,
                    details: {
                        totalQuestions: this.examForm.totalQuestions,
                        subjects,
                        passScore: this.examForm.passScore
                    }
                };
                const res = await axios.post('http://localhost:3000/exams', body);
                this.examMessage = `추가 완료: ${res.data.id}`;
            } catch (err) {
                this.examMessage = `오류: ${err.response?.data?.message || err.message}`;
            }
        },
        async createQuestion() {
            this.questionMessage = '';
            try {
                const options = this.questionForm.optionsCsv
                    .split(',')
                    .map(s => s.trim())
                    .filter(Boolean);
                const body = {
                    id: this.questionForm.id,
                    subjectId: this.questionForm.subjectId,
                    question: this.questionForm.question,
                    options,
                    answer: this.questionForm.answer,
                    explanation: this.questionForm.explanation || undefined
                };
                const res = await axios.post('http://localhost:3000/questions', body);
                this.questionMessage = `추가 완료: ${res.data.id}`;
            } catch (err) {
                this.questionMessage = `오류: ${err.response?.data?.message || err.message}`;
            }
        }
    }
}
</script>

<style scoped>
.admin-page {
    padding: 40px 0;
}

.container {
    max-width: 900px;
    margin: 0 auto;
}

h1 {
    margin-bottom: 24px;
}

.card {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    padding: 24px;
    margin-bottom: 24px;
}

.form-row {
    margin-bottom: 12px;
    display: flex;
    flex-direction: column;
}

label {
    font-weight: 600;
    margin-bottom: 6px;
}

input,
textarea {
    padding: 10px;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
}

.btn {
    padding: 10px 16px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
}

.btn-primary {
    background-color: #28a745;
    color: #fff;
}

.message {
    margin-top: 10px;
    color: #333;
}
</style>
