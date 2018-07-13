/**
 * @param {string} s
 * @return {string[]}
 */
// BFS
function removeInvalidParentheses(s) {
    var res = [];
    // sanity check
    if (s == null) return res;
    var visited = [];
    var queue = [];

    // initialize
    queue.push(s);
    visited.push(s);

    var found = false;

    while (queue.length) {
        s = queue.shift();

        if (isValid(s)) {
            // found an answer, add to the result
            res.push(s);
            found = true;
        }

        if (found) continue;

        // generate all possible states
        for (var i = 0; i < s.length; i++) {
            // we only try to remove left or right paren
            if (s.charAt(i) != '(' && s.charAt(i) != ')') continue;

            var t = s.substring(0, i) + s.substring(i + 1);

            if (!visited.contains(t)) {
                // for each state, if it's not visited, add it to the queue
                queue.push(t);
                visited.push(t);
            }
        }
    }
    return res;
}

// helper function checks if string s contains valid parantheses
function isValid(s) {
    var count = 0;
    for (var i = 0; i < s.length; i++) {
        var c = s.charAt(i);
        if (c == '(') count++;
        if (c == ')' && count-- == 0) return false;
    }
    return count == 0;
}
console.log(removeInvalidParentheses("()())()"));
