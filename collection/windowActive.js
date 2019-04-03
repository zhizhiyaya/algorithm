// --------------------- 
// 作者：justforuse 
// 来源：CSDN 
// 原文：https://blog.csdn.net/u014291497/article/details/53495192 
// 版权声明：本文为博主原创文章，转载请附上博文链接！

(function() {
    var hidden = "hidden";

    //各个浏览器属性兼容
    if (hidden in document)
        document.addEventListener("visibilitychange", onchange);
    else if ((hidden = "mozHidden") in document)
        document.addEventListener("mozvisibilitychange", onchange);
    else if ((hidden = "webkitHidden") in document)
        document.addEventListener("webkitvisibilitychange", onchange);
    else if ((hidden = "msHidden") in document)
        document.addEventListener("msvisibilitychange", onchange);

    else if ("onfocusin" in document)
        document.onfocusin = document.onfocusout = onchange;

    else
        window.onpageshow = window.onpagehide = window.onfocus = window.onblur = onchange;

    //主要功能代码
    //网页状态改变事件
    function onchange(evt) {
        if(document[hidden]){
            document.title = "false";
        }else{
            document.title = "true";
        }
    }


    if (document[hidden] !== undefined)
        onchange({
            type: document[hidden] ? "blur" : "focus"
        });
})();
