import { Loading, AddressModal, NoticeModal, validate, Message, Modal, htmlFactory } from '@byhealth/walle';
const { inlineStyle } = htmlFactory;

import Game from './modules/Game';


if (window.Promise === undefined) {
	throw new Error('Promise pollyfill not found.');
}

module.exports = {Game, NoticeModal, Loading, validate, Message, Modal, AddressModal, inlineStyle};

