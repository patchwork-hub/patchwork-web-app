# Contributing to Patchwork Web App

We love your input! We want to make contributing to Patchwork Web App as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

## Code Style

We use several tools to maintain code quality:

- **ESLint** for code linting
- **TypeScript** for type checking
- **Prettier** for code formatting (configured in ESLint)

### Running Quality Checks

```bash
# Lint your code
pnpm lint

# Fix linting issues automatically
pnpm lint:fix

# Type checking
pnpm type-check

# Run all tests
pnpm test
```

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

### Examples

```bash
feat: add user authentication
fix: resolve login redirect issue
docs: update API documentation
test: add unit tests for user service
```

## Setting Up Development Environment

### Prerequisites

- Node.js 18.x or 20.x
- pnpm 10.18.0+

### Installation

1. Fork and clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/patchwork-web-app.git
cd patchwork-web-app
```

2. Install dependencies:
```bash
pnpm install
```

3. Start development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Testing

We maintain high test coverage and all contributions should include appropriate tests.

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode during development
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

### Writing Tests

- Write unit tests for all new functions and components
- Use descriptive test names
- Test both happy paths and edge cases
- Mock external dependencies appropriately

Example test structure:
```typescript
import { render, screen } from '@testing-library/react'
import { MyComponent } from './MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Expected text')).toBeInTheDocument()
  })

  it('should handle edge case', () => {
    // Test implementation
  })
})
```

## Project Structure

```
src/
├── app/                 # Next.js pages (App Router)
├── components/          # Reusable UI components
│   ├── atoms/          # Basic building blocks
│   ├── molecules/      # Simple component combinations
│   ├── organisms/      # Complex UI components
│   └── templates/      # Page layouts
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries and configurations
├── providers/          # React context providers
├── services/           # API calls and external services
├── stores/             # State management (Zustand)
├── types/              # TypeScript type definitions
└── utils/              # Helper functions and utilities
```

## Component Guidelines

### Atomic Design

We follow atomic design principles:

- **Atoms**: Basic building blocks (buttons, inputs, labels)
- **Molecules**: Simple combinations of atoms (search form, navigation item)
- **Organisms**: Complex components (header, footer, product grid)
- **Templates**: Page layouts without specific content

### TypeScript

- Always use TypeScript for new code
- Define proper interfaces and types
- Use generic types where appropriate
- Avoid `any` type - use `unknown` if necessary

### React Best Practices

- Use functional components with hooks
- Keep components small and focused
- Use proper prop types
- Implement error boundaries where appropriate
- Use React.memo() for performance optimization when needed

## Security

- Never commit sensitive information (API keys, passwords, etc.)
- Use environment variables for configuration
- Validate all user inputs
- Follow OWASP security guidelines
- Report security vulnerabilities privately

## Documentation

- Update README.md if you change functionality
- Add JSDoc comments for complex functions
- Update API documentation for any API changes
- Include examples in documentation

## Bug Reports

We use GitHub issues to track bugs. Report a bug by [opening a new issue](https://github.com/patchwork-hub/patchwork-web-app/issues/new).

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## Feature Requests

We welcome feature requests! Please [open an issue](https://github.com/patchwork-hub/patchwork-web-app/issues/new) with:

- Clear description of the feature
- Use cases and motivation
- Possible implementation approaches
- Any alternatives you've considered

## Questions?

Feel free to:
- Open an issue with the "question" label
- Start a discussion in GitHub Discussions
- Reach out to maintainers

## License

By contributing, you agree that your contributions will be licensed under the MIT License.