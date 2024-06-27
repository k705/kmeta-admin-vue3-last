<template xmlns="">
  <div>
    <div slot="header" class="clearfix" style="margin: 20px 0 40px 0">
      <div class="addbtn" @click="clickAdd">添加区块大奖</div>
    </div>

    <div class="app-container" style="margin-top: 20px; margin-right: 30px">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="title" label="主题" width="150" align="center" />
        <el-table-column
          prop="prizeName"
          label="奖品"
          width="150"
          align="center"
        />
        <el-table-column label="奖品图" width="150" align="center">
          <template #default="{ row }">
            <img style="width: 70px; height: 100px" :src="row.prizePic" />
          </template>
        </el-table-column>
        <el-table-column
          prop="blockNumber"
          label="区块个数"
          width="120"
          align="center"
        />
        <el-table-column
          prop="inventory"
          label="剩余区块"
          width="120"
          align="center"
        />
        <el-table-column
          prop="prizeNumber"
          label="奖品个数"
          width="120"
          align="center"
        />
        <el-table-column
          prop="needScore"
          label="K分/区块"
          width="120"
          align="center"
        />
        <el-table-column prop="quota" label="限购" width="120" align="center" />
        <el-table-column label="抢兑时间" width="320" align="center">
          <template #default="{ row }">
            {{ row.exchangeStartTime }} -- {{ row.exchangeEndTime }}
          </template>
        </el-table-column>
        <el-table-column label="解密时间" width="320" align="center">
          <template #default="{ row }">
            {{ row.decryptStartTime }} -- {{ row.decryptEndTime }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="150" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.state === 1">待发布</el-tag>
            <el-tag v-if="row.state === 2" type="info">已发布</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="250"
          align="center"
        />
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          width="240"
          min-width="100"
        >
          <template #default="scope">
            <el-button
              v-if="
                !(
                  scope.row.state === 2 &&
                  Date.parse(scope.row.decryptEndTime) < Date.now()
                )
              "
              @click="clickUpdate(scope.row)"
              :icon="Edit"
              type="primary"
              size="small"
            >
              编辑
            </el-button>

            <el-button
              v-if="scope.row.state === 1"
              @click="clickPublish(scope.row)"
              :icon="Promotion"
              type="primary"
              size="small"
            >
              发布
            </el-button>
            <el-button
              v-if="scope.row.state === 1"
              @click="clickDelete(scope.row)"
              :icon="Delete"
              type="danger"
              size="small"
            >
              删除
            </el-button>
            <el-button
              v-if="
                scope.row.state === 2 &&
                Date.parse(scope.row.exchangeStartTime) > Date.now()
              "
              @click="clickRevoke(scope.row)"
              :icon="RefreshLeft"
              type="primary"
              size="small"
            >
              撤销
            </el-button>
            <el-button
              v-if="
                scope.row.state === 2 &&
                Date.parse(scope.row.decryptStartTime) < Date.now()
              "
              @click="clickPrizeView(scope.row)"
              :icon="UserFilled"
              size="small"
            >
              开奖信息
            </el-button>
            <el-button
              v-if="scope.row.state === 1 && scope.row.isUsedCode"
              @click="clickUsedCode(scope.row)"
              :icon="FolderAdd"
              size="small"
            >
              导入使用码
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          layout="total, prev, pager, next"
          @current-change="handleChangeStarPage"
          :page-size="pageQuery.pageSize"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <el-dialog
      title="区块大奖"
      v-model="dialogVisible"
      top="2vh"
      :before-close="cancel"
      :close-on-click-modal="false"
    >
      <el-form
        label-width="120px"
        :model="formData"
        :rules="rules"
        ref="formDataRef"
      >
        <el-form-item label="活动主题：">
          <el-input
            v-model="formData.title"
            style="width: 250px"
            :disabled="formData.state === 2"
          ></el-input>
        </el-form-item>
        <el-form-item label="奖品：" prop="prizeName">
          <el-input
            v-model="formData.prizeName"
            style="width: 250px"
            :disabled="formData.state === 2"
          ></el-input>
        </el-form-item>
        <el-form-item label="抢兑时间：" prop="exchangeTime" required>
          <el-date-picker
            v-model="formData.exchangeTime"
            type="datetimerange"
            value-format="YYYY-MM-DD HH:mm:ss"
            format="YYYY-MM-DD HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            @blur="handleDateChange1"
            :picker-options="pickerOptions1"
            :disabled="formData.state === 2"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="解密时间：" prop="exchangeTime" required>
          <el-date-picker
            v-model="formData.decryptTime"
            type="datetimerange"
            value-format="YYYY-MM-DD HH:mm:ss"
            format="YYYY-MM-DD HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            @blur="handleDateChange2"
            :picker-options="pickerOptions2"
            :disabled="formData.state === 2"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="区块个数：">
          <el-input-number
            v-model="formData.blockNumber"
            controls-position="right"
            :min="1"
            :precision="0"
            :disabled="formData.state === 2"
          />
        </el-form-item>
        <el-form-item label="奖品个数：">
          <el-input-number
            v-model="formData.prizeNumber"
            controls-position="right"
            :min="1"
            :max="formData.blockNumber"
            :precision="0"
            :disabled="formData.state === 2"
          />
        </el-form-item>
        <el-form-item label="每个区块K分：">
          <el-input-number
            v-model="formData.needScore"
            controls-position="right"
            :min="1"
            :precision="0"
            :disabled="formData.state === 2"
          />
        </el-form-item>
        <el-form-item label="限购：">
          <el-input-number
            v-model="formData.quota"
            controls-position="right"
            :min="1"
            :max="formData.blockNumber"
            :precision="0"
          />
        </el-form-item>
        <el-form-item label="额外兑换：">
          <el-radio-group v-model="formData.isUsableAdditional">
            <el-radio :value="true">可用</el-radio>
            <el-radio :value="false">不可用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否需要核销：">
          <el-radio-group v-model="formData.isUsedCode">
            <el-radio :value="true">需要</el-radio>
            <el-radio :value="false">不需要</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="短信模板：">
          <el-input
            v-model="formData.smsTemplate"
            style="width: 250px"
          ></el-input>
        </el-form-item>
        <!-- <el-row :gutter="22"> -->
        <!-- <el-col :span="8"> -->
        <el-form-item label="奖品图片：" prop="prizePic">
          <div class="img_con" v-for="(i, index) in imgList1" :key="index">
            <el-image
              class="deduct_img"
              :src="i"
              :preview-src-list="[i]"
              style="width: 240px; height: 450px"
            ></el-image>
            <div class="overlay">
              <i class="remove_img" @click="handleRemove1(index)">
                <el-icon><Delete /></el-icon>
              </i>
            </div>
          </div>
          <UploadImg
            v-show="imgList1.length < 1"
            @get-url="getUrl1"
            :module="uploadModule"
          />
        </el-form-item>
        <!-- </el-col> -->
        <!-- <el-col :span="8"> -->
        <el-form-item label="分享图片：" prop="winningSharePic">
          <div class="img_con" v-for="(i, index) in imgList3" :key="index">
            <el-image
              class="deduct_img"
              :src="i"
              :preview-src-list="[i]"
              style="width: 240px; height: 450px"
            ></el-image>
            <div class="overlay">
              <i class="remove_img" @click="handleRemove3(index)">
                <el-icon><Delete /></el-icon>
              </i>
            </div>
          </div>
          <UploadImg
            v-show="imgList3.length < 1"
            @get-url="getUrl3"
            :module="uploadModule"
          />
        </el-form-item>
        <!-- </el-col> -->
        <!-- </el-row> -->
        <!-- <el-col :span="6"> -->
        <el-form-item label="中奖动画：" prop="winningCartoon">
          <div
            v-show="formData.winningCartoon"
            class="deduct_img"
            id="winningCanvas"
            ref="winningCanvas"
          />
          <el-upload
            class="upload-demo"
            accept=".svga"
            :action="uploadAction"
            :headers="uploadHeaders"
            :on-change="handleUploadChange"
            :on-success="handleUploadSuccess"
            v-model:file-list="imgList2"
          >
            <el-button class="addbtn">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <!-- </el-col> -->
        <el-form-item label="活动规则图片：">
          <div class="img_con" v-for="(i, index) in imgList4" :key="index">
            <el-image
              class="deduct_img"
              :src="i"
              :preview-src-list="[i]"
              style="width: 240px; height: 450px"
            ></el-image>
            <div class="overlay">
              <i class="remove_img" @click="handleRemove4(index)">
                <el-icon><Delete /></el-icon>
              </i>
            </div>
          </div>
          <UploadImg
            v-show="imgList4.length < 1"
            @get-url="getUrl4"
            :module="uploadModule"
          />
        </el-form-item>
        <el-form-item label="活动规则：" prop="activityRule">
          <el-input
            type="textarea"
            v-model="formData.activityRule"
            rows="4"
            style="width: 500px"
            :disabled="
              formData.state === 2 &&
              Date.parse(formData.decryptEndTime) < Date.now()
            "
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" style="display: flex">
        <el-button class="subBtn" @click="submitForm">确 定</el-button>
        <el-button class="cancelBtn" @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="开奖信息"
      v-model="winningDialogVisible"
      top="2vh"
      :before-close="cancelWinning"
      :close-on-click-modal="false"
    >
      <p style="font-weight: bold">已开奖：{{ lotteryInfo.lotteryNum }}</p>
      <p style="font-weight: bold">未开奖：{{ lotteryInfo.unLotteryNum }}</p>
      <div style="margin-top: 25px">中奖名单：⬇⬇⬇</div>
      <el-table :data="winningList" border style="margin-top: 5px; width: 100%">
        <el-table-column
          prop="nickName"
          label="昵称"
          width="150"
          align="center"
        />
        <el-table-column label="头像" width="100" align="center">
          <template v-slot="{ row }">
            <el-avatar :size="50" :src="row.avatar" />
          </template>
        </el-table-column>
        <el-table-column
          prop="kmetaId"
          label="Kmeta ID"
          width="150"
          align="center"
        />
        <el-table-column
          prop="receiverName"
          label="收货人"
          width="150"
          align="center"
        />
        <el-table-column
          prop="receiverPhone"
          label="收货手机号"
          width="150"
          align="center"
        />
        <el-table-column
          prop="address"
          label="收货地址"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          v-if="showWaybillNo"
          prop="waybillNo"
          label="物流单号"
          width="180"
          align="center"
        >
          <template v-slot="{ row, column, $index }">
            <div
              class="input-box"
              v-if="editWaybillNoId === row.id && editWaybillNo"
            >
              <el-input
                size="small"
                @blur="handleInputBlur(row)"
                v-model="row.waybillNo"
              ></el-input>
            </div>
            <span v-else class="cell-value">
              {{ row.waybillNo }}
              <el-button
                @click="handleCellClick(row)"
                :icon="Edit"
                size="small"
              />
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog
      title="导入使用码"
      v-model="usedCodeDialogVisible"
      top="2vh"
      :before-close="cancelUsedCode"
      :close-on-click-modal="false"
      width="600px"
    >
      <el-form
        label-width="120px"
        :model="usedCodeForm"
        :rules="rules"
        ref="usedCodeFormRef"
      >
        <el-form-item>
          <el-upload
            ref="upload"
            drag
            accept=".txt"
            action=""
            :auto-upload="false"
            :on-change="handleUploadCodeChange"
            :file-list="fileList"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
          </el-upload>
          <div
            v-if="usedCodeForm.usedCodes && usedCodeForm.usedCodes.length >= 1"
          >
            <h3>核销码预览：{{ usedCodeForm.usedCodes.length }}个</h3>
            <el-tag
              v-for="(item, index) in usedCodeForm.usedCodes"
              :key="index"
              style="margin-right: 30px"
            >
              {{ item }}
            </el-tag>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" style="margin-left: 150px; display: flex">
        <el-button class="subBtn" @click="submitUsedCodeForm">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import {
  reqAddBlockPrize,
  reqDeleteBlockPrize,
  reqGetBlockPrizeList,
  reqLotteryInfo,
  reqPublishBlockPrize,
  reqRevokeBlockPrize,
  reqSetBlockWaybillNo,
  reqUpdateBlockPrize,
  reqUploadUsedCode,
  reqWinningList,
} from '@/api/blockPrize'
import SVGA from 'svgaplayerweb'
import { GET_TOKEN } from '@/utils/token'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Edit,
  Check,
  Message,
  Star,
  Delete,
  RefreshLeft,
  UserFilled,
  Search,
  Share,
  Upload,
  Promotion,
  FolderAdd,
} from '@element-plus/icons-vue'
let uploadModule = ref('market/blockPrize')
let uploadAction = ref(
  `${import.meta.env.VITE_APP_BASE_API}/file/upload?module=market/blockPrize`,
)
let uploadHeaders = ref({ accessToken: GET_TOKEN() })
// console.log(uploadHeaders.value,'uploadHeaders');


