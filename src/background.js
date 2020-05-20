const hashify = (str) => {
	return [...str].map((char) => char.codePointAt(0).toString(16)).join(":");
};

const generateURL = (str = "") => {
	return `https://denk0403.github.io/Mocking-Spongebob/#${hashify(str)}`;
};

const loadImageScriptString = (src) => {
	return `
        document.addEventListener('DOMContentLoaded', () => {
            document.getElementById('upload').src = "${src}";
        });
    `;
};

chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.sync.get("mockSponge_openType", (kvp) => {
		!kvp.mockSponge_openType &&
			chrome.storage.sync.set({
				mockSponge_openType: "new_tab",
			});
	});
});

chrome.contextMenus.create({
	id: "0",
	title: "Mock with Spongebob...",
	contexts: ["selection", "image"],
	visible: true,
});

chrome.contextMenus.onClicked.addListener((info) => {
	if (info.menuItemId === "0") {
		chrome.storage.sync.get("mockSponge_openType", (kvp) => {
			let openMode = kvp.mockSponge_openType;
			switch (openMode) {
				case "new_tab":
					if (info.selectionText) {
						// handle mock selected text
						chrome.tabs.create({
							url: generateURL(info.selectionText),
							active: true,
						});
					} else if (info.srcUrl) {
						// handle mock image
						chrome.tabs.create(
							{
								url: generateURL(),
								active: true,
							},
							(tab) => {
								chrome.tabs.executeScript(tab.id, {
									runAt: "document_start",
									code: loadImageScriptString(info.srcUrl),
								});
							}
						);
					}
					break;
				case "window":
					if (info.selectionText) {
						// handle mock selected text
						chrome.windows.create({
							url: generateURL(info.selectionText),
							focused: true,
							type: "normal",
							state: "maximized",
						});
					} else if (info.srcUrl) {
						// handle mock image
						chrome.windows.create(
							{
								url: generateURL(),
								focused: true,
								type: "normal",
								state: "maximized",
							},
							(tab) => {
								chrome.tabs.executeScript(tab.id, {
									runAt: "document_start",
									code: loadImageScriptString(info.srcUrl),
								});
							}
						);
					}
					break;
				case "old_tab":
					chrome.tabs.query(
						{
							status: "complete",
							currentWindow: true,
							url: "https://denk0403.github.io/Mocking-Spongebob/*",
						},
						(tabs) => {
							if (tabs.length > 0) {
								if (info.selectionText) {
									// handle mock selected text
									chrome.tabs.update(tabs[0].id, {
										url: generateURL(info.selectionText),
										active: true,
									});
								} else if (info.srcUrl) {
									// handle mock image
									chrome.tabs.update(
										tabs[0].id,
										{
											url: generateURL(),
											active: true,
										},
										(tab) => {
											chrome.tabs.executeScript(tab.id, {
												runAt: "document_start",
												code: loadImageScriptString(info.srcUrl),
											});
										}
									);
								}
							} else {
								if (info.selectionText) {
									// handle mock selected text
									chrome.tabs.create({
										url: generateURL(info.selectionText),
										active: true,
									});
								} else if (info.srcUrl) {
									// handle mock image
									chrome.tabs.create(
										{
											url: generateURL(),
											active: true,
										},
										(tab) => {
											chrome.tabs.executeScript(tab.id, {
												runAt: "document_start",
												code: loadImageScriptString(info.srcUrl),
											});
										}
									);
								}
							}
						}
					);
					break;
				default:
					throw new Error(
						"Open mode type not available. Try reinstalling the extension."
					);
			}
		});
	}
});
