# PassHub

PassHub는 자격증 시험 준비를 위한 학습 플랫폼입니다.

## 프로젝트 구조
- `src/`: Vue.js 프론트엔드
- `server/`: Express.js 백엔드 API
- `public/`: 정적 파일

## 로컬 개발 설정

### 의존성 설치
```bash
npm install
cd server && npm install
```

### 개발 서버 실행
```bash
# 프론트엔드 (포트 8080)
npm run serve

# 백엔드 (포트 3000)
cd server && node index.js
```

### 프로덕션 빌드
```bash
npm run build
```

### 린트 검사
```bash
npm run lint
```

## Vercel 배포

### 1. Vercel CLI 설치
```bash
npm i -g vercel
```

### 2. Vercel 로그인
```bash
vercel login
```

### 3. 프로젝트 배포
```bash
vercel
```

### 4. 환경 변수 설정 (Vercel 대시보드에서)
- `NODE_ENV`: production
- `PORT`: 3000 (자동 설정됨)

### API 엔드포인트
배포 후 API는 다음 경로에서 접근 가능합니다:
- `https://your-domain.vercel.app/api/exams`
- `https://your-domain.vercel.app/api/questions`

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


