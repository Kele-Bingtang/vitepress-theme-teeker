<script setup lang="ts" name="ArticleAnalyze">
import { computed, nextTick, onMounted, ref, unref } from "vue";
import { useRoute, useData } from "vitepress";
import { Reading, Clock, View } from "@element-plus/icons-vue";
import { FileInfo } from "vitepress-plugin-doc-analysis";
import { useNamespace, useBuSunZi } from "../../../hooks";
import { useUnrefData } from "../../../configProvider";
import { ArticleBreadcrumb, ArticleInfo, Icon } from "../../";
import { Article, DocAnalysis } from "../../../config/types";
import { TkContentData } from "../../../post/types";

defineOptions({ name: "ArticleAnalyze" });

const ns = useNamespace("articleAnalyze");

const { theme, frontmatter } = useUnrefData();
const { theme: themeRef } = useData();

// 文章基本信息
const post: TkContentData = {
  author: { ...theme.author, ...frontmatter.author },
  date: frontmatter.date,
  frontmatter: frontmatter,
  url: "",
};

// 站点信息数据
const docAnalysisInfo = computed(() => unref(themeRef).docAnalysisInfo || {});
// 站点信息配置项
const {
  pageView = true,
  wordCount = true,
  readingTime = true,
  pageIteration = 2000,
}: DocAnalysis = { ...theme.docAnalysis, ...frontmatter.docAnalysis };

const route = useRoute();

// 文章阅读量、阅读时长、字数
const pageViewInfo = computed(() => {
  let pageViewInfo: Partial<FileInfo> = {};
  unref(docAnalysisInfo).eachFileWords.forEach((item: FileInfo) => {
    if (item.fileInfo.relativePath === route.data.relativePath) return (pageViewInfo = item);
  });

  return pageViewInfo;
});

// 文章信息配置项
const { showInfo = true, teleport = {} }: Article = { ...theme.article, ...frontmatter.article };

// 是否展示作者、日期、分类、标签等信息
const isShowInfo = computed(() => {
  const arr = [showInfo].flat();
  if (arr.includes(true) || arr.includes("article")) return true;
  return false;
});

// 通过不蒜子获取页面访问量
const { pagePv, isGet } = useBuSunZi(pageIteration);

const baseInfoRef = ref<HTMLDivElement>();

const teleportInfo = () => {
  const { selector, position = "after", className = "teleport" } = teleport;
  const baseInfoRefConst = unref(baseInfoRef);
  // 没有指定选择器，则不进行传送
  if (!selector || !baseInfoRefConst) return;

  const docDomContainer = window.document.querySelector("#VPContent");
  let targetDom = docDomContainer?.querySelector(selector);

  // 传送前先尝试删除传送位置的自己，避免传送重新渲染
  targetDom?.parentElement?.querySelectorAll(`.${ns.e("wrapper")}`).forEach(v => v.remove());

  baseInfoRefConst.classList.add(className);
  targetDom?.[position]?.(baseInfoRefConst);
};

onMounted(() => {
  nextTick(() => teleportInfo());
});
</script>

<template>
  <div :class="`${ns.b()} flx-justify-between`">
    <ArticleBreadcrumb />

    <div v-if="isShowInfo" ref="baseInfoRef" :class="`${ns.e('wrapper')} flx-align-center`">
      <ArticleInfo :post scope="article" />

      <div v-if="wordCount" class="flx-center">
        <Icon><Reading /></Icon>
        <a title="文章字数" class="hover-color">{{ pageViewInfo.wordCount }}</a>
      </div>

      <div v-if="readingTime" class="flx-center">
        <Icon><Clock /></Icon>
        <a title="预计阅读时长" class="hover-color">{{ pageViewInfo.readingTime }}</a>
      </div>

      <div v-if="pageView" class="flx-center">
        <Icon><View /></Icon>
        <a title="浏览量" class="hover-color">{{ isGet ? pagePv : "Get..." }}</a>
      </div>
    </div>
  </div>
</template>
