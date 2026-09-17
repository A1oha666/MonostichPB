/// <reference path="../pb_data/types.d.ts" />
// 站点个人介绍（About 页）单例集合。
//
// 背景：About 页的简介文案 / email / github 原本硬编码在
// src/pages/about.astro 与 DarkAbout.astro 里，改一句话也要改代码走提交。
// 这里新建 site_profile 集合存放这些内容，编辑器可直接修改；
// 前台构建时经 content layer loader 拉取渲染。
//
// 规则：
//   读：公开（About 页公开展示，构建机无凭据也能拉取）
//   写：仅 editors 集合成员（规则反查阶段 collectionName 不可用，须用
//       collectionId 硬编码，同 1787933000_articles_editor_write.js 的坑）
migrate((app) => {
  const editors = app.findCollectionByNameOrId("editors")

  const collection = new Collection({
    "createRule": `@request.auth.collectionId = "${editors.id}"`,
    "updateRule": `@request.auth.collectionId = "${editors.id}"`,
    "deleteRule": null,
    "listRule": "",
    "viewRule": "",
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text_profile_bio",
        "max": 0,
        "min": 0,
        "name": "bio",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text_profile_email",
        "max": 0,
        "min": 0,
        "name": "email",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text_profile_github",
        "max": 0,
        "min": 0,
        "name": "github",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      }
    ],
    "name": "site_profile",
    "system": false,
    "type": "base"
  });

  app.save(collection);

  // 单例语义由客户端保证（编辑器始终读写第一条记录）；这里预置一条
  // 初始数据，与迁移前 about.astro 的硬编码内容保持一致，构建无缝衔接。
  const record = new Record(collection);
  record.set("bio", "一名 2028 届本科 CS 学生，正在学习后端开发，尝试掌握 Golang。");
  record.set("email", "292081295@qq.com");
  record.set("github", "@A1oha666");
  return app.save(record);
}, (app) => {
  const collection = app.findCollectionByNameOrId("site_profile");
  return app.delete(collection);
})
