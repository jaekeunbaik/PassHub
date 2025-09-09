<template>
  <header class="header">
    <div class="container">
      <div class="header-content">
        <div class="logo">
          <h1>📚 PassHub</h1>
          <p>자격증 공부의 모든 것</p>
        </div>
        <nav class="nav">
          <router-link to="/" class="nav-link" :class="{ active: $route.name === 'home' }">홈</router-link>
          <router-link to="/certificates" class="nav-link"
            :class="{ active: $route.name === 'certificates' }">자격증</router-link>
          <router-link to="/study" class="nav-link" :class="{ active: $route.name === 'study' }">학습</router-link>
          <router-link to="/progress" class="nav-link" :class="{ active: $route.name === 'progress' }">진도</router-link>
        </nav>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'AppHeader'
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
