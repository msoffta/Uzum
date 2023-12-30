import { get } from "./requests";

export function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

export function backdropClear(toClose, backdrop, body) {
	toClose.forEach((el) => {
		el.classList.remove("show", "open");
	});
	backdrop.classList.remove("show", "top");
	body.classList.remove("modal_lock");
}

export function backdropLaunch(toShow, backdrop, body) {
	toShow.classList.add("show");
	backdrop.classList.add("show");
	if (toShow.classList.contains("modal__account")) {
		backdrop.classList.add("top");
	}
	body.classList.add("modal_lock");
}

export async function checkAccount(number, name) {
	let response = await get("/accounts?number=" + number);
	if (response.data.length == 1) {
		if (response.data[0].name == name) {
			return "login";
		} else {
			return "not_available";
		}
	} else {
		return "register";
	}
}

export async function checkCredentials(number, previousNumber) {
	let responseToCheck = await get("/accounts?number=" + number);
	let responseTo = await get("/accounts?number=" + previousNumber);

	if (number == previousNumber) return ["same", responseTo.data[0]];

	if (responseToCheck.data.length == 1) {
		return ["not_available", responseTo.data[0]];
	} else {
		return ["available", responseTo.data[0]];
	}
}

export function getUser() {
	let user = JSON.parse(localStorage.getItem("user"));
	if (user) {
		return user;
	} else {
		return null;
	}
}

export function getCart() {
	let cart = JSON.parse(localStorage.getItem("cart")) || [];
	if (cart) {
		return cart;
	} else {
		return null;
	}
}

export function getFavorite() {
	let favorite = JSON.parse(localStorage.getItem("liked")) || [];
	if (favorite) {
		return favorite;
	} else {
		return null;
	}
}

export function announce(
	{ itemName, itemImg },
	itemPlace = null,
	imgPlace = null
) {
	let announce = document.querySelector(".announcement");
	announce.classList.add("show");
	if (itemPlace == null || imgPlace == null) {
		let itemPlace = document.querySelector("[data-item__name]");
		let imgPlace = document.querySelector("[data-item__img]");

		itemPlace.innerHTML = itemName;
		imgPlace.src = itemImg;
		imgPlace.alt = itemName;
	} else {
		itemPlace.innerHTML = itemName;
		imgPlace.src = itemImg;
		imgPlace.alt = itemName;
	}

	setTimeout(() => {
		announce.classList.remove("show");
	}, 2500);
}

// export function setCookie(cname, cvalue, exdays) {
// 	const d = new Date();
// 	d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
// 	let expires = "expires=" + d.toUTCString();
// 	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";

// 	console.log(document.cookie);
// }

export function getColors(data) {
	let colors = data.map((el) => el.colors);
	colors = colors.flat();
	let filtered = Array.from(new Set(colors));

	return filtered;
}

export function saveLocal(key, data) {
	localStorage.setItem(key, JSON.stringify(data));
}

export async function getItems(ids) {
	let items = [];
	for (let id of ids) {
		let itemData = await get(`/goods/${id}`);
		items.push(itemData.data);
	}
	return items;
}

export async function updateOfferInfo(data, cart) {
	let total = document.querySelector("[data-total__item]");
	let totalItems = document.querySelectorAll("[data-count]");
	let intotal = document.querySelector("[data-total__intotal]");
	let economy = document.querySelector("[data-economy]");

	total.innerHTML = data.total.toLocaleString("ru-RU");
	intotal.innerHTML = data.totalWithDiscount.toLocaleString("ru-RU");
	economy.innerHTML = data.economy.toLocaleString("ru-RU");

	totalItems.forEach((item) => {
		item.innerHTML = cart.length;
	});
}
