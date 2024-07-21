import { createRouter, createWebHashHistory } from 'vue-router'; // Importe createWebHashHistory
import Login from '../components/Login.vue';
import FichaMedica from '../components/FichaMedica.vue';
import Pma from '../components/Pma.vue';
import UsersAdmin from '../components/UsersAdmin.vue';
import PainelFichas from '../components/PainelFichas.vue';
// import ListaDeUsuários from '../components/ListaDeUsuarios.vue';


const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/users-admin',
    name: 'UsersAdmin',
    component: UsersAdmin,
    meta: { requiresAuth: true, isAdmin: true } // Rota de administração requer autenticação e é para administradores
  },
  {
    path: '/ficha-medica',
    name: 'FichaMedica',
    component: FichaMedica,
    // meta: { requiresAuth: true }  // Rota de ficha médica requer autenticação
  },
  {
    path: '/fichas-medicas/:pmaId',
    name: 'FichasMedicas',
    component: FichaMedica,
    meta: { requiresAuth: true }  // Rota de ficha médica requer autenticação
  },
  {
    path: '/pmas',
    name: 'Pmas',
    component: Pma,
    meta: { requiresAuth: true }  // Rota de PMA requer autenticação
  },
  {
    path: '/panel',
    name: 'Panel',
    component: PainelFichas,
    meta: { requiresAuth: true }  // Rota de PMA requer autenticação
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: Login },
  
];

const router = createRouter({
  history: createWebHashHistory(), // Use createWebHashHistory() em vez de createWebHistory()
  routes,
});

router.beforeEach((to, from, next) => {
  // Verifica se a rota requer autenticação
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token');
    // Se não houver token, redireciona para a página de login
    if (!token) {
      next('/');
    } else {
      // Verifica se o token de admin está presente
      const isAdmin = localStorage.getItem('isAdmin');
      if (to.meta.isAdmin && isAdmin === 'true') {
        next(); // Permite acesso à rota de administração para administradores
      } else if (!to.meta.isAdmin && isAdmin !== 'true') {
        next(); // Permite acesso à rota de ficha médica para usuários não administradores
      } else {
        next('/'); // Redireciona para a página de login se não corresponder à permissão necessária
      }
    }
  } else {
    next(); // Permite acesso a rotas públicas
  }
});

export default router;