let imgList1 = ref([])

let imgList2 = ref([])
let imgList3 = ref([])
let imgList4 = ref([])
let fileList = ref([])
let dialogVisible = ref(false)
let winningDialogVisible = ref(false)
let usedCodeDialogVisible = ref(false)
let showWaybillNo = ref(false)
let editWaybillNo = ref(false)
let editWaybillNoId = ref(null)
let total = ref(0)
let pageQuery = ref({
  pageIndex: 1,
  pageSize: 10,
})
let tableData = ref(null)
let formDataRef = ref(null)
let formData = ref({
  id: null,
  title: null,
  prizeName: null,
  prizePic: null,
  blockNumber: 100,
  prizeNumber: 1,
  needScore: 1,
  quota: 1,
  winningCartoon: null,
  winningSharePic: null,
  exchangeStartTime: null,
  exchangeEndTime: null,
  decryptStartTime: null,
  decryptEndTime: null,
  exchangeTime: [],
  decryptTime: [],
  activityRule: null,
  ruleImage: null,
  state: null,
  isUsableAdditional: true,
  isUsedCode: false,
  smsTemplate: null,
})
let usedCodeFormRef = ref(null)
let usedCodeForm = ref({
  id: null,
  usedCodes: [],
})
let winningList = ref([])
let lotteryInfo = ref({})
const validateExchangeTime = (rule, value, callback) => {
  if (!value || value.length !== 2) {
    callback(new Error('请选择兑换时间'))
  } else {
    callback()
  }
}
const validateDecryptTime = (rule, value, callback) => {
  if (!value || value.length !== 2) {
    callback(new Error('请选择解密时间'))
  } else {
    callback()
  }
}
let rules = reactive({
  prizeName: [{ required: true, message: '请输入奖品名称', trigger: 'change' }],
  exchangeTime: [{ validator: validateExchangeTime, trigger: 'change' }],
  decryptTime: [{ validator: validateDecryptTime, trigger: 'change' }],
  prizePic: [{ required: true, message: '请上传奖品图片', trigger: 'change' }],
  winningCartoon: [
    { required: true, message: '请上传中奖动画', trigger: 'change' },
  ],
  winningSharePic: [
    { required: true, message: '请上传中奖分享图片', trigger: 'change' },
  ],
  activityRule: [
    { required: true, message: '请填写活动规则', trigger: 'change' },
  ],
})

