<script setup lang="ts" name="tkLayout">
import DefaultTheme from "vitepress/theme";
import { useData } from "vitepress";
import { computed, onMounted, ref, unref } from "vue";
import { useNamespace } from "../hooks";
import { isHomePage, isArchivesPage, isCataloguePage, useUnrefData } from "../configProvider";
import { Banner, TkThemeConfig } from "../config/types";
import {
  HomeBanner,
  HomePostList,
  HomeInfo,
  ArchivesPage,
  CataloguePage,
  ArticleAnalyze,
  ArticleImagePreview,
  BodyBgImage,
  Footer,
  RightBottomButton,
  CommentTwikoo,
  CommentArtalk,
  CommentGiscus,
  CommentWaline,
  HomeFullscreenWallpaper,
  CodeBlockToggle,
  ArticlePageStyle,
  Notice,
} from "../components";

const { Layout } = DefaultTheme;

const ns = useNamespace("layout");

const { theme, frontmatter } = useUnrefData();
const { frontmatter: frontmatterRef } = useData();

const {
  tkTheme = true,
  wallpaper = {},
  codeBlock = true,
  bodyBgImg = {},
  notice = {},
  notFoundPageDelayLoad = 100,
}: TkThemeConfig = theme;
// tkHome 支持 theme 或 index.md 的 frontmatter 配置
const tkHome = computed(() => unref(frontmatterRef).tk?.tkHome ?? theme.tkHome ?? true);

const { enabled = true, bgStyle, imgSrc }: Banner = { ...theme.banner, ...frontmatter.tk?.banner };

const comment = computed(() => {
  const commentOption = { ...theme.comment, ...frontmatter.tk?.comment };
  return {
    enabled: unref(frontmatterRef).enabled || true,
    components: {
      twikoo: CommentTwikoo,
      waline: CommentWaline,
      giscus: CommentGiscus,
      artalk: CommentArtalk,
    },
    provider: commentOption.provider,
    options: commentOption.options,
  };
});

// 禁止加载 404 页面
const disableNotFoundPage = ref(true);

onMounted(() => {
  // 延迟 100 毫秒再加载 404 页面。因为 permalink 插件支持自定义 URL，但是 VP 初始化时根据自定义 URL 寻找文档会 404，因此这里延迟来给 permalink 插件寻找正确的文档路径
  setTimeout(() => (disableNotFoundPage.value = false), notFoundPageDelayLoad);
});
</script>

<template>
  <template v-if="tkTheme">
    <ClientOnly>
      <RightBottomButton />
      <BodyBgImage v-if="bodyBgImg?.imgSrc" />
      <Notice v-if="notice?.enabled">
        <template #notice-content>
          <slot name="notice-content" />
        </template>
      </Notice>
    </ClientOnly>

    <Layout :class="ns.b()">
      <template #home-hero-before>
        <slot name="home-hero-before" />

        <ClientOnly>
          <!-- 自定义首页 -->
          <div v-if="tkHome">
            <HomeBanner v-if="isHomePage() && enabled" />
            <div :class="[ns.e('home-content'), ns.joinNamespace('wallpaper-outside'), 'flx-start-justify-center']">
              <div :class="ns.e('home-content__post')"><HomePostList /></div>
              <div :class="ns.e('home-content__info')"><HomeInfo /></div>
            </div>
            <HomeFullscreenWallpaper
              v-if="wallpaper.enabled && ((bgStyle === 'bigImg' && imgSrc) || theme.bodyBgImg?.imgSrc)"
            />
          </div>
        </ClientOnly>
      </template>

      <template #layout-top>
        <slot name="layout-top" />
      </template>
      <template #layout-bottom>
        <Footer v-if="isHomePage()" />
        <slot name="layout-bottom" />
      </template>

      <template #doc-before>
        <slot name="doc-before" />
        <ClientOnly>
          <ArticleAnalyze />
          <ArticleImagePreview />
          <ArticlePageStyle />
          <CodeBlockToggle v-if="codeBlock" />
        </ClientOnly>
      </template>

      <template #doc-after>
        <slot name="doc-after" />
        <!-- 评论区 -->
        <template v-if="comment.enabled">
          <ClientOnly>
            <slot v-if="comment.provider === 'render'" name="comment" />
            <component
              v-else-if="comment.provider"
              :is="comment.components[comment.provider]"
              :id="`${ns.namespace}-comment`"
              :class="ns.e('comment')"
            />
          </ClientOnly>
        </template>
      </template>

      <!-- content -->
      <template #page-top>
        <slot name="page-top" />
        <ArchivesPage v-if="isArchivesPage()" />
        <CataloguePage v-if="isCataloguePage()" />
      </template>
      <template #page-bottom>
        <slot name="page-bottom" />
      </template>

      <!-- 404 页面延迟出现 -->
      <template #not-found>
        <!-- VP 认为插槽内容为空则插槽不起作用，因此添加空内容来起作用 -->
        <template v-if="disableNotFoundPage">{{}}</template>
        <template v-else><slot name="not-found" /></template>
      </template>

      <template v-for="(_, name) in $slots" #[name]="slotData" :key="name">
        <slot :name="name" v-bind="slotData"></slot>
      </template>
    </Layout>
  </template>

  <template v-else>
    <Layout>
      <template v-for="(_, name) in $slots" #[name]="slotData" :key="name">
        <slot :name="name" v-bind="slotData"></slot>
      </template>
    </Layout>
  </template>
</template>
