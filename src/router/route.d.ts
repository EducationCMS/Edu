import "vue-router"

declare module 'vue-router' {
  interface RouteMeta {
    // is optional
    // must be declared by every route
    sidebar: boolean,
  }
}
