const hashify = (str) => {
	return [...str].map((char) => char.codePointAt(0).toString(16)).join(":");
};

const generateCaptionURL = (str = "") => {
	return `https://denk0403.github.io/Mocking-Spongebob/#mockType:asl:${hashify(
		str
	)}`;
};

const loadImageScriptString = (src) => {
	return `
        document.addEventListener('DOMContentLoaded', () => {
            document.getElementById('upload').src = "${src}";
        });
    `;
};

chrome.contextMenus.create({
	id: "0",
	title: "Mock with Spongebob...",
	contexts: ["selection", "image"],
	visible: true,
});

chrome.contextMenus.onClicked.addListener((info) => {
	if (info.menuItemId === "0") {
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
					url: `https://denk0403.github.io/Mocking-Spongebob/#image`,
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
});
