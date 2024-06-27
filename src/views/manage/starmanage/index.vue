<template>
  <div>
    <div class="clearfix" style="margin-top: 20px; margin-left: 20px">
      <div class="addbtn" @click="dialogVisible1 = true">创建星球</div>
    </div>

    <el-form
      :model="pageQuery"
      :inline="true"
      style="margin-top: 35px; margin-left: 20px; display: flex"
    >
      <el-form-item label="星球名：">
        <el-input v-model="pageQuery.nickname" style="width: 200px" />
      </el-form-item>
      <el-form-item label="状态：" style="margin-left: 30px">
        <el-select
          style="width: 155px"
          v-model="pageQuery.state"
          clearable
          placeholder="请选择"
        >
          <el-option label="审核中" value="1"></el-option>
          <el-option label="审核被拒" value="2"></el-option>
          <el-option label="在线" value="3"></el-option>
          <el-option label="过期失效" value="4"></el-option>
          <el-option label="已下架" value="5"></el-option>
          <el-option label="下架整改" value="6"></el-option>
        </el-select>
      </el-form-item>
      <el-button
        type="primary"
        :icon="Search"
        @click="getStarList"
        round
        style="margin-left: 40px"
      >
        搜索
      </el-button>
    </el-form>

    <el-button
      v-if="multipleSelection && multipleSelection.length >= 1"
      @click="clickBatchSetOre"
      type="danger"
      round
      style="margin-left: 20px"
    >
      矿石批量配置
    </el-button>

    <div class="app-container" style="margin-right: 30px">
      <el-table
        :data="starList"
        border
        style="width: 100%"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="60" align="center" />
        <el-table-column
          prop="nickname"
          label="星球名"
          width="200"
          align="center"
        />
        <el-table-column label="星球头像" width="180" align="center">
          <template #default="{ row }">
            <img
              v-if="row.state === 0 || row.state === 1"
              src="./in_review.png"
              style="width: 70px; height: 70px"
            />
            <img
              v-else-if="row.state === 3"
              src="./refuse.png"
              style="width: 70px; height: 70px"
            />
            <img
              v-else-if="row.state === 2 && row.useState === 1"
              :src="row.avatar"
              style="width: 70px; height: 70px"
            />
            <img
              v-else-if="row.state === 2 && row.useState === 2"
              src="./off_shelf.png"
              style="width: 70px; height: 70px"
            />
            <img
              v-else-if="row.state === 2 && row.useState === 3"
              src="./under_rectification.png"
              style="width: 70px; height: 70px"
            />
          </template>
        </el-table-column>
        <el-table-column label="星球矿石" width="180" align="center">
          <template #default="{ row }">
            <img
              v-if="row.state === 0 || row.state === 1"
              src="./in_review.png"
              style="width: 50px; height: 50px"
            />
            <img
              v-else-if="row.state === 3"
              src="./refuse.png"
              style="width: 50px; height: 50px"
            />
            <img
              v-else-if="row.state === 2 && row.useState === 1"
              :src="row.orePic"
              style="width: 50px; height: 50px"
            />
            <img
              v-else-if="row.state === 2 && row.useState === 2"
              src="./off_shelf.png"
              style="width: 50px; height: 50px"
            />
            <img
              v-else-if="row.state === 2 && row.useState === 3"
              src="./under_rectification.png"
              style="width: 50px; height: 50px"
            />
          </template>
        </el-table-column>
        <el-table-column label="上线周期" width="350" align="center">
          <template #default="{ row }">
            {{ row.startTime }} -- {{ row.endTime }}
          </template>
        </el-table-column>
        <el-table-column
          prop="oreQuantity"
          label="矿石个数"
          width="120"
          align="center"
        />
        <el-table-column label="中矿概率" width="120" align="center">
          <template #default="{ row }">{{ row.probability }}%</template>
        </el-table-column>
        <el-table-column
          prop="score"
          label="可用K分"
          width="150"
          align="center"
        />
        <el-table-column label="显示头像" width="200" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.showStarAvatar"
              @change="changeShowStarAvatar(row.id)"
              active-text="星球"
              inactive-text="所有者"
            />
          </template>
        </el-table-column>
        <el-table-column label="状态" width="180" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.state === 0 || row.state === 1">审核中</el-tag>
            <el-tag v-else-if="row.state === 3" type="warning">
              审核未通过
            </el-tag>
            <el-tag
              v-else-if="
                row.state === 2 &&
                row.useState === 1 &&
                Date.parse(row.endTime) > Date.now()
              "
              type="success"
            >
              已上线
            </el-tag>
            <el-tag
              v-else-if="
                row.state === 2 &&
                row.useState === 1 &&
                Date.parse(row.endTime) < Date.now()
              "
              type="info"
            >
              过期失效
            </el-tag>
            <el-tag
              v-else-if="row.state === 2 && row.useState === 2"
              type="info"
            >
              已下架
            </el-tag>
            <el-tag
              v-else-if="row.state === 2 && row.useState === 3"
              type="danger"
            >
              下架整改中
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="250"
          align="center"
        />
        <el-table-column fixed="right" width="250" label="操作" align="center">
          <template #default="{ row }">
            <el-button
              @click="toStarManage(row)"
              :icon="Edit"
              type="primary"
              size="small"
            >
              编辑
            </el-button>
            <el-button
              v-if="row.state === 2 && row.useState === 1"
              @click="clickOffShelf(row)"
              
              :icon="RefreshLeft"
              type="danger"
              size="small"
            >
              下架
            </el-button>
            <el-button
              v-if="
                row.state === 2 && (row.useState === 2 || row.useState === 3)
              "
              @click="clickPublish(row)"
              :icon="Promotion"
              type="primary"
              size="small"
            >
              发布
            </el-button>
            <el-button
              @click="clickAllocation(row)"
              :icon="Star"
              type="success"
              size="small"
            >
              充K分
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          layout="total, prev, pager, next, sizes"
          @current-change="handleChangeStarPage"
          @size-change="handleChangeStarPageSize"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageQuery.pageSize"
          :total="total"
          style="margin-top: 30px"
        />
      </div>
    </div>

    <!-- 修改星球信息（管理星球） -->
    <el-dialog
      title="星球管理"
      v-model="isStarShow"
      top="2vh"
      width="80%"
      :close-on-click-modal="false"
    >
      <el-tabs v-model="activeName" type="card">
        <!-- 星球管理 -->
        <el-tab-pane label="星球管理" name="first">
          <el-form
            :model="starUpdateForm"
            ref="starUpdateFormRef"
            :rules="rules"
            label-width="130px"
            :inline="false"
            size="default"
          >
            <el-form-item label="星球昵称：" prop="nickname">
              <el-input
                style="width: 200px"
                v-model="starUpdateForm.nickname"
              ></el-input>
            </el-form-item>

            <el-form-item label="上线周期" prop="effectiveTime">
              <el-date-picker
                v-model="starUpdateForm.effectiveTime"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
                @blur="handleDateChange"
                :picker-options="pickerOptions"
              ></el-date-picker>
            </el-form-item>

            <el-form-item label="星球故事：" prop="story">
              <el-input
                type="textarea"
                v-model="starUpdateForm.story"
                rows="5"
                style="width: 500px"
              ></el-input>
            </el-form-item>

            <el-form-item label="星球描述：" prop="describe">
              <el-input
                type="textarea"
                rows="5"
                style="width: 500px"
                v-model="starUpdateForm.describe"
              ></el-input>
            </el-form-item>
            <el-row :gutter="20">
              <el-col>
                <el-form-item label=" 星球头像：" class="center">
                  <img
                    v-if="starUpdateForm.avatar"
                    :src="starUpdateForm.avatar"
                    class="avatar"
                  />
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label=" 矿石图片：" class="center">
                  <img
                    v-if="starUpdateForm.orePic"
                    :src="starUpdateForm.orePic"
                    class="avatar"
                  />
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label=" 星球背景：" class="center">
                  <img
                    v-if="starUpdateForm.background"
                    :src="starUpdateForm.background"
                    style="width: 60%"
                    @click="dialogVisible = true"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item>
              <div style="display: flex">
                <el-button
                  class="subBtn"
                  @click="handleSubmit('starUpdateForm')"
                >
                  提交修改
                </el-button>
                <el-button class="cancelBtn" @click="jumpToManage">
                  取消
                </el-button>
              </div>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <!-- 矿石管理 -->
        <el-tab-pane label="矿石管理" name="second">
          <el-form class="stone">
            <el-form-item>可用K分：{{ starOreForm.score }}</el-form-item>

            <el-form-item prop="probability">
              挖中概率：
              <el-input-number
                v-model="starOreForm.probability"
                size="small"
                :step="1"
                :min="1"
                :max="100"
                style="width: 90px"
                step-strictly
                controls-position="right"
              />
              %
            </el-form-item>

            <el-form-item prop="oreQuantity">
              矿石个数：
              <el-input-number
                v-model="starOreForm.oreQuantity"
                size="small"
                :step="1"
                :min="15"
                :max="20"
                style="width: 90px"
                step-strictly
                controls-position="right"
              />
              颗
            </el-form-item>

            <el-form-item>
              矿石：
              <el-button
                @click="addOre"
                type="success"
                :icon="Plus"
                size="small"
                circle
              />
            </el-form-item>

            <el-form-item v-for="(ore, index) in starOreForm.ores" :key="index">
              价值：
              <el-input-number
                v-model="ore.minScore"
                :min="1"
                :max="ore.maxScore"
                step-strictly
                size="small"
                controls-position="right"
                style="width: 95px"
              />
              <span style="margin: 0 10px">-</span>
              <el-input-number
                v-model="ore.maxScore"
                :min="ore.minScore"
                step-strictly
                size="small"
                controls-position="right"
                style="width: 95px"
              />
              K分，
              <span style="margin: 0 10px">权重：</span>
              <el-input-number
                v-model="ore.weight"
                :step="1"
                :min="1"
                step-strictly
                size="small"
                controls-position="right"
                style="width: 120px"
              />
              <el-button
                @click="removeOre(index)"
                type="danger"
                :icon="Delete"
                size="small"
                style="margin-left: 15px"
                circle
              />
            </el-form-item>
            <el-form-item>
              <div style="display: flex">
                <el-button type="primary" @click="submitSetOre">
                  确认修改
                </el-button>
                <el-button class="cancelBtn" @click="jumpToManage">
                  取消修改
                </el-button>
              </div>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <el-dialog
      title="矿石配置"
      v-model="isBatchStarShow"
      e
      top="2vh"
      :close-on-click-modal="false"
    >
      <el-form class="stone">
        <el-form-item prop="probability">
          中矿概率：
          <el-input-number
            v-model="batchStarOreForm.probability"
            size="small"
            :step="1"
            :min="1"
            :max="100"
            style="width: 90px"
            step-strictly
            controls-position="right"
          />
          %
        </el-form-item>

        <el-form-item prop="oreQuantity">
          矿石个数：
          <el-input-number
            v-model="batchStarOreForm.oreQuantity"
            size="small"
            :step="1"
            :min="15"
            :max="20"
            style="width: 90px"
            step-strictly
            controls-position="right"
          />
          颗
        </el-form-item>

        <el-form-item>
          矿石：
          <el-button
            @click="addBatchOre"
            type="success"
            :icon="Plus"
            size="small"
            circle
          />
        </el-form-item>

        <el-form-item
          v-for="(ore, index) in batchStarOreForm.ores"
          :key="index"
        >
          价值：
          <el-input-number
            v-model="ore.minScore"
            :min="1"
            :max="ore.maxScore"
            step-strictly
            size="small"
            controls-position="right"
            style="width: 95px"
          />
          <span style="margin: 0 10px">-</span>
          <el-input-number
            v-model="ore.maxScore"
            :min="ore.minScore"
            step-strictly
            size="small"
            controls-position="right"
            style="width: 95px"
          />
          K分，
          <span style="margin: 0 10px">权重：</span>
          <el-input-number
            v-model="ore.weight"
            :step="1"
            :min="1"
            step-strictly
            size="small"
            controls-position="right"
            style="width: 120px"
          />
          <el-button
            @click="removeBatchOre(index)"
            type="danger"
            :icon="Delete"
            size="small"
            style="margin-left: 15px"
            circle
          />
        </el-form-item>

        <el-form-item>
          <div style="display: flex">
            <el-button type="primary" @click="submitBatchSetOre">
              提交
            </el-button>
            <el-button @click="isBatchStarShow = false">取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="星球K分分配"
      v-model="allocationDialogVisible"
      width="35%"
      :before-close="cancelAllocation"
      :close-on-click-modal="false"
    >
      <el-form class="stone">
        <el-form-item label="星球：">
          {{ allocationForm.starName }}
        </el-form-item>
        <el-form-item label="充K分：">
          <el-input-number
            v-model="allocationForm.allocationScore"
            controls-position="right"
            :min="1"
            :precision="0"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="display: flex">
          <el-button class="subBtn" @click="allocationScore">确定</el-button>
          <el-button class="cancelBtn" @click="cancelAllocation">
            取消
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 新增星球 -->
    <el-dialog
      title="创建星球"
      v-model="dialogVisible1"
      width="80%"
      @close="handleClose"
    >
      <el-form label-width="100px" :model="form" :rules="rules" ref="starForm">
        <el-form-item label="星球昵称：" prop="nickname">
          <el-input v-model="form.nickname" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="上线周期" prop="effectiveTime">
          <el-date-picker
            v-model="form.effectiveTime"
            type="datetimerange"
            value-format="YYYY-MM-DD HH:mm:ss"
            format="YYYY-MM-DD HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            :picker-options="1"
            @change="handleDateChange1"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="星球故事：" prop="story">
          <el-input
            v-model="form.story"
            type="textarea"
            style="width: 800px"
            :rows="8"
          ></el-input>
        </el-form-item>
        <el-form-item label="星球描述：" prop="describe">
          <el-input
            v-model="form.describe"
            type="textarea"
            style="width: 800px"
            :rows="8"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('starForm')">
            立即创建
          </el-button>
          <el-button @click="dialogVisible1 = false">取消创建</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import {
  offShelf,
  online,
  reqBatchSetOre,
  reqGetStarOre,
  reqSetOre,
  reqShowStarAvatar,
  reqStarList,
  reqUpdateStar,
} from '@/api/manage'
import { reqCreateStar } from '@/api/createstar'
import { reqAllocation } from '@/api/scoreAllocation'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
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

