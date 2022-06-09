/**
 * @desc 二进制相加
 * @param {string} a
 * @param {string} b
 * @return {string}
 */
var addBinary = function(a, b) {
    var i = a.length - 1;
    var j = b.length - 1;
    var carry = 0;
    var sum = 0;
    var bSum = '';
    while(i >= 0 || j >= 0) {
        sum = carry + (+a[i--] || 0) + (+b[j--] || 0);
        bSum = '' + sum % 2 + bSum;
        carry = Math.floor(sum / 2);
    }
    if (carry) {
        bSum = carry + bSum
    }
    return bSum;
}

var addBinary = function(a, b) {
    var carry = 0;
    var aArr = a.split('');
    var bArr = b.split('');
    var aLength = aArr.length;
    var bLength = bArr.length;
    var gap = bLength - aLength;
    if (gap < 0) {
        gap = Math.abs(gap);
        while (gap) {
            bArr.unshift(0);
            gap--;
        }
    } else {
        while (gap) {
            aArr.unshift(0);
            gap--;
        }
    }
    for(var i = aArr.length; i--;) {
        var sum = carry + +aArr[i] + +bArr[i];
        aArr[i] = sum % 2;
        carry = Math.floor(sum / 2);
    }
    if (carry) {
        aArr.unshift(carry);
    }
    return aArr.join('');
};

// 1010
// 1011
