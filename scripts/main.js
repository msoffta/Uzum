import AOS from "aos";
import "aos/dist/aos.css"; // Import the AOS CSS file
import { renderHotLinks } from "./renders/hotlinks";
import { renderAutoItems } from "./renders/items";
import { capitalize } from "./helpers/prototypes";

window.onload = () => {
	AOS.init({});

	String.prototype.capitalize = capitalize;

	let hotPlace = document.querySelector(".menu-list");

	renderHotLinks(hotPlace, "/goods");
	renderAutoItems("/goods");
};
