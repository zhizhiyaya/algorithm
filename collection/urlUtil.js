/**
 * 解析URL，将传入的URL分解为对象形式
 * */
export function parseUrl(url) {
    const reg = /((\w+):\/\/([^\:|\/]+)(\:\d*)?(.*\/)([^#|\?|\n]+)?(#.*)?)(\?.*)?/i;
    const keys = ['url', 'baseUrl', 'protocal', 'domain', 'port', 'path', 'filename', 'anchor', 'query'];
    const values = makeRealArray(url.match(reg));
    const result = {};
    values.forEach((item, index) => { result[keys[index]] = values[index] || '' });
    return result;
}

/**
 * 解析查询字符串
 * */
export function parseQueryString(url) {
    const result = {};
    if (url) {
        const query = url.split('?')
        if (query[1]) {
            const items = query[1].split('&');
            let arr;
            for (let i = 0; i < items.length; i++) {
                arr = items[i].split('=');
                result[arr[0]] = arr[1];
            }
        }
    }
    return result;
}

/**
 * 反序列化一段字符串
 */
function transferString(str) {
    if (str) {
        const obj = {};
        let arr = [];
        let s = str.split(/^\w+\?/g);
        if (s.length > 1) {
            s = s[1];
        } else {
            s = s[0];
        }
        arr = s.match(/\w+=[^&#]*/g);
        if (arr && arr.length) {
            arr.forEach((v) => {
                const key = v.split('=');
                obj[key[0]] = key[1];
            });
        }
        return obj;
    }
    return {};
}

/**
 * @method  object  转 query
 * @param obj {Object}
 * @returns {string}
 */
export function toQueryString(obj) {
    return obj ?
        (Object.keys(obj)
            .sort()
            .map((key) => {
                const val = obj[key];

                if (Array.isArray(val)) {
                    return val
                        .sort()
                        .map((val2) => `${encodeURIComponent(key)}=${encodeURIComponent(val2)}`)
                        .join('&');
                }

                return (`${encodeURIComponent(key)}=${encodeURIComponent(val)}`);
            })
            .join('&')) :
        '';
}
