import { capitalize } from "../../scripts/helpers/prototypes";
import { get } from "../../scripts/helpers/requests";
import { scrolClickEvent } from "../../scripts/helpers/swiperEvents";
import { announce, getFavorite } from "../../scripts/helpers/utilites";
import { renderCartPreview } from "../../scripts/renders/cartPreview";
import { renderAutoItems } from "../../scripts/renders/items";
import {
	makeHeader,
	makeFooter,
	makeModals,
	loadMainEvents,
} from "../../scripts/renders/required";
import { renderSwiperImages } from "../../scripts/renders/swipers";
let id = location.search.split("=").at(-1);
if (!id) location.assign("/");

window.onload = function () {
	String.prototype.capitalize = capitalize;
	makeHeader();
	makeModals();
	makeFooter();

	loadMainEvents();

	get(`/goods/${id}`).then((response) => {
		let item = response.data;
		let favorites = getFavorite();

		let favorite = document.querySelector(".addFavorite");
		let addCart = document.querySelector(".addCart");
		let counterMinus = document.querySelector(".counter__btn--minus");
		let counter = document.querySelector("#counter");
		let counterPlus = document.querySelector(".counter__btn--plus");
		if (favorites.includes(item.id)) {
			favorite.classList.add("danger");
			favorite.innerHTML = "Удалить из избранного";
		}

		document.title = item.title;
		document.querySelector("[data-title]").innerHTML = item.title;
		document.querySelector("[data-description]").innerHTML = item.description;
		document.querySelector("[data-rating]").innerHTML = item.rating;
		if (item.salePercentage) {
			document.querySelector("[data-cost__main]").innerHTML = `${(
				item.price -
				(item.price * item.salePercentage) / 100
			).toLocaleString("ru-RU")} сум`;

			document.querySelector(
				"[data-cost__sale]"
			).innerHTML = `${item.price.toLocaleString("ru-RU")} сум`;
		} else {
			document.querySelector(
				"[data-cost__main]"
			).innerHTML = `${item.price.toLocaleString("ru-RU")} сум`;
		}

		document.querySelector("[data-description__text]").innerHTML =
			item.description;

		let horizontal = renderSwiperImages(
			document.querySelector(".horizontalSwiper .swiper-wrapper"),
			item.media,
			{
				slidesPerView: 1,
				direction: "horizontal",
				loop: true,

				modules: ["navigation"],

				navigation: {
					nextEl: ".swiper-button-next",
					prevEl: ".swiper-button-prev",
				},
			}
		);

		let vertical = renderSwiperImages(
			document.querySelector(".verticalSwiper .swiper-wrapper"),
			item.media,
			{
				slidesPerView: 4,
				spaceBetween: 10,
				direction: "vertical",
			}
		);

		let cartModal = document.querySelector(".modal__cart");
		let cartList = cartModal.querySelector(".incart");
		let cartButton = document.querySelector(".cart");
		renderAutoItems(
			`/goods?type=${item.type}`,
			{ furniture: document.querySelector(".sameItems .place__items") },
			cartButton,
			cartList
		);
		scrolClickEvent(vertical, horizontal);

		counterMinus.onclick = () => {
			if (counter.value > 1) {
				counter.value--;
			} else {
				counter.value = 1;
			}
		};

		counterPlus.onclick = () => {
			if (counter.value < 100) {
				counter.value++;
			} else {
				counter.value = 100;
			}
		};

		counter.oninput = () => {
			if (counter.value < 1) {
				counter.value = 1;
			} else if (counter.value > 100) {
				counter.value = 100;
			}
		};

		addCart.onclick = () => {
			let cart = JSON.parse(localStorage.getItem("cart")) || [];

			if (cart.some((el) => el.itemId === item.id)) {
				let index = cart.findIndex((el) => el.itemId === item.id);
				cart[index].count = parseInt(
					parseInt(cart[index].count) +
						parseInt(counter.value ? counter.value : 1)
				);
			} else {
				cart.push({
					itemId: item.id,
					count: counter.value ? counter.value : 1,
				});
				let cartBlock = document.querySelector(".cart");
				cartBlock.dataset.elems = cart.length;
			}

			localStorage.setItem("cart", JSON.stringify(cart));

			announce({ itemName: item.title, itemImg: item.media[0] });
			renderCartPreview(cart, cartList, cartButton);
		};

		favorite.onclick = () => {
			if (favorite.classList.contains("danger")) {
				favorite.classList.remove("danger");
				favorite.innerHTML = "Добавить в избранное";
				favorites = favorites.filter((el) => el !== item.id);
				localStorage.setItem("liked", JSON.stringify(favorites));
			} else {
				favorite.classList.add("danger");
				favorite.innerHTML = "Удалить из избранного";
				favorites.push(item.id);
				localStorage.setItem("liked", JSON.stringify(favorites));
			}
		};
	});
};
