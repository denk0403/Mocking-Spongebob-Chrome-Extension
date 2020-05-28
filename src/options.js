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

	document
		.getElementById("github_creator_link")
		.addEventListener("click", () => {
			chrome.tabs.create({ url: "https://github.com/denk0403", active: true });
		});

	document
		.getElementById("github_project_link")
		.addEventListener("click", () => {
			chrome.tabs.create({
				url: "https://github.com/denk0403/Mocking-Spongebob-Chrome-Extension",
				active: true,
			});
		});
})();
