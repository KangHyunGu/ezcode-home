const lib = {
	deepCopy(obj) {
		if (obj === null || typeof obj !== 'object') {
			return obj;
		}
		const result = Array.isArray(obj) ? [] : {};
		for (const key of Object.keys(obj)) {
			result[key] = lib.deepCopy(obj[key]);
		}
		return result;
	},
	modelCall: async (fn, ...args) => {
		try {
			const result = await fn(...args);
			return result;
		} catch (e) {
			console.trace(e);
			return { err: e.message }
		}
	},
	getIp(req) {
		return req.ip.replace('::ffff:', '');
	},
	findParentVm(vm, target) {
		let parent = vm.$parent;
		while (parent.$vnode) {
			// console.log(parent.$vnode.tag);
			if (parent.$vnode.tag.endsWith(target)) {
				return parent;
			}
			parent = parent.$parent;
		}
		return null;
	},
	getSummary(content, len = 300) {
		let text = content.replace(/(<([^>]+)>)/ig, "");
		if (text.length > len) {
			text = text.substr(0, len - 3) + "...";
		}
		return text;
	},
	filesize(x) {
		const s = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
		const e = Math.floor(Math.log(x) / Math.log(1024));
		return (x / Math.pow(1024, e)).toFixed(2) + " " + s[e];
	},
	getImage(table, item, imgSize) {
		// 본문에 업로드 된 이미지
		if (item.wrImgs.length) {
			return `/upload/${table}/${item.wrImgs[0].bf_src}?w=${imgSize.w}&h=${imgSize.h}`;
		}
		// 첨부파일에 업로드 된 이미지
		if (item.wrFiles.length) {
			for (const file of item.wrFiles) {
				if (file.bf_type.startsWith("image")) {
					return `/upload/${table}/${file.bf_src}?w=${imgSize.w}&h=${imgSize.h}`;
				}
			}
		}
		// URL 링크로 업로드 된 이미지
		// 정규표현식 검사 : regexr.com
		// 이미지 2개 있을 경우에도 패턴 검사 시 1개만 인식 됨...
		const pattern = /<img[^>]*src=\"([^\"]+)\"[^>]*>/;
		const matchs = item.wr_content.match(pattern);
		if (matchs) {
			return matchs[1];
		}
		// 없으면 기본이미지
		return "/img/noimage.png";
	},
}

module.exports = lib;