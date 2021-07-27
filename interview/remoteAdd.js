const remoteAdd = (a, b) => new Promise((resolve) => {
    setTimeout(() => {
        resolve(a + b);
    }, 10)
});

function localAdd(...inputs) {
    return new Promise(async (resolve) => {
        let l = 0;
        let r = inputs.length - 1;
        let newArr = [];
        let a = 0;
        let b = 0;
        while (r > l) {
            a = inputs[l];
            b = r === l ? 0 : inputs[r];
            await remoteAdd(a, b).then(s => {
                newArr.push(s);
                r--;
                l++;
                if (r === l || r < l) {
                    r === l && newArr.push(inputs[l]);
                    if (newArr.length > 1) {
                        inputs = newArr;
                        newArr = [];
                        l = 0;
                        r = inputs.length - 1;
                    }
                }
            })
        }
        resolve(newArr[0]);
    });
}

localAdd(2, 3, 4, 5).then(sum => {
    console.log(sum);
});
