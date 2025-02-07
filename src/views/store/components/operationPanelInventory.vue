<template>
  <div class="operationPanel-inventory" style="display: block">
    <div class="operationPanel-overview">
      <h3>货物总览</h3>
      <a-row class="operationPanel-overview-content">
        <a-col :span="12" class="operationPanel-overview-usage">
          <a-progress
            type="circle"
            strokeColor="#f33"
            trailColor="#18e"
            :percent="
              (shelfTotal?.useGrid /
                (shelfTotal?.useGrid + shelfTotal?.emptyGrid)) *
              100
            "
            :width="100"
            :showInfo="false"
            class="operationPanel-overview-usage-progress"
          />
          <div class="operationPanel-overview-usage-inside">
            <span>使用率</span>
            <span class="number">
              {{
                (
                  (shelfTotal?.useGrid /
                    (shelfTotal?.useGrid + shelfTotal?.emptyGrid)) *
                  100
                ).toFixed(2)
              }}%
            </span>
          </div>
        </a-col>
        <a-col :span="12" class="operationPanel-overview-overview">
          <div>
            <a-tag color="#f33">已用：{{ shelfTotal?.useGrid }}</a-tag>
            <a-tag color="#18e">空闲：{{ shelfTotal?.emptyGrid }}</a-tag>
          </div>
        </a-col>
      </a-row>
    </div>
    <div class="operationPanel-logistics">
      <h3>智能调度</h3>
      <a-row>
        <a-col :span="24">
          <a-cascader
            v-model:value="oldShelfOptionsValue"
            :options="useShelfOptions"
            :display-render="oldDisplayRender"
            expand-trigger="hover"
            placeholder="请选择原货物"
          />
        </a-col>
        <a-col :span="20" :offset="2">
          <span class="operationPanel-logistics-down" @click="moveGoods">
            <ArrowDownOutlined /> 确认移动 <ArrowDownOutlined />
          </span>
        </a-col>
        <a-col :span="24">
          <a-cascader
            v-model:value="newShelfOptionsValue"
            :options="emptyShelfOptions"
            :display-render="newDisplayRender"
            expand-trigger="hover"
            placeholder="请选择新货物位置"
          />
        </a-col>
      </a-row>
    </div>
    <div class="operationPanel-replenishment">
      <h3>补货信息</h3>
      <a-row class="operationPanel-replenishment-content">
        <a-col :span="7" class="operationPanel-replenishment-item"></a-col>
        <a-col
          :span="7"
          :offset="1"
          class="operationPanel-replenishment-item"
        ></a-col>
        <a-col
          :span="7"
          :offset="1"
          class="operationPanel-replenishment-item"
        ></a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import { ArrowDownOutlined } from "@ant-design/icons-vue";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";

export default {
  name: "operationPanelInventory",
  components: {
    ArrowDownOutlined,
  },
  props: {
    storeId: {
      type: Number,
      default: null,
    },
  },
  setup() {
    // 获取路由
    const route = useRoute();

    const store = useStore();
    // 货架统计数据
    const shelfTotal = computed(() => store.state.shelf.shelfTotal);

    // 货物移动表单字段
    const goodsFormState = ref({
      // 商品ID
      goods_id: "",
      // 新仓库ID
      store_id: route.query.id,
      // 新货架ID
      shelf_id: "",
      // 新货架格子ID
      shelf_grid_id: "",
    });

    // 未使用货架信息
    const emptyShelfOptions = computed(
      () => store.getters["shelf/getEmptyShelfGridList"]
    );
    // 已使用货架信息
    const useShelfOptions = computed(
      () => store.getters["shelf/getUseShelfGridList"]
    );

    // 选中的原货架
    const oldShelfOptionsValue = ref(null);

    // 选中原货架位置后的回调事件
    const oldDisplayRender = ({ labels, selectedOptions }) => {
      if (selectedOptions.length > 0) {
        goodsFormState.value.goods_id = selectedOptions[1].goods_id;
      }
      return labels.join(" / ");
    };

    // 选中的新货架
    const newShelfOptionsValue = ref(null);

    // 选中新货架位置后的回调事件
    const newDisplayRender = ({ labels, selectedOptions }) => {
      if (selectedOptions.length > 0) {
        goodsFormState.value.shelf_id = selectedOptions[0].value;
        goodsFormState.value.shelf_grid_id = selectedOptions[1].value;
      }
      return labels.join(" / ");
    };

    // 移动货物
    const moveGoods = () => {
      store.dispatch("goods/moveGoods", {
        goodsId: goodsFormState.value.goods_id,
        storeId: goodsFormState.value.store_id,
        shelfId: goodsFormState.value.shelf_id,
        shelfGridId: goodsFormState.value.shelf_grid_id,
      });

      // 清空表单
      oldShelfOptionsValue.value = null;
      newShelfOptionsValue.value = null;
    };

    return {
      shelfTotal,
      goodsFormState,
      emptyShelfOptions,
      useShelfOptions,
      oldShelfOptionsValue,
      oldDisplayRender,
      newShelfOptionsValue,
      newDisplayRender,
      moveGoods,
    };
  },
};
</script>

<style scoped lang="less">
:deep(.ant-input),
:deep(.ant-cascader-picker) {
  // 设置 input 的圆角
  border-radius: 15px;
  &:focus {
    // 设置 input 的蓝色边框的圆角
    border-radius: 15px;
    .ant-cascader-input {
      // 设置 input 的蓝色边框的圆角
      border-radius: 15px;
    }
  }
}
.operationPanel-inventory {
  .operationPanel-overview,
  .operationPanel-logistics,
  .operationPanel-replenishment {
    h3 {
      text-align: left;
      font-weight: 700;
      font-size: 15px;
    }
  }
  .operationPanel-overview {
    .operationPanel-overview-content {
      height: 120px;
      .operationPanel-overview-overview {
        > div {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        span {
          display: block;
          width: 100%;
          color: white;
          font-size: 16px;
          padding-top: 4px;
          padding-bottom: 4px;
          margin-top: 20px;
          &:nth-child(1) {
            margin-top: 0;
          }
        }
      }
      .operationPanel-overview-usage {
        position: relative;
        .operationPanel-overview-usage-progress {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        .operationPanel-overview-usage-inside {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          height: 70px;
          width: 70px;
          border-radius: 50%;
          background-color: #ffffffac;
          padding-top: 10px;

          span {
            width: 100%;
            display: block;
            font-size: 14px;
            &.number {
              font-size: 18px;
              font-weight: bold;
            }
          }
        }
      }
    }
  }
  .operationPanel-logistics {
    .operationPanel-logistics-down {
      display: block;
      height: 30px;
      line-height: 30px;
      background-color: #ffffffac;
      border-radius: 15px;
      margin-top: 10px;
      margin-bottom: 10px;
      // 鼠标形状设置为手指
      cursor: Pointer;
    }
  }
  .operationPanel-replenishment {
    .operationPanel-replenishment-content {
      height: 140px;
      .operationPanel-replenishment-item {
        height: 120px;
        background-color: #ffffff54;
        border-radius: 10px;
      }
    }
  }
}
</style>
