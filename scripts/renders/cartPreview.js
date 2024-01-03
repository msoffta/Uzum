import { get } from "../helpers/requests";
import { getCart, updateOfferInfo } from "../helpers/utilites";
import { parseCart } from "./checkCart";

export async function renderCartPreview(cartArray, place, cardButton) {
	if (!cartArray) return;
	if (!place) return;

	place.innerHTML = "";

	for (const id of cartArray) {
		let item = await get(`/goods/${id.itemId}`);
		let li = document.createElement("li");
		let a = document.createElement("a");
		let wrapper = document.createElement("div");
		let img = document.createElement("img");
		let info = document.createElement("div");
		let title = document.createElement("p");
		let cost = document.createElement("span");
		let delete_btn = document.createElement("button");

		li.classList.add("cart-preview__item");
		a.href = `/pages/item/?id=${id.itemId}`;

		wrapper.classList.add("inbox");
		img.classList.add("wrapper__img");
		info.classList.add("info");
		title.classList.add("title");
		cost.classList.add("cost");
		delete_btn.classList.add("delete");

		img.src = item.data.media[0];
		title.innerHTML = item.data.title;
		cost.innerHTML = item.data.price;

		if (item.data.salePercentage) {
			cost.innerHTML = `${
				item.data.price - (item.data.price * item.data.salePercentage) / 100
			} ₽`;
		}

		if (id.count > 1) {
			cost.dataset.elems = `x${id.count}`;
		}

		delete_btn.innerHTML = `<svg data-v-11fce24d="" xmlns="http://www.w3.org/2000/svg" width="16" height="24" viewBox="0 0 24 24" fill="CurrentColor" class="ui-icon">
  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path>
  <path fill="none" d="M0 0h24v24H0z"></path>
</svg>`;

		info.append(title, cost, delete_btn);
		wrapper.append(img, info, delete_btn);
		a.append(wrapper);
		li.append(a);
		place.append(li);

		delete_btn.onclick = () => {
			cartArray.splice(cartArray.indexOf(id), 1);
			localStorage.setItem("cart", JSON.stringify(cartArray));
			li.remove();
			parseCart(cartArray, cardButton);
		};

		a.onclick = (e) => {
			e.preventDefault();

			if (
				!(e.target === delete_btn) &&
				e.target.nodeName !== "button" &&
				e.target.nodeName !== "path" &&
				e.target.nodeName !== "svg"
			) {
				location.assign(`/pages/item/?id=${id.itemId}`);
			}
		};
	}

	if (cartArray.length > 1) {
		let buybtn = document.createElement("button");
		let buybtnText = document.createElement("span");
		buybtn.classList.add("buy-btn");
		buybtnText.innerHTML = "Оформить заказ";

		buybtn.append(buybtnText);
		place.append(buybtn);
	}
}

