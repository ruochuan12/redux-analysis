# 学习 redux 源码整体架构

redux-analysis

API

## TOP API

### createStore(reducer, [preloadedState], [enhancer])

### combineReducers(reducers)

### applyMiddleware(...middlewares)

### bindActionCreators(actionCreators, dispatch)

### compose(...functions)

## Store

### getState()

### dispatch(action)

### subscribe(listener)

### replaceReducer(nextReducer)

## vuex 和 redux 对比

### vuex 只能用于 vue vs redux 可以用于其他项目 比如小程序、jQuery等

### vuex 插件 vs redux 中间件

## 推荐阅读

[@胡子大哈：动手实现 Redux（一）：优雅地修改共享状态](http://huziketang.mangojuice.top/books/react/lesson30)，总共6小节<br>
[redux 英文文档](https://redux.js.org)<br>
[redux 中文文档](https://www.redux.org.cn/)<br>
[Redux源码分析(1) - Redux介绍及使用](https://blog.csdn.net/zcs425171513/article/details/105619754)<br>