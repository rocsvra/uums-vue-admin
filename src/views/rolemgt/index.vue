<template>
  <div class="tab-container">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane v-for="item in clients" :key="item.Id" :label="item.Name" :name="item.Id">
        <keep-alive>
          <tab-pane v-if="activeName==item.Id" :type="item.Id" @create="showCreatedTimes" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import TabPane from './components/TabPane'
import { getAllClients } from '@/api/clientmgt'

export default {
  components: { TabPane },
  data() {
    return {
      clients: [],
      activeName: '',
      createdTimes: 0
    }
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    }
  },
  created() {
    getAllClients().then(response => {
      this.clients = response
      this.activeName = response[0].Id
    })

    // init the default selected tab
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
  },
  methods: {
    showCreatedTimes() {
    //   console.log(this.activeName)
    }
  }
}
</script>

<style scoped>
  .tab-container {
    margin: 8px;
  }
</style>
