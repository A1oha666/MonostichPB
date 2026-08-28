/// <reference path="../pb_data/types.d.ts" />
// 小记（moments）只要正文，标题改为非必填。
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4287850865")
  const field = collection.fields.getByName("title")
  field.required = false
  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4287850865")
  const field = collection.fields.getByName("title")
  field.required = true
  return app.save(collection)
})
