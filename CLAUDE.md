# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**PaiAgent** - AI Agent 流图执行面板 (AI Agent Flow Execution Platform)

A full-stack visual workflow editor with DAG execution engine, supporting multiple LLM providers (OpenAI, DeepSeek, 通义千问) and Aliyun TTS for AI podcast generation.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + TypeScript + React Flow + Zustand + Tailwind CSS |
| Backend | Java 17 + SpringBoot 3.x + MySQL 8.x |
| LLMs | OpenAI / DeepSeek / 通义千问 (adapter pattern) |
| TTS | 阿里云语音合成 |
| Deployment | Docker Compose |

## Project Structure

```
PaiAgent/
├── frontend/                 # React + TypeScript SPA
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── store/           # Zustand state management
│   │   ├── types/           # TypeScript type definitions
│   │   └── api/             # API client functions
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                  # SpringBoot REST API
│   ├── src/main/java/com/paiagent/
│   │   ├── controller/      # REST controllers
│   │   ├── service/         # Business logic
│   │   ├── model/           # Data entities
│   │   ├── engine/          # DAG workflow execution engine
│   │   ├── adapter/         # LLM adapters (OpenAI, DeepSeek, Qwen)
│   │   └── config/          # Spring configuration
│   ├── pom.xml
│   └── application.yml
│
├── docker-compose.yml        # Local deployment
└── PLAN.md                   # Implementation plan
```

## Commands

### Frontend

```bash
cd frontend
npm install          # Install dependencies
npm run dev          # Start dev server (Vite)
npm run build        # Production build
npm run lint         # ESLint check
```

### Backend

```bash
cd backend
mvn clean install    # Build project
mvn spring-boot:run # Start SpringBoot application
mvn test            # Run tests
```

### Docker

```bash
docker-compose up -d    # Start all services
docker-compose down     # Stop services
```

## Key Architecture

### Workflow Engine

The backend uses a DAG-based execution engine:
1. **Validation**: Cycle detection and topological sorting before execution
2. **Execution**: Nodes are executed in topological order via `NodeExecutor` interface
3. **Streaming**: WebSocket (`/ws/execute`) for real-time execution logs

### LLM Adapter Pattern

```java
public interface LLMAdapter {
    String chat(String prompt, String model);
    Stream<String> chatStream(String prompt, String model);
}
```

Implemented adapters: `OpenAIAdapter`, `DeepSeekAdapter`, `QwenAdapter`

### Node Types

| Type | Description |
|------|-------------|
| user-input | Receives user text input |
| llm | Calls LLM to process text |
| tts | Aliyun TTS audio synthesis |
| end | Workflow termination marker |

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/workflows | Create workflow |
| GET | /api/workflows/{id} | Get workflow |
| PUT | /api/workflows/{id} | Update workflow |
| DELETE | /api/workflows/{id} | Delete workflow |
| GET | /api/workflows | List workflows |
| POST | /api/workflows/{id}/execute | Execute workflow |
| GET | /api/executions/{id} | Get execution result |
| WS | /ws/execute | WebSocket for real-time logs |

### Database Tables

- **workflow**: id, name, nodes (JSON), edges (JSON), created_at, updated_at
- **execution_log**: id, workflow_id, input, output, audio_url, status, logs (JSON), created_at

## Development Conventions

- Follow the rules in `.claude/rules/` - especially `common/coding-style.md`, `common/testing.md`, and language-specific rules
- Use immutable data patterns (create new objects, never mutate)
- 80% minimum test coverage required
- Validate all user input at system boundaries
- Never hardcode secrets - use environment variables

## Current Status

This is a Greenfield project. Implementation follows the phases defined in PLAN.md:
- Phase 1: Infrastructure setup
- Phase 2: Canvas/React Flow development
- Phase 3: Workflow execution engine
- Phase 4: Debug and playback features
- Phase 5: Deployment
