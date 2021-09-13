import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
import createRouterInstance from '@/router';
import App from './App.vue'

import antInputDirective from 'ant-design-vue/es/_util/antInputDirective'

Vue.use(antInputDirective)

Vue.config.productionTip = false

Vue.use(VueCompositionAPI)

const router = createRouterInstance();

new Vue({
  router,
  render: h => h(App),
}).$mount('#root')
