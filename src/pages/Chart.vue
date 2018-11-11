<template>
  <div class="chart">
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="totalDiv bg-white">
            <div class="iconDiv bg-green">
              <i class="fa fa-cloud" aria-hidden="true"></i>
            </div>
            <div class="numDiv">
              <span>99.9%</span>
              <small>SERVER UPTIME</small>
            </div>
          </div>
          <div class="totalDiv bg-white">
            <div class="iconDiv bg-green">
              <i class="fa fa-cloud" aria-hidden="true"></i>
            </div>
            <div class="numDiv">
              <span>99.9%</span>
              <small>SERVER UPTIME</small>
            </div>
          </div>
          <div class="totalDiv bg-white">
            <div class="iconDiv bg-green">
              <i class="fa fa-cloud" aria-hidden="true"></i>
            </div>
            <div class="numDiv">
              <span>99.9%</span>
              <small>SERVER UPTIME</small>
            </div>
          </div>
      </el-col>
      <el-col :span="12">
          <div class="visDiv">
            <x-chart :id="test1" :option="option1" ></x-chart>
          <!-- <div id="visContainer"></div> -->
          <div class="numDiv">
            <span>14.85%</span>
            <small>More Visitors</small>
          </div>
          </div>
      </el-col>
      <el-col :span="6">
         <div class="uptimeDiv bg-white" >
            <x-chart :id="test2" :option="option2" ></x-chart>
            <!-- <div id="uptimeContainer"></div> -->
            <div class="numDiv">
              <span>14.85%</span>
              <small>More Visitors</small>
            </div>
          </div>
          <div class="salesDiv bg-white">
            <x-chart :id="test3" :option="option3" ></x-chart>
            <!-- <div id="salesContainer"></div> -->
            <div class="numDiv">
              <span>14.85%</span>
              <small>More Visitors</small>
            </div>
          </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
          <div class="bottomDiv bg-white">
            <div class="numDiv">
              <span>Visitor Volume</span>
            </div>
            <x-chart :id="test4" :option="option4" ></x-chart>
            <!-- <div id="huanContainer"></div> -->
          </div>
      </el-col>
      <el-col :span="12">
        <div class="bottomDiv ">
          <img src="@/assets/p2.11dfdcf.png" alt="">
        </div>
      </el-col>
    </el-row>
  </div>
</template>
 
