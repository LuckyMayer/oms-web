<template>
    <div class="content-wrapper">
        <!-- Content Header -->
        <section class="content-header">
            <h1>欢迎进入OMS管理系统</h1>
        </section>

        <!-- Main content -->
        <section class="content">
            <div class="row">
            
            </div>
        </section>
  </div>
</template>

<script>
import initStyle from '../common/initStyle'

export default {
    mounted () {
        this.$nextTick(() => {
            initStyle();
        });
    },
    data () {
        return {
            
        }
    }
}
</script>