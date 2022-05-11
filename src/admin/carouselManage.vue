<template>
  <div>
    <div style="position: relative; width: 200px; height: 120px">
      <el-button
        type="primary"
        size="default"
        @click="dialogFormVisible = addC = true"
      >
        新增轮播图
      </el-button>
    </div>
    <el-table :data="carouselData" border style="width: 100%; font-size: 16px">
      <el-table-column
        align="center"
        label="序号"
        type="index"
        width="150"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="productName"
        label="名称"
        width="200"
      >
      </el-table-column>
      <el-table-column align="center" label="预览">
        <template slot-scope="scope">
          <img
            v-lazy="' http://localhost:3000/static/' + scope.row.productImage"
            class="image"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="medium"
            >编辑</el-button
          >
          <el-button @click="deleteClick(scope.row)" type="text" size="medium"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增轮播图 -->
    <el-dialog :title="confirmCarousel" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item label="名称" label-width="100px" required>
          <el-input v-model="form.name" prop="name"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="img" label-width="100px">
          <el-upload
            class="avatar-uploader"
            :action="'http://localhost:3000/root/upload'"
            :show-file-list="false"
            :on-success="afterUpload"
            v-model="form.imgUrl"
          >
            <img v-if="form.imgUrl" :src="form.imgUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="operateCarousel('ruleForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "carouselManage",
  data() {
    return {
      carouselData: [],
      form: {},
      dialogFormVisible: false,
      addC: false,
      // id用来判断是需要新增轮播图还是编辑轮播图
      id: null,
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
      },
    };
  },
  computed: {
    confirmCarousel() {
      return this.addC == true ? "新增轮播图" : "编辑轮播图";
    },
  },
  methods: {
    async getcarousel() {
      const res = await axios.get("/home/carousel");
      this.carouselData = res.data;
    },
    afterUpload(res) {
      this.$set(this.form, "imgUrl", res.url);
    },
    handleClick(ele) {
      this.$set(this.form, "name", ele.productName);
      this.$set(
        this.form,
        "imgUrl",
        `http://localhost:3000/static/${ele.productImage}`
      );
      this.dialogFormVisible = true;
      this.addC = false;
      this.id = ele._id;
    },
    // 操作轮播图，新增或者是编辑
    operateCarousel(formName) {
      this.dialogFormVisible = true;
      this.$refs[formName].validate(async (valid) => {
        let res;
        if (valid) {
          if (!this.id) {
            res = await axios.post("/home/addCarousel", {
              form: this.form,
            });
          } else {
            res = await axios.post("/home/updateCarousel", {
              form: this.form,
              id: this.id,
            });
            this.id = null;
          }
          this.form = {};
          this.dialogFormVisible = false;
          this.getcarousel();
        } else {
          this.$message.error("请输入名称并且上传图片");
          return false;
        }
      });
    },
    async deleteClick(ele) {
      const res = await axios.post("/home/deleteCarousel", {
        id: ele._id,
      });
      if (res.status == 200) {
        this.$message({
          message: "删除成功",
          type: "success",
        });
      } else {
        this.$message.error("删除失败，请联系管理员处理");
      }
      this.getcarousel();
    },
    cancel() {
      this.dialogFormVisible = false;
      this.form = {};
    },
  },
  mounted() {
    this.getcarousel();
  },
};
</script>
<style>
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
  width: 320px;
  height: 178px;
  display: block;
}
.image {
  width: 200px !important;
  height: 100px !important;
}
</style>