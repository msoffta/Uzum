export function fillColors(colors, place) {
	place.innerHTML = "";

	let li = document.createElement("li");
	let input = document.createElement("input");
	let span = document.createElement("span");

	input.name = "color";
	input.type = "radio";
	input.value = "all";
	li.classList.add("color");
	li.dataset.color = "all";
	li.style.setProperty("--color", "all");
	span.innerHTML = "Все цвета";

	li.append(input, span);
	place.append(li);

	for (const color of colors) {
		let li = document.createElement("li");
		let input = document.createElement("input");
		let span = document.createElement("span");

		input.name = "color";
		input.type = "radio";
		input.value = color;
		li.classList.add("color");
		li.dataset.color = color;
		li.style.setProperty("--color", color);
		span.innerHTML = color.capitalize();

		li.append(input, span);
		place.append(li);
	}
}
