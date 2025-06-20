# Resolviq - Product Requirements Document

## Project Overview

- **Product Name:** Resolviq
- **Prepared By:** Dustin Liddick
- **Date:** 2025-06-20
- **Version:** 1.0

### Summary
Resolviq is a lightweight, Flask-based troubleshooting journal and report generator designed for technical engineers and support staff. It helps users capture command-line investigations in a structured, repeatable way. By guiding users through a step-by-step workflow—automatically numbering steps, capturing command inputs, results, and analysis—it ensures documentation is complete and consistent. The final report can be copied directly into Obsidian in a well-formatted markdown layout, aiding long-term knowledge sharing.

---

## Goals and Objectives

### Primary Goal
To streamline and standardize the process of documenting technical investigations, reducing time-to-resolution and improving institutional knowledge retention.

### Success Metrics / KPIs
- 100% of steps auto-numbered and logged without manual formatting
- One-click report generation in Obsidian-compatible markdown
- < 2 minutes average to create a technical report after issue resolution

### Non-Goals (Out of Scope)
- Real-time collaboration or multi-user editing
- Cloud storage or backend data persistence
- Authentication and user management

---

## Stakeholders

| Role | Name | Responsibility |
|------|------|----------------|
| Product Owner | Dustin Liddick | Feature definition, roadmap |
| Engineering | Dustin Liddick | Architecture & implementation |
| Design | N/A | Minimal UI, developer-led |
| QA | Dustin Liddick | Manual functional validation |
| Others | (Optional) | Peer testers or reviewers |

---

## Target Users

### Who is this for?
System engineers, DevOps, SREs, and support personnel who want a fast way to track troubleshooting steps and generate clean technical reports.

### User Stories / Use Cases
- As a system engineer, I want to capture each shell command and its output during an incident so I can review my process later.
- As a developer, I want to generate a markdown summary of my fix to paste into Obsidian.
- As a support team lead, I want consistent report formatting to ensure our team shares troubleshooting strategies.

---

## Requirements

### Functional Requirements

| ID | Requirement Description | Priority | Notes |
|----|------------------------|----------|-------|
| FR1 | Auto-number each step and allow users to input Command, Output, Notes | High | Supports keyboard-only workflow |
| FR2 | "Next Step" button appends current input and clears the fields | High | Input validation required |
| FR3 | Display a live summary of all entered steps | Medium | Scrollable/expandable list |
| FR4 | Resolution section allows entry of root cause, solution, prevention | High | Free-text input |
| FR5 | One-click "Generate Report" to build a full markdown document | High | Copy to clipboard |
| FR6 | Obsidian-ready formatting (markdown with code blocks and headers) | High | Compatible with Obsidian paste |
| FR7 | Ability to reset or start a new issue | Medium | Clears all state |

### Non-Functional Requirements
- **Performance:** Sub-second response to step entries and markdown generation
- **Scalability:** Local use only; no horizontal scaling required
- **Security:** Runs locally; no user auth required
- **Accessibility:** Keyboard navigation preferred; ARIA roles optional

---

## Wireframes / UI Mockups

See `/frontend/templates/integrated_cockpit.html` for live layout.

### Main UI includes:
- Top issue metadata section
- Three-panel step entry (Command, Output, Notes)
- Button: "Next Step"
- Live list of steps below
- Textarea for resolution
- Button: "Generate Technical Report"
- Output window with rendered markdown

---

## Technical Requirements

- **Platform:** Web (local Flask app)
- **Languages/Frameworks:** Python 3.11, Flask, Jinja2, HTML/CSS, JS
- **Authentication:** None (local use)
- **APIs:** N/A (no external APIs)
- **Data Storage:** In-memory (no persistent DB needed)
- **DevOps:** Podman/Flask run locally; no CI/CD pipeline yet
- **Dependencies:** flask, flask-wtf, wtforms (optional), clipboard.js

---

## Testing & Validation

### Test Types
- **Unit Tests:** Basic step formatting logic, markdown generator
- **Integration Tests:** Full workflow from entry → output

### Acceptance Criteria
- All step inputs are saved and numbered correctly
- Markdown output includes headers and code blocks
- Copy to clipboard includes full report

### Edge Cases & Error Handling
- Empty fields should warn the user
- Long outputs should scroll, not overflow

---

## Timeline

| Phase | Start Date | End Date | Deliverable |
|-------|------------|----------|-------------|
| Planning | 2025-06-18 | 2025-06-20 | This PRD, basic wireframes |
| Development | 2025-06-20 | 2025-06-30 | Working prototype |
| Testing | 2025-07-01 | 2025-07-05 | Bugfixes, edge case tests |
| Launch | 2025-07-06 | 2025-07-07 | Local release v1.0 |

---

## Open Questions

- Should the markdown output also include timestamps per step?
- Should this be containerized or turned into an installable desktop app (e.g., Electron/PyWebView)?
- Would users want to save sessions locally for long-running investigations?

---

## Revision History

| Date | Version | Description of Change | Author |
|------|---------|----------------------|--------|
| 2025-06-20 | 1.0 | Initial draft | Dustin Liddick |