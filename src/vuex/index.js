// import install, { Vue } from './install'
import ModuleCollection from './module/module-collection'
import { forEachValue } from './util'
let Vue
const install = (_Vue) => {
  Vue = _Vue
  Vue.mixin({
    beforeCreate() {
      // 让所有组件都定义一个$store
      if (this.$options.store) {
        this.$store = this.$options.store
      } else if (this.$parent && this.$parent.$store) {
        this.$store = this.$parent.$store
      }
    },
  })
}
function installModule(store, rootState, path, rootModule) {
  if (path.length > 0) {
    let parent = path.slice(0, -1).reduce((start, current) => {
      return start[current]
    }, rootState)
    // debugger
    Vue.set(parent, path[path.length - 1], rootModule.state)
    // parent[path[path.length - 1]] = rootModule.state
  }
  let namespaced = store._modules.getNamespace(path)

  rootModule.forEachMutation((mutationKey, mutationValue) => {
    store._mutations[namespaced + mutationKey] = store._mutations[namespaced + mutationKey] || []
    store._mutations[namespaced + mutationKey].push((payload) => {
      mutationValue(rootModule.state, payload)
    })
  })
  rootModule.forEachAction((actionKey, actionValue) => {
    store._actions[namespaced + actionKey] = store._actions[namespaced + actionKey] || []
    store._actions[namespaced + actionKey].push((payload) => {
      actionValue(store, payload)
    })
  })
  rootModule.forEachGetter((getterKey, getterValue) => {
    if (store._wrappedGetters[namespaced + getterKey]) {
      return console.warn('duplicate key')
    }
    store._wrappedGetters[namespaced + getterKey] = () => {
      return getterValue(rootModule.state)
    }
  })
  rootModule.forEachModule((moduleKey, module) => {
    installModule(store, rootState, path.concat(moduleKey), module)
  })
  // console.log('store: ', store)
}
function resetStoreVM(store, state) {
  let oldVm = store._vm
  store.getters = {}
  const computed = {}
  const wrappedGetters = store._wrappedGetters
  forEachValue(wrappedGetters, (getterKey, getterValue) => {
    computed[getterKey] = getterValue
    Object.defineProperty(store.getters, getterKey, {
      get: () => {
        return store._vm[getterKey]
      },
    })
  })
  // debugger
  store._vm = new Vue({
    data: {
      $$state: state,
    },
    computed,
  })
  if (oldVm) {
    Vue.nextTick(() => oldVm.$destroy())
  }
}
class Store {
  constructor(options) {
    // debugger
    // 将选项进行格式化
    this._modules = new ModuleCollection(options)
    // console.log(this._modules)

    this._mutations = Object.create(null)
    this._actions = Object.create(null)
    this._wrappedGetters = Object.create(null)

    // 传入的根状态
    const state = this._modules.root.state
    installModule(this, state, [], this._modules.root)
    // console.log('state:', state)
    resetStoreVM(this, state)
  }
  install = install
  commit = (type, payload) => {
    // debugger
    console.log(this._modules)
    if (this._mutations[type]) {
      this._mutations[type].forEach((fn) => fn.call(this, payload))
    }
  }
  dispatch = (type, payload) => {
    if (this._actions[type]) {
      this._actions[type].forEach((fn) => fn.call(this, payload))
    }
  }
  registerModule(path, module) {
    if (typeof path === 'string') path = [path]
    // register
    // debugger
    this._modules.register(path, module)
    installModule(this, this.state, path, module.newModule)
    // computed update
    resetStoreVM(this, this.state)
  }
  get state() {
    // debugger
    return this._vm._data.$$state
  }
}

export default {
  Store,
  install,
}
