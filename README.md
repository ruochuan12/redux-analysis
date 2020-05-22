# 学习 redux 源码整体架构

## 1. 前言

>你好，我是若川。这是`学习源码整体架构系列`第八篇。整体架构这词语好像有点大，姑且就算是源码整体结构吧，主要就是学习是代码整体结构，不深究其他不是主线的具体函数的实现。本篇文章学习的是实际仓库的代码。

`学习源码整体架构系列`文章如下：
>1.[学习 jQuery 源码整体架构，打造属于自己的 js 类库](https://juejin.im/post/5d39d2cbf265da1bc23fbd42)<br>
>2.[学习 underscore 源码整体架构，打造属于自己的函数式编程类库](https://juejin.im/post/5d4bf94de51d453bb13b65dc)<br>
>3.[学习 lodash 源码整体架构，打造属于自己的函数式编程类库](https://juejin.im/post/5d767e1d6fb9a06b032025ea)<br>
>4.[学习 sentry 源码整体架构，打造属于自己的前端异常监控SDK](https://juejin.im/post/5dba5a39e51d452a2378348a)<br>
>5.[学习 vuex 源码整体架构，打造属于自己的状态管理库](https://juejin.im/post/5dd4e61a6fb9a05a5c010af0)<br>
>6.[学习 axios 源码整体架构，打造属于自己的请求库](https://juejin.im/post/5df349b5518825123751ba66)<br>
>7.[学习 koa 源码的整体架构，浅析koa洋葱模型原理和co原理](https://juejin.im/post/5e69925cf265da571e262fe6)<br>

感兴趣的读者可以点击阅读。<br>
其他源码计划中的有：[`express`](https://github.com/lxchuan12/express-analysis)、[`vue-rotuer`](https://github.com/lxchuan12/vue-router-analysis)、[`redux`](https://github.com/lxchuan12/redux-analysis)、  [`react-redux`](https://github.com/lxchuan12/react-redux-analysis) 等源码，不知何时能写完（哭泣），欢迎持续关注我（若川）。

源码类文章，一般阅读量不高。已经有能力看懂的，自己就看了。不想看，不敢看的就不会去看源码。<br>
所以我的文章，尽量写得让想看源码又不知道怎么看的读者能看懂。

## 2. git subtree 管理源代码

写了很多源码文章，`vuex`、`axios`、`koa`等都是使用新的仓库克隆一份源码在自己仓库中。
虽然电脑可以拉取最新代码，看到原作者的git信息。但上传到`github`后。读者却看不到原仓库作者的`git`信息了。于是我找到了`git submodules` 方案，但并不是很适合。再后来发现了`git subtree`。

简单说下 `npm package`和`git subtree`的区别。
`npm package`是单向的。`git subtree`则是双向的。

具体可以查看这篇文章[@德来（原有赞大佬）：用 Git Subtree 在多个 Git 项目间双向同步子项目，附简明使用手册](https://segmentfault.com/a/1190000003969060)

学会了`git subtree`后，我新建了`redux-analysis`项目后，把`redux`源码`4.x`（`master`分支是`ts`，文章中暂不想让一些不熟悉`ts`的读者看不懂）分支克隆到了我的项目里的一个子项目，得以保留`git`信息。

对应命令则是：

```sh
git subtree add --prefix=redux https://github.com/reduxjs/redux.git 4.x
```

### 2.1

## 3. 调试源代码

看源码调试很重要，所以我的每篇源码文章都详细描述（也许有人看来是比较啰嗦...）如何调试源码。

### 3.1 rollup 生成 sourcemap 便于调试

修改`rollup.config.js`文件，`output`输出的配置生成`sourcemap`。

```js
// rollup.config.js 有些省略
const sourcemap = {
  sourcemap: true,
};

output: {
    // ...
    ...sourcemap: true,
}
```

安装依赖

```sh
git clone http://github.com/lxchuan12/redux-analysis.git
cd redux-analysi/redux
npm i
npm run build
# 会生成sourcemap文件到`dist`等目录下。
```

仔细看看`redux/examples`目录和`redux/README`。

这时我在根路径下，新建文件夹`examples`，把原生js写的计算器`redux/examples/counter-vanilla/index.html`，复制到`examples/index.html`。还有打包后的包含`sourcemap`的`dist`目录。

修改`index.html`的`script`的`redux.js`文件为`dist中的路径`。

```sh
# redux-analysis 根目录
# 安装启动服务的npm包
npm i -g http-server
cd examples
hs -p 5000
```

就可以开心的调试啦。可以直接克隆我的项目`git clone http://github.com/lxchuan12/redux-analysis.git`。本地调试，动手实践，容易消化吸收。

## 4. 调试简单计算器的例子

接着我们来看`examples/index.html`文件。先看`html`部分。只是写了几个 `button`，比较简单。

```html
<div>
    <p>
    Clicked: <span id="value">0</span> times
    <button id="increment">+</button>
    <button id="decrement">-</button>
    <button id="incrementIfOdd">Increment if odd</button>
    <button id="incrementAsync">Increment async</button>
    </p>
</div>
```

`js部分`，也比较简单。声明了一个`counter`函数，传递给`Redux.createStore(counter)`，得到结果`store`，而`store`是个对象。`render`方法渲染数字到页面。用`store.subscribe(render)`订阅的`render`方法。还有`store.dispatch({type: 'INCREMENT' })`方法，调用`store.dispatch`时会触发`render`方法。这样就实现了一个计算器。

```js
function counter(state, action) {
    if (typeof state === 'undefined') {
        return 0
    }

    switch (action.type) {
        case 'INCREMENT':
        return state + 1
        case 'DECREMENT':
        return state - 1
        default:
        return state
    }
}

var store = Redux.createStore(counter)
var valueEl = document.getElementById('value')

function render() {
    valueEl.innerHTML = store.getState().toString()
}

render()
store.subscribe(render)

document.getElementById('increment')
.addEventListener('click', function () {
    store.dispatch({ type: 'INCREMENT' })
})

// 省略部分暂时无效代码...
```

思考：看了这段代码，你会在哪打断点来调试呢。

```js
// 三处可以断点来看
var store = Redux.createStore(counter)
store.subscribe(render)
store.dispatch({ type: 'INCREMENT' })
```

![redux debugger图](./images/redux-debugger.png)

断点调试，按`F5`刷新页面后，按`F8`，把鼠标放在`Redux`和`store`上。

可以看到`Redux`上有好几个方法。分别是：
- __DO_NOT_USE__ActionTypes: {INIT: "@@redux/INITu.v.d.u.6.r", REPLACE: "@@redux/REPLACEg.u.u.7.c", PROBE_UNKNOWN_ACTION: ƒ}
- applyMiddleware: ƒ applyMiddleware()
- bindActionCreators: ƒ bindActionCreators(actionCreators, dispatch)
- combineReducers: ƒ combineReducers(reducers)
- compose: ƒ compose()
- createStore: ƒ createStore(reducer, preloadedState, enhancer)

再看`store`也有几个方法。分别是：

- dispatch: ƒ dispatch(action)
- subscribe: ƒ subscribe(listener)
- getState: ƒ getState()
- replaceReducer: ƒ replaceReducer(nextReducer)
- Symbol(observable): ƒ observable()

也就是[官方文档redux.org.js](https://redux.org.js)上的 `API`。

暂时不去深究每一个`API`的实现。重新按`F5`刷新页面，断点到`var store = Redux.createStore(counter)`。按`F11`，先走一遍主流程。

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

## 中心思想是什么

小时候语文课本习题经常问文章的中心思想是什么。

## 推荐阅读

[@胡子大哈：动手实现 Redux（一）：优雅地修改共享状态](http://huziketang.mangojuice.top/books/react/lesson30)，总共6小节，非常推荐，虽然我很早前就看完了《react小书》，现在再看一遍又有收获<br>
[redux 英文文档](https://redux.js.org)<br>
[redux 中文文档](https://www.redux.org.cn/)<br>
[Redux源码分析(1) - Redux介绍及使用](https://blog.csdn.net/zcs425171513/article/details/105619754)<br>
[若川的学习redux源码仓库](http://github.com/lxchuan12/redux-analysis.git)

## 另一个系列

[面试官问：JS的继承](https://juejin.im/post/5c433e216fb9a049c15f841b)<br>
[面试官问：JS的this指向](https://juejin.im/post/5c0c87b35188252e8966c78a)<br>
[面试官问：能否模拟实现JS的call和apply方法](https://juejin.im/post/5bf6c79bf265da6142738b29)<br>
[面试官问：能否模拟实现JS的bind方法](https://juejin.im/post/5bec4183f265da616b1044d7)<br>
[面试官问：能否模拟实现JS的new操作符](https://juejin.im/post/5bde7c926fb9a049f66b8b52)<br>

## 关于

作者：常以**若川**为名混迹于江湖。前端路上 | PPT爱好者 | 所知甚少，唯善学。<br>
[若川的博客](https://lxchuan12.cn)，使用`vuepress`重构了，阅读体验可能更好些<br>
[掘金专栏](https://juejin.im/user/57974dc55bbb500063f522fd/posts)，欢迎关注~<br>
[`segmentfault`前端视野专栏](https://segmentfault.com/blog/lxchuan12)，欢迎关注~<br>
[知乎前端视野专栏](https://zhuanlan.zhihu.com/lxchuan12)，欢迎关注~<br>
[语雀前端视野专栏](https://www.yuque.com/lxchuan12/blog)，新增语雀专栏，欢迎关注~<br>
[github blog](https://github.com/lxchuan12/blog)，相关源码和资源都放在这里，求个`star`^_^~

## 欢迎加微信交流 微信公众号

可能比较有趣的微信公众号，长按扫码关注（**回复pdf获取前端优质书籍pdf**）。欢迎加我微信`ruochuan12`（注明来源，基本来者不拒），拉您进【前端视野交流群】，长期交流学习~

![若川视野](https://github.com/lxchuan12/blog/raw/master/docs/about/wechat-official-accounts-mini.jpg)