const router = useRouter()
let loading = ref(false)
let dialogVisible1 = ref(false)
let starForm = ref(null)

let form = ref({
  describe: '',
  nickname: '',
  story: '',
  ipDescribe: '1',
  ipNickname: '1',
  ipStory: '1',
  effectiveTime: [],
  startTime: '',
  endTime: '',
})
// let pickerOptions = reactive({
//   disabledDate(time) {
//     return time.getTime() < Date.now() - 1000 * 60 * 60 * 24
//   }
// })
let validateEffectiveTime = (rule, value, callback) => {
  // 自定义验证函数，检查 effectiveTime 的长度
  if (value && value.length >= 2) {
    callback() // 长度符合要求，验证通过
  } else {
    callback(new Error('请选择时间范围')) // 长度不符合要求，验证失败
  }
}

let passwordType = ref('')
let uploadUrl = `${import.meta.env.VITE_APP_BASE_API}/file/upload` // 上传的图片服务器地址
let activeName = ref('first')
let in_review = ref('./../in_review.png')
// 星球列表展示
let starList = ref(null)
let total = ref(0)
let pageQuery = ref({
  pageIndex: 1,
  pageSize: 10,
  nickname: null,
  state: null,
})
let multipleSelection = ref([])
// 更新新球列表
const starUpdateForm = ref({
  avatar: '',
  background: '',
  describe: '',
  id: 0,
  nickname: '',
  orePic: '',
  story: '',
  sharePicture: '',
  effectiveTime: [],
  startTime: '',
  endTime: '',
  state: null,
  useState: null,
})
const starUpdateFormRef = ref()
//   reactive({
//   avatar: '',
//   background: '',
//   describe: '',
//   id: 0,
//   nickname: '',
//   orePic: '',
//   story: '',
//   sharePicture: '',
//   effectiveTime: [],
//   startTime: '',
//   endTime: '',
//   state: null,
//   useState: null,
// })
let starOreForm = reactive({
  starId: null,
  oreQuantity: 0,
  probability: 0,
  score: 0,
  ores: [],
})
let batchStarOreForm = reactive({
  starIds: [],
  oreQuantity: 0,
  probability: 0,
  score: 0,
  ores: [],
})

