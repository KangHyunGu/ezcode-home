const rules = {
	require({label}) {
		return v => !!v || `[${label}] 필수 입력입니다.`;
	},
	min({label, len=3}){
		return v => !!v ? v.length >= len || `[${label}] ${len}자 이상 입력하세요.` : true;
	},
	alphaNum() {
		return v => !!v ? /^[a-zA-Z0-9]+$/.test(v) || `영어와 숫자만 입력하세요.` : true; 
	},
	pattern({label, pattern}) {
		return v => !!v ? pattern.test(v) || `[${label}] 형식에 맞게 입력하세요.` : true; 
	},
	matchValue(origin) {
		return v => origin === v || '비밀번호가 일치하지 않습니다.';
	},
	id(options) {
		const defaultOptions = {
			label : '아이디',
			len : 3,
			info : null,
			required : true,
		};
		const opt = Object.assign(defaultOptions, options);
		const arr = [];
		if(opt.required) {
			arr.push(rules.require(opt));
		}
		arr.push(rules.min(opt));
		return arr;
	},

	name(options) {
		const defaultOptions = {
			label : '이름',
			len : 2,
			info : null,
			required : true,
		};
		const opt = Object.assign(defaultOptions, options);
		const arr = [];
		if(opt.required) {
			arr.push(rules.require(opt));
		}
		arr.push(rules.min(opt));
		return arr;
	},
	password(options){
		const defaultOptions = {
			label : '비밀번호',
			info : null,
			required : true,
			len : 6,
			//정규표현식
			//(?=^.{6,}$) 6자 이상
			//(?=.*\d) 숫자 해당되어야 함
			//(?=.*[a-zA-z]) 문자 해당되어야 함
			pattern: /^.*(?=^.{6,}$)(?=.*\d)(?=.*[a-zA-z]).*/
		};
		const opt = Object.assign(defaultOptions, options);
		const arr = [];
		if(opt.required) {
			arr.push(rules.require(opt));
		}
		arr.push(rules.min(opt))
		arr.push(rules.pattern(opt));
		return arr;
	},
	email(options) {
		const defaultOptions = {
			label : '이메일',
			len : 3,
			info : null,
			required : true,
			pattern: /.+@.+\..+/
		};
		const opt = Object.assign(defaultOptions, options);
		const arr = [];
		if(opt.required) {
			arr.push(rules.require(opt));
		}
		arr.push(rules.pattern(opt));
		return arr;
	}
};

module.exports = rules;