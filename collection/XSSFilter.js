// http://www.secbox.cn/hacker/17115.html

var expressions = [

    '/(///*.*/*//)/Us',

    '/(/t)/',

    '/(javascript/s*:)/Usi',

    '/(@import)/Usi',

    '/style=[^<]*((expression/s*?/([^<]*?/))|(behavior/s*:))[^<]*(?=/>)/Uis',

    '/(ondblclick|onclick|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|onload|onunload|onerror)=[^<]*(?=/>)/Uis',

    '/<//?(script|meta|link|frame|iframe).*>/Uis', // 包含 src、href、url、link 等的标签

    '/src=[^<]*base64[^<]*(?=/>)/Uis',

];

function filter(value) {

    return preg_replace(expressions, '', value);

}
