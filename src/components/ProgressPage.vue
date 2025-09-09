<template>
  <div class="progress-page">
    <div class="container">
      <h1 class="text-center mb-4">학습 진도 관리</h1>

      <!-- Overall Progress Summary -->
      <div class="progress-summary">
        <div class="summary-card">
          <div class="summary-icon">📊</div>
          <div class="summary-content">
            <h3>전체 학습 현황</h3>
            <div class="summary-stats">
              <div class="stat">
                <span class="stat-number">{{ totalQuestionsSolved }}</span>
                <span class="stat-label">총 풀이 문제</span>
              </div>
              <div class="stat">
                <span class="stat-number">{{ totalCorrectAnswers }}</span>
                <span class="stat-label">정답 수</span>
              </div>
              <div class="stat">
                <span class="stat-number">{{ Math.round(overallAccuracy) }}%</span>
                <span class="stat-label">정답률</span>
              </div>
              <div class="stat">
                <span class="stat-number">{{ totalStudyTime }}</span>
                <span class="stat-label">총 학습 시간</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Certificate Progress -->
      <div class="certificate-progress">
        <h2>자격증별 진도</h2>
        <div class="progress-cards">
          <div v-for="progress in certificateProgress" :key="progress.certId" class="progress-card">
            <div class="card-header">
              <div class="cert-info">
                <div class="cert-icon">{{ progress.icon }}</div>
                <div class="cert-details">
                  <h3>{{ progress.certName }}</h3>
                  <p>{{ progress.category }}</p>
                </div>
              </div>
              <div class="progress-percentage">
                {{ progress.percentage }}%
              </div>
            </div>

            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: progress.percentage + '%' }"></div>
            </div>

            <div class="progress-details">
              <div class="detail-row">
                <span>완료된 문제</span>
                <span>{{ progress.completed }}/{{ progress.total }}</span>
              </div>
              <div class="detail-row">
                <span>정답률</span>
                <span>{{ progress.accuracy }}%</span>
              </div>
              <div class="detail-row">
                <span>학습 시간</span>
                <span>{{ progress.studyTime }}</span>
              </div>
              <div class="detail-row">
                <span>마지막 학습</span>
                <span>{{ progress.lastStudy }}</span>
              </div>
            </div>

            <div class="card-actions">
              <button class="btn btn-primary" @click="continueStudy(progress)">
                학습 계속하기
              </button>
              <button class="btn btn-secondary" @click="viewDetails(progress)">
                상세 보기
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Study Statistics -->
      <div class="study-statistics">
        <h2>학습 통계</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">📈</div>
            <h3>주간 학습 현황</h3>
            <div class="weekly-chart">
              <div v-for="(day, index) in weeklyData" :key="index" class="chart-bar"
                :style="{ height: (day.studyTime / maxWeeklyTime) * 100 + '%' }"
                :title="`${day.day}: ${day.studyTime}분`"></div>
            </div>
            <div class="chart-labels">
              <span v-for="day in weeklyData" :key="day.day">{{ day.day }}</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">🎯</div>
            <h3>목표 달성률</h3>
            <div class="goal-progress">
              <div class="goal-item">
                <span>일일 목표 (30문제)</span>
                <div class="goal-bar">
                  <div class="goal-fill" :style="{ width: (dailyGoalProgress / 30) * 100 + '%' }"></div>
                </div>
                <span>{{ dailyGoalProgress }}/30</span>
              </div>
              <div class="goal-item">
                <span>주간 목표 (200문제)</span>
                <div class="goal-bar">
                  <div class="goal-fill" :style="{ width: (weeklyGoalProgress / 200) * 100 + '%' }"></div>
                </div>
                <span>{{ weeklyGoalProgress }}/200</span>
              </div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">🏆</div>
            <h3>성취 배지</h3>
            <div class="badges">
              <div v-for="badge in badges" :key="badge.id" :class="['badge', { earned: badge.earned }]"
                :title="badge.description">
                <div class="badge-icon">{{ badge.icon }}</div>
                <span class="badge-name">{{ badge.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Weak Areas -->
      <div class="weak-areas" v-if="weakAreas.length > 0">
        <h2>약점 분석</h2>
        <div class="weakness-cards">
          <div v-for="area in weakAreas" :key="area.id" class="weakness-card">
            <div class="weakness-header">
              <h3>{{ area.topic }}</h3>
              <span class="accuracy">{{ area.accuracy }}%</span>
            </div>
            <p>{{ area.description }}</p>
            <div class="weakness-actions">
              <button class="btn btn-primary" @click="practiceWeakness(area)">
                집중 연습
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Study Calendar -->
      <div class="study-calendar">
        <h2>학습 캘린더</h2>
        <div class="calendar-container">
          <div class="calendar-header">
            <button class="btn btn-secondary" @click="previousMonth">‹</button>
            <h3>{{ currentMonth }}</h3>
            <button class="btn btn-secondary" @click="nextMonth">›</button>
          </div>
          <div class="calendar-grid">
            <div class="calendar-day" v-for="day in calendarDays" :key="day.date" :class="{
              'has-study': day.hasStudy,
              'today': day.isToday,
              'other-month': !day.isCurrentMonth
            }" @click="viewDayDetails(day)">
              <span class="day-number">{{ day.day }}</span>
              <div class="study-indicator" v-if="day.hasStudy">
                <div class="study-dot" :style="{ backgroundColor: day.studyColor }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProgressPage',
  data() {
    return {
      totalQuestionsSolved: 245,
      totalCorrectAnswers: 198,
      overallAccuracy: 80.8,
      totalStudyTime: '12시간 30분',
      certificateProgress: [
        { certId: 1, certName: '정보처리기사', category: 'IT/컴퓨터', icon: '💻', completed: 45, total: 100, percentage: 45, accuracy: 78, studyTime: '5시간 20분', lastStudy: '2일 전' },
        { certId: 2, certName: '토익', category: '어학', icon: '🌍', completed: 78, total: 120, percentage: 65, accuracy: 85, studyTime: '4시간 15분', lastStudy: '1일 전' },
        { certId: 3, certName: '한국사능력검정시험', category: '교육', icon: '🏛️', completed: 25, total: 50, percentage: 50, accuracy: 72, studyTime: '2시간 55분', lastStudy: '3일 전' }
      ],
      weeklyData: [
        { day: '월', studyTime: 45 },
        { day: '화', studyTime: 60 },
        { day: '수', studyTime: 30 },
        { day: '목', studyTime: 75 },
        { day: '금', studyTime: 40 },
        { day: '토', studyTime: 90 },
        { day: '일', studyTime: 35 }
      ],
      dailyGoalProgress: 18,
      weeklyGoalProgress: 145,
      badges: [
        { id: 1, name: '첫 문제', icon: '🎯', earned: true, description: '첫 번째 문제를 풀었습니다' },
        { id: 2, name: '10문제 달성', icon: '🔥', earned: true, description: '10문제를 풀었습니다' },
        { id: 3, name: '50문제 달성', icon: '💪', earned: true, description: '50문제를 풀었습니다' },
        { id: 4, name: '100문제 달성', icon: '🏆', earned: false, description: '100문제를 풀었습니다' },
        { id: 5, name: '연속 학습', icon: '📅', earned: true, description: '3일 연속 학습했습니다' }
      ],
      weakAreas: [
        { id: 1, topic: '데이터베이스', accuracy: 45, description: 'SQL 쿼리 작성과 데이터베이스 설계 부분에서 어려움을 겪고 있습니다.' },
        { id: 2, topic: '네트워크', accuracy: 52, description: '네트워크 프로토콜과 보안 관련 문제에서 정답률이 낮습니다.' }
      ],
      currentMonth: '2024년 1월',
      calendarDays: []
    }
  },
  computed: {
    maxWeeklyTime() {
      return Math.max(...this.weeklyData.map(day => day.studyTime));
    }
  },
  mounted() {
    this.generateCalendar();
  },
  methods: {
    continueStudy(progress) {
      this.$router.push({ name: 'study', params: { selectedCertificate: { id: progress.certId, name: progress.certName } } })
    },
    viewDetails(progress) {
      console.log('progress details', progress)
    },
    practiceWeakness(area) {
      this.$router.push({ name: 'study', params: { selectedCertificate: { id: 0, name: `${area.topic} 집중 연습` } } })
    },
    previousMonth() { console.log('Previous month') },
    nextMonth() { console.log('Next month') },
    viewDayDetails(day) { if (day.hasStudy) { console.log('Day details', day) } },
    generateCalendar() {
      const days = [];
      const today = new Date();
      for (let i = 1; i <= 31; i++) {
        const hasStudy = Math.random() > 0.3;
        days.push({
          date: `2024-01-${i.toString().padStart(2, '0')}`,
          day: i,
          hasStudy,
          isToday: i === today.getDate(),
          isCurrentMonth: true,
          studyColor: hasStudy ? '#28a745' : '#6c757d'
        });
      }
      this.calendarDays = days;
    }
  }
}
</script>

