<template>
  <div id="addressFolder">
    <div class="smSelect" v-if="showArrLen >= 1">
      <select class="form-control" v-model="regionDefault.province" :disabled="disabled" style="width:80px;">
        <option v-if="isChooseAll" value="">所有</option>
        <option v-for="province in provinceList" :value="province">{{province.regionName}}</option>
      </select>
    </div>
    <label class="control-label" v-if="showArrLen >= 1">省</label>
    <div class="smSelect" v-if="showArrLen >= 2" :style="{width: cityWidth}">
      <select class="form-control" v-model="regionDefault.city" :disabled="disabled" style="width:90px;">
        <option v-if="isChooseAll" value="">所有</option>
        <option v-for="city in cityList" :value="city">{{city.regionName}}</option>
      </select>
    </div>
    <label class="control-label" v-if="showArrLen >= 2">市</label>
    <div class="smSelect" v-if="showArrLen >= 3">
      <select class="form-control" v-model="regionDefault.region" :disabled="disabled" style="width:90px;">
        <option v-if="isChooseAll" value="">所有</option>
        <option v-for="region in regionList" :value="region">{{region.regionName}}</option>
      </select>
    </div>
    <label class="control-label" v-if="showArrLen >= 3">区</label>
    <div class="smSelect" v-if="showArrLen >= 4">
      <select class="form-control" v-model="regionDefault.street" :disabled="disabled" style="width:90px;">
        <option v-if="isChooseAll" value="">所有</option>
        <option v-for="street in streetList" :value="street">{{street.regionName}}</option>
      </select>
    </div>
    <label class="control-label" v-if="showArrLen >= 4">街道</label>
  </div>
</template>

<script>
import http from '../common/http'
import api from '../common/api'

export default {
  props: ['showArrLen', 'cityWidth', 'isChooseAll', 'selectedProvince', 'selectedCity', 'selectedDistrict', 'selectedStreet', 'disabled'],
  data () {
    return {
      specialProvince: ['2','3','10','23','3688'], //北京 天津 上海 重庆
      provinceList: [],
      cityList: [],
      regionList: [],
      streetList: [],
      regionDefault: {
        province: {},
        city: {},
        region: {},
        street: {}
      }
    }
  },
  created () {
    if (this.selectedProvince) {
      this.regionDefault.province = this.selectedProvince;
    }
    if (this.selectedCity) {
      this.regionDefault.city = this.selectedCity;
    }
    if (this.selectedDistrict) {
      this.regionDefault.region = this.selectedDistrict;
    }
    if (this.selectedStreet) {
      this.regionDefault.street = this.selectedStreet;
    }
  },
  watch: {
    regionDefault: {
      handler: function (newVal, oldVal) {
        this.$emit('choose-region', newVal);
      },
      deep: true
    },
    'regionDefault.province': function (newVal, oldVal) {
      this.getCityList();
      const _self = this;
    },
    'regionDefault.city': function (newVal, oldVal) {
        this.getRegionList();
    },
    'regionDefault.region': function (newVal, oldVal) {
      this.getStreetList();
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getProvinceList();
    });
    if (!this.showArrLen) {
      return this.showArrLen = 3;
    }
    if (typeof this.isChooseAll == undefined) {
      this.isChooseAll = true;
    }
  },
  methods: {
    getProvinceList () {
      const _self = this;
      http({
        instance: _self,
        url: api.regionList,
        type: 'post',
        data: {
          data: {
            parentId:'',
            regionType: 1
          }
        },
        hasLoading: false,
        success (res) {
          if (res.code == 200) {
            _self.provinceList = res.data;
            if (_self.provinceList.length) {
              if (!_self.isChooseAll) {
                _self.regionDefault.province = _self.provinceList[0];
              }
            }
            _self.getCityList();
          }
        }
      });
    },
    getCityList () {
      const _self = this;
      http({
        instance: _self,
        url: api.regionList,
        type: 'post',
        data: {
          data: {
            parentId: _self.regionDefault.province.regionId,
            regionType: 2
          }
        },
        hasLoading: false,
        success (res) {
          if (res.code == 200) {
            _self.cityList = res.data;
            if (_self.cityList.length) {
              if (!_self.isChooseAll) {
                _self.regionDefault.city = _self.cityList[0];
              }
            }
              _self.getRegionList();
          }
        }
      });
    },
    getRegionList () {
      const _self = this;
      http({
        instance: _self,
        url: api.regionList,
        type: 'post',
        data: {
          data: {
            parentId: _self.regionDefault.city.regionId,
            regionType: 3
          }
        },
        hasLoading: false,
        success (res) {
          if (res.code == 200) {
            _self.regionList = res.data;
            if (_self.regionList.length) {
              if (!_self.isChooseAll) {
                _self.regionDefault.region = _self.regionList[0];
              }
            }
            _self.getStreetList();
          }
        }
      });
    },
    getStreetList () {
      const _self = this;
      http({
        instance: _self,
        url: api.regionList,
        type: 'post',
        data: {
          data: {
            parentId: _self.regionDefault.region.regionId,
            regionType: 4
          }
        },
        hasLoading: false,
        success (res) {
          if (res.code == 200) {
            _self.streetList = res.data;
            if (_self.streetList.length) {
              if (!_self.isChooseAll) {
                _self.regionDefault.street = _self.streetList[0];
              }
            }
          }
        }
      });
    }
  }
}
</script>

<style lang="sass">
#addressFolder {
  display: inline-block;
  .smSelect {
    display: inline-block;
    width: auto;
  }
  .form-control {
    width: auto;
  } 
}
</style>