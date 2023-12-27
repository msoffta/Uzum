import Swiper from "swiper";
import "swiper/css/bundle";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { get } from "../helpers/requests";

export async function renderSwipers(place, query) {
	place.innerHTML = "";

	let response = await get(query);
	let limit = 10;

	for (let i = 0; i < limit; i++) {
		let item = response.data[i];
		let slide = document.createElement("div");
		let info = document.createElement("div");
		let title = document.createElement("h2");
		let costPlace = document.createElement("div");
		let description = document.createElement("p");
		let img = document.createElement("img");

		info.classList.add("info");
		title.classList.add("title");
		description.classList.add("description");
		costPlace.classList.add("cost-place");

		title.innerHTML = item.title;
		description.innerHTML =
			item.description.length > 500
				? `${item.description.slice(0, 500)}...`
				: item.description;

		if (item.salePercentage) {
			let original = document.createElement("span");
			let sale = document.createElement("span");

			original.classList.add("cost", "sale");
			sale.classList.add("cost");

			original.innerHTML = `${item.price.toLocaleString("en-US")} сум`;
			sale.innerHTML = `${(
				item.price -
				(item.price * item.salePercentage) / 100
			).toLocaleString("en-US")} сум`;

			costPlace.append(original, sale);
		} else {
			let cost = document.createElement("span");
			cost.classList.add("cost");

			cost.innerHTML = `${item.price.toLocaleString("en-US")} сум`;

			costPlace.append(cost);
		}

		slide.classList.add("swiper-slide");

		img.src = item.media[0];
		img.alt = item.title;

		info.append(title, costPlace, description);
		slide.append(info, img);
		place.append(slide);

		slide.onclick = () => {
			location.assign(`/pages/item/?id=${item.id}`);
		};
	}

	new Swiper(place.parentElement, {
		direction: "horizontal",
		modules: [Navigation, Pagination, Autoplay],

		navigation: {
			nextEl: ".swiper-button-next",
			prevEl: ".swiper-button-prev",
		},

		pagination: {
			el: ".swiper-pagination",
		},
		autoplay: {
			delay: 2500,
			disableOnInteraction: false,
		},

		loop: true,
	});
}

export async function renderSwiperImages(place, array, options) {
	place.innerHTML = "";
	
	if (options.modules) {
		options.modules = options.modules.map((item) => {
			if (item.toLowerCase() == Navigation.name.toLowerCase()) {
				return Navigation
			}

			if (item.toLowerCase() == Pagination.name.toLowerCase()) {
				return Pagination
			}
		})
	}

	let swiper = new Swiper(place.parentElement, {
		...options
	});

	let count = 0
	for (const item of array) {
		let slide = document.createElement("div");
		let img = document.createElement("img");
		
		slide.classList.add("swiper-slide");
		slide.dataset.index = count;
		img.src = item;
		
		slide.append(img);
		place.append(slide);
		swiper.update();
		count++;
	}

	return swiper
}
