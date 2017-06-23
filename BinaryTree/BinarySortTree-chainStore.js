/**
 * 每个节点的数据结构
 **/
class Node {

    constructor(data, left, right, parent) {
        this.data = data;
        this.left = left || null;
        this.right = right || null;
        this.parent = parent || null;
    }

    isLeaf() {

        return this.left === null && this.right === null;
    }
}

class BinarySortTree {

    constructor(root) {
        this.root = null;
        this.size = root ? 1 : 0;
    }

    // 将 list 创建为有序二叉树（insert 递归）
    createOrderBT(list) {
        let i = list.length - 1;
        for(; i >= 0; i--) {
            var curNode = new Node(list[i]);
            if (this.root) {
                this.insertNode(this.root, curNode);
            } else {
                this.root = curNode;
            }
        }
    }

    // 非递归创建二叉树
    createBT(list) {

    }

    // 新插入的节点均作为叶子节点插入
    insertNode(curNode, newNode) {
        if (newNode.data < curNode.data ) { // 小于等于放左边
            if (!curNode.left) {
                curNode.left = newNode;
                newNode.parent = curNode;
            } else {
                this.insertNode(curNode.left, newNode);
            }
        } else { // 大于放右边
            if (!curNode.right) {
                curNode.right = newNode;
                newNode.parent = curNode;
            } else {
                this.insertNode(curNode.right, newNode);
            }
        }
    }

    insert(data) {
        const node = new Node(data);
        this.insertNode(this.root, node);
    }

    // 查找到相同 data 的节点将其删除，return true, 否则 return false
    // 1、有左子树， （ 有无右子树）
    // 2、无左子树，有右子树
    // 3、无论如何 将该节点置为 null, 断绝和其他节点的任何关系，同时便于垃圾回收
    // TODO searchNode undefined
    delete(data) {

        if (this.root) {
            debugger
            const searchNode = this.search(data);
            let {target, isRight} = searchNode || {};
            if (target) {
                let {left, right, parent} = target;
                const nodeType = isRight ? 'right' : 'left';
                if(left) { // 有左子树
                    left.parent = parent;
                    parent[nodeType] = left;
                    if (right) {
                        this.insertNode(left, right);
                    }
                } else if (right) { // 无左子树 有右子树
                    parent[nodeType] = right;
                }
                target = null;
                return true;
            }
        }
        return false;
    }

    search(data, curNode, isRight) {
        curNode = curNode || this.root;
        if (curNode.data === data) {
            return {
                isRight: !!isRight,
                target: curNode
            };
        } else if (curNode.data < data) {
            return curNode.left ? this.search(data, curNode.left, false) : null;
        } else {
            return curNode.right ? this.search(data, curNode.right, true) : null;
        }
    }

    // 访问当前节点
    visit(curNode) {
        console.log(curNode.data);
    }

    // 前序遍历, 根 左右
    // preOrderTraverse(curNode) {
    //     if (curNode) {
    //         this.visit(curNode);
    //         this.preOrderTraverse(curNode.left);
    //         this.preOrderTraverse(curNode.right);
    //     }
    // }

    // 前序非递归
    preOrderTraverse() {
        let root = this.root;

        if(root) {
            let stack = new Stack();
            while(root || !stack.isEmpty()) {
                while (root) {
                    this.visit(root);
                    stack.push(root);
                    root = root.left;
                }
                if (!stack.isEmpty()) {
                    root = stack.pop();
                    root = root.right;
                }
            }
        }
    }

    // 中序遍历，左 根 右
    // 中序遍历的结果是有序的
    // inOrderTraverse(curNode) {
    //     if (curNode) {
    //         this.inOrderTraverse(curNode.left);
    //         this.visit(curNode);
    //         this.inOrderTraverse(curNode.right);
    //     }
    // }

    // 中序非递归
    inOrderTraverse() {
        let root = this.root;

        if(root) {
            let stack = new Stack();
            while(root || !stack.isEmpty()) {
                while (root) {
                    stack.push(root);
                    root = root.left;
                }
                if (!stack.isEmpty()) {
                    root = stack.pop();
                    this.visit(root);
                    root = root.right;
                }
            }
        }
    }

    // 后序遍历， 左右 根
    postOrderTraverse(curNode) {
        if (curNode) {
            this.postOrderTraverse(curNode.left);
            this.postOrderTraverse(curNode.right);
            this.visit(curNode);
        }
    }

    // 后序非递归
    // 1. 栈s初始化;
    // 2. 循环直到root为空且栈s为空
    //  2.1 当root非空时循环
    //      2.1.1 将root连同标志flag=1 入栈;
    //      2.1.2 继续遍历root的左子树;
    //  2.2 当栈s 非空且栈顶元素的标志为2 时,出栈并输出栈顶结点;
    //  2.3 若栈非空,将栈顶元素的标志改为2,准备遍历栈顶结点的右子树
    // postOrderTraverse() {
    //     let root = this.root;
    //
    // }

    getMin() {

    }

    getMax() {

    }
}



class Stack {
    constructor() {
        this.stack = [];
    }
    push(v) {
        this.stack.push(v);
    }
    pop() {
        return this.stack.pop();
    }
    isEmpty() {
        return this.stack.length <= 0;
    }
}


var bt = new BinarySortTree();
bt.createOrderBT([8, 9, 1, 3, 10, 2, 19]);
// bt.inOrderTraverse(bt.root);
// bt.postOrderTraverse(bt.root);

// bt.preOrderTraverse();
// bt.inOrderTraverse();
// bt.postOrderTraverse();
