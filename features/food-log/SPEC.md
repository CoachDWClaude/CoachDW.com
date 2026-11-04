# Food log: draft spec

Status: waiting on Danny to decide whether to build it, and on which tier.

## Job

Take a photo of a meal and get a quick estimate of protein, carbs, fat and calories, then correct it.

## Flow

1. Take a photo, or add a note such as "two eggs, cooked in butter".
2. See the estimate as a range, with each food listed.
3. Correct foods and portions, then save.
4. Totals feed BodyStats.

## Accuracy

A conference abstract tested 4 apps on 102 controlled meals (NUTRITION 2026, not peer reviewed). Calories were underestimated by about a third and fat by 30 g. Early follow-up suggests a bigger miss on higher-fat, lower-carb meals.

So: confirm portions, ask about cooking fats and oils, and read packaging labels where possible.

## What it needs

- A small server step to hold the private API key.
- A cost per photo, so a limit for free users or a paid feature.
- A database if meals and photos are to be kept.
- Privacy terms, as photos go to an AI provider.

## Do not

- Do not show a calorie number as exact.
- Do not nag, score or judge meals. Give a way to switch the food log off.
