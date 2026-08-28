# MonostichPB

monostich.cloud 的后端仓库：PocketBase 的钩子、数据库迁移与部署流水线。

博客前端在 [A1oha666/MonostichBlog](https://github.com/A1oha666/MonostichBlog)；前端构建时从 PocketBase 拉取 published 内容生成静态站，本仓库负责内容层本身。

## 结构

```text
pb_hooks/        jsvm 钩子（*.pb.js 自动加载；共享逻辑放普通 .js 模块，回调内 require()）
  content-dispatch.pb.js   内容变更 → repository_dispatch 触发前端重建
  rebuild-lib.js           content-dispatch 的共享实现（jsvm 回调序列化后看不到顶层作用域，必须走模块）
  view-counter.pb.js       POST /api/monostich/views 访问计数（SQL 自增，不触发重建）
pb_migrations/   数据库迁移，重启时自动执行
scripts/
  pb-setup.mjs   幂等初始化集合与 API 规则（新环境用）
deploy/          服务器运维：systemd、nginx、备份脚本、运维手册（server.md）
```

## 部署（自动）

push 到 `main` 且改动涉及 `pb_hooks/` 或 `pb_migrations/` 时，GitHub Actions 自动：

1. scp 钩子与迁移到服务器 `/opt/monostich/pb/`
2. `systemctl restart pocketbase`（重启时自动执行未应用的迁移）
3. 健康检查 + 钩子加载检查

所需 secrets（仓库 Settings → Secrets and variables → Actions）：

| Secret | 说明 |
|---|---|
| `DEPLOY_HOST` | 服务器 IP |
| `DEPLOY_USER` | SSH 用户（需可免密 sudo/管理 systemd） |
| `DEPLOY_SSH_KEY` | 私钥（与服务器 authorized_keys 配对） |
| `DEPLOY_PORT` | 可选，默认 22 |

## 本地开发

```bash
# 1. 博客仓库的 pb/ 目录里有 PocketBase 二进制与本地数据
cd ../MonostichBlog/pb && ./pocketbase serve --http=127.0.0.1:8090

# 2. 博客仓库的 pb/pb_hooks、pb/pb_migrations 是指向本仓库的软链接，
#    改本仓库的钩子即改本地开发钩子（可加 --hooksWatch=false 避免 macOS 重载抖动）

# 3. 全新环境初始化集合（也可指向线上）
PB_BASE_URL=http://127.0.0.1:8090 \
PB_ADMIN_EMAIL=... PB_ADMIN_PASSWORD=... \
node scripts/pb-setup.mjs
```

凭据与数据（`pb_data/`、`.env.local`）永远不进任何仓库。

## 注意事项（踩过的坑）

- PocketBase text 字段 `max: 0` 不是不限长，是默认 **5000**；正文字段必须显式设大值（现 200000）。
- jsvm 钩子回调会被序列化到隔离上下文执行，**不能引用 .pb.js 文件顶层的函数/变量**，共享逻辑必须放独立模块由回调内 `require()`。
- 计数接口故意用原生 SQL 自增而非 record update，否则每次浏览都会触发一次前端重建。
- `$http.send` 必须是请求路径上最后一个动作，之后不要读它的返回值。
