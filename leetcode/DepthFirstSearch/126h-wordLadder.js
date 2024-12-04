/**
 * @desc 给出两个单词（start和end）和一个字典，找出所有从start到end的最短转换序列。
 *           每次只能改变一个字母。
 *           变换过程中的中间单词必须在字典中出现。
 * @param {string} beginWord
 * @param {string} endWord
 * @param {string[]} wordList
 * @return {string[][]}
 */
var findLadders = function(start, end, wordList) {
    var dict = {};
    var res = [];
    var nodeNeighbors = {};
    var distance = {};
    var solution = [];

    dict.add(start);
    bfs(start, end, dict, nodeNeighbors, distance);                 
    dfs(start, end, dict, nodeNeighbors, distance, solution, res);   
    return res;
};

// BFS: Trace every node's distance from the start node (level by level).
function bfs(start, end, dict, nodeNeighbors, distance) {

}

// Find all next level nodes.
function dfs(start, end, dict, nodeNeighbors, distance, solution, res) {
    solution.add(cur);
    if (end.equals(cur)) {
        res.add(new Array(solution));
    } else {
        for (var next = nodeNeighbors.get(cur)) {            
            if (distance.get(next) == distance.get(cur) + 1) {
                dfs(next, end, dict, nodeNeighbors, distance, solution, res);
            }
        }
    }           
    solution.remove(solution.size() - 1);
}

function getNeighbors(node, dict) {
    var res = [];
    var chs = node.split(''); // toCharArray
 
    for (var ch ='a'; ch <= 'z'; ch++) {
        for (var i = 0; i < chs.length; i++) {
            if (chs[i] == ch) continue;
            var oldCh = chs[i];
            chs[i] = ch;
            if (dict.indexOf(chs) > -1) {
                res.push(chs);
            }
            chs[i] = oldCh;
        }
    }
    return res;
}

 
 private void bfs(String start, String end, Set<String> dict, HashMap<String, ArrayList<String>> nodeNeighbors, HashMap<String, Integer> distance) {
   for (String str : dict)
       nodeNeighbors.put(str, new ArrayList<String>());
 
   Queue<String> queue = new LinkedList<String>();
   queue.offer(start);
   distance.put(start, 0);
 
   while (!queue.isEmpty()) {
       int count = queue.size();
       boolean foundEnd = false;
       for (int i = 0; i < count; i++) {
           String cur = queue.poll();
           int curDistance = distance.get(cur);                
           ArrayList<String> neighbors = getNeighbors(cur, dict);
 
           for (String neighbor : neighbors) {
               nodeNeighbors.get(cur).add(neighbor);
               if (!distance.containsKey(neighbor)) {// Check if visited
                   distance.put(neighbor, curDistance + 1);
                   if (end.equals(neighbor))// Found the shortest path
                       foundEnd = true;
                   else
                       queue.offer(neighbor);
                   }
               }
           }
 
           if (foundEnd)
               break;
       }
   }
 
 // Find all next level nodes.    
 private ArrayList<String> getNeighbors(String node, Set<String> dict) {
   ArrayList<String> res = new ArrayList<String>();
   char chs[] = node.toCharArray();
 
   for (char ch ='a'; ch <= 'z'; ch++) {
       for (int i = 0; i < chs.length; i++) {
           if (chs[i] == ch) continue;
           char old_ch = chs[i];
           chs[i] = ch;
           if (dict.contains(String.valueOf(chs))) {
               res.add(String.valueOf(chs));
           }
           chs[i] = old_ch;
       }
 
   }
   return res;
 }
 
 // DFS: output all paths with the shortest distance.
 private void dfs(String cur, String end, Set<String> dict, HashMap<String, ArrayList<String>> nodeNeighbors, HashMap<String, Integer> distance, ArrayList<String> solution, List<List<String>> res) {
     solution.add(cur);
     if (end.equals(cur)) {
        res.add(new ArrayList<String>(solution));
     } else {
        for (String next : nodeNeighbors.get(cur)) {            
             if (distance.get(next) == distance.get(cur) + 1) {
                  dfs(next, end, dict, nodeNeighbors, distance, solution, res);
             }
         }
     }           
    solution.remove(solution.size() - 1);
 }