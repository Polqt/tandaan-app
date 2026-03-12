---
name: performance-optimization
description: Diagnose and improve frontend and backend performance in web applications. Use when a user reports slow page loads, sluggish interactions, poor Lighthouse or Web Vitals scores, large bundles, slow API responses, slow database queries, or asks to profile and optimize performance in React, Next.js, or similar applications.
---

# Performance Optimization

## Overview

Measure first, then optimize the narrowest bottleneck with the highest user impact. Work incrementally, keep the codebase readable, and re-measure after every change.

## Workflow

1. Establish a baseline.
- Reproduce the slow flow in a production-like environment.
- Capture the current metric that matches the complaint: Lighthouse, Web Vitals, React Profiler, bundle size, endpoint latency, or query plan.
- Save the exact page, route, interaction, device class, and before values.

2. Identify the bottleneck class.
- Startup and network: oversized bundles, images, fonts, blocking CSS, third-party scripts, missing caching.
- Rendering and interaction: unnecessary re-renders, long tasks, heavy client components, large lists, expensive derived state.
- API and server: sequential I/O, overfetching, slow serialization, missing compression, uncached hot paths.
- Database: N+1 queries, full scans, missing or ineffective indexes, expensive joins.

3. Apply the smallest high-impact fix.
- Prefer changes with clear user impact: code splitting, reducing client-side JS, image optimization, query/index fixes, caching, and compression.
- Use React memoization only when profiling shows it addresses a real render hotspot.
- Preserve readability; do not add complexity for speculative gains.

4. Verify and report.
- Re-run the same measurement against the same flow.
- Report `baseline -> change -> result`.
- Note remaining bottlenecks and the next candidate fix if work should continue.

## Frontend Guidance

Read [references/playbook.md](references/playbook.md) for concrete commands, code patterns, and the checklist format.

Prioritize these fixes when measurements point to them:
- Split heavy routes and widgets with dynamic imports and `Suspense`.
- Reduce client-side JavaScript and avoid unnecessary client boundaries.
- Optimize LCP assets first: hero images, fonts, critical CSS, and third-party scripts.
- Virtualize long lists instead of rendering all rows at once.
- Import only the library modules actually used and confirm tree-shaking works.
- Defer non-critical charts, editors, and analytics code until needed.

## Backend Guidance

Prioritize these fixes when measurements point to them:
- Remove N+1 access patterns with joins, `include`, batching, or preloading.
- Run `EXPLAIN` or `EXPLAIN ANALYZE` before adding indexes.
- Cache hot reads or expensive computed responses with explicit TTLs and invalidation rules.
- Compress large responses and cut overfetching.
- Parallelize independent I/O instead of awaiting each call in sequence.
- Put static and cacheable assets behind a CDN when applicable.

## Guardrails

- Measure first; do not guess.
- Improve one bottleneck at a time.
- Optimize for real user experience, not synthetic micro-optimizations.
- Do not sacrifice maintainability for marginal wins.
- Add ongoing monitoring or regression checks when the workflow is recurring.

## Output

When the user asks for a report or checklist:
- Summarize the measured bottleneck and current baseline.
- Describe the optimization applied and why it was chosen.
- Show before and after metrics.
- Return the checklist from [references/playbook.md](references/playbook.md) with relevant items checked, unchecked, or annotated.
