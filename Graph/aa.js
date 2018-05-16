//拓扑排序
//顶点
function Vertex(name) {
  this.name =name;
  this.in = 0;
}
Vertex.prototype.setFirstedge = function(edgeNode) {
  this.firstEdge = edgeNode;
  edgeNode.adjVex.in++;
};
Vertex.prototype.setNext = function(edgeNode){
  var temp = this.firstEdge;
  if(!temp){
    this.firstEdge = edgeNode;
    edgeNode.adjVex.in++;
    return;
  }else{
    while(temp){
      var temp1 = temp.next;
      if(!temp1){
        temp.next = edgeNode;
        edgeNode.adjVex.in++;
        break;
      }else{
        temp = temp.next;
      }
    }
  }
}
//边
function EdgeNode(){
  this.adjVex = arguments[0];
  this.weight = arguments[1] ? arguments[1] : undefined;
}
//图
function Graph(vertexs,numEdges){
  this.vertexs = vertexs;
  this.numVertexs = this.vertexs.length;
  this.numEdges =numEdges;
}
//需要引入栈进行计算
function Node(data) {
    this.data = data;
}
function Stack(maxSize){
    this.maxSize = maxSize;
    this.top = -1;
    this.data = new Array(maxSize);
}
Stack.prototype.push = function(node){
    if(this.top == this.maxSize-1){
        return 1;
    }
    this.top++;
    this.data[this.top] = node;
    return 0;
}
Stack.prototype.pop = function(){
    if(this.top==-1){
        return 1;
    }
    var r = this.data[this.top];
    this.data[this.top] = undefined;
    this.top--;
    return r;
}
Stack.prototype.ergodic = function(){
  var s = '';
  for (var i = 0; i < this.data.length; i++) {
    if(this.data[i]!=null){
        s += this.data[i]+',';
    }
  }
  if(s.length){
    s = s.substring(0,s.length-1);
  }
  return s;
}
Stack.prototype.length = function(){
  return this.top+1;
}
Graph.prototype.topologicalSort = function() {
  var top = 0,count = 0;
  var gettop,k;
  var result ='';//结果
  var stack = new Stack(this.numVertexs)
  for (var i = 0; i < this.numVertexs; i++) {
    if(this.vertexs[i].in==0){
      stack.push(i);
    }
  }
  console.info('初始化完毕（将入度为0的顶点入栈），当前堆栈'+stack.ergodic());
  while(stack.length()){
    console.info('当前栈：'+stack.ergodic());
    gettop = stack.pop();
    result += this.vertexs[gettop].name +' ';
    count++;
    console.info('剥离点'+this.vertexs[gettop].name);
    for (var e = this.vertexs[gettop].firstEdge; e; e=e.next) {
      k = this.vertexs.indexOf(e.adjVex);
      if(!(--this.vertexs[k].in)){
        console.info('发现'+this.vertexs[k].name+'入度仅仅为1，必须入栈剥离');
        stack.push(k);
      }
    }
  }
  if(count<this.numVertexs){
    console.info('发生错误，有环路存在');
    return false;
  }
  console.info(result);
  return true;
};
var v0 = new Vertex('v0');
var v1 = new Vertex('v1');
var v2 = new Vertex('v2');
var v3 = new Vertex('v3');
var v4 = new Vertex('v4');
var v5 = new Vertex('v5');
var v6 = new Vertex('v6');
var v7 = new Vertex('v7');
var v8 = new Vertex('v8');
var v9 = new Vertex('v9');
var v10 = new Vertex('v10');
var v11 = new Vertex('v11');
var v12 = new Vertex('v12');
var v13 = new Vertex('v13');
v0.setNext(new EdgeNode(v11));
v0.setNext(new EdgeNode(v5));
v0.setNext(new EdgeNode(v4));
v1.setNext(new EdgeNode(v8));
v1.setNext(new EdgeNode(v4));
v1.setNext(new EdgeNode(v2));
v2.setNext(new EdgeNode(v9));
v2.setNext(new EdgeNode(v6));
v2.setNext(new EdgeNode(v5));
v3.setNext(new EdgeNode(v13));
v3.setNext(new EdgeNode(v2));
v4.setNext(new EdgeNode(v7));
v5.setNext(new EdgeNode(v12));
v5.setNext(new EdgeNode(v8));
v6.setNext(new EdgeNode(v5));
v8.setNext(new EdgeNode(v7));
v9.setNext(new EdgeNode(v11));
v9.setNext(new EdgeNode(v10));
v10.setNext(new EdgeNode(v13));
v12.setNext(new EdgeNode(v9));
var g = new Graph([v0,v1,v2,v3,v4,v5,v6,v7,v8,v9,v10,v11,v12,v13],20);
g.topologicalSort();

// 作者：RichardW
// 链接：https://www.jianshu.com/p/8a2aa3a688e7
// 來源：简书
// 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
