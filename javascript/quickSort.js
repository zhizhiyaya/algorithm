/**
 * 快速排序
 * 先确一个基准值，然后从数组左右开始查找，
 * 小于当前基准值的 放左边
 * 大于当前基准值的 放右边
 * 直到 i == j 时，一次分组完成，再对以该基准值分组的组进行递归
 */

function quickSort (arr, l, r) {

	if (l < 0 || r < 0 || l >= r) {
		return false;
	}
	var cur = arr[l]; // 以当前分组的第一个为基准
	var i = l,
	 	j = r;
	if (l < r) {
		while(i != j) {
			while(arr[j] > cur && i < j) {
				j--;        //从右向左找第1个小于基准值的位置j
			}
			if(i < j) {
				arr[i] = arr[j];
				i++;
			}           //将第j个元素置于左端并重置i

			while( arr[i] < cur && i < j) {
				i++;      //从左向右找第1个大于基准值的位置i
			}
			if(i < j) {
				arr[j] = arr[i];
				j--;
			}
		}
	}
	arr[i] = cur;         //将基准值放入它的最终位置,本次划分结束
    quickSort(arr, l, i - 1);     //对基准值左半部递归调用本函数
    quickSort(arr, i + 1, r);    //对基准值右半部递归调用本函数
	return arr;
 }

 console.log(quickSort([5, 4, 6, 2, 3, 1], 0, 5));
