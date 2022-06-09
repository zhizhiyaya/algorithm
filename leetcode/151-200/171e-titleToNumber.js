/**
 * @param {string} columnTitle
 * @return {number}
 */
 var titleToNumber = function(columnTitle) {
    var dig = 26;
    var n = 0;
    for(var i = 0; i < columnTitle.length; i++) {
        n = n * dig + (columnTitle[i].charCodeAt() - 64);
    }
    return n;
};