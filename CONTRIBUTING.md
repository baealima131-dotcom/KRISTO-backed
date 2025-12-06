# Contributing to KRISTO Backend

Thank you for your interest in contributing to the KRISTO Backend! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Git
- A code editor (VS Code recommended)

### Setting Up Development Environment

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR-USERNAME/KRISTO-backed.git
   cd KRISTO-backed
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file:
   ```bash
   cp .env.example .env
   ```

5. Update `.env` with your local MongoDB connection and other settings

6. Start development server:
   ```bash
   npm run dev
   ```

## Development Workflow

### 1. Create a Branch

Create a new branch for your feature or fix:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### 2. Make Your Changes

- Write clean, maintainable code
- Follow existing code style and conventions
- Add comments for complex logic
- Update documentation if needed

### 3. Test Your Changes

Run validation to ensure all modules load correctly:

```bash
npm test
```

### 4. Commit Your Changes

Write clear, descriptive commit messages:

```bash
git add .
git commit -m "Add feature: description of what you added"
```

Good commit message examples:
- `Add user profile update validation`
- `Fix video upload error handling`
- `Update authentication middleware for better security`

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Create a Pull Request

1. Go to the original repository on GitHub
2. Click "New Pull Request"
3. Select your fork and branch
4. Fill in the PR template with:
   - Description of changes
   - Related issues
   - Testing performed
   - Screenshots (if applicable)

## Code Style Guidelines

### JavaScript Style

- Use ES6+ features
- Use `const` and `let`, avoid `var`
- Use async/await instead of callbacks
- Use arrow functions where appropriate
- Keep functions small and focused

### File Organization

```javascript
// 1. Imports
const express = require('express');
const asyncHandler = require('../utils/asyncHandler');

// 2. Constants
const MAX_LIMIT = 100;

// 3. Functions/Controllers
exports.getUsers = asyncHandler(async (req, res, next) => {
  // Implementation
});
```

### Naming Conventions

- **Files**: camelCase (e.g., `userController.js`)
- **Variables**: camelCase (e.g., `userName`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_FILE_SIZE`)
- **Classes**: PascalCase (e.g., `ErrorResponse`)
- **Functions**: camelCase with descriptive names (e.g., `getUserById`)

### Comments

```javascript
// Good: Explains WHY, not WHAT
// Hash password before saving to prevent storing in plain text
user.password = await bcrypt.hash(password, 10);

// Bad: States the obvious
// Hash the password
user.password = await bcrypt.hash(password, 10);
```

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Request handlers
├── middleware/     # Custom middleware
├── models/         # MongoDB models
├── routes/         # API routes
├── services/       # Business logic (future)
└── utils/          # Helper functions
```

## Adding New Features

### Adding a New Model

1. Create file in `src/models/`
2. Define schema with proper validation
3. Add indexes for frequently queried fields
4. Export the model

### Adding a New Route

1. Create controller in `src/controllers/`
2. Implement business logic
3. Add validation in `src/middleware/validator.js`
4. Create route file in `src/routes/`
5. Import and use in `server.js`

### Adding Middleware

1. Create file in `src/middleware/`
2. Follow async error handling pattern
3. Document the middleware purpose
4. Add tests if possible

## Testing

Currently, the project uses a validation script to ensure all modules load correctly.

To run tests:
```bash
npm test
```

Future: We plan to add:
- Unit tests (Jest)
- Integration tests
- API endpoint tests

## Security Guidelines

- Never commit sensitive data (.env files)
- Always validate and sanitize user input
- Use prepared statements for database queries
- Implement rate limiting for public endpoints
- Use HTTPS in production
- Keep dependencies updated

## Documentation

- Update README.md for user-facing changes
- Update API_DOCUMENTATION.md for API changes
- Add JSDoc comments for complex functions
- Update DEPLOYMENT.md for deployment-related changes

## Pull Request Checklist

Before submitting a PR, ensure:

- [ ] Code follows project style guidelines
- [ ] All tests pass (`npm test`)
- [ ] No console.log statements (use proper logging)
- [ ] Documentation is updated
- [ ] Commit messages are clear and descriptive
- [ ] Branch is up to date with main
- [ ] No merge conflicts
- [ ] Security best practices followed

## Common Issues and Solutions

### MongoDB Connection Error

```bash
# Ensure MongoDB is running
mongod --dbpath /path/to/data
```

### Port Already in Use

```bash
# Find and kill the process using port 5000
lsof -ti:5000 | xargs kill -9
```

### Module Not Found

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Getting Help

- Check existing issues on GitHub
- Read the documentation
- Ask questions in discussions
- Contact maintainers

## Recognition

Contributors will be acknowledged in:
- README.md contributors section
- Release notes
- Project documentation

## License

By contributing, you agree that your contributions will be licensed under the ISC License.

## Thank You!

Your contributions make this project better. We appreciate your time and effort! 🎉
