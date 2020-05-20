(() => {
	const selector = document.getElementById("view_options");
	chrome.storage.sync.get("mockSponge_openType", (kvp) => {
		let selectedIndex;
		Array.from(selector.options).some((item, index) => {
			if (item.value === kvp.mockSponge_openType) {
				selectedIndex = index;
				return true;
			}
		});
		selector.selectedIndex = selectedIndex;
	});

	selector.addEventListener("input", (event) => {
		chrome.storage.sync.set({
			mockSponge_openType: event.currentTarget.value,
		});
	});
})();
