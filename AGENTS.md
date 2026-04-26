## gstack (REQUIRED — global install)

**Before doing ANY work, verify gstack is installed:**

```bash
test -d ~/.Codex/skills/gstack/bin && echo "GSTACK_OK" || echo "GSTACK_MISSING"
```

If GSTACK_MISSING: STOP. Do not proceed. Tell the user:

> gstack is required for all AI-assisted work in this repo.
> Install it:
> ```bash
> git clone --depth 1 https://github.com/garrytan/gstack.git ~/.Codex/skills/gstack
> cd ~/.Codex/skills/gstack && ./setup --team
> ```
> Then restart your AI coding tool.

Do not skip skills, ignore gstack errors, or work around missing gstack.

Using gstack skills: After install, skills like /qa, /ship, /review, /investigate,
and /browse are available. Use /browse for all web browsing.
Use ~/.Codex/skills/gstack/... for gstack file paths (the global path).


<claude-mem-context>
# Memory Context

# [agenttracemarketplace] recent context, 2026-04-26 4:37am EDT

Legend: 🎯session 🔴bugfix 🟣feature 🔄refactor ✅change 🔵discovery ⚖️decision 🚨security_alert 🔐security_note
Format: ID TIME TYPE TITLE
Fetch details: get_observations([IDs]) | Search: mem-search skill

Stats: 20 obs (9,134t read) | 69,150t work | 87% savings

### Apr 23, 2026
38 7:02p 🔵 agenttracemarketplace repo contains only 3 files — no implementation code yet
39 7:03p 🔵 agenttracemarketplace design doc APPROVED — full architecture, data model, and payment flow
40 7:05p 🔵 gstack design doc not auto-detected on main branch — stored under feature branch slug
41 7:12p 🔵 plan-eng-review produced test plan for agenttracemarketplace — 9 routes, 5 critical paths, 12 edge cases
42 7:14p ✅ TODOS.md created with 3 deferred items from plan-eng-review — buyer-first MVP scope locked
43 7:15p 🔵 agenttracemarketplace GitHub remote confirmed — https://github.com/mxchng/agenttracemarketplace.git
44 7:16p 🔵 Design doc additional sections captured — success criteria, distribution plan, dependencies, and pre-code assignment
45 7:22p ✅ TODOS.md updated — DESIGN.md pre-implementation requirement added
46 " ⚖️ Supplier-side responsive and accessibility design formally deferred
47 " ✅ plan-design-review completed and logged — score 4→9, 13 decisions made
48 7:24p 🔵 agenttracemarketplace TODOS.md — five formal deferred items with rationale
49 7:25p 🟣 graphify knowledge graph built for agenttracemarketplace project docs
50 7:26p 🟣 graphify graph finalized — 4 communities identified in agenttracemarketplace docs
51 " 🟣 graphify HTML visualization and labeled report written for agenttracemarketplace
52 7:27p 🔵 graphify GRAPH_REPORT analysis reveals cross-community bridges and knowledge gaps in agenttracemarketplace
53 8:57p ✅ Primary session asked to re-familiarize with agenttracemarketplace design doc (April 24)
54 8:59p ✅ agenttracemarketplace planning checkpoint saved to gstack context store
55 9:08p 🔵 agenttracemarketplace TODOS.md full contents confirmed — 5 deferred items with rationale
56 " 🔵 DESIGN.md confirmed absent in agenttracemarketplace repo as of April 24
57 9:09p 🟣 DESIGN.md created — full buyer-first MVP design system written

Access 69k tokens of past work via get_observations([IDs]) or mem-search skill.
</claude-mem-context>