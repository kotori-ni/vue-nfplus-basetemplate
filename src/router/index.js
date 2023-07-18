import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
	roles: ['admin','editor']    control the page roles (you can set multiple roles)
	title: 'title'               the name show in sidebar and breadcrumb (recommend set)
	icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
	breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
	activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
	{
		path: '/login',
		component: () => import('@/views/login/index'),
		hidden: true
	},

	{
		path: '/404',
		component: () => import('@/views/404'),
		hidden: true
	},

	{
		path: '/',
		component: Layout,
		redirect: '/map',
		children: [{
			path: 'map',
			name: '指标地图',
			component: () => import('@/views/map/index'),
			meta: { title: '指标地图', icon: 'dashboard' }
		}]
	},

	{
		path: '/indicator',
		component: Layout,
		redirect: '/indicator/dictionary',
		name: '指标管理',
		meta: { title: '指标管理', icon: 'el-icon-s-help' },
		children: [
			{
				path: 'dictionary',
				name: '指标字典',
				component: () => import('@/views/dictionary/index'),
				meta: { title: '指标字典'}
			},
			{
				path: 'organization',
				name: '指标组织',
				component: () => import('@/views/dictionary/test'),
				meta: { title: '指标组织'}
			}
		]
	},

	{
		path: '/words',
		component: Layout,
		redirect: '/words/modifier',
		name: '业务限定',
		meta: {
			title: '业务限定',
			icon: 'nested'
		},
		children: [
			{
				path: 'modifier',
				component: () => import('@/views/words/modifier/index'), // Parent router-view
				name: '修饰词',
				meta: { title: '修饰词' },
			},
			{
				path: 'deriver',
				component: () => import('@/views/words/deriver/index'),
				name: '衍生词',
				meta: { title: '衍生词' }
			},
			{
				path: 'time-cycle',
				component: () => import('@/views/words/time-cycle/index'),
				name: '时间周期',
				meta: { title: '时间周期' }
			}
		]
	},

	{
		path: '/mydata',
		component: Layout,
		redirect: '/mydata',
		children: [{
			path: '',
			name: '我的数据',
			component: () => import('@/views/mydata/index'),
			meta: { title: '我的数据', icon: 'dashboard' }
		}]
	},

	// 404 page must be placed at the end !!!
	{ path: '*', redirect: '/404', hidden: false }
]

const createRouter = () => new Router({
	// mode: 'history', // require service support
	scrollBehavior: () => ({ y: 0 }),
	routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
	const newRouter = createRouter()
	router.matcher = newRouter.matcher // reset router
}

export default router
