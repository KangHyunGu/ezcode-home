const lib = {
	deepCopy(obj) {
		if(obj === null || typeof obj !== 'object') {
			return obj;
		}
		const result = Array.isArray(obj) ? [] : {};
		for(const key of Object.keys(obj)) {
			result[key] = lib.deepCopy(obj[key]);
		}
		return result;
	},
	//args 가변 인자를 받게 다는 의미
	modelCall : async (fn, ...args) => {
		try{
			const result = await fn(...args);
			return result;
		} catch(e) {
			console.trace(e)
			return { err : e.message}

		}
	},
	getIp(req) {
		return req.ip.replace('::ffff:', '');
	},
	findParentVm(vm, target) {
		let parent = vm.$parent;
		while(parent.$vnode) {
			if(parent.$vnode.tag.endsWith(target)) {
				return parent;
			}
			parent = parent.$parent;
		}
		return null;
	}
}

module.exports = lib;