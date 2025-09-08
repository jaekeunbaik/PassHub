<template>
  <header class="header">
    <div class="container">
      <div class="header-content">
        <div class="logo">
          <h1>📚 PassHub</h1>
          <p>자격증 공부의 모든 것</p>
        </div>
        <nav class="nav">
          <a href="#" class="nav-link" @click="setActiveTab('home')" :class="{ active: activeTab === 'home' }">
            홈
          </a>
          <a href="#" class="nav-link" @click="setActiveTab('certificates')" :class="{ active: activeTab === 'certificates' }">
            자격증
          </a>
          <a href="#" class="nav-link" @click="setActiveTab('study')" :class="{ active: activeTab === 'study' }">
            학습
          </a>
          <a href="#" class="nav-link" @click="setActiveTab('progress')" :class="{ active: activeTab === 'progress' }">
            진도
          </a>
        </nav>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'AppHeader',
  data() {
    return {
      activeTab: 'home'
    }
  },
  methods: {
    setActiveTab(tab) {
      this.activeTab = tab;
      this.$emit('tab-change', tab);
    }
  }
}
</script>

<style scoped>
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.logo h1 {
  font-size: 2rem;
  margin-bottom: 5px;
  font-weight: 700;
}

.logo p {
  font-size: 0.9rem;
  opacity: 0.9;
  margin: 0;
}

.nav {
  display: flex;
  gap: 30px;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 10px 15px;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.nav-link:hover,
.nav-link.active {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 20px;
  }
  
  .nav {
    gap: 15px;
  }
  
  .logo h1 {
    font-size: 1.5rem;
  }
}
</style>
