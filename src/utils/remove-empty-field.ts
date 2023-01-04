export const removeEmptyField = (obj: any) => {
	if (typeof obj === 'number') {
		return obj;
	}
	let newObj: {
		[key: string | number]: any,
	} = {};
	if (typeof obj === 'string') {
		obj = JSON.parse(obj);
	}
	if (obj instanceof Array) {
		newObj = [];
	}
	if (obj instanceof Object) {
		for (const attr in obj) {
			// 属性值不为'',null,undefined才加入新对象里面(去掉'',null,undefined)
			if (
				Object.prototype.hasOwnProperty.call(obj, attr)
				&& obj[attr] !== ''
				&& obj[attr] !== null
				&& obj[attr] !== undefined
			) {
				if (obj[attr] instanceof Object) {
					// 空数组或空对象不加入新对象(去掉[],{})
					if(JSON.stringify(obj[attr]) === '{}' || JSON.stringify(obj[attr]) === '[]') {
						continue;
					}
					// 属性值为对象,则递归执行去除方法
					newObj[attr] = removeEmptyField(obj[attr]);
				} else if (
					typeof obj[attr] === 'string' &&
          ((obj[attr].indexOf('{') > -1 && obj[attr].indexOf('}') > -1) ||
            (obj[attr].indexOf('[') > -1 && obj[attr].indexOf(']') > -1))
				) {
					// 属性值为JSON时
					try {
						const attrObj = JSON.parse(obj[attr]);
						if (attrObj instanceof Object) {
							newObj[attr] = removeEmptyField(attrObj);
						}
					} catch (e) {
						newObj[attr] = obj[attr];
					}
				} else {
					newObj[attr] = obj[attr];
				}
			}
		}
	}
	return newObj;
};
