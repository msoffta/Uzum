import IMask from "imask";
import {
	backdropClear,
	backdropLaunch,
	checkAccount,
	checkCredentials,
	getUser,
} from "../helpers/utilites";
import { renderAccount, renderLeaveAccount } from "./renderAccount";
import { queryResults } from "./searchQuery";
import { renderCatalogMenu } from "./catalogItems";
import { post, put } from "../helpers/requests";
import { renderCartPreview } from "./cartPreview";
import { parseCart } from "./checkCart";
import { renderHotLinks } from "./hotlinks";

export function makeHeader() {
	let header = document.querySelector("header");
	header.innerHTML = `
	
		<section class="header header__first">
				<div class="wrap">
					<div class="geo">
						<div class="geolocation">
							<span class="material-symbols-outlined"> location_on </span>
							<a href="#">Город: <span data-city>Ташкент</span></a>
						</div>

						<div class="pickup">
							<a href="#">Пункты выдачи</a>
						</div>
					</div>

					<div class="free-day">
						<p>Доставим ваш заказ бесплатно — всего за 1 день!</p>
					</div>

					<div class="localization">
						<div class="faq">
							<a href="#">Вопрос-ответ</a>
						</div>

						<div class="my-orders">
							<a href="#">Мои заказы</a>
						</div>

						<a href="#" class="lang">
							<div class="lang__flag"></div>
							<span>Русский</span>
						</a>
					</div>
				</div>
			</section>
			<section class="header header__second">
				<div class="wrap">
					<div class="logo">
						<a href="/">
							<img src="/images/logo.svg" alt="logo" />
						</a>
					</div>

					<button class="dropdown">
						<div class="catalog-icon">
							<div class="rect">
								<div class="inner"></div>
							</div>

							<div class="top"></div>
							<div class="bottom"></div>
						</div>
						<span>Каталог</span>
					</button>

					<div class="search">
						<div class="searchQuery">
							<input
								type="search"
								name="searchItem"
								placeholder="Искать товары и категории"
								id="search"
							/>
							<button class="searchIcon">
								<span class="material-symbols-outlined"> search </span>
							</button>
						</div>

						<ul class="searchResults"></ul>
					</div>

					<div class="btn-block">
						<div class="account">
							<span class="material-symbols-outlined"> person </span>
							<p data-name="">Войти</p>
						</div>

						<div class="liked">
							<span class="material-symbols-outlined">favorite</span>
							<p>Избранное</p>
						</div>

						<div class="cart">
							<span class="material-symbols-outlined"> shopping_bag </span>
							<p>Корзина</p>

							<div class="modal__cart">
								<ul class="incart"></ul>
							</div>
						</div>
					</div>
				</div>
			</section>
			<section class="header header__third">
				<div class="wrap">
					<ul class="menu-list"></ul>
				</div>
			</section>

	`;
}

export function makeFooter() {
	let footer = document.querySelector("footer");
	footer.innerHTML = `
	
		<section class="footer">
				<div class="wrap">
					<div class="about-us">
						<h3>О нас</h3>
						<a href="#">Пункты выдачи</a>
						<a href="#">Вакансии</a>
					</div>

					<div class="users">
						<h3>Пользователям</h3>
						<a href="#">Связаться с нами</a>
						<a href="#">Вопрос - ответ</a>
					</div>

					<div class="for-entrepreneurs">
						<h3>Для предпринимателей</h3>
						<a href="#">Продавайте на Uzum</a>
						<a href="#">Вход для продавцов</a>
					</div>

					<div class="social">
						<h3>Скачать приложение</h3>
						<div class="download-app">
							<a href="#" class="appstore">
								<img src="/images/appstore.svg" alt="appstore" />
								<span>AppStore</span>
							</a>
							<a class="googleplay">
								<img src="/images/googleplay.svg" alt="googleplay" />
								<span>Google Play</span>
							</a>
						</div>

						<div class="social-links">
							<h3>Uzum в соцсетях</h3>
							<div class="social-links__apps">
								<a href="#">
									<img src="/images/socials/instagram.svg" alt="" />
								</a>

								<a href="#">
									<img src="/images/socials/telegram.svg" alt="" />
								</a>

								<a href="#">
									<img src="/images/socials/youtube.svg" alt="" />
								</a>

								<a href="#">
									<img src="/images/socials/facebook.svg" alt="" />
								</a>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section class="footer__second">
				<div class="wrap">
					<div class="agreements">
						<div class="confidentiality">
							<a href="#">Политика конфиденциальности</a>
						</div>

						<div class="agreement">
							<a href="#">Пользовательское соглашение</a>
						</div>
					</div>

					<div class="copyright-text">
						<p>«2023© ООО «UZUM MARKET». ИНН 309376127. Все права защищены»</p>
					</div>
				</div>
			</section>

	`;
}

