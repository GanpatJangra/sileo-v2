import { sileo } from "sileo-v2";

const toastOptions = (message, options = {}) => ({
	title: message,
	...options,
});

const expandedToastOptions = (message, description, options = {}) => ({
	title: message,
	description,
	...options,
});

/**
 * Small application-facing wrapper around Sileo.
 *
 * Keeping this adapter in one place gives the app a consistent message-first
 * API while preserving access to every native Sileo option.
 */
export const toast = {
	success: (message, options = {}) =>
		sileo.success(toastOptions(message, options)),
	error: (message, options = {}) =>
		sileo.error(toastOptions(message, options)),
	warn: (message, options = {}) =>
		sileo.warning(toastOptions(message, options)),
	info: (message, options = {}) =>
		sileo.info(toastOptions(message, options)),
	sExpend: (message, description, options = {}) =>
		sileo.success(expandedToastOptions(message, description, options)),
	eExpend: (message, description, options = {}) =>
		sileo.error(expandedToastOptions(message, description, options)),
	wExpend: (message, description, options = {}) =>
		sileo.warning(expandedToastOptions(message, description, options)),
	iExpend: (message, description, options = {}) =>
		sileo.info(expandedToastOptions(message, description, options)),
};
