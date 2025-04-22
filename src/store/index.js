// 组合redux子模块 + 导出 store 实例
import { configureStore } from '@reduxjs/toolkit'
import userReducer from './modules/user'

export default configureStore({
  reducer: {
    user: userReducer
  }
})
