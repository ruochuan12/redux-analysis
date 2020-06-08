function counter(state, action) {
    if (typeof state === 'undefined') {
      return 0
    }

    switch (action.type) {
      case 'INCREMENT':
          debugger;
        return state + 1
      case 'DECREMENT':
        return state - 1
      default:
        return state
    }
}

function todos(state, action) {
    if (typeof state === 'undefined') {
      return []
    }

    switch (action.type) {
        case 'ADD_TODO':
          return state.concat([action.text])
        default:
          return state
      }
}

const actionCreators = {
    'INCREMENT': function(){
        return {
            type: 'INCREMENT',
        };
    },
    'DECREMENT': function(){
        return {
            type: 'DECREMENT',
        };
    }
}

const reducer = Redux.combineReducers({
    todos,
    counter
});
