var app = getApp();
var deviceId;
var i=0;
var serviceId=[];
var characteristicId=[];

Page({
  data: {
      logs: [],
      StartX:'150',
      StartY:'75',
      leftLooks: '',
      topLooks: '',
      //半径
      radius: '60',
      angle: '',
    // datalist:[]
  },
  // 蓝牙发送数据库 code
  BLEcode:function(code){
    let buffer = new ArrayBuffer(1)
    let dataView = new DataView(buffer)				
    switch(code){
      case "前进": dataView.setUint8(0, 0x41); break;	// A[67.5-90-(-67.5)]45
      case "右上": dataView.setUint8(0, 0x42); break;	// B[(-67.5)-(-22.5)]
      case "右转": dataView.setUint8(0, 0x43); break;	// C[(-22.5)-22.5]
      case "右下": dataView.setUint8(0, 0x44); break;	// D[22.5-67.5]
      case "后退": dataView.setUint8(0, 0x45); break;	// E[67.5-90-(-67.5)]
      case "左下": dataView.setUint8(0, 0x46); break;	// F[(-67.5)-(-22.5)]
      case "左转": dataView.setUint8(0, 0x47); break;	// G[(-22.5)-22.5]
      case "左上": dataView.setUint8(0, 0x48); break;	// H[22.5-67.5]
      case "减速": dataView.setUint8(0, 0x59); break;	// Y
      case "加速": dataView.setUint8(0, 0x58); break;	// X
      case "停车": dataView.setUint8(0, 0x5A); break;	// Z(150,75)
    }
  
  // if(code === "前进")){
  // 	dataView.setUint8(0, 0x41);}	// A		
  
  // else if(code === "右上")){
  // 	dataView.setUint8(0, 0x42);}	// B
  
  // else if(code === "右转")){
  // 	dataView.setUint8(0, 0x43);}	// C
  
  // else if(code === "右下")){
  // 	dataView.setUint8(0, 0x44);}	// D
  
  // else if(code === "后退")){
  // 	dataView.setUint8(0, 0x45);}	// E
  
  // else if(code === "左下")){
  // 	dataView.setUint8(0, 0x46);}	// F
  
  // else if(code === "左转")){
  // 	dataView.setUint8(0, 0x47);}	// G	
    
  // else if(code === "左上")){
  // 	dataView.setUint8(0, 0x48);}	// H
  
  // else if(code === "减速")){
  // 	dataView.setUint8(0, 0x59);}	// Y
  
  // else if(code === "加速")){
  // 	dataView.setUint8(0, 0x58);}	// X
    
  // else if(code === "停车")){
  // 	dataView.setUint8(0, 0x5A);}	// Z
  
    return buffer;				
  },
  onLoad:function(){
    wx.onBluetoothAdapterStateChange(function (res) {
    console.log('adapterState changed, now is', res)
    })
  },

  openadapter:function(){
    wx.openBluetoothAdapter({
    success: function(res) {
    console.log(res,"success")
  },
    fail: function (res) {
    console.log(res,"fail")
  },
  })
  // wx.getBluetoothAdapterState({
  // complete: function (res) {
  // console.log("currentstate:",res)
  // }
  // })
  },
  closeadapter: function () {
    wx.closeBluetoothAdapter({
    success: function (res) {
    console.log(res, "success")
  },
    fail: function (res) {
    console.log(res, "fail")
  },
  })
  // wx.getBluetoothAdapterState({
  // complete: function (res) {
  // console.log("currentstate:", res)
  // }
  // })
  },

  opendiscovery:function(){
    wx.startBluetoothDevicesDiscovery({
    services: [],
    success: function (res) {
    console.log(res)
  },
    fail: function (res) {
    console.log(res, "fail")
  },
  })
  },

  closediscovery:function(){
    wx.stopBluetoothDevicesDiscovery({
    success: function (res) {
    console.log(res)
  },
    fail: function (res) {
    console.log(res, "fail")
  },
  })
  },

  getdevice:function(){
    function ab2hex(buffer) {
    var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
    return ('00' + bit.toString(16)).slice(-2)
  }
  )
    return hexArr.join('');
  }
    wx.getBluetoothDevices({
      success: function (res) {
      console.log(res)
      i=0;
      while (res.devices[i]) {
      console.log(i);
      console.log(res.devices[i].name,res.devices[i].deviceId);
      // if (!res.devices[i].name) {
      //   return
      // }

  // if(res.devices[i].name=='BT04-A'){
  if(res.devices[i].name=='JDY-24M'){
    deviceId=res.devices[i].deviceId;
    console.log(res.devices[i].name,res.devices[i].deviceId);
  // console.log(deviceId);
  }
    i++;
  }
  }
  })
  },

  getconnecteddevice:function(){
    wx.getConnectedBluetoothDevices({
    //services:[],
    success: function (res) {
    console.log(res)
  }
  })
  },
  connecteddevice:function(){
    wx.createBLEConnection({
  deviceId: deviceId,
  success: function(res) {
  console.log(res);
  },
  })
  },
  getservice:function(){
    wx.getBLEDeviceServices({
      deviceId: deviceId,
      success: function(res) {
      console.log(res.services);
      i=0;
      while(res.services[i]){
      serviceId[i]=res.services[i].uuid;
      console.log(serviceId[i]);
      i++;
  }
  },
  })
  },
  getcharacteristics:function(){
    wx.getBLEDeviceCharacteristics({
      deviceId: deviceId,
      serviceId: serviceId[0],
      success: function (res) {
      console.log('device getBLEDeviceCharacteristics:', res.characteristics)
  }
  })
    wx.getBLEDeviceCharacteristics({
      deviceId: deviceId,
      serviceId: serviceId[0],
      success: function (res) {
      i=0;
      while(res.characteristics[i]){
      characteristicId[i]=res.characteristics[i].uuid;
      console.log(characteristicId[i]);
      i++;
  }
  }
  })
  },
  startread:function(){
    wx.readBLECharacteristicValue({
      deviceId: deviceId,
      serviceId: serviceId[0],
      characteristicId: characteristicId[0],
      success: function (res) {
      console.log('readBLECharacteristicValue:', res.errCode)
  }
  })
  },
  startnotify:function(){
    wx.notifyBLECharacteristicValueChange({
      state: true,
      deviceId: deviceId,
      serviceId: serviceId[0],
      characteristicId: characteristicId[0],
      success: function (res) {
      console.log('notifyBLECharacteristicValueChange success', res.errMsg)
  }
  })
    function ab2hex(buffer) {
      var hexArr = Array.prototype.map.call(
      new Uint8Array(buffer),
      function(bit) {
      return ('00' + bit.toString(16)).slice(-2)
  }
  )
   return hexArr.join('');
  }
    wx.onBLECharacteristicValueChange(function (res) {
      console.log('characteristic value comed:', ab2hex(res.value))
  })
  },
