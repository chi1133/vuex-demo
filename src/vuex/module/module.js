import { forEachValue } from '../util'

export default class Module {
  constructor(module) {
    this._raw = module
    this._children = {}
    this.state = module.state
  }
  get namespaced() {
    return !!this._raw.namespaced
  }
  addChild(key, module) {
    this._children[key] = module
  }
  getChild(key) {
    return this._children[key]
  }
  forEachMutation(cb) {
    if (this._raw.mutations) {
      forEachValue(this._raw.mutations, cb)
    }
  }
  forEachAction(cb) {
    if (this._raw.actions) {
      forEachValue(this._raw.actions, cb)
    }
  }
  forEachGetter(cb) {
    if (this._raw.getters) {
      forEachValue(this._raw.getters, cb)
    }
  }
  forEachModule(cb) {
    // 循环模块 包装后
    forEachValue(this._children, cb)
  }
}

/*
{
  _raw:userobj,
  state:state,
  _children:{
    _raw:userobj,
    state:state,
    _children:{
  }
}
* */
