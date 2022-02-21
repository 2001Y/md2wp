// ▼ ▼ ▼ ▼ ▼ ▼ ▼  OPTION  ▼ ▼ ▼ ▼ ▼ ▼ ▼

const URL = "https://yoshikitam.wpx.jp/2001y/";
const WP_user = "2001Y"; //WPユーザー名
const WP_AppPass = "9Qx0 WFj6 Ih8Q OriT e1SY rDFp"; // Application Passwords

// ▲ ▲ ▲ ▲ ▲ ▲ ▲  OPTION  ▲ ▲ ▲ ▲ ▲ ▲ ▲

import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import matter from "gray-matter";

const fetchHead = {
  "Content-Type": "application/json",
  Authorization:
    "Basic " + Buffer.from(WP_user + ":" + WP_AppPass).toString("base64"),
};

const dirpath = "./md"; //Markdownのフォルダ
const flst = fs
  .readdirSync(dirpath, { withFileTypes: true }) //同期でファイル読み込み
  .filter((dirent) => dirent.isFile())
  .map(({ name }) => name) //フォルダ除外
  .filter((fn) => fn.endsWith(".md")); //md限定

(async () => {
  let categoryJSON = await fetch(
    path.join(URL, "/wp-json/wp/v2/categories")
  ).then((response) => response.json());
  let tagJSON = await fetch(path.join(URL, "/wp-json/wp/v2/tags")).then(
    (response) => response.json()
  );

  for (let fileName of flst) {
    // 記事毎の処理
    let url = path.join(dirpath, fileName);
    let raw = fs.readFileSync(url);
    let md = matter(raw);

    let postState = "publish";
    if (md.data.draft) {
      postState = "draft";
    }

    let mdCategories = md.data.categories;
    let postCategory = [];
    if (mdCategories) {
      for (let categoryName of mdCategories) {
        //   カテゴリ毎の処理
        let categoryId;
        let targetUser = categoryJSON.find((v) => v.name === categoryName);

        if (targetUser) {
          categoryId = targetUser.id;
        } else {
          categoryId = await fetch(
            path.join(URL, "/wp-json/wp/v2/categories"),
            {
              method: "POST",
              headers: fetchHead,
              body: JSON.stringify({
                name: categoryName,
              }),
            }
          )
            .then((response) => response.json())
            .then((e) => e.id);
          categoryJSON.push({
            id: categoryId,
            name: categoryName,
          });
        }
        postCategory.push(categoryId);
        // カテゴリ毎の処理
      }
    }

    let mdTag = md.data.tags;
    let postTag = [];
    if (mdTag) {
      for (let tagName of mdTag) {
        // タグ毎の処理
        let tagId;
        let targetUser = tagJSON.find((v) => v.name === tagName);

        if (targetUser) {
          tagId = targetUser.id;
        } else {
          tagId = await fetch(path.join(URL, "/wp-json/wp/v2/tags"), {
            method: "POST",
            headers: fetchHead,
            body: JSON.stringify({
              name: tagName,
            }),
          })
            .then((response) => response.json())
            .then((e) => e.id);
          tagJSON.push({
            id: tagId,
            name: tagName,
          });
        }
        postTag.push(tagId);
        // タグ毎の処理
      }
    }

    fetch(path.join(URL, "/wp-json/wp/v2/posts"), {
      method: "POST",
      headers: fetchHead,
      body: JSON.stringify({
        slug: fileName.replace(".md", ""),
        title: md.data.title,
        date: md.data.date,
        content: md.content,
        transition_source: [34],
        categories: postCategory,
        tags: postTag,
        status: postState,
      }),
    });
    // 記事ごとの処理
  }

  console.log("移行DONE");
})();
