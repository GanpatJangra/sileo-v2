import { createRequire } from "node:module";
import { sileo, Toaster } from "../dist/index.mjs";

const require = createRequire(import.meta.url);
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");

const callbacks = [];
const realSetTimeout = globalThis.setTimeout;

globalThis.setTimeout = (callback, delay) => {
	callbacks.push({ callback, delay });
	return callbacks.length;
};

try {
	sileo.clear();
	sileo.show({ id: "shared", title: "First toast", duration: null });
	sileo.dismiss("shared");
	sileo.show({ id: "shared", title: "Replacement toast", duration: null });

	const before = renderToStaticMarkup(React.createElement(Toaster));
	const exitTimer = callbacks.find(({ delay }) => delay === 600);

	if (!exitTimer) {
		throw new Error("Expected the 600 ms dismissal timer to be scheduled.");
	}

	exitTimer.callback();
	const after = renderToStaticMarkup(React.createElement(Toaster));

	if (!before.includes("Replacement toast")) {
		throw new Error("Replacement toast was not rendered before the stale timer.");
	}

	if (!after.includes("Replacement toast")) {
		throw new Error("A stale dismissal timer removed the replacement toast.");
	}

	console.log("stale-dismiss regression test passed");
} finally {
	globalThis.setTimeout = realSetTimeout;
	sileo.clear();
}
