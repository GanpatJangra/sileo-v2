import { useEffect, useState } from "react";
import {
	sileo,
	Toaster,
	type SileoPosition,
	type SileoState,
} from "sileo-v2";

const states: Array<{
	state: SileoState;
	label: string;
	symbol: string;
	copy: string;
}> = [
	{ state: "success", label: "Success", symbol: "✓", copy: "Changes saved" },
	{ state: "error", label: "Error", symbol: "×", copy: "Upload failed" },
	{ state: "warning", label: "Warning", symbol: "!", copy: "Storage is almost full" },
	{ state: "info", label: "Info", symbol: "i", copy: "A new version is ready" },
	{ state: "action", label: "Action", symbol: "→", copy: "Invite sent to Naveen" },
	{ state: "loading", label: "Loading", symbol: "↻", copy: "Syncing workspace" },
];

const positions: SileoPosition[] = [
	"top-left",
	"top-center",
	"top-right",
	"bottom-left",
	"bottom-center",
	"bottom-right",
];

const fills: Record<SileoState, string> = {
	success: "#f6fff1",
	error: "#fff4f1",
	warning: "#fff9e8",
	info: "#eef8ff",
	action: "#f5f0ff",
	loading: "#f4f5f7",
};

const snippets = {
	install: "npm install sileo-v2",
	quick: `import { sileo } from "sileo-v2";

// Success
sileo.success("Profile saved");

// Error
sileo.error("Could not save profile");

// Warning
sileo.warning("Storage is almost full");

// Info
sileo.info("A new version is ready");

// Action
sileo.action({
  title: "Invite sent to Naveen",
  button: {
    title: "Undo",
    onClick: () => sileo.success("Invite restored"),
  },
});

// Loading → success
const toastId = sileo.loading("Syncing workspace");
sileo.update(toastId, {
  title: "Workspace synced",
  state: "success",
});

// Promise toast
sileo.promise(publishPackage(), {
  loading: "Publishing package…",
  success: "Package published",
  error: "Publish failed",
});

// Custom toast
sileo.show({
  title: "A toast with personality",
  description: "Custom color, shape, timing, and content.",
  fill: "#e8ff67",
  roundness: 22,
});`,
	setup: `import { Toaster } from "sileo-v2";
import "sileo-v2/styles.css";

export default function App() {
  return (
    <>
      <YourApp />
      <Toaster position="top-right" />
    </>
  );
}`,
	usage: `import { sileo } from "sileo-v2";

sileo.success("Profile saved");
sileo.error("Could not save profile");

sileo.info({
  title: "Upload complete",
  description: "Your file is ready to share.",
  position: "bottom-right",
});`,
};

