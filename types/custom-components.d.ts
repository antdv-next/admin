export {}

/* prettier-ignore */
declare module 'vue' {
    export interface GlobalComponents {
      Access: typeof import("../src/components/access/access.vue")
      AntdIcon: typeof import("../src/components/icons/antd.vue")
    }
}
