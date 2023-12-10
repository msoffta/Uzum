import { get } from "../helpers/requests";
import { renderPlaces } from "./places";

export async function renderAutoItems(searchPlace) {
	const items = await get(searchPlace);
	let types = items.data.map((item) => item.type);
	let places = renderPlaces(types);

	console.log(places);
	for (const item of items.data) {
		let itemDiv = document.createElement("div");
		let imgWrap = document.createElement("div");
		let img = document.createElement("img");

		let like = document.createElement("button");
		let likeImg = document.createElement("img");

		let infoWrap = document.createElement("div");
		let title = document.createElement("h2");

		let ratingWrap = document.createElement("div");
		let ratingStar = document.createElement("img");
		let rating = document.createElement("p");

		let addCart = document.createElement("button");
		let addCartImg = document.createElement("img");
		itemDiv.classList.add("item");
		imgWrap.classList.add("img-wrap");

		img.classList.add("img");
		img.src = item.media[0];
		img.alt = item.title;

		like.classList.add("like");
		likeImg.classList.add("like-img");
		likeImg.src = "/public/images/like.svg";
		likeImg.alt = "like";

		infoWrap.classList.add("info");
		title.classList.add("title");
		title.innerHTML = item.title;

		ratingWrap.classList.add("rating");
		ratingStar.classList.add("rating-star");
		ratingStar.src = "/public/images/rating.svg";
		ratingStar.alt = "star";

		rating.classList.add("rating");
		rating.innerHTML = `${item.rating}`;

		addCart.classList.add("add-cart");
		addCartImg.src = "/public/images/add-cart.svg";
		addCartImg.alt = "add-cart";

		if (item.salePercentage) {
			let originalCost = document.createElement("p");
			let saleCost = document.createElement("p");

			originalCost.classList.add("cost", "sale");
			saleCost.classList.add("cost");

			originalCost.innerHTML = `${item.price} сум`;
			saleCost.innerHTML = `${
				item.price - (item.price * item.salePercentage) / 100
				} сум`;
			
			places[item.type].append(itemDiv);
			itemDiv.append(imgWrap, infoWrap);
			imgWrap.append(img, like);
			like.append(likeImg);

			infoWrap.append(title, ratingWrap, originalCost, saleCost, addCart);
			ratingWrap.append(ratingStar, rating);
			addCart.append(addCartImg);
		} else {
			let originalCost = document.createElement("p");

			originalCost.classList.add("cost");

			originalCost.innerHTML = `${item.price} сум`;

			places[item.type].append(itemDiv);
			itemDiv.append(imgWrap, infoWrap);
			imgWrap.append(img, like);
			like.append(likeImg);

			infoWrap.append(title, ratingWrap, originalCost, addCart);
			ratingWrap.append(ratingStar, rating);
			addCart.append(addCartImg);
		}
	}
}
