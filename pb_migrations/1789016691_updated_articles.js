/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4287850865")

  // update collection data
  unmarshal({
    "createRule": ""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4287850865")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id != \"\" && @request.auth.collectionId = \"editors\""
  }, collection)

  return app.save(collection)
})
