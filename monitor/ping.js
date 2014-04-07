/***************************************
多伺服器監控 v1.X 模組 ping v2.0 by a0000778
授權方式：CC-BY-SA-3.0
***************************************/
var ping=require('net-ping');

Math.rand=function(min,max){
	return Math.floor(Math.random()*(max+1))+min;
}

function pingMonitor(address,freq,timeout,callback){
	this.address=address;
	this.timeout=timeout;
	this.callback=callback;
	this.session=ping.createSession({
		'networkProtocol': ping.NetworkProtocol[(address.indexOf(':')<0? 'IPv4':'IPv6')],
		'sessionId': Math.rand(1,65535),
		'timeout': 1000
	});
	this.daemon=setInterval(this.check.bind(this),freq);
}
pingMonitor.prototype.check=function(){
	this.session.pingHost(this.address,function(error,target,sent,rcvd){
		var time=rcvd-sent;
		if(error || time>this.timeout) this.callback.fail(error? error:'timeout',time);
		else this.callback.success(error,time);
	}.bind(this));
}

module.exports={
	'version': '1.0',
	'createMonitor': function(config){
		if(process.platform!=='win32' && process.getuid()!=0){
			return '非 Windows 需要 root 權限才可進行 ping';
		}
		return new pingMonitor(config.address,config.freq,config.timeout,{
			'success': config.success,
			'fail': config.fail
		});
	}
}
