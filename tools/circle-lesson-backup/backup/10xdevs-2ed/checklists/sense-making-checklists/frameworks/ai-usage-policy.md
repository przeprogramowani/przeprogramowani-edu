# AI Usage Policy Template

**Organization:** [Your Company Name]
**Effective Date:** [Date]
**Review Cycle:** Quarterly
**Owner:** [Tech Lead / Security Team]

---

## 1. Approved AI Tools

### Primary Tools (Full approval)
| Tool | Purpose | Tier | Access | Cost/user |
|------|---------|------|--------|-----------|
| GitHub Copilot Business | Code autocomplete, generation | Enterprise | All developers | $19/month |
| [Tool name] | [Purpose] | [Tier] | [Who can access] | $[cost] |

### Secondary Tools (Conditional approval)
| Tool | Purpose | Approval Required | Restrictions |
|------|---------|-------------------|--------------|
| ChatGPT Team | Architectural discussions | Tech Lead | No code paste with secrets |
| [Tool name] | [Purpose] | [Who approves] | [Restrictions] |

### Prohibited Tools
- ChatGPT Free Tier (data retention concerns)
- [Any tools with inadequate security/privacy]

---

## 2. Data Classification & Usage Rules

| Data Sensitivity | Can use AI? | Approved Tools | Restrictions |
|------------------|-------------|----------------|--------------|
| **Public** (OSS, public docs) | ✅ Yes | Any approved tool | None |
| **Internal** (business logic, no PII) | ✅ Yes | Enterprise AI only | No full paste (snippets OK) |
| **Confidential** (proprietary IP) | ⚠️  Limited | Enterprise + anonymization | Approval required |
| **Restricted** (PII, secrets, auth) | 🔴 No | None (or local AI only) | Absolutely no cloud AI |
| **Regulated** (HIPAA, PCI-DSS) | 🔴 No | Manual development only | Zero AI usage |

---

## 3. Prohibited Actions (RED LINES)

### NEVER paste to AI:
- [ ] Database credentials (passwords, connection strings, API keys)
- [ ] Customer PII (names, emails, addresses, phone numbers)
- [ ] Payment information (credit cards, bank accounts)
- [ ] Health information (if HIPAA-covered)
- [ ] Proprietary algorithms (competitive advantage code)
- [ ] Security vulnerability details (before patched)
- [ ] Production logs containing real user data

### Examples of violations:
```typescript
// ❌ NEVER paste to AI:
const config = {
  dbPassword: "prod_db_secret_123",
  apiKey: "sk-..."
};

// ✅ OK to paste (anonymized):
const config = {
  dbPassword: process.env.DB_PASSWORD,
  apiKey: process.env.API_KEY
};
```

---

## 4. Required Safeguards

### Before using AI:
- [ ] Use approved enterprise tools (not free tier)
- [ ] Enable MFA on AI tool accounts
- [ ] Classify data sensitivity (see table above)
- [ ] Anonymize if needed (replace real data with fake)

### While using AI:
- [ ] Review AI output before using (don't blindly accept)
- [ ] Understand code AI generates (no "magic code")
- [ ] Add tests for AI-generated code
- [ ] Follow code review process (same bar as hand-written)

### After using AI:
- [ ] Label PR if AI-assisted (use "ai-assisted" label)
- [ ] Document non-obvious AI choices (why this approach?)
- [ ] Report issues/incidents immediately

---

## 5. Code Review Requirements

### AI-generated code must:
1. **Pass all tests** (unit + integration)
2. **Be reviewed** (same process as hand-written code)
3. **Be understood** by author (can explain every line)
4. **Handle errors** properly (no uncaught exceptions)

### Extra scrutiny for:
- Security-sensitive code (auth, payments, PII)
- Core business logic (revenue-critical paths)
- Performance-critical code (high-traffic endpoints)

---

## 6. Incident Response

### If you accidentally paste secrets/PII to AI:

**IMMEDIATELY:**
1. **STOP** - Don't paste anything else
2. **ROTATE** - Immediately rotate credentials (assume compromised)
3. **REPORT** - Alert Security team: [security@company.com]
4. **DOCUMENT** - Write incident report (what, when, how, impact)

**No blame culture:** Mistakes happen. Report quickly so we can respond.

---

## 7. Training Requirements

### Mandatory for all developers:
- [ ] **Initial training:** "AI Security & Usage" (1 hour, pass quiz with 80%+)
- [ ] **Annual refresh:** Yearly re-certification
- [ ] **New tool training:** When adopting new AI tool, complete onboarding

### Training covers:
- Company AI policy (this document)
- What NOT to paste to AI
- Approved tools & how to use
- Incident response process

---

## 8. Enforcement

### Violations:
- **First offense (accidental):** Coaching, additional training
- **Repeat offense:** Performance review, possible tool access removal
- **Severe violation (intentional secret leak):** Escalate to HR, potential termination

### Monitoring:
- Pre-commit hooks (detect secrets before commit)
- Code review (reviewers check AI usage compliance)
- Quarterly audits (random sample of AI-assisted PRs)
- Enterprise AI analytics (usage logs, if available)

---

## 9. Policy Updates

**Review cycle:** Quarterly
**Update process:**
1. Engineering Manager reviews policy
2. Team feedback collected (retrospectives)
3. Security team approves changes
4. Updated policy communicated to team

**Last updated:** [Date]
**Next review:** [Date + 3 months]

---

## 10. Questions & Feedback

**Contact:**
- **Policy questions:** [Tech Lead email]
- **Security concerns:** [Security team email]
- **Tool access requests:** [IT/Engineering Manager email]

**Feedback:** Open issue in [team-docs repo] or discuss in [team channel]

---

**Acknowledgment:**
By using AI tools at [Company Name], I acknowledge that I have read, understood, and agree to follow this AI Usage Policy.

**Name:** _______________
**Date:** _______________
**Signature:** _______________

