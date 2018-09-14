/**
 * @desc n阶乘
 */

function factorial(n) {
    if (n === 1) {
        return 1;
    }
    return n * factorial(n - 1);
}
console.log(factorial(3));


/**
 * @desc 斐波那契数列
 *          F0 = 0;
 *          F1 = 1;
 *          F(n) = F(n - 1) + F(n - 2); (n >= 2)
 */

function fibonacci(n) {
    if (n <= 1) {
        return n;
    }

    return fibonacci(n - 1) + fibonacci(n - 2);
}
// 0 + 1
// 1
// 1 + 1
// 2
console.log(fibonacci(3));
