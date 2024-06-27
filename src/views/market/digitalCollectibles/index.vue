<template>
  <div>
    <div
      slot="header"
      class="clearfix"
      style="margin-top: 20px; margin-left: 20px"
    >
      <div class="addbtn" @click="clickAddSeries">添加NFT系列</div>
    </div>

    <div class="app-container" style="margin-top: 20px; margin-right: 30px">
      <el-table :data="seriesTableData" border style="width: 100%">
        <el-table-column prop="series" label="系列" align="center" />
        <el-table-column label="缩略图" align="center">
          <!-- <template slot-scope="{ row }">
            <img style="width: 65px; height: 100px" :src="row.thumbnail" />
          </template> -->
          <template v-slot="{ row }">
            <img style="width: 65px; height: 100px" :src="row.thumbnail" />
          </template>
        </el-table-column>
        <el-table-column label="按钮图标" align="center">
          <!-- <template slot-scope="{ row }">
            <img style="width: 100px; height: 100px" :src="row.buttonIcon" />
          </template> -->
          <template v-slot="{ row }">
            <img style="width: 100px; height: 100px" :src="row.buttonIcon" />
          </template>
        </el-table-column>
        <el-table-column label="标签" align="center">
          <template v-slot="{ row }">
            <el-tag
              v-for="(label, index) in JSON.parse(row.labels)"
              :key="index"
              style="margin-top: 5px"
              :color="label.bgColor"
              :style="{ color: label.typefaceColor }"
            >
              {{ label.tag }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序值" align="center" />
        <el-table-column prop="createTime" label="创建时间" align="center" />
        <el-table-column fixed="right" label="操作" align="center">
          <template #default="scope">
            <el-button
              @click="clickSeriesUpdate(scope.row)"
              :icon="Edit"
              type="primary"
              text
              size="small"
            >
              编辑
            </el-button>
            <el-button
              @click="clickNft(scope.row)"
              :icon="Setting"
              type="success"
              text
              size="small"
            >
              NFT管理
            </el-button>
            <el-button
              @click="clickSeriesDelete(scope.row)"
              :icon="Delete"
              type="danger"
              text
              size="small"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      title="NFT系列"
      v-model="seriesDialogVisible"
      top="2vh"
      :close-on-click-modal="false"
      width="1000px"
      :before-close="seriesCancel"
    >
      <el-form
        label-width="120px"
        :model="seriesFormData"
        :rules="rules2"
        ref="seriesFormDataRef"
      >
        <el-form-item label="NFT系列：" prop="series">
          <el-input
            v-model="seriesFormData.series"
            style="width: 250px"
          ></el-input>
        </el-form-item>
        <el-form-item label="标签：" prop="dynamicTags">
          <el-tag
            :key="index"
            v-for="(item, index) in seriesFormData.dynamicTags"
            :closable="true"
            :disable-transitions="false"
            :color="item.bgColor"
            :style="{ color: item.typefaceColor }"
            @click="handleTagClick2(index)"
            @close="handleClose2(index)"
          >
            {{ item.tag }}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible2"
            v-model="inputValue2"
            ref="saveTagInput2"
            size="small"
            @keyup.enter.native="handleInputConfirm2"
            @blur="handleInputConfirm2"
          ></el-input>
          <el-button
            v-else
            class="button-new-tag"
            size="small"
            @click="showInput2"
          >
            + New Tag
          </el-button>
        </el-form-item>
        <el-row
          :gutter="22"
          v-if="
            seriesFormData.dynamicTagsIndex ||
            seriesFormData.dynamicTagsIndex === 0
          "
        >
          <el-col :span="10">
            <el-form-item label="标签颜色：" class="form-item-flex">
              <el-input
                v-model="
                  seriesFormData.dynamicTags[seriesFormData.dynamicTagsIndex]
                    .bgColor
                "
                style="width: 150px"
              />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="字体颜色：" class="form-item-flex">
              <el-input
                v-model="
                  seriesFormData.dynamicTags[seriesFormData.dynamicTagsIndex]
                    .typefaceColor
                "
                style="width: 150px"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="缩略图：" prop="thumbnail">
          <div class="img_con" v-for="(i, index) in imgList4" :key="index">
            <el-image
              class="deduct_img"
              :src="i"
              :preview-src-list="[i]"
              style="width: 157px; height: 250px"
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
        <el-form-item label="按钮图标：" prop="buttonIcon">
          <div class="img_con" v-for="(i, index) in imgList5" :key="index">
            <el-image
              class="deduct_img"
              :src="i"
              :preview-src-list="[i]"
              style="width: 177px; height: 177px"
            ></el-image>
            <div class="overlay">
              <i class="remove_img" @click="handleRemove5(index)">
                <el-icon><Delete /></el-icon>
              </i>
            </div>
          </div>
          <UploadImg
            v-show="imgList5.length < 1"
            @get-url="getUrl5"
            :module="uploadModule"
          />
        </el-form-item>
        <el-form-item label="排序(小优先)：">
          <el-input-number
            v-model="seriesFormData.sort"
            controls-position="right"
            :min="1"
            :precision="0"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" style="display: flex">
        <el-button class="subBtn" @click="submitSeriesForm">确 定</el-button>
        <el-button class="cancelBtn" @click="seriesCancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="数字藏品"
      v-model="nftDialogVisible"
      top="2vh"
      :close-on-click-modal="false"
      width="80%"
      :before-close="cancelNft"
    >
      <div class="addbtn" @click="clickAdd">添加数字藏品</div>

      <el-form
        :model="pageQuery"
        :inline="true"
        style="margin-top: 35px; margin-left: 20px"
      >
        <el-form-item label="藏品名：">
          <el-input v-model="pageQuery.collectiblesName" style="width: 200px" />
        </el-form-item>
        <el-form-item label="状态：" style="margin-left: 30px">
          <el-select v-model="pageQuery.state" clearable>
            <el-option label="未发布" value="1"></el-option>
            <el-option label="已发布" value="2"></el-option>
            <el-option label="进行中" value="3"></el-option>
            <el-option label="已结束" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-button
          type="primary"
          :icon="Search"
          @click="getDigitalCollectiblesList"
          round
          style="margin-left: 40px"
        />
      </el-form>

      <div class="app-container" style="margin-right: 30px">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column
            prop="collectiblesName"
            label="藏品名"
            width="150"
            align="center"
          />
          <el-table-column label="藏品展示图" width="150" align="center">
            <template v-slot="{ row }">
              <img
                style="width: 100px; height: 100px"
                :src="row.displayImage"
              />
            </template>
          </el-table-column>
          <el-table-column label="藏品卡片图" width="150" align="center">
            <template v-slot="{ row }">
              <img style="width: 65px; height: 100px" :src="row.cardImage" />
            </template>
          </el-table-column>
          <el-table-column label="稀有级别" width="150" align="center">
            <template v-slot="{ row }">
              <el-tag type="success">{{ row.rarityLevel }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="score"
            label="兑换所需K分"
            width="120"
            align="center"
          />
          <el-table-column
            prop="collectiblesCode"
            label="藏品证书编号"
            width="200"
            align="center"
          />
          <el-table-column
            prop="quantity"
            label="藏品数量"
            width="150"
            align="center"
          />
          <el-table-column
            prop="inventory"
            label="剩余藏品"
            width="120"
            align="center"
          />
          <el-table-column label="标签" width="300" align="center">
            <template v-slot="{ row }">
              <el-tag
                :key="index"
                style="margin-top: 5px"
                type="info"
                v-for="(tag, index) in row.tags.split(',')"
              >
                {{ tag }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="兑换时间" width="320" align="center">
            <template v-slot="{ row }">
              {{ row.startTime }} -- {{ row.endTime }}
            </template>
          </el-table-column>
          <el-table-column label="状态" width="200" align="center">
            <template v-slot="{ row }">
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
            width="200"
            label="操作"
            align="center"
          >
            <template #default="scope">
              <el-button
                v-if="scope.row.state === 1"
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
                :icon="promotion"
                type="primary"
                size="small"
              >
                发布
              </el-button>
              <el-button
                v-if="scope.row.state === 2"
                @click="clickRevoke(scope.row)"
                :icon="RefreshLeft"
                type="primary"
                size="small"
              >
                下架
              </el-button>
              <el-button
                v-if="scope.row.state === 1"
                @click="clickDelete(scope.row)"
                :icon="Delete"
                type="primary"
                size="small"
              >
                删除
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
    </el-dialog>

    <el-dialog
      title="数字藏品"
      v-model="dialogVisible"
      top="2vh"
      :close-on-click-modal="false"
      width="1000px"
      :before-close="cancel"
    >
      <el-form
        label-width="120px"
        :model="formData"
        :rules="rules"
        ref="formDataRef"
      >
        <el-form-item label="藏品名：" prop="collectiblesName">
          <el-input
            v-model="formData.collectiblesName"
            style="width: 250px"
          ></el-input>
        </el-form-item>
        <el-form-item label="有效时间：" prop="exchangeTime" required>
          <el-date-picker
            v-model="formData.exchangeTime"
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
        <!-- <el-row :gutter="21"> -->
        <!-- <el-col :span="7"> -->
        <el-form-item label="稀有级别：" prop="rarityLevel">
          <el-select v-model="formData.rarityLevel" @change="changeRarityLevel">
            <el-option
              v-for="item in rarityLevelEnum"
              :key="item.code"
              :label="item.desc"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- </el-col> -->
        <!-- <el-col :span="7"> -->
        <el-form-item label="藏品数量：">
          <el-input-number
            v-model="formData.quantity"
            controls-position="right"
            :min="1"
            :precision="0"
          />
        </el-form-item>
        <!-- </el-col> -->
        <!-- <el-col :span="7"> -->
        <el-form-item label="兑换所需K分：">
          <el-input-number
            v-model="formData.score"
            controls-position="right"
            :min="1"
            :precision="0"
          />
        </el-form-item>
        <!-- </el-col> -->
        <!-- </el-row> -->
        <el-form-item label="创作者：" prop="creator">
          <el-input v-model="formData.creator" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="发行方：" prop="issuer">
          <el-input v-model="formData.issuer" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="标签：" prop="dynamicTags">
          <el-tag
            :key="index"
            v-for="(item, index) in formData.dynamicTags"
            :closable="index !== 0 || !formData.rarityLevel"
            :disable-transitions="false"
            :color="item.bgColor"
            :style="{ color: item.typefaceColor }"
            @click="handleTagClick(index)"
            @close="handleClose(index)"
          >
            {{ item.tag }}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          ></el-input>
          <el-button
            v-else
            class="button-new-tag"
            size="small"
            @click="showInput"
          >
            + New Tag
          </el-button>
        </el-form-item>
        <el-row
          :gutter="22"
          v-if="formData.dynamicTagsIndex || formData.dynamicTagsIndex === 0"
        >
          <el-col :span="10">
            <el-form-item label="标签颜色：" class="form-item-flex">
              <el-input
                v-model="
                  formData.dynamicTags[formData.dynamicTagsIndex].bgColor
                "
                style="width: 150px"
              />
              <!--              <el-row :gutter="10">-->
              <!--                <el-col :span="11">-->
              <!--                  <el-input v-model="formData.dynamicTags[formData.dynamicTagsIndex].bgColor" style="width: 150px" />-->
              <!--                </el-col>-->
              <!--                <el-col :span="1">-->
              <!--                  <el-color-picker-->
              <!--                    v-model="formData.dynamicTags[formData.dynamicTagsIndex].bgColor"-->
              <!--                    @active-change="handleColorChange"-->
              <!--                  />-->
              <!--                </el-col>-->
              <!--              </el-row>-->
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="字体颜色：" class="form-item-flex">
              <el-input
                v-model="
                  formData.dynamicTags[formData.dynamicTagsIndex].typefaceColor
                "
                style="width: 150px"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="藏品简介：" prop="synopsis">
          <el-input
            type="textarea"
            v-model="formData.synopsis"
            rows="4"
            style="width: 500px"
          ></el-input>
        </el-form-item>
        <el-row :gutter="22">
          <el-col :span="10">
            <el-form-item label="展示图：" prop="displayImage">
              <div class="img_con" v-for="(i, index) in imgList1" :key="index">
                <el-image
                  class="deduct_img"
                  :src="i"
                  :preview-src-list="[i]"
                  style="width: 240px; height: 198px"
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
          </el-col>
          <el-col :span="11">
            <el-form-item label="卡片图：" prop="cardImage">
              <div class="img_con" v-for="(i, index) in imgList2" :key="index">
                <el-image
                  class="deduct_img"
                  :src="i"
                  :preview-src-list="[i]"
                  style="width: 240px; height: 388px"
                ></el-image>
                <div class="overlay">
                  <i class="remove_img" @click="handleRemove2(index)">
                    <el-icon><Delete /></el-icon>
                  </i>
                </div>
              </div>
              <UploadImg
                v-show="imgList2.length < 1"
                @get-url="getUrl2"
                :module="uploadModule"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="蒙层：">
          <div class="img_con" v-for="(i, index) in imgList3" :key="index">
            <el-image
              class="deduct_img"
              :src="i"
              :preview-src-list="[i]"
              style="width: 240px; height: 388px"
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
      </el-form>
      <div slot="footer" style="display: flex">
        <el-button class="subBtn" @click="submitForm">确 定</el-button>
        <el-button class="cancelBtn" @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
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
  Setting,
  Plus,
  RefreshLeft,
  UserFilled,
  Search,
  Share,
  Upload,
  Promotion,
  FolderAdd,
} from '@element-plus/icons-vue'

import { ref, reactive, onMounted, nextTick } from 'vue'
import {
  reqAddDigitalCollectibles,
  reqAddNftSeries,
  reqDeleteDigitalCollectibles,
  reqDeleteNftSeries,
  reqGetDigitalCollectiblesList,
  reqGetNftSeries,
  reqPublishDigitalCollectibles,
  reqRevokeDigitalCollectibles,
  reqUpdateDigitalCollectibles,
  reqUpdateNftSeries,
} from '@/api/digitalCollectibles'

const uploadModule = ref('market/digitalCollectibles')
const imgList1 = ref([])
const imgList2 = ref([])
const imgList3 = ref([])
const imgList4 = ref([])
const imgList5 = ref([])
const seriesDialogVisible = ref(false)
const nftDialogVisible = ref(false)
const dialogVisible = ref(false)
const seriesTableData = ref(null)
const saveTagInput2 = ref(null)
const saveTagInput = ref(null)
const seriesFormDataRef = ref(null)
const seriesFormData = ref({
  id: null,
  series: null,
  thumbnail: null,
  buttonIcon: null,
  labels: null,
  sort: 1,
  dynamicTags: [],
  dynamicTagsIndex: null,
})
const total = ref(0)
const pageQuery = ref({
  pageIndex: 1,
  pageSize: 10,
  nftSeriesId: null,
  collectiblesName: null,
  state: null,
})
const tableData = ref(null)
const inputVisible = ref(false)
const inputValue = ref('')
const inputVisible2 = ref(false)
const inputValue2 = ref('')
const formDataRef = ref(null)
const formData = ref({
  id: null,
  collectiblesName: null,
  rarityLevel: null,
  displayImage: null,
  cardImage: null,
  covered: null,
  score: 1,
  quantity: 1,
  tags: null,
  synopsis: null,
  creator: null,
  issuer: null,
  dynamicTagsIndex: null,
  dynamicTags: [],
  labels: null,
  startTime: null,
  endTime: null,
  exchangeTime: [],
})
const rarityLevelEnum = ref([
  { code: '稀有', desc: '稀有' },
  { code: '史诗', desc: '史诗' },
  { code: '传说', desc: '传说' },
  { code: '神话', desc: '神话' },
])

const validateExchangeTime = (rule, value, callback) => {
  // 自定义验证函数，检查 effectiveTime 的长度
  if (value && value.length >= 2) {
    callback() // 长度符合要求，验证通过
  } else {
    callback(new Error('请选择有效时间')) // 长度不符合要求，验证失败
  }
}

const rules = ref({
  collectiblesName: [
    { required: true, message: '请输入藏品名称', trigger: 'change' },
  ],
  rarityLevel: [
    { required: true, message: '请选择稀有级别', trigger: 'change' },
  ],

  exchangeTime: [{ validator: validateExchangeTime, trigger: 'change' }],
  dynamicTags: [{ required: true, message: '请输入标签', trigger: 'change' }],
  creator: [{ required: true, message: '请填写创作者', trigger: 'change' }],
  issuer: [{ required: true, message: '请填写发行方', trigger: 'change' }],
  synopsis: [{ required: true, message: '请输入藏品简介', trigger: 'change' }],
  displayImage: [
    { required: true, message: '请上传数字藏品展示图', trigger: 'change' },
  ],
  cardImage: [
    { required: true, message: '请上传数字藏品卡片图', trigger: 'blur' },
  ],
})

const rules2 = ref({
  series: [{ required: true, message: '请输入NFT系列', trigger: 'change' }],
  thumbnail: [{ required: true, message: '请上传缩略图', trigger: 'change' }],
  buttonIcon: [
    { required: true, message: '请上传按钮图标', trigger: 'change' },
  ],
  dynamicTags: [{ required: true, message: '请输入标签', trigger: 'change' }],
})
const pickerOptions = reactive({
  disabledDate(time) {
    // 禁止选择当前时间之前的时间，但允许选择当天及之后的时间
    return time.getTime() < Date.now() - 1000 * 60 * 60 * 24
  },
})
onMounted(() => {
  getNftSeries()
})

const getNftSeries = async () => {
  try {
    const result = await reqGetNftSeries()

    seriesTableData.value = result.data
  } catch (error) {
    console.error('Error fetching NFT series:', error)
  }
}
const getDigitalCollectiblesList = async () => {
  let param = `pageIndex=${pageQuery.value.pageIndex}&pageSize=${pageQuery.value.pageSize}&nftSeriesId=${pageQuery.value.nftSeriesId}`
  if (pageQuery.value.collectiblesName) {
    param = param + `&collectiblesName=${pageQuery.value.collectiblesName}`
  }
  if (pageQuery.value.state) {
    param = param + `&state=${pageQuery.value.state}`
  }
  try {
    const result = await reqGetDigitalCollectiblesList(param)
    tableData.value = result.data.records
    total.value = result.data.total
  } catch (error) {
    console.error('Error fetching digital collectibles list:', error)
  }
}
const clickAddSeries = () => {
  seriesDialogVisible.value = true
}

const clickSeriesUpdate = (row) => {
  seriesFormData.value = {
    id: row.id,
    series: row.series,
    thumbnail: row.thumbnail,
    buttonIcon: row.buttonIcon,
    labels: row.labels,
    sort: row.sort,
    dynamicTags: JSON.parse(row.labels),
    dynamicTagsIndex: null,
  }
  imgList4.value[0] = row.thumbnail
  imgList5.value[0] = row.buttonIcon
  seriesDialogVisible.value = true
}

const clickSeriesDelete = (row) => {
  ElMessageBox.confirm('是否确定删除？', '提示', {
    type: 'warning',
  })
    .then((_) => {
      reqDeleteNftSeries({ id: row.id }).then(() => {
        ElMessage({
          type: 'success',
          message: '删除成功!',
        })
        getNftSeries()
      })
    })
    .catch((_) => {})
}

const submitSeriesForm = () => {
  seriesFormDataRef.value.validate((valid) => {
    if (valid) {
      seriesFormData.value.labels = JSON.stringify(
        seriesFormData.value.dynamicTags,
      )
      if (seriesFormData.value.id) {
        reqUpdateNftSeries(seriesFormData.value).then(() => {
          ElMessage({
            type: 'success',
            message: '保存成功!',
          })
          seriesCancel()
          getNftSeries()
        })
      } else {
        reqAddNftSeries(seriesFormData.value).then(() => {
          ElMessage({
            type: 'success',
            message: '保存成功!',
          })
          seriesCancel()
          getNftSeries()
        })
      }
      seriesDialogVisible.value = false
    }
  })
}

const seriesCancel = () => {
  seriesDialogVisible.value = false
  seriesFormDataRef.value.resetFields()
  seriesFormData.value = {
    id: null,
    series: null,
    thumbnail: null,
    buttonIcon: null,
    labels: null,
    sort: 1,
    dynamicTags: [],
    dynamicTagsIndex: null,
  }
  imgList4.value = []
  imgList5.value = []
  inputValue.value = ''
  inputVisible.value = false
}

const clickNft = (row) => {
  pageQuery.value.nftSeriesId = row.id
  getDigitalCollectiblesList()
  nftDialogVisible.value = true
}

const cancelNft = () => {
  nftDialogVisible.value = false
  pageQuery.value.nftSeriesId = null
  tableData.value = []
}

const handleChangeStarPage = (pageIndex) => {
  pageQuery.value.pageIndex = pageIndex
  getDigitalCollectiblesList()
}

const clickAdd = () => {
  dialogVisible.value = true
}

const clickUpdate = (row) => {
  formData.value = {
    id: row.id,
    collectiblesName: row.collectiblesName,
    rarityLevel: row.rarityLevel,
    displayImage: row.displayImage,
    cardImage: row.cardImage,
    covered: row.covered,
    score: row.score,
    quantity: row.quantity,
    tags: row.tags,
    labels: row.labels,
    synopsis: row.synopsis,
    creator: row.creator,
    issuer: row.issuer,
    startTime: row.startTime,
    endTime: row.endTime,
    exchangeTime: [row.startTime, row.endTime],
    dynamicTags: row.labels
      ? JSON.parse(row.labels)
      : row.tags.split(',').map((tag) => ({
          tag: tag,
          bgColor: '#1B2A3EFF',
          typefaceColor: '#647994FF',
        })),
    dynamicTagsIndex: null,
  }
  imgList1.value[0] = row.displayImage
  imgList2.value[0] = row.cardImage
  if (row.covered) {
    imgList3.value[0] = row.covered
  }
  dialogVisible.value = true
}

const clickPublish = (row) => {
  ElMessageBox.confirm('是否确定发布上架？', '提示', {
    type: 'warning',
  })
    .then((_) => {
      reqPublishDigitalCollectibles({ id: row.id }).then(() => {
        ElMessage({
          type: 'success',
          message: '发布成功!',
        })
        getDigitalCollectiblesList()
      })
    })
    .catch((_) => {})
}

const clickRevoke = (row) => {
  ElMessageBox.confirm('是否确定撤销下架？', '提示', {
    type: 'warning',
  })
    .then((_) => {
      reqRevokeDigitalCollectibles({ id: row.id }).then(() => {
        ElMessage({
          type: 'success',
          message: '撤销成功!',
        })
        getDigitalCollectiblesList()
      })
    })
    .catch((_) => {})
}

const clickDelete = (row) => {
  ElMessageBox.confirm('是否确定删除？', '提示', {
    type: 'warning',
  })
    .then((_) => {
      reqDeleteDigitalCollectibles({ id: row.id }).then(() => {
        ElMessage({
          type: 'success',
          message: '删除成功!',
        })
        getDigitalCollectiblesList()
      })
    })
    .catch((_) => {})
}

const submitForm = () => {
  formDataRef.value.validate((valid) => {
    if (valid) {
      formData.value.labels = JSON.stringify(formData.value.dynamicTags)
      formData.value.nftSeriesId = pageQuery.value.nftSeriesId
      if (formData.value.id) {
        reqUpdateDigitalCollectibles(formData.value).then(() => {
          ElMessage({
            type: 'success',
            message: '保存成功!',
          })
          cancel()
          getDigitalCollectiblesList()
        })
      } else {
        reqAddDigitalCollectibles(formData.value).then(() => {
          ElMessage({
            type: 'success',
            message: '保存成功!',
          })
          cancel()
          getDigitalCollectiblesList()
        })
      }
      dialogVisible.value = false
    }
  })
}

const cancel = () => {
  dialogVisible.value = false
  formDataRef.value.resetFields()
  formData.value = {
    id: null,
    collectiblesName: null,
    rarityLevel: null,
    displayImage: null,
    cardImage: null,
    covered: null,
    score: 1,
    quantity: 1,
    tags: null,
    labels: null,
    synopsis: null,
    creator: null,
    issuer: null,
    dynamicTags: [],
    startTime: null,
    endTime: null,
    exchangeTime: [],
    dynamicTagsIndex: null,
  }
  imgList1.value = []
  imgList2.value = []
  imgList3.value = []
  inputValue2.value = ''
  inputVisible2.value = false
}

const getUrl1 = (e) => {
  imgList1.value.push(e)
  formData.value.displayImage = e
  ElMessage({
    type: 'success',
    message: '上传成功!',
  })
}

const handleRemove1 = (index) => {
  imgList1.value.splice(index, 1)
  formData.value.displayImage = null
}

const getUrl2 = (e) => {
  imgList2.value.push(e)
  formData.value.cardImage = e
  ElMessage({
    type: 'success',
    message: '上传成功!',
  })
}
const handleRemove2 = (index) => {
  imgList2.value.splice(index, 1)
  formData.value.cardImage = null
}

const getUrl3 = (e) => {
  imgList3.value.push(e)
  formData.value.covered = e
  ElMessage({
    type: 'success',
    message: '上传成功!',
  })
}
const handleRemove3 = (index) => {
  imgList3.value.splice(index, 1)
  formData.value.covered = null
}

const getUrl4 = (e) => {
  imgList4.value.push(e)
  seriesFormData.value.thumbnail = e
  ElMessage({
    type: 'success',
    message: '上传成功!',
  })
}

const handleRemove4 = (index) => {
  imgList4.value.splice(index, 1)
  seriesFormData.value.thumbnail = null
}

const getUrl5 = (e) => {
  imgList5.value.push(e)
  seriesFormData.value.buttonIcon = e
  ElMessage({
    type: 'success',
    message: '上传成功!',
  })
}

const handleRemove5 = (index) => {
  imgList5.value.splice(index, 1)
  seriesFormData.value.buttonIcon = null
}

const handleClose = (index) => {
  formData.value.dynamicTags.splice(index, 1)
  formData.value.tags = formData.value.dynamicTags
    .map((item) => item.tag)
    .join(',')
}
const handleTagClick = (index) => {
  formData.value.dynamicTagsIndex = index
}

const handleClose2 = (index) => {
  seriesFormData.value.dynamicTags.splice(index, 1)
}

const handleTagClick2 = (index) => {
  seriesFormData.value.dynamicTagsIndex = index
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    saveTagInput.value.focus() // 聚焦输入元素
  })
}
const handleInputConfirm = () => {
  let inputValue = inputValue.value
  if (inputValue) {
    let item = {
      tag: inputValue,
      bgColor: '#1B2A3EFF',
      typefaceColor: '#647994FF',
    }
    formData.value.dynamicTags.push(item)
  }
  inputVisible.value = false
  inputValue.value = ''
  formData.value.tags = formData.value.dynamicTags
    .map((item) => item.tag)
    .join(',')
}

