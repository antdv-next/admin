import { MENU_TYPE } from '@/constants/menu'
import { defineMock, response } from '../index'

export default defineMock({
  GET() {
    return response({
      code: 200,
      msg: 'success',
      data: [
        {
          id: '1',
          path: '/admin/workspace',
          menuStatus: 0,
          title: '工作台',
          icon: 'DashboardOutlined',
          menuType: MENU_TYPE.DIR,
        },
        {
          id: '2',
          parentId: '1',
          path: '/admin/workspace/overview',
          menuStatus: 0,
          title: '概览',
        },
        {
          id: '3',
          parentId: '1',
          path: '/admin/workspace/dashboard',
          menuStatus: 0,
          title: '控制台',
        },
        {
          id: '4',
          path: null,
          menuType: MENU_TYPE.DIR,
          menuStatus: 0,
          title: '系统管理',
          icon: 'SettingOutlined',
        },
        {
          id: '5',
          parentId: '4',
          path: '/admin/system/config',
          menuStatus: 0,
          title: '配置管理',
        },
        {
          id: '6',
          parentId: '4',
          path: '/admin/system/dict',
          menuStatus: 0,
          title: '字典管理',
        },
        {
          id: '7',
          parentId: '4',
          path: '/admin/system/user',
          menuStatus: 0,
          title: '用户管理',
        },
        {
          id: '8',
          parentId: '4',
          path: '/admin/system/role',
          menuStatus: 0,
          title: '权限管理',
        },
      ],
    })
  },
})
