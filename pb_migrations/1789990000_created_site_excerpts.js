/// <reference path="../pb_data/types.d.ts" />
// 首页页脚摘抄：一个 JSON 数组保存顺序及全部条目，一次保存只触发一次重建。
migrate((app) => {
  const editors = app.findCollectionByNameOrId("editors");
  const collection = new Collection({
    name: "site_excerpts",
    type: "base",
    listRule: "",
    viewRule: "",
    createRule: `@request.auth.collectionId = "${editors.id}"`,
    updateRule: `@request.auth.collectionId = "${editors.id}"`,
    deleteRule: null,
    fields: [{ name: "items", type: "json", required: false }],
  });
  app.save(collection);

  const record = new Record(collection);
  record.set("items", [{
    text: "自由意味着休息、艺术成果，还有我生命中智慧的施展。",
    author: "佩索阿",
    source: "《惶然录》",
  }]);
  return app.save(record);
}, (app) => {
  const collection = app.findCollectionByNameOrId("site_excerpts");
  return app.delete(collection);
});
