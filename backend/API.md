# PaiAgent API 文档

## 概述

PaiAgent 后端 API 遵循 RESTful 设计规范，提供工作流管理和执行功能。

**基础 URL**: `http://localhost:8080/api`

**WebSocket URL**: `ws://localhost:8080/ws`

---

## 数据模型

### WorkflowNode (工作流节点)

```typescript
interface WorkflowNode {
  id: string           // 节点唯一标识
  type: 'user-input' | 'llm' | 'tts' | 'end'  // 节点类型
  position: { x: number; y: number }  // 画布位置
  data: {
    type: string      // 节点类型
    label: string     // 显示标签
    placeholder?: string  // 输入占位符
    config?: LLMConfig | TTSConfig  // 节点配置
    [key: string]: unknown  // 扩展字段
  }
}
```

### WorkflowEdge (工作流边)

```typescript
interface WorkflowEdge {
  id: string           // 边唯一标识
  source: string       // 源节点ID
  target: string       // 目标节点ID
  label?: string       // 边标签（可选）
}
```

### LLMConfig (大模型配置)

```typescript
interface LLMConfig {
  provider: 'openai' | 'deepseek' | 'qwen'  // 厂商
  model: string        // 模型名称
  apiKey: string       // API密钥
  temperature?: number // 温度参数 (0-2)
  maxTokens?: number   // 最大token数
}
```

### TTSConfig (语音合成配置)

```typescript
interface TTSConfig {
  voice: string        // 声音名称 (如: xiaoyun)
  speed?: number       // 语速 (0.5-2.0)
  volume?: number      // 音量 (0-1)
}
```

---

## 工作流 API

### 1. 创建工作流

**POST** `/api/workflows`

创建新的工作流。

**请求体:**

```json
{
  "name": "工作流名称",
  "nodes": [
    {
      "id": "node-1",
      "type": "user-input",
      "position": { "x": 0, "y": 0 },
      "data": {
        "type": "user-input",
        "label": "用户输入",
        "placeholder": "请输入文本..."
      }
    },
    {
      "id": "node-2",
      "type": "llm",
      "position": { "x": 200, "y": 0 },
      "data": {
        "type": "llm",
        "label": "AI对话",
        "config": {
          "provider": "openai",
          "model": "gpt-4",
          "apiKey": "sk-xxx",
          "temperature": 0.7
        }
      }
    },
    {
      "id": "node-3",
      "type": "tts",
      "position": { "x": 400, "y": 0 },
      "data": {
        "type": "tts",
        "label": "语音合成",
        "config": {
          "voice": "xiaoyun",
          "speed": 1.0,
          "volume": 1.0
        }
      }
    },
    {
      "id": "node-4",
      "type": "end",
      "position": { "x": 600, "y": 0 },
      "data": {
        "type": "end",
        "label": "结束"
      }
    }
  ],
  "edges": [
    { "id": "edge-1", "source": "node-1", "target": "node-2" },
    { "id": "edge-2", "source": "node-2", "target": "node-3" },
    { "id": "edge-3", "source": "node-3", "target": "node-4" }
  ]
}
```

**响应 (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "工作流名称",
    "nodes": [...],
    "edges": [...],
    "createdAt": "2026-02-25T10:00:00Z",
    "updatedAt": "2026-02-25T10:00:00Z"
  },
  "error": null
}
```

---

### 2. 获取工作流

**GET** `/api/workflows/{id}`

根据ID获取工作流详情。

**路径参数:**

| 参数 | 类型 | 描述 |
|------|------|------|
| id | Long | 工作流ID |

**响应 (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "工作流名称",
    "nodes": [...],
    "edges": [...],
    "createdAt": "2026-02-25T10:00:00Z",
    "updatedAt": "2026-02-25T10:00:00Z"
  },
  "error": null
}
```

**错误响应 (404 Not Found):**

```json
{
  "success": false,
  "data": null,
  "error": "Workflow not found"
}
```

---

### 3. 更新工作流

**PUT** `/api/workflows/{id}`

更新现有工作流。

**路径参数:**