export function makeModals() {
	let modals = document.querySelector(".modals");
	modals.classList.add("modals");

	modals.innerHTML = `
	
		<div class="backdrop"></div>
		<div class="modal modal__catalog">
			<div class="modal__content">
				<span>Категории товаров</span>
				<ul class="catalog__items"></ul>
			</div>
		</div>
		<div class="modal modal__account">
			<span class="material-symbols-outlined close"> close </span>
			<div class="modal__content">
				<form name="login">
					<h1>Вход</h1>

					<div class="inputs">
						<div class="input-wrap">
							<input
								type="text"
								name="name"
								placeholder="Как вас зовут?"
								autocomplete="off"
							/>
						</div>
						<label>
							<div class="input-wrap">
								<div class="precode">+998</div>
								<input
									type="text"
									name="number"
									placeholder="00 000-00-00"
									autocomplete="off"
								/>
							</div>
							<span class="error" data-error__account></span>
						</label>
					</div>

					<button type="submit">
						<p>Войти</p>
					</button>

					<span class="agreements">
						Авторизуясь, вы соглашаетесь с
						<a href="#">политикой обработки персональных данных</a>
					</span>
				</form>

				<div class="control">
					<h1>Аккаунт</h1>

					<p>Имя: <span data-name></span></p>
					<p>Телефон: <span data-number></span></p>

					<div class="buttons">
						<button class="blue" id="edit" type="button">
							<p>Редактировать</p>
						</button>

						<button class="danger" id="delete" type="button">
							<p>Выйти</p>
						</button>
					</div>
				</div>

				<div class="change">
					<form name="changeCredentials">
						<h1>Изменить данные</h1>
						<div class="inputs">
							<div class="input-wrap">
								<input
									type="text"
									name="name"
									placeholder="Как вас зовут?"
									autocomplete="off"
								/>
							</div>

							<label>
								<div class="input-wrap">
									<div class="precode">+998</div>
									<input
										type="text"
										name="number"
										placeholder="00 000-00-00"
										autocomplete="off"
									/>
								</div>
								<span class="error" data-error__account></span>
							</label>
						</div>
						
						<div class="buttons">
							<button class="blue cancel" type="button">Отменить</button>
							<button class="danger" type="submit">Сохранить</button>
						</div>
					</form>
				</div>
			</div>
		</div>
		<div class="modal announcement">
			<div class="modal__content">
				<img data-item__img="" src="" alt="" />
				<div class="info">
					<p>Товар добавлен в корзину</p>
					<span data-item__name></span>
				</div>

				<div class="control">
					<span class="material-symbols-outlined"> close </span>

					<a href="/pages/cart/" data-item__link>Перейти в корзину</a>
				</div>
			</div>
		</div>
		<div class="sidebar">
				<div class="wrap">
				<div class="sidebar__item catalog">
					<svg data-v-b2fd8610="" width="28" height="28" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg" class="ui-icon ">
<g id="Icon">
<g id="Icon_2">
<path d="M1.5 12.5C1.5 7.25329 5.75329 3 11 3C16.2467 3 20.5 7.25329 20.5 12.5C20.5 14.853 19.6445 17.0062 18.2276 18.6656L24.2795 24.6993C24.5728 24.9917 24.5735 25.4666 24.2811 25.7599C23.9886 26.0532 23.5138 26.054 23.2204 25.7615L17.1671 19.7264C15.5075 21.144 13.3537 22 11 22C5.75329 22 1.5 17.7467 1.5 12.5ZM11 4.5C6.58172 4.5 3 8.08172 3 12.5C3 16.9183 6.58172 20.5 11 20.5C15.4183 20.5 19 16.9183 19 12.5C19 8.08172 15.4183 4.5 11 4.5Z" fill="#8B8E99"></path>
<path d="M22.75 6.00003C22.3358 6.00003 22 6.33582 22 6.75003C22 7.16424 22.3358 7.50003 22.75 7.50003H26.75C27.1642 7.50003 27.5 7.16424 27.5 6.75003C27.5 6.33582 27.1642 6.00003 26.75 6.00003H22.75Z" fill="#8B8E99"></path>
<path d="M22.75 11.75C22.3358 11.75 22 12.0858 22 12.5C22 12.9142 22.3358 13.25 22.75 13.25H26.75C27.1642 13.25 27.5 12.9142 27.5 12.5C27.5 12.0858 27.1642 11.75 26.75 11.75H22.75Z" fill="#8B8E99"></path>
<path d="M22.75 17.5C22.3358 17.5 22 17.8358 22 18.25C22 18.6642 22.3358 19 22.75 19H26.75C27.1642 19 27.5 18.6642 27.5 18.25C27.5 17.8358 27.1642 17.5 26.75 17.5H22.75Z" fill="#8B8E99"></path>
</g>
</g>
</svg>
					<span>Каталог</span>
				</div>

				<div class="sidebar__item cart">
					<svg data-v-b2fd8610="" width="28" height="28" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg" class="ui-icon ">
<g id="Icon">
<path id="Icon_2" d="M9.5 7C9.5 4.5444 11.4295 2 14.5 2C17.5705 2 19.5 4.54439 19.5 7H24V22.25C24 24.3211 22.3211 26 20.25 26H8.75C6.67893 26 5 24.3211 5 22.25V7H9.5ZM11 7H18C18 5.25561 16.6295 3.5 14.5 3.5C12.3705 3.5 11 5.2556 11 7ZM9.5 8.5H6.5V22.25C6.5 23.4926 7.50736 24.5 8.75 24.5H20.25C21.4926 24.5 22.5 23.4926 22.5 22.25V8.5H19.5V11.5H18V8.5H11V11.5H9.5V8.5Z" fill="#8B8E99"></path>
</g>
</svg>
					<span>Корзина</span>
				</div>

				<div class="sidebar__item liked">
					<svg data-v-b2fd8610="" width="28" height="28" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg" class="ui-icon ">
<g id="Icon">
<path id="Icon_2" d="M9.02703 4C5.38324 4 2.5 6.96273 2.5 10.5391C2.5 16 9.99615 21.5 14.0055 24.8139C14.2885 25.062 14.7115 25.062 14.9945 24.8139C19 21.5 26.5 16 26.5 10.5391C26.5 6.96281 23.6178 4 19.973 4C17.2008 4 15.3841 5.6987 14.5 6.79192C13.6159 5.6987 11.7992 4 9.02703 4ZM4 10.5391C4 7.7779 6.22487 5.5 9.02703 5.5C11.7441 5.5 13.3368 7.65762 13.7573 8.32095C14.1013 8.86359 14.8987 8.86359 15.2427 8.32095C15.6632 7.65762 17.2559 5.5 19.973 5.5C22.776 5.5 25 7.77781 25 10.5391C25 15.1 18 20.5 14.5 23.2667C11 20.5 4 15.1 4 10.5391Z" fill="#8B8E99"></path>
</g>
</svg>
				<span>Избранное</span>
				</div>

				<div class="sidebar__item account">
					<svg data-v-b2fd8610="" width="28" height="28" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg" class="ui-icon ">
<g id="Icon">
<g id="Icon_2">
<path d="M14.5 3C11.4624 3 9 5.46243 9 8.5C9 11.5376 11.4624 14 14.5 14C17.5376 14 20 11.5376 20 8.5C20 5.46243 17.5376 3 14.5 3ZM10.5 8.5C10.5 6.29086 12.2909 4.5 14.5 4.5C16.7091 4.5 18.5 6.29086 18.5 8.5C18.5 10.7091 16.7091 12.5 14.5 12.5C12.2909 12.5 10.5 10.7091 10.5 8.5Z" fill="#8B8E99"></path>
<path d="M14.5025 15C9.16883 15 4.5 19.0011 4.5 24C4.5 25.1046 5.39543 26 6.5 26H22.5C23.6046 26 24.5 25.1046 24.5 24C24.5 19.0057 19.8369 15 14.5025 15ZM6 24C6 19.9911 9.82583 16.5 14.5025 16.5C19.1783 16.5 23 19.9943 23 24C23 24.2761 22.7761 24.5 22.5 24.5H6.5C6.22386 24.5 6 24.2761 6 24Z" fill="#8B8E99"></path>
</g>
</g>
</svg>
				<span data-name="">Войти</span>
			</div>
		</div>
	</div>

	`;
}

