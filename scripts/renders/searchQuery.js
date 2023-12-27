import { get } from "../helpers/requests";

export async function queryResults(query, place) {
	place.innerHTML = "";
	let response = await get("/goods");

	let resultItems = response.data.filter((item) => {
		return item.title.toLowerCase().includes(query.toLowerCase());
	});

	let resultTypes = response.data.map((item) =>
		item.type.toLowerCase().includes(query.toLowerCase())
			? item.type
			: undefined
	);
	resultTypes = resultTypes.filter(
		(item) => item !== undefined && item !== null
	);
	resultTypes = Array.from(new Set(resultTypes));

	if (query.length > 0) {
		for (let item of resultItems) {
			let li = document.createElement("li");
			li.classList.add("search-item", "item");
			li.innerHTML = item.title;
			place.append(li);

			li.onclick = () => {
				location.assign(`/pages/item/?id=${item.id}`);
			};
		}

		for (let item of resultTypes) {
			let li = document.createElement("li");
			li.classList.add("search-item", "type");
			li.innerHTML = item.capitalize();
			place.append(li);

			li.onclick = () => {
				location.assign(`/pages/category/?type=${item}`);
			};
		}

		const searchText = query;
		const regex = new RegExp(searchText, "gi");

		if (searchText.length === 0 || searchText === "") return;

		for (let div of place.querySelectorAll("li:not(.tupi_class)")) {
			let text = div.innerHTML;
			text = text.replace(/(<mark class="highlight">|<\/mark>)/gim, "");
			const newText = text.replace(regex, '<mark class="highlight">$&</mark>');
			div.innerHTML = newText;
		}
	} else {
		let popular = document.createElement("li");
		let popularText = document.createElement("h2");
		popular.classList.add("tupi_class");
		popularText.innerHTML = "Популярное";
		popular.append(popularText);
		place.prepend(popular);

		let ratedItems = response.data.filter((item) => {
			return item.rating > 5;
		});

		for (let item of ratedItems) {
			let li = document.createElement("li");
			li.classList.add("search-item", "popular");
			li.innerHTML = item.title;
			place.append(li);
			
			li.onclick = () => {
				location.assign(`/pages/item/?id=${item.id}`);
			}
		}
	}

	return place.innerHTML;
}
