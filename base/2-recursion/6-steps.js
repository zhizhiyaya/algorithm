/**
 * @desc 上台阶
 *      1、只有 1 级 则只有 1 种方式；
 *      2、只有 2 级 则只有 2 种方式；
 *      3、1 + s(n - 1) + 2 + s(n -2)
 */

function steps(n) {
    if (n === 1) {
        return 1;
    }
    if (n === 2) {
        return 2;
    }
    return 1 + steps(n - 1) + 2 + steps(n -2);
}
console.log(steps(3));
