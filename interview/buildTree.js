// 实现数组转树方法
function arrToTree(arr) {
    const root = arr.find(i => !i.parentId);
    let output = {};
    if (root) {
        root.children = addChild(root, arr);
        output = { ...root };
    }
    return output;
} 
  
function addChild(node, arr) {
    node.isVisit = true;
    return arr.filter(i => {
        if (i.parentId === node.id) {
            !i.isVisit && (i.children = addChild(i, arr));
            return true;
        }
        return false;
    })
}
    
// 输入
let input = [
    {
        id: 1, val: '学校', parentId: null
    }, {
        id: 2, val: '班级1', parentId: 1
    }, {
        id: 3, val: '班级2', parentId: 1
    }, {
        id: 4, val: '学生1', parentId: 2
    }, {
        id: 5, val: '学生2', parentId: 3
    }, {
        id: 6, val: '学生3', parentId: 3
    },
]
// 输出
let output = {
    id: 1,
    val: '学校',
    children: [{
        id: 2,
        val: '班级1',
        children: [
            {
                id: 4,
                val: '学生1',
                children: []
            },
            {
                id: 5,
                val: '学生2',
                children: []
            }
        ]
    }, {
        id: 3,
        val: '班级2',
        children: [{
            id: 6,
            val: '学生3',
            children: []
        }]
    }]
};  
  
console.log(arrToTree(input));
