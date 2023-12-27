export function renderAccount(name, number, user) {
	document
		.querySelectorAll(name)
		.forEach((item) => (item.innerHTML = user.name));

	document
		.querySelectorAll(number)
		.forEach((item) => (item.innerHTML = user.number));
}


export function renderLeaveAccount(name, number) {
	document
		.querySelectorAll(name)
		.forEach((item) => (item.innerHTML = "Войти"));
	document
		.querySelectorAll(number)
		.forEach((item) => (item.innerHTML = "00 000-00-00"));
}