# SFL app features

One folder per feature, so each can be built and approved on its own.

This folder sits outside `public/`, so nothing here goes live. A feature only goes live when its approved version is copied into `public/`.

## The rules

1. Build and preview a feature in its own folder.
2. Danny approves the preview.
3. Copy it into `public/`, then update the Master Hub.

## Features

- `main-app/`: training app. Live code is `public/app/index.html` and `public/demo/index.html`. Status: live, with one preview waiting.
- `progress-graph/`: block v block and last 24 sessions. Status: module built, not in the app yet.
- `body-stats/`: body numbers linked to the check-in. Status: spec, waiting on Danny.
- `food-log/`: meal log with photo estimates. Status: spec, waiting on Danny.
- `not-a-calorie-calculator/`: Status: built, not on the site yet.
- `protein-cost-calculator/`: Status: source file missing, see its README.
- `one-rm-calculator/`: Status: preview, waiting on approval.
- `join-the-tribe-module/`: banner and final call to action. Status: preview, waiting on approval.

## Shared saved data

Features on the same web address can read the same saved data on a member's phone. The app saves to one store, and features read from it, so a member never types the same number twice.

Today the data stays on the phone. Accounts, backup, leaderboards and photo estimates need a database and a small server step, and neither exists yet.
