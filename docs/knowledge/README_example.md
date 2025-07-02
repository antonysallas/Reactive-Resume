# SonicScript Knowledge Base

This directory contains technical documentation, guides, and solutions to common issues encountered during SonicScript development and operation.

## Available Documentation

### Infrastructure and Setup

- [MongoDB in Containers](mongodb_containers.md) - Connecting to MongoDB in containerized environments
- [Using Git-Bug](using_git_bug.md) - Guide to using git-bug for issue tracking
- [Bug Templates](bug_templates.md) - Using Jinja2 templates for standardized bug management

### Technical Reference

- [PyMongo Truth Testing](pymongo_truth_testing.md) - Handling PyMongo database object comparisons correctly
- [Logging System](logging_system.md) - Comprehensive guide to the SonicScript logging system

### Bug Fixes and Solutions

- [MongoDB Connection Issues](mongodb_containers.md) - Fixing MongoDB connection in containers
- [PyMongo Truth Testing](pymongo_truth_testing.md) - Solving database object comparison errors
- [Project Structure](bug_templates.md#standardized-documentation) - Standardizing Python project structure

## Documentation Organization

The SonicScript documentation is organized into several key areas:

### `/docs/knowledge/`

This directory contains comprehensive documentation on system components, technical decisions, and best practices. These documents serve as the primary knowledge base for the project.

### `/docs/templates/`

Contains templates and example files showing completed bug reports and resolution documentation. These examples serve as references for creating consistent and detailed documentation.

## Purpose

This knowledge base serves multiple purposes:

1. **Documentation** - Detailed explanations of key components and systems
2. **Knowledge Transfer** - Enabling new developers to understand the project quickly
3. **Troubleshooting** - Solutions to common problems that may recur
4. **Decision Records** - Capturing why certain technical decisions were made

## Contributing

When adding to this knowledge base:

1. Use clear, descriptive titles for new documents
2. Include problem statements and solutions
3. Add code examples where appropriate
4. Link to related source files
5. Update this README.md with links to new documents

## Organization

- Technical documentation about specific components should be placed in this directory
- Design decisions should include alternatives considered and reasons for the chosen approach
- Cross-reference related documents when possible

## Related Resources

- [Project README](../../README.md) - Main project documentation
- [CLAUDE.md](../../CLAUDE.md) - Configuration guide for Claude Code
- [Templates and Examples](../templates/) - Templates and examples for standardized documentation
