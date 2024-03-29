function clone (value) {
    if (Array.isArray(value)) {
      return value.map(clone)
    } else if (value && typeof value === 'object') {
      const res = {}
      for (const key in value) {
        res[key] = clone(value[key])
      }
      return res
    } else {
      return value
    }
}
  

function deepCopy(obj) {
    let result = {};
    let keys = Object.keys(obj);
    keys.forEach(key => {
        let temp = obj[key];
       if (temp && typeof temp === 'object') {
           if (Array.isArray(temp)) {
               result[key] = temp.reduce((arr, i) => {
                   return arr.concat(i && typeof i === 'object' ? deepCopy(i) : i)
               }, []);
           } else {
               result[key] = deepCopy(temp)
           }
       } else {
           result[key] = temp;
       }
    });
    return result;
}
