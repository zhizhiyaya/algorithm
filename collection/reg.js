/**
 * @desc 正则 test and collect
 */

function execReg(reg, str) {
    var result = reg.exec(str);
    console.log('result length: ', result.length);
    console.log(result);
}

var reg = /(\w)(\w)(.+)/;
var str = 'bbs.blueidea.com';
execReg(reg, str);

// result length:  4
// 完全匹配的整串、以及 子表达式
// [ 'bbs.blueidea.com',
//   'b',
//   'b',
//   's.blueidea.com',
//   index: 0,
//   input: 'bbs.blueidea.com' ]



var reg = /b/g;
var str = 'bbs.blueidea.com';
execReg(reg, str);
execReg(reg, str);
execReg(reg, str);
// 设置 g 的情况下，每次执行 exec 后会更新正则表达式的 lastIndex 属性，表达式本次匹配后，所匹配的字符串的下一个字符索引
// result length:  1
// [ 'b', index: 0, input: 'bbs.blueidea.com' ]
// result length:  1
// [ 'b', index: 1, input: 'bbs.blueidea.com' ]
// result length:  1
// [ 'b', index: 4, input: 'bbs.blueidea.com' ]



// 正向预查，
// （?=pattern） 后面紧跟 pattern 的，
// （?!pattern） 后面 不 是 pattern 的，
reg = /cainiao(?=8)/;
str = 'cainiao8';
// return cainiao , 匹配


// $0 是匹配到的整个串， $1 是匹配到的 第一个子表达式
reg = /-(\w)/g;
str = 'item-index-aa';
str.replace(reg, ($0, $1) => {
    console.log($0, $1);
    return $1.toUpperCase();
})
// -i i
// -a a
// 'itemIndexAa'


// https://devarchy.com/react/library/react-redux-provide?aa=aaa#hash?bb=bb
var reg = /(?=\?)[^\?\#]+/g;
var reg = /\w+=[^&#]*/g;
location.href.match(reg)
// ["?aa=aaa", "?bb=bb"]

/**
 * @desc var obj = {a: {b: {c: 'd'}}, aa: [1, 2, {bb: 'cc'}]};
 * getValueForKeys(obj, ['a.b.c.d', 'aa[2].bb'])
 */
 function getValueForKeys(obj, keys) {
     var reg = /[A-Za-z\$_\d]+/g;
     const ret = [];
     keys.forEach((key) => {
         const matchKey = key.match(reg);
         if (matchKey) {
             const len = matchKey.length;
             let value = obj;
             for (var i = 0; i < len; i++) {
                 value = value[matchKey[i]];
             }
             ret.push(value);
         }
     });
     return ret;
 }
 var obj = {
    a: {
        b: {
            c: 'd'
        }
    },
    aa: [ 1, 2, { bb: 'cc' } ]
};
console.log(getValueForKeys( obj,  ['a.b.c',  'aa[2].bb']));

// 中文
// [^\u0000-\u00FF]