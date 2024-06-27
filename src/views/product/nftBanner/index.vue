<template>
  <div>
    <div class="clearfix" style="margin-top: 20px; margin-left: 20px">
      <div class="addbtn" @click="clickAdd">添加</div>
    </div>

    <el-form
      :model="pageQuery"
      inline
      style="margin-top: 35px; margin-left: 20px"
    >
      <el-form-item>
        <el-date-picker
          v-model="pageQuery.bannerDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="选择日期"
        />
      </el-form-item>

      <el-form-item style="margin-left: 15px; width: 150px">
        <el-select v-model="pageQuery.state" placeholder="是否通过">
          <el-option label="全部" value="0"></el-option>
          <el-option label="生效中" value="1"></el-option>
          <el-option label="已撤销" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-button
        type="primary"
        :icon="Search"
        @click="getBannerList"
        round
        style="margin-left: 40px; margin-bottom: 15px"
      />
    </el-form>

    <div class="content-container">
      <el-carousel
        :interval="2500"
        type="card"
        height="893px"
        style="margin-left: 20px; width: 50%; flex: 1"
        :autoplay="!bannerForm.id"
      >
        <el-carousel-item v-for="item in bannerList" :key="item.id">
          <h2 class="medium" style="text-align: center; font-weight: bold">
            {{ item.title }}
          </h2>
          <img
            :src="item.image"
            alt="Banner Image"
            style="width: 100%; height: 100%; margin-top: 20px"
            @click="clickCarouselItem(item)"
          />
        </el-carousel-item>
      </el-carousel>

      <div style="width: 50%; margin-left: 10%">
        <div v-show="dialogFormVisible">
          <el-form
            :model="bannerForm"
            ref="bannerFormRef"
            :rules="rules"
            label-width="150px"
            :inline="false"
          >
            <el-form-item label="Title：" prop="title">
              <el-input
                v-model="bannerForm.title"
                style="width: 170px"
              ></el-input>
            </el-form-item>
            <el-form-item label="有效时间" prop="effectiveTime">
              <el-date-picker
                v-model="bannerForm.effectiveTime"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
                @blur="handleDateChange"
                :picker-options="pickerOptions"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="客户端：" prop="client">
              <el-select v-model="bannerForm.client" placeholder="客户端">
                <el-option
                  v-for="item in clientEnum"
                  :key="item.code"
                  :label="item.desc"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="banner图片：" prop="image">
              <div class="img_con" v-for="(i, index) in imgList" :key="index">
                <el-image
                  class="deduct_img"
                  :src="i"
                  :preview-src-list="[i]"
                  style="width: 500px; height: 893px"
                ></el-image>
                <div class="overlay">
                  <i class="remove_img" @click="handleRemove(index)">
                    <el-icon><Delete /></el-icon>
                  </i>
                </div>
              </div>
              <UploadImg v-show="imgList.length < 1" @get-url="getUrl" />
              <el-dialog v-model="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="" />
              </el-dialog>
            </el-form-item>
          </el-form>
          <div slot="footer" style="display: flex; margin-left: 15%">
            <el-button class="subBtn" @click="submitForm">提 交</el-button>
            <el-button
              class="cancelBtn"
              v-if="bannerForm.id && bannerForm.state === 2"
              @click="bannerShelf"
            >
              发 布
            </el-button>
            <el-button
              class="cancelBtn"
              v-if="bannerForm.id && bannerForm.state === 1"
              @click="bannerDelete"
            >
              删 除
            </el-button>
            <el-button class="cancelBtn" @click="cancel">取 消</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineComponent } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import {
  Check,
  Message,
  Star,
  Delete,
  Edit,
  Plus,
  RefreshLeft,
  UserFilled,
  Search,
  Share,
  Upload,
  Promotion,
  FolderAdd,
} from '@element-plus/icons-vue'
import {
  reqAddBanner,
  reqBannerShelf,
  reqDeleteBanner,
  reqGetBannerList,
  reqGetWorldBannerList,
  reqUpdateBanner,
} from '@/api/banner'
import { reqDeleteAd } from '@/api/worldAd'

