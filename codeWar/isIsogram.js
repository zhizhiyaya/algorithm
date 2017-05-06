function isIsogram(str){
    str = str.toLowerCase();
    var map = '';
    for (var i = str.length - 1; i >= 0; i--) {
        if (map.indexOf(str[i]) > -1) {
            return false;
        }
        map += str[i];
    }
    return true;
}


console.log( isIsogram("Dermatoglyphics"), true );
console.log( isIsogram("isogram"), true );
console.log( isIsogram("aba"), false, "same chars may not be adjacent" );
console.log( isIsogram("moOse"), false, "same chars may not be same case" );
console.log( isIsogram("isIsogram"), false );
console.log( isIsogram(""), true, "an empty string is a valid isogram" );