| 参数 | 类型 | 描述 |
|------|------|------|
| id | Long | 工作流ID |

**请求体:**

```json
{
  "name": "新的工作流名称",
  "nodes": [...],
  "edges": [...]
}
```

**响应 (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "新的工作流名称",
    "nodes": [...],
    "edges": [...],
    "createdAt": "2026-02-25T10:00:00Z",
    "updatedAt": "2026-02-25T11:00:00Z"
  },
  "error": null
}
```

---

### 4. 删除工作流

**DELETE** `/api/workflows/{id}`

删除指定工作流。

**路径参数:**

| 参数 | 类型 | 描述 |
|------|------|------|
| id | Long | 工作流ID |

**响应 (204 No Content):**

无返回内容。

---

### 5. 列表工作流

**GET** `/api/workflows`

获取所有工作流列表。

**查询参数:**

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| page | Integer | 0 | 页码 (从0开始) |
| size | Integer | 20 | 每页数量 |
| sort | String | "id,desc" | 排序字段 |

**响应 (200 OK):**

```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 1,
        "name": "工作流1",
        "nodeCount": 4,
        "createdAt": "2026-02-25T10:00:00Z",
        "updatedAt": "2026-02-25T10:00:00Z"
      },
      {
        "id": 2,
        "name": "工作流2",
        "nodeCount": 3,
        "createdAt": "2026-02-24T10:00:00Z",
        "updatedAt": "2026-02-24T10:00:00Z"
      }
    ],
    "totalElements": 2,
    "totalPages": 1,
    "page": 0,
    "size": 20
  },
  "error": null
}
```

---

## 执行 API

### 6. 执行工作流

**POST** `/api/workflows/{id}/execute`

执行指定工作流。

**路径参数:**

| 参数 | 类型 | 描述 |
|------|------|------|
| id | Long | 工作流ID |

**请求体:**

```json
{
  "input": "用户输入的文本内容"
}
```

**响应 (202 Accepted):**

```json
{
  "success": true,
  "data": {
    "executionId": 1,
    "status": "RUNNING"
  },
  "error": null
}
```

**错误响应 - 工作流验证失败 (400 Bad Request):**

```json
{
  "success": false,
  "data": null,
  "error": "Workflow validation failed: Cycle detected in graph"
}
```

---

### 7. 获取执行结果

**GET** `/api/executions/{id}`

获取执行结果。

**路径参数:**

| 参数 | 类型 | 描述 |
|------|------|------|
| id | Long | 执行记录ID |

**响应 (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "workflowId": 1,
    "input": "用户输入的文本内容",
    "output": "AI生成的回复文本",
    "audioUrl": "https://oss.example.com/audio/xxx.mp3",
    "status": "SUCCESS",
    "logs": [
      {
        "nodeId": "node-1",
        "nodeType": "user-input",
        "status": "COMPLETED",
        "message": "接收到用户输入",
        "timestamp": "2026-02-25T10:00:00Z"
      },
      {
        "nodeId": "node-2",
        "nodeType": "llm",
        "status": "COMPLETED",
        "message": "LLM调用成功",
        "output": "AI回复内容",
        "timestamp": "2026-02-25T10:00:01Z"
      },
      {
        "nodeId": "node-3",
        "nodeType": "tts",
        "status": "COMPLETED",
        "message": "语音合成完成",
        "audioUrl": "https://oss.example.com/audio/xxx.mp3",
        "timestamp": "2026-02-25T10:00:02Z"
      }
    ],
    "createdAt": "2026-02-25T10:00:00Z"
  },
  "error": null
}
```

**执行状态说明:**

| 状态 | 描述 |
|------|------|
| PENDING | 等待执行 |
| RUNNING | 执行中 |
| SUCCESS | 执行成功 |
| FAILED | 执行失败 |

---

### 8. 获取执行列表

**GET** `/api/executions`

获取工作流的执行历史。

**查询参数:**

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| workflowId | Long | - | 按工作流ID过滤 |
| page | Integer | 0 | 页码 |
| size | Integer | 20 | 每页数量 |

**响应 (200 OK):**

