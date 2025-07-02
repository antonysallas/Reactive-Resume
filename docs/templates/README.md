# SonicScript Templates and Examples

This directory contains both the templates used for standardized documentation and examples of their completed forms. These resources ensure consistent, thorough documentation of issues and their resolutions.

## Templates Overview

### Core Templates

These templates are used by the bug manager script for standardized documentation:

| Template                                         | Purpose                             | Usage                              |
| ------------------------------------------------ | ----------------------------------- | ---------------------------------- |
| [Bug Report Template](bug_report.jinja2)         | Jinja2 template for bug reports     | Used when creating new bug reports |
| [Resolution Template](resolution_comment.jinja2) | Jinja2 template for bug resolutions | Used when documenting bug fixes    |

### Example Documents

These examples show properly completed documentation:

| Example                                     | Purpose                          | Key Features                                                                                                 |
| ------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| [Resolution Example](resolution_example.md) | Complete bug resolution document | Shows documentation for multiple related fixes (MongoDB and SRT); includes code snippets and testing details |
| [Bug Report Example](bug_report_example.md) | Complete bug report              | Demonstrates error logging, reproduction steps, and environment details                                      |

## Using Templates with Bug Manager

The `scripts/bug_manager.py` script automates template usage with git-bug:

### Creating a New Bug

```bash
# Basic usage
./scripts/bug_manager.py new-bug "Bug Title"

# With additional parameters
./scripts/bug_manager.py new-bug "Bug Title" --category "App" --priority "High"
```

This will:

1. Generate a bug report from the template
2. Open your editor to fill in details
3. Create a new git-bug issue with your report

### Adding a Resolution Comment

```bash
# Basic usage
./scripts/bug_manager.py resolve 7211db6

# With the files that were changed
./scripts/bug_manager.py resolve 7211db6 --files /path/to/file1.py /path/to/file2.py

# With additional details
./scripts/bug_manager.py resolve 7211db6 --overview "Fixed transcription issues" --approach "Solution"
```

This will:

1. Generate a resolution comment from the template
2. Pull information from git if files are specified
3. Open your editor to fill in details
4. Add a comment to the specified bug ID

## Template Format

The templates use Jinja2 syntax with Markdown formatting:

- Text between `{{ }}` is replaced with actual values
- Comments between `<!-- -->` provide guidance on what to enter
- Table structures are maintained in the final output
- Conditional sections use `{% if condition %}...{% endif %}`

## Best Practices

### When Creating Bug Reports

1. Provide clear reproduction steps
2. Include specific error messages and logs
3. Document environment details (OS, Python version, etc.)
4. List related files and components
5. Specify the priority and category

### When Documenting Resolutions

1. Clearly explain both the problem and solution approach
2. Include implementation details with code examples
3. List all files changed with specific modifications
4. Document testing and validation steps
5. Add git commit references

## Related Documentation

- [Bug Templates Guide](/docs/knowledge/bug_templates.md) - Comprehensive documentation on template usage
- [Using Git-Bug](/docs/knowledge/using_git_bug.md) - Integration with issue tracking
- [Bug Manager Script](/scripts/bug_manager.py) - Script for automating template usage
