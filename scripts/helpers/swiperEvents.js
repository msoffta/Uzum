export async function scrolClickEvent(onEventSwiper, usingSwiper) {
	onEventSwiper = await onEventSwiper;
	usingSwiper = await usingSwiper;
	
	onEventSwiper.on("click", function (swiper, event) {
		let activeIndex = event.target.parentElement.dataset.index; 
		usingSwiper.slideTo(+activeIndex);
		onEventSwiper.activeIndex = +activeIndex
		usingSwiper.activeIndex = +activeIndex
	})

	usingSwiper.on("slideChange", function (swiper) {
		onEventSwiper.slideTo(swiper.activeIndex)
		onEventSwiper.activeIndex = swiper.activeIndex
		usingSwiper.activeIndex = swiper.activeIndex
	})
}
