import AMap from 'AMap'

// export function getAddress (center, Geocoder = {}) {
//   return new Promise((resolve, reject) => {
//     AMap.service(["AMap.Geocoder"], () => {
//       let geocoder = new AMap.Geocoder({ ...Geocoder })
//       geocoder.getAddress(center, function (status, result) {
//         if (status === 'complete' && result.regeocode) {
//           resolve(result)
//         } else {
//           console.error('根据经纬度查询地址失败')
//           reject({ status, result })
//         }
//       })
//     })
//   })
// }

/**
 * 地理位置编译
 * 文档地址 https://lbs.amap.com/api/javascript-api/reference/lnglat-to-address#m_AMap.Geocoder
 */
export default class Geocoder {
  constructor(opt = {}) {
    this.opt = opt
    this.geo = this.initGeocoder()
  }
  /** 初始化 */
  initGeocoder () {
    if (!AMap) return false
    let geocoder
    AMap.plugin(["AMap.Geocoder"], () => geocoder = new AMap.Geocoder({ ...this.opt }))
    return geocoder
  }
  /** 逆地理编码（坐标 -> 地址 */
  getAddress (center) {
    return new Promise((resolve, reject) => {
      this.geo.getAddress(center, function (status, result) {
        if (status === 'complete' && result.regeocode) {
          resolve(result)
        } else {
          console.error('根据经纬度查询地址失败')
          reject({ status, result })
        }
      })
    })
  }
  /** 地理编码（地址 -> 坐标） */
  getLocation (address) {
    return new Promise((resolve, reject) => {
      this.geo.getLocation(address, function (status, result) {
        if (status === 'complete' && result.geocodes.length) {
          resolve(result)
        } else {
          console.error('根据经纬度查询地址失败')
          reject({ status, result })
        }
      })
    })
  }
}
