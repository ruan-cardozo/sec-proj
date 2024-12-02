import moment from 'moment';

export function _log() {
	console.log('>', moment().format('DD/MM/YYYY HH:mm:ss') + ':', Array.from(arguments).join(' '));
}