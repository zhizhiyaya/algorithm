// 原始数据

const data = [
    {
       id: 10002,
       content: '该评论已删除',
       author: '小B',
       createAt: 1618389235,
       replyId: 0,
       status: 1
    },
    {
       id: 10007,
       content: '该评论已删除',
       author: '小7',
       createAt: 1618389335,
       replyId: 10006,
       status: 1
    },
    {
       id: 10006,
       content: '该评论已删除',
       author: '小6',
       createAt: 1618389235,
       replyId: 10002,
       status: 1
    },
    {
       id: 10004,
       content: '哈哈我也是',
       author: '小D',
       createAt: 1618389535,
       replyId: 10005,
       status: 0
    },
    {
       id: 10005,
       content: '的确不错，有学习到',
       author: '小C',
       createAt: 1618389335,
       replyId: 10002,
       status: 0
    },
    {
       id: 10001,
       content: '这写的真好，我也要学习',
       author: '小F',
       createAt: 1618389035,
       replyId: 0,
       status: 0
    },
    {
      
       id: 10003,
       content: '这写的真好，我也要学习到了一些东西真的是很干货啊',
       author: '小A',
       createAt: 1618389335,
       replyId: 0,
       status: 0
    },
]

function buildTree(list) {
  var res = [];
  for (var i = list.length; i--; ) {
    if (list[i].replyId === 0) {
      list[i].children = getChildren(list, list[i].id);
      res.push(list[i]);
    }
  }
  
  console.log((JSON.stringify(res, null, '    ')));
  
  return list;
}

function getChildren(list, rootId) {
  var children = [];
  for (var i = list.length; i--; ) {
    if (list[i].replyId === rootId) {
      list[i].isDel = list[i].status === 1;
      children.push(list[i]);
      list[i].children = getChildren(list, list[i].id);
      list[i].isDel = list[i].children.length > 0 ? !(list[i].children.some(i => !i.isDel || i.status === 0)) : list[i].isDel;
    }
  }
  return children;
}

// function filterDel(list) {
//   for (var i = list.length; i--; ) {
//     if (list[i].status === 0) {
      
//     } else if (list[i].status === 1) {
      
      
//     }
//     if (list[i].replyId === rootId) {
//       children.push(list[i]);
//       list[i].children = getChildren(list, list[i].id);
//     }
//   }
//   return children;
// }

buildTree(data);

