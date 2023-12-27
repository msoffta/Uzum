export function renderPlaces(types) {
	let places = {};

	for (const type of types) {
		if (!places[type]) {
			let place = document.createElement("section");
			let wrap = document.createElement("wrap");
			let placeTitle = document.createElement("a");
			let placeArrowRightIcon = document.createElement("span");
			let placeItems = document.createElement("div");

			place.classList.add("place", type);
			wrap.classList.add("wrap");

			placeTitle.classList.add("place__title");
			placeTitle.innerHTML = type.capitalize();
			placeTitle.href = "/pages/category/?type=" + type;
			placeArrowRightIcon.classList.add("material-symbols-outlined");
			placeArrowRightIcon.innerHTML = "arrow_forward_ios";

			placeItems.classList.add("place__items");

			place.append(wrap);
			wrap.append(placeTitle, placeItems);
			placeTitle.append(placeArrowRightIcon);

			places[type] = placeItems;
			document.querySelector(".items").append(place);
		}
	}

	return places;
}
