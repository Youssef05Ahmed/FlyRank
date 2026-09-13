# AI Development Workflow Comparison

## Overview

For this experiment, I implemented the Gaming Store Account Settings Form twice using Claude Code. The first implementation used a deliberately vague prompt, while the second used a detailed engineering prompt with project file references, requirements, constraints, examples, and verification steps.

## Round One — Vague Prompt

The first implementation was generated using a single vague request:

"Build a gaming store account settings form."

Describe what Claude actually produced.

Mention specific things you observed, such as:
- validation
- accessibility
- tests
- error handling
- UI structure
- edge cases

Also mention how much manual review or fixing was required.

## Round Two — Engineered Prompt

The second implementation was created independently from the base branch using a detailed prompt.

The prompt referenced the existing AccountSettingsForm files and specified the required behavior, validation, accessibility requirements, edge cases, and testing requirements.

Describe what the second implementation actually added or improved.

Mention specific files and code differences rather than general impressions.

## Correctness

Compare the two implementations based on actual behavior and test results.

Explain which implementation was more reliable and why.

## Accessibility

Compare labels, keyboard navigation, validation feedback, semantic elements, and other accessibility considerations.

## Edge Cases

Compare how the two implementations handled invalid or unusual input, such as empty fields, invalid email addresses, long values, or repeated submission.

## Review Effort

Compare the amount of time required to review and fix each implementation.

The vague implementation required approximately [X] minutes of review/fixing, while the engineered implementation required approximately [Y] minutes.

## AI Mistake

Describe at least one concrete mistake made by the AI that was discovered during review.

For example, if the AI initially [actual mistake], I identified it during testing and [what you did to fix it].

## Conclusion

This experiment showed that using AI effectively requires more than asking it to build a feature. The engineered workflow produced a more predictable result because the AI was given project context, explicit requirements, constraints, edge cases, and verification instructions. The required testing and review step also made it easier to identify problems before considering the feature complete.