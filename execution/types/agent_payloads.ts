/**
 * @Sebastian: Unified Type Definitions for Jai.OS Inter-Agent Payloads.
 * These types ensure that multi-agent task chains (MATCs) are deterministic and type-safe.
 */

export type AgentHandle = `@${string}`;

export type TaskStatus = 'READY' | 'IN_PROGRESS' | 'GATE_CLEARED' | 'FAILED';

export interface InterAgentPacket {
  taskId: string;
  sourceAgent: AgentHandle;
  targetAgent: AgentHandle | '@all';
  currentState: TaskStatus;
  payloadPath: string; // Absolute path to the artifact (JSON, MD, Code)
  metadata?: Record<string, any>;
  realityLockVerified?: boolean;
}

export interface DesignTokenPayload {
  colors: Record<string, string>; // HSL values
  typography: {
    fontFamily: string;
    baseSize: string;
    scale: number;
  };
  effects: {
    glassmorphism: string;
    shadows: Record<string, string>;
  };
}

export interface VerifiedFact {
  categoryId: 'analytics' | 'domain' | 'api_key' | 'branding' | 'general';
  key: string;
  value: string;
  verifiedBy: AgentHandle;
  verifiedAt: string; // ISO Date
}
