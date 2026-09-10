/// <reference path="../pb_data/types.d.ts" />
// 允许 editors 集合成员通过 REST 直接写 articles（自建单页编辑器用）。
//
// 背景：articles 的 create/update/delete 规则原为 null（仅 superuser），
// 编辑器以 editors 身份登录后无法建/改文章。这里放开写权限给 editors。
//
// 规则坑（PocketBase v0.40 实测）：
//   写操作（create/update/delete）的规则求值发生在「规则反查集合」阶段，
//   此时 collectionName 不可用，必须用 collectionId 硬编码 editors 集合 ID；
//   读操作（list/view）无此限制，沿用 collectionName 更可读。
migrate((app) => {
  const articles = app.findCollectionByNameOrId("articles")
  const editors = app.findCollectionByNameOrId("editors")
  const editorsId = editors.id // 按 name 反查，避免不同环境 ID 漂移

  articles.createRule = `@request.auth.collectionId = "${editorsId}"`
  articles.updateRule = `@request.auth.collectionId = "${editorsId}"`
  // 不允许 editors 删除，保持 null（仅 superuser / 后台）
  articles.deleteRule = null
  // 读规则：公开只能看已发布；editors 可读全部（含草稿，编辑器载入用）
  articles.listRule = 'status = "published" || @request.auth.collectionName = "editors"'
  articles.viewRule = 'status = "published" || @request.auth.collectionName = "editors"'

  return app.save(articles)
}, (app) => {
  const articles = app.findCollectionByNameOrId("articles")
  const editors = app.findCollectionByNameOrId("editors")

  articles.createRule = null
  articles.updateRule = null
  articles.deleteRule = null
  articles.listRule = `status = "published" || @request.auth.collectionId = "${editors.id}"`
  articles.viewRule = `status = "published" || @request.auth.collectionId = "${editors.id}"`

  return app.save(articles)
})
