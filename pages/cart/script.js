import { capitalize } from "../../scripts/helpers/prototypes";
import { loadMainEvents, makeFooter, makeHeader, makeModals } from "../../scripts/renders/required";

window.onload = function () {
	String.prototype.capitalize = capitalize;

	makeHeader();
	makeModals();
	makeFooter();
	loadMainEvents();
}