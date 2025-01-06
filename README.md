# Tauri + React + Typescript

like [obsidian-ibook-plugin](https://github.com/bingryan/obsidian-ibook-plugin/blob/9eb94c0d25dc4de5ef6e9a8e7d11c5e4447a7770/src/api/ibook.ts#L38)

This template should help get you started developing with Tauri, React and Typescript in Vite.

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20250106131802068.png?x-oss-process=image/format,webp/resize,w_640)

运行 `pnpm tauri dev` 将downloaded一堆桌面端依赖(首次运行)，后comiling 这些依赖，后build出一个二进制(src-tauri/target/debug/*)桌面应用，并running

关闭掉了之后，需要手动到二进制文件中运行应用，因为dev不会构建出正式build时的应用，出现在`Applications`里

重新执行 `pnpm tauri dev` ，会出新comiling build，有点慢...

而如果不需要关心桌面端的功能，可以只运行web，`pnpm dev`

## 环境搭建

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20250106104342686.png?x-oss-process=image/format,webp/resize,w_640)

```zsh
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20250106114716723.png?x-oss-process=image/format,webp/resize,w_640)

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20250106114811110.png?x-oss-process=image/format,webp/resize,w_640)

```zsh
. "$HOME/.cargo/env"            # For sh/bash/zsh/ash/dash/pdksh
source "$HOME/.cargo/env.fish"  # For fish
```

### 1. CLang 和 macOS 开发依赖项

首先您需要安装 [Rust](www.rust-lang.org) 及其他系统依赖。

```
xcode-select --install

```

安装比较慢，需要耐心等待。如果出现以下提示说明已经安装可以跳过。

```
xcode-select --install

xcode-select: error: command line tools are already installed, use "Software Update" in System Settings to install updates
```

### 2. Rust

```
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh

```

安装过程中，会询问安装模式，一路回车确认即可。

**提示汉化**

```
这将下载并安装 Rust 的官方编译器，和它的包管理器​​Cargo​​。

Rustup 元数据和工具链将被安装到 Rustup 中家目录，位于：

/Users/{username}/.rustup  
这可以用​​RUSTUP_HOME​​环境变量修改。

Cargo 主目录位于:

/Users/{username}/.cargo  
cargo, rustc, rustup 和其他命令将被安装到​​Cargo​​的 bin 目录中，位于

/Users/{username}/.cargo/bin  
这个路径将被添加到​​PATH​​环境变量，修改配置文件位于:

/Users/{username}/.profile

/Users/{username}/.bash_profile  
/Users/{username}/.bashrc  
/Users/{username}/.zshenv  
您可以随时卸载

rustup self uninstall  
卸载后，上面的更改将被还原。
```

```zsh
# 若要更新 Rust，请打开终端并运行以下命令
rustup update

# 完全卸载 Rust
rustup self uninstall

# 查看 Rust 版本号
rustc --version
```

## 打包Tauri

### 1. 修改包名

出现以下提示，需要修改包名,Tauri不允许使用默认的包名。

You must change the bundle identifier in `tauri.conf.json > tauri > bundle > identifier`. The default value `com.tauri.dev` is not allowed as it must be unique across applications.

### 2. 打包

```
npm run tauri build

```

出现提示,就打包完成了，打包完成之后只有 2M，和现在动不动就几百的安装包比起来真是小而美了，存储在`src-tauri/target/release/bundle`目录下。

```
/Users/peterpan/VscodeProjects/tauri-app/src-tauri/target/release/bundle/macos/tauri-app.app
/Users/peterpan/VscodeProjects/tauri-app/src-tauri/target/release/bundle/dmg/tauri-app_0.0.0_x64.dmg

```

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## nodejs版本

```ts
import Database from "better-sqlite3";
import fs from "node:fs";
import { homedir } from "node:os";

interface Book {
  id: number;
  title: string;
  author: string;
  path: string;
}

interface Annotation {
  id: number;
  bookId: number;
  text: string;
  note: string;
}

// 定义SQLite文件路径cd
const ibooksDataPath = `${homedir()}/Library/Containers/com.apple.iBooksX/Data/Documents/`;
// const bkLibraryPath = `${ibooksDataPath}BKLibrary.sqlite`;
const bkLibraryPath = `${ibooksDataPath}BKLibrary/BKLibrary-1-091020131601.sqlite`;

// const aeAnnotationPath = `${ibooksDataPath}AEAnnotation.sqlite`;
const aeAnnotationPath = `${ibooksDataPath}AEAnnotation/AEAnnotation_v10312011_1727_local.sqlite`;


console.log('1', fs.existsSync(bkLibraryPath))
console.log('2', fs.existsSync(aeAnnotationPath))

// 检查文件是否存在
if (!fs.existsSync(bkLibraryPath) || !fs.existsSync(aeAnnotationPath)) {
  console.error(
    "Error: SQLite files not found. Please ensure iBooks data exists at the default location."
  );
  process.exit(1);
}

// 解析BKLibrary.sqlite
function parseBKLibrary(db: Database): Book[] {
  const query = db.prepare("SELECT * FROM ZBKLIBRARYASSET");
  const books = query.all() as Array<{
    ZASSETID: number;
    ZTITLE: string;
    ZAUTHOR: string;
    ZPATH: string;
  }>;
  return books.map((book) => ({
    id: book.ZASSETID,
    title: book.ZTITLE,
    author: book.ZAUTHOR,
    path: book.ZPATH,
  }));
}

// 解析AEAnnotation.sqlite
function parseAEAnnotation(db: Database): Annotation[] {
  const query = db.prepare("SELECT * FROM ZAEANNOTATION");
  const annotations = query.all() as Array<{
    ZANNOTATIONID: number;
    ZANNOTATIONASSETID: number;
    ZANNOTATIONSELECTEDTEXT: string;
    ZANNOTATIONNOTE: string;
  }>;
  return annotations.map((annotation) => ({
    id: annotation.ZANNOTATIONID,
    bookId: annotation.ZANNOTATIONASSETID,
    text: annotation.ZANNOTATIONSELECTEDTEXT,
    note: annotation.ZANNOTATIONNOTE,
  }));
}

// 主函数
function main() {
  try {
    // 打开数据库
    const bkLibraryDb = new Database(bkLibraryPath, { readonly: true });
    const aeAnnotationDb = new Database(aeAnnotationPath, { readonly: true });
    console.log('1')

    // 解析数据
    const books = parseBKLibrary(bkLibraryDb);
    const annotations = parseAEAnnotation(aeAnnotationDb);
    console.log('2')

    // 关闭数据库
    bkLibraryDb.close();
    aeAnnotationDb.close();

    // 输出JSON到控制台
    console.log(JSON.stringify({ books, annotations }, null, 2));
    // 把json写入当前文件 books.json中
    fs.writeFileSync('books.json', JSON.stringify({ books, annotations }, null, 2))
  } catch (error) {
    console.error("Error parsing SQLite files:", error);
    process.exit(1);
  }
}

// 运行主函数
main();
```