```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 1,
        "workflowId": 1,
        "workflowName": "工作流1",
        "input": "测试输入",
        "output": "测试输出",
        "status": "SUCCESS",
        "createdAt": "2026-02-25T10:00:00Z"
      }
    ],
    "totalElements": 1,
    "totalPages": 1
  },
  "error": null
}
```

---

## WebSocket API

### 9. 实时执行日志

**WebSocket** `/ws/execute`

建立WebSocket连接以接收实时执行日志。

**连接建立:**

```
ws://localhost:8080/ws/execute?executionId=1
```

**客户端发送:**

```json
{
  "type": "START",
  "executionId": 1,
  "input": "用户输入文本"
}
```

**服务端消息格式:**

```json
{
  "type": "LOG",
  "executionId": 1,
  "nodeId": "node-2",
  "nodeType": "llm",
  "status": "RUNNING",
  "message": "正在调用LLM...",
  "timestamp": "2026-02-25T10:00:01Z"
}
```

```json
{
  "type": "LOG",
  "executionId": 1,
  "nodeId": "node-2",
  "nodeType": "llm",
  "status": "COMPLETED",
  "message": "LLM调用成功",
  "output": "AI回复内容",
  "timestamp": "2026-02-25T10:00:02Z"
}
```

```json
{
  "type": "COMPLETE",
  "executionId": 1,
  "status": "SUCCESS",
  "output": "AI生成的回复",
  "audioUrl": "https://oss.example.com/audio/xxx.mp3",
  "timestamp": "2026-02-25T10:00:03Z"
}
```

```json
{
  "type": "ERROR",
  "executionId": 1,
  "status": "FAILED",
  "error": "LLM API调用失败: Rate limit exceeded",
  "timestamp": "2026-02-25T10:00:03Z"
}
```

**消息类型说明:**

| 类型 | 描述 |
|------|------|
| START | 执行开始 |
| LOG | 节点执行日志 |
| OUTPUT | 节点输出 |
| COMPLETE | 执行完成 |
| ERROR | 执行错误 |

---

## LLM 适配器接口

### LLMAdapter

```java
public interface LLMAdapter {
    /**
     * 同步调用LLM
     * @param prompt 输入提示词
     * @param config LLM配置
     * @return LLM响应
     */
    String chat(String prompt, LLMConfig config);

    /**
     * 流式调用LLM
     * @param prompt 输入提示词
     * @param config LLM配置
     * @return 流式响应
     */
    Stream<String> chatStream(String prompt, LLMConfig config);

    /**
     * 获取支持的模型列表
     * @return 模型列表
     */
    List<String> getSupportedModels();
}
```

### 已实现的适配器

| 适配器 | 模型示例 | API地址 |
|--------|----------|---------|
| OpenAIAdapter | gpt-4, gpt-3.5-turbo | api.openai.com |
| DeepSeekAdapter | deepseek-chat | api.deepseek.com |
| QwenAdapter | qwen-turbo, qwen-max | dashscope.aliyuncs.com |

---

## 错误响应格式

所有API错误响应遵循统一格式:

```json
{
  "success": false,
  "data": null,
  "error": "错误描述"
}
```

**常见HTTP状态码:**

| 状态码 | 描述 |
|--------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 204 | 删除成功 |
| 400 | 请求参数错误 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |
| 502 | 网关错误 |
| 503 | 服务不可用 |

---

## 附录: 数据库表结构

### workflow 表

| 字段 | 类型 | 描述 |
|------|------|------|
| id | BIGINT | 主键, 自增 |
| name | VARCHAR(255) | 工作流名称 |
| nodes | JSON | 节点配置 |
| edges | JSON | 边配置 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

### execution_log 表

| 字段 | 类型 | 描述 |
|------|------|------|
| id | BIGINT | 主键, 自增 |
| workflow_id | BIGINT | 关联工作流ID |
| input | TEXT | 输入内容 |
| output | TEXT | 输出内容 |
| audio_url | VARCHAR(512) | 音频URL |
| status | VARCHAR(32) | 执行状态 |
| logs | JSON | 执行日志 |
| created_at | DATETIME | 执行时间 |
