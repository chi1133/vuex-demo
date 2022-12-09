<template>
  <div id="app">
    <h1>{{ $store.state.age }}</h1>
    <h2>{{ $store.getters.myAge }}</h2>
    <button @click="$store.commit('add', 2)">mutation+2</button>
    <button @click="$store.dispatch('add', 1)">action+1</button>

    <button @click="$store.state.age++">force +1</button>

    <div>a模块</div>
    a=> age: {{ $store.state.a.age }} <br />
    a computed=> myAge: {{ $store.getters['a/myAge'] }}
    <button @click="$store.commit('a/add', 1)">a模块commit</button>
    <div>c模块</div>
    c=> age: {{ $store.state.c.age }}
    <button @click="$store.commit('c/add', 1)">c模块commit</button>
    <div>d模块</div>
    d=> age: {{ $store.state.a.d.age }} <br />
    <button @click="$store.commit('a/d/add', 12)">d模块mutation</button>
    <div>e模块</div>
    e=> age: {{ $store.state.a.e.age }} <br />
    e computed=> myAge: {{ $store.getters['a/e/myAge'] }} <br />
    <button @click="$store.commit('a/e/add',1)">e模块commit</button>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    // console.log(this.$store)
    // this.$store.dispatch('add', 1)
  },
}
</script>

<style></style>
