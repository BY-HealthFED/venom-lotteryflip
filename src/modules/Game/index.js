import { Loading, ResultModal, AddressModal, htmlFactory, tools } from '@eightfeet/walle';

import s from './template/game.scss';
import { renderGame } from './template';

const { inlineStyle, createDom, removeDom } = htmlFactory;
const { dormancyFor,  isObject} = tools;

// 设定必要初始值
const stepX = 16.66666;
const stepY = 25;

const Arr = {
	1: [[1,2]],
	2: [[1,1],[1,3]],
	3: [[1,1],[1,3],[2,2]],
	4: [[1,1],[1,3],[2,1],[2,3]],
	5: [[1,0],[1,2],[1,4],[2,1],[2,3]],
	6: [[1,0],[1,2],[1,4],[2,0],[2,2],[2,4]]
};
let timer = null;
let timerB = null;

let oldStyle = null;

const stamp = (new Date()).getTime();
/**
 *
 * 洗牌工具
 * @param { Array } arr
 * @returns
 */
function KdShuffle(arr){
	let len = arr.length,
		i,temp;
	while (len){
		i = Math.floor(Math.random() * len--);
		temp = arr[i];
		arr[i] = arr[len];
		arr[len] = temp;
	}
	return arr;
}

/**
 *
 * 核心翻牌游戏模块
 * @class Game
 */
class Game {
	/**
	 * Creates an instance of Game.
	 * config = {...}
	 *   targetId GameId 默认game-target-时间戳+100以内随机数
	 *   parentId Game挂载Id
	 *   style = { ... }
	 *     GameTheme 游戏皮肤
	 *     SuccessModalTheme 成功弹窗皮肤
	 *	   AddressModalTheme 地址填写皮肤
	 *     LoadingTheme loading皮肤
	 *   start 启动抽奖方法 必填
	 *   saveAddress 保存收货人地址方法 必填
	 *   prizes 奖品参数
	 *   playerPhone 参与人电话
	 *   checkVerificationCode 验证参与人电话
	 *   receiverInfo 默认收货人信息
	 *   cardIdRequest 要求验证身份证  1 隐藏身份证，2 验证身份证，3 身份证为空时不验证有填写时验证，4 不验证身份证
	 *   onCancel 取消时的回调（取消中奖结果或取消填写地址）
	 *   onEnsure 确定时的回调（确定或完成填写地址后）
	 *   failedModalTitle 未中奖弹窗标题
	 *   submitFailedText 未中奖按钮文字
	 *   successModalTitle 中奖弹窗文字
	 *   submitSuccessText 中奖按钮文字
	 *   submitAddressText 中奖保存地址按钮文字
	 * 	 emBase {Number} em基准像素
	 *   loading = { ... } 设置
	 *      size: 20, // 尺寸大小 默认20
     *      length: 5, // 由几个点（vertices）组成默认12个
     *      cycle: 0.5, // 旋转一周的周期时间，单位s
	 * @param {Object} config
	 * @memberof Game
	 */
	/**
	 * 单条游戏奖品数据结构
	 * prize = {
     *   "prizeId": 1, // 奖品id
     *   "prizeType": 1, // 奖品类型 0 未中奖, 1 实物, 2 虚拟
     *   "receiveType": 1, // 领取方式。1：默认；2：填写地址；3：链接类；4：虚拟卡
     *   "prizeAlias": "巴西绿蜂胶", // 奖品别名
     *   "prizeName": "蜂胶软胶囊彩盒装（60粒，巴西绿蜂胶）", // 奖品名称
     *   "awardMsg": null, // 中奖提示信息
     *   "gameImg": "./assets/images/card1.png", // 游戏图片
     *   "prizeImg": "./assets/images/prize1.jpg", // 奖品图片
     *   "memo": "奖品的备注说明！" // 奖品备注
     * }
	 */
	constructor(config){
		const {
			targetId, parentId, style,
			outerFrameId,
			start, saveAddress,
			prizes, playerPhone, receiverInfo,
			cardIdRequest, checkVerificationCode,
			onCancel, onEnsure,
			failedModalTitle, successModalTitle,
			submitSuccessText, submitAddressText, submitFailedText,
			emBase,
			loading
		} = config;
		const { GameTheme, SuccessModalTheme, FailedModalTheme, AddressModalTheme, MessageTheme, LoadingTheme } = style;

		this.Game             = document.getElementById('target');
		this.GameTheme        = GameTheme;
		this.targetId         = targetId || `game-target-${stamp}${window.Math.floor(window.Math.random()*100)}`;
		this.parentId         = parentId;
		this.prizes           = prizes.slice(0,6);
		this.lotteryDrawing   = false;
		this.emBase           = emBase || null;
		
		this.loadingSet = isObject(loading) ? loading : {};
		
		this.SuccessModal     =
		new ResultModal({
			outerFrameId,
			style:SuccessModalTheme,
			modalTitle:successModalTitle,
			// 重制游戏时嫁接onCancel方法
			onCancel: this.onCancel(onCancel),
			submitText: submitSuccessText,
			onEnsure,
			submitAddressText
		});

		this.FailedModal      =
		new ResultModal({
			outerFrameId,
			style:FailedModalTheme,
			submitText:submitFailedText,
			modalTitle:failedModalTitle,
			// 重制游戏时this.onCancel嫁接onCancel方法
			onCancel: this.onCancel(onCancel)
		});

		this.AddressModal     = new AddressModal({ AddressModalTheme,outerFrameId, MessageTheme, playerPhone, receiverInfo, cardIdRequest, checkVerificationCode });
		const data = {style:LoadingTheme, parentId:outerFrameId, ...this.loadingSet};
		this.Loading          = new Loading(data);
		this.start            = start || function(){ throw '无抽奖方法';};
		// 重制游戏时this.onSaveAddress嫁接saveAddress方法
		this.saveAddress      = this.onSaveAddress(saveAddress);
		
		this.initTheme();
	}

