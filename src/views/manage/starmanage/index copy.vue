<template>
  <div class="starmanage">
  <div>
    星球背景：
    <el-upload
      action="#"
      list-type="picture-card"
      :auto-upload="false"
    >
      <i slot="default" class="el-icon-plus"></i>
      <div slot="file" slot-scope="{ file }">
        <img
          class="el-upload-list__item-thumbnail"
          :src="file.url"
          alt=""
        />
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <i class="el-icon-zoom-in"></i>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleDownload(file)"
          >
            <i class="el-icon-download"></i>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>
  </div>
  <div class="middle">
    <div>
      星球头像：
      <el-upload
        action="#"
        list-type="picture-card"
        :auto-upload="false"
      >
        <i slot="default" class="el-icon-plus"></i>
        <div slot="file" slot-scope="{ file }">
          <img
            class="el-upload-list__item-thumbnail"
            :src="file.url"
            alt=""
          />
          <span class="el-upload-list__item-actions">
            <span
              class="el-upload-list__item-preview"
              @click="handlePictureCardPreview(file)"
            >
              <i class="el-icon-zoom-in"></i>
            </span>
            <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="handleDownload(file)"
            >
              <i class="el-icon-download"></i>
            </span>
            <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="handleRemove(file)"
            >
              <i class="el-icon-delete"></i>
            </span>
          </span>
        </div>
      </el-upload>
    </div>
    <div style="margin-top: 30px">
      矿石图片：
      <el-upload
        action="#"
        list-type="picture-card"
        :auto-upload="false"
      >
        <i slot="default" class="el-icon-plus"></i>
        <div slot="file" slot-scope="{ file }">
          <img
            class="el-upload-list__item-thumbnail"
            :src="file.url"
            alt=""
          />
          <span class="el-upload-list__item-actions">
            <span
              class="el-upload-list__item-preview"
              @click="handlePictureCardPreview(file)"
            >
              <i class="el-icon-zoom-in"></i>
            </span>
            <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="handleDownload(file)"
            >
              <i class="el-icon-download"></i>
            </span>
            <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="handleRemove(file)"
            >
              <i class="el-icon-delete"></i>
            </span>
          </span>
        </div>
      </el-upload>
    </div>
  </div>
  <div style="margin-left: 50px">
    <!-- <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="星球昵称：" prop="nickname">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="星球故事：" prop="Starstory">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >立即创建</el-button
        >
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form> -->
    <el-form>
    </el-form>
  </div>
</div>

</template>

<script>
import { reqStarList } from "@/api/manage";
export default {
  data() {
    return {
      activeName: "first",
      starList: [],
      rules: {
        nickname: [
          { required: true, message: "请输入星球昵称", trigger: "blur" },
          { max: 16, message: "昵称上限为16个字符", trigger: "blur" },
        ],
      },
      //分页的页码数据
      page: 1,
      limit: 7,
      totalElements: 0, //总页数
      jumpPage: null,
      isStarShow: false,
    };
  },
  mounted() {
    this.getStarList();
  },
  methods: {
    // 展示星球列表
    async getStarList() {
      try {
        const result = await reqStarList();
        console.log("打印的结果", result);
        this.starList = result.data.data;
      } catch (e) {}
    },
    // 星球背景上传
    handleRemove(file) {
      console.log(file);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
    },
    handleDownload(file) {
      console.log(file);
    },

    // 页码改变执行的函数

    handleCurrentChange(e) {
      this.page = e;
      this.getStarList();
    },
    //显示条数执行的函数
    handleSizeChange(e) {
      // console.log("e", e);
      this.limit = e;
      this.getStarList();
    },
    // 跳转页面
    changejump() {
      // console.log("执行了");
      this.page = +this.jumpPage;
      this.getStarList();
      this.jumpPage = null;
    },
    // 跳转到创建星球页面
    jumpToStar() {
      this.$router.push("/manage/star");
    },
    // 取消创建跳转到管理星球页面
    jumpToManage() {
      this.$router.push("/manage");
      this.isStarShow = false;
    },
  },
};
</script>

