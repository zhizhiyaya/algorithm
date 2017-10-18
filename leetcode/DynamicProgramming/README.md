### 动态规划（Dynamic programming）
	——通过把原问题分解为相对简单的子问题的方式求解复杂问题的方法。
若要解一个给定问题，我们需要解其不同部分（即子问题），再合并子问题的解以得出原问题的解。

1、
计算斐波那契数列（Fibonacci polynomial）的一个最基础的算法是，直接按照定义计算（函数递归）：
	```
	function fib(n）{
		if (n = 0 or n = 1) {
			return n
		}
		return fib(n − 1) + fib（n − 2）
	}
  	```

2、
背包问题
