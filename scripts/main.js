import AOS from "aos";
import "aos/dist/aos.css"; // Import the AOS CSS file
import { renderAutoItems } from "./renders/items";
import { capitalize } from "./helpers/prototypes";
import { renderSwipers } from "./renders/swipers";
import {
	loadMainEvents,
	makeFooter,
	makeHeader,
	makeModals,
} from "./renders/required";
window.onload = () => {
	AOS.init({});
	String.prototype.capitalize = capitalize;

	makeHeader();
	makeFooter();
	makeModals();
	loadMainEvents();

	let swiperPlace = document.querySelector(".main-swiper .swiper-wrapper");

	let cartModal = document.querySelector(".modal__cart");
	let cartList = cartModal.querySelector(".incart");
	let cartButton = document.querySelector(".cart");

	renderAutoItems("/goods", null, cartButton, cartList);
	renderSwipers(swiperPlace, "/goods");
};
