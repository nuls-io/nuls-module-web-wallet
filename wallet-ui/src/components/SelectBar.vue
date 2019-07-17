<template>
  <el-select :value="$t(typeName+'.'+value)" @input="change($event)">
    <el-option v-for="item in typeOptions" :key="item.value" :label="$t(typeName+'.'+item.label)" :value="item.value">
    </el-option>
  </el-select>
</template>

<script>
  export default {
    props: {
      //默认选中内容
      value: {
        default: 0
      },
      //下框列表
      typeOptions: {
        type:Array,
        default:()=> [
          {value: '0', label: '0'},
          {value: '1', label: '1'},
          {value: '2', label: '2'},
          {value: '3', label: '3'},
          {value: '4', label: '4'},
          {value: '5', label: '5'},
          {value: '6', label: '6'},
          {value: '7', label: '7'},
          {value: '8', label: '8'},
          {value: '9', label: '9'},
          {value: '10', label: '10'},
          {value: '100', label: '100'},
          {value: '101', label: '101'},
          {value: '102', label: '102'},
          {value: '103', label: '103'},
          {value: '104', label: '104'},
          /*{value: '1000', label: '1000'},*/
        ]
      },
      //循环字段名
      typeName:{
        type:String,
        default:"type"
      }
    },
    methods: {
      change(val) {
        this.$emit('change', val);
      }
    },
  }
</script>
