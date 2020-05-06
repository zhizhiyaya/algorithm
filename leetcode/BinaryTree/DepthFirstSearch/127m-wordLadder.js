/**
 * @method BFS
 * @desc 一个单词字典，里面有一系列很相似的单词，然后给了一个起始单词和一个结束单词，每次变换只能改变一个单词（的一个字母），并且中间过程的单词都必须是单词字典中的单词，让我们求出最短的变化序列的长度。
 * @param {string} beginWord
 * @param {string} endWord
 * @param {string[]} wordList
 * @return {number}
 */
// var ladderLength = function (beginWord, endWord, wordList) {
//     var map = {};
//     map[beginWord] = [];
//     for (var i = wordList.length; --i; ) {
//         map[wordList[i - 1]] = [];
//     }
//     for (var key in map) {
//         var container = map[key];
//         for (var word ) {
//
//         }
//     }
//
// };

var ladderLength = function (beginWord, endWord, wordList) {
    if (beginWord == null || endWord == null || beginWord.length !== endWord.length) return 0;
    if (!wordList.length) return 0;

    wordList.push(endWord);
    var count = 0;
    var i = 0;

    while (i < beginWord.length) {
        var found = false;
        var arr = beginWord.split('');
        var tmp = arr[i];
        for (var j = 97; j <= 122; j++) {
            arr[i] = String.fromCharCode(j);
            var checker = arr.join('');
            const k = wordList.indexOf(checker);
            if (k > -1) {
                count++;
                wordList.splice(k, 1);
                if (checker === endWord) {
                    return count;
                } else {
                    beginWord = checker;
                    found = true;
                    i = 0;
                    break;
                }
            }
        }
        if (!found) {
            arr[i] = tmp;
            i++;
        }
    }
    return count;
};


// ladderLength('hot', 'cog', ['hot', 'dot', 'dog', 'lot', 'log', 'cog'])
ladderLength('hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log']);
/**
 *                                 hit
 *
 * ait   bit ....  zit  hat hbt .. hot .. hzt hia .. hit ..hiz
 *
 * ..       ..                  .. dot ..  lot  ..
 *
 */