import { ref, reactive, onMounted } from 'vue'

let dialogFormVisible = ref(false)
let dialogVisible = ref(false)
let dialogImageUrl = ref(false)
let pageQuery = ref({
  pageIndex: 1,
  pageSize: 10,
  position: 3,
  state: '0',
  bannerDate: null,
})
let bannerList = ref(null)
let imgList = ref([])
let bannerFormRef = ref(null)
let bannerForm = ref({
  id: null,
  title: null,
  image: null,
  client: -1,
  position: 3,
  linkUrl: null,
  state: 1,
  startTime: null,
  endTime: null,
  effectiveTime: [],
  useLink: false,
  inStation: true,
  inStationCode: null,
  version: null,
})
let inStationEnum = ref([
  { code: 'home-tab', desc: '探索' },
  { code: 'message-tab', desc: 'K盟' },
  { code: 'world-tab', desc: 'K界' },
  { code: 'market-tab', desc: 'K集' },
  { code: 'market-tab?index=1', desc: 'K集-数字藏品' },
  { code: 'mine-tab', desc: '我的' },
  { code: 'rank-daily', desc: '当日排行榜' },
  { code: 'invite', desc: '邀请码' },
  { code: 'web-page', desc: '网页' },
])
let clientEnum = ref([
  { code: -1, desc: '所有' },
  { code: 0, desc: 'iOS' },
  { code: 1, desc: 'Android' },
  { code: 2, desc: '小程序' },
])
const validateEffectiveTime = (rule, value, callback) => {
  // 自定义验证函数，检查 effectiveTime 的长度
  if (value && value.length >= 2) {
    callback() // 长度符合要求，验证通过
  } else {
    callback(new Error('请选择时间范围')) // 长度不符合要求，验证失败
  }
}
let rules = ref({
  title: [{ required: true, message: '请输入Banner Title', trigger: 'change' }],
  effectiveTime: [{ validator: validateEffectiveTime, trigger: 'change' }],
  image: [{ required: true, message: '请上传Banner 图片', trigger: 'change' }],
})
let pickerOptions = ref({
  disabledDate(time) {
    // 禁止选择当前时间之前的时间，但允许选择当天及之后的时间
    return time.getTime() < Date.now() - 1000 * 60 * 60 * 24
  },
})

onMounted(() => {
  getBannerList()
})

const getBannerList = async () => {
  let param = `pageIndex=${pageQuery.value.pageIndex}&pageSize=${pageQuery.value.pageSize}&position=${pageQuery.value.position}`
  if (pageQuery.value.bannerDate) {
    param = param + `&bannerDate=${pageQuery.value.bannerDate}`
  }
  if (pageQuery.value.state >= 1) {
    param = param + `&state=${pageQuery.value.state}`
  }
  const result = await reqGetBannerList(param)
  bannerList.value = result.data.records
}

const clickAdd = () => {
  cancel()
  dialogFormVisible.value = true
}

const handleRemove = (index) => {
  imgList.value.splice(index, 1)
  bannerForm.value.image = null
}

const getUrl = (e) => {
  imgList.value.push(e)
  bannerForm.value.image = e
  ElMessage({
    type: 'success',
    message: '上传成功!',
  })
}

const handleDateChange = () => {
  // 在选择时间范围时触发的 change 事件
  bannerForm.value.startTime = bannerForm.value.effectiveTime[0]
  bannerForm.value.endTime = bannerForm.value.effectiveTime[1]
}

const clickCarouselItem = (row) => {
  Object.assign(bannerForm.value, {
    id: row.id,
    title: row.title,
    image: row.image,
    client: row.client,
    position: 3,
    linkUrl: row.linkUrl,
    state: row.state,
    startTime: row.startTime,
    endTime: row.endTime,
    effectiveTime: [row.startTime, row.endTime],
    useLink: false,
    inStation: true,
    inStationCode: null,
    version: row.version,
  })

  if (row.linkUrl) {
    bannerForm.value.useLink = true
    if (row.linkUrl.startsWith('out')) {
      bannerForm.value.inStation = false
      bannerForm.value.linkUrl = row.linkUrl.replace('out', '')
    } else {
      let link = row.linkUrl.replace('kmeta://', '')
      if (!link.startsWith('http')) {
        bannerForm.value.inStationCode = link
      } else {
        bannerForm.value.inStationCode = 'web-page'
      }
    }
  }
  imgList.value[0] = row.image
  dialogFormVisible.value = true
}

