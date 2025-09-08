<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>PassHub</h3>
          <p>자격증 공부를 위한 최고의 플랫폼</p>
        </div>
        <div class="footer-section">
          <h4>서비스</h4>
          <ul>
            <li><a href="#">자격증 정보</a></li>
            <li><a href="#">문제 풀이</a></li>
            <li><a href="#">학습 진도</a></li>
            <li><a href="#">성적 분석</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>지원</h4>
          <ul>
            <li><a href="#">도움말</a></li>
            <li><a href="#">문의하기</a></li>
            <li><a href="#">이용약관</a></li>
            <li><a href="#">개인정보처리방침</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>연락처</h4>
          <p>📧 support@passhub.com</p>
          <p>📞 02-1234-5678</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 PassHub. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter'
}
</script>

<style scoped>
.footer {
  background-color: #2c3e50;
  color: white;
  padding: 40px 0 20px;
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 30px;
}

.footer-section h3,
.footer-section h4 {
  margin-bottom: 15px;
  color: #ecf0f1;
}

.footer-section h3 {
  font-size: 1.5rem;
  font-weight: 700;
}

.footer-section p {
  margin-bottom: 10px;
  opacity: 0.8;
  line-height: 1.6;
}

.footer-section ul {
  list-style: none;
}

.footer-section ul li {
  margin-bottom: 8px;
}

.footer-section ul li a {
  color: #bdc3c7;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-section ul li a:hover {
  color: #3498db;
}

.footer-bottom {
  border-top: 1px solid #34495e;
  padding-top: 20px;
  text-align: center;
  opacity: 0.7;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
</style>