export async function renderCart(cartArray, place) {
	place.innerHTML = "";
	let total = 0;
	let totalWithDiscount = 0;
	let economy = 0;
	for (const elem of cartArray) {
		let item = await get(`/goods/${elem.itemId}`);

		let li = document.createElement("div");
		let customCheckbox = document.createElement("div");
		let inputCheckbox = document.createElement("input");
		let inputLabel = document.createElement("label");
		let wrapper = document.createElement("div");
		let img = document.createElement("img");
		let info = document.createElement("div");
		let title = document.createElement("a");
		let colorInfo = document.createElement("p");
		let forOne = document.createElement("div");
		let counterDiv = document.createElement("div");
		let counterMinus = document.createElement("button");
		let counter = document.createElement("input");
		let counterPlus = document.createElement("button");
		let eachPrice = document.createElement("p");
		let deleteBtn = document.createElement("button");
		let costWrapper = document.createElement("div");
		let original = document.createElement("span");
		let sale = document.createElement("span");

		let prevCounter = elem.count;

		li.classList.add("item");
		customCheckbox.classList.add("customCheckbox");
		inputCheckbox.classList.add("custom-checkbox__input");
		inputLabel.classList.add("custom-checkbox__label");
		wrapper.classList.add("wrapper");
		img.classList.add("wrapper__img");
		info.classList.add("info");
		title.classList.add("title");
		colorInfo.classList.add("color");

		forOne.classList.add("for-one");
		counterDiv.classList.add("counter");
		counterMinus.classList.add("counter__minus");
		counter.classList.add("counter__input");
		counterPlus.classList.add("counter__plus");
		eachPrice.classList.add("each");
		deleteBtn.classList.add("delete");
		costWrapper.classList.add("cost");

		inputCheckbox.type = "checkbox";
		inputCheckbox.name = "item";
		inputCheckbox.id = elem.itemId;

		inputLabel.htmlFor = elem.itemId;

		img.src = item.data.media[0];
		title.innerHTML = item.data.title;
		colorInfo.innerHTML = `Цвет: <span>${item.data.colors[0].capitalize()}</span>`;
		counterMinus.innerHTML = "-";
		counter.type = "number";
		counter.value = elem.count;
		counterPlus.innerHTML = "+";
		deleteBtn.innerHTML = `
		<svg data-v-1a3a46a8="" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="ui-icon  filled">
			<path fill-rule="evenodd" clip-rule="evenodd" d="M9.75 3.5C9.33579 3.5 9 3.83579 9 4.25V5H15V4.25C15 3.83579 14.6642 3.5 14.25 3.5H9.75ZM7.5 4.25V5H3.75C3.33579 5 3 5.33579 3 5.75C3 6.16421 3.33579 6.5 3.75 6.5H4.30005L5.62088 19.9681C5.73386 21.1202 6.70255 21.9985 7.86014 21.9985H16.1399C17.2975 21.9985 18.2661 21.1202 18.3791 19.9681L19.7 6.5H20.25C20.6642 6.5 21 6.16421 21 5.75C21 5.33579 20.6642 5 20.25 5H16.5V4.25C16.5 3.00736 15.4926 2 14.25 2H9.75C8.50736 2 7.5 3.00736 7.5 4.25ZM11 9.75C11 9.33579 10.6642 9 10.25 9C9.83579 9 9.5 9.33579 9.5 9.75V17.25C9.5 17.6642 9.83579 18 10.25 18C10.6642 18 11 17.6642 11 17.25V9.75ZM14.5 9.75C14.5 9.33579 14.1642 9 13.75 9C13.3358 9 13 9.33579 13 9.75V17.25C13 17.6642 13.3358 18 13.75 18C14.1642 18 14.5 17.6642 14.5 17.25V9.75Z" fill="black"></path>
		</svg> Удалить`;

		if (item.data.salePercentage) {
			original.classList.add("sale");
			sale.classList.add("price");

			original.innerHTML = `${(item.data.price * elem.count).toLocaleString(
				"ru-RU"
			)} сум`;
			sale.innerHTML = `${(
				+((item.data.price * (100 - item.data.salePercentage)) / 100).toFixed(
					2
				) * elem.count
			).toLocaleString("ru-RU")} сум`;

			costWrapper.classList.add("with__sale");
			costWrapper.append(sale, original);
			totalWithDiscount +=
				((item.data.price * (100 - item.data.salePercentage)) / 100) *
				elem.count;
			total += item.data.price * elem.count;
			economy += total - totalWithDiscount;
		} else {
			original.classList.add("price");
			original.innerHTML = `${(item.data.price * elem.count).toLocaleString(
				"ru-RU"
			)} сум`;
			costWrapper.append(original);
			totalWithDiscount += item.data.price * elem.count;
			total += item.data.price * elem.count;
		}

		if (elem.count > 2) {
			eachPrice.innerHTML = `${item.data.price} сум / шт`;
		}

		place.append(li);
		li.append(customCheckbox, wrapper);
		customCheckbox.append(inputCheckbox, inputLabel);

		wrapper.append(img, info);
		info.append(title, deleteBtn, colorInfo, forOne, costWrapper);
		forOne.append(counterDiv, eachPrice);
		counterDiv.append(counterMinus, counter, counterPlus);

		counterMinus.onclick = function () {
			if (prevCounter > 1) {
				prevCounter--;
				counter.value = prevCounter;

				if (item.data.salePercentage) {
					sale.innerHTML = `${(+(
						(item.data.price * (100 - item.data.salePercentage)) /
						100
					).toFixed(2)).toLocaleString("ru-RU")} сум`;
					original.innerHTML = `${(item.data.price * elem.count).toLocaleString(
						"ru-RU"
					)} сум`;

					totalWithDiscount -=
						(item.data.price * (100 - item.data.salePercentage)) / 100;
					total -= item.data.price;
					economy -= total - totalWithDiscount;
					updateOfferInfo({ total, totalWithDiscount, economy }, getCart());
				} else {
					original.innerHTML = `${(item.data.price * elem.count).toLocaleString(
						"ru-RU"
					)} сум`;
					totalWithDiscount -= item.data.price;
					total -= item.data.price;
					updateOfferInfo({ total, totalWithDiscount, economy }, getCart());
				}
			}

			if (prevCounter >= 2) {
				eachPrice.innerHTML = `${item.data.price} сум / шт`;
			} else {
				eachPrice.innerHTML = ``;
			}
		};

		counterPlus.onclick = function () {
			prevCounter++;
			counter.value = prevCounter;

			if (item.data.salePercentage) {
				sale.innerHTML = `${(+(
					(item.data.price * (100 - item.data.salePercentage)) /
					100
				).toFixed(2)).toLocaleString("ru-RU")} сум`;
				original.innerHTML = `${(item.data.price * elem.count).toLocaleString(
					"ru-RU"
				)} сум`;

				totalWithDiscount +=
					(item.data.price * (100 - item.data.salePercentage)) / 100;
				total += item.data.price;
				economy += total - totalWithDiscount;
				updateOfferInfo({ total, totalWithDiscount, economy }, getCart());
			} else {
				original.innerHTML = `${(item.data.price * prevCounter).toLocaleString(
					"ru-RU"
				)} сум`;
				totalWithDiscount += item.data.price;
				total += item.data.price;
				updateOfferInfo({ total, totalWithDiscount, economy }, getCart());
			}

			if (prevCounter >= 2) {
				eachPrice.innerHTML = `${item.data.price} сум / шт`;
			} else {
				eachPrice.innerHTML = ``;
			}
		};

		counter.oninput = function () {
			if (counter.value > prevCounter) {
				if (item.data.salePercentage) {
					sale.innerHTML = `${(+(
						((item.data.price * (100 - item.data.salePercentage)) / 100) *
						counter.value
					).toFixed(2)).toLocaleString("ru-RU")} сум`;
					original.innerHTML = `${(
						item.data.price * counter.value
					).toLocaleString("ru-RU")} сум`;

					totalWithDiscount +=
						((item.data.price * (100 - item.data.salePercentage)) / 100) *
						(counter.value - prevCounter);
					total += item.data.price * (counter.value - prevCounter);
					economy += total - totalWithDiscount;
					updateOfferInfo({ total, totalWithDiscount, economy }, getCart());
					prevCounter = counter.value;
				} else {
					original.innerHTML = `${(
						item.data.price * counter.value
					).toLocaleString("ru-RU")} сум`;
					totalWithDiscount += item.data.price * (counter.value - prevCounter);
					total += item.data.price * (counter.value - prevCounter);
					economy += total - totalWithDiscount;
					updateOfferInfo({ total, totalWithDiscount, economy }, getCart());
					prevCounter = counter.value;
				}
			} else if (counter.value < prevCounter) {
				if (item.data.salePercentage) {
					sale.innerHTML = `${(+(
						((item.data.price * (100 - item.data.salePercentage)) / 100) *
						counter.value
					).toFixed(2)).toLocaleString("ru-RU")} сум`;
					original.innerHTML = `${(
						item.data.price * counter.value
					).toLocaleString("ru-RU")} сум`;

					totalWithDiscount -=
						((item.data.price * (100 - item.data.salePercentage)) / 100) *
						(prevCounter - counter.value);
					total -= item.data.price * (prevCounter - counter.value);
					economy -= total - totalWithDiscount;
					updateOfferInfo({ total, totalWithDiscount, economy }, getCart());
					prevCounter = counter.value;
				} else {
					original.innerHTML = `${(
						item.data.price * counter.value
					).toLocaleString("ru-RU")} сум`;
					totalWithDiscount -= item.data.price * (prevCounter - counter.value);
					total -= item.data.price * (prevCounter - counter.value);
					economy -= total - totalWithDiscount;
					updateOfferInfo({ total, totalWithDiscount, economy }, getCart());
					prevCounter = counter.value;
				}
			}

			if (prevCounter >= 2) {
				eachPrice.innerHTML = `${item.data.price} сум / шт`;
			} else {
				eachPrice.innerHTML = ``;
			}
		};

		counter.onblur = function () {
			if (counter.value < 1) {
				counter.value = 1;
				if (counter.value > prevCounter) {
					if (item.data.salePercentage) {
						sale.innerHTML = `${(+(
							((item.data.price * (100 - item.data.salePercentage)) / 100) *
							counter.value
						).toFixed(2)).toLocaleString("ru-RU")} сум`;
						original.innerHTML = `${(
							item.data.price * counter.value
						).toLocaleString("ru-RU")} сум`;

						totalWithDiscount +=
							((item.data.price * (100 - item.data.salePercentage)) / 100) *
							(counter.value - prevCounter);
						total += item.data.price * (counter.value - prevCounter);
						economy += total - totalWithDiscount;
						updateOfferInfo({ total, totalWithDiscount, economy }, getCart());
						prevCounter = counter.value;
					} else {
						original.innerHTML = `${(
							item.data.price * counter.value
						).toLocaleString("ru-RU")} сум`;
						totalWithDiscount +=
							item.data.price * (counter.value - prevCounter);
						total += item.data.price * (counter.value - prevCounter);
						economy += total - totalWithDiscount;
						updateOfferInfo({ total, totalWithDiscount, economy }, getCart());
						prevCounter = counter.value;
					}
				} else if (counter.value < prevCounter) {
					if (item.data.salePercentage) {
						sale.innerHTML = `${(+(
							((item.data.price * (100 - item.data.salePercentage)) / 100) *
							counter.value
						).toFixed(2)).toLocaleString("ru-RU")} сум`;
						original.innerHTML = `${(
							item.data.price * counter.value
						).toLocaleString("ru-RU")} сум`;

						totalWithDiscount -=
							((item.data.price * (100 - item.data.salePercentage)) / 100) *
							(prevCounter - counter.value);
						total -= item.data.price * (prevCounter - counter.value);
						economy -= total - totalWithDiscount;
						updateOfferInfo({ total, totalWithDiscount, economy }, getCart());
						prevCounter = counter.value;
					} else {
						original.innerHTML = `${(
							item.data.price * counter.value
						).toLocaleString("ru-RU")} сум`;
						totalWithDiscount -=
							item.data.price * (prevCounter - counter.value);
						total -= item.data.price * (prevCounter - counter.value);
						economy -= total - totalWithDiscount;
						updateOfferInfo({ total, totalWithDiscount, economy }, getCart());
						prevCounter = counter.value;
					}
				} else if (counter.value == prevCounter) {
					if (item.data.salePercentage) {
						sale.innerHTML = `${(+(
							((item.data.price * (100 - item.data.salePercentage)) / 100) *
							counter.value
						).toFixed(2)).toLocaleString("ru-RU")} сум`;
						original.innerHTML = `${(
							item.data.price * counter.value
						).toLocaleString("ru-RU")} сум`;

						totalWithDiscount +=
							((item.data.price * (100 - item.data.salePercentage)) / 100) *
							counter.value;
						total += item.data.price * counter.value;
						economy += total - totalWithDiscount;
						updateOfferInfo({ total, totalWithDiscount, economy }, getCart());
						prevCounter = counter.value;
					} else {
						original.innerHTML = `${(
							item.data.price * counter.value
						).toLocaleString("ru-RU")} сум`;
						totalWithDiscount += item.data.price * counter.value;
						total += item.data.price * counter.value;
						economy += total - totalWithDiscount;
						updateOfferInfo({ total, totalWithDiscount, economy }, getCart());
						prevCounter = counter.value;
					}
				}
			} else if (counter.value > 100) {
				counter.value = 100;
				if (counter.value > prevCounter) {
					if (item.data.salePercentage) {
						sale.innerHTML = `${(+(
							((item.data.price * (100 - item.data.salePercentage)) / 100) *
							counter.value
						).toFixed(2)).toLocaleString("ru-RU")} сум`;
						original.innerHTML = `${(
							item.data.price * counter.value
						).toLocaleString("ru-RU")} сум`;

						totalWithDiscount +=
							((item.data.price * (100 - item.data.salePercentage)) / 100) *
							(counter.value - prevCounter);
						total += item.data.price * (counter.value - prevCounter);
						economy += total - totalWithDiscount;
						updateOfferInfo({ total, totalWithDiscount, economy }, getCart());
						prevCounter = counter.value;
					} else {
						original.innerHTML = `${(
							item.data.price * counter.value
						).toLocaleString("ru-RU")} сум`;
						totalWithDiscount +=
							item.data.price * (counter.value - prevCounter);
						total += item.data.price * (counter.value - prevCounter);
						economy += total - totalWithDiscount;
						updateOfferInfo({ total, totalWithDiscount, economy }, getCart());
						prevCounter = counter.value;
					}
				} else if (counter.value < prevCounter) {
					if (item.data.salePercentage) {
						sale.innerHTML = `${(+(
							((item.data.price * (100 - item.data.salePercentage)) / 100) *
							counter.value
						).toFixed(2)).toLocaleString("ru-RU")} сум`;
						original.innerHTML = `${(
							item.data.price * counter.value
						).toLocaleString("ru-RU")} сум`;

						totalWithDiscount -=
							((item.data.price * (100 - item.data.salePercentage)) / 100) *
							(prevCounter - counter.value);
						total -= item.data.price * (prevCounter - counter.value);
						economy -= total - totalWithDiscount;
						updateOfferInfo({ total, totalWithDiscount, economy }, getCart());
						prevCounter = counter.value;
					} else {
						original.innerHTML = `${(
							item.data.price * counter.value
						).toLocaleString("ru-RU")} сум`;
						totalWithDiscount -=
							item.data.price * (prevCounter - counter.value);
						total -= item.data.price * (prevCounter - counter.value);
						economy -= total - totalWithDiscount;
						updateOfferInfo({ total, totalWithDiscount, economy }, getCart());
						prevCounter = counter.value;
					}
				} else if (counter.value == prevCounter) {
					if (item.data.salePercentage) {
						sale.innerHTML = `${(+(
							((item.data.price * (100 - item.data.salePercentage)) / 100) *
							counter.value
						).toFixed(2)).toLocaleString("ru-RU")} сум`;
						original.innerHTML = `${(
							item.data.price * counter.value
						).toLocaleString("ru-RU")} сум`;

						totalWithDiscount +=
							((item.data.price * (100 - item.data.salePercentage)) / 100) *
							counter.value;
						total += item.data.price * counter.value;
						economy += total - totalWithDiscount;
						updateOfferInfo({ total, totalWithDiscount, economy }, getCart());
						prevCounter = counter.value;
					} else {
						original.innerHTML = `${(
							item.data.price * counter.value
						).toLocaleString("ru-RU")} сум`;
						totalWithDiscount += item.data.price * counter.value;
						total += item.data.price * counter.value;
						economy += total - totalWithDiscount;
						updateOfferInfo({ total, totalWithDiscount, economy }, getCart());
						prevCounter = counter.value;
					}
				}
			}

			if (prevCounter >= 2) {
				eachPrice.innerHTML = `${item.data.price} сум / шт`;
			} else {
				eachPrice.innerHTML = ``;
			}
		};
	}
	total = parseInt(total);
	totalWithDiscount = parseInt(totalWithDiscount);
	economy = parseInt(economy);
	return { total, totalWithDiscount, economy };
}
