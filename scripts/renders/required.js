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
								<img src="/public/images/appstore.svg" alt="appstore" />
								<span>AppStore</span>
							</a>
							<a class="googleplay">
								<img src="/public/images/googleplay.svg" alt="googleplay" />
								<span>Google Play</span>
							</a>
						</div>

						<div class="social-links">
							<h3>Uzum в соцсетях</h3>
							<div class="social-links__apps">
								<a href="#">
									<img src="/public/images/socials/instagram.svg" alt="" />
								</a>

								<a href="#">
									<img src="/public/images/socials/telegram.svg" alt="" />
								</a>

								<a href="#">
									<img src="/public/images/socials/youtube.svg" alt="" />
								</a>

								<a href="#">
									<img src="/public/images/socials/facebook.svg" alt="" />
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

					<span>
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

						<button type="submit">Сохранить</button>
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

	`;
}

export function loadMainEvents() {
	let hotPlace = document.querySelector(".menu-list");
	let dropdownButton = document.querySelector(".dropdown");
	let account = document.querySelector(".account");

	const box = document.querySelector(".searchResults");
	const search = document.getElementById("search");

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

	search.onfocus = async function () {
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
		accountChangeModal.classList.toggle("show");
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
	}

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