const pickerOptions1 = {
  disabledDate(time) {
    return time.getTime() < Date.now() - 1000 * 60 * 60 * 24
  },
}

const pickerOptions2 = {
  disabledDate(time) {
    if (
      !formData.value.exchangeTime ||
      formData.value.exchangeTime.length !== 2
    ) {
      return time.getTime() < Date.now() - 1000 * 60 * 60 * 24
    }

    const exchangeEndTime = new Date(formData.value.exchangeTime[1])
    if (isNaN(exchangeEndTime.getTime())) {
      return time.getTime() < Date.now() - 1000 * 60 * 60 * 24
    }
    return (
      time.getTime() <
      exchangeEndTime.getTime() -
        exchangeEndTime.getHours() * 3600000 -
        exchangeEndTime.getMinutes() * 60000
    )
  },
}

onMounted(() => {
  getBlockPrizeList()
})
const clickPrizeView = async (row) => {
  console.log(row, 'row')
  const result = await reqWinningList(row.id)
  showWaybillNo.value = !row.isUsedCode
  winningList.value = result.data
  console.log(result.data, 'result.data')

  const result2 = await reqLotteryInfo(row.id)
  lotteryInfo.value = result2.data
  winningDialogVisible.value = true

  console.log(result2.data, 'result2.data')
  console.log(winningDialogVisible.value, 'winningDialogVisible.value')
}

