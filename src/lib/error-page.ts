export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="theme-color" content="#12345b" />
    <title>The match is paused | KheloLocal</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      :root { color-scheme: light; font-family: Inter, ui-sans-serif, system-ui, -apple-system, sans-serif; color: #12345b; background: #f5f3eb; }
      * { box-sizing: border-box; }
      body { min-height: 100vh; margin: 0; padding: 1.5rem clamp(1.25rem, 5vw, 4rem); display: flex; flex-direction: column; background: radial-gradient(ellipse at 70% 65%, rgba(244, 163, 64, .13), transparent 40%), #f5f3eb; }
      header, main, footer { width: min(100%, 72rem); margin-inline: auto; }
      header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
      .brand { display: inline-flex; align-items: center; gap: .75rem; color: inherit; font-size: 1.3rem; font-weight: 900; letter-spacing: -.05em; text-decoration: none; }
      .brand img { width: 2.5rem; height: 2.5rem; border: 2px solid #f4a340; border-radius: 50%; }
      .brand span span { color: #d88720; }
      .location, .eyebrow, .score-label, .score-note, footer { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; text-transform: uppercase; letter-spacing: .14em; }
      .location { color: #586679; font-size: .65rem; font-weight: 700; line-height: 1.7; text-align: right; }
      main { flex: 1; display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: clamp(2rem, 7vw, 6rem); padding-block: 4rem; }
      .scoreboard { position: relative; display: grid; min-height: min(72vw, 28rem); place-content: center; overflow: hidden; border-radius: 2rem; color: #faf8f0; text-align: center; background-color: #12345b; background-image: linear-gradient(rgba(250,248,240,.075) 1px, transparent 1px), linear-gradient(90deg, rgba(250,248,240,.075) 1px, transparent 1px); background-size: 2rem 2rem; box-shadow: 0 1.5rem 4rem rgba(18,52,91,.18); }
      .scoreboard::before, .scoreboard::after { position: absolute; content: ""; pointer-events: none; }
      .scoreboard::before { inset: 1.25rem; border: 1px solid rgba(250,248,240,.2); border-radius: 1.25rem; }
      .scoreboard::after { left: 50%; top: 50%; width: 9rem; aspect-ratio: 1; border: 1px dashed rgba(250,248,240,.24); border-radius: 50%; transform: translate(-50%,-50%); }
      .score-label { position: relative; z-index: 1; color: #f4a340; font-size: .7rem; font-weight: 800; }
      .score { position: relative; z-index: 1; margin: .5rem 0 0; color: #f4a340; font-size: clamp(7rem, 21vw, 13rem); font-weight: 950; line-height: .8; letter-spacing: -.1em; }
      .score-note { position: relative; z-index: 1; justify-self: center; margin-top: 1.5rem; border: 1px solid rgba(250,248,240,.3); border-radius: 999px; padding: .65rem 1rem; font-size: .65rem; font-weight: 800; }
      .score-note::before { display: inline-block; width: .5rem; height: .5rem; margin-right: .55rem; border-radius: 50%; background: #f4a340; content: ""; }
      .copy { max-width: 31rem; }
      .eyebrow { color: #3e8e35; font-size: .7rem; font-weight: 800; }
      h1 { max-width: 12ch; margin: 1.25rem 0; font-size: clamp(2.6rem, 6vw, 4.5rem); line-height: .98; letter-spacing: -.06em; }
      .description { max-width: 32rem; margin: 0; color: #586679; font-size: 1.05rem; line-height: 1.7; }
      .actions { display: flex; flex-wrap: wrap; gap: .75rem; margin-top: 2rem; }
      a.button, button { display: inline-flex; min-height: 3rem; align-items: center; justify-content: center; border: 1px solid transparent; border-radius: .5rem; padding: .75rem 1.25rem; font: inherit; font-size: .875rem; font-weight: 800; cursor: pointer; text-decoration: none; }
      .primary { background: #12345b; color: #fff; }
      .secondary { border-color: rgba(18,52,91,.2) !important; color: #12345b; background: #fffdf8; }
      a:focus-visible, button:focus-visible { outline: 3px solid #d88720; outline-offset: 3px; }
      footer { border-top: 1px solid rgba(18,52,91,.15); padding-top: 1.25rem; color: #586679; font-size: .6rem; font-weight: 700; }
      @media (max-width: 700px) { main { grid-template-columns: 1fr; gap: 2.5rem; padding-block: 3rem; } .scoreboard { min-height: min(78vw, 24rem); } .copy { margin-inline: auto; } }
      @media (prefers-reduced-motion: no-preference) { .scoreboard { animation: field-arrive .45s ease-out both; } @keyframes field-arrive { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } } }
    </style>
  </head>
  <body>
    <header>
      <a class="brand" href="/" aria-label="KheloLocal home">
        <img src="/android-chrome-192x192.png" alt="" width="40" height="40" />
        <span>Khelo<span>Local</span></span>
      </a>
      <div class="location">Indore, India<br />Play local. Prove your game.</div>
    </header>
    <main>
      <section class="scoreboard" aria-label="KheloLocal match status, 500">
        <p class="score-label">KheloLocal / 500</p>
        <p class="score" aria-hidden="true">500</p>
        <p class="score-note">Play paused</p>
      </section>
      <section class="copy" aria-labelledby="error-heading">
        <p class="eyebrow">Match status / 500</p>
        <h1 id="error-heading">The match is paused.</h1>
        <p class="description">Something interrupted the play on our side. Give it another try, or head back to the local game.</p>
        <div class="actions">
          <button class="primary" onclick="location.reload()">Try again</button>
          <a class="button secondary" href="/">Back to home</a>
        </div>
      </section>
    </main>
    <footer>Built for the players, teams, and tournaments next door.</footer>
  </body>
</html>`;
}
