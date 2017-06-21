/**
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function(height) {
	int res=0;
	int n = h.size();
	int l=0,r=n-1;
	while(l<r) {
		res=max(res,min(h[l],h[r])*(r-l));
		if (h[l]<h[r]) {
			int k=l;
			while(k<r&&h[k]<=h[l])
			k++;
			l=k;
		} else {
			int k=r;
			while(k>l&&h[k]<=h[r])
			k--;
			r=k;
		}
	}
	return res;
};
console.log(maxArea([1, 1]));
