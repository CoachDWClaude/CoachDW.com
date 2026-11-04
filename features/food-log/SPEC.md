# Food log: draft spec

Status: waiting on Danny to decide whether to build it, and on which tier.

## Job

The photo is for accountability first, and the numbers are a best guess. Take a picture before you eat, see what is on the plate, and get a rough range for protein, carbs, fat and calories.

## Three checks, like the NOT A Calorie Calculator

Each is a guide, and none is treated as exact:

1. The photo: a visual record and a rough guess.
2. The packet: the label, shown with its likely margin.
3. The portion: the member's own weighed or hand-sized amount.

Show which checks were used and give one range. Use the best evidence available, rather than a plain average of the three.

## Flow

1. Take a photo, or add a note such as "two eggs, cooked in butter".
2. See the estimate as a range, with each food listed.
3. Correct foods and portions, then save.
4. Totals feed BodyStats.

## Accuracy

A conference abstract tested 4 apps on 102 controlled meals (NUTRITION 2026, not peer reviewed). Calories were underestimated by about a third and fat by 30 g. Early follow-up suggests a bigger miss on higher-fat, lower-carb meals.

So: confirm portions, ask about cooking fats and oils, and read packaging labels where possible.

Labels are a guide too. Guidance for UK and EU foods allows about 20% either way on protein at 10 to 40 g per 100 g. A UK survey of 41 protein products found 30 met their claim and most of the rest were within 5%, though one was at about 54%. The survey publisher sells protein verification.

## Accountability

Keep photos private by default, with sharing to the tribe as an opt-in. A small study of 43 people reported more awareness from photographing food before eating, without a control group in the source seen. In a large app study, only 2.58% of users stayed active, so the habit needs goals and a reason to return.

## My Usual Meals

Eat the same meals as often as you can, and logging gets easier and more accurate.

- Check a meal properly once, with photo, label and weighed portions.
- Save it as a usual meal.
- Next time, tap once. No new photo, so no AI cost.
- Aim for a small rotation of usual meals, with some variety in them.

In 112 adults over 12 weeks of a weight loss programme, those with more repetitive diets lost 5.9% of bodyweight against 4.3% for more varied diets. This is a correlation, not proof of cause (Hagerman et al. 2026).

## What it needs

- A small server step to hold the private API key.
- A cost per photo, so a limit for free users or a paid feature.
- A database if meals and photos are to be kept.
- Privacy terms, as photos go to an AI provider.

## Do not

- Do not show a calorie number as exact.
- Do not nag, score or judge meals. Give a way to switch the food log off.