export function loadMainEvents() {
	let hotPlace = document.querySelector(".menu-list");
	let dropdownButton = document.querySelector(".dropdown");
	let account = document.querySelector(".account");

	const box = document.querySelector(".searchResults");
	const search = document.getElementById("search");

	let sidebarCatalog = document.querySelector(".sidebar .catalog");
	let sidebarCart = document.querySelector(".sidebar .cart");
	let sidebarFavorite = document.querySelector(".sidebar .liked");
	let sidebarAccount = document.querySelector(".sidebar .account");

	let backdrop = document.querySelector(".backdrop");
	let modal_closes = document.querySelectorAll(".modal .close");
	let modal__catalog = document.querySelector(".modal__catalog");
	let catalog__items = document.querySelector(
		".modal__catalog .catalog__items"
	);
	let modal__account = document.querySelector(".modal__account");

	let accountForm = modal__account.querySelector("form");
	let accountName = accountForm.querySelector("[name='name']");
	let accountTel = accountForm.querySelector("[name='number']");
	let mask = IMask(accountTel, {
		mask: "00 000-00-00",
	});

	let favorite = document.querySelector(".liked");

	let accountChange = modal__account.querySelector("#edit");
	let accountDelete = modal__account.querySelector("#delete");
	let accountChangeModal = modal__account.querySelector(".change");
	let accountChangeModalForm = accountChangeModal.querySelector("form");
	let accountChangeCancel = accountChangeModalForm.querySelector(".cancel");
	let accountChangeName = accountChangeModalForm.querySelector("[name='name']");
	let accountChangeTel =
		accountChangeModalForm.querySelector("[name='number']");
	let changeMask = IMask(accountChangeTel, {
		mask: "00 000-00-00",
	});

	let cartModal = document.querySelector(".modal__cart");
	let cartList = cartModal.querySelector(".incart");
	let cartButton = document.querySelector(".cart");

	let user = getUser();

	let toUp = document.querySelector(".toUP")

	renderHotLinks(hotPlace, "/goods");
	parseCart(JSON.parse(localStorage.getItem("cart")), cartButton, cartList);
	renderCartPreview(
		JSON.parse(localStorage.getItem("cart")),
		cartList,
		cartButton
	);

	if (user) {
		let { name, number } = user;

		modal__account.dataset.logged = "true";
		renderAccount("[data-name]", "[data-number]", { name, number });
		changeMask.unmaskedValue = number;
		accountChangeName.value = name;
	} else {
		modal__account.dataset.logged = "false";
	}

	if (toUp) {
		toUp.onclick = function () {
			window.scrollTo({
				top: 0,
				behavior: "smooth",
			});
		}
	}


	sidebarCatalog.onclick = function () {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		})

		this.classList.toggle("show");

		backdropClear(
			[
				dropdownButton,
				...document.querySelectorAll(".modal"),
				accountChangeModal,
			],
			backdrop,
			document.body
		);

		if (this.classList.contains("show")) {
			backdropLaunch(modal__catalog, backdrop, document.body);
			renderCatalogMenu(catalog__items, "/goods");
		} else {
			backdropClear(
				[
					dropdownButton,
					...document.querySelectorAll(".modal"),
					accountChangeModal,
				],
				backdrop,
				document.body
			);
		}
	};

	sidebarAccount.onclick = function () {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		})
		this.classList.toggle("show");
		if (this.classList.contains("show")) {
			backdropClear(
				[
					dropdownButton,
					...document.querySelectorAll(".modal"),
					accountChangeModal,
				],
				backdrop,
				document.body
			);
			backdropLaunch(modal__account, backdrop, document.body);
		} else {
			backdropClear(
				[
					dropdownButton,
					...document.querySelectorAll(".modal"),
					accountChangeModal,
				],
				backdrop,
				document.body
			);
		}
	};

	sidebarFavorite.onclick = () => {
		location.assign("/pages/favorite/");
	};

	sidebarCart.onclick = () => {
		location.assign("/pages/cart/");
	};

	search.onfocus = async function () {
		backdropClear(
			[
				dropdownButton,
				...document.querySelectorAll(".modal"),
				accountChangeModal,
			],
			backdrop,
			document.body
		);
		await queryResults(this.value, box);
	};

	search.onblur = async function () {
		setTimeout(() => {
			box.innerHTML = "";
		}, 500);
	};

	search.oninput = async function () {
		const searchText = this.value;
		const regex = new RegExp(searchText, "gi");

		await queryResults(this.value, box);
		if (searchText.length === 0 || searchText === "") return;

		for (let div of box.querySelectorAll("li:not(.tupi_class)")) {
			let text = div.innerHTML;
			text = text.replace(/(<mark class="highlight">|<\/mark>)/gim, "");
			const newText = text.replace(regex, '<mark class="highlight">$&</mark>');
			div.innerHTML = newText;
		}
	};

	backdrop.onclick = function () {
		backdropClear(
			[
				dropdownButton,
				...document.querySelectorAll(".modal"),
				accountChangeModal,
			],
			backdrop,
			document.body
		);
	};

	dropdownButton.onclick = function () {
		this.classList.toggle("show");

		if (this.classList.contains("show")) {
			backdropLaunch(modal__catalog, backdrop, document.body);
			renderCatalogMenu(catalog__items, "/goods");
		} else {
			backdropClear(
				[
					dropdownButton,
					...document.querySelectorAll(".modal"),
					accountChangeModal,
				],
				backdrop,
				document.body
			);
		}
	};

	account.onclick = () => {
		backdropClear(
			[
				dropdownButton,
				...document.querySelectorAll(".modal"),
				accountChangeModal,
			],
			backdrop,
			document.body
		);
		backdropLaunch(modal__account, backdrop, document.body);
	};

	modal_closes.forEach((el) => {
		el.onclick = () => {
			backdropClear(
				[
					dropdownButton,
					...document.querySelectorAll(".modal"),
					accountChangeModal,
				],
				backdrop,
				document.body
			);
		};
	});

	accountName.oninput = (e) => {
		let value = e.target.value;
		if (!isNaN(value)) {
			accountName.value = value.slice(0, -1);
		}
	};

	accountForm.onsubmit = async function (e) {
		e.preventDefault();
		let data = {
			name: accountName.value,
			number: mask.unmaskedValue,
		};

		let check = await checkAccount(data.number, data.name);
		let error = this.querySelector("[data-error__account]");

		if (check == "login") {
			localStorage.setItem("user", JSON.stringify(data));
			modal__account.dataset.logged = "true";
			backdropClear(
				[
					dropdownButton,
					...document.querySelectorAll(".modal"),
					accountChangeModal,
				],
				backdrop,
				document.body
			);
			alert("Вы вошли в аккаунт");
			renderAccount("[data-name]", "[data-number]", data);
			changeMask.unmaskedValue = getUser().number;
			accountChangeName.value = getUser().name;

			error.classList.remove("show");
			error.innerHTML = "";
		} else if (check == "not_available") {
			error.classList.add("show");
			error.innerHTML = "Такой аккаунт уже существует с другим именем.";
		} else {
			post("/accounts", data);
			localStorage.setItem("user", JSON.stringify(data));
			modal__account.dataset.logged = "true";
			backdropClear(
				[
					dropdownButton,
					...document.querySelectorAll(".modal"),
					accountChangeModal,
				],
				backdrop,
				document.body
			);
			alert("Вы вошли в аккаунт");
			renderAccount("[data-name]", "[data-number]", data);
			changeMask.unmaskedValue = getUser().number;
			accountChangeName.value = getUser().name;

			error.classList.remove("show");
			error.innerHTML = "";
		}
	};

	accountChange.onclick = () => {
		modal__account.dataset.logged = "change";
	};

	accountChangeName.oninput = (e) => {
		let value = e.target.value;
		if (!isNaN(value)) {
			e.target.value = value.slice(0, -1);
		}
	};

	accountChangeModalForm.onsubmit = async function (e) {
		e.preventDefault();
		let data = {
			name: accountChangeName.value,
			number: changeMask.unmaskedValue,
		};

		if (data.name == getUser().name && data.number == getUser().number) {
			accountChangeModal.classList.remove("show");
			error.classList.remove("show");
			error.innerHTML = "";
			return;
		}

		let [check, result] = await checkCredentials(data.number, getUser().number);
		let error = this.querySelector("[data-error__account]");

		if (check == "available" || check == "same") {
			localStorage.setItem("user", JSON.stringify(data));
			put("/accounts/" + result.id, data);
			modal__account.dataset.logged = "true";
			accountChangeModal.classList.remove("show");
			alert("Изменения сохранены");
			renderAccount("[data-name]", "[data-number]", data);

			error.classList.remove("show");
			error.innerHTML = "";
		} else {
			error.classList.add("show");
			error.innerHTML = "Аккаунт с таким номером уже существует";
		}
	};

	accountChangeCancel.onclick = () => {
		modal__account.dataset.logged = "true";
	};

	accountDelete.onclick = () => {
		localStorage.removeItem("user");
		alert("Вы вышли с аккаунта");
		renderLeaveAccount("[data-name]", "[data-number]");
		modal__account.dataset.logged = "false";

		backdropClear(
			[
				dropdownButton,
				...document.querySelectorAll(".modal"),
				accountChangeModal,
			],
			backdrop,
			document.body
		);

		mask.unmaskedValue = "";
		changeMask.unmaskedValue = "";
	};

	favorite.onclick = () => {
		location.assign("/pages/favorite/");
	};

	cartButton.onmouseenter = () => {
		cartModal.classList.add("show");
	};

	cartButton.onmouseleave = () => {
		cartModal.classList.remove("show");
	};

	cartButton.onclick = function (e) {
		e.preventDefault();

		if (
			e.target.nodeName !== "button" &&
			e.target.nodeName !== "path" &&
			e.target.nodeName !== "svg"
		) {
			location.assign("/pages/cart/");
		}
	};
}
