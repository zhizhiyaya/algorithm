function bubbleSort3(arr, n) {
    var j, k, mid;
    var flag;

    flag = n;
    while (flag > 0) {
        k = flag;
        flag = 0;
        for (j = 1; j < k; j++)
            if (arr[j - 1] > arr[j]) {
                mid = arr[j - 1];
                arr[j - 1] =  arr[j];
                arr[j] = mid;
                flag = j;
            }
    }
}

function bubbleSort2(arr, n) {
    var j, k, mid;
    var flag;

    k = n || arr.length;
    flag = true;
    while (flag) {
        flag = false;
        for (j = 1; j < k; j++)
            if (arr[j - 1] > arr[j]) {
                mid = arr[j - 1];
                arr[j - 1] =  arr[j];
                arr[j] = mid;
                flag = true;
            }
        k--;
    }
}

function bubbleSort1() {

}

function swap( arr1, arr2) {
    var i = arr1;
    arr1 = arr2;
    arr2 = arr1;
}