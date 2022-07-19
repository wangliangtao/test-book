import { uploadUrl } from '@/api/file'
import { getToken } from '@/utils/auth'
import { isPic } from '@/utils/validate'
export default {
  props: {},
  data () {
    return {
      uploadUrl,
      headers: {
        authorization: 'Bearer ' + (this.$store.getters.token || getToken())
      },
      options: {},
      defaultOptions: {
        maxSize: 1024 * 1024 * 10,
        maxSizeTitle: '上传图片大小不能超过 10MB'
      }
    }
  },
  created () {
    this.initUploadOptions()
  },
  methods: {
    initUploadOptions (options = {}) {
      this.options = { ...this.defaultOptions, ...options }
    },
    beforeUpload (file) {
      const { maxSize, maxSizeTitle } = this.options
      const isImage = isPic(file.type)
      const isLimit = file.size < maxSize
      !isImage && this.$message.error('图片格式不正确')
      !isLimit && this.$message.error(`${maxSizeTitle}!`)
      return isImage && isLimit
    }
  }
}
