# Interface language

English is the default interface language. The HE / EN control at the top of
chat, voice chat, and administration switches the interface immediately.
Hebrew translations and right-to-left layout apply only when HE is selected.
The control remains available in both languages.

The selection is stored in `localStorage` as `aiAssistants.uiLanguage` and
shared between pages and open tabs on the same origin. When browser storage
is unavailable, switching still works for the current page.

Speech language is a separate preference. Changing interface language does
not change speech recognition, voices, existing conversations, user-written
tool descriptions, or raw logs. Built-in image prompts use the selected UI
language; user-written prompts are preserved. There is no automatic message
translation or external translation service.

## Maintaining translations

- Add matching keys to the `en` and `he` dictionaries in `i18n.js`.
- Keep static HTML in English and mark labels with `data-i18n="key"`.
- Use `data-i18n-title`, `data-i18n-placeholder`, `data-i18n-aria-label`, and
  `data-i18n-alt` for translated attributes.
- Use `I18n.setText(element, I18n.message(key, params))` for changing UI text.
  Use `I18n.html(key, params)` inside generated UI markup. Both retain keys
  so existing elements update when the language changes.
- Use `I18n.t(key, params)` when a string is required immediately, such as
  a confirmation dialog or an outgoing built-in prompt.
- Use `I18n.error(key, params)` for application errors and
  `I18n.errorDetail(error)` in message parameters to keep error text localized
  when switching languages after an error has occurred.
- Use `data-user-content` and `dir="auto"` for original conversation content.
  Do not mark user content, raw logs, or code for translation.
- Directional layout rules live in `i18n.css`. Keep code and technical
  identifiers left-to-right in both languages.

Restart the Node server after updating `server.js`, then refresh open pages.
The health endpoint exposes a numeric `modelCount` so the admin UI can
format service summaries in either language.
