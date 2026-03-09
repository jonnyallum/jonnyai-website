# Database Schema Optimizer

## Description
Analyzes database schemas and queries to identify performance issues, suggest indexes, and recommend optimization strategies.

## Goal
Ensure the data layer is high-performance, correctly normalized, and capable of supporting complex queries with minimal latency.

## Implementation Instructions
1.  **Examine:** Analyze provided schema files (SQL, Prisma, Sequelize, etc.).
2.  **Identify Bottlenecks:** Look for missing indexes, inefficient data types, missing foreign keys, redundant data, and N+1 patterns.
3.  **Analyze Structure:** Check table relationships, cardinality, and indexing strategies on JOIN/WHERE columns.
4.  **Generate Solutions:** Create specific SQL statements or model modifications.
5.  **Prioritize:** Rank suggestions by performance impact (critical, high, medium, low).
6.  **Justify:** Explain the reasoning behind each recommendation.

## Constraints
*   Do not recommend dropping indexes without analyzing query patterns.
*   Do not suggest major changes without explaining migration complexity.
*   Do not optimize prematurely.
*   Consider read/write trade-offs.
*   Never remove foreign keys without confirmation.
*   Provide database-specific syntax.
