# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 0.x.x   | Yes       |

## Reporting a Vulnerability

If you discover a security vulnerability in Zoe's ATA Dojo, please report it responsibly.

**Do NOT open a public issue.** Instead, email **chiragmirani@gmail.com** with:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if you have one)

We will acknowledge receipt within 48 hours and provide an update within 7 days.

## Scope

This project is a client-side browser game. Security concerns primarily involve:

- Cross-site scripting (XSS) via user-generated content
- Malicious assets or dependencies
- Service worker cache poisoning
- Privacy concerns with any future analytics or data collection

## Dependencies

We keep dependencies minimal and audit regularly. If you notice a vulnerable dependency, please report it.
