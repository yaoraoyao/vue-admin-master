import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Table from './views/nav1/Table.vue'
import echarts from './views/charts/echarts.vue'
import Employee from './views/group/Employee.vue'
import Department from './views/group/Department.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-bar-chart',
        leaf: true,//只有一个节点
        children: [
            { path: '/main', component: echarts, name: '首页' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '组织机构',
        iconCls: 'fa fa-user-o',//图标样式class
        children: [
            { path: '/employee', component: Employee, name: '员工管理'},
            { path: '/department', component: Department, name: '部门管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '系统管理',
        iconCls: 'fa fa-cog',//图标样式class
        children: [
            { path: '/role', component: Main, name: '角色管理'},
            { path: '/permission', component: Table, name: '权限管理' },
            { path: '/menu', component: Table, name: '菜单管理' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;