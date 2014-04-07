/***************************************
多伺服器監控 v1.X 模組 ftp v1.2 by a0000778
授權方式：CC-BY-SA-3.0
***************************************/
var ftp=require('ftp');

function ftpMonitor(address,port,secure,auth,freq,timeout,callback){
	this.address=address;
	this.port=port;
	this.secure=secure;
	this.auth=auth;
	this.timeout=timeout;
	this.callback=callback;
	this.daemon=setInterval(this.check.bind(this),freq);
}
ftpMonitor.prototype.check=function(){
	var startTime=new Date();
	var session=new ftp();
	session.connect({
		'host': this.address,
		'port': this.port,
		'secure': this.secure.use,
		'user': this.auth.username,
		'password': this.auth.password,
		'connTimeout': this.timeout,
		'pasvTimeout': this.timeout,
		'secureOptions': this.secure.options
	});
	session.on('ready',function(startTime,session,err){
		var time=new Date().getTime()-startTime.getTime();
		if(time>this.timeout) this.callback.fail('timeout',time);
		else this.callback.success(null,time);
		session.end();
	}.bind(this,startTime,session));
	session.on('error',function(startTime,session,err){
		this.callback.fail(err,new Date().getTime()-startTime.getTime());
		session.end();
	}.bind(this,startTime,session));
}

module.exports={
	'version': '1.2',
	'createMonitor': function(config){
		return new ftpMonitor(config.address,config.port,{
			'use': config.secure.use,
			'options': config.secure.options
		},{
			'username': (config.auth.username? config.auth.username:'anonymous'),
			'password': (config.auth.password? config.auth.password:'')
		},config.freq,config.timeout,{
			'success': config.success,
			'fail': config.fail
		});
	}
}
