import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../components/HomePage.vue';
import CertificateList from '../components/CertificateList.vue';
import StudyPage from '../components/StudyPage.vue';
import ProgressPage from '../components/ProgressPage.vue';

const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/certificates', name: 'certificates', component: CertificateList },
  {
    path: '/study/:examId',
    name: 'study',
    component: StudyPage,
    props: true,
  },
  { path: '/progress', name: 'progress', component: ProgressPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
