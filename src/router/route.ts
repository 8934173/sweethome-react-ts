import React, {FunctionComponent, lazy} from "react";
const Home: React.LazyExoticComponent<React.ComponentType<any>> = lazy(() => import('src/component/layout/layout'))
const Login: React.LazyExoticComponent<React.ComponentType<any>> = lazy(() => import('src/component/login/login'))
const ChinaMap: React.LazyExoticComponent<React.ComponentType<any>> = lazy(() => import('src/component/echarts/chinaMap'))
const CenterC: React.LazyExoticComponent<React.ComponentType<any>> = lazy(() => import('src/component/center/centerContent'))
const Countries: React.LazyExoticComponent<React.ComponentType<any>> = lazy(() => import('src/component/echarts/countriesMap'))
const Vaccines: React.LazyExoticComponent<React.ComponentType<any>> = lazy(() => import('src/component/vaccines/vaccines'))
const ClockIn: FunctionComponent = lazy(() => import('src/component/clockin/ClockIn'))
const Account: FunctionComponent = lazy(() => import('src/component/sys/admins/Account'))
const College: FunctionComponent = lazy(() => import('src/component/sys/college/college'))
const TeacherClockIn: FunctionComponent = lazy(() => import('src/component/teacherClockIn/TeacherClockIn'))
const StudentInout: FunctionComponent = lazy(() => import('src/component/inout/student/inout'))
const TeacherInout: FunctionComponent = lazy(() => import('src/component/inout/teacher/Inout'))
const NoAccess: FunctionComponent = lazy(() => import('src/component/error/403'))



/**
 * 参数
 * @param path 路径
 * @param component 组件
 * @param exact 是否精准匹配
 */
interface RouteA {
    path: string,
    component: React.ComponentType<any>,
    title: string,
    exact?: boolean,
    children?: RouteA[],
    indexRoute?: number,
    show?: boolean,
    role?: string
}

const MyRoute: RouteA[] = [
    {
        path: '/',
        title: '甜蜜家园',
        component: Home,
        exact: true
    },
    {
        path: '/home/',
        title: '甜蜜家园',
        component: Home,
        exact: false,
        children: [
            {
                path: '/home/sweet',
                title: 'hello',
                component: CenterC,
                exact: true,
                show: false
            },
            {
                path: '/home/epidemic',
                title: '国内疫情',
                component: ChinaMap,
                exact: true,
                show: true
            },
            {
                path: '/home/countries',
                title: '国外疫情',
                component: Countries,
                exact: true,
                show: true
            },
            {
                path: '/home/vaccines',
                title: '全球疫苗',
                component: Vaccines,
                exact: true,
                show: true
            },
            {
                path: '/home/clockin',
                title: '个人打卡',
                component: ClockIn,
                exact: true,
                show: true,
                role: 'ROLE_student'
            },
            {
                path: '/home/account',
                title: '用户管理',
                component: Account,
                exact: true,
                show: true,
                role: 'ROLE_ADMIN_USER'
            },
            {
                path: '/home/college',
                title: '学院管理',
                component: College,
                exact: true,
                show: true,
                role: 'ROLE_ADMIN_USER'
            },
            {
                path: '/home/teacherClockIn',
                title: '打卡管理',
                component: TeacherClockIn,
                exact: true,
                show: true,
                role: 'ROLE_teacher'
            },
            {
                path: '/home/studentInout',
                title: '出入申请',
                component: StudentInout,
                exact: true,
                show: true,
                role: 'ROLE_student'
            },
            {
                path: '/home/teacherInout',
                title: '出入管理',
                component: TeacherInout,
                exact: true,
                show: true,
                role: 'ROLE_teacher'
            },
            {
                path: '/home/noAccess',
                title: '您无权访问',
                component: NoAccess,
                exact: true,
                show: false
            }
        ]
    },
    {
        path: '/login',
        title: '登录',
        component: Login,
        exact: true
    },
]
export default MyRoute
