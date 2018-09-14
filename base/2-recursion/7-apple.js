/**
 * @desc 放苹果
 *      m 个相同苹果放在 N 个同样的盘子里，盘子可空，求放法
 *
 *      1、 0个盘子 放不了 0种放法;
 *      2、 0个苹果 1种方法；
 *      3、 m < n  ===  m 个苹果放 m 个盘子；
 *      4、 m >= n ===  有空盘 + 无空盘；
 */

function f( m, n) {
    if (m < n) {
        return f(m, m);
    }
    if (m === 0) {
        return 1;
    }
    if (n === 0) {
        return 0;
    }
    // f(m, n - 1) 有空盘，将全部苹果放在剩余的盘子里
    // f(m - n, n) 无空盘，即每个盘子先放 1 个苹果, 剩余的 m-n个苹果再在n个盘子里放
    return f(m, n - 1) + f(m - n, n);
}
console.log(f(0, 0));
console.log(f(1, 0));
console.log(f(0, 1));
console.log(f(2, 3));
console.log(f(3, 2));
