<template>
  <div>
    <el-container style="height: 100vh">
      <el-header
        ><a @click="Confirm" style="float: right">管理员登出</a></el-header
      >
      <el-container>
        <el-aside width="200px"
          ><el-menu router>
            <el-menu-item index="/index/carouselManage">轮播图管理</el-menu-item>
            <el-menu-item index="/index/goodsManage">商品管理</el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  name: "index",
  data() {
    return {};
  },
  methods: {
    Confirm() {
      this.$confirm("确定退出管理员系统并且返回到前台？")
        .then((_) => {
          this.$router.push("/");
        })
        .catch((_) => {});
    },
  },
};
</script>

<style>
.navbar-right-container {
  display: none;
  justify-content: flex-start;
  align-items: center;
}
.navbar-menu-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-top: 10px;
}

.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>