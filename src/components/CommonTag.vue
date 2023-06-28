<template>
  <div class="tags">
    <el-tag
      v-for="(item, index) in tags"
      :key="item.label"
      :closable="item.name !== 'home'"
      :effect="$route.name === item.name ? 'dark' : 'plain'"
      @click="changeMenu(item)"
      @close="closeTag(item, index)"
      size="small"
    >
      {{ item.label }}
    </el-tag>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "CommonTag",
  data() {
    return {};
  },
  computed: {
    ...mapState({
      tags: (state) => state.tab.tabsList,
    }),
  },
  methods: {
    // 点击tag标签,切换路由
    changeMenu(item) {
      this.$router.push(
        {
          path: item.path,
        },
        () => {},
        () => {}
      );
    },
    // 删除tag标签
    closeTag(item, index) {
      // 调用store中mutations中的closeTag方法
      this.$store.commit("closeTag", item);
      const length = this.tags.length;
      // 删除后的跳转逻辑
      if (item.name != this.$route.name) {
        return;
      }
      //   删除的是最后一项
      if (index == length) {
        this.$router.push(
          {
            path: this.tags[index - 1].path,
          },
          () => {},
          () => {}
        );
      } else {
        this.$router.push(
          {
            path: this.tags[index].path,
          },
          () => {},
          () => {}
        );
      }
    },
  },
  mounted() {
    // console.log(this.$route,'@@@');
  },
};
</script>

<style lang="less" scoped>
.tags {
  padding: 15px 15px 0 15px;
  .el-tag {
    margin-right: 15px;
    cursor: pointer;
  }
}
</style>