	/**
	 * 放弃中奖结果时重置游戏
	 * @param { Function } cancel 承接放弃中奖结果方法
	 * @memberof Game
	 */
	onCancel = (cancel) => () => {
		cancel();
		this.reset();
	}

	/**
	 * 保存地址成功后重置游戏
	 * @param { Function } saveAddress 承接保存地址方法
	 * @memberof Game
	 */
	onSaveAddress = (saveAddress) => (data) => {
		if (saveAddress && typeof saveAddress === 'function') {
			return saveAddress(data)
				.then(() => this.reset());
		}
		return () => {
			throw '无保存地址方法';
		};
	}

	/**
	 * 修改和保存地址
	 * @param { Function } callback 承接保存地
	 * @memberof Game
	 */
	handleSaveAddress = (callback) => {
		this.AddressModal.showModal(this.saveAddress, callback);
	}

	/**
	 *
	 * 销毁Game
	 * @memberof Game
	 */
	distory = () => {
		this.Loading.reset();
		const mobileSelect = document.querySelector('.mobileSelect');
		mobileSelect && mobileSelect.parentNode.removeChild(mobileSelect);
		Promise.all([
			removeDom(this.targetId),
			removeDom(this.Loading.id),
			removeDom(this.SuccessModal.state.id),
			removeDom(this.FailedModal.state.id),
			removeDom(this.AddressModal.state.id),
			removeDom(this.AddressModal.state.id)
		])
			.then()
			.catch(err => console.log(err));
	}
	

	/**
	 *
	 * 初始化翻牌模板
	 * @memberof Game
	 */
	initTheme = () => {
		const prizesLength = this.prizes.length;
		const itemPosition = Arr[prizesLength];
		return createDom(
			renderGame(
				this.GameTheme,
				this.prizes
			),
			this.targetId,
			this.parentId,
			this.emBase
		)
			.then(() => {
				const target = document.getElementById(this.targetId);
				target.classList.add(s.target);
				return dormancyFor(200);
			})
			.then(() => {
				const target = document.getElementById(this.targetId);
				const items = target.querySelector(`.${s.wrap}`).children;
				for (let index = 0; index < items.length; index++) {
					const element = items[index];
					element.style.left = `${itemPosition[index][1]*stepX}%`;
					element.style.top = `${itemPosition[index][0] === 1 ? 0 : stepY*2}%`;
					element.children[0].onclick = e => {
						return this.lottery(index, e);
					};
				}
			});
	}

	/**
	 *
	 * 抽奖
	 * @param {Number} index 索引值
	 * @returns
	 * @memberof Game
	 */
	lottery = index => {
		if (this.lotteryDrawing) {
			return Promise.reject('当前正在抽奖！');
		}
		const target = document.getElementById(this.targetId);
		const items = target.querySelector(`.${s.wrap}`).children;
		const element = items[index].children[0];
		this.lotteryDrawing = true;
		Promise.resolve()
			.then(() => this.start())
			.then(res => {
				return Promise.resolve()
					.then(() => this.distributePrize(element, res))
					.then(() => this.flip(element))
					.then(() => dormancyFor(600))
					.then(() => this.flipAll(180))
					.then(() => dormancyFor(600))
					.then(() => new Promise(resolve => resolve(res)));
			})
			.then(res => {
				if (res.prizeType === 0) {
					return this.showFailedModal(res);
				}
				return this.showSuccessModal(res);
			})
			.catch(err => {
				this.lotteryDrawing = false;
				console.error(err);
			});
	}