<style scoped>
.starItem {
  display: flex;
  margin-left: 20px;

  margin-bottom: 30px;
  border: 1px rgb(0, 149, 255) solid;

}
.starItem .right {
  display: flex;
  flex-direction: column;
  margin-left: 20px;
}
.starItem .right .top {
  display: flex;
  justify-content: space-between;
}

.starmanage {
  display: flex;
}

.starmanage .middle {
  display: flex;
  flex-direction: column;
  margin-left: 50px;
}

.stone .el-input {
  width: 60px;
  margin-right: 10px;
  margin-left: 10px;
}

.el-pagination {
  position: relative;
}
.el-pagination .pageUnit {
  position: absolute;
  position: absolute;
  bottom: 7px;
  right: -13px;
}
.el-pagination /deep/ .el-pager li {
  border: 1px solid #ccc;
  margin: 0px 3px;
}

.el-pagination /deep/ .one .el-input__inner {
  width: 48px;
  height: 30px;
}
::v-deep .el-textarea__inner {
  resize: none;
}
</style>




<div class="starmanage">
  <div>
    星球背景：
    <el-upload
      action="#"
      list-type="picture-card"
      :auto-upload="false"
    >
      <i slot="default" class="el-icon-plus"></i>
      <div slot="file" slot-scope="{ file }">
        <img
          class="el-upload-list__item-thumbnail"
          :src="file.url"
          alt=""
        />
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <i class="el-icon-zoom-in"></i>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleDownload(file)"
          >
            <i class="el-icon-download"></i>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>
  </div>
  <div class="middle">
    <div>
      星球头像：
      <el-upload
        action="#"
        list-type="picture-card"
        :auto-upload="false"
      >
        <i slot="default" class="el-icon-plus"></i>
        <div slot="file" slot-scope="{ file }">
          <img
            class="el-upload-list__item-thumbnail"
            :src="file.url"
            alt=""
          />
          <span class="el-upload-list__item-actions">
            <span
              class="el-upload-list__item-preview"
              @click="handlePictureCardPreview(file)"
            >
              <i class="el-icon-zoom-in"></i>
            </span>
            <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="handleDownload(file)"
            >
              <i class="el-icon-download"></i>
            </span>
            <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="handleRemove(file)"
            >
              <i class="el-icon-delete"></i>
            </span>
          </span>
        </div>
      </el-upload>
    </div>
    <div style="margin-top: 30px">
      矿石图片：
      <el-upload
        action="#"
        list-type="picture-card"
        :auto-upload="false"
      >
        <i slot="default" class="el-icon-plus"></i>
        <div slot="file" slot-scope="{ file }">
          <img
            class="el-upload-list__item-thumbnail"
            :src="file.url"
            alt=""
          />
          <span class="el-upload-list__item-actions">
            <span
              class="el-upload-list__item-preview"
              @click="handlePictureCardPreview(file)"
            >
              <i class="el-icon-zoom-in"></i>
            </span>
            <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="handleDownload(file)"
            >
              <i class="el-icon-download"></i>
            </span>
            <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="handleRemove(file)"
            >
              <i class="el-icon-delete"></i>
            </span>
          </span>
        </div>
      </el-upload>
    </div>
  </div>
  <div style="margin-left: 50px">
    <!-- <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="星球昵称：" prop="nickname">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="星球故事：" prop="Starstory">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >立即创建</el-button
        >
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form> -->
    <el-form>
      <el-form-item label="星球昵称：" prop="nickname">
        <el-input></el-input>
      </el-form-item>
      <el-form-item label="星球故事：" prop="Starstory">
        <el-input type="textarea"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">提交修改申请</el-button>

        <el-button @click="jumpToManage">取消修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</div>
