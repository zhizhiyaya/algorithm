var nodeList = [
	{
		id: 0,
		link: [1, 2, 3]
	}, {
		id: 1,
		link: [0, 3, 4]
	}, {
		id: 2,
		link: [0, 6]
	}, {
		id: 3,
		link: [0, 1, 5]
	}, {
		id: 4,
		link: [1]
	}, {
		id: 5,
		link: [3]
	}, {
		id: 6,
		link: [2]
	}
];

var ret = [];
var travMap = [];
var len = nodeList.length;
function nodeDepth(node, depth) {
	console.log(depth);
	if (depth < 0 || travMap.indexOf(node.id) > -1) {
		return ;
	}

	if (depth === 0) {
		ret.push(node.id);
		return ;
	} else {
		travMap.push(node.id);
		var link = node.link;
		if (link) {
			var len = link.length;
			for (let i = 0; i < len; i++) {
				console.log(link[i]);
				const noTravCurItem = travMap.indexOf(link[i]) === -1;
				if (depth === 1 && noTravCurItem) {
					ret.push(link[i].id);
					return ;
				} else {
					return nodeDepth(nodeList[link[i]], --depth);
				}
			}
		}
	}
}
function getNodeForDepth(start, depth) {
	nodeDepth(nodeList[start], depth);

	// nodeList.forEach(i => {
	// 	if (i.id === start && !i.isTrav) {
	// 		if (depth === 0) {
	// 			debugger
	// 			ret.push(start);
	// 			return start;
	// 		} else {
	// 			return getNodeForDepth(i.id, --depth);
	// 		}
	// 	}
	// 	i.isTrav = true;
	// })
}
//  depth 0 开始
console.log(getNodeForDepth(0, 2), ret);

// function a() {
// 	var a = [1, 2, 3];
// 	// a.forEach(i=>{
// 	// 	if (i ===1) {
// 	// 		return i;
// 	// 	}
// 	// })
// 	for (var i = 0; i < a.length; i++) {
// 		if (i === 0) {
// 			return i;
// 		}
// 		console.log(i);
// 	}
// 	return 11111;
// }
