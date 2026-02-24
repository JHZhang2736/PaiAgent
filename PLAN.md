# AI Agent 流图执行面板 - 实施计划

## 1. 项目概述

构建一个完整的AI Agent平台，包含可视化工作流编辑器、工作流执行引擎，支持多厂商大模型和阿里云语音合成，最终实现AI播客功能。

## 2. 技术架构

```
┌─────────────────────────────────────────────────────────────────┐
│                       前端 (React + TypeScript)                 │
│   React Flow + Zustand + Tailwind CSS + WebSocket              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ HTTP/WebSocket
┌─────────────────────────────────────────────────────────────────┐
│                    后端 (Java SpringBoot + MySQL)                │
│   工作流API + DAG执行引擎 + LLM适配器 + 阿里云TTS + WebSocket   │
└─────────────────────────────────────────────────────────────────┘
```

### 技术选型

| 层级 | 技术栈 |
|------|--------|
| 前端 | React 18 + TypeScript + React Flow + Zustand + Tailwind CSS |
| 后端 | Java 17 + SpringBoot 3.x + MySQL 8.x |
| 大模型 | OpenAI / DeepSeek / 通义千问 适配器 |
| 语音合成 | 阿里云语音合成 |
| 部署 | Docker Compose |

---

## 3. 核心功能

### 3.1 左侧菜单
- 大模型节点添加按钮
- 工具节点（音频合成）添加按钮
- 用户输入节点添加按钮
- 结束节点添加按钮

### 3.2 画板区域
- 可视化节点编辑器（React Flow）
- 节点拖拽放置
- 节点连线
- 节点属性配置

### 3.3 节点类型
| 节点类型 | 说明 |
|---------|------|
| 用户输入 | 接收用户输入文本 |
| 大模型 | 调用LLM处理文本 |
| 音频合成 | 调用阿里云TTS生成音频 |
| 结束 | 标记工作流结束 |

### 3.4 调试抽屉
- 输入测试文本
- 触发工作流执行
- WebSocket实时日志输出
- 音频播放

---

## 4. 数据模型

### 4.1 工作流表 (workflow)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT | 主键 |
| name | VARCHAR(255) | 工作流名称 |
| nodes | JSON | 节点配置 |
| edges | JSON | 边配置 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

### 4.2 执行记录表 (execution_log)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT | 主键 |
| workflow_id | BIGINT | 关联工作流 |
| input | TEXT | 输入内容 |
| output | TEXT | 输出内容 |
| audio_url | VARCHAR(512) | 音频URL |
| status | VARCHAR(32) | 执行状态 |
| logs | JSON | 执行日志 |
| created_at | DATETIME | 执行时间 |

---

## 5. 实现阶段

### Phase 1: 基础架构搭建 (1周)
- [x] 前后端项目初始化
- [x] 数据库表设计
- [ ] 后端：SpringBoot项目结构 + CRUD API
- [ ] 前端：布局框架

### Phase 2: 画布功能开发 (2周)
- [ ] React Flow 集成
- [ ] 4种节点组件开发
- [ ] 左侧菜单拖拽添加
- [ ] 节点属性面板
- [ ] 节点连线与数据流

### Phase 3: 工作流执行引擎 (2周)
- [ ] DAG验证（环检测、拓扑排序）
- [ ] 节点执行器接口
- [ ] LLM适配器（OpenAI/DeepSeek/通义千问）
- [ ] 阿里云TTS服务集成
- [ ] WebSocket实时日志

### Phase 4: 调试与播放功能 (1周)
- [ ] 调试抽屉组件
- [ ] 执行API调用
- [ ] 音频播放器
- [ ] AI播客播放

### Phase 5: 部署与优化 (1周)
- [ ] Docker Compose配置
- [ ] 前后端镜像构建
- [ ] 基础测试

---

## 6. API 设计

### 6.1 工作流 API

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/workflows | 创建工作流 |
| GET | /api/workflows/{id} | 获取工作流 |
| PUT | /api/workflows/{id} | 更新工作流 |
| DELETE | /api/workflows/{id} | 删除工作流 |
| GET | /api/workflows | 列表工作流 |

### 6.2 执行 API

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/workflows/{id}/execute | 执行工作流 |
| GET | /api/executions/{id} | 获取执行结果 |
| WS | /ws/execute | WebSocket实时日志 |

---

## 7. LLM 适配器

### 7.1 支持的厂商
- OpenAI (GPT-4, GPT-3.5)
- DeepSeek
- 通义千问 (阿里云)

### 7.2 适配器接口
```java
public interface LLMAdapter {
    String chat(String prompt, String model);
    Stream<String> chatStream(String prompt, String model);
}
```

---

## 8. 风险与缓解

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| 大模型API不稳定 | 高 | 适配器模式 + 重试机制 |
| 阿里云TTS调用 | 中 | 异步处理 + 进度推送 |
| 图循环依赖 | 高 | 执行前DAG验证 |
| WebSocket长连接 | 中 | 心跳检测 + 断线重连 |

---

## 9. 复杂度评估

- **难度等级**: ★★★★☆ (4/5)
- **预估时间**: 7-8周

### 主要挑战
1. React Flow 自定义节点开发
2. 图执行器的状态管理和错误恢复
3. 多模态数据(文本→音频)流转处理
4. WebSocket实时反馈实现

---

## 10. 项目结构

```
PaiAgent/
├── frontend/                 # 前端项目
│   ├── src/
│   │   ├── components/       # React组件
│   │   ├── hooks/           # 自定义Hooks
│   │   ├── store/           # 状态管理
│   │   ├── types/           # TypeScript类型
│   │   └── api/             # API调用
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                  # 后端项目
│   ├── src/main/java/
│   │   └── com/paiagent/
│   │       ├── controller/  # 控制器
│   │       ├── service/    # 业务逻辑
│   │       ├── model/      # 数据模型
│   │       ├── engine/     # 工作流引擎
│   │       ├── adapter/    # LLM适配器
│   │       └── config/     # 配置
│   ├── pom.xml
│   └── application.yml
│
├── docker-compose.yml        # 部署配置
└── PLAN.md                   # 本文档
```

---

*最后更新: 2026-02-25*
