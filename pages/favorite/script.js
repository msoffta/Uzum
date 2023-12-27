import { capitalize } from "../../scripts/helpers/prototypes";
import { getCart, getFavorite, getItems } from "../../scripts/helpers/utilites";
import { renderItems } from "../../scripts/renders/items";
import {
	loadMainEvents,
	makeFooter,
	makeHeader,
	makeModals,
} from "../../scripts/renders/required";

window.onload = async function () {
	String.prototype.capitalize = capitalize;

	makeHeader();
	makeModals();
	makeFooter();
	loadMainEvents();

	let favorites = getFavorite();
	let place = document.querySelector(".items .items-list");
	let cartPlace = document.querySelector(".cart .incart");
	let cart = getCart();

	let items = await getItems(favorites);
	if (favorites.length > 1) {
		renderItems(items, null, place, cartPlace, cart);

		let likes = document.querySelectorAll(".like");

		for (let like of likes) {
			like.onclick = () => {
				let liked = [...(JSON.parse(localStorage.getItem("liked")) || [])];
				liked = liked.filter((id) => id !== +like.dataset.id);
				localStorage.setItem("liked", JSON.stringify(liked));
				let item = like.parentElement.parentElement;
				item.remove();
			};
		}
	} else {
		let img = document.createElement("img");
		let message = document.createElement("p");
		let tip = document.createElement("span");

		img.src = "/public/images/hearts.png";
		img.alt = "no Liked";

		message.innerHTML = "Добавьте то, что понравилось";
		tip.innerHTML =
			"Перейдите на главную страницу и нажмите на ♡ в товаре<br />На главную";

		place.parentElement.classList.add("no-liked");
		place.parentElement.append(img, message, tip);
		console.log(place.parentElement);
	}
};
