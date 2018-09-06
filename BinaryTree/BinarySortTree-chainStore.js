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
    // TODO target undefined
    delete(data) {debugger
        if (this.root) {
            let target = this.search(data);
            if (target) {
                let {left, right, parent} = target;
                const nodeType = parent.data <= target.data ? 'right' : 'left';
                if(left) { // 有左子树
                    left.parent = parent;
                    parent[nodeType] = left;
                    if (right) {
                        const childRight = left.right;
                        if (childRight) {
                             do {
                                if (childRight.right) {
                                    childRight = childRight.right;
                                } else {
                                    break;
                                }
                            } while (childRight)
                        } else {
                            left.right = right;
                        }
                    }
                } else if (right) { // 无左子树 有右子树
                    parent[nodeType] = right;
                }
                target = null;
                return true;
            }
            return false;
        }
        return false;
    }

    search(data, curNode, isRight) {
        let root = this.root;
        while (root) {
            if (data > root.data) {
                root = root.right;
            } else if(data < root.data) {
                root = root.left;
            } else {
                break;
            }
        }
        return root;
    }

    // 访问当前节点
    visit(curNode) {
        console.log(curNode.data);
    }

    // 前序递归遍历, 根 左右
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
            let stack = [];
            while(root || stack.length) {
                while (root) {
                    this.visit(root);
                    stack.push(root);
                    root = root.left;
                }
                if (stack.length) {
                    root = stack.pop();
                    root = root.right;
                }
            }
        }
    }

    // 中序递归遍历，左 根 右
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
            let stack = [];
            while (root || stack.length > 0) {
                if(root) {
                    stack.push(root);
                    root = root.left;
                } else {
                    root = stack.pop();
                    this.visit(root);
                    root = root.right;
                }
            }
        }
    }

    // 后序递归遍历， 左右 根
    // postOrderTraverse(curNode) {
    //     if (curNode) {
    //         this.postOrderTraverse(curNode.left);
    //         this.postOrderTraverse(curNode.right);
    //         this.visit(curNode);
    //     }
    // }

    // 后序非递归
    // 1. 栈s初始化;
    // 2. 循环直到root为空且栈s为空
    //  2.1 当root非空时循环
    //      2.1.1 将root连同标志flag=1 入栈;
    //      2.1.2 继续遍历root的左子树;
    //  2.2 当栈s非空，且栈顶元素被访问过右子树（标志为2） 时,出栈并输出栈顶结点;
    //  2.3 若栈非空,将栈顶元素的标志改为2,准备遍历栈顶结点的 右子树
    postOrderTraverse() {
        let root = this.root;
        if(root) {
            let stack = [];
            let flagStack = [];
            while(root || stack.length) {

                while (root && !root.flag) { // 直到无左子树
                    // root.flag = 1;
                    flagStack.push(1);
                    stack.push(root);
                    if (root.left) {
                        root = root.left;
                    } else {
                        break;
                    }
                }

                // 遍历父节点，以当前节点为根的二叉树的后序的最后一个节点
                if (stack.length && flagStack[flagStack.length - 1] === 2) {
                    root = stack.pop();
                    flagStack.pop();
                    this.visit(root);
                    root = stack[stack.length - 1];
                }

                if (stack.length) {
                    // 设置标记 为 遍历该子树的右子树
                    flagStack[flagStack.length - 1] = 2;
                    if (root.right) {
                        root = root.right;
                    }
                }
            }
        }
    }

    //深度优先遍历
    depthFirstSearch() {
        var stack = [];
        stack.push(this.root);
        var node = null;
        while(stack.length) {
            node = stack.pop();
            this.visit(node);
            if(node.right) {
                stack.push(node.right);  //先将右子树压栈
            }
            if(node.left) {
                stack.push(node.left);  //再将左子树压栈
            }
        }
    }
    //广度优先遍历
    breadthFirstSearch() {
        var queue = [];
        queue.push(this.root);
        var node = null;
        while(queue.length) {
            node = queue.shift();
            this.visit(node);
            if(node.left) {
                queue.push(node.left);  //先将左子树入队
            }
            if(node.right) {
                queue.push(node.right); //再将右子树入队
            }
        }
    }

    getMin() {
        let root = this.root;
        root = root.left ? root.left : root;
        while (root) {
            if (root.left) {
                root = root.left;
            } else {
                break;
            }
        }
        return root ? root.data : 'no data';
    }

    getMax() {
        let root = this.root;
        while (root) {
            if (root.right) {
                root = root.right;
            } else {
                break;
            }
        }
        return root ? root.data : 'no data';
    }
}

var bt = new BinarySortTree();
bt.createOrderBT([8, 9, 1, 3, 10, 2, 19]);
// bt.inOrderTraverse(bt.root);
// bt.postOrderTraverse(bt.root); // 1 8 9 3 10 2 19

// bt.preOrderTraverse();
// bt.inOrderTraverse();
// bt.depthFirstSearch();
bt.breadthFirstSearch(); // 19 2 1 10 3 9 8
// bt.postOrderTraverse(); // 1 8 9 3 10 2 19
