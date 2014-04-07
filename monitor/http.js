/***************************************
多伺服器監控 v3.1 模組 http v1.0 by a0000778
授權方式：CC-BY-SA-3.0
***************************************/
var http=require('http');

function httpMonitor(address,port,freq,timeout,callback){
	this.address=address;
	this.port=port;
	this.timeout=timeout;
	this.callback=callback;
	this.daemon=setInterval(this.check.bind(this),freq);
}
httpMonitor.prototype.check=function(){
	var startTime=new Date();
	var connect=http.request({
		'hostname': this.address,
		'port': this.port
	},function(startTime,res){
		if(Math.floor(res.statusCode/200)===1)
			this.callback.success(res.statusCode,new Date().getTime()-startTime.getTime());
		else
			this.callback.fail(res.statusCode,new Date().getTime()-startTime.getTime());
		res.on('end',function(){
			res.end();
		});
	}.bind(this,startTime));
	connect.setSocketKeepAlive(false);
	connect.setTimeout(this.timeout);
	connect.on('error',function(startTime,err){
		this.callback.fail(err,new Date().getTime()-startTime.getTime());
	}.bind(this,startTime));
	connect.end();
}

module.exports={
	'version': '3.1',
	'createMonitor': function(config){
		return new httpMonitor(config.address,config.port,config.freq,config.timeout,{
			'success': config.success,
			'fail': config.fail
		});
	}
}
