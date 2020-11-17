/**
 * @desc redux compose()源码
 *       执行compose(f, g, h) 相当于 (...args) => f(g(h(...args)))
 *       将args按顺序注入到每个函数中，达到一级级传递参数的目的
 */
export default function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

/**
 * @desc redux applyMiddleware()源码
 *       将每个中间件，按顺序compose到一起
 */
export default function applyMiddleware(...middlewares) {
  return createStore => (...args) => {
    const store = createStore(...args)
    let dispatch = () => {
      throw new Error(
        'Dispatching while constructing your middleware is not allowed. ' +
          'Other middleware would not be applied to this dispatch.'
      )
    }

    const middlewareAPI = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args)
    }
    // 让每个中间件函数携带 middlewareAPI 执行一遍，让每个中间件都可以getState和dispatch
    const chain = middlewares.map(middleware => middleware(middlewareAPI))
    dispatch = compose(...chain)(store.dispatch)

    return {
      ...store,
      dispatch
    }
  }
}


/**
 * @desc thunk  ，  redux 
 */
var a = [
    ()=>{ console.log(1) },
    ()=>{ console.log(2) },
    ()=>{ console.log(3) },
].reduce(function (a, b) {
    return function () {
        return a(b.apply(undefined, arguments));
    };
});
a();

// var step1 = function () {
//     return 1(2.apply(undefined, arguments));
// };
// var step2 = function () {
//     return step1(3.apply(undefined, arguments));
// };
// a = step2;
// result: 
// 1(2.apply(undefined, 3.apply(undefined, arguments)))