const getBlockPrizeList = async () => {
  const param = `pageIndex=${pageQuery.value.pageIndex}&pageSize=${pageQuery.value.pageSize}`
  const result = await reqGetBlockPrizeList(param)
  // console.log(result)
  tableData.value = result.data.records
  total.value = result.data.total
}

const handleChangeStarPage = (pageIndex) => {
  pageQuery.value.pageIndex = pageIndex
  getBlockPrizeList()
}

const clickAdd = () => {
  dialogVisible.value = true
}

const clickUpdate = (row) => {
  // console.log(row, 'row')
  formData.value = row
  // Object.assign(formData.value, {
  //   id: row.id,
  //   title: row.title,
  //   prizeName: row.prizeName,
  //   prizePic: row.prizePic,
  //   blockNumber: row.blockNumber,
  //   prizeNumber: row.prizeNumber,
  //   needScore: row.needScore,
  //   quota: row.quota,
  //   winningCartoon: row.winningCartoon,
  //   winningSharePic: row.winningSharePic,
  //   exchangeStartTime: row.exchangeStartTime,
  //   exchangeEndTime: row.exchangeEndTime,
  //   decryptStartTime: row.decryptStartTime,
  //   decryptEndTime: row.decryptEndTime,
  //   exchangeTime: [row.exchangeStartTime, row.exchangeEndTime],
  //   decryptTime: [row.decryptStartTime, row.decryptEndTime],
  //   activityRule: row.activityRule,
  //   ruleImage: row.ruleImage,
  //   state: row.state,
  //   isUsableAdditional: row.isUsableAdditional,
  //   isUsedCode: row.isUsedCode,
  //   smsTemplate: row.smsTemplate,
  // })
  ;(formData.value.exchangeTime = [row.exchangeStartTime, row.exchangeEndTime]),
    (formData.value.decryptTime = [row.decryptStartTime, row.decryptEndTime]),
    (dialogVisible.value = true)
  imgList1.value[0] = row.prizePic
  // imgList2.value[0] = row.winningCartoon
  imgList2.value[0] = {
    name: '1.svga',
    url: row.winningCartoon,
  }
  imgList3.value[0] = row.winningSharePic
  imgList4.value[0] = row.ruleImage
  // if (row.winningCartoon) {
  //   playSvg(row.winningCartoon)
  // }
}

