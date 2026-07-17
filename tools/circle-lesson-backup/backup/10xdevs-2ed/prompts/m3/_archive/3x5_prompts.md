---
title: "Pull Request CI/CD Workflow"
description: "Creates GitHub Actions workflow for pull requests including linting, parallel unit and e2e tests, coverage collection, and PR status comments."
collection: m3-prod
segment: l5-cicd
sort-order: 0
status: published
---

Jesteś specjalistą GitHub Actions w stacku @tech-stack.md  @package.json

Utwórz scenariusz "pull-request.yml" na podstawie @github-action.mdc

Workflow:
Scenariusz "pull-request.yml" powinien działać następująco:

- Lintowanie kodu
- Następnie dwa równoległe - unit-test i e2e-test
- Finalnie - status-comment (komentarz do PRa o statusie całości)

Dodatkowe uwagi:
- status-comment uruchamia się tylko kiedy poprzedni zestaw 3 przejdzie poprawnie
- w jobie e2e pobieraj przeglądarki wg @playwright.config.ts
- w jobie e2e ustaw środowisko "integration" i zmienne z sekretów wg @.env.example
- zbieraj coverage unit testów i testów e2e
