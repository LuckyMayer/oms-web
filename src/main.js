import Vue from 'vue'
import App from './App' // 根组件
import router from './router'
import filter from './filter'

const env = 'dev'

Vue.config.devtools = (env==='dev')? true : false;
Vue.config.silent = (env==='dev')? false : true;

var vue = new Vue({
	router: router,
	render: h => h(App)
}).$mount('#root')