let rules = {
  nickname: [
    { required: true, message: '请输入星球昵称', trigger: 'blur' },
    { max: 16, message: '昵称上限为16个字符', trigger: 'blur' },
  ],
  story: [{ required: true, message: '请输入星球故事', trigger: 'blur' }],
  effectiveTime: [{ validator: validateEffectiveTime, trigger: 'change' }],
}
let pickerOptions = {
  disabledDate(time) {
    // 禁止选择当前时间之前的时间，但允许选择当天及之后的时间
    return time.getTime() < Date.now() - 1000 * 60 * 60 * 24
  },
}
//分页的页码数据
let page = ref(1)
let limit = ref(7)
let totalElements = ref(0) //总页数
let jumpPage = ref(null)
let isStarShow = ref(false)
let isBatchStarShow = ref(false)
let dialogVisible = ref(false)
let allocationDialogVisible = ref(false)
let allocationForm = reactive({
  starId: null,
  starName: null,
  allocationScore: 1,
})

onMounted(() => {
  
  getStarList()
})

const handleSelectionChange = (val) => {
  multipleSelection.value = val
}

// 展示星球列表
const getStarList = async () => {
  let param = `pageIndex=${pageQuery.value.pageIndex}&pageSize=${pageQuery.value.pageSize}`
  if (pageQuery.value.nickname) {
    param += `&nickname=${pageQuery.value.nickname}`
  }
  if (pageQuery.value.state) {
    param += `&state=${pageQuery.value.state}`
  }
  const result = await reqStarList(param)
  // console.log(result.data, '??')
  starList.value = result.data.records
  total.value = result.data.total
}

