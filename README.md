# 🃏 Raja Mantri Chor Sipahi

A browser-based implementation of the classic Indian card game **Raja Mantri Chor Sipahi** — featuring a cinematic role-reveal sequence, smart bot opponents, a slot-machine guessing animation, and a live scoreboard.

---

## 📖 About the Game

**Raja Mantri Chor Siphai** (also spelled _Sipahi_) is a popular Indian social card game traditionally played with 4 players. Each round, four roles are secretly distributed: **Raja** (King), **Mantri** (Minister), **Chor** (Thief), and **Sipahi** (Soldier). The Sipahi's job is to identify who among the players is the Chor — and the outcome determines everyone's points for that round.

This project brings the game to the browser as a **1-vs-3 bots** experience with smooth animations and an immersive cinematic reveal flow.

---

## ✨ Features

- 🎭 **Cinematic Role Reveal** — Roles are unveiled step-by-step with timed animations: your card, then the Raja with an announcement icon, then the Sipahi.
- 🤖 **3 Bot Opponents** — BOT-1, BOT-2, and BOT-3 take up the remaining positions each round.
- 🎰 **Slot-Machine Guessing** — When a bot is the Sipahi, a bouncing highlight animation (slot machine effect with ease-out timing) plays before the bot commits to a guess.
- 👆 **User Guessing** — When the user is the Sipahi, they can click any non-Raja bot card to accuse someone as the Chor.
- 📢 **Game Announcements** — An animated message overlay ("Sipahi Sipahi, Chor ko pakdo!") plays each round to set the mood.
- 📊 **Live Scoreboard** — A sidebar table tracks per-round and cumulative scores for all players.
- 🏅 **Points Badge on Cards** — Each card shows the points earned for that round after reveal.
- 🔁 **Round-based Gameplay** — Click "Next Round" to reset and play indefinitely; scores accumulate across rounds.
- 🎨 **Dark Theme UI** — Clean, modern dark interface using the Inter font from Google Fonts.
- 📱 **Responsive Design** — Playable on both desktop and mobile.

---

## 🎮 How to Play

### Step 1 — Pick a Card

At the start of each round, four face-down cards are displayed. Click **any card** to claim it as your own. The card you pick becomes your position (center-bottom / USER).

### Step 2 — Reveal Your Role

After the cards rearrange, click your own card (center-bottom) to reveal your secret role.

### Step 3 — The Cinematic Sequence

1. Your role is revealed.
2. The **Raja card** flips over with a 📢 announcement icon.
3. The message _"Sipahi Sipahi, Chor ko pakdo!"_ appears.
4. The game proceeds based on who is the Sipahi:

   | Sipahi is…   | What happens                                                                          |
   | ------------ | ------------------------------------------------------------------------------------- |
   | **The User** | You choose which bot you think is the Chor. Highlighted cards are clickable.          |
   | **A Bot**    | A slot-machine animation bounces between candidates, then the bot commits to a guess. |

### Step 4 — Results

All cards flip, points are awarded, and a result table is shown. Click **Next Round ▶** to play again.

---

## 🏆 Scoring

Points depend on whether the Sipahi correctly identifies the Chor.

### ✅ If the Chor is caught correctly:

| Role   | Points |
| ------ | ------ |
| Raja   | 1000   |
| Mantri | 800    |
| Sipahi | 500    |
| Chor   | 0      |

### ❌ If the Sipahi guesses wrong:

| Role   | Points |
| ------ | ------ |
| Raja   | 1000   |
| Mantri | 800    |
| Sipahi | 0      |
| Chor   | 500    |

> The Chor gets 500 points as a reward for not getting caught. The Sipahi loses their 500 for the failed guess.

---

## 🗂️ Project Structure

```
Raja-Mantri-Chor-Siphai/
├── index.html       # Game layout: cards, overlays, scoreboard sidebar
├── styles.css       # Styling, animations, dark theme, responsive rules
├── script.js        # All game logic (role assignment, reveal flow, scoring)
└── images/
    └── Question.png # Default face-down card image
```

---

## 🧠 Code Overview

### `index.html`

- Four `.card` elements (`#left`, `#right`, `#up`, `#down`) that are repositioned via CSS classes each round.
- `#gameMessage` overlay for cinematic announcements.
- `#resultBox` overlay with round summary table and "Next Round" button.
- `#asideTable` sidebar scoreboard tracking per-round and total scores.

### `styles.css`

- CSS class-based card positioning: `.center-bottom`, `.left-center`, `.up-center`, `.right-center`.
- Card reveal animation via `.card-revealing`.
- Slot-machine highlight via `.candidate-highlight` and `.bot-selected`.
- `.points-badge` that pops up on each card after the round ends.
- Responsive layout using flexbox.

### `script.js`

| Function               | Description                                                                     |
| ---------------------- | ------------------------------------------------------------------------------- |
| `handleCardPick(card)` | Handles the user's initial card selection; rearranges card positions.           |
| `setKirdaar()`         | Shuffles roles and assigns them secretly to all four cards.                     |
| `buildPlayerMap()`     | Maps card IDs to player names (`USER`, `BOT-1`, `BOT-2`, `BOT-3`).              |
| `handleUserReveal()`   | Orchestrates the cinematic role-reveal sequence after the user taps their card. |
| `userGuessing()`       | Activates candidate cards for the user to click when they are the Sipahi.       |
| `botGuessing()`        | Runs the slot-machine animation and commits to a random bot guess.              |
| `bouncingSelection()`  | Slot-machine helper — bounces highlights with ease-out timing over 14 steps.    |
| `showResult()`         | Calculates round scores, shows points badges, and populates the result table.   |
| `updateSidebar()`      | Appends a row to the scoreboard and updates cumulative totals.                  |
| `resetRound()`         | Clears all overlays, class states, and badges to prepare for the next round.    |

---

## 🚀 Getting Started

### Prerequisites

- Any modern web browser (Chrome, Firefox, Safari, Edge).
- No build tools, no dependencies — it's pure HTML + CSS + JS.

### Run Locally

**Option 1 — Double-click:**
Open `index.html` directly in your browser OR [click here](https://kaushikbarnwal.github.io/Raja-Mantri-Chor-Siphai).

**Option 2 — VS Code Live Server:**

1. Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension.
2. Right-click `index.html` → **Open with Live Server**.

**Option 3 — Clone & open:**

```bash
git clone https://github.com/KaushikBarnwal/Raja-Mantri-Chor-Siphai.git
cd Raja-Mantri-Chor-Siphai
# open index.html in your browser
```

---

## 🛠️ Customization

| What to change           | Where                                                              |
| ------------------------ | ------------------------------------------------------------------ |
| Point values             | `POINTS_CORRECT` and `POINTS_WRONG` objects in `script.js`         |
| Bot count / names        | `playerMap` assignments and sidebar column headers in `index.html` |
| Card face-down image     | Replace `images/Question.png`                                      |
| Slot-machine speed/steps | `totalBounces` and `delays` array in `bouncingSelection()`         |
| Countdown timing         | `setTimeout` delays in `handleUserReveal()` and `botGuessing()`    |
| Colors / fonts           | CSS variables / rules in `styles.css`                              |

---

## 🌐 Live Demo

> Open `index.html` in your browser — no server required.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙏 Acknowledgements

- Inspired by the classic Indian parlour game played across generations.
- Font: [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts.
