import { capitalize } from "../../scripts/helpers/prototypes";
import { getCart, updateOfferInfo } from "../../scripts/helpers/utilites";
import { renderCart } from "../../scripts/renders/cartPreview";
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

	let cart = getCart();
	let itemPlace = document.querySelector(".items");
	let result = await renderCart(cart, itemPlace);
	let allSelector = document.querySelector("#allselect");
	
	console.log(cart.length);
	if (cart.length > 0) {
		updateOfferInfo(result, cart);
		allSelector.oninput = () => {
			document.querySelectorAll(".custom-checkbox__input").forEach((elem) => {
				if (allSelector.checked) {
					elem.checked = true;
				} else {
					elem.checked = false;
				}
			});
		}
	} else {
		let img = document.createElement("img");
		let message = document.createElement("p");
		let tip = document.createElement("span");
		let place = document.querySelector('main')

		img.src = "/images/hearts.png";
		img.alt = "no Liked";

		message.innerHTML = "Добавьте то, что понравилось";
		tip.innerHTML =
			"Перейдите на главную страницу и нажмите на ♡ в товаре<br />На главную";

		place.classList.add("no-cart");
		place.innerHTML = "";
		place.append(img, message, tip);
		console.log(place);
	}

};