const handleChangeStarPage = (pageIndex) => {
  pageQuery.value.pageIndex = pageIndex
  getStarList()
}

const handleChangeStarPageSize = (pageSize) => {
  pageQuery.value.pageSize = pageSize
  getStarList()
}

// 点击显示管理星球
const toStarManage = (starItem) => {
  // console.log(starItem, 'staritem')
  activeName.value = 'first'
  isStarShow.value = true
  starUpdateForm.value = starItem
  starUpdateForm.value.effectiveTime = [starItem.startTime, starItem.endTime]
  console.log(starUpdateForm.value)
  // Object.assign(starUpdateForm, {
  //   background: starItem.background,
  //   orePic: starItem.orePic,
  //   story: starItem.story,
  //   nickname: starItem.nickname,
  //   describe: starItem.describe,
  //   id: starItem.id,
  //   avatar: starItem.avatar,
  //   effectiveTime: [starItem.startTime, starItem.endTime],
  //   startTime: starItem.startTime,
  //   endTime: starItem.endTime,
  //   state: starItem.state,
  //   useState: starItem.useState,
  // })

  getStarOre(starItem.id)
}

// 点击显示管理星球
const clickBatchSetOre = () => {
  multipleSelection.value.forEach((value) => {
    batchStarOreForm.starIds.push(value.id)
  })
  isBatchStarShow.value = true
}

