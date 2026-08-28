/// <reference path="../pb_data/types.d.ts" />
// 小记可以只有正文：slug 留空时自动生成（title 已由 1787932800 迁移改为非必填）。
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4287850865")
  const field = collection.fields.getByName("slug")
  field.autogeneratePattern = "[a-z0-9]{15}"
  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4287850865")
  const field = collection.fields.getByName("slug")
  field.autogeneratePattern = ""
  return app.save(collection)
})
