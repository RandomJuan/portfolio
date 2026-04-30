---
trigger: manual
---

# UI Overhaul – React + Next.js

## Context
This is a **full override** of the current UI.

Main goals:
- Move navbar to the right
- Redesign it as a hex / expandable system
- Improve theme system with clear previews
- Keep everything modular
- Remove unused elements

---

# 1. Navbar (Right Side)

## Objective
Replace the current top navbar with a **right-side vertical navigation**.

---

## Concept

- Half hexagon shape (visible by default)
- Expands to show full menu
- Acts as:
  - Hex menu
  - Expandable navigation
  - Hover-reveal / click-expand element

---

## Default State

- Only a **partial half-hexagon** is visible on the right edge
- Minimal, almost hidden
- Not rounded (no pill shape)

---

## Interaction

### Open
- On hover OR click → expand

### Expanded State
- Shows all menu options vertically

---

## Keyboard Navigation

- ArrowUp / ArrowDown:
  - Move between menu items
  - Keep current item highlighted

---

## Important

- Do NOT introduce extra controls
- Keep interaction simple:
  - Hover / Click → open
  - Arrows → navigate

---

# 2. Theme System

## Objective
Improve clarity of themes.

---

## Current Problem

- Only showing particle icons
- Not clear how the theme actually looks

---

## New Requirement

Each theme must show:

- Background color
- Particle style inside it

This should be a **real preview**, not an icon.

---

## Total Themes: 6

### Existing (keep them)

- 3 current dark-based themes

---

### New (Light Background)

Add 3 new themes:

---

### 1. Light + Black Particles

- Background: white
- Particles: black (light / floating)

---

### 2. Light + Lava Particles

- Background: white
- Particles: orange / lava / neon

---

### 3. Light + Mixed Particles

- Background: white
- Particles:
  - black
  - orange (lava)

---

## Theme Selector UI

- Each option is a **small preview card**
- Shows:
  - real background
  - real particles (scaled)

---

## Interaction

- Click → apply theme
- Selected theme should be visually clear

---

# 3. Dynamic Text Colors

## Rule (Important)

- Dark background → white text
- Light background → black text

---

## Requirement

- Do NOT hardcode colors inside components
- Use a centralized system (theme-based)

---

# 4. Visual Effects

## Particles

- Background particles must adapt to theme

Examples:
- Dark → light particles
- Light → black / lava / mixed

---

# 5. Cleanup

## Remove Completely

- Unused resources
- Old navbar
- Old theme icons
- Interactive frog

---

## Rule

If it's not used → remove it.

---

# 6. Code Quality

## Requirements

- Keep everything modular
- Clean structure
- No unnecessary complexity

---

## Goal

- Clear UI
- Clear interactions
- Clean codebase
