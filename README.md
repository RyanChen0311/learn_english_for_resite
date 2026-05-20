# English Vocabulary Learning App

> A browser-based vocabulary flashcard tool with **text-to-speech pronunciation**, letter-by-letter spelling, and **localStorage persistence** — no server required.

---

## Live Demo

👉 https://ryanche n0311.github.io/learn_english_for_resite/

---

## Features

- **Add words** — enter an English word and its Chinese translation
- **Auto spelling** — generates spaced-letter format automatically (e.g. `c • a • t`)
- **Text-to-speech** — click 🔊 to hear the word pronounced, spelled aloud, and translated
- **Persistent storage** — vocabulary saved to `localStorage`, survives page refresh
- **Named records** — save, load, and delete named word lists (e.g. "Week 1", "TOEIC")
- **Keyboard friendly** — press `Enter` in either input to add a word

---

## How Speech Works

```
Click 🔊
    │
    ├─ 1. Speak full word          (en-US, natural pronunciation)
    ├─ 2. Pause 800 ms
    ├─ 3. Spell each letter        (en-US, 300 ms between letters)
    ├─ 4. Pause 800 ms
    └─ 5. Read Chinese translation (zh-TW)
```

Uses the browser's built-in **Web Speech API** (`SpeechSynthesis`) — no external API key needed.

---

## Data Storage

All data is stored in the browser's `localStorage`:

| Key | Content |
|---|---|
| `vocabulary` | Current word list (JSON array) |
| `vocabulary_records` | Saved named records (JSON object) |

Data is never sent to any server.

---

## Project Structure

```
learn_english_for_resite/
├── index.html    # HTML structure + word card template
├── styles.css    # Layout and component styles
└── script.js     # VocabularyManager class — all app logic
```

---

## Running Locally

```bash
# Any static file server works
npx serve .
# open http://localhost:3000
```

> No build step, no dependencies — pure HTML / CSS / JS.

---

## Browser Support

Requires a browser that supports the **Web Speech API**:

| Browser | Support |
|---|---|
| Chrome / Edge | ✅ |
| Safari | ✅ |
| Firefox | ⚠️ Limited voice availability |

---

## License

MIT — see [LICENSE](LICENSE).
