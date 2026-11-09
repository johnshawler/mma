# Musical Mystery Agency

A static, iPad-friendly playable prototype of one Baroque case: **The Stolen Moonlight Folio**. Set in fictionalized 1735 Venice, Leipzig, and London.

## Play

Serve `dist/` from a web server. No installation, backend, audio, or account collection is needed by the game. The published game is available at https://mma.johnshawler.com.

The field guide teaches concerto, cantata, opera, and basso continuo. The player interviews witnesses, matches music descriptions, follows a route, compares three identification clues with four fictional suspects, and opens the recovered folio's musical lock. Incorrect choices can be retried. There is no timer or score.

All six era choices are visible. Medieval, Renaissance, Classical, Romantic, and Impressionistic are honestly marked upcoming. Only Baroque is playable.

Each new case shuffles the route, culprit, evidence order, suspect presentation, and answer order from a saved seed. Progress is held only in browser localStorage on the current device. A fresh case asks before replacing an unfinished saved case. Solved cases can be reopened, and their case-solved card downloaded as a PNG.

## Files

- `dist/index.html`, `style.css`, `app.js`: presentation and game interaction.
- `dist/engine.js`: deterministic case generation and validation.
- `dist/assets/`: optimized original scene artwork and reference-inspired brown-bearded professor.
- `artwork/`: original artwork sources.
- `artwork-prompts.md`: generation provenance.
- `tests/engine.test.mjs`: Node's built-in test runner, no dependencies.
- `scripts/package-worker.mjs`: prepares a reproducible multipart module bundle for Cloudflare.
- `cloudflare-deploy.json`: Worker name, domain, and runtime configuration (no secrets).

Run `npm test`. Run `node scripts/package-worker.mjs` to prepare the Worker bundle, then upload its modules using Cloudflare’s authenticated Worker script API. `dist/` remains portable to any static host.

## Verification

- 1,000 seeded cases checked for all six routes, all four possible culprits, all six evidence orders, exact clue-to-profile consistency, unique identification, and valid randomized answer sets.
- Complete browser playthrough, including deliberate wrong answers, wrong destination, wrong suspect, and wrong final key, then successful completion.
- Casebook opening/closing, autosave/reload/continue, solved-case restoration, and PNG card download verified.
- Visual responsive QA at 1180×757, 1024×768, 768×1024, and 390×844 through browser rendering.
- Actual iPad Safari hardware was not available for testing. Uses standard modern browser APIs (modules, dialog, localStorage, canvas, WebP).

## Historical boundaries

The case, professor, witnesses, suspects, and stolen collection are invented. The agency's professor is an out-of-period guide. Travel is narratively compressed. Illustrations evoke historical settings, not exact reconstructions. The casebook differentiates city-specific clues from musical forms, which were not exclusive to one city. Approximate era dates overlap.
