<template>
  <div class="operationPanel-delivery" style="display: none">
    <!--  搜索框  -->
    <a-input-search
      v-model:value="searchValue"
      placeholder="请输入您要出库的商品名称"
      :style="{ width: '100%' }"
      @search="onSearch"
    />
    <!--  搜索出的商品列表  -->
    <div class="operationPanel-delivery-list" v-if="deliveryList?.length > 0">
      <a-card
        :class="[
          'operationPanel-delivery-item',
          selectedDeliveryIdList.indexOf(item.id) !== -1 ? 'active' : '',
        ]"
        size="small"
        :title="`商品名称：${item.name}`"
        :style="{ width: '100%', marginBottom: '5px' }"
        v-for="item in deliveryList"
        :key="item.id"
        @click="onSelectDelivery(item.id)"
      >
        <p>ID：{{ item.id }}</p>
        <p>重量：{{ item.weight }}</p>
        <p>保质期：{{ item.shelflife }}</p>
        <p>货架ID：{{ item.shelf_id }}</p>
        <p>货架格子ID：{{ item.shelf_grid_id }}</p>
        <p>
          生产日期：{{ new Date(item.production_date * 1000).toLocaleString() }}
        </p>
        <p>
          入库时间：{{ new Date(item.storage_time * 1000).toLocaleString() }}
        </p>
      </a-card>
    </div>
    <!--  商品出库按钮  -->
    <a-button
      type="danger"
      :style="{ marginTop: '8px' }"
      v-if="deliveryList?.length > 0"
      @click="removeGoods"
    >
      商品出库
    </a-button>
  </div>
</template>

<script>
import { ref } from "vue";
import { searchDeliveryNameApi } from "@/api/goods";
import { message } from "ant-design-vue";
import { useStore } from "vuex";
export default {
  name: "operationPanelDelivery",
  props: {
    storeId: {
      type: Number,
      default: null,
    },
  },
  setup(props) {
    const store = useStore();
    // 搜索关键字
    const searchValue = ref("");
    // 搜索出的商品列表(商品出库)
    const deliveryList = ref([]);
    // 当前被选中的商品
    const selectedDeliveryIdList = ref([]);
    // 点击搜索或按下回车键时的回调
    const onSearch = () => {
      // 根据商品名称搜索商品列表
      searchDeliveryNameApi({
        store_id: props.storeId,
        name: searchValue.value,
      }).then((data) => {
        if (data.status === 200) {
          // 存储商品列表(商品出库)
          deliveryList.value = data.data;
          // 提示信息
          message.success(data.message);
          // 清空搜索输入框
          searchValue.value = "";
        }
        if (data.status === 400) {
          // 提示信息
          message.warning(data.message);
          // 清空搜索输入框
          searchValue.value = "";
        }
      });
    };
    // 点击移除商品按钮 移除商品
    const removeGoods = () => {
      store
        .dispatch("goods/removeGoods", {
          storeId: props.storeId,
          ids: selectedDeliveryIdList.value,
        })
        .then((res) => {
          if (res.status === 200) {
            // 删除搜索结果中移除的商品
            deliveryList.value = deliveryList.value.filter(
              (item) => !res.data.find((goods) => goods.goods_id === item.id)
            );
          }
        });
      // 清空选中的商品
      selectedDeliveryIdList.value = [];
    };

    // 选中商品
    const onSelectDelivery = (id) => {
      if (selectedDeliveryIdList.value.indexOf(id) === -1) {
        selectedDeliveryIdList.value.push(id);
      } else {
        selectedDeliveryIdList.value.splice(
          selectedDeliveryIdList.value.indexOf(id),
          1
        );
      }
    };

    return {
      searchValue,
      onSearch,
      deliveryList,
      selectedDeliveryIdList,
      removeGoods,
      onSelectDelivery,
    };
  },
};
</script>

<style scoped lang="less">
.operationPanel-delivery {
  height: 100%;
  .operationPanel-delivery-list {
    text-align: left;
    height: calc(100% - 32px - 32px - 30px);
    overflow-y: auto;
    margin-top: 5px;
    p {
      margin-bottom: 8px;
    }
    .operationPanel-delivery-item {
      opacity: 0.7;
      &:hover,
      &.active {
        opacity: 1;
      }
    }
  }
}
</style>
