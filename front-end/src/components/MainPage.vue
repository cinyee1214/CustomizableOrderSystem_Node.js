<template>
  <div id ="app">
    <div class="headline" >
          <el-header style="padding:0;">
            <el-row>
                <el-menu :default-active="activeIndex" class="el-menu-demo;"  mode="horizontal">
                <el-row :gutter=20>
                    <el-col :span="6"  type="flex" justify="space-around">
                      <el-menu-item index="1" class="font-size-large">
                       <img src="../assets/logo.png" style="height:50px;" class="nav-logo"></img>
                      </el-menu-item>                     
                    </el-col>
                    <el-col :span="8">
                      <el-menu-item index="1">
                          <el-input
                                placeholder="请输入想查找的内容"
                                icon="search"
                                v-model="input2"
                                :on-icon-click="handleIconClick">
                          </el-input>
                          <el-button type="primary">搜索</el-button>
                      </el-menu-item>
                    </el-col>
                    <el-col :span="8">
                      <div style="display:flex; display:-webkit-flex; align-items:center;">
                          <el-submenu index="2">
                              <template slot="title"><img src="../assets/logo.png" style="height:40px;"></template>
                              <el-menu-item index="2-1">我的主页</el-menu-item>
                              <el-menu-item index="2-2">设置</el-menu-item>
                              <el-menu-item index="2-3">退出</el-menu-item>
                          </el-submenu>
                      </div>
                    </el-col>
                </el-row>
                </el-menu>
            </el-row>
        </el-header>
    </div>
    
    <div class ="card0">
      <el-row>
        <el-col :span="2">
          <el-button type="text" class="title-style el-icon-view"> 我的关注</el-button>
        </el-col>
        <el-col :span="1">
          <el-button type="text" class="el-icon-plus"> 添加关注</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <el-menu mode="vertical" default-active="1" class="el-menu-vertical-demo" >
            <el-menu-item-group title="" class="overflow-style1">
              <el-menu-item index="1">
                <i class="el-icon-star-on"></i>History order
              </el-menu-item>
              <el-menu-item index="2">
                <i class="el-icon-food"></i>Noodles and Rice
              </el-menu-item>
              <el-menu-item index="3">
                <i class="el-icon-dish-1"></i>Dish material
              </el-menu-item>
              <el-menu-item index="4">
                <i class="el-icon-chicken"></i>Meat
              </el-menu-item>
              <el-menu-item index="4">
                <i class="el-icon-dessert"></i>Dessert
              </el-menu-item>
              <el-menu-item index="5">
                <i class="el-icon-ice-drink"></i>Drink
              </el-menu-item>
            
            </el-menu-item-group>
          </el-menu>
        </el-col>
        <el-col :span="14">
          <div class ="block2">
            <el-tabs v-model="activeName2" type="border-card" text-color="black">
              <el-tab-pane label="Today's Menu" name="first" class="overflow-style">
                <div>
                  <el-card body-style="padding-top:15px;"></el-card>
                </div>
            
    
                
                
              </el-tab-pane>
              <el-tab-pane label="Today's recommendation" name="second" class="overflow-style">
                <div class="card4">
                  <el-card class="card4">
                    <el-row>
                      <el-col :span="6">
                      </el-col>
                    </el-row>
                  </el-card>
                </div>
              </el-tab-pane>

            </el-tabs>
          </div>
        </el-col>
      </el-row>
      </div>
  </div>
</template>
<script>
//import projHeadline from '../components/projHeadline.vue'
export default {
  name: 'app',
  components: {
  },
  data () {
    return {
      activeIndex2: '1',
      input: ''
    }
  },
  methods: {
    startHacking () {
      this.$notify({
        title: 'It Works',
        message: 'We have laid the groundwork for you. Now it is your time to build something epic!',
        duration: 6000
      })
    },
    handleSelect (key, keyPath) {
      console.log(key, keyPath)
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    open () {
      this.$alert('这是一段内容', '标题名称', {
        confirmButtonText: '确定',
        callback: action => {
          this.$message({
            type: 'info',
            message: `action: ${action}`
          })
        }
      })
    }
  },
  stepintoarticle () {
    this.$router.push('/1')
  }
}
</script>

<style>
  body {
  font-family: Helvetica, sans-serif;
  }
   .el-row {
    margin-bottom: 0px;
    &:last-child {
  margin-bottom: 0;
  }
  }
  .el-col {
  border-radius:3px;
  margin-bottom:0px;
  }
  .img{
  margin-top: 10px;
  margin-bottom: 5px;
  }
  .bg-purple-dark {
  background: #99a9bf;
  }
  .bg-purple {
  background: #d3dce6;
  }
  .bg-purple-light {
  background: #e5e9f2;
  }
  .grid-content {
  border-radius: 4px;
  min-height: 36px;
  }
  .row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
  }
  .ywl-style
  {
  height:100%;
  margin-top:10%;
  width:100%;
  }
  .a-style
  {
  text-decoration:none;
  }
  .h4-style
  {
  margin-top:10px;
  margin-bottom:10px;
  margin-left:0px;
  }
  .font-size
  {
  font-size:14px;
  }
  .overflow-style
  {
  overflow:auto;
  height:800px;
  }
  .ref-style
  {
  color:black;
  font-weight:bold;
  text-decoration:none;
  font-size:larger;
  }
  .ref-style:hover
  {
  color:blue;
  }
  .overflow-style1
  {
  overflow:auto;
  height:600px;
  background-color:white;
  padding-top:0px;
  padding-bottom:0px;
  }
  .title-style
  {
    margin-left:10px;
    margin-bottom:0px;
    margin-top:0px;
    font-size:15px;
    padding-bottom:5px;
    color:#20a0ff;
  }
  .name-style
  {
    margin-bottom:0px;
    margin-top:3px;
    color:gray;
    font-weight:bolder;
    font-family:serif;
  }
  .card-style
  {
    padding-top:15px;
  }
  .el-card_body
  {
    padding-top:15px;
  }
  .font-size-exlarge{
  font-size:40px;
}
.font-size-large{
  font-size: 20px;
}
.font-size-medium{
  font-size: 15px;
}
.font-size-small{
  font-size:12px;
}
.font-size-exsmall{
  font-size:10px;
}
.font-color-exheavy{
  color:##000000//be careful when using it cuse it atrract too much attention
}
.font-color-heavy{
  color:#1a1a1a;
}
.font-color-medium{
  color:#404040;
}
.font-color-light{
  color:##595959;
}
.font-color-exlight{
  color:#999999;
}
.blcok-bottom-line{
  border-bottom-color:rgb(240,240,240);
  border-bottom-style:solid;
  border-bottom-width:0.9px;
}
.img-height{
  display: inline;
  height:100%;
}
.img-center{
  text-align:center;
}
.footer{
  height:200px;
  background-color:#4d79ff;
  color: #ffffff;
}
.text-certer-outer{
  height:40px;
  width: 100%;
  margin: 20px auto 10px;
}
.text-center-inner{
  margin:0 auto;
}
.topic-style
{
  color:gray;
  margin-top:0px;
  margin-bottom:0px;
}
  /*
  .ul::-webkit-scrollbar{
    width:5px;
    height:initial;
  }
  .ul::-webkit-scrollbar-track-piece{
    background-color:#f2f2f2;
  }
  .ul::-webkit-scrollbar-thumb{
    background-color:#c3ccd5;
    border-radius:20px;
  }*/
</style>