# Contributing to VoteMithra

## Development Setup
1. Fork and clone the repository
2. Copy `.env.example` to `.env` and fill in your API keys
3. Run `npm install`
4. Run `npm run dev` to start the development server

## Code Standards
- All code must pass `npm run lint` with zero warnings
- All code must be formatted with `npm run format`
- New components MUST have PropTypes defined
- New utility functions MUST have JSDoc comments
- Minimum 70% test coverage required (enforced by CI)

## Pull Request Checklist
- [ ] `npm run lint` passes with 0 warnings
- [ ] `npx vitest run` passes with 0 failing tests
- [ ] `npm run build` succeeds
- [ ] New components have PropTypes
- [ ] New functions have JSDoc
- [ ] Accessibility: new interactive elements have aria attributes

## Commit Message Format
feat: add voter checklist feature
fix: resolve chatbot rate limit bug
docs: update API documentation
test: add quiz integration tests
chore: update dependencies