<script>
    // 导入chart组件
    import XChart from './comp.vue'
    export default {
        data() {
            return {
              test1: 'test1',
              option1: {
                chart:{
                    margin:[0,0,0,0],
                  },
                  credits:{
                    enabled:false,
                  },
                  colors:['#66bb0d','#cccccc'],
                  title: {
                    text: ''
                  },
                  xAxis: {
                    visible:false,
                  },
                  yAxis: {
                    visible:false,
                    title: {
                      text: ''
                    }
                  },
                  legend: {
                    floating:true,
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'top'
                  },
                  plotOptions: {
                    series: {
                      label: {
                        connectorAllowed: false
                      },
                      pointStart: 2010
                    }
                  },
                  series: [{
                    name: 'Page',
                    data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175,24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
                  }, {
                    name: 'Visitors',
                    data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434,43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
                  }]
                },
                test2:'test2',
                option2:{
                  chart:{
                    margin:[0,0,0,0],
                  },
                  credits:{
                    enabled:false,
                  },
                  colors:['#862eb7'],
                  title: {
                    text: ''
                  },
                  xAxis: {
                    visible:false,
                  },
                  yAxis: {
                    visible:false,
                  },
                  series: [{
                    type: 'column',
                    colorByPoint: true,
                    data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4,148.5, 216.4, 194.1, 95.6, 54.4],
                    showInLegend: false
                  }]
                },
                test3:'test3',
                option3: {
                  credits:{
                    enabled:false,
                  },
                  chart: {
                    margin : [0, 0 , 0, 100]
                  },
                  title: {
                    floating:true,
                    text: ''
                  },
                  tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                  },
                  plotOptions: {
                    pie: {
                      allowPointSelect: true,
                      cursor: 'pointer',
                      dataLabels: {
                        enabled: false,
                      },
                    }
                  },
                  series: [{
                    type: 'pie',
                    innerSize: '60%',
                    name: 'Sales',
                    data: [
                      ['Firefox',45.0],
                      ['IE',26.8],
                      ['Chrome',12.8],
                      ['Safari',8.5],
                      ['Opera',6.2],
                      ['其他',0.7]
                    ]
                  }]
                },
                test4:'test4',
                option4: {
                  credits:{
          enabled:false,
        },
        chart: {
          margin : [62,20,20,20],
        },
        title: {
          floating:true,
          text: ''
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: false,
            },
            startAngle: -135, // 圆环的开始角度
            endAngle: 135,    // 圆环的结束角度
          }
        }, 
        series: [
          {type: 'pie',
           innerSize: '40%',
           name: 'Sale',
           data: [
             ['Firefox',50.0],
             ['g',45.0],
             ['h',5.0]
           ],
           colors:['#e0e0e0','#fed119','#e0e0e0'],
          },{type: 'pie',
             innerSize: '55%',
             name: 'Sale',
             data: [
               ['Firefox',20.0],
               ['e',30.0],
               ['f',50.0]
             ],
             colors:['#e0e0e0','#005eca','#e0e0e0'],
            },{type: 'pie',
             innerSize: '70%',
             name: 'Sale',
             data: [
               ['Firefox',50.0],
               ['c',15.0],
               ['d',35.0]
             ],
             colors:['#e0e0e0','#7c31bf','#e0e0e0'],
            },{
              type: 'pie',
              innerSize: '85%',
              name: 'Sales',
              data: [
                ['Firefox',30.0],
                ['a',20.0],
                ['b',50.0]
              ],
              colors:['#e0e0e0','#70b42f','#e0e0e0'],
            },]
                }


            }
        },
        components: {
            XChart
        }
    }
</script>
<!-- no<style scoped> -->
<style>
  
  .wrapper{
    background: #f0f0f0;
    padding: 0;
  }
  .bg-white{
    background-color: white;
  }
  .bg-green{
    background-color:#66bb0d;
  }
  .outerDiv{
    width: 95%;
    margin:0 auto;
  }
  .totalDiv{
    overflow:hidden;
    padding: 10px;
    border-radius: 5px;
    margin-top:10px;
  }
  .totalDiv .iconDiv,.totalDiv .numDiv{
    float:left; 
  }
  .iconDiv{
    width: 50px;
    height: 50px;
    border-radius: 50%;
    text-align: center;
  }
  .iconDiv .fa{
    line-height: 50px;
    color:white;
    font-size: 30px;
    padding: 0;
  }
  .totalDiv .numDiv{
    margin-left: 20px;
    padding-top:5px;
  }
  .numDiv span{
    font-size: 24px;
    line-height: 24px;
  }
  .numDiv small{
    display: block;
  }
  #visContainer{
    height: 230px;
    margin-top: 10px;
  }
  .visDiv,.uptimeDiv,.salesDiv{
    position: relative;
  }
  .visDiv .numDiv,.uptimeDiv .numDiv,.salesDiv .numDiv{
    position: absolute;
    top:20px;
    left: 20px;
  }
  .visDiv span{
    color:#66bb0d;
    /*color:#862eb7;*/
  }
  .uptimeDiv,.salesDiv{
    margin-top: 10px;
  }
  #uptimeContainer,#salesContainer{
    height: 110px;
  }
  .bottomDiv{
    margin-top: 20px;
    height: 420px;
  }
  .bottomDiv img{
    width: 100%;
    height: 440px;
  }
  .bottomDiv .numDiv{
    margin-left: 20px;
  }
  .bottomDiv span{
    font-size: 24px;
    display: inline-block;
    margin-top: 20px;
  }
  #test1{
    margin-top: 10px;
    height: 230px;
  }
  #test2,#test3{
    height: 110px;
  }

  
</style>