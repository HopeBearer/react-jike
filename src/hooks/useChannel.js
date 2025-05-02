// 封装获取频道列表的逻辑
import { useEffect, useState } from 'react'
import { getChannelsAPI } from '@/apis/article'
function useChannel() {
  // 频道列表
  const [channelList, setChannels] = useState([])
  // 调用接口
  useEffect(() => {
    const fetchChannels = async () => {
      const { data } = await getChannelsAPI()
      setChannels(data.channels)
    }

    fetchChannels()
  }, [])

  return {
    channelList
  }
}

export { useChannel }
