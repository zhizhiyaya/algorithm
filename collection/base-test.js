function duplicates(arr) {
    var map = {};
    var a = [];
    arr.forEach(i => {
        if (map[i]) {
            map[i]++;
            if (a.indexOf(i) === -1) {
                a.push(i);                
            }
        } else {
            map[i] = 1;
        }
    });

    return a;
}

function duplicates(arr) {
   var a = arr.sort(), b = [];
    for(var i in a){
        if(a[i] == a[i-1] && b.indexOf(a[i]) == -1) {
            b.push(a[i]);
        }
    }
    return b;
}

function findAllOccurrences(arr, target) {
    var ins = [];
    arr.forEach((i, index) => {
        if (i === target) {
            ins.push(index);
        }
    })
    return ins;
}

function count(str) {
    var map = {};
    var a = [...str];
    a.forEach(i => {
        if (map[i]) {
            map[i]++;
        } else {
            map[i] = 1;
        }
    });

    return map;
}

// 'font-size' -> fontSize
function cssStyle2DomStyle(sName) {
    return sName.replace(/\-(\w)/, ($0, $1) => {return $1.toUpperCase()})
}