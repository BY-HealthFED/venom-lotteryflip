```javascript
    /**
	 *
	 * @param { Object } params
	 * params = {playerPhone, receiverName, receiverPhone, cardIdRequest, region, regionName, address, idCard}
	 * @memberof AddressModal
	 */
	updateParams = (params)
```

### prizes 结构
```javascript
    [
        {
            "prizeId": 1,
            "prizeType": 0, // 未中奖
            "prizeName": "一等奖",
            "status": 1,
            "awardMsg": "亲！恭喜您获得一等奖！",
            "prizeImg": "./assets/prize1.png",
            "memo": "该奖品由xxx统一提供！"
        }, {
            "prizeId": 1,
            "prizeType": 1, // 实物
            "prizeName": "一等奖",
            "status": 1,
            "awardMsg": "亲！恭喜您获得一等奖！",
            "prizeImg": "./assets/prize1.png",
            "memo": "该奖品由xxx统一提供！"
        }, {
            "prizeId": 1,
            "prizeType": 3, // 虚拟
            "prizeName": "一等奖",
            "status": 1,
            "awardMsg": "亲！恭喜您获得一等奖！",
            "prizeImg": "./assets/prize1.png",
            "memo": "该奖品由xxx统一提供！"
        }
    ]
```

### case
```javascript
import Modal from '@eightfeet/modal';

var newModal = new Modal({
        id: 'ModalId', // 模板节点id 不传可自动生成id
        zIndex: 100, // modal的层级关系，默认100
        Animation: false, // 启用动画 默认true
        closable: false, // 可关闭 默认true
        shouldCloseOnOverlayClick: true, // 点击背景层关闭弹窗 默认false
        style: { // 定义modal样式 {overlay: 覆盖层, content: 内容区, close: 关闭按钮} 
            overlay: {
                backgroundColor: 'rgba(0,0,0,0.5)'
            },
            content: {
                backgroundColor: 'rgba(100, 100, 100, 0.2)',
                width: '19em',
                // padding: '120px',
                // 设置内容的层级关系
                zIndex: 107
            },
            close: {
                backgroundColor: 'rgba(0, 0, 0, 1)',
                width: '1em',
                height: '1em',
                top: '-3em',
                left: '50%'
            },
            // modify(修饰层)层级按照zIndex（modal的层级）以2为步值递增
            modify: [
                {
                    backgroundColor: 'rgba(0, 0, 255, 0.4)',
                    width: '120%',
                    left: '-10%',
                    height: '200px',
                    border: '1px solid rgba(0, 0, 255, 0.6)',
                    top: '-5em'
                },
                {
                    backgroundColor: 'rgba(0, 0, 255, 0.4)',
                    width: '130%',
                    left: '-15%',
                    height: '200px',
                    border: '1px solid rgba(0, 0, 255, 0.6)',
                    top: '-4em'
                },
                {
                    backgroundColor: 'rgba(0, 0, 255, 0.4)',
                    width: '140%',
                    left: '-20%',
                    height: '200px',
                    border: '1px solid rgba(0, 0, 255, 0.6)',
                    top: '-3em'
                },
                {
                    backgroundColor: 'rgba(0, 0, 255, 0.4)',
                    width: '150%',
                    left: '-25%',
                    height: '200px',
                    border: '1px solid rgba(0, 0, 255, 0.6)',
                    top: '-2em'
                }
            ]
        }
    });
    var btn = document.getElementById('example');
    var btnshow = document.getElementById('exampleshow');
    btn.onclick = function(){ 
        return newModal.create({
            header:'<div style="position:relative; z-index: 90;background-color: yellow;">头部</div>',
            main: `<div style="background-color: #fff;">
                        这是一段内容这是一段内容
                        <input id="inp" type="text" />
                    </div>`,
            footer: `<div style="background-color: white">
                        <button id="close" style="border:1px solid #aaa; padding: 1em">确定</button>
                        <br>
                        脚部
                    </div>`
        }, true).then(function(){
            document.getElementById('close').onclick = function(){
                console.log(document.getElementById('inp').value);
                return newModal.hide(true);
            };
        });
    }
    btnshow.onclick = function(){
        newModal.show();
    };
```
