// Provinces, cities and counties

export function formatWheelsData(data){
	const provinces = [];
	const cities = [];
	const counties = [];
    
	for (const key in data) {
		if (data.hasOwnProperty(key)) {
			const items = data[key];
			for (const el in items) {
				if (items.hasOwnProperty(el)) {
					const element = items[el];
					if (el.length === 2) {
						provinces.push({
							id: el,
							value: element,
							childs: []
						});
					}
					if (el.length === 4) {
						cities.push({
							id: el,
							value: element,
							childs: []
						});
					}
					if (el.length === 6) {
						counties.push({
							id: el,
							value: element
						});
					}
				}
			}
		}
	}
    
	for (let indexP = 0; indexP < provinces.length; indexP++) {
		const elementP = provinces[indexP];
		const elementPChild = elementP.childs;
	    for (let indexCi = 0; indexCi < cities.length; indexCi++) {
			const elementCi = cities[indexCi];
			const elementCiChild = elementCi.childs;
			if (elementP.id === elementCi.id.slice(0, 2)) {
				elementPChild.push(elementCi);
				for (let indexC = 0; indexC < counties.length; indexC++) {
					const elementC = counties[indexC];
					if (elementCi.id === elementC.id.slice(0, 4)) {
						elementCiChild.push(elementC);
					}
				}
			}
	    }
        
	}

	return provinces;
}

export function getPositionByDefaultValue(defaultData, wheels){
	const defaultValue = defaultData || [];
	if (!Array.isArray(defaultValue) || defaultValue.length < 1) {
		return;
	}
	const data = wheels[0].data;
	const position = [];
	for (let indexP = 0; indexP < data.length; indexP++) {
		const elementP = data[indexP];
		const elementPChilds = elementP.childs;
		if (defaultValue[0] === elementP.id) {
			position.push(indexP);
		}
		for (let indexCi = 0; indexCi < elementPChilds.length; indexCi++) {
			const elementCi = elementPChilds[indexCi];
			const elementCiChilds = elementCi.childs;
			if (defaultValue[1] === elementCi.id) {
				position.push(indexCi);
			}
			for (let indexC = 0; indexC < elementCiChilds.length; indexC++) {
				const elementC = elementCiChilds[indexC];
				if (defaultValue[2] === elementC.id) {
					position.push(indexC);
					break;
				}
			}
		}
	}
	return position;
}
