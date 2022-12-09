export let Vue
function install(_Vue) {
  debugger
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

export default install
