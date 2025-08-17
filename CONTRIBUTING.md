# Contributing to KTFile

Thank you for your interest in contributing to KTFile! This document provides guidelines and information for
contributors.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)

## Getting Started

### Prerequisites

- Node.js (version 14 or higher recommended)
- npm or yarn package manager
- Git

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ktfile.git
   cd ktfile
   ```
3. Add the original repository as upstream:
   ```bash
   git remote add upstream https://github.com/OguzhanUmutlu/ktfile.git
   ```

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Run tests:
   ```bash
   npm test
   ```

## Project Structure

```
ktfile/
├── src/                    # TypeScript source files
│   ├── async/             # Async file system implementations
│   │   ├── FileAsync.ts   # Main async file class
│   │   └── IAsyncFS.ts    # Async file system interface
│   ├── sync/              # Sync file system implementations
│   │   ├── FileSync.ts    # Main sync file class
│   │   └── ISyncFS.ts     # Sync file system interface
│   ├── IFile.ts           # Base file interface
│   ├── Utils.ts           # Utility functions
│   └── ktfile.ts           # Main entry point
├── types/                 # Generated TypeScript declarations
├── dist/                  # Compiled JavaScript output
├── tests/                 # Test files
│   ├── test.ts           # Main test suite
│   ├── test.html         # Browser tests
│   └── clean.js          # Test cleanup utility
├── rollup.config.mjs     # Build configuration
├── tsconfig.json         # TypeScript configuration
├── index.min.js          # Minified distribution file
└── package.json          # Project metadata
```

### Key Files

- **`src/ktfile.ts`**: Main entry point, exports public API
- **`src/sync/FileSync.ts`**: Synchronous file operations implementation
- **`src/async/FileAsync.ts`**: Asynchronous file operations implementation
- **`src/IFile.ts`**: Base interface shared by both sync and async implementations
- **`src/Utils.ts`**: Shared utility functions

## Development Workflow

### Branch Strategy

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them with descriptive messages

3. Keep your branch up to date with upstream:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

4. Push your branch and create a pull request

### Building

The project uses Rollup for building. Available scripts:

```bash
npm run build        # Build TypeScript and create distributions
npm run build:types  # Generate type declarations only
npm run dev          # Watch mode for development
```

### File System Abstractions

KTFile uses interface-based abstractions to support different environments:

- **`ISyncFS`**: Interface for synchronous file system operations
- **`IAsyncFS`**: Interface for asynchronous file system operations

When adding new functionality:

1. Add the method signature to the appropriate interface
2. Implement it in both sync and async file classes
3. Ensure cross-platform compatibility

## Code Style Guidelines

### TypeScript Standards

- Use TypeScript strict mode
- Provide explicit type annotations for public APIs
- Use meaningful variable and function names
- Follow existing naming conventions:
    - Classes: `PascalCase`
    - Methods/properties: `camelCase`
    - Constants: `UPPER_SNAKE_CASE`

### Code Formatting

- Use 4 spaces for indentation
- Use semicolons
- Use double quotes for strings
- Maximum line length: 120 characters

### Error Handling

- Methods should return `null` on failure rather than throwing exceptions
- Use `| null` return types for operations that can fail
- Document when methods can return `null` and why

### Example Code Style

```typescript
export class FileSync extends IFile<ISyncFS> {
    /**
     * Reads file content as string or Buffer
     * @param encoding Optional text encoding
     * @returns File content or null if read fails
     */
    read(encoding?: BufferEncoding): string | null;
    read(): Buffer | null;
    read(encoding?: BufferEncoding): string | Buffer | null {
        try {
            // Implementation here
            return this.fs.readFileSync(this.path, encoding);
        } catch {
            return null;
        }
    }
}
```

## Testing

### Running Tests

```bash
npm test                   # Run all tests
npm run test:node          # Run Node.js tests only
npm run test:browser       # Run browser tests only
```

### Test Structure

- Tests are located in the `tests/` directory
- Main test suite: `tests/test.ts`
- Browser compatibility tests: `tests/test.html`
- Test cleanup utility: `tests/clean.js`

### Writing Tests

When adding new features:

1. Add tests for both sync and async implementations
2. Test error conditions (methods returning `null`)
3. Test cross-platform behavior where applicable
4. Include edge cases and boundary conditions

Example test pattern:

```typescript
// Test successful operation
const file = fileSync('./test-file.txt');
file.write('test content');
assert.strictEqual(file.read(), 'test content');

// Test error condition
const nonexistent = fileSync('./nonexistent.txt');
assert.strictEqual(nonexistent.read(), null);

// Test async equivalent
const asyncFile = fileAsync('./test-file.txt');
await asyncFile.write('test content');
assert.strictEqual(await asyncFile.read(), 'test content');
```

## Submitting Changes

### Pull Request Guidelines

1. **Clear Title**: Use a descriptive title that summarizes the change
2. **Description**: Include:
    - What the change does
    - Why it's needed
    - Any breaking changes
    - Testing performed

3. **Code Quality**:
    - Ensure all tests pass
    - Follow coding standards
    - Update documentation if needed
    - Add tests for new functionality

4. **Commit Messages**:
    - Use clear, descriptive commit messages
    - Reference issue numbers when applicable
    - Use imperative mood: "Add feature" not "Added feature"

### Pull Request Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Tests pass locally
- [ ] Added tests for new functionality
- [ ] Tested on multiple platforms (if applicable)

## Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated (if needed)
- [ ] No breaking changes (or breaking changes documented)
```

## Debugging

- Test both sync and async implementations
- Verify behavior in both Node.js and browser environments

## Getting Help

- **Documentation**: Check the README and inline code documentation
- **Issues**: Search existing issues for similar problems
- **Discussions**: Use GitHub Discussions for questions and ideas
- **Contact**: Reach out to maintainers through GitHub

## Recognition

Contributors will be recognized in:

- GitHub contributors list
- Release notes (for significant contributions)
- Documentation acknowledgments

Thank you for contributing to KTFile! 🎉