//前进
// startwriteA:function(){
// let buffer = new ArrayBuffer(1)
// let dataView = new DataView(buffer)
// dataView.setUint8(0, 0x41)

// wx.writeBLECharacteristicValue({
// deviceId: deviceId,
// serviceId: serviceId[0],
// characteristicId: characteristicId[0],
// value: buffer,
// success: function (res) {
// console.log('writeBLECharacteristicValue success', res.errMsg)
// }
// })
// },
//右上
// startwriteB:function(){
//   // let buffer = new ArrayBuffer(1)
//   // let dataView = new DataView(buffer)
//   // dataView.setUint8(0, 0x42)
  
//   wx.writeBLECharacteristicValue({
//   deviceId: deviceId,
//   serviceId: serviceId[0],
//   characteristicId: characteristicId[0],
//   // value: buffer,
//   value: this.BLEcode("右上"),
//   success: function (res) {
//   console.log('writeBLECharacteristicValue success', res.errMsg)
//   }
//   })
//   },
//右转
// startwriteC:function(){
//   // let buffer = new ArrayBuffer(1)
//   // let dataView = new DataView(buffer)
//   // dataView.setUint8(0, 0x43)
  
//   wx.writeBLECharacteristicValue({
//   deviceId: deviceId,
//   serviceId: serviceId[0],
//   characteristicId: characteristicId[0],
//   // value: buffer,
//   value: this.BLEcode("右转"),
//   success: function (res) {
//   console.log('writeBLECharacteristicValue success', res.errMsg)
//   }
//   })
//   },
//右下
// startwriteD:function(){
//   // let buffer = new ArrayBuffer(1)
//   // let dataView = new DataView(buffer)
//   // dataView.setUint8(0, 0x45)
  
