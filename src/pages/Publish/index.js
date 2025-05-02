import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  Input,
  Upload,
  Space,
  Select,
  message
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import './index.scss'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import { useEffect, useRef, useState } from 'react'
import { addArticleAPI, getChannelsAPI } from '@/apis/article'
// import { info } from 'sass'
const { Option } = Select

const Publish = () => {
  // 频道列表
  const [channels, setChannels] = useState([])
  // 调用接口
  useEffect(() => {
    const fetchChannels = async () => {
      const { data } = await getChannelsAPI()
      setChannels(data.channels)
    }

    fetchChannels()
  }, [])
 
  const onAddArticle = async (formValue) => {
    if (imageType !== imageList.length)
      return message.warning('图片类型和数量不一致')
    const { channel_id, content, title } = formValue
    const params = {
      channel_id,
      content,
      title,
      cover: {
        type: imageType,
        images: imageList.map((item) => item.response.data.url)
      }
    }
    const res = await addArticleAPI(params, false)
    message.success('发布文章成功')
    console.log(res)
  }

  // 实现封面图片模式切换
  const [imageType, setImageType] = useState(1)
  const onTypeChange = (e) => {
    const type = e.target.value
    setImageType(type)
    if (type === 1) {
      const imgList = cacheImageList.current[0]
        ? [cacheImageList.current[0]]
        : []
      setImageList(imgList)
    } else if (type === 3) {
      setImageList(cacheImageList.current)
    }
  }
  // 上传图片
  const cacheImageList = useRef([])
  const [imageList, setImageList] = useState([])

  const onUploadChange = (value) => {
    const { file, fileList } = value
    console.log(value)
    if (file.status === 'done') {
      setImageList(fileList)
      cacheImageList.current = fileList
      message.success('上传成功')
    } else if (file.status === 'error') {
      message.error('上传失败，请重试')
    }
  }

  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb
            items={[
              { title: <Link to={'/'}>首页</Link> },
              { title: '发布文章' }
            ]}
          />
        }
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ type: 1 }}
          onFinish={onAddArticle}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入文章标题' }]}
          >
            <Input placeholder="请输入文章标题" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item
            label="频道"
            name="channel_id"
            rules={[{ required: true, message: '请选择文章频道' }]}
          >
            <Select placeholder="请选择文章频道" style={{ width: 400 }}>
              {channels.map((item) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="封面">
            <Form.Item name="type">
              <Radio.Group onChange={onTypeChange}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>
            {imageType > 0 && (
              <Upload
                listType="picture-card"
                showUpLoadList
                name="image"
                action={'http://geek.itheima.net/v1_0/upload'}
                onChange={onUploadChange}
                maxCount={imageType}
                multiple={imageType > 1}
              >
                <div style={{ marginTop: 8 }}>
                  <PlusOutlined />
                </div>
              </Upload>
            )}
          </Form.Item>
          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: '请输入文章内容' }]}
          >
            <ReactQuill
              theme="snow"
              className="publish-quill"
              placeholder="请输入文章内容"
            ></ReactQuill>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                发布文章
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Publish
