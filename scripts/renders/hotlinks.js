import { get } from "../helpers/requests";


export async function renderHotLinks(place, searchPlace) {
	place.innerHTML = "";

	let created = [];
	const responce = await get(searchPlace);
	
	for (const item of responce.data) {
		if (created.includes(item.type)) continue;
		created.push(item.type);
		
		let li = document.createElement("li");
		let a = document.createElement("a");
		a.innerHTML = item.type.capitalize();
		a.href = "/pages/category/?type=" + item.type;
		place.append(li);
		li.append(a);
	}

}
