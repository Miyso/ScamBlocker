# ScamBlocker

ScamBlocker is a privacy-focused Chrome extension designed to help users identify and block scam URLs and warn about suspicious emails. The extension works seamlessly with popular webmail providers (Gmail, Outlook, Yahoo, ProtonMail, Zoho) and provides real-time banners and warnings for potential impersonation attempts.

## Features

- **Scam URL Blocking:**
  - Automatically blocks access to known scam and remote access tool URLs using a built-in blocklist.
  - Users can add their own custom URLs or patterns to the blocklist.
  - Blocked URLs redirect to a local warning page.

- **Email Sender & Impersonation Warnings:**
  - Scans emails for sender addresses and subjects that may impersonate trusted companies.
  - Displays a warning banner if the sender does not match known good addresses for major brands (Amazon, PayPal, Microsoft, Apple, Google, banks, etc.).
  - Checks both subject and body for impersonation attempts (configurable).

- **Customizable Settings:**
  - Enable/disable sender banner, subject/body scanning, and default blocklist.
  - All settings are managed via a local settings page.

## Privacy & Security

**ScamBlocker does not collect, transmit, or store any personal information.**
- All scanning and blocking is performed locally within Chrome.
- Blocklists, settings, and user data are stored using Chrome's local storage and sync features.
- No information ever leaves your device, ensuring maximum privacy and security.

## Supported Webmail Providers
- Gmail
- Outlook
- Yahoo Mail
- ProtonMail
- Zoho Mail

## How It Works
- The extension uses Chrome's `declarativeNetRequest` API to block scam URLs.
- Content scripts scan email pages for sender and subject information, comparing them against a list of known good addresses.
- If a suspicious sender or impersonation attempt is detected, a warning banner is injected into the email view.

## Getting Started
1. Install ScamBlocker from the Chrome Web Store or load it as an unpacked extension.
2. Open the settings page to customize blocklists and warning options.
3. ScamBlocker will automatically protect you while browsing supported webmail providers and the web.

## Contributing
Contributions, suggestions, and bug reports are welcome! Please open an issue or submit a pull request.

## License
This project is licensed under the MIT License.

---
**ScamBlocker is built for privacy. Your data stays on your device.**
