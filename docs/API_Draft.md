# 接口草案

## 目标

为后续接入真实后端服务预留统一接口形态，使前端页面能够从静态演示逐步过渡为数据驱动。

## 建议接口

### 项目

- `POST /api/projects`
- `GET /api/projects`
- `GET /api/projects/:id`
- `DELETE /api/projects/:id`

### 结构解析

- `POST /api/projects/:id/structure/analyze`
- `GET /api/projects/:id/structure`

### 角色与场景

- `GET /api/projects/:id/characters`
- `PUT /api/projects/:id/characters/:characterId`
- `GET /api/projects/:id/scenes`
- `PUT /api/projects/:id/scenes/:sceneId`

### 分镜与关键帧

- `GET /api/projects/:id/storyboard`
- `PUT /api/projects/:id/shots/:shotId`
- `POST /api/projects/:id/shots/:shotId/generate`
- `GET /api/projects/:id/results`

### 一致性检查

- `POST /api/projects/:id/qa-check`
- `GET /api/projects/:id/qa-check`

### 预览导出

- `GET /api/projects/:id/preview`
- `POST /api/projects/:id/export`

## 返回约定

建议统一返回：

- `code`
- `message`
- `data`
- `timestamp`
