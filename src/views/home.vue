<!-- 首页 -->
<template>
  <div>
    <!-- 顶部导航 -->
    <nav-header></nav-header>

    <!-- 面包屑 -->
    <nav-bread> </nav-bread>

    <!-- 主要内容 -->
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <!-- 轮播图 -->
        <el-carousel :interval="5000">
          <el-carousel-item
            v-for="item in carouselItems"
            :key="item.productImage"
          >
            <img :src="' http://localhost:3000/static/' + item.productImage" />
          </el-carousel-item>
        </el-carousel>

        <div class="thingList">商品列表</div>
        <!-- 商品列表 -->
        <div class="accessory-list-wrap">
          <div class="accessory-list col-4">
            <ul>
              <li v-for="(item, index) in goodsList" :key="index">
                <div class="pic">
                  <a @click="toGoods"
                    ><img :src="'http://localhost:3000/static/' + item.productImage" alt=""
                  /></a>
                </div>
                <div class="main">
                  <div class="name">{{ item.productName }}</div>
                  <div class="price">{{ item.salePrice | currency("￥") }}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div class="accessory-result">
          <div class="accessory-list-wrap">
            <!-- 滚动插件 -->
            <div
              class="view-more-normal"
              v-infinite-scroll="loadMore"
              infinite-scroll-disabled="busy"
              infinite-scroll-distance="20"
            >
              <img
                src="./../assets/loading-spinning-bubbles.svg"
                v-show="loading"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 模态框 -->
    <modal v-bind:mdShow="mdShow" v-on:close="closeModal">
      <p slot="message">请先登录,否则无法加入到购物车中!</p>
      <div slot="btnGroup">
        <a class="btn btn--m" href="javascript:;" @click="mdShow = false"
          >关闭</a
        >
      </div>
    </modal>

    <!-- 模态框 -->
    <modal v-bind:mdShow="mdShowCart" v-on:close="closeModal">
      <p slot="message">
        <svg class="icon-status-ok">
          <use
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xlink:href="#icon-status-ok"
          ></use>
        </svg>
        <span>加入购物车成功</span>
      </p>
      <div slot="btnGroup">
        <a class="btn btn--m" href="javascript:;" @click="mdShowCart = false"
          >继续购物</a
        >
        <router-link class="btn btn--m btn--red" href="javascript:;" to="/cart"
          >查看购物车</router-link
        >
      </div>
    </modal>

    <!-- 尾部说明 -->
    <nav-footer></nav-footer>
  </div>
</template>

<script>
import NavHeader from "./../components/NavHeader";
import NavFooter from "./../components/NavFooter";
import NavBread from "./../components/NavBread";
import Modal from "./../components/Modal";
import axios from "axios";
import { mapState } from "vuex";

export default {
  data() {
    return {
      // 轮播图
      carouselItems: [],
      // 商品信息
      goodsList: [],
      // 排序方式
      sortFlag: true,
      // 分页
      page: 1,
      pageSize: 8,
      busy: true,
      loading: false,
      mdShow: false,
      mdShowCart: false,
      // 当前选中哪个价格过滤区间
      priceChecked: "all",
      // 按价格排序遮罩层
      overLayFlag: false,
    };
  },
  mounted() {
    this.checkLogin();
    this.getCartCount();
    this.getcarousel();
    this.getGoodsList();
  },
  components: {
    NavHeader,
    NavFooter,
    NavBread,
    Modal,
  },
  computed: mapState(["nickName"]),
  methods: {
    checkLogin() {
      axios.get("users/checkLogin").then((res) => {
        var res = res.data;
        if (res.status == "0") {
          this.$store.commit("updateUserInfo", res.result);
        } else {
          if (this.$route.path != "/") {
            this.$router.push("/");
          }
        }
      });
    },
    getCartCount() {
      axios.get("users/getCartCount").then((res) => {
        var res = res.data;
        if (res.status == "0") {
          this.$store.commit("updateCartCount", res.result);
        }
      });
    },
    // 获取轮播图数据
    getcarousel() {
      axios
        .get("/home/carousel")
        .then((result) => {
          this.carouselItems = result.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 获取商品信息
    getGoodsList(flag) {
      var param = {
        page: this.page,
        pageSize: this.pageSize,
        sort: this.sortFlag ? 1 : -1,
        priceLevel: this.priceChecked,
      };

      this.loading = true;

      axios
        .get("/goods/list", {
          params: param,
        })
        .then((response) => {
          var res = response.data;
          this.loading = false;
          if (res.status == "0") {
            if (flag) {
              this.goodsList = this.goodsList.concat(res.result.list);

              if (res.result.count == 0) {
                this.busy = true;
              } else {
                this.busy = false;
              }
            } else {
              this.goodsList = res.result.list;
              this.busy = false;
            }
          } else {
            this.goodsList = [];
          }
        });
    },
    // 未登陆跳转限制
    toGoods() {
      if (!this.nickName) {
        return this.$message({
          type: "error",
          message: `请登陆后查看其他页面`,
        });
      }
      this.$router.push("/goods");
    },
    // 下滑加载
    loadMore() {
      this.busy = true;
      setTimeout(() => {
        this.page++;
        this.getGoodsList(true);
      }, 500);
    },
    // 关闭遮罩层
    closeModal() {
      this.mdShow = false;
      this.mdShowCart = false;
    },
  },
};
</script>

<style>
.el-carousel__container {
  position: relative;
  margin: 0 auto;
  height: 500px;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.thingList {
  font-family: "moderat", sans-serif;
  font-size: 24px;
  font-weight: bold;
  margin: 20px 0;
}
</style>