const submitForm = () => {
  bannerFormRef.value.validate((valid) => {
    if (valid) {
      let linkUrl = ''
      if (bannerForm.value.useLink) {
        if (bannerForm.value.inStation) {
          linkUrl = 'kmeta://'
          if (bannerForm.value.inStationCode === 'web-page') {
            linkUrl = linkUrl + bannerForm.value.linkUrl
          } else {
            linkUrl = linkUrl + bannerForm.value.inStationCode
          }
        } else {
          linkUrl = 'out' + bannerForm.value.linkUrl
        }
      }
      bannerForm.value.linkUrl = linkUrl
      if (bannerForm.value.id) {
        reqUpdateBanner(bannerForm.value).then(() => {
          ElMessage({
            type: 'success',
            message: '保存成功!',
          })
        })
      } else {
        reqAddBanner(bannerForm.value).then(() => {
          ElMessage({
            type: 'success',
            message: '保存成功!',
          })
        })
      }
      dialogFormVisible.value = false
      getBannerList()
    }
  })
}

const bannerShelf = () => {
  reqBannerShelf({ id: bannerForm.value.id }).then(() => {
    ElMessage({
      type: 'success',
      message: '发布成功!',
    })
    dialogFormVisible.value = false
    getBannerList()
  })
}

const bannerDelete = () => {
  ElMessageBox.confirm('是否确定删除？', '提示', {
    type: 'warning',
  })
    .then(() => {
      reqDeleteBanner({ id: bannerForm.value.id }).then(() => {
        ElMessage({
          type: 'success',
          message: '删除成功!',
        })
        dialogFormVisible.value = false
        getBannerList()
      })
    })
    .catch(() => {})
}

const cancel = () => {
  dialogFormVisible.value = false
  if (bannerForm.value.id) return
  bannerFormRef.value.resetFields()
  imgList.value = []
  Object.assign(bannerForm.value, {
    id: null,
    title: null,
    image: null,
    client: -1,
    position: 3,
    linkUrl: null,
    state: 1,
    startTime: null,
    endTime: null,
    effectiveTime: [],
    useLink: false,
    inStation: true,
    inStationCode: null,
    version: null,
  })
}
</script>

<style scoped>
.content-container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  /* background-color: #20dfff; */
}

.addbtn {
  background: linear-gradient(to right, #5924ff, #20dfff);
  height: 38px;
  width: 93px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  font-size: 18px;
  color: #ffffff;
  font-weight: bold;
}

/* btn */
.subBtn {
  border: none;
  background: linear-gradient(to right, #5924ff, #20dfff);
  height: 40px;
  width: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  font-size: 16px;
  color: #ffffff;
  font-weight: bold;
}

.cancelBtn {
  height: 40px;
  width: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999;
  font-weight: bold;
  margin-left: 20px;
  border: none;
  background-image: url('../../../assets/btn/btn.png');
  background-size: cover;
  background-position: center;
  position: relative;
}

.cancelBtn:hover {
  background-color: transparent;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s;
  display: none;
}

.img_con:hover .overlay {
  display: block;
}
.img_con {
  width: 500px;
  height: 893px;
  position: relative;
  display: flex;
  /* background-color: #b9d547; */
}
.deduct_img {
  width: 120px;
  height: 120px;
  /* margin-right: 10px; */
  /* margin-bottom: 10px; */
}

.remove_img {
  position: absolute;
  right: 48%;
  top: 48%;
  display: none;
  color: #fff;
  cursor: pointer;
}
.img_con:hover .remove_img {
  display: block;
}
</style>
