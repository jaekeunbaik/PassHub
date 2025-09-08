<template>
  <div id="app">
    <AppHeader @tab-change="handleTabChange" />
    <main class="main-content">
      <HomePage 
        v-if="activeTab === 'home'"
        @tab-change="handleTabChange"
        @certificate-selected="handleCertificateSelected"
        @continue-study="handleContinueStudy"
      />
      <CertificateList 
        v-if="activeTab === 'certificates'"
        @certificate-selected="handleCertificateSelected"
        @start-study="handleStartStudy"
        @view-details="handleViewDetails"
      />
      <StudyPage 
        v-if="activeTab === 'study'"
        :selected-certificate="selectedCertificate"
        @go-home="handleGoHome"
      />
      <ProgressPage 
        v-if="activeTab === 'progress'"
        @continue-study="handleContinueStudy"
        @view-details="handleViewDetails"
        @practice-weakness="handlePracticeWeakness"
        @view-day-details="handleViewDayDetails"
      />
    </main>
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from './components/Header.vue'
import AppFooter from './components/Footer.vue'
import HomePage from './components/HomePage.vue'
import CertificateList from './components/CertificateList.vue'
import StudyPage from './components/StudyPage.vue'
import ProgressPage from './components/ProgressPage.vue'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter,
    HomePage,
    CertificateList,
    StudyPage,
    ProgressPage
  },
  data() {
    return {
      activeTab: 'home',
      selectedCertificate: null
    }
  },
  methods: {
    handleTabChange(tab) {
      this.activeTab = tab;
    },
    handleCertificateSelected(certificate) {
      this.selectedCertificate = certificate;
      this.activeTab = 'study';
    },
    handleStartStudy(certificate) {
      this.selectedCertificate = certificate;
      this.activeTab = 'study';
    },
    handleContinueStudy() {
      // 진행 중인 학습을 계속하는 로직
      this.activeTab = 'study';
    },
    handleViewDetails(certificate) {
      // 자격증 상세 정보 보기 로직
      console.log('View details:', certificate);
    },
    handlePracticeWeakness() {
      // 약점 연습 로직
      this.activeTab = 'study';
    },
    handleViewDayDetails(day) {
      // 특정 날짜의 학습 상세 보기 로직
      console.log('View day details:', day);
    },
    handleGoHome() {
      this.activeTab = 'home';
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f8f9fa;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.btn {
  display: inline-block;
  padding: 12px 24px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
}

.btn-secondary:hover {
  background-color: #545b62;
}

.btn-success {
  background-color: #28a745;
}

.btn-success:hover {
  background-color: #1e7e34;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
}

.grid {
  display: grid;
  gap: 20px;
}

.grid-2 {
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.grid-3 {
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.text-center {
  text-align: center;
}

.mb-4 {
  margin-bottom: 1.5rem;
}

.mt-4 {
  margin-top: 1.5rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin: 10px 0;
}

.progress-fill {
  height: 100%;
  background-color: #007bff;
  transition: width 0.3s ease;
}

@media (max-width: 768px) {
  .main-content {
    padding: 10px;
  }
  
  .container {
    padding: 0 10px;
  }
  
  .grid-2,
  .grid-3 {
    grid-template-columns: 1fr;
  }
}
</style>
