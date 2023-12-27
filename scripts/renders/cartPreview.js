import { get } from "../helpers/requests";
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
