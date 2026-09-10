/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4287850865")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.collectionId = \"pbc_3924173833\"",
    "listRule": "status = \"published\" || @request.auth.collectionName = \"editors\"",
    "viewRule": "status = \"published\" || @request.auth.collectionName = \"editors\""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4287850865")

  // update collection data
  unmarshal({
    "createRule": "",
    "listRule": "status = \"published\" || @request.auth.id != \"\" && @request.auth.collectionId = \"pbc_3924173833\"",
    "viewRule": "status = \"published\" || @request.auth.id != \"\" && @request.auth.collectionId = \"pbc_3924173833\""
  }, collection)

  return app.save(collection)
})
