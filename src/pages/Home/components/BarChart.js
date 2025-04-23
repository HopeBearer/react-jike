// 封装柱状图组件
import * as echarts from 'echarts'
import { useEffect, useRef } from 'react'
// 1. 把功能代码都放到这个组件中

// 2. 把可变的部分抽象成 props 参数

const BarChart = ({ title }) => {
  const chartRef = useRef()
  useEffect(() => {
    // 保证DOM可用，才进行图标的渲染
    const myChart = echarts.init(chartRef.current)
    const option = {
      title: {
        text: title
      },
      xAxis: {
        type: 'category',
        data: ['Vue', 'React', 'Angular']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [10, 40, 70],
          type: 'bar'
        }
      ]
    }

    option && myChart.setOption(option)
  }, [])
  return (
    <div
      id="main"
      ref={chartRef}
      style={{ width: '500px', height: '400px' }}
    ></div>
  )
}

export default BarChart