<style scoped>
.progress-page {
  padding: 40px 0;
}

.progress-summary {
  margin-bottom: 40px;
}

.summary-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 30px;
}

.summary-icon {
  font-size: 4rem;
}

.summary-content h3 {
  margin-bottom: 20px;
  color: #2c3e50;
}

.summary-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}

.stat {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.certificate-progress {
  margin-bottom: 40px;
}

.certificate-progress h2 {
  margin-bottom: 20px;
  color: #2c3e50;
}

.progress-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.progress-card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.cert-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.cert-icon {
  font-size: 2.5rem;
}

.cert-details h3 {
  margin-bottom: 5px;
  color: #2c3e50;
}

.cert-details p {
  color: #666;
  margin: 0;
  font-size: 14px;
}

.progress-percentage {
  font-size: 1.5rem;
  font-weight: bold;
  color: #007bff;
}

.progress-details {
  margin-bottom: 20px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
}

.detail-row span:first-child {
  color: #666;
}

.detail-row span:last-child {
  font-weight: 500;
  color: #2c3e50;
}

.card-actions {
  display: flex;
  gap: 10px;
}

.study-statistics {
  margin-bottom: 40px;
}

.study-statistics h2 {
  margin-bottom: 20px;
  color: #2c3e50;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
}

.stat-card h3 {
  margin-bottom: 20px;
  color: #2c3e50;
}

.weekly-chart {
  display: flex;
  align-items: end;
  justify-content: space-between;
  height: 100px;
  margin-bottom: 10px;
  padding: 0 10px;
}

.chart-bar {
  width: 20px;
  background-color: #007bff;
  border-radius: 2px 2px 0 0;
  transition: height 0.3s ease;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
}

.goal-progress {
  text-align: left;
}

.goal-item {
  margin-bottom: 15px;
}

.goal-item span:first-child {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: #666;
}

.goal-bar {
  width: 100%;
  height: 8px;
  background-color: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 5px;
}

.goal-fill {
  height: 100%;
  background-color: #28a745;
  transition: width 0.3s ease;
}

.goal-item span:last-child {
  font-size: 12px;
  color: #666;
}

.badges {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  border-radius: 8px;
  background-color: #f8f9fa;
  opacity: 0.5;
  transition: all 0.3s ease;
}

.badge.earned {
  background-color: #fff3cd;
  opacity: 1;
  border: 2px solid #ffc107;
}

.badge-icon {
  font-size: 2rem;
  margin-bottom: 8px;
}

.badge-name {
  font-size: 12px;
  text-align: center;
  color: #666;
}

.weak-areas {
  margin-bottom: 40px;
}

.weak-areas h2 {
  margin-bottom: 20px;
  color: #2c3e50;
}

.weakness-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.weakness-card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #dc3545;
}

.weakness-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.weakness-header h3 {
  color: #2c3e50;
  margin: 0;
}

.accuracy {
  background-color: #dc3545;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.weakness-card p {
  color: #666;
  margin-bottom: 20px;
  line-height: 1.5;
}

.study-calendar {
  margin-bottom: 40px;
}

.study-calendar h2 {
  margin-bottom: 20px;
  color: #2c3e50;
}

.calendar-container {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.calendar-header h3 {
  color: #2c3e50;
  margin: 0;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  position: relative;
}

.calendar-day:hover {
  background-color: #f8f9fa;
}

.calendar-day.has-study {
  background-color: #e3f2fd;
}

.calendar-day.today {
  background-color: #fff3cd;
  border: 2px solid #ffc107;
}

.calendar-day.other-month {
  opacity: 0.3;
}

.day-number {
  font-size: 14px;
  font-weight: 500;
}

.study-indicator {
  position: absolute;
  bottom: 2px;
}

.study-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

@media (max-width: 768px) {
  .summary-card {
    flex-direction: column;
    text-align: center;
  }

  .progress-cards {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .card-actions {
    flex-direction: column;
  }

  .calendar-grid {
    gap: 2px;
  }

  .calendar-day {
    font-size: 12px;
  }
}
</style>
