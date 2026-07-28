import { createRequire } from "node:module";
import { sileo, Toaster } from "../dist/index.mjs";

const require = createRequire(import.meta.url);
const React = require("react");
const { act, create } = require("react-test-renderer");

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
globalThis.window = globalThis;
globalThis.requestAnimationFrame = (callback) => {
	callback(0);
	return 1;
};
globalThis.cancelAnimationFrame = () => {};

const callbacks = [];
const realSetTimeout = globalThis.setTimeout;
globalThis.setTimeout = (callback, delay) => {
	callbacks.push({ callback, delay });
	return callbacks.length;
};

const rendered = (renderer) => JSON.stringify(renderer.toJSON());
const occurrences = (value, needle) => value.split(needle).length - 1;

let renderer;

try {
	await act(async () => {
		renderer = create(
			React.createElement(Toaster, {
				limit: 2,
				enqueue: true,
				avoidDuplicates: true,
			}),
		);
	});

	let firstId;
	let duplicateId;

	await act(async () => {
		firstId = sileo.info({ title: "First", duration: null });
		sileo.info({ title: "Second", duration: null });
		sileo.info({ title: "Third", duration: null });
		duplicateId = sileo.info({ title: "First", duration: null });
	});

	const limited = rendered(renderer);
	if (!limited.includes("First") || !limited.includes("Second")) {
		throw new Error("The first two toasts were not rendered within the limit.");
	}
	if (limited.includes("Third")) {
		throw new Error("A queued toast rendered before a visible slot opened.");
	}
	if (duplicateId !== firstId || occurrences(limited, "First") !== 1) {
		throw new Error("Duplicate prevention did not reuse the active toast.");
	}

	await act(async () => {
		sileo.dismiss(firstId);
	});
	const exitTimer = callbacks.find(({ delay }) => delay === 600);
	if (!exitTimer) throw new Error("Expected the dismissal exit timer.");

	await act(async () => {
		exitTimer.callback();
	});
	if (!rendered(renderer).includes("Third")) {
		throw new Error("The next queued toast was not promoted after dismissal.");
	}

	await act(async () => {
		sileo.clear();
		renderer.update(
			React.createElement(Toaster, {
				limit: 1,
				enqueue: true,
			}),
		);
	});

	await act(async () => {
		sileo.info({ title: "Visible", duration: null });
		sileo.info({ title: "Queued", duration: null });
		sileo.warning({
			title: "Immediate",
			duration: null,
			skipQueue: true,
		});
	});

	const skipped = rendered(renderer);
	if (!skipped.includes("Immediate") || skipped.includes("Queued")) {
		throw new Error(`skipQueue did not bypass the pending queue: ${skipped}`);
	}

	await act(async () => {
		sileo.clear();
		renderer.update(
			React.createElement(Toaster, {
				limit: 1,
				enqueue: false,
			}),
		);
	});

	await act(async () => {
		sileo.info({ title: "Oldest", duration: null });
		sileo.info({ title: "Newest", duration: null });
	});

	const replacementTimer = callbacks
		.filter(({ delay }) => delay === 600)
		.at(-1);
	if (!replacementTimer) throw new Error("Expected a replacement exit timer.");

	await act(async () => {
		replacementTimer.callback();
	});

	const replaced = rendered(renderer);
	if (replaced.includes("Oldest") || !replaced.includes("Newest")) {
		throw new Error("Non-queued limiting did not replace the oldest toast.");
	}

	console.log("queue, limit, duplicate, and skipQueue tests passed");
} finally {
	await act(async () => {
		sileo.clear();
		renderer?.unmount();
	});
	globalThis.setTimeout = realSetTimeout;
}
