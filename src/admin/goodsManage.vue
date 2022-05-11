<template>
  <div>
    <div style="position: relative; width: 200px; height: 120px">
      <el-button
        type="primary"
        size="default"
        @click="dialogFormVisible = addGoods = true"
      >
        新增商品
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
      <el-table-column
        align="center"
        prop="salePrice"
        label="价格(元)"
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
    <!-- 新增商品 -->
    <el-dialog :title="confirmCarousel" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item label="名称" label-width="100px" required>
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="价格(元)" label-width="100px" required>
          <el-input v-model="form.salePrice"></el-input>
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
  name: "goodsManage",
  data() {
    return {
      carouselData: [],
      form: {},
      dialogFormVisible: false,
      addGoods: false,
      // id用来判断是需要新增商品还是编辑商品
      id: null,
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        salePrice: [{ required: true, message: "请输入名称", trigger: "blur" }],
      },
    };
  },
  computed: {
    confirmCarousel() {
      return this.addGoods == true ? "新增商品" : "编辑商品";
    },
  },
  methods: {
    async getGoods() {
      const res = await axios.get("/goods/goods");
      this.carouselData = res.data;
      // this.pageNum = this.carouselData.length;
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
      this.$set(this.form, "salePrice", ele.salePrice);
      this.dialogFormVisible = true;
      this.addGoods = false;
      this.id = ele._id;
    },
    // 操作商品，新增或者是编辑
    operateCarousel(formName) {
      this.dialogFormVisible = true;
      this.$refs[formName].validate(async (valid) => {
        let res;
        if (valid) {
          if (!this.id) {
            res = await axios.post("/goods/addGoods", {
              form: this.form,
            });
          } else {
            res = await axios.post("/goods/updateGoods", {
              form: this.form,
              id: this.id,
            });
            this.id = null;
          }
          this.form = {};
          this.dialogFormVisible = false;
          this.getGoods();
        } else {
          this.$message.error("请输入商品名称和价格并且上传图片");
          return false;
        }
      });
    },
    // 删除商品
    async deleteClick(ele) {
      const res = await axios.post("/goods/deleteGoods", {
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
      this.getGoods();
    },
    cancel() {
      this.dialogFormVisible = false;
      this.form = {};
    },
  },
  mounted() {
    this.getGoods(1);
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
  width: 150px;
  height: 178px;
  display: block;
}
.image {
  width: 150px !important;
  height: 100px !important;
}
</style>