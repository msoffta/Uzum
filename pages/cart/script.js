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
};
