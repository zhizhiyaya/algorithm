/**
 * @desc 场景： 一个按钮，每次点击产生一个url , 需要发送一个请求，请求不固定，实现 一个请求完成才发起下一个
 * @desc 闭包
 */
const urlMap = [];
const fetchPro = null;
function clkToFetch(url) {
    urlMap.push(url);
    next();
}
function next() {
    if (fetchPro) {
        return ;
    }
    const url = urlMap.shift();
    if (url) {
        fetchPro = fetch(url).then(() => {
            fetchPro = null;
            if (urlMap.length > 0) {
                next();
            }
        })
    }
}