// 获取矿石配置
const getStarOre = async (starId) => {
  const result = await reqGetStarOre(starId)
  Object.assign(starOreForm, result.data, { starId })
}

// 上传之前的钩子函数
const beforeAvatarUpload = async (file) => {
  const isImg = file.size / 1024 / 1024 < 2
  if (!isImg) {
    ElMessage.error('上传头像图片大小不能超过 2MB!')
  }
  const isType = file.type === 'image/png'
  const isType2 = file.type === 'image/jpeg'

  if (!isType && !isType2) {
    ElMessage.error('上传头像图片格式为png或jpg')
  }
  return (isType || isType2) && isImg
}

// 修改有效时间
const handleDateChange = () => {
  // 在选择时间范围时触发的 change 事件
  starUpdateForm.value.startTime = starUpdateForm.value.effectiveTime[0]
  starUpdateForm.value.endTime = starUpdateForm.value.effectiveTime[1]
}
const handleDateChange1 = () => {
  console.log(form.value, 'form.value')
  form.value.startTime = form.value.effectiveTime[0]
  form.value.endTime = form.value.effectiveTime[1]
}
// watch(
//   () => form.value.effectiveTime,
//   (value) => {
//     console.log(value)
//   },
// )
const submitForm = () => {
  starForm.value.validate((valid) => {
    if (valid) {
      ElMessageBox.confirm('此操作将提交星球信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          submitStar()
          ElMessage({
            type: 'success',
            message: '创建成功!',
          })
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '已取消创建',
          })
        })
    }
  })
}

