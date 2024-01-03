import { get } from "../helpers/requests";
import { announce } from "../helpers/utilites";
import { renderCartPreview } from "./cartPreview";
import { renderPlaces } from "./places";

export async function renderAutoItems(
	searchPlace,
	places = null,
	cartButton,
	cartPlace
) {
	const items = await get(searchPlace);
	let types = items.data.map((item) => item.type);
	places = places ? places : renderPlaces(types);

	for (const item of items.data) {
		let itemDiv = document.createElement("div");
		let imgWrap = document.createElement("div");
		let img = document.createElement("img");

		let like = document.createElement("button");
		let likeImg = document.createElement("span");

		let infoWrap = document.createElement("div");
		let title = document.createElement("h2");

		let ratingWrap = document.createElement("div");
		let ratingStar = document.createElement("img");
		let rating = document.createElement("p");

		let addCart = document.createElement("button");
		let addCartImg = document.createElement("img");

		let liked = JSON.parse(localStorage.getItem("liked")) || [];

		itemDiv.classList.add("item");
		imgWrap.classList.add("img-wrap");

		img.classList.add("img");
		img.src = item.media[0];
		img.alt = item.title;

		like.classList.add("like");
		likeImg.classList.add("material-symbols-outlined");
		likeImg.innerHTML = "favorite";

		if (liked.includes(item.id)) {
			likeImg.classList.add("active");
		}

		infoWrap.classList.add("info");
		title.classList.add("title");
		title.innerHTML =
			item.title.length > 70 ? item.title.slice(0, 70) + "..." : item.title;

		ratingWrap.classList.add("rating");
		ratingStar.classList.add("rating-star");
		ratingStar.src = "/images/rating.svg";
		ratingStar.alt = "star";

		rating.innerHTML = `${item.rating}`;

		addCart.classList.add("add-cart");
		addCartImg.src = "/images/add-cart.svg";
		addCartImg.alt = "add-cart";

		if (item.salePercentage) {
			let costWrapper = document.createElement("div");
			let originalCost = document.createElement("p");
			let saleCost = document.createElement("p");

			costWrapper.classList.add("cost-wrapper");
			originalCost.classList.add("cost", "sale");
			saleCost.classList.add("cost");

			originalCost.innerHTML = `${item.price} сум`;
			saleCost.innerHTML = `${(
				item.price -
				(item.price * item.salePercentage) / 100
			).toLocaleString("ru-RU")} сум`;

			places[item.type].append(itemDiv);
			itemDiv.append(imgWrap, infoWrap);
			imgWrap.append(img, like);
			like.append(likeImg);

			infoWrap.append(title, ratingWrap, costWrapper, addCart);
			ratingWrap.append(ratingStar, rating);
			costWrapper.append(originalCost, saleCost);
			addCart.append(addCartImg);
		} else {
			let costWrapper = document.createElement("div");
			let originalCost = document.createElement("p");

			costWrapper.classList.add("cost-wrapper");
			originalCost.classList.add("cost");

			originalCost.innerHTML = `${item.price.toLocaleString("ru-RU")} сум`;

			places[item.type].append(itemDiv);
			itemDiv.append(imgWrap, infoWrap);
			imgWrap.append(img, like);
			like.append(likeImg);

			infoWrap.append(title, ratingWrap, costWrapper, addCart);
			ratingWrap.append(ratingStar, rating);
			costWrapper.append(originalCost);
			addCart.append(addCartImg);
		}

		like.onclick = () => {
			let liked = [...(JSON.parse(localStorage.getItem("liked")) || [])];
			if (liked.includes(item.id)) {
				liked = liked.filter((id) => id !== item.id);
			} else {
				liked.push(item.id);
			}
			localStorage.setItem("liked", JSON.stringify(liked));

			likeImg.classList.toggle("active");
		};

		addCart.onclick = () => {
			let cart = JSON.parse(localStorage.getItem("cart")) || [];

			if (cart.some((el) => el.itemId === item.id)) {
				let index = cart.findIndex((el) => el.itemId === item.id);
				cart[index].count++;
			} else {
				cart.push({ itemId: item.id, count: 1 });
				let cartBlock = document.querySelector(".cart");
				cartBlock.dataset.elems = cart.length;
			}

			localStorage.setItem("cart", JSON.stringify(cart));

			announce({ itemName: item.title, itemImg: item.media[0] });
			renderCartPreview(cart, cartPlace, cartButton);
		};

		itemDiv.onclick = (e) => {
			if (
				e.target == likeImg ||
				e.target == like ||
				e.target == addCartImg ||
				e.target == addCart
			)
				return;
			location.assign(`/pages/item/?id=${item.id}`);
		};
	}
}

