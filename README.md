## lotteryflip

翻牌抽奖 
[demo](https://by-healthfed.github.io/venom-lotteryflip/dist)

#### parame

| 参数                  | 说明                   | 是否必填 | 备注                                                         | 类型     |
| --------------------- | ---------------------- | -------- | ------------------------------------------------------------ | -------- |
| parentId              | Game挂载Id             | 是       | 游戏将要寄生的Node Id                                        | String   |
| targetId              | Game自身Id             | 否       | 默认game-target-时间戳+100以内随机数                         | String   |
| style                 | Game皮肤定义           | 是       | 定义游戏模块的UI展示效果                                     | Object   |
| start                 | 启动抽奖方法           | 是       | 务必返回promise方法且resolve了中奖奖品，<br />start: () => new Promis((resolve, reject) => {<br />    resolve(**prize**)<br />}).catch(error => console.error(error))<br /> | Function |
| saveAddress           | 保存收货人地址回调方法 | 是       | 接收省市区地址参数<br />saveAddress = function(data){<br />    console.log(data)<br />} | function |
| prizes                | 奖品参数               | 是       |                                                              | Object   |
| playerPhone           | 参与人电话             | 否       |                                                              | String   |
| checkVerificationCode | 验证参与人电话回调方法 | 否       |                                                              | Function |
| receiverInfo          | 默认收货人信息         | 否       |                                                              | Object   |
| cardIdRequest         | 是否要求填写身份证     | 否       | 状态：1 隐藏身份证，2 验证身份证，3 身份证为空时不验证有填写时验证，4 不验证身份证 | Number   |
| onCancel              | 取消时的回调           | 否       | 取消中奖结果或取消中奖后填写地址                             | Function |
| onEnsure              | 确定时的回调           | 否       | 确定中奖结果或完成中奖填写地址后                             | Function |
| failedModalTitle      | 未中奖弹窗标题         | 否       |                                                              | String   |
| submitFailedText      | 未中奖按钮文字         | 否       |                                                              | String   |
| successModalTitle     | 中奖弹窗文字           | 否       |                                                              | String   |
| submitSuccessText     | 中奖按钮文字           | 否       |                                                              | String   |
| submitAddressText     | 中奖保存地址按钮文字   | 否       |                                                              | String   |
| emBase                | em基准像素             | 否       |                                                              | Number   |
| loading               | 设置Loading            | 否       | {<br />    size:20 尺寸大小,按百分比计算<br />    length:5 由几个点组成，默认12个<br />    cycleTime: 0.5 周期，动画旋转一周的时间<br />} | Object   |
|                       |                        |          |                                                              |          |
|                       |                        |          |                                                              |          |

#### prizes 结构

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





```javascript
import { Game } from '@byhealth/LotteryFlip';

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
