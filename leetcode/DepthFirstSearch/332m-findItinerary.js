/**
 * @param {string[][]} tickets
 * @return {string[]}
 */
var findItinerary = function(tickets) {
    targets = collections.defaultdict(list);
    sorted(tickets);
    tickets.sort().reverse();
    for(var key in tickets) {
        tickets[key] += tickets[key];
    }


    for a, b in sorted(tickets)[::-1] {
        targets[a] += b;
    }
    route, stack = [], ['JFK']

    while (stack) {
        while targets[stack[-1]] {
            stack += targets[stack[-1]].pop();
        }
        route += stack.pop();
    }
    return route[::-1];
};