const clickPublish = (row) => {
  ElMessageBox.confirm('是否确定发布？', '提示', {
    type: 'warning',
  })
    .then(() => {
      reqPublishBlockPrize({ id: row.id }).then(() => {
        ElMessage({
          type: 'success',
          message: '发布成功',
        })
        getBlockPrizeList()
      })
    })
    .catch(() => {})
}

const clickRevoke = (row) => {
  ElMessageBox.confirm('是否确定撤销？', '提示', {
    type: 'warning',
  })
    .then(() => {
      reqRevokeBlockPrize({ id: row.id }).then(() => {
        ElMessage({
          type: 'success',
          message: '撤销成功',
        })
        getBlockPrizeList()
      })
    })
    .catch(() => {})
}

const clickDelete = (row) => {
  ElMessageBox.confirm('是否确定删除？', '提示', {
    type: 'warning',
  })
    .then(() => {
      reqDeleteBlockPrize({ id: row.id }).then(() => {
        ElMessage({
          type: 'success',
          message: '删除成功',
        })
        getBlockPrizeList()
      })
    })
    .catch(() => {})
}

const handleDateChange1 = () => {
  formData.value.exchangeStartTime = formData.value.exchangeTime[0]
  formData.value.exchangeEndTime = formData.value.exchangeTime[1]
  formData.value.decryptTime = [
    formData.value.exchangeTime[1],
    formData.value.exchangeTime[1],
  ]
  nextTick(handleDateChange2)
}

