export function parseCart(cartArray, cartButton) {
	if (!cartArray) return;
	if (!cartButton) return;
	if (cartArray.length > 0) cartButton.dataset.elems = cartArray.length;
	else cartButton.removeAttribute("data-elems");
}
