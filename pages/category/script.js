import { capitalize } from "../../scripts/helpers/prototypes";
import { get } from "../../scripts/helpers/requests";
import { getColors, saveLocal } from "../../scripts/helpers/utilites";
import { fillColors } from "../../scripts/renders/fillColors";
import { renderItems } from "../../scripts/renders/items";
import {
	loadMainEvents,
	makeFooter,
	makeHeader,
	makeModals,
} from "../../scripts/renders/required";

window.onload = function () {
	let type = location.search.split("=").at(-1);
	if (!type) return;

	String.prototype.capitalize = capitalize;
	document.title = type.capitalize();

	makeHeader();
	makeModals();
	makeFooter();
	loadMainEvents();

	get(`/goods?type=${type}`).then((resource) => {
		let filtersSaved = JSON.parse(localStorage.getItem("filters")) || null;
		let filters = {
			color: "all",
			sortBy: "",
			price: {
				from: 1000,
				to: 50000000,
			},
			defaultPrice: {
				from: 1000,
				to: 50000000,
			},
		};

		if (filtersSaved) {
			filters = filtersSaved;
		} else {
			saveLocal("filters", filters);
		}

		let itemsPlace = document.querySelector(".items");
		let cart = JSON.parse(localStorage.getItem("cart")) || [];
		let cartPlace = document.querySelector(".cart .incart");

		let fromPrice = document.querySelector("#sel-from__price");
		let toPrice = document.querySelector("#sel-to__price");

		let colorWrapper = document.querySelector(".colors .sel__list");
		let colors = getColors(resource.data);
		fillColors(colors, colorWrapper);

		let sortByButton = document.querySelector(".sortby .dropdown");
		let sortOptions = document.querySelectorAll(
			".sortby .dropdown_options ul li"
		);

		let colorInputs = colorWrapper.querySelectorAll("input");

		let clearButton = document.querySelector(".reset");

		renderItems(resource.data, filters, itemsPlace, cartPlace, cart);

		fromPrice.value = filters.price.from;
		toPrice.value = filters.price.to;

		colorWrapper.querySelectorAll("input").forEach((input) => {
			if (input.value === filters.color) {
				input.checked = true;
			}
		});

		sortOptions.forEach((option) => {
			if (option.dataset.sort === filters.sortBy) {
				sortByButton.children[0].innerHTML = option.children[0].innerHTML;
				option.classList.add("active");
			}
		});

		fromPrice.oninput = function () {
			if (+this.value > filters.defaultPrice.to) {
				this.value = filters.defaultPrice.to;
			}

			if (+this.value > toPrice.value) {
				console.log("omg");
				toPrice.value = this.value;
				filters.price.to = this.value;
			}

			setTimeout(() => {
				if (+this.value < filters.defaultPrice.from) {
					this.value = filters.defaultPrice.from;
				}
				filters.price.from = this.value;
				saveLocal("filters", filters);
				renderItems(resource.data, filters, itemsPlace, cartPlace, cart);
			}, 1000);
		};

		toPrice.oninput = function () {
			if (+this.value < filters.defaultPrice.from) {
				this.value = filters.defaultPrice.from;
			}

			if (+this.value > filters.defaultPrice.to) {
				this.value = filters.defaultPrice.to;
			}

			if (+this.value < fromPrice.value) {
				fromPrice.value = this.value;
				filters.price.from = this.value;
			}

			filters.price.to = this.value;
			saveLocal("filters", filters);
			renderItems(resource.data, filters, itemsPlace, cartPlace, cart);
		};

		colorInputs.forEach((input) => {
			input.oninput = function () {
				colorInputs.forEach((input) => {
					input.checked = false;
				});
				this.checked = true;
				filters.color = this.value;
				saveLocal("filters", filters);
				renderItems(resource.data, filters, itemsPlace, cartPlace, cart);
			};
		});

		sortByButton.onclick = function () {
			this.classList.toggle("active");
		};

		sortOptions.forEach((option) => {
			option.innerHTML =
				option.innerHTML +
				`<svg width="24" height="24" viewBox="0 0 20 20" fill="black" xmlns="http://www.w3.org/2000/svg">
  					<path fill-rule="evenodd" clip-rule="evenodd" d="M16.7822 5.21772C17.0751 5.51061 17.0751 5.98548 16.7822 6.27838L8.03024 15.0303C7.73735 15.3232 7.26248 15.3232 6.96958 15.0303L3.21766 11.2784C2.92476 10.9855 2.92476 10.5107 3.21765 10.2178C3.51055 9.92488 3.98542 9.92487 4.27831 10.2178L7.49991 13.4393L15.7215 5.21772C16.0144 4.92482 16.4893 4.92482 16.7822 5.21772Z"></path>
				</svg>`;
			option.onclick = function () {
				sortOptions.forEach((option) => option.classList.remove("active"));
				this.classList.add("active");
				sortByButton.children[0].innerHTML = this.children[0].innerHTML;
				sortByButton.dataset.sort = this.dataset.sort;
				filters.sortBy = this.dataset.sort;
				saveLocal("filters", filters);
				renderItems(resource.data, filters, itemsPlace, cartPlace, cart);
			};
		});

		clearButton.onclick = function () {
			let clearFilter = {
				color: "all",
				sortBy: sortOptions[0].dataset.sort,
				price: {
					from: 1000,
					to: 50000000,
				},
				defaultPrice: {
					from: 1000,
					to: 50000000,
				},
			};

			filters = clearFilter;

			colorWrapper
				.querySelectorAll("input:not([value='all'])")
				.forEach((input) => {
					input.checked = false;
				});

			fromPrice.value = filters.defaultPrice.from;
			toPrice.value = filters.defaultPrice.to;

			sortByButton.children[0].innerHTML = sortOptions[0].children[0].innerHTML;
			sortByButton.dataset.sort = sortOptions[0].dataset.sort;
			sortOptions.forEach((option) => option.classList.remove("active"));
			sortOptions[0].classList.add("active");

			saveLocal("filters", filters);
			console.log(filters);
			renderItems(resource.data, filters, itemsPlace, cartPlace, cart);
		};
	});
};
