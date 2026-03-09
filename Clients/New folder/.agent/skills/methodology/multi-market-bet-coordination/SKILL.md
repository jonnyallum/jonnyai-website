---
# Methodology Skill Card — Jai.OS 5.0
name: "multi-market-bet-coordination"
version: "1.0.0"
type: methodology
description: "Multi-sport, multi-market coordination — bankroll allocation, stake sizing, and correlated risk management across sim..."
category: betting
complexity: medium
domains: ["betting"]
updated: "2026-03-01"
---

# Multi-Market Bet Coordination

## Description

Multi-sport, multi-market coordination — bankroll allocation, stake sizing, and correlated risk management across simultaneous positions.

## Implementation Instructions

1. List all active positions and their event times, markets, and stakes.
2. Calculate total active liability and confirm it is within daily bankroll exposure limit.
3. Identify correlation risk: bets on the same team/outcome in different markets.
4. Apply Kelly Criterion at fractional rate (typically 0.25 Kelly) per individual position.
5. Stagger kick-off exposure: avoid simultaneous settlement of more than 30% of active bankroll.
6. Record all positions in the bet log with market, odds, stake, and EV estimate.

## Constraints

- DO NOT exceed the daily maximum liability threshold regardless of confidence level.
- ALWAYS log every position before it is placed — no unrecorded bets.
- DO NOT treat correlated bets as independent when sizing stakes.
