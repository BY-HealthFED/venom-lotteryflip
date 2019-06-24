## lotteryflip

翻牌抽奖 
[demo](https://by-healthfed.github.io/venom-lotteryflip/dist)

#### parame

|              | 参数名称              | 说明                                                         | 是否必填 | 类型                                 |
| ------------ | --------------------- | ------------------------------------------------------------ | -------- | ------------------------------------ |
| 重要参数     | parentId              | Game挂载Id<br />游戏将要寄生的Node Id                        | 是       | String                               |
|              | targetId              | Game自身Id<br />默认game-target-时间戳+100以内随机数         | 否       | String                               |
|              | style                 | Game皮肤定义<br />定义游戏模块的UI展示效果                   | 是       | Object                               |
|              | prizes                | 奖品参数<br />参考[prizes结构](#prizes)                      | 是       | Array                                |
|              | start                 | 开始抽奖，向后台请求抽奖结果然后以promise的形式将结果返回给Game以启动抽奖。<br />注意<br />1、务必返回Promise对象<br />2、中奖奖品数据结构必须等于prizes的某个子项 | 是       | Function<br />```()=>Promise(...)``` |
|              | saveAddress           | 提交收货地址时保存收货人地址方法<br />当所中奖品的属性receiveType=2(填写地址)时将会弹出地址填写框，完成地址填写提交后调用此方法用于保存收货人地址，参数address是收集的地址信息<br />saveAddress = function(address){<br /><br />    console.log(data)<br />} | 是       | Function<br />```()=>Promise(...)``` |
|              | playerPhone           | 参与抽奖人的电话号码，有则显示                               | 否       | String                               |
|              | checkVerificationCode | 获取短信验证码方法，用于短信验证参与人电话号码，有电话号码且有此方法时开启短信验证 | 否       | Function                             |
|              | receiverInfo          | 默认收货人信息，中奖时此信息将自动填写到收货地址表单         | 否       | Object                               |
|              | cardIdRequest         | 是否要求填写或验证身份证<br />状态：1 隐藏身份证，2 验证身份证，3 身份证为空时不验证有填写时验证，4 不验证身份证 | 否       | Number                               |
|              | emBase                | em基准像素，Game将把此值写入到parentId的style.fontSize中，子元素将以此为单位基准，默认计算window宽度 | 否       | Number                               |
|              | onCancel              | 取消中奖结果或取消中奖后填写地址时的回调                     | 否       | Function                             |
|              | onEnsure              | 确定中奖结果或完成中奖填写地址时的回调                       | 否       | Function                             |
|              | loading               | 设置Loading的属性,也可以在style中设置<br />[document](<http://www.eightfeet.cn/Loading/>) | 否       | Object                               |
| 显示文字定义 | failedModalTitle      | 未中奖弹窗标题                                               | 否       | String                               |
|              | submitFailedText      | 未中奖按钮文字                                               | 否       | String                               |
|              | successModalTitle     | 中奖弹窗标题                                                 | 否       | String                               |
|              | submitSuccessText     | 中奖按钮文字                                                 | 否       | String                               |
|              | submitAddressText     | 中奖去填写地址按钮文字                                       | 否       | String                               |



#### <span id="prizes">prizes 结构</span>

> 奖品是一个数组，游戏将根据奖品数组渲染页面，奖品数组的每一项必须包含以下属性

 ```javascript
prizes = [{
	"prizeId": 1, // 奖品id
	"prizeType": 1, // 奖品类型 0 未中奖, 1 实物, 2 虚拟
	"receiveType": 1, // 领取方式。1：默认；2：填写地址；3：链接类；4：虚拟卡
	"prizeAlias": "巴西绿蜂胶", // 奖品别名
	"prizeName": "蜂胶软胶囊彩盒装（60粒，巴西绿蜂胶）", // 奖品名称
	"awardMsg": null, // 中奖提示信息
	"gameImg": "./assets/images/card1.png", // 游戏图片
	"prizeImg": "./assets/images/prize1.jpg", // 奖品图片
	"memo": "奖品的备注说明！" // 奖品备注
},{...}]
 ```



#### case

```javascript
import { Game } from '@byhealth/lotteryflip';

const LotteryGame = new Game({
          targetId: "target",
          parentId: "parentId",
          playerPhone: "13635219421",
          cardIdRequest: 3, 
          style: window.themedata1,
          start: () => new Promise((resolve) => {
                window.LotteryGame1.Loading.show();
                window.setTimeout(() => {
                	window.LotteryGame1.Loading.hide();
                	resolve(prizes1[Math.floor(Math.random() * rand)]);
                }, 1000);
            }),
          saveAddress: data => new Promise((resolve) => {
                window.LotteryGame1.Loading.show();
                window.setTimeout(() => {
                    console.log('地址信息', data);
                	window.LotteryGame1.Loading.hide();
                	resolve();
                }, 3000);
            }),
          receiverInfo: {
              idCard: "430522201008124611",
              receiverPhone: "13622841234",
              address: "address"
          },
          checkVerificationCode: data => new Promise((resolve) => {
                window.LotteryGame1.Loading.show();
                window.setTimeout(() => {
                    console.log('手机验证码', data);
                	window.LotteryGame1.Loading.hide();
                	resolve();
                }, 3000);
            }), // 检查手机验证码
          prizes: {
			...
          },
          emBase: 10,
          onCancel: () => console.log('关闭中奖结果'),
          onEnsure: function(prize){ console.log('确定中奖结果1！', prize); },
          loading: {
            size: 20,
            length: 5,
            cycleTime: 1
          }
    });
    
```
