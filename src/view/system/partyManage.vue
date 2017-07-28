<template>
  <div class="content-wrapper">
    <section class="content-header clearfix">
      <ol class="breadcrumb col-md-6">
        <li><a href="#"><i class="fa fa-desktop"></i>系统</a></li>
        <li class="active">业务组管理</li>
      </ol>
      <div class="col-md-6" style="text-align: right; position: relative; top: 10px;">
        <button class="btn btn-sm btn-primary" @click="addFun">
          <i class="fa fa-plus"></i>新建业务组
        </button>
      </div>
    </section>
    <!-- Main content -->
    <section class="content content_yjlu">
      <div class="row form-horizontal searchContent bgFFF">
        <nav-tab :data="navTabList"></nav-tab>
      </div>
      <router-view></router-view>
    </section>
  </div>
</template>

<script>
import initStyle from '../../common/initStyle'
import navTab from '../../component/navTab'
export default {
  components: {
    navTab,
  },
  data () {
    return {
      navTabList: [{
        name: '业务组',
        routerName: 'partyList'
      }
      // }, {
      //   name: '分类',
      //   routerName: 'partySort'
      // }
      ]
    }
  },
  mounted () {
    this.$nextTick(() => {
      initStyle();
    });
  },
  methods: {
    
  }
}
</script>