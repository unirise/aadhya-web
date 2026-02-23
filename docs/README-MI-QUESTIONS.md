# Multiple Intelligences Questions Repository

This directory contains the Multiple Intelligences assessment questions based on Howard Gardner's
Theory of Multiple Intelligences, sourced from the
[Alberta Career, Learning and Employment Information (ALIS) website](https://alis.alberta.ca/careerinsite/know-yourself/multiple-intelligences-quiz/).

## Files

- `multiple-intelligences-questions.json` - Complete question repository with 64 questions (8 per
  intelligence domain)
- `mi-questions-usage-example.js` - Example usage code demonstrating how to use the data
- `../lib/mi-scoring.js` - Utility functions for calculating scores and analyzing results

## Data Structure

### Metadata

- `title`: Assessment title
- `description`: Brief description
- `version`: Data version
- `totalQuestions`: Total number of questions (64)
- `intelligenceDomains`: Array of 8 intelligence domain codes

### Scoring Configuration

- `baseScore`: Starting score for each domain (default: 50)
- `scoreAdjustments`: Object mapping answer values to score adjustments
  - `1` (Completely agree): +5
  - `2` (Somewhat agree): +2
  - `3` (Unsure): +0
  - `4` (Somewhat disagree): -2
  - `5` (Completely disagree): -5

### Answer Options

Array of 5 answer options with:

- `value`: Numeric value (1-5)
- `label`: Human-readable label
- `emoji`: Visual representation

### Questions

Array of 64 question objects, each containing:

- `id`: Unique question identifier (1-64)
- `text`: Question text
- `intelligenceDomain`: Domain code (e.g., "INTRAPERSONAL")
- `domainDisplayName`: Human-readable domain name

## Intelligence Domains

1. **INTRAPERSONAL** - Intrapersonal Intelligence (8 questions)
2. **BODILY_KINESTHETIC** - Bodily-Kinesthetic Intelligence (8 questions)
3. **LOGICAL_MATHEMATICAL** - Logical-Mathematical Intelligence (8 questions)
4. **LINGUISTIC** - Linguistic Intelligence (8 questions)
5. **MUSICAL** - Musical Intelligence (8 questions)
6. **SPATIAL** - Spatial Intelligence (8 questions)
7. **NATURALISTIC** - Naturalistic Intelligence (8 questions)
8. **INTERPERSONAL** - Interpersonal Intelligence (8 questions)

## Usage Example

```javascript
import miQuestionsData from './data/multiple-intelligences-questions.json'
import { calculateMIScores, getTopIntelligences } from './lib/mi-scoring'

// Sample answers: { questionId: answerValue }
const answers = {
  1: 1, // Completely agree
  2: 2, // Somewhat agree
  3: 3, // Unsure
  // ... more answers
}

// Calculate scores
const domainScores = calculateMIScores(miQuestionsData, answers)

// Get top 3 intelligences
const top3 = getTopIntelligences(domainScores, 3)
```

## Scoring Logic

1. Each intelligence domain starts at the base score (default: 50)
2. For each answered question, the score is adjusted based on the answer value
3. Final scores are calculated by summing all adjustments for each domain
4. Scores can range from 10 (all answers = 5) to 90 (all answers = 1) with default settings

## Customization

The structure is designed to be generic and flexible:

- **Custom Scoring**: You can override the scoring configuration by passing a `customScoring` object
- **Different Answer Options**: The `answerOptions` array can be modified to support different
  scales or labels
- **Score Distribution**: The `scoreAdjustments` object can be customized for different scoring
  distributions

## Integration with Questionnaire Component

To integrate with the existing `Questionnaire.jsx` component:

```javascript
import miQuestionsData from './data/multiple-intelligences-questions.json'
import { calculateMIScores } from './lib/mi-scoring'

// In your component
const handleSubmit = () => {
  const domainScores = calculateMIScores(miQuestionsData, answers)
  // Submit scores to API or display results
}
```

## References

- [ALIS Multiple Intelligences Quiz](https://alis.alberta.ca/careerinsite/know-yourself/multiple-intelligences-quiz/)
- [Howard Gardner's Theory of Multiple Intelligences](https://en.wikipedia.org/wiki/Theory_of_multiple_intelligences)