//   wx.writeBLECharacteristicValue({
//   deviceId: deviceId,
//   serviceId: serviceId[1],
//   characteristicId: characteristicId[1],
//   // value: buffer,
//   value: this.BLEcode("右下"),
//   success: function (res) {
//   console.log('writeBLECharacteristicValue success', res.errMsg)
//   }
//   })
//   },
// //后退
// startwriteE:function(){
//   // let buffer = new ArrayBuffer(1)
//   // let dataView = new DataView(buffer)
//   // dataView.setUint8(0, 0x45)
  
//   wx.writeBLECharacteristicValue({
//   deviceId: deviceId,
//   serviceId: serviceId[1],
//   characteristicId: characteristicId[1],
//   // value: buffer,
//   value: this.BLEcode("后退"),
//   success: function (res) {
//   console.log('writeBLECharacteristicValue success', res.errMsg)
//   }
//   })
//   },
  //左下
// startwriteF:function(){
//   // let buffer = new ArrayBuffer(1)
//   // let dataView = new DataView(buffer)
//   // dataView.setUint8(0, 0x45)
  
//   wx.writeBLECharacteristicValue({
//   deviceId: deviceId,
//   serviceId: serviceId[1],
//   characteristicId: characteristicId[1],
//   // value: buffer,
//   value: this.BLEcode("左下"),
//   success: function (res) {
//   console.log('writeBLECharacteristicValue success', res.errMsg)
//   }
//   })
//   },
//左转
// startwriteG:function(){
//   // let buffer = new ArrayBuffer(1)
//   // let dataView = new DataView(buffer)
//   // dataView.setUint8(0, 0x45)
  
//   wx.writeBLECharacteristicValue({
//   deviceId: deviceId,
//   serviceId: serviceId[1],
//   characteristicId: characteristicId[1],
//   // value: buffer,
//   value: this.BLEcode("左转"),
//   success: function (res) {
//   console.log('writeBLECharacteristicValue success', res.errMsg)
//   }
//   })
//   },
  //左上
// startwriteH:function(){
//   // let buffer = new ArrayBuffer(1)
//   // let dataView = new DataView(buffer)
//   // dataView.setUint8(0, 0x45)
  
//   wx.writeBLECharacteristicValue({
//   deviceId: deviceId,
//   serviceId: serviceId[1],
//   characteristicId: characteristicId[1],
//   // value: buffer,
//   value: this.BLEcode("左上"),
//   success: function (res) {
//   console.log('writeBLECharacteristicValue success', res.errMsg)
//   }
//   })
//   },
//减速
// startwriteY:function(){
//   // let buffer = new ArrayBuffer(1)
//   // let dataView = new DataView(buffer)
//   // dataView.setUint8(0, 0x45)
  
//   wx.writeBLECharacteristicValue({
//   deviceId: deviceId,
//   serviceId: serviceId[1],
//   characteristicId: characteristicId[1],
//   // value: buffer,
//   value: this.BLEcode("减速"),
//   success: function (res) {
//   console.log('writeBLECharacteristicValue success', res.errMsg)
//   }
//   })
//   },
  //加速
// startwriteX:function(){
//   // let buffer = new ArrayBuffer(1)
//   // let dataView = new DataView(buffer)
//   // dataView.setUint8(0, 0x45)
  
//   wx.writeBLECharacteristicValue({
//   deviceId: deviceId,
//   serviceId: serviceId[1],
//   characteristicId: characteristicId[1],
//   // value: buffer,
//   value: this.BLEcode("加速"),
//   success: function (res) {
//   console.log('writeBLECharacteristicValue success', res.errMsg)
//   }
//   })
//   },
//停止
// startwriteZ:function(){
//   let buffer = new ArrayBuffer(1)
//   let dataView = new DataView(buffer)
//   dataView.setUint8(0, 0x5A)
  
