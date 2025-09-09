<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1>자격증 공부, 이제 쉽고 재미있게!</h1>
        <p>PassHub에서 체계적인 학습으로 원하는 자격증을 취득하세요</p>
        <div class="hero-buttons">
          <button class="btn btn-primary" @click="startStudy">지금 시작하기</button>
          <button class="btn btn-secondary" @click="viewCertificates">자격증 둘러보기</button>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="container">
        <h2 class="text-center mb-4">왜 PassHub를 선택해야 할까요?</h2>
        <div class="grid grid-3">
          <div class="feature-card">
            <div class="feature-icon">📚</div>
            <h3>체계적인 학습</h3>
            <p>단계별 학습 과정으로 효율적으로 공부하세요</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🎯</div>
            <h3>맞춤형 문제</h3>
            <p>개인별 약점을 분석하여 맞춤형 문제를 제공합니다</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>진도 관리</h3>
            <p>학습 진도를 한눈에 확인하고 목표를 달성하세요</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Popular Certificates -->
    <section class="popular-certificates">
      <div class="container">
        <h2 class="text-center mb-4">인기 자격증</h2>
        <div class="grid grid-3">
          <div class="certificate-card" v-for="cert in popularCertificates" :key="cert.id">
            <div class="cert-icon">{{ cert.icon }}</div>
            <h3>{{ cert.name }}</h3>
            <p>{{ cert.description }}</p>
            <div class="cert-stats">
              <span>👥 {{ cert.students }}명 학습중</span>
              <span>⭐ {{ cert.rating }}</span>
            </div>
            <button class="btn btn-primary" @click="selectCertificate(cert)">학습 시작</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Study Progress -->
    <section class="study-progress" v-if="userProgress.length > 0">
      <div class="container">
        <h2 class="text-center mb-4">나의 학습 현황</h2>
        <div class="grid grid-2">
          <div class="progress-card" v-for="progress in userProgress" :key="progress.certId">
            <h3>{{ progress.certName }}</h3>
            <div class="progress-info">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: progress.percentage + '%' }"></div>
              </div>
              <p>{{ progress.completed }}/{{ progress.total }} 문제 완료 ({{ progress.percentage }}%)</p>
            </div>
            <button class="btn btn-success" @click="continueStudy(progress)">학습 계속하기</button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      popularCertificates: [
        { id: 1, name: '정보처리기사', description: 'IT 분야의 기본 자격증', icon: '💻', students: 1250, rating: 4.8 },
        { id: 2, name: '토익', description: '영어 실력 인증서', icon: '🌍', students: 2100, rating: 4.7 },
        { id: 3, name: '한국사능력검정시험', description: '한국사 기본 지식', icon: '🏛️', students: 890, rating: 4.6 }
      ],
      userProgress: [
        { certId: 1, certName: '정보처리기사', completed: 45, total: 100, percentage: 45 },
        { certId: 2, certName: '토익', completed: 78, total: 120, percentage: 65 }
      ]
    }
  },
  methods: {
    startStudy() {
      this.$router.push({ name: 'certificates' })
    },
    viewCertificates() {
      this.$router.push({ name: 'certificates' })
    },
    selectCertificate(cert) {
      this.$router.push({ name: 'study', params: { selectedCertificate: cert } })
    },
    continueStudy(progress) {
      this.$router.push({ name: 'study', params: { selectedCertificate: { id: progress.certId, name: progress.certName } } })
    }
  }
}
</script>

<style scoped>
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 80px 0;
  text-align: center;
}

.hero-content h1 {
  font-size: 3rem;
  margin-bottom: 20px;
  font-weight: 700;
}

.hero-content p {
  font-size: 1.2rem;
  margin-bottom: 30px;
  opacity: 0.9;
}

.hero-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary {
  background-color: #28a745;
  padding: 15px 30px;
  font-size: 1.1rem;
}

.btn-primary:hover {
  background-color: #1e7e34;
}

.features {
  padding: 80px 0;
  background-color: white;
}

.feature-card {
  text-align: center;
  padding: 30px 20px;
  border-radius: 10px;
  background: white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.feature-card h3 {
  margin-bottom: 15px;
  color: #2c3e50;
}

.popular-certificates {
  padding: 80px 0;
  background-color: #f8f9fa;
}

.certificate-card {
  background: white;
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.certificate-card:hover {
  transform: translateY(-5px);
}

.cert-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.certificate-card h3 {
  margin-bottom: 15px;
  color: #2c3e50;
}

.cert-stats {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
  font-size: 0.9rem;
  color: #666;
}

.study-progress {
  padding: 80px 0;
  background-color: white;
}

.progress-card {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.progress-card h3 {
  margin-bottom: 20px;
  color: #2c3e50;
}

.progress-info {
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2rem;
  }

  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }

  .cert-stats {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