const handleDateChange2 = () => {
  formData.value.decryptStartTime = formData.value.decryptTime[0]
  formData.value.decryptEndTime = formData.value.decryptTime[1]
  nextTick()
}

const submitForm = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      if (formData.value.id) {
        reqUpdateBlockPrize(formData.value).then(() => {
          ElMessage({
            type: 'success',
            message: '保存成功',
          })
          cancel()
          getBlockPrizeList()
        })
      } else {
        reqAddBlockPrize(formData.value).then(() => {
          ElMessage({
            type: 'success',
            message: '保存成功',
          })
          cancel()
          getBlockPrizeList()
        })
      }
      dialogVisible.value = false
    }
  })
}

const cancel = () => {
  dialogVisible.value = false
  if (formData.value.id) return
  formDataRef.value.resetFields()
  Object.assign(formData.value, {
    id: null,
    title: null,
    prizeName: null,
    prizePic: null,
    blockNumber: 100,
    prizeNumber: 1,
    needScore: 1,
    quota: 1,
    winningCartoon: null,
    winningSharePic: null,
    exchangeStartTime: null,
    exchangeEndTime: null,
    decryptStartTime: null,
    decryptEndTime: null,
    exchangeTime: [],
    decryptTime: [],
    activityRule: null,
    ruleImage: null,
    state: null,
    isUsableAdditional: true,
    isUsedCode: false,
    smsTemplate: null,
  })
  imgList1.value = []
  imgList2.value = []
  imgList3.value = []
  imgList4.value = []
}

const getUrl1 = (e) => {
  imgList1.value.push(e)
  formData.value.prizePic = e
  ElMessage({
    type: 'success',
    message: '上传成功',
  })
}
const handleRemove1 = (index) => {
  imgList1.value.splice(index, 1)
  formData.value.prizePic = imgList1.value.length ? imgList1.value[0] : null
}

const getUrl2 = (e) => {
  imgList2.value.push(e)
  formData.value.winningCartoon = e
  playSvg(e)
  ElMessage({
    type: 'success',
    message: '上传成功',
  })
}

const handleRemove2 = (index) => {
  imgList2.value.splice(index, 1)
  formData.value.winningCartoon = imgList2.value.length
    ? imgList2.value[0]
    : null
}

const getUrl3 = (e) => {
  imgList3.value.push(e)
  formData.value.winningSharePic = e
  ElMessage({
    type: 'success',
    message: '上传成功',
  })
}

const handleRemove3 = (index) => {
  imgList3.value.splice(index, 1)
  formData.value.winningSharePic = imgList3.value.length
    ? imgList3.value[0]
    : null
}

const getUrl4 = (e) => {
  // console.log(e, 'e')
  imgList4.value.push(e)
  formData.value.ruleImage = e
  ElMessage({
    type: 'success',
    message: '上传成功',
  })
}

const handleRemove4 = (index) => {
  imgList4.value.splice(index, 1)
  formData.value.ruleImage = imgList4.value.length ? imgList4.value[0] : null
}
const handleUploadChange = (file, fileList) => {
  imgList2.value = fileList.slice(-1)
}
const handleUploadSuccess = (response) => {
  formData.value.winningCartoon = response.data
  playSvg(formData.value.winningCartoon)
}

const clickWinningList = (row) => {
  reqWinningList({ id: row.id }).then((res) => {
    winningList.value = res.data
    winningDialogVisible.value = true
  })
}

const clickSetWaybillNo = (row) => {
  editWaybillNo.value = true
  editWaybillNoId.value = row.id
}

const setWaybillNo = () => {
  if (!formData.value.waybillNo) {
    ElMessage({
      type: 'warning',
      message: '请输入运单号',
    })
    return
  }
  reqSetBlockWaybillNo({
    id: editWaybillNoId.value,
    waybillNo: formData.value.waybillNo,
  }).then(() => {
    ElMessage({
      type: 'success',
      message: '设置成功',
    })
    editWaybillNo.value = false
    getBlockPrizeList()
  })
}

