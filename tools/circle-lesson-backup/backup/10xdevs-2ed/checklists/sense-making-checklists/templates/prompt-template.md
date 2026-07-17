# Prompt Template (3C Formula)

**Copy this template and fill in the blanks for your AI prompts.**

---

## Basic Template (Quick use)

```
**Command:** [Action verb] the [what] to [goal]

**Context:**
Tech: [Your tech stack]
File: [Path to file]
Problem: [What needs to be fixed/added]

**Constraints:**
- [Requirement 1]
- [Requirement 2]

**Format:** [How should output look]
```

---

## Detailed Template (For complex tasks)

```markdown
**Command (WHAT to do):**
[Action verb] the [component/function/file] to [achieve goal]

**Context (WHERE & WHY):**

Tech Stack:
- Frontend: [Framework, version]
- Backend: [Language, framework, version]
- Database: [Type, version]
- Other: [Libraries, tools]

File(s) affected:
- [path/to/file1.ts]
- [path/to/file2.ts]

Current state:
- [What exists now]
- [How it currently works]
- [What's the problem]

Business context:
- [Why we need this]
- [User story or requirement]
- [Success criteria]

**Constraints (HOW it should be done):**

Requirements:
- [Must have feature 1]
- [Must have feature 2]
- [Must handle edge case X]

Limitations:
- [Don't use library Y]
- [Must support browser Z]
- [Max file size: X KB]

Code style:
- [Follow existing patterns in project]
- [Use TypeScript strict mode]
- [Add JSDoc comments for public APIs]

**Format (OUTPUT structure):**
[Specify how you want the response]

Examples:
- "Return only the refactored function, not the entire file"
- "Provide step-by-step implementation plan first, then code"
- "Format as JSON: { code: '...', tests: '...', explanation: '...' }"
- "Include before/after comparison"

---

[Paste relevant code or additional info here]
```

---

## Examples (filled in)

### Example 1: Simple refactor

```
**Command:** Refactor the calculateDiscount function to handle tiered pricing

**Context:**
Tech: TypeScript 5.0, Node.js 20
File: src/utils/pricing.ts
Problem: Current function only supports single 10% discount, need tiered pricing (regular: 10%, premium: 20%, vip: 50%)

**Constraints:**
- Keep same function signature (don't break existing callers)
- Add JSDoc comments
- Handle invalid tier names (throw error)
- Add inline comments for each tier

**Format:** Return the complete refactored function with JSDoc
```

---

### Example 2: New feature

```
**Command:** Implement user profile avatar upload with image preview

**Context:**

Tech Stack:
- Frontend: React 18 + TypeScript 5
- Styling: Tailwind CSS 3.x
- File upload: Will use existing `uploadToS3` util
- Max file size: 5MB

File(s) affected:
- src/components/UserProfile.tsx (add upload UI)
- src/api/user.ts (add upload endpoint)

Current state:
- UserProfile displays static avatar (user.avatarUrl)
- No upload functionality exists
- User can only change avatar via admin panel

Business context:
- Users want to upload custom avatars
- Must show image preview before upload
- Upload should be async (don't block UI)

**Constraints:**

Requirements:
- File types: JPEG, PNG only
- Max size: 5MB (show error if exceeded)
- Show image preview after selection
- Show loading state during upload
- Update UI immediately after success

Limitations:
- Use existing `uploadToS3` utility function
- Don't change UserProfile prop interface
- Keep existing Tailwind styling

Code style:
- Use React hooks (no class components)
- Add TypeScript types for all props/state
- Handle errors with user-friendly messages

**Format:**
1. Implementation plan (numbered steps)
2. Code for UserProfile component
3. Code for API endpoint
4. Example usage
```

---

## Advanced Templates

### Template: Socratic Method (AI asks YOU questions)

```
Before you start working on this task, ask me 5-10 clarifying questions to better understand:
- Technical context (tech stack, current implementation, constraints)
- My goals (what I'm trying to achieve, success criteria)
- What I might have missed or forgotten (edge cases, requirements)
- Assumptions to verify (what's unclear or ambiguous)

After I answer your questions, propose a solution.

Task: [Your task description]
Context: [Any context you already know]
```

---

### Template: Exploratory (AI shows multiple approaches)

```
Show me 3-5 different approaches to [task], each with:
- Brief description (1-2 sentences)
- Pros & cons
- Estimated complexity (Simple / Medium / Complex)
- When to use this approach
- Code example or pseudocode

Then recommend the best 1-2 approaches for my specific context.

Task: [Your task]
Context:
- Tech stack: [Your stack]
- Constraints: [Your constraints]
- Current state: [What you have now]
- Goal: [What you want to achieve]
```

---

## Tips for Using This Template

1. **Always fill in Command (minimum)** - bez jasnego polecenia AI będzie zgadywać
2. **More Context = Better Results** - don't be shy, podaj wszystko co wiesz
3. **Be specific with Constraints** - "as fast as possible" is vague, "< 100ms response time" is specific
4. **Save common prompts** - jeśli robisz coś often, zapisz filled template jako snippet

---

## How to Save as IDE Snippet

### VS Code:
1. Go to: File → Preferences → User Snippets
2. Select language (e.g., "markdown")
3. Add snippet:

```json
"AI Prompt Template": {
  "prefix": "aiprompt",
  "body": [
    "**Command:** ${1:action} the ${2:what} to ${3:goal}",
    "",
    "**Context:**",
    "Tech: ${4:stack}",
    "File: ${5:path}",
    "Problem: ${6:description}",
    "",
    "**Constraints:**",
    "- ${7:requirement}",
    "",
    "**Format:** ${8:output format}",
    ""
  ],
  "description": "3C Prompt Template for AI"
}
```

4. Usage: Type `aiprompt` + Tab → template expands

---

**Related checklists:**
- `01-pierwszy-prompt.md` - Learn how to use this template
- `02-ai-nie-rozumie-wymagan.md` - When AI doesn't understand your prompt

---

**Metadata:**
- Wersja: 1.0
- Data utworzenia: 2025-11-10
- Format: 3C (Command + Context + Constraints)
- Copy-paste ready: YES
