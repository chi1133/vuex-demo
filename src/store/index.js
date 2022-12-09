import Vue from 'vue'
import Vuex from '@/vuex'
// console.log('Vuex: ', Vuex)

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    age: 10,
  },
  getters: {
    myAge: (state) => state.age + 20,
  },
  mutations: {
    add(state, payload) {
      state.age += payload
    },
  },
  actions: {
    add({ commit }, payload) {
      // setTimeout(() => {
      commit('add', payload)
      // }, 1000)
    },
  },
  modules: {
    a: {
      namespaced: true,
      state: {
        age: 200,
      },
      getters: {
        // 计算属性没有命名空间的时候 会定义在根实例上
        // 有命名空间的时候 可以通过命名空间划分 ，使用模块一定要加命名空间
        myAge: (state) => state.age + 20,
      },
      mutations: {
        add(state, payload) {
          state.age += payload
        },
      },
      modules: {
        d: {
          namespaced: true,
          state: {
            age: 300,
          },
          getters: {
            // 计算属性没有命名空间的时候 会定义在根实例上
            // 有命名空间的时候 可以通过命名空间划分 ，使用模块一定要加命名空间
            myAge: (state) => state.age + 20,
          },
          mutations: {
            add(state, payload) {
              state.age += payload
            },
          },
        },
      },
    },
    c: {
      namespaced: true,
      age: 300,
      state: {
        age: 400,
      },
      mutations: {
        add(state, payload) {
          state.age += payload
        },
      },
    },
  },
})

store.registerModule(['a', 'e'], {
  namespaced: true,
  state: {
    age: 11200,
  },
  getters: {
    myAge: (state) => state.age + 20,
  },
  mutations: {
    add(state, payload) {
      state.age += payload
    },
  },
})

export default store
/**
 * 状态： 子模块的状态会定义在根模块上
 * 计算属性 子模块的技术属性会被添加到根模块上
 * mutations 会收集同名的mutation
 * actions 会收集同名的action
 * */
// 有空间
// 1 状态： 子模块的状态会被定义在根模块上
// 2 计算属性要通过命名空间来访问
// 3 mutation action也会通过命名空间来访问