const cancelSetWaybillNo = () => {
  editWaybillNo.value = false
  editWaybillNoId.value = null
  formData.value.waybillNo = null
}

const clickUploadUsedCode = (row) => {
  usedCodeForm.value.id = row.id
  usedCodeDialogVisible.value = true
}

const uploadUsedCode = () => {
  reqUploadUsedCode(usedCodeForm.value).then(() => {
    ElMessage({
      type: 'success',
      message: '上传成功',
    })
    usedCodeDialogVisible.value = false
    getBlockPrizeList()
  })
}

const cancelUploadUsedCode = () => {
  usedCodeDialogVisible.value = false
  usedCodeForm.value.id = null
  usedCodeForm.value.usedCodes = []
}

const playSvg = (url) => {
  const player = new SVGA.Player('.svga-container')
  const parser = new SVGA.Parser('.svga-container')
  parser.load(url, (videoItem) => {
    player.setVideoItem(videoItem)
    player.startAnimation()
  })
}
const cancelWinning = () => {
  winningList.value = []
  winningDialogVisible.value = false
}

const handleUploadCodeChange = (file, fileList) => {
  fileList.value = fileList.slice(-1)

  if (fileList.length > 0) {
    const selectedFile = fileList[0].raw
    const reader = new FileReader()

    reader.onload = (e) => {
      const fileContent = e.target.result
      const lines = fileContent.split('\n')
      const fileContentArray = lines.map((line) => line.trim())
      console.log('File content array:', fileContentArray)
      usedCodeForm.usedCodes = fileContentArray
    }

    reader.onerror = (error) => {
      console.error('Error reading file:', error)
    }

    if (selectedFile.type.startsWith('text')) {
      reader.readAsText(selectedFile, 'gb2312')
    } else {
      reader.readAsDataURL(selectedFile)
    }
  } else {
    usedCodeForm.usedCodes = []
  }
}

const clickUsedCode = async (row) => {
  usedCodeForm.id = row.id
  usedCodeDialogVisible.value = true
}

const cancelUsedCode = () => {
  usedCodeDialogVisible.value = false
  usedCodeForm.id = null
  usedCodeForm.usedCodes = []
  fileList.value = []
}

const submitUsedCodeForm = () => {
  reqUploadUsedCode(usedCodeForm.value).then(() => {
    ElMessage({
      type: 'success',
      message: '提交成功',
    })
    cancelUsedCode()
    getBlockPrizeList()
  })
}

const handleCellClick = (row) => {
  editWaybillNoId.value = row.id
  editWaybillNo.value = true
}

const handleInputBlur = (row) => {
  console.log(row, 'row')
  editWaybillNoId.value = null
  editWaybillNo.value = false
  reqSetBlockWaybillNo({ id: row.id, waybillNo: row.waybillNo })
}
</script>

<style>
.cell-container {
  display: flex;
  justify-content: space-between; /* 使内部元素分散对齐 */
}

.button-container {
  display: flex;
  align-items: center; /* 使按钮垂直居中 */
}
</style>

<style scoped>
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
  width: 240px;
  height: 450px;
  position: relative;
  display: flex;
  /* background-color: #b9d547; */
}
.deduct_img {
  width: 180px;
  height: 180px;
  /* margin-right: 10px; */
  /* margin-bottom: 10px; */
}

.remove_img {
  position: absolute;
  right: 45%;
  top: 50%;
  display: none;
  color: #fff;
  cursor: pointer;
}
.img_con:hover .remove_img {
  display: block;
}
.preview_img {
  display: none;
  position: absolute;
  right: 60%;
  top: 50%;

  color: #fff;
  cursor: pointer;
}
.img_con:hover .preview_img {
  display: block;
}
.line {
  text-align: center;
}

.avatar-uploader .el-upload {
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

.content-container {
  display: flex;
  justify-content: space-between;
}

.addbtn {
  background: linear-gradient(to right, #5924ff, #20dfff);
  height: 38px;
  width: 120px;
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
</style>