	/**
	 * 分发奖品到对应卡牌
	 * @param { HtmlNode } target 触发的目标卡牌
	 * @param { Object } prize 当前中奖对象
	 * @memberof Game
	 */
	distributePrize = (target, prize) => {
		const { prizeImage, prizeTitle, cardSelected } = this.GameTheme;
		const flipIndex = parseInt(target.getAttribute('data-index'), 10);
		// 1、奖品组中过滤掉已中奖品
		let newPrizeArr = this.prizes.filter((item) => item.prizeId !== prize.prizeId);
		// 2、洗牌取出的奖品
		newPrizeArr = KdShuffle(newPrizeArr);
		// 3、在索引位置（对应target所在Dom中的索引位）插入所中奖品，
		newPrizeArr.splice(flipIndex, 0, prize);
		// 4、将新排位的奖品结果写入Dom

		const game = document.getElementById(this.targetId);
		for (let index = 0; index < newPrizeArr.length; index++) {
			const element = newPrizeArr[index];
			game.querySelector(`.${s.wrap}`).children[index].querySelector(`.${s.back}`).innerHTML =
			`<div style="${prizeImage && inlineStyle(prizeImage)}">
				<img src="${element.prizeImg}" />
			</div>
			<div style="${prizeTitle && inlineStyle(prizeTitle)}">
				${element.prizeAlias}
			</div>`;
		}
		const prizeDom = target.querySelector(`.${s.back}`);
		oldStyle = prizeDom.getAttribute('style');
		prizeDom.setAttribute('style', `${oldStyle}; ${cardSelected && inlineStyle(cardSelected)}`);
	}

	/**
	 *
	 * 翻转卡牌180度
	 * @returns Promise
	 * @param { HtmlNode } element
	 * @memberof Game
	 */
	flip = (element) => new Promise(resolve => {
		element.style.transform = 'rotateY(180deg)';
		element.style.webkitTransform = 'rotateY(180deg)';
		setTimeout(() => {
			resolve();
		}, 200);
	})

	/**
	 *
	 * 翻转全部卡牌
	 * @returns Promise
	 * @param {Number} deg 翻转角度，180或0
	 * @memberof Game
	 */
	flipAll = (deg) => new Promise(resolve => {
		const target = document.getElementById(this.targetId);
		const items = target.querySelector(`.${s.wrap}`).children;
		for (let index = 0; index < items.length; index++) {
			const element = items[index];
			element.children[0].style.transform = `rotateY(${deg}deg)`;
			element.children[0].style.webkitTransform = `rotateY(${deg}deg)`;
		}
		setTimeout(() => {
			resolve();
		}, 200);
	})

	/**
	 *
	 * 重置抽奖
	 * @memberof Game
	 */
	reset = () => {
		const prizesLength = this.prizes.length;
		const itemPosition = Arr[prizesLength];
		const target = document.getElementById(this.targetId);
		const items = target.querySelector(`.${s.wrap}`).children;
		this.flipAll(0);
		window.clearTimeout(timer);
		timer = setTimeout(() => {
			for (let index = 0; index < items.length; index++) {
				const element = items[index];
				element.style.left = null;
				element.style.top = null;
			}
		}, 200);
		
		window.clearTimeout(timerB);
		timerB = setTimeout(() => {
			this.lotteryDrawing = false;
			for (let index = 0; index < items.length; index++) {
				const element = items[index];
				element.style.left = `${itemPosition[index][1]*stepX}%`;
				element.style.top = `${itemPosition[index][0] === 1 ? 0 : stepY*2}%`;
				oldStyle && element.querySelector(`.${s.back}`).setAttribute('style', `${oldStyle}`);
			}
		}, 800);
	}

	/**
	 *
	 * 显示中奖信息
	 * 实物奖品时填写收货地址
	 * @param {Object} prize
	 * @returns
	 * @memberof Game
	 */
	showSuccessModal = (prize) => {
		return this.SuccessModal.showModal(prize)
			.then(prize => {
				// 1：默认；2：填写地址；3：链接类；4：虚拟卡
				if (prize.receiveType === 2) {
					this.AddressModal.showModal(this.saveAddress, () => {
						this.showSuccessModal(prize);
					});
				} else {
					Promise.resolve()
						.then(() => dormancyFor(800))
						.then(() => this.reset());
				}
			});
	}

	/**
	 *
	 * 显示中奖信息
	 * 实物奖品时填写收货地址
	 * @param {Object} prize
	 * @returns
	 * @memberof Game
	 */
	showFailedModal(prize){
		return this.FailedModal.showModal(prize).
			then(() => this.reset());
	}

}


export default Game;