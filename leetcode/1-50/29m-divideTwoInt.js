/**
 * @param {number} dividend
 * @param {number} divisor
 * @return {number}
 */

var divide = function(dividend, divisor) {
    // 真是尴尬, beats 98.80 %
    var quotient = parseInt(dividend / divisor) ;

    if (quotient < -2147483648){
        return -2147483648;
    }
    if (2147483647 < quotient) {
        return 2147483647;
    }
    return quotient;
};

// Discuss
var divide = function (dividend, divisor) {
    var sign = 1;
    if (dividend < 0) {
        dividend *= -1;
        sign *= -1;
    }
    if (divisor < 0) {
        divisor *= -1;
        sign *= -1;
    }
	if (divisor == 0) return 2147483647;
	if ((dividend == 0) || (dividend < divisor)) return 0;

	var quotient = ldivide(dividend, divisor);
	if (quotient > 2147483647){
		quotient = sign == 1 ? 2147483647 : -2147483648;
	} else {
		quotient *= sign;
	}
    return quotient;
}

function ldivide(ldividend, ldivisor) {
    if (ldividend < ldivisor) return 0;
    var sum = ldivisor;
	var multiple = 1;
	while ((sum + sum) <= ldividend) {
		sum += sum;
		multiple += multiple;
	}
	return multiple + ldivide(ldividend - sum, ldivisor);
}


// TLE
var divide = function(dividend, divisor) {

    var quotient = 0;
    var sum = 0;
    var gap = 1;
    if (dividend < 0) {
        dividend *= -1;
        gap *= -1;
    }
    if (divisor < 0) {
        divisor *= -1;
        gap *= -1;
    }

    while (sum + divisor <= dividend) {
        sum += divisor;
        quotient += gap;
    }
    if (quotient < -2147483648){
        return -2147483648;
    }
    if (2147483647 < quotient) {
        return 2147483647;
    }
    return quotient;
};
