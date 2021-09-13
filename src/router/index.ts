import Vue from 'vue'
import VueRouter from 'vue-router';

Vue.use(VueRouter)

function createRouterInstance() {
  return new VueRouter({
    mode: 'history',
    routes: [
      {
        path: '/',
        name: 'Home',
        redirect: '/home'
      },
      {
        path: '/home',
        name: 'Home',
        component: () => import('../views/main'),
      }
    ]
  })
}

export default createRouterInstance;
