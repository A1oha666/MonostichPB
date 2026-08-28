# MonostichPB

monostich.cloud 的后端：PocketBase 钩子、数据库迁移与部署流水线。

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
