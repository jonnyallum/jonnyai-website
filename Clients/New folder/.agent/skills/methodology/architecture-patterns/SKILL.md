---
name: architecture-patterns
version: "1.0"
description: >
  Implement proven backend architecture patterns including Clean Architecture,
  Hexagonal Architecture (Ports & Adapters), and Domain-Driven Design. Provides
  concrete directory structures, code samples, dependency rules, and migration checklists.
domain: system-design
owner: theo
triggers:
  - designing new backend systems
  - refactoring monolithic applications
  - establishing architecture standards
  - migrating to loosely coupled architectures
  - implementing domain-driven design
  - planning microservices decomposition
  - scaffolding new projects
source: sickn33/antigravity-awesome-skills (adapted for Jai.OS 5.0)
---

# Architecture Patterns

> **Owner:** @Theo (System Architecture)
> **Consumers:** @Sebastian, @Derek, @Steve, @Diana
> **Related:** `project-structure-initializer`, `api-contract-evolution-planner`, `schema-drift-monitor`

## Overview

Master proven backend architecture patterns to build maintainable, testable, and scalable systems. This skill covers Clean Architecture, Hexagonal Architecture, and Domain-Driven Design with concrete implementation guidance.

---

## When to Use

- Designing new backend systems from scratch
- Refactoring monolithic applications for better maintainability
- Establishing architecture standards for a team or project
- Migrating from tightly coupled to loosely coupled architectures
- Implementing domain-driven design principles
- Planning microservices decomposition

## When NOT to Use

- Small, localized refactors that don't affect architecture
- Purely frontend work with no backend architecture changes
- Simple CRUD apps that don't warrant architectural complexity

---

## Core Concepts

### 1. Clean Architecture (Uncle Bob)

**Layers (dependency flows inward):**

- **Entities**: Core business models
- **Use Cases**: Application business rules
- **Interface Adapters**: Controllers, presenters, gateways
- **Frameworks & Drivers**: UI, database, external services

**Key Principles:**

- Dependencies point inward — never outward
- Inner layers know nothing about outer layers
- Business logic independent of frameworks
- Testable without UI, database, or external services

### 2. Hexagonal Architecture (Ports and Adapters)

**Components:**

- **Domain Core**: Business logic (the hexagon)
- **Ports**: Interfaces defining interactions (contracts)
- **Adapters**: Implementations of ports (database, REST, message queue)

**Benefits:**

- Swap implementations easily (mock for testing)
- Technology-agnostic core
- Clear separation of concerns

### 3. Domain-Driven Design (DDD)

**Strategic Patterns:**

- **Bounded Contexts**: Separate models for different domains
- **Context Mapping**: How contexts relate
- **Ubiquitous Language**: Shared terminology between code and business

**Tactical Patterns:**

- **Entities**: Objects with identity
- **Value Objects**: Immutable objects defined by attributes
- **Aggregates**: Consistency boundaries
- **Repositories**: Data access abstraction
- **Domain Events**: Things that happened

---

## Clean Architecture — Directory Structure

```
app/
├── domain/           # Entities & business rules
│   ├── entities/
│   │   ├── user.py
│   │   └── order.py
│   ├── value_objects/
│   │   ├── email.py
│   │   └── money.py
│   └── interfaces/   # Abstract interfaces (ports)
│       ├── user_repository.py
│       └── payment_gateway.py
├── use_cases/        # Application business rules
│   ├── create_user.py
│   ├── process_order.py
│   └── send_notification.py
├── adapters/         # Interface implementations
│   ├── repositories/
│   │   ├── postgres_user_repository.py
│   │   └── redis_cache_repository.py
│   ├── controllers/
│   │   └── user_controller.py
│   └── gateways/
│       ├── stripe_payment_gateway.py
│       └── sendgrid_email_gateway.py
└── infrastructure/   # Framework & external concerns
    ├── database.py
    ├── config.py
    └── logging.py
```

---

## Implementation Patterns

### Domain Entity (Framework-Free)

