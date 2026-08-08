# Projex core

The shared library behind a Projex portfolio: defines, fetches, normalises, and queries a list of projects and their stats.

## Language

**Kind**:
The category of a project, determined by where it lives / how it's sourced — `github`, `npm`, `youtube`, `gumroad`, `lemonsqueezy`, `product-hunt`, `devto`, `manual`, `hybrid`. The canonical kind is the project's `type` field, not the `type` inside `stats` (which is supplementary and nullable).
_Avoid_: source, channel, integration (when used to mean the kind itself)

**Lifecycle state**:
Where a project sits in its lifecycle — `active`, `shipped`, `in-progress`, `coming-soon`, `archived`, `for-sale`. The project's `status` field.
_Avoid_: phase, stage

**Available options**:
The set of kinds (or lifecycle states) that actually occur in a given project list — i.e. the data-derived, deduplicated, canonically-ordered values. Distinct from the full declared union (which may include kinds with zero projects) and from the **active filter** (the user's current selection).
_Avoid_: filter values, categories

**Active filter**:
The user's current selection on a filter axis — the thing that narrows a project list, distinct from the **available options** (what _could_ be chosen) and the declared union. Selection model is axis-specific: for **kind** and **lifecycle state** it is single-select, with an **"All"** affordance meaning "no active filter" (no narrowing, value `'all'`); for **stack** it is multi-select (several tags active at once). "All" is a UI concern, never one of the available options or a value the helpers return.
_Avoid_: selected value, chosen category
