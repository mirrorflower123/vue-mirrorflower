<template>
  <div>
    <div>{{ title }}</div>
    <div>
      <!-- 上方查询表单 -->
      <el-form :inline="true">
        <el-form-item><el-input v-model="queryInfo.goodsName" placeholder="商品名称"></el-input></el-form-item>
        <el-form-item><el-input v-model="queryInfo.tid" placeholder="分类"></el-input></el-form-item>
        <el-form-item><el-input v-model="queryInfo.max" placeholder="售价上限"></el-input></el-form-item>
        <el-form-item><el-input v-model="queryInfo.min" placeholder="售价下限"></el-input></el-form-item>
        <el-form-item><el-button type="primary" @click="query">查询</el-button></el-form-item>
        <el-form-item><el-button type="primary" @click="showadd">添加</el-button></el-form-item>
      </el-form>
    </div>

    <!-- 数据呈现 -->
    <div v-loading="loading">
      <el-table :data="glist">
        <el-table-column label="编号" prop="gid"></el-table-column>
        <el-table-column label="商品分类" prop="tid"></el-table-column>
        <el-table-column label="商品名称" prop="goodsName"></el-table-column>
        <el-table-column label="商品描述" prop="goodsInfo"></el-table-column>
        <el-table-column label="销售价格" prop="salePrice"></el-table-column>
        <el-table-column label="进价" prop="purchasePrice"></el-table-column>
        <el-table-column label="库存数量" prop="amount"></el-table-column>
        <el-table-column label="信息最后修改时间">
          <template slot-scope="s">{{ s.row.lastupdate | formatDate }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="c"><el-button @click="modify(c.row)" type="primary" size="small">修改</el-button><el-button @click="imodify(c.row)" type="danger" size="small">进货</el-button></template>
        </el-table-column>
      </el-table>
      <el-pagination background :total="page.total" :current-page.sync="page.pageNumber" :page-size.sync="page.pageSize" @current-change="query" layout="prev,pager,next,total,jumper,sizes" :page-sizes="[5, 10, 20]" @size-change="query"></el-pagination>
    </div>

    <!-- 添加对话框 -->
    <div>
      <el-dialog title="添加信息" :visible.sync="addvisible" :close-on-click-modal="false" @closed="query">
        <div v-loading="loading">
          <el-form>
            <el-form-item>
              <el-input v-model="addInfo.goodsName" placeholder="商品名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="addInfo.goodsInfo" placeholder="商品描述"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="addInfo.purchasePrice" placeholder="进价"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="addInfo.salePrice" placeholder="售价"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="addInfo.tid" placeholder="分类编号"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" v-loading="loading">
          <el-button type="primary" @click="add">保存</el-button>
          <el-button type="danger" @click="addvisible = false">关闭</el-button>
        </div>
      </el-dialog>
    </div>

    <!-- 修改对话框 -->
    <div>
      <el-dialog title="修改信息" :visible.sync="modbisible" :close-on-click-modal="false" @closed="query">
        <div v-loading="loading">
          <el-form>
            <el-form-item>
              <el-input v-model="modInfo.gid" placeholder="商品编号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="modInfo.goodsName" placeholder="商品名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="modInfo.goodsInfo" placeholder="商品描述"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="modInfo.purchasePrice" placeholder="进价"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="modInfo.salePrice" placeholder="售价"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="modInfo.tid" placeholder="分类编号"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" v-loading="loading">
          <el-button type="primary" @click="showmodify">保存</el-button>
          <el-button type="danger" @click="modbisible = false">关闭</el-button>
        </div>
      </el-dialog>
    </div>

    <!-- 进货的对话框 -->
    <div>
      <el-dialog title="进货" :visible.sync="imodbisible" :close-on-click-modal="false" @closed="query">
        <div v-loading="loading">
          <el-form>
            <el-form-item>
              <el-input v-model="imodInfo.gid" placeholder="商品编号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="imodInfo.amount" placeholder="进货数量"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" v-loading="loading">
          <el-button type="primary" @click="ishowmodify">保存</el-button>
          <el-button type="danger" @click="imodbisible = false">关闭</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import tools from '@/js/tools'
let app
export default {
  name: 'TestAjaxView',
  data() {
    return {
      title: '商品管理系统',
      loading: false,
      gid: '',
      glist: [],
      tid: '',
      tlist: '',
      page: {
        pageSize: 5,
      },
      queryInfo: {
        goodsName: '',
        tid: '',
      },
      // 添加
      addInfo: {
        goodsInfo: '',
        goodsName: '',
        purchasePrice: '',
        salePrice: '',
        tid: '',
      },
      // 修改
      modInfo: {},
      //进货
      imodInfo: {},

      //添加的visible
      addvisible: false,
      //修改的visible
      modbisible: false,
      //修改的visible
      imodbisible: false,
    }
  },
  computed: {},
  methods: {
    //查询
    query() {
      app.loading = true
      let g = tools.concatJson(app.queryInfo, app.page)
      tools.ajax('/exam/goods/queryAll', g, (data) => {
        app.loading = false
        if (data.success) {
          app.glist = data.list
          app.tlist = data.list
          app.tid = data.list[0].tid
          app.page = data.page
          return
        } else {
          app.$alert(data.message, '错误')
        }
      })
    },
    // 添加
    add() {
      app.loading = true
      tools.ajax('/exam/goods/add', app.addInfo, (data) => {
        app.loading = false
        app.$alert(data.message)
      })
    },
    showadd() {
      app.addInfo = {
        goodsInfo: '',
        goodsName: '',
        purchasePrice: '',
        salePrice: '',
        tid: '',
      }
      app.addvisible = true
    },

    // 修改
    modify(info) {
      app.modInfo = tools.concatJson(info)
      app.modbisible = true
    },
    showmodify() {
      app.loading = true
      tools.ajax('/exam/goods/update', app.modInfo, (data) => {
        app.loading = false
        app.$alert(data.message)
      })
    },

    //进货
    imodify(info) {
      app.imodInfo = tools.concatJson(info)
      app.imodbisible = true
    },
    ishowmodify() {
      app.loading = true
      tools.ajax('/exam/goods/addAmount', app.imodInfo, (data) => {
        app.loading = false
        app.$alert(data.message)
      })
    },

    //删除
    // del(info) {
    //   app
    //     .$alert('是否删除：' + info.goodsName, '删除', {
    //       type: 'warnig',
    //     })
    //     .then(() => {
    //       tools.ajax()
    //     })
    // },
  },
  created() {
    app = this
    console.log(app.title)
    app.query()
  },
}
</script>
