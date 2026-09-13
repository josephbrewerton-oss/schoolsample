# Security Policy

## Supported Versions

We actively provide security patches and updates to the current release branch.

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Zero-Egress Safeguarding Architecture

The St Joseph's Curriculum Portal is engineered as a zero-cloud-egress, client-side application. Student queries, answers, voice inputs, and progress records remain strictly inside the local browser sandbox (IndexedDB) and do not transit external servers.

## Reporting a Vulnerability

If you discover a security vulnerability or potential data privacy concern within this project, please report it privately:

1. **GitHub Private Vulnerability Reporting (Preferred):** Use the "Report a vulnerability" button under the **Security** tab of this repository.
2. **Direct Email:** If you cannot use GitHub's reporting tool, email: **security@yourdomain.com** (replace with your contact email).

### What to Include
* A description of the issue and potential impact.
* Step-by-step reproduction instructions or a minimal proof of concept.
* Browser version, operating system, and hardware environment.

### Our Commitment
* We will acknowledge receipt of your vulnerability report within **48 hours**.
* We will provide a status update or fix timeline within **7 business days**.
* Please do not disclose vulnerabilities publicly until a patch has been released and deployed.
