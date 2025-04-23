import { Layout, Menu, message, Popconfirm } from 'antd'
import {
  HomeOutlined,
  DiffOutlined,
  EditOutlined,
  LogoutOutlined
} from '@ant-design/icons'
import './index.scss'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearUserInfo, fetchUserInfo } from '@/store/modules/user'

const { Header, Sider } = Layout

const items = [
  {
    label: '首页',
    key: '/',
    icon: <HomeOutlined />
  },
  {
    label: '文章管理',
    key: '/article',
    icon: <DiffOutlined />
  },
  {
    label: '创建文章',
    key: '/publish',
    icon: <EditOutlined />
  }
]

const GeekLayout = () => {
  const navigate = useNavigate()
  const changeMenuPage = (route) => {
    navigate(route.key)
  }
  // 获取当前页的路径
  const location = useLocation()
  const selectedKey = location.pathname

  // 触发个人用户信息
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchUserInfo())
  }, [dispatch])

  // 从store中获取个人信息
  const userInfo = useSelector((state) => state.user.userInfo)

  // 退出登录
  const onLogOut = () => {
    // 1. 删除本地的token以及用户信息
    dispatch(clearUserInfo())
    // 2. 跳转登录页
    navigate('/login')
    // 3. 消息提示
    message.success('退出登录成功！')
  }
  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
        <div className="user-info">
          <span className="user-name">{userInfo.name}</span>
          <span className="user-logout">
            <Popconfirm
              title="是否确认退出？"
              okText="退出"
              onConfirm={onLogOut}
              cancelText="取消"
            >
              <LogoutOutlined /> 退出
            </Popconfirm>
          </span>
        </div>
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            theme="dark"
            selectedKeys={selectedKey}
            items={items}
            onClick={changeMenuPage}
            style={{ height: '100%', borderRight: 0 }}
          ></Menu>
        </Sider>
        <Layout className="layout-content" style={{ padding: 20 }}>
          <Outlet />
        </Layout>
      </Layout>
    </Layout>
  )
}
export default GeekLayout
