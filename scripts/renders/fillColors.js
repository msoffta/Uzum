export function fillColors(colors, place) {
	place.innerHTML = "";

	let li = document.createElement("li");
	let input = document.createElement("input");
	let label = document.createElement("label");

	input.name = "color";
	input.type = "checkbox";
	input.value = "all";
	input.id = "all";
	li.classList.add("color");
	li.dataset.color = "all";
	li.style.setProperty("--color", "url(/public/images/color-wheel.png)");
	label.innerHTML = "Все цвета";
	label.htmlFor = "all";

	li.append(input, label);
	place.append(li);

	for (const color of colors) {
		let li = document.createElement("li");
		let input = document.createElement("input");
		let label = document.createElement("label");

		input.name = "color";
		input.type = "checkbox";
		input.value = color;
		input.id = color;
		li.classList.add("color");
		li.dataset.color = color;
		li.style.setProperty("--color", color);
		label.htmlFor = color;
		label.innerHTML = color.capitalize();

		li.append(input, label);
		place.append(li);
	}
}
