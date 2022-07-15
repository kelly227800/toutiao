import { getToken, setToken } from '@/utils'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: getToken() || {}
  },
  getters: {},
  // 修改数据的地方
  mutations: {
    setUser(state, payload) {
      state.user = payload
      // token放在本地存储
      setToken(payload)
    }
  },
  actions: {},
  modules: {}
})
