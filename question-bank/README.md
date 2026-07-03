# PsychoPharmRef Question Bank

Private MCQ bank generated from blog posts using QuestionBankBuilder v2.0.
Each topic file contains approved questions in JSON format ready for deployment.

## Status

| Topic File | Blog Source | Questions | Status |
|---|---|---|---|
| personality-disorders.json | Personality Disorders: Diagnosis, Neurobiology, and Evidence-Based Treatment | 8 | Approved |

**Total approved questions: 8**

## JSON Schema

Each question object:
```json
{
  "id": 1,
  "question": "...",
  "options": ["A", "B", "C", "D"],
  "correct_index": 0,
  "explanation": "...",
  "source_blog_title": "...",
  "source_blog_url": "...",
  "frame_used": "Factual Recall"
}
```

## Deployment

When ready to deploy all at once, merge all topic JSON files into a single bank:
- Renumber IDs sequentially across all files
- Import into site backend / quiz feature
