import Vue from 'vue'
const eventBus = new Vue()
Vue.prototype.$eventBus = eventBus
export default eventBus