const showInput2 = () => {
  inputVisible2.value = true
  nextTick(() => {
    saveTagInput2.value.focus() // 聚焦输入元素
  })
}

const handleInputConfirm2 = () => {
  let inputValue = inputValue2.value
  if (inputValue) {
    let item = {
      tag: inputValue,
      bgColor: '#1B2A3EFF',
      typefaceColor: '#647994FF',
    }
    seriesFormData.value.dynamicTags.push(item)
  }
  inputVisible2.value = false
  inputValue2.value = ''
}

const changeRarityLevel = () => {
  if (
    !formData.value.dynamicTags.length ||
    formData.value.dynamicTags.length === 0
  ) {
    let item = {
      tag: '级别：' + formData.value.rarityLevel,
      bgColor: '#1B2A3EFF',
      typefaceColor: '#647994FF',
    }
    formData.value.dynamicTags.push(item)
  } else if (
    formData.value.dynamicTags.length >= 1 &&
    formData.value.dynamicTags[0].tag.startsWith('级别')
  ) {
    formData.value.dynamicTags[0] = {
      tag: '级别：' + formData.value.rarityLevel,
      bgColor: formData.value.dynamicTags[0].bgColor,
      typefaceColor: formData.value.dynamicTags[0].typefaceColor,
    }
  } else {
    let item = {
      tag: '级别：' + formData.value.rarityLevel,
      bgColor: '#1B2A3EFF',
      typefaceColor: '#647994FF',
    }
    formData.value.dynamicTags.unshift(item)
  }
  formData.value.tags = formData.value.dynamicTags
    .map((item) => item.tag)
    .join(',')
}

const handleDateChange = () => {
  // 在选择时间范围时触发的 change 事件
  formData.value.startTime = formData.value.exchangeTime[0]
  formData.value.endTime = formData.value.exchangeTime[1]
  // 强制更新组件
  // this.$forceUpdate()
}

const handleColorChange = (color) => {
  // 假设color是一个对象，包含RGB值
  formData.value.dynamicTags[formData.value.dynamicTagsIndex].bgColor =
    rgbStringToHex(color).toUpperCase()
}

const rgbStringToHex = (rgbString) => {
  alert(rgbString)
  const rgbValues = rgbString.match(/\d+/g).map(Number)
  return (
    '#' +
    rgbValues
      .map((x) => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
      })
      .join('')
  )
}
</script>

<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
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
  width: 180px;
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
