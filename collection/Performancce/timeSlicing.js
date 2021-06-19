// function ts (gen) {
//     if (typeof gen === 'function') gen = gen()
//     if (!gen || typeof gen.next !== 'function') return
//     return function next() {
//       const start = performance.now()
//       let res = null
//       do {
//         res = gen.next()
//       } while(!res.done && performance.now() - start < 25);
  
//       if (res.done) return
//       setTimeout(next)
//     }
// }
// ts(function* () {
//     const start = performance.now()
//     while (performance.now() - start < 1000) {
//       console.log(11)
//       yield
//     }
//     console.log('done!')
// })();
// ts(function* () {
//     for (let i = 0; i < 1000; i++) {
//       console.log(11)
//       yield
//     }
//     console.log('done!')
// })();