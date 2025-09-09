<template>
  <div class="certificate-list">
    <div class="container">
      <h1 class="text-center mb-4">자격증 목록</h1>

      <!-- Search and Filter -->
      <div class="search-filter">
        <div class="search-box">
          <input type="text" v-model="searchQuery" placeholder="자격증명으로 검색..." class="search-input">
          <button class="search-btn">🔍</button>
        </div>

        <div class="filter-buttons">
          <button v-for="category in categories" :key="category.id" @click="setActiveCategory(category.id)"
            :class="['filter-btn', { active: activeCategory === category.id }]">
            {{ category.name }}
          </button>
        </div>
      </div>

      <!-- Certificate Grid -->
      <div class="certificate-grid">
        <div v-for="cert in filteredCertificates" :key="cert.id" class="certificate-item"
          @click="selectCertificate(cert)">
          <div class="cert-header">
            <div class="cert-icon">{{ cert.icon }}</div>
            <div class="cert-badge" v-if="cert.isPopular">인기</div>
          </div>

          <div class="cert-content">
            <h3>{{ cert.name }}</h3>
            <p class="cert-description">{{ cert.description }}</p>

            <div class="cert-details">
              <div class="detail-item">
                <span class="detail-label">난이도:</span>
                <div class="difficulty-stars">
                  <span v-for="i in 5" :key="i" :class="['star', { filled: i <= cert.difficulty }]">★</span>
                </div>
              </div>

              <div class="detail-item">
                <span class="detail-label">문제 수:</span>
                <span>{{ cert.questionCount }}문제</span>
              </div>

              <div class="detail-item">
                <span class="detail-label">학습자:</span>
                <span>{{ cert.students }}명</span>
              </div>
            </div>

            <div class="cert-stats">
              <div class="stat">
                <span class="stat-value">{{ cert.rating }}</span>
                <span class="stat-label">평점</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ cert.passRate }}%</span>
                <span class="stat-label">합격률</span>
              </div>
            </div>
          </div>

          <div class="cert-footer">
            <button class="btn btn-primary" @click.stop="startStudy(cert)">
              학습 시작
            </button>
            <button class="btn btn-secondary" @click.stop="viewDetails(cert)">
              자세히 보기
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CertificateList',
  data() {
    return {
      searchQuery: '',
      activeCategory: 'all',
      categories: [
        { id: 'all', name: '전체' },
        { id: 'it', name: 'IT/컴퓨터' },
      ],
      certificates: []
    }
  },
  created() {
    this.fetchCertificates();
  },
  computed: {
    filteredCertificates() {
      let filtered = this.certificates;
      if (this.searchQuery) {
        filtered = filtered.filter(cert =>
          cert.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
      return filtered;
    }
  },
  methods: {
    async fetchCertificates() {
      try {
        const response = await axios.get('http://localhost:3000/exams');
        this.certificates = response.data.map(cert => ({
          ...cert,
          description: `${cert.name} ${cert.type} 시험입니다.`,
          icon: '💻',
          questionCount: cert.details.totalQuestions,
          difficulty: 3, // 기본값
          students: 0, // 기본값
          rating: 4.5, // 기본값
          passRate: 75, // 기본값
          isPopular: false // 기본값
        }));
      } catch (error) {
        console.error('시험 목록을 불러오는 중 오류가 발생했습니다:', error);
      }
    },
    setActiveCategory(categoryId) {
      this.activeCategory = categoryId;
    },
    selectCertificate(cert) {
      this.$router.push({ name: 'study', params: { examId: cert.id } });
    },
    startStudy(cert) {
      this.$router.push({ name: 'study', params: { examId: cert.id } });
    },
    viewDetails(cert) {
      console.log('view details', cert)
    }
  }
}
</script>

<style scoped>
.certificate-list {
  padding: 40px 0;
}

.search-filter {
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

.search-box {
  display: flex;
  max-width: 400px;
  width: 100%;
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 6px 0 0 6px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  border-color: #007bff;
}

.search-btn {
  padding: 12px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 0 6px 6px 0;
  cursor: pointer;
  font-size: 16px;
}

.filter-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.filter-btn {
  padding: 8px 16px;
  background-color: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.filter-btn:hover,
.filter-btn.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.certificate-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
}

.certificate-item {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.certificate-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.cert-header {
  position: relative;
  padding: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
}

.cert-icon {
  font-size: 3rem;
  margin-bottom: 10px;
}

.cert-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background-color: #ff6b6b;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.cert-content {
  padding: 25px;
}

.cert-content h3 {
  margin-bottom: 10px;
  color: #2c3e50;
  font-size: 1.3rem;
}

.cert-description {
  color: #666;
  margin-bottom: 20px;
  line-height: 1.5;
}

.cert-details {
  margin-bottom: 20px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;
}

.detail-label {
  color: #666;
  font-weight: 500;
}

.difficulty-stars {
  display: flex;
  gap: 2px;
}

.star {
  color: #ddd;
  font-size: 16px;
}

.star.filled {
  color: #ffc107;
}

.cert-stats {
  display: flex;
  justify-content: space-around;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 20px;
}

.stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.2rem;
  font-weight: bold;
  color: #2c3e50;
}

.stat-label {
  font-size: 12px;
  color: #666;
}

.cert-footer {
  padding: 0 25px 25px;
  display: flex;
  gap: 10px;
}

.cert-footer .btn {
  flex: 1;
  padding: 10px;
  font-size: 14px;
}

@media (max-width: 768px) {
  .certificate-grid {
    grid-template-columns: 1fr;
  }

  .search-filter {
    align-items: stretch;
  }

  .filter-buttons {
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 10px;
  }

  .cert-footer {
    flex-direction: column;
  }
}
</style>
