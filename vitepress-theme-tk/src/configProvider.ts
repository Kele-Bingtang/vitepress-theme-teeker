import { defineComponent, h, InjectionKey, provide, Ref, unref, type Component } from "vue";
import { usePermalinks, useAnchorScroll, useViewTransition } from "./hooks";
import type { Post } from "./data/types";
// @ts-ignore
import { data as posts } from "./data/posts.data";
import { useData } from "vitepress";
import "./styles/dark-transition.css";

export const postsSymbol: InjectionKey<Ref<Post>> = Symbol("posts");

function createConfigProvider(Layout: Component) {
  return defineComponent({
    name: "ConfigProvider",
    setup(_, { slots }) {
      // 往主题注入数据
      provide(postsSymbol, posts);

      // 开启监听器
      usePermalinks().startWatch();
      useAnchorScroll().startWatch();
      useViewTransition();

      return () => h(Layout, null, slots);
    },
  });
}

export const configProvider = (Layout: Component) => {
  return createConfigProvider(Layout);
};

export const useUnrefData = () => {
  const { theme, frontmatter, site, page } = useData();
  return { theme: unref(theme), frontmatter: unref(frontmatter), site: unref(site), page: unref(page) };
};

export const isHomePage = () => {
  return !isCategoriesPage() && !isTagsPage();
};

export const isCategoriesPage = () => {
  const { frontmatter } = useData();
  return unref(frontmatter).categoriesPage;
};

export const isTagsPage = () => {
  const { frontmatter } = useData();
  return unref(frontmatter).tagsPage;
};

export const isArchivesPage = () => {
  const { frontmatter } = useData();
  return unref(frontmatter).archivesPage;
};

export const isCataloguePage = () => {
  const { frontmatter } = useData();
  return unref(frontmatter).catalogue;
};

export const getBgColor = () => {
  const { theme } = useData();
  return unref(theme).bgColor || ["#E15B64", "#11a8cd", "#F8B26A", "#67CC86", "#F47E60", "#849B87"];
};