```python
@dataclass
class User:
    """Core entity — no framework dependencies."""
    id: str
    email: str
    name: str
    created_at: datetime
    is_active: bool = True

    def deactivate(self):
        """Business rule: deactivating user."""
        self.is_active = False

    def can_place_order(self) -> bool:
        """Business rule: active users can order."""
        return self.is_active
```

### Port (Interface Contract)

```python
class IUserRepository(ABC):
    """Port: defines contract, no implementation."""

    @abstractmethod
    async def find_by_id(self, user_id: str) -> Optional[User]:
        pass

    @abstractmethod
    async def save(self, user: User) -> User:
        pass
```

### Use Case (Orchestrates Business Logic)

```python
class CreateUserUseCase:
    def __init__(self, user_repository: IUserRepository):
        self.user_repository = user_repository

    async def execute(self, request: CreateUserRequest) -> CreateUserResponse:
        existing = await self.user_repository.find_by_email(request.email)
        if existing:
            return CreateUserResponse(success=False, error="Email already exists")

        user = User(
            id=str(uuid.uuid4()),
            email=request.email,
            name=request.name,
            created_at=datetime.now()
        )
        saved = await self.user_repository.save(user)
        return CreateUserResponse(user=saved, success=True)
```

### Adapter (Concrete Implementation)

```python
class PostgresUserRepository(IUserRepository):
    """Adapter: PostgreSQL implementation of the port."""

    def __init__(self, pool: asyncpg.Pool):
        self.pool = pool

    async def find_by_id(self, user_id: str) -> Optional[User]:
        async with self.pool.acquire() as conn:
            row = await conn.fetchrow("SELECT * FROM users WHERE id = $1", user_id)
            return self._to_entity(row) if row else None
```

### Test Adapter (Mock for Testing)

```python
class MockPaymentAdapter(PaymentGatewayPort):
    """Test adapter: no external dependencies."""

    async def charge(self, amount: Money, customer: str) -> PaymentResult:
        return PaymentResult(success=True, transaction_id="mock-123")
```

---

## DDD Value Objects

```python
@dataclass(frozen=True)
class Email:
    """Value object: validated, immutable."""
    value: str

    def __post_init__(self):
        if "@" not in self.value:
            raise ValueError("Invalid email")

@dataclass(frozen=True)
class Money:
    """Value object: amount with currency."""
    amount: int  # cents
    currency: str

    def add(self, other: "Money") -> "Money":
        if self.currency != other.currency:
            raise ValueError("Currency mismatch")
        return Money(self.amount + other.amount, self.currency)
```

---

## Best Practices

1. **Dependency Rule**: Dependencies always point inward
2. **Interface Segregation**: Small, focused interfaces
3. **Business Logic in Domain**: Keep frameworks out of core
4. **Test Independence**: Core testable without infrastructure
5. **Bounded Contexts**: Clear domain boundaries
6. **Ubiquitous Language**: Consistent terminology
7. **Thin Controllers**: Delegate to use cases
8. **Rich Domain Models**: Behavior with data, not anemic data-only classes

---

## Common Pitfalls

- **Anemic Domain**: Entities with only data, no behavior
- **Framework Coupling**: Business logic depends on frameworks
- **Fat Controllers**: Business logic in controllers instead of use cases
- **Repository Leakage**: Exposing ORM objects instead of domain entities
- **Missing Abstractions**: Concrete dependencies in core
- **Over-Engineering**: Clean architecture for simple CRUD — know when it's overkill

---

## Architecture Decision Checklist

Before choosing an architecture:

- [ ] What is the domain complexity? (Simple CRUD vs. complex business rules)
- [ ] How many integration points? (Databases, APIs, message queues)
- [ ] What are the testing requirements? (Unit, integration, E2E)
- [ ] How many developers will work on this?
- [ ] What is the expected evolution? (Will it grow or stay simple?)

---

## Learning Log

| Date | Learning | Source |
|:--|:--|:--|
| 2026-03-09 | Integrated from `sickn33/antigravity-awesome-skills` | Awesome Skills Evaluation Phase 2 |
