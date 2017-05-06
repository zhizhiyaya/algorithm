/**
 * 选择排序
	首先在 未排序序列中找到最小（大）元素，存放到排序序列的起始位置，
	然后，再从剩余未排序元素中继续寻找最小（大）元素，然后放到已排序序列的末尾。
 */
function selectSort(arr, n) {
    var i, j, minIndex, mid;
	n = n || arr.length;
    for (i = 0; i < n; i++) {
        minIndex = i;

		//找最小元素的位置
        for (j = i + 1; j < n; j++) {
			if (arr[j] < arr[minIndex]) {
				minIndex = j;
			}
		}
		//将这个元素放到无序区的开头
		mid = arr[i];
		arr[i] = arr[minIndex];
		arr[minIndex] = mid;
    }
	return arr;
}
