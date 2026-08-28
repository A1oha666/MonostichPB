# MonostichPB

monostich.cloud 的后端：PocketBase 钩子、数据库迁移与部署流水线。前端在 [A1oha666/MonostichBlog](https://github.com/A1oha666/MonostichBlog)。

## 结构

```text
pb_hooks/          钩子（*.pb.js 自动加载）
  content-dispatch.pb.js   内容变更 → repository_dispatch 触发前端重建
  view-counter.pb.js       POST /api/monostich/views 访问计数
  rebuild-lib.js           共享函数（普通模块，非钩子）
pb_migrations/     数据库迁移，重启时自动执行
scripts/pb-setup.mjs  新环境初始化集合与规则
deploy/            运维手册、systemd、nginx、备份
```

## 日常操作

- **改钩子**：改 `pb_hooks/` → push 到 `main` → 自动部署重启。
- **改集合结构**：只走 `pb_migrations/`（`./pocketbase migrate create`），不要在后台 UI 改。
- **排查**：`journalctl -u pocketbase -n 50 --no-pager`。

## 必须知道的坑

- jsvm 钩子回调在隔离上下文执行，**看不到 `.pb.js` 顶层的函数**；共享逻辑放独立 `.js` 模块，回调内 `require()`（见 `rebuild-lib.js`）。
- text 字段 `max: 0` 不是不限长，是默认 **5000**；`content` 现为 200000。
- 计数必须用 SQL 自增，不能走 record update（否则每次浏览触发一次前端重建）。
- 本地跑 `./pocketbase serve` 建议 `--hooksWatch=false`（macOS 下 watcher 误报导致每分钟重启）。

## 部署

push 后 GitHub Actions 自动 scp 到 `/opt/monostich/pb/` 并重启。secrets：`DEPLOY_HOST`、`DEPLOY_USER`、`DEPLOY_SSH_KEY`、`DEPLOY_PORT`（可选）。

## 本地开发

博客仓库的 `pb/pb_hooks`、`pb/pb_migrations` 是指向本仓库的软链接；本地 PB 在 `../MonostichBlog/pb`（`./pocketbase serve --http=127.0.0.1:8090`）。`pb_data/` 与凭据不进仓库。