const submitStar = async () => {
  try {
    await reqCreateStar(form.value)
    await getStarList()
    starForm.value.resetFields()
    dialogVisible1.value = false
  } catch (e) {
    console.log(e)
  }
}

const handleClose = () => {
  starForm.value.resetFields()
}
// 提交更新表单
const handleSubmit = () => {
  console.log(111)
  starUpdateFormRef.value.validate((valid) => {
    if (valid) {
      console.log(222)

      loading.value = true
      try {
        const res = handleSubmitReq()
        console.log(res)

        loading.value = false
      } catch (e) {
        console.log(e)
        loading.value = false
      }
    } else {
      return false
    }
  })
}

const handleSubmitReq = async () => {
  await reqUpdateStar(starUpdateForm.value)
  await getStarList()
  isStarShow.value = false
}

const submitSetOre = () => {
  reqSetOre(starOreForm)
  getStarList()
  ElMessage.success('提交成功')
  isStarShow.value = false
}

const submitBatchSetOre = () => {
  reqBatchSetOre(batchStarOreForm)
  getStarList()
  ElMessage.success('提交成功')
  multipleSelection.value = []
  Object.assign(batchStarOreForm, {
    starIds: [],
    oreQuantity: 0,
    probability: 0,
    score: 0,
    ores: [],
  })
  isBatchStarShow.value = false
}

const handlePictureCardPreview = (file) => {
  dialogImageUrl.value = file.url
}

const handleCurrentChange = (e) => {
  page.value = e
  getStarList()
}

// 显示条数执行的函数
const handleSizeChange = (e) => {
  limit.value = e
  getStarList()
}

// 跳转页面
const changejump = () => {
  page.value = +jumpPage.value
  getStarList()
  jumpPage.value = null
}

// 跳转到创建星球页面
const jumpToStar = () => {
  router.push('/manage/star')
}

// 取消创建跳转到管理星球页面
const jumpToManage = () => {
  router.push('/manage/starmanage')
  isStarShow.value = false
}

const openDialog = () => {
  // 点击图片时打开弹窗
  dialogVisible.value = true
}

const addOre = () => {
  starOreForm.ores.push({ minScore: 1, maxScore: 1, weight: 1 })
}

const removeOre = (index) => {
  starOreForm.ores.splice(index, 1)
}

const addBatchOre = () => {
  batchStarOreForm.ores.push({ minScore: 1, maxScore: 1, weight: 1 })
}

const removeBatchOre = (index) => {
  batchStarOreForm.ores.splice(index, 1)
}

const changeShowStarAvatar = async (starId) => {
  const data = { id: starId }
  await reqShowStarAvatar(data)
  getStarList()
}

const clickOffShelf = (row) => {
  ElMessageBox.confirm(`是否确定下架星球【${row.nickname}】`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    offShelf({ id: row.id }).then(() => {
      ElMessage({
        type: 'success',
        message: '下架成功!',
      })
      getStarList()
      jumpToManage()
    })
  })
}

const clickPublish = (row) => {
  let title = '是否确定发布星球【' + row.nickname + '】'
  if (row.score === 0) {
    title = '星球【' + row.nickname + '】K分不足，是否继续发布？'
  }
  ElMessageBox.confirm(title, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      online({ id: row.id }).then(() => {
        ElMessage({
          type: 'success',
          message: '发布成功!',
        })
        getStarList()
        jumpToManage()
      })
    })
    .catch((_) => {})
}

const clickAllocation = (row) => {
  allocationForm.starId = row.id
  allocationForm.starName = row.nickname
  allocationDialogVisible.value = true
}
// 取消按钮
const cancelAllocation = () => {
  console.log('quxiao')
  allocationForm = {
    starId: null,
    starName: null,
    allocationScore: 1,
  }
  allocationDialogVisible.value = false
}
const allocationScore = async () => {
  let data = {
    starId: allocationForm.starId,
    allocationType: 2,
    score: allocationForm.allocationScore,
  }
  await reqAllocation(data)
  // allocationDialogVisible.value = false
  ElMessage({
    type: 'success',
    message: '分配成功',
  })
  await getStarList()
  cancelAllocation()
}
</script>

<style scoped>
.clearfix::after {
  content: '';
  display: block;
  clear: both;
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
.addbtn:hover {
  background-color: #66b1ff;
}
.avatar-uploader .el-upload {
  display: block;
  width: 178px;
  height: 178px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
