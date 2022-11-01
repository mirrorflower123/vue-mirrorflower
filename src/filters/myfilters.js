import Vue from 'vue'

//vue

Vue.filter('formatDate', function (value, format) {
  console.log('filter formatDate', value, format)
  //处理格式
  format = format ? format : 'yyyy-MM-dd hh:mm:ss'
  //获取时间戳对应的日期信息
  let date = new Date()
  date.setTime(value)
  let y = date.getFullYear()
  let m = date.getMonth() + 1
  let d = date.getDate()
  let h = date.getHours()
  let mm = date.getMinutes()
  let ss = date.getSeconds()
  //
  let result = format.replace(/yyyy/g, y)
  result = result.replace(/MM/g, m)
  result = result.replace(/dd/g, d)
  result = result.replace(/hh/g, h)
  result = result.replace(/mm/g, mm)
  result = result.replace(/ss/g, ss)

  return result
})
