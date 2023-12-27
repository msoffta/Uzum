import { get } from "../helpers/requests.js";
export async function renderCatalogMenu(place, query) {
	place.innerHTML = "";

	let response = await get(query);
	let types = {};
	let done = [];

	for (const item of response.data) {
		if (!types[item.type.toLowerCase()]) {
			types[item.type.toLowerCase()] = { count: 1 };
		} else {
			types[item.type.toLowerCase()].count++;
		}
	}
	
	for (const item of response.data) {
		if (done.includes(item.type)) continue;
		done.push(item.type);
		let li = document.createElement("li");
		let a = document.createElement("a");

		li.classList.add("catalog-menu__item");
		li.dataset.elems = `${types[item.type.toLowerCase()].count} товаров`; //types[item.type.toLowerCase()].count;
		a.innerHTML = item.type.capitalize();
		a.href = "/pages/category/?type=" + item.type;
		place.append(li);
		li.append(a);
	}
}
