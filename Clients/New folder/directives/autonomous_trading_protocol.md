# SOP: Autonomous Trading Protocol

## 1. Overview
This protocol defines the safety, reliability, and architectural standards for building autonomous trading systems within the Antigravity ecosystem.

## 2. Core Safety Pillars
### 2.1 Circuit Breakers
- **Daily Loss Limit:** System MUST automatically pause and pull all open orders if daily losses exceed a predefined % (default: 5% for moderate risk).
- **Max Drawdown:** System MUST stop trading if the total portfolio drawdown from peak exceeds a predefined % (default: 10% for moderate risk).
- **Emergency Stop:** A manual "Kill Switch" MUST be available to instantly cancel all pending orders and close all active positions.

### 2.2 Position Sizing
- **Kelly Criterion:** Use fractional Kelly (25-35%) to size positions based on signal confidence and estimated risk/reward.
- **Concentration Limits:** No single position should exceed a predefined % of the total portfolio value (default: 10%).
- **Concurrent Orders:** Limit the number of active/pending orders to prevent "flooding" during high volatility.

## 3. Technical Standards
### 3.1 Broker Integration
- **Paper vs Live:** Always default to "Paper" mode. Switching to "Live" requires explicit environment variable configuration and user confirmation.
- **Connection Reliability:** WebSocket listeners MUST implement exponential backoff reconnection.
- **Type Safety:** All API models (Orders, Positions, Assets) MUST be strictly typed.

### 3.2 Signal Generation
- **Weighted Scoring:** Signals should combine multiple uncorrelated indicators (Momentum, Trend, Volatility, Volume).
- **Minimum Data Requirement:** Do not generate signals unless a minimum number of lookback bars (e.g., 200 daily bars) is available.
- **Confidence Threshold:** Only execute signals with a confidence score above the defined risk tier (Conservative: 0.75, Moderate: 0.65, Aggressive: 0.55).

## 4. Operational Maintenance
### 4.1 Audit Logs
- All trading decisions (signals generated, risk checks passed/failed, orders submitted) MUST be logged in the database for auditing and post-trade analysis.

### 4.2 Syncing
- Regularly sync internal position states with the broker to ensure data consistency and prevent "ghost" positions.
