export {}

/* prettier-ignore */
declare module 'vue' {
    export interface GlobalComponents {
      Access: typeof import("../src/components/access/access.vue")
      AntdIcon: typeof import("../src/components/icons/antd.vue")
      PageContainer: typeof import("../src/components/page-container/index.vue")
      SearchFormGrid: typeof import("../src/components/search-grid/index.vue")
      SearchFormGridItem: typeof import("../src/components/search-grid-item/index.vue")
    }
}