//   wx.writeBLECharacteristicValue({
//   deviceId: deviceId,
//   serviceId: serviceId[1],
//   characteristicId: characteristicId[1],
//   value: buffer,
//   // value: this.BLEcode("停止"),
//   success: function (res) {
//   console.log('writeBLECharacteristicValue success', res.errMsg)
//   }
//   })
//   },
  //摇杆点击事件
  // ImageTouch: function (e) {
  //   console.log("点击")
  // },
  // ImageTouchMove: function () {
  //   let buffer = new ArrayBuffer(1);
  //   let dataView = new DataView(buffer);
  //   dataView.setUint8(0, 0x41);

  //   wx.writeBLECharacteristicValue({
  //     deviceId: deviceId,
  //     serviceId: serviceId[0],
  //     characteristicId: characteristicId[0],
  //     value: buffer,
  //     success: function (res) {
  //       console.log('writeBLECharacteristicValue success', res.errMsg);
  //     }
  //   });
  // },
  writeBLECharacteristic: function (value) {
    wx.writeBLECharacteristicValue({
      deviceId: deviceId,
      serviceId: serviceId[0],
      characteristicId: characteristicId[0],
      value: this.BLEcode(value),
      success: function (res) {
        console.log('writeBLECharacteristicValue success', res.errMsg);
      }
    });
  },
  ImageTouchMove: function (e) {
    var self = this;
    var touchX = e.touches[0].clientX - 40;
    var touchY = e.touches[0].clientY - 600;
    var movePos = self.GetPosition(touchX, touchY);
    // console.log("接触坐标：(" + touchX + "," + touchY + ")");
    // console.log("图片坐标：(" + movePos.posX + "," + movePos.posY + ")");
    self.setData({
      leftLooks: movePos.posX,
      topLooks: movePos.posY,
      angle: Math.round(movePos.angle)
    })
    var roundedAngle = Math.round(movePos.angle);
    if (roundedAngle >= 250 && roundedAngle <= 290) {
      self.writeBLECharacteristic("前进");
    } else if (roundedAngle >= 290 && roundedAngle <= 330) {
      self.writeBLECharacteristic("右上");
    }else if (roundedAngle >= 330 && roundedAngle <= 360) {
      self.writeBLECharacteristic("右转");
    }else if (roundedAngle >= 0 && roundedAngle <= 45) {
      self.writeBLECharacteristic("右下");
    }else if (roundedAngle >= 45 && roundedAngle <= 90) {
      self.writeBLECharacteristic("后退");
    }else if (roundedAngle >= 90 && roundedAngle <= 170) {
      self.writeBLECharacteristic("左下");
    }else if (roundedAngle >= 170 && roundedAngle <= 200) {
      self.writeBLECharacteristic("左转");
    }else if (roundedAngle >= 200 && roundedAngle <= 250) {
      self.writeBLECharacteristic("左上");
    }
  },

  ImageReturn: function (e) {
    var self = this;
    self.writeBLECharacteristic("停止");
    self.setData({
      leftLooks: self.data.StartX,
      topLooks: self.data.StartY,
      angle: ""
    })
  },

  GetPosition: function (touchX, touchY) {
    var self = this;
    var DValue_X = touchX - self.data.StartX;
    var Dvalue_Y = touchY - self.data.StartY;
    var Dvalue_Z = Math.sqrt(DValue_X * DValue_X + Dvalue_Y * Dvalue_Y);
    self.GetAngle(DValue_X, Dvalue_Y);

    var angle = Math.atan2(Dvalue_Y, DValue_X) * 180 / Math.PI;
    angle = (angle + 360) % 360; // 将负角度转换为正角度

    var imageX, imageY;

    if (Dvalue_Z <= self.data.radius) {
      imageX = touchX;
      imageY = touchY;
    } else {
      var ratio = self.data.radius / Dvalue_Z;
      imageX = DValue_X * ratio + 150;
      imageY = Dvalue_Y * ratio + 75;
    }

    imageX = Math.round(imageX);
    imageY = Math.round(imageY);

    return { posX: imageX, posY: imageY, angle: angle };
  },

  GetAngle: function (DValue_Y, Dvalue_X) {
    var self = this;
    if (DValue_Y != 0) {
      var angleTan = Dvalue_X / DValue_Y;
      var ang = Math.atan(angleTan);
      var angs = ang * 180 / Math.PI;
      var result = Math.round(angs);
      self.setData({
        angle: result
      })
    }
  }
  //拖动摇杆移动
  // ImageTouchMove: function (e) {
  //   var self = this;
  //   //e.touches[0].clientX是触碰的位置，需要减40使得图片中心跟随触碰位置
  //   var touchX = e.touches[0].clientX - 40;
  //   var touchY = e.touches[0].clientY - 600;
  //   var movePos = self.GetPosition(touchX, touchY);
  //   console.log("接触坐标：(" + touchX + "," + touchY + ")");
  //   console.log("图片坐标：("+movePos.posX + "," + movePos.posY+")");
  //   // if (130 <= movePos.posX <= 175 && 18 <= movePos.posY <= 21) {
  //   //   self.writeBLECharacteristic("前进");
  //   // }
  //   // else if (175 <= movePos.posX <= 205 && 21 <= movePos.posY <= 51) {
  //   //   self.writeBLECharacteristic("右上");
  //   // }
  //   // else if (205 <= movePos.posX <= 210 && 51 <= movePos.posY <= 71) {
  //   //   self.writeBLECharacteristic("右转");
  //   // }
  //   // else if (185 <= movePos.posX <= 205 && 71 <= movePos.posY <= 104) {
  //   //   self.writeBLECharacteristic("右下");
  //   // }else{
  //   //   self.writeBLECharacteristic("后退");
  //   // }
  //   // if (100 <= movePos.posX <= 130 && 24 <= movePos.posY <= 54) {
  //   //   self.writeBLECharacteristic("左上");
  //   // }
  //   // if (140 <= movePos.posX <= 160 && 94 <= movePos.posY <= 100) {
  //   //   self.writeBLECharacteristic("后退");
  //   // }
  //   // if (100 <= movePos.posX <= 140 && 108 <= movePos.posY <= 120) {
  //   //   self.writeBLECharacteristic("左下");
  //   // }
  //   // if (90 <= movePos.posX <= 100 && 53 <= movePos.posY <= 108) {
  //   //   self.writeBLECharacteristic("左转");
  //   // }
  //   // if((130<=movePos.posX<=175)&&(19<=movePos.posY<=21)){
  //   //     wx.writeBLECharacteristicValue({
  //   //         deviceId: deviceId,
  //   //         serviceId: serviceId[0],
  //   //         characteristicId: characteristicId[0],
  //   //         // value: buffer,
  //   //         value: this.BLEcode("前进"),
  //   //         success: function (res) {
  //   //         console.log('writeBLECharacteristicValue success', res.errMsg)
  //   //         }
  //   //   })
  //   // }
  //   // if((175<=movePos.posX<=205)&&(21<=movePos.posY<=51)){
  //   //   wx.writeBLECharacteristicValue({
  //   //     deviceId: deviceId,
  //   //     serviceId: serviceId[0],
  //   //     characteristicId: characteristicId[0],
  //   //     // value: buffer,
  //   //     value: this.BLEcode("右上"),
  //   //     success: function (res) {
  //   //     console.log('writeBLECharacteristicValue success', res.errMsg)
  //   //     }
  //   //   })
  //   // }
  //   // if((205<=movePos.posX<=210)&&(51<=movePos.posY<=71)){
  //   //   wx.writeBLECharacteristicValue({
  //   //     deviceId: deviceId,
  //   //     serviceId: serviceId[0],
  //   //     characteristicId: characteristicId[0],
  //   //     // value: buffer,
  //   //     value: this.BLEcode("右转"),
  //   //     success: function (res) {
  //   //     console.log('writeBLECharacteristicValue success', res.errMsg)
  //   //     }
  //   //   })
  //   // }
  //   // if((185<=movePos.posX<=205)&&(71<=movePos.posY<=104)){
  //   //   wx.writeBLECharacteristicValue({
  //   //     deviceId: deviceId,
  //   //     serviceId: serviceId[0],
  //   //     characteristicId: characteristicId[0],
  //   //     // value: buffer,
  //   //     value: this.BLEcode("右下"),
  //   //     success: function (res) {
  //   //     console.log('writeBLECharacteristicValue success', res.errMsg)
  //   //     }
  //   //   })
  //   // }
  //   // if((185<=movePos.posX<=205)&&(71<=movePos.posY<=104)){
  //   //   wx.writeBLECharacteristicValue({
  //   //     deviceId: deviceId,
  //   //     serviceId: serviceId[0],
  //   //     characteristicId: characteristicId[0],
  //   //     // value: buffer,
  //   //     value: this.BLEcode("右下"),
  //   //     success: function (res) {
  //   //     console.log('writeBLECharacteristicValue success', res.errMsg)
  //   //     }
  //   //   })
  //   // }
  //   // if((185<=movePos.posX<=205)&&(71<=movePos.posY<=104)){
  //   //   wx.writeBLECharacteristicValue({
  //   //     deviceId: deviceId,
  //   //     serviceId: serviceId[0],
  //   //     characteristicId: characteristicId[0],
  //   //     // value: buffer,
  //   //     value: this.BLEcode("右下"),
  //   //     success: function (res) {
  //   //     console.log('writeBLECharacteristicValue success', res.errMsg)
  //   //     }
  //   //   })
  //   // }

  //   self.setData({
  //     leftLooks: movePos.posX,
  //     topLooks: movePos.posY
  //   })
  // },



  // //松开摇杆复原
  // ImageReturn: function (e) {
  //   var self = this;
  //   let buffer = new ArrayBuffer(1);
  //   let dataView = new DataView(buffer);
  //   dataView.setUint8(0, 0x5A);

  //   wx.writeBLECharacteristicValue({
  //     deviceId: deviceId,
  //     serviceId: serviceId[0],
  //     characteristicId: characteristicId[0],
  //     value: buffer,
  //     success: function(res) {
  //       console.log('writeBLECharacteristicValue success', res.errMsg);
  //       // Add the remaining code for this success case if necessary
  //     },
  //     // Add error handling code if necessary
  //   });
  //   // console.log("yuan坐标：(" + self.data.StartX + "," + self.data.StartY + ")");
  //   self.setData({
  //     leftLooks: self.data.StartX,
  //     topLooks: self.data.StartY,
  //     angle: ""
  //   })
   
  // },

  // //获得触碰位置并且进行数据处理获得触碰位置与拖动范围的交点位置
  // GetPosition: function (touchX, touchY) {
  //   var self = this;
  //   var DValue_X;
  //   var Dvalue_Y;
  //   var Dvalue_Z;
  //   var imageX;
  //   var imageY;
  //   var ratio;
  //   DValue_X = touchX - self.data.StartX;
  //   Dvalue_Y = touchY - self.data.StartY;
  //   console.log("DValue_X坐标：(" + DValue_X + "," + DValue_X + ")");
  //   Dvalue_Z = Math.sqrt(DValue_X * DValue_X + Dvalue_Y * Dvalue_Y);
  //   self.GetAngle(DValue_X, Dvalue_Y)
  //   //触碰点在范围内
  //   if (Dvalue_Z <= self.data.radius) {
  //     imageX = touchX;
  //     imageY = touchY;
  //     imageX = Math.round(imageX);
  //     imageY = Math.round(imageY);
  //     console.log("imageX：(" + imageX + "," + imageY + ")");
  //     return { posX: imageX, posY: imageY };
  //   }

  //   //触碰点在范围外
  //   else {

  //     ratio = self.data.radius / Dvalue_Z;
  //     imageX = DValue_X * ratio + 150;
  //     imageY = Dvalue_Y * ratio + 75;
  //     imageX = Math.round(imageX);
  //     imageY = Math.round(imageY);
  //     console.log("imageX：(" + imageX + "," + imageY + ")");
  //     return { posX: imageX, posY: imageY };

  //   }
  // },

  // //获取角度
  // GetAngle: function (DValue_Y, Dvalue_X) {
  //   // console.log(DValue_Y)
  //   var self = this;
  //   if (DValue_Y != 0) {
  //     var angleTan = Dvalue_X / DValue_Y;
  //     var ang = Math.atan(angleTan);

  //     var angs = ang * 180 / 3.14;
  //     var result = Math.round(angs);
  //     self.setData({
  //       angle: result
  //     })
  //     // console.log("angle：(" + result + ")");
  //         // Add error handling code if necessary
  //   }
  // }
})

