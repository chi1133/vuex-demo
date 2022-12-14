import { forEachValue } from '../util'
import Module from './module'
export default class ModuleCollections {
  // 构建父子关系
  constructor(options) {
    this.root = null
    this.register([], options)
  }
  getNamespace(path) {
    let module = this.root
    return path.reduce((str, key) => {
      module = module.getChild(key)
      return str + (module.namespaced ? `${key}/` : '')
    }, '')
  }
  register(path, rootModule) {
    // console.log('rootModule: ', rootModule)
    let newModule = new Module(rootModule)
    rootModule.newModule = newModule
    if (this.root === null) {
      this.root = newModule
    } else {
      let parent = path.slice(0, -1).reduce((start, current) => {
        // return start._children[current]
        return start.getChild(current)
      }, this.root)
      parent.addChild(path[path.length - 1], newModule)
      // parent._children[path[path.length - 1]] = newModule
    }
    if (rootModule.modules) {
      forEachValue(rootModule.modules, (moduleName, moduleValue) => {
        this.register(path.concat(moduleName), moduleValue)
      })
    }
  }
}
