export {}

/* prettier-ignore */
declare module 'vue' {
    export interface GlobalComponents {
      AntdIcon: typeof import("../src/components/icons/antd.vue")
    }
}