function App() {
	const [theme, setTheme] = useState<"dark" | "light">(() => {
		const saved = window.localStorage.getItem("sileo-demo-theme");
		if (saved === "dark" || saved === "light") return saved;
		return window.matchMedia("(prefers-color-scheme: light)").matches
			? "light"
			: "dark";
	});
	const [position, setPosition] = useState<SileoPosition>("top-right");
	const [duration, setDuration] = useState(6000);
	const [autopilot, setAutopilot] = useState(true);
	const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
	const [showPlaygroundCode, setShowPlaygroundCode] = useState(false);
	const [activeToastId, setActiveToastId] = useState<string | null>(null);

	useEffect(() => {
		document.documentElement.dataset.theme = theme;
		document.documentElement.style.colorScheme = theme;
		window.localStorage.setItem("sileo-demo-theme", theme);
	}, [theme]);

	const showState = (state: SileoState) => {
		const item = states.find((entry) => entry.state === state)!;
		const options = {
			title: item.copy,
			description:
				state === "loading"
					? "This toast stays visible until the task is complete."
					: "Motion, timing, and hierarchy are already handled.",
			position,
			duration: state === "loading" ? null : duration,
			autopilot,
			fill: fills[state],
		};

		switch (state) {
			case "success":
				sileo.success(options);
				break;
			case "error":
				sileo.error(options);
				break;
			case "warning":
				sileo.warning(options);
				break;
			case "info":
				sileo.info(options);
				break;
			case "action":
				sileo.action({
					...options,
					button: {
						title: "Undo",
						onClick: () =>
							sileo.success({
								title: "Invite restored",
								position,
								fill: fills.success,
							}),
					},
				});
				break;
			case "loading": {
				const id = sileo.loading(options);
				window.setTimeout(
					() =>
						sileo.update(id, {
							title: "Workspace synced",
							description: "Everything is up to date.",
							state: "success",
							position,
							fill: fills.success,
						}),
					1800,
				);
				break;
			}
		}
	};

	const showPromise = () => {
		sileo.promise(
			new Promise<string>((resolve) =>
				window.setTimeout(() => resolve("sileo-v2"), 1800),
			),
			{
				loading: "Publishing package…",
				success: (name) => ({
					title: `${name} is live`,
					description: "The release is available on npm.",
					fill: fills.success,
				}),
				error: "Publish failed",
				position,
			},
		);
	};

	const showCustom = () => {
		sileo.show({
			title: "A toast with personality",
			description: "Use custom colors, actions, icons, and React content.",
			position,
			duration,
			autopilot,
			fill: "#e8ff67",
			roundness: 22,
			button: {
				title: "Love it",
				onClick: () =>
					sileo.success({
						title: "Excellent choice",
						position,
						fill: fills.success,
					}),
			},
		});
	};

	const createPersistent = () => {
		const id = sileo.info({
			title: "Persistent notification",
			description: "This toast stays open until you dismiss or update it.",
			position,
			duration: null,
			autopilot: false,
			fill: fills.info,
		});
		setActiveToastId(id);
	};

	const updateActive = () => {
		if (!activeToastId) {
			const id = sileo.loading({
				title: "Preparing an update",
				description: "A new toast was created because none was active.",
				position,
				duration: null,
				fill: fills.loading,
			});
			setActiveToastId(id);
			window.setTimeout(() => {
				sileo.update(id, {
					title: "Toast updated in place",
					description: "The same ID now renders a success state.",
					state: "success",
					duration: null,
					fill: fills.success,
				});
			}, 900);
			return;
		}

		sileo.update(activeToastId, {
			title: "Toast updated in place",
			description: "State, copy, color, and duration changed without duplication.",
			state: "success",
			position,
			duration: null,
			fill: fills.success,
		});
	};

	const dismissActive = () => {
		if (!activeToastId) {
			sileo.warning({
				title: "No active lifecycle toast",
				description: "Create a persistent toast first, then dismiss it by ID.",
				position,
				fill: fills.warning,
			});
			return;
		}

		sileo.dismiss(activeToastId);
		setActiveToastId(null);
	};

	const clearAll = () => {
		sileo.clear();
		setActiveToastId(null);
	};

	const copySnippet = async (name: string, value: string) => {
		await navigator.clipboard.writeText(value);
		setCopiedSnippet(name);
		window.setTimeout(
			() => setCopiedSnippet((current) => (current === name ? null : current)),
			1400,
		);
	};

	return (
		<div className="site-shell">
			<Toaster
				position={position}
				offset={18}
				options={{ duration, autopilot }}
			/>

			<header className="topbar">
				<a className="brand" href="#top" aria-label="Sileo home">
					<span className="brand-mark">S</span>
					<span>Sileo</span>
					<sup>v2</sup>
				</a>
				<nav aria-label="Main navigation">
					<a href="#playground">Playground</a>
					<a href="#api">API lab</a>
					<a href="#usage">How to use</a>
					<a href="#features">Features</a>
					<a
						href="https://www.npmjs.com/package/sileo-v2"
						target="_blank"
						rel="noreferrer"
					>
						npm ↗
					</a>
				</nav>
				<div className="header-actions">
					<button
						className="theme-toggle"
						type="button"
						onClick={() =>
							setTheme((current) => (current === "dark" ? "light" : "dark"))
						}
						aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
						title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
					>
						<span className="theme-track" aria-hidden="true">
							<span>{theme === "dark" ? "☾" : "☀"}</span>
						</span>
						<small>{theme === "dark" ? "Dark" : "Light"}</small>
					</button>
					<a
						className="github-link"
						href="https://github.com/GanpatJangra/sileo-v2"
						target="_blank"
						rel="noreferrer"
					>
						View source
					</a>
				</div>
			</header>

			<main id="top">
				<section className="hero">
					<div className="hero-copy">
						<div className="eyebrow">
							<span className="pulse" />
							Physics-based React toasts
						</div>
						<h1>
							Feedback that
							<span> feels alive.</span>
						</h1>
						<p className="hero-lede">
							Sileo turns everyday notifications into fluid, tactile moments.
							Small API. Thoughtful defaults. Zero design debt.
						</p>
						<div className="hero-actions">
							<button className="primary-cta" onClick={() => showState("success")}>
								Try a toast <span>↗</span>
							</button>
							<button
								className="install-command"
								onClick={() => copySnippet("install", snippets.install)}
							>
								<code>npm install sileo-v2</code>
								<span>{copiedSnippet === "install" ? "Copied" : "Copy"}</span>
							</button>
						</div>
						<div className="proof-row">
							<span>React 18+</span>
							<span>TypeScript</span>
							<span>ESM + CJS</span>
							<span>Accessible</span>
						</div>
					</div>

					<div className="hero-art" aria-hidden="true">
						<div className="orbit orbit-one" />
						<div className="orbit orbit-two" />
						<div className="floating-toast toast-one">
							<span className="mini-icon success">✓</span>
							<div>
								<strong>Changes saved</strong>
								<small>Everything is up to date.</small>
							</div>
						</div>
						<div className="floating-toast toast-two">
							<span className="mini-icon info">i</span>
							<div>
								<strong>New version ready</strong>
								<small>Refresh when you are ready.</small>
							</div>
						</div>
						<div className="floating-toast toast-three">
							<span className="mini-icon loading">↻</span>
							<div>
								<strong>Publishing package</strong>
								<small>Building your release…</small>
							</div>
						</div>
						<div className="hero-stamp">
							<span>6</span>
							<small>positions</small>
						</div>
					</div>
				</section>

				<section className="playground-section" id="playground">
					<div className="section-heading">
						<div>
							<p className="section-kicker">Interactive playground</p>
							<h2>Click it. Feel it.</h2>
						</div>
						<p>
							Test every state, move the viewport, and tune the timing. The
							playground uses the same package you will install.
						</p>
					</div>

					<div className="playground-grid">
						<div className="state-panel">
							<div className="panel-label">
								<span>Toast states</span>
								<small>Choose a trigger</small>
							</div>
							<div className="state-grid">
								{states.map((item) => (
									<button
										key={item.state}
										className={`state-card state-${item.state}`}
										onClick={() => showState(item.state)}
									>
										<span className="state-symbol">{item.symbol}</span>
										<span>
											<strong>{item.label}</strong>
											<small>{item.copy}</small>
										</span>
										<span className="state-arrow">↗</span>
									</button>
								))}
							</div>
							<div className="special-triggers">
								<button onClick={showPromise}>
									<span>Promise toast</span>
									<small>Loading → success</small>
								</button>
								<button onClick={showCustom}>
									<span>Custom toast</span>
									<small>Color + action</small>
								</button>
							</div>
						</div>

						<aside className="control-panel">
							<div className="panel-label">
								<span>Controls</span>
								<small>Make it yours</small>
							</div>

							<label className="control-group">
								<span>Position</span>
								<select
									value={position}
									onChange={(event) =>
										setPosition(event.target.value as SileoPosition)
									}
								>
									{positions.map((item) => (
										<option key={item} value={item}>
											{item
												.split("-")
												.map((word) => word[0].toUpperCase() + word.slice(1))
												.join(" ")}
										</option>
									))}
								</select>
							</label>

							<label className="control-group">
								<span>
									Duration <output>{(duration / 1000).toFixed(1)}s</output>
								</span>
								<input
									type="range"
									min="2000"
									max="10000"
									step="500"
									value={duration}
									onChange={(event) => setDuration(Number(event.target.value))}
								/>
							</label>

							<label className="toggle-row">
								<span>
									<strong>Autopilot</strong>
									<small>Expand and collapse automatically</small>
								</span>
								<input
									type="checkbox"
									checked={autopilot}
									onChange={(event) => setAutopilot(event.target.checked)}
								/>
								<span className="toggle-ui" />
							</label>

							<div className="playground-code">
								<button
									className="code-toggle"
									type="button"
									aria-expanded={showPlaygroundCode}
									aria-controls="playground-code-snippet"
									onClick={() => setShowPlaygroundCode((current) => !current)}
								>
									<span>{showPlaygroundCode ? "Hide code" : "Show code"}</span>
									<i aria-hidden="true">{showPlaygroundCode ? "−" : "+"}</i>
								</button>

								{showPlaygroundCode && (
									<div className="code-preview" id="playground-code-snippet">
										<div className="code-top">
											<span>
												<i />
												<i />
												<i />
											</span>
											<small>example.tsx</small>
											<button
												type="button"
												onClick={() => copySnippet("quick", snippets.quick)}
											>
												{copiedSnippet === "quick" ? "Copied ✓" : "Copy"}
											</button>
										</div>
										<pre>
											<code>{snippets.quick}</code>
										</pre>
									</div>
								)}
							</div>
						</aside>
					</div>
				</section>

				<section className="api-section" id="api">
					<div className="section-heading">
						<div>
							<p className="section-kicker">Complete API lab</p>
							<h2>Control the full lifecycle.</h2>
						</div>
						<p>
							Create a toast that stays visible, update it by ID, dismiss only
							that instance, or clear the entire stack.
						</p>
					</div>

					<div className="api-grid">
						<div className="lifecycle-card">
							<div className="lifecycle-head">
								<div>
									<span className="api-index">01 / lifecycle</span>
									<h3>One toast. Four operations.</h3>
								</div>
								<span
									className={`status-pill ${activeToastId ? "is-active" : ""}`}
								>
									<i />
									{activeToastId ? "Active toast" : "Ready"}
								</span>
							</div>

							<div className="lifecycle-flow" aria-label="Toast lifecycle">
								<button onClick={createPersistent}>
									<code>show</code>
									<strong>Create persistent</strong>
									<small>duration: null</small>
								</button>
								<span aria-hidden="true">→</span>
								<button onClick={updateActive}>
									<code>update</code>
									<strong>Update by ID</strong>
									<small>loading → success</small>
								</button>
								<span aria-hidden="true">→</span>
								<button onClick={dismissActive}>
									<code>dismiss</code>
									<strong>Dismiss active</strong>
									<small>target one toast</small>
								</button>
							</div>

							<button className="clear-button" onClick={clearAll}>
								<span>Clear every visible toast</span>
								<code>sileo.clear()</code>
							</button>
						</div>

						<aside className="coverage-card">
							<span className="api-index">02 / coverage</span>
							<h3>Everything, on one page.</h3>
							<p>
								Every public trigger and lifecycle method is wired to a live
								control in this demo.
							</p>
							<div className="api-chips" aria-label="Supported API methods">
								{[
									"show",
									"success",
									"error",
									"warning",
									"info",
									"loading",
									"action",
									"promise",
									"update",
									"dismiss",
									"clear",
								].map((method) => (
									<code key={method}>.{method}()</code>
								))}
							</div>
							<div className="coverage-note">
								<span>11</span>
								<small>interactive API demos</small>
							</div>
						</aside>
					</div>
				</section>

				<section className="usage-section" id="usage">
					<div className="section-heading">
						<div>
							<p className="section-kicker">Copy-ready guide</p>
							<h2>Ship a consistent toast API.</h2>
						</div>
						<p>
							Install once, mount one toaster, then import Sileo directly
							wherever product feedback is needed.
						</p>
					</div>

					<div className="usage-layout">
						<div className="snippet-stack">
							<article className="snippet-card">
								<div className="snippet-head">
									<span>
										<small>Step 01</small>
										<strong>Install and mount</strong>
									</span>
									<button
										type="button"
										onClick={() => copySnippet("setup", snippets.setup)}
									>
										{copiedSnippet === "setup" ? "Copied ✓" : "Copy code"}
									</button>
								</div>
								<pre>
									<code>{snippets.setup}</code>
								</pre>
							</article>

							<article className="snippet-card">
								<div className="snippet-head">
									<span>
										<small>Step 02</small>
										<strong>Import and use Sileo directly</strong>
									</span>
									<button
										type="button"
										onClick={() => copySnippet("usage", snippets.usage)}
									>
										{copiedSnippet === "usage" ? "Copied ✓" : "Copy code"}
									</button>
								</div>
								<pre>
									<code>{snippets.usage}</code>
								</pre>
							</article>
						</div>

						<aside className="practice-card">
							<span className="api-index">Recommended pattern</span>
							<h3>Why use Sileo directly?</h3>
							<ul className="benefit-list">
								<li>
									<span>01</span>
									<div>
										<strong>Small, focused API</strong>
										<p>Import one object and trigger any notification state.</p>
									</div>
								</li>
								<li>
									<span>02</span>
									<div>
										<strong>String-first shortcuts</strong>
										<p>Pass a message directly for common success and error feedback.</p>
									</div>
								</li>
								<li>
									<span>03</span>
									<div>
										<strong>Full options when needed</strong>
										<p>Pass position, duration, actions, and styling when needed.</p>
									</div>
								</li>
								<li>
									<span>04</span>
									<div>
										<strong>No wrapper to maintain</strong>
										<p>Use the documented package API without an application adapter.</p>
									</div>
								</li>
							</ul>

							<div className="best-practice">
								<strong>Best approach</strong>
								<p>
									Use short toasts for outcomes. Add a description only when it
									helps recovery or decision-making, and keep a single
									<code>&lt;Toaster /&gt;</code> mounted at the app root.
								</p>
							</div>
						</aside>
					</div>
				</section>

				<section className="feature-section" id="features">
					<div className="section-heading compact">
						<div>
							<p className="section-kicker">Built for the details</p>
							<h2>Delight, without the detour.</h2>
						</div>
					</div>
					<div className="feature-grid">
						<article>
							<span className="feature-number">01</span>
							<h3>Physics-inspired motion</h3>
							<p>Springy transitions that feel natural without a runtime animation dependency.</p>
						</article>
						<article>
							<span className="feature-number">02</span>
							<h3>Promise aware</h3>
							<p>Move from loading to success, error, or action using one focused API.</p>
						</article>
						<article>
							<span className="feature-number">03</span>
							<h3>Made to adapt</h3>
							<p>Six positions, custom content, actions, colors, timing, and styling hooks.</p>
						</article>
						<article>
							<span className="feature-number">04</span>
							<h3>Typed end to end</h3>
							<p>First-class TypeScript declarations across both ESM and CommonJS builds.</p>
						</article>
					</div>
				</section>
			</main>

			<footer>
				<a className="brand footer-brand" href="#top">
					<span className="brand-mark">S</span>
					<span>Sileo</span>
				</a>
				<p>Make the small moments feel considered.</p>
				<div>
					<a href="#usage">How to use</a>
					<a
						href="https://github.com/GanpatJangra/sileo-v2/blob/main/skills/toast/SKILL.md"
						target="_blank"
						rel="noreferrer"
					>
						Toast skill
					</a>
					<a href="https://www.npmjs.com/package/sileo-v2">npm</a>
					<a href="https://github.com/GanpatJangra/sileo-v2">GitHub</a>
				</div>
			</footer>
		</div>
	);
}

export default App;
