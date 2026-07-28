import type { ReactNode } from "react";

export type SileoState =
	| "success"
	| "loading"
	| "error"
	| "warning"
	| "info"
	| "action";

export interface SileoStyles {
	title?: string;
	description?: string;
	badge?: string;
	button?: string;
}

export interface SileoButton {
	title: string;
	onClick: () => void;
}

export const SILEO_POSITIONS = [
	"top-left",
	"top-center",
	"top-right",
	"bottom-left",
	"bottom-center",
	"bottom-right",
] as const;

export type SileoPosition = (typeof SILEO_POSITIONS)[number];

export interface SileoOptions {
	/**
	 * Stable identifier used to replace/update an existing toast instead of
	 * creating a new one. If omitted, Sileo creates a unique id for the toast.
	 */
	id?: string;
	state?: SileoState;
	title?: string;
	description?: ReactNode | string;
	position?: SileoPosition;
	duration?: number | null;
	icon?: ReactNode | null;
	styles?: SileoStyles;
	fill?: string;
	roundness?: number;
	autopilot?: boolean | { expand?: number; collapse?: number };
	button?: SileoButton;
	/**
	 * Bypass an enabled queue for this toast. When the visible limit is full,
	 * the oldest visible toast is dismissed to make room.
	 */
	skipQueue?: boolean;
}
