const remoteAdd = (a, b) => new Promise((resolve) => {
    setTimeout(() => {
        resolve(a + b);
    }, 10)
});

function localAdd(...inputs) {
    return new Promise(async (resolve) => {
        let l = 0;
        let r = inputs.length - 1;
        let sum = 0;
        let a = 0;
        let b = 0;
        while ( r >= l) {
            a = inputs[l];
            b = r === l ? 0 : inputs[r];
            await remoteAdd(a, b).then(s => {
                sum += s;
                r--;
                l++;
            })
        }
        resolve(sum);
    });
}

localAdd(2, 3, 4).then(sum => {
    console.log(sum);
});
