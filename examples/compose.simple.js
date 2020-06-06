/**
     * middleware
     * @author 若川
     * @date 2020-05-09
     */

function logger1({ getState }) {
    return next => action => {
        console.log('will dispatch--1', action)

        // Call the next dispatch method in the middleware chain.
        const returnValue = next(action)

        console.log('state after dispatch--1', getState())

        // This will likely be the action itself, unless
        // a middleware further in chain changed it.
        return returnValue
    }
}

function logger2({ getState }) {
    return function (next){
        return function (action){
            console.log('will dispatch--2', action)

            // Call the next dispatch method in the middleware chain.
            const returnValue = next(action)

            console.log('state after dispatch--2', getState())

            // This will likely be the action itself, unless
            // a middleware further in chain changed it.
            return returnValue 
        }
    }
}

function logger3({ getState }) {
    return function (next){
        return function (action){
            console.log('will dispatch--3', action)

            // Call the next dispatch method in the middleware chain.
            const returnValue = next(action)

            console.log('state after dispatch--3', getState())

            // This will likely be the action itself, unless
            // a middleware further in chain changed it.
            return returnValue 
        }
    }
}

const funcs = [logger1, logger2, logger3];

export default function compose(...funcs) {
    if (funcs.length === 0) {
      return arg => arg
    }
  
    if (funcs.length === 1) {
      return funcs[0]
    }
  
    return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

const originalStore  = {
    dispatch: function(action){
        console.log(action);
    }
}
const store = {};
store.dispatch = compose(...chain)(originalStore.dispatch)


store.dispatch({type: '我是若川'})