export function renderItems(items, filters, place, cartPlace, cartButton) {
	if (!items) return;

	place.innerHTML = "";
	let data = items
	if (filters != null) {
		data = items.map((item) => {
			if (filters.color && filters.price.from && filters.price.to) {
				if (
					(item.colors.includes(filters.color) || filters.color === "all") &&
					item.price >= filters.price.from &&
					item.price <= filters.price.to
				) {
					return item;
				}
			} else if (filters.color && filters.price.from) {
				if (
					(item.colors.includes(filters.color) || filters.color === "all") &&
					item.price >= filters.price.from
				) {
					return item;
				}
			} else if (filters.color && filters.price.to) {
				if (
					(item.colors.includes(filters.color) || filters.color === "all") &&
					item.price <= filters.price.to
				) {
					return item;
				}
			} else if (filters.color) {
				if (item.colors.includes(filters.color) || filters.color === "all") {
					return item;
				}
			} else if (
				filters.color === "all" &&
				filters.price.from === filters.defaultPrice.from &&
				filters.price.to === filters.defaultPrice.to
			) {
				return item;
			}
		});
	
		if (filters.sortBy) {
			if (filters.sortBy === "price_asc") {
				data.sort((a, b) => a.price - b.price);
			} else if (filters.sortBy === "price_desc") {
				data.sort((a, b) => b.price - a.price);
			} else if (filters.sortBy === "rating") {
				data.sort((a, b) => b.rating - a.rating);
			} else if (filters.sortBy === "alpha") {
				data.sort((a, b) => a.title.localeCompare(b.title));
			} else if (filters.sortBy === "default") {
				data.sort((a, b) => a.id - b.id);
			}
		}
	
		data = data.filter((item) => item !== undefined);
	}
	for (const item of data) {
		let itemDiv = document.createElement("div");
		let imgWrap = document.createElement("div");
		let img = document.createElement("img");

		let like = document.createElement("button");
		let likeImg = document.createElement("span");

		let infoWrap = document.createElement("div");
		let title = document.createElement("h2");

		let ratingWrap = document.createElement("div");
		let ratingStar = document.createElement("img");
		let rating = document.createElement("p");

		let addCart = document.createElement("button");
		let addCartImg = document.createElement("img");

		let liked = JSON.parse(localStorage.getItem("liked")) || [];

		itemDiv.classList.add("item");
		imgWrap.classList.add("img-wrap");

		img.classList.add("img");
		img.src = item.media[0];
		img.alt = item.title;

		like.classList.add("like");
		like.dataset.id = item.id;
		likeImg.classList.add("material-symbols-outlined");
		likeImg.innerHTML = "favorite";

		if (liked.includes(item.id)) {
			likeImg.classList.add("active");
		}

		infoWrap.classList.add("info");
		title.classList.add("title");
		title.innerHTML =
			item.title.length > 70 ? item.title.slice(0, 70) + "..." : item.title;

		ratingWrap.classList.add("rating");
		ratingStar.classList.add("rating-star");
		ratingStar.src = "/images/rating.svg";
		ratingStar.alt = "star";

		rating.innerHTML = `${item.rating}`;

		addCart.classList.add("add-cart");
		addCartImg.src = "/images/add-cart.svg";
		addCartImg.alt = "add-cart";

		if (item.salePercentage) {
			let costWrapper = document.createElement("div");
			let originalCost = document.createElement("p");
			let saleCost = document.createElement("p");

			costWrapper.classList.add("cost-wrapper");
			originalCost.classList.add("cost", "sale");
			saleCost.classList.add("cost");

			originalCost.innerHTML = `${item.price} сум`;
			saleCost.innerHTML = `${(
				item.price -
				(item.price * item.salePercentage) / 100
			).toLocaleString("ru-RU")} сум`;

			place.append(itemDiv);
			itemDiv.append(imgWrap, infoWrap);
			imgWrap.append(img, like);
			like.append(likeImg);

			infoWrap.append(title, ratingWrap, costWrapper, addCart);
			ratingWrap.append(ratingStar, rating);
			costWrapper.append(originalCost, saleCost);
			addCart.append(addCartImg);
		} else {
			let costWrapper = document.createElement("div");
			let originalCost = document.createElement("p");

			costWrapper.classList.add("cost-wrapper");
			originalCost.classList.add("cost");

			originalCost.innerHTML = `${item.price.toLocaleString("ru-RU")} сум`;

			place.append(itemDiv);
			itemDiv.append(imgWrap, infoWrap);
			imgWrap.append(img, like);
			like.append(likeImg);

			infoWrap.append(title, ratingWrap, costWrapper, addCart);
			ratingWrap.append(ratingStar, rating);
			costWrapper.append(originalCost);
			addCart.append(addCartImg);
		}

		like.onclick = () => {
			let liked = [...(JSON.parse(localStorage.getItem("liked")) || [])];
			if (liked.includes(item.id)) {
				liked = liked.filter((id) => id !== item.id);
			} else {
				liked.push(item.id);
			}
			localStorage.setItem("liked", JSON.stringify(liked));

			likeImg.classList.toggle("active");
		};

		addCart.onclick = () => {
			let cart = JSON.parse(localStorage.getItem("cart")) || [];

			if (cart.some((el) => el.itemId === item.id)) {
				let index = cart.findIndex((el) => el.itemId === item.id);
				cart[index].count++;
			} else {
				cart.push({ itemId: item.id, count: 1 });
				let cartBlock = document.querySelector(".cart");
				cartBlock.dataset.elems = cart.length;
			}

			localStorage.setItem("cart", JSON.stringify(cart));

			announce({ itemName: item.title, itemImg: item.media[0] });
			renderCartPreview(cart, cartPlace, cartButton);
		};

		itemDiv.onclick = (e) => {
			if (
				e.target == likeImg ||
				e.target == like ||
				e.target == addCartImg ||
				e.target == addCart
			)
				return;
			location.assign(`/pages/item/?id=${item.id}`);
		};
	}
}
