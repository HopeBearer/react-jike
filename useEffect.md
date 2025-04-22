@[toc]

# React 的 useEffect

`useEffect` 是 React Hooks 中最重要的 API 之一，用于处理组件中的副作用（Side Effects），例如数据请求、DOM 操作、订阅事件等。本文将从基础用法、核心原理、常见问题到最佳实践，全面解析 `useEffect` 的使用技巧。

## 一、什么是副作用（Side Effects）？

在 React 中，副作用是指那些与组件渲染结果无直接关系，但可能影响其他组件或外部系统的操作。例如：

- 数据请求（API 调用）
- 手动修改 DOM
- 订阅事件（如 WebSocket、键盘事件）
- 设置定时器

类组件中，副作用通常写在生命周期方法（如 componentDidMount、componentDidUpdate）中。而函数组件通过 useEffect 统一管理副作用。

## 二、useEffect 的基本用法

```js
useEffect(() => {
  // 副作用逻辑

  return () => {
    /* 清理函数（可选） */
  }
}, [dependencies])
```

- **第一个参数**：一个包含副作用逻辑的函数（必填）
- **第二个参数**：依赖数组（可选），用于控制副作用的执行时机。
- **返回值**：清理函数（可选），用于在组件卸载或下次副作用执行前释放资源。

## 三、依赖数组的三种情况

### 1. 无依赖数组（每次渲染后都执行, 不推荐）

```js
useEffect(() => {
  console.log('每次组件更新后执行')
})
```

​- ​ 行为 ​​：组件每次渲染（包括首次渲染和更新）后都会执行。
​- ​ 风险 ​​：可能导致性能问题或无限循环（如在副作用中修改状态）。

### 2. 空依赖数组（仅在挂载时执行一次）

```js
useEffect(() => {
  console.log('仅在挂载时执行一次')
})
```

- 行为 ​​：仅在组件首次渲染后执行一次，类似类组件的 componentDidMount。
  ​- ​ 用途 ​​：初始化操作（如请求初始数据、订阅事件）。

### 3. 有依赖项（依赖变化时执行）

```js
useEffect(() => {
  console.log('当 count 变化时执行')
}, [count])
```

​​ - 行为 ​​：首次渲染后执行，后续仅在依赖项 count 变化时执行。
​​ - 关键点 ​​：依赖项必须是基本类型（如数字、字符串）或稳定引用（通过 useMemo/useCallback 包裹的复杂类型）。

## 四、常见应用场景

### 1. 数据请求：根据参数动态加载数据 ​

```js
import { useState, useEffect } from 'react'
import axios from 'axios'

function UserProfile({ userId }) {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // 定义取消请求的标记
    let isCancelled = false

    const fetchUserData = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`/api/users/${userId}`)
        // 仅在组件未卸载时更新状态
        if (!isCancelled) {
          setUserData(response.data)
          setLoading(false)
        }
      } catch (error) {
        if (!isCancelled) {
          setLoading(false)
          console.error('Fetch error:', error)
        }
      }
    }

    fetchUserData()

    // 清理函数：取消未完成的请求
    return () => {
      isCancelled = true
    }
  }, [userId]) // 当 userId 变化时重新加载数据

  return (
    <div>{loading ? 'Loading...' : userData && <div>{userData.name}</div>}</div>
  )
}
```

### 2. 事件监听：窗口大小变化时更新状态 ​

```js
import { useState, useEffect } from 'react'

function WindowSizeTracker() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  useEffect(() => {
    // 定义事件处理函数
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    // 添加监听
    window.addEventListener('resize', handleResize)

    // 清理函数：移除监听
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, []) // 空依赖数组：仅挂载时添加一次监听

  return (
    <div>
      Window Size: {windowSize.width}px x {windowSize.height}px
    </div>
  )
}
```

### 3. 定时器：倒计时功能 ​

```js
import { useState, useEffect } from 'react'

function CountdownTimer({ initialSeconds }) {
  const [seconds, setSeconds] = useState(initialSeconds)

  useEffect(() => {
    // 定义定时器
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer) // 倒计时结束清除定时器
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // 清理函数：组件卸载时清除定时器
    return () => clearInterval(timer)
  }, []) // 空依赖数组：只在挂载时启动定时器

  return <div>Time Left: {seconds} seconds</div>
}
```

### 4. 动画帧（requestAnimationFrame）

```js
import { useState, useEffect, useRef } from 'react'

function AnimationBox() {
  const [position, setPosition] = useState(0)
  const requestRef = useRef() // 保存动画帧 ID

  const animate = () => {
    setPosition((prev) => (prev >= 100 ? 0 : prev + 1))
    requestRef.current = requestAnimationFrame(animate) // 递归调用
  }

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)
    // 清理函数：取消动画帧
    return () => cancelAnimationFrame(requestRef.current)
  }, []) // 空依赖数组：只在挂载时启动动画

  return (
    <div style={{ transform: `translateX(${position}px)` }}>Moving Box</div>
  )
}
```

### 5. 本地存储同步

```js
import { useState, useEffect } from 'react'

function ThemeSwitcher() {
  const [theme, setTheme] = useState(() => {
    // 从 localStorage 读取初始值
    const savedTheme = localStorage.getItem('theme')
    return savedTheme || 'light'
  })

  useEffect(() => {
    // 当 theme 变化时，同步到 localStorage
    localStorage.setItem('theme', theme)
  }, [theme]) // 依赖 theme，变化时触发

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
    </button>
  )
}
```

## 五、清理函数（Cleanup Function）

清理函数在以下时机执行：

- 组件卸载时（类似 componentWillUnmount）。
- 下次副作用执行前（依赖项变化时）。

**示例**：取消订阅

```js
useEffect(() => {
  const subscription = eventEmitter.subscribe(() => {
    /* ... */
  })
  return () => subscription.unsubscribe()
}, [])
```

## 六、性能优化与注意事项

### 1. 避免无限循环

在副作用中直接修改依赖项会导致无限循环：

```js
// ❌ 错误：每次更新后修改 count，触发重新渲染
useEffect(() => {
  setCount(count + 1)
}, [count])
```

### 2. 依赖项是对象或数组时

如果依赖项是对象或数组，即使内容相同，引用变化也会触发副作用：

```js
// ❌ 可能意外触发
const config = { enabled: true };
useEffect(() => { ... }, [config]);

// ✅ 用 useMemo 稳定引用
const config = useMemo(() => ({ enabled: true }), []);
```

### 3. 按职责拆分副作用

```js
// 拆分数据请求和事件监听
useEffect(() => {
  /* 请求数据 */
}, [])
useEffect(() => {
  /* 监听事件 */
}, [])
```

## 七、常见问题与解决方案

### 1. 如何在 useEffect 中使用异步函数？

不能直接将 useEffect 的回调设为 async，但可以在内部定义异步函数：

```js
useEffect(() => {
  const fetchData = async () => {
    const result = await axios.get(url)
    setData(result)
  }
  fetchData()
}, [url])
```

### 2. 依赖项缺失导致逻辑错误

启用 eslint-plugin-react-hooks 规则，确保依赖项完整。

## 八、总结与最佳实践

1. 明确依赖项 ​​：始终填写依赖数组，避免遗漏。
2. 拆分副作用 ​​：不同逻辑使用多个 useEffect。
3. 及时清理资源 ​​：防止内存泄漏。
4. 稳定引用 ​​：使用 useCallback 和 useMemo 处理复杂依赖。

通过合理使用 useEffect，可以写出更清晰、健壮的 React 组件。
