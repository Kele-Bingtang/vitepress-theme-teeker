import DefaultTheme from "vitepress/theme";
import Layout from "./layout/index.vue";
import { configProvider } from "./configProvider";
import { CataloguePage, ArchivesPage } from "./components";
import "./styles/index.scss";

import "element-plus/theme-chalk/base.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import "element-plus/theme-chalk/el-image-viewer.css";
import "element-plus/theme-chalk/el-pagination.css";
import "element-plus/theme-chalk/el-input.css";

export type { TkThemeConfig } from "./config/types";
export type { TkContentData, Post, GroupCardItem, FrontMatter } from "./post/types";

export type DefaultThemeType = typeof DefaultTheme;

export * from "./components";

export {
  createContainerThenUse,
  createContainerThenGet,
  createContainersThenUse,
  createContainersThenGet,
} from "./markdown/plugins/container";

export default {
  extends: DefaultTheme,
  Layout: configProvider(Layout),
  enhanceApp({ app, router, siteData }) {
    app.component("cataloguePage", CataloguePage);
    app.component("archivesPage", ArchivesPage);
  },
} as DefaultThemeType & { extends: DefaultThemeType };
