# SonicScript Documentation

This directory contains all documentation and resources for the SonicScript project.

## Documentation Structure

SonicScript's documentation is organized into these key areas:

### Knowledge Base (`/docs/knowledge/`)

Comprehensive technical documentation:

- **[MongoDB in Containers](knowledge/mongodb_containers.md)** - Setup and troubleshooting MongoDB containers
- **[PyMongo Truth Testing](knowledge/pymongo_truth_testing.md)** - Handling database object comparisons
- **[Logging System](knowledge/logging_system.md)** - Configuration and usage of the logging system
- **[Using Git-Bug](knowledge/using_git_bug.md)** - Guide to issue tracking with git-bug
- **[Bug Templates](knowledge/bug_templates.md)** - Documentation on the template system

### Templates (`/docs/templates/`)

Templates and examples for standardized documentation:

- **[Resolution Example](templates/resolution_example.md)** - Complete example of bug resolution documentation
- **[Bug Report Example](templates/bug_report_example.md)** - Example of a thorough bug report
- **Template Files** - Jinja2 templates for generating reports and documentation:
  - `bug_report.jinja2` - Template for creating bug reports
  - `resolution_comment.jinja2` - Template for documenting resolutions

## Using This Documentation

### For New Users

1. Start with the main [project README](../README.md) for an overview
2. Review the [CLAUDE.md](../CLAUDE.md) for configuration guidance
3. Explore the knowledge base for detailed component documentation

### For Developers

1. Use the templates when reporting bugs or documenting fixes
2. Refer to the knowledge base for solutions to common issues
3. Follow the documentation standards when contributing

### For Documentation Contributors

1. Follow the organization structure of existing documentation
2. Place technical guides in the knowledge directory
3. Update examples when templates change
4. Maintain cross-references between related documents

## Tools and Scripts

SonicScript includes tools to help with documentation:

- **[Bug Manager Script](../scripts/bug_manager.py)** - Creates standardized reports using templates
- **[Claude Bug UI](../scripts/claude_bug_ui.sh)** - Interface for automation tools to access git-bug
- **[Start Bug UI](../scripts/start_bug_ui.sh)** - Web UI for managing bugs

## Related Resources

- **[Project README](../README.md)** - Overview and getting started guide
- **[CLAUDE.md](../CLAUDE.md)** - Configuration guide for Claude Code
- **[Environment Example](../.env.local.example)** - Example environment configuration

## Documentation Best Practices

1. **Be specific** - Include detailed steps, errors, and examples
2. **Use proper formatting** - Utilize markdown for code blocks, tables, and lists
3. **Document testing** - Always explain how features and fixes are validated
4. **Include related files** - List all files that were modified or are relevant
5. **Provide context** - Include environment information and background
6. **Use clear language** - Write for future developers who will read your documentation
