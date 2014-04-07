/***************************************
多伺服器監控 v1.0 by a0000778
授權方式：CC-BY-SA-3.0
監控模組：./monitor/[a-zA-Z0-9_-]+\.js
***************************************/
var version='1.0';
var config=require('./config.js');
var stdmsg=require('./log.js');
stdmsg.format=config.timeFormat;
stdmsg.log('多伺服器監控 v'+version+' by a0000778');
stdmsg.log('授權方式：CC-BY-SA-3.0');
var monitors=[];
config.monitors.forEach(function(monitor){
	if(!this.modules.hasOwnProperty(monitor.type)){
		stdmsg.log('模組 '+monitor.type+' 不存在，項目 '+monitor.name+' 跳過');
		return;
	}
	for(configName in monitor){
		if('function'===typeof monitor[configName])
			monitor[configName]=monitor[configName].bind(monitor);
	}
	for(configName in this.default){
		if(!monitor.hasOwnProperty(configName)){
			if('function'===typeof this.default[configName])
				monitor[configName]=this.default[configName].bind(monitor);
			else 
				monitor[configName]=this.default[configName];
		}
	}
	stdmsg.log('建立項目 '+monitor.name+' ...');
	var monitorObj=this.modules[monitor.type].createMonitor(monitor);
	if('string'!==typeof monitorObj) this.monitors.push(monitorObj);
	else stdmsg.log(monitorObj);
},{
	'default': config.default,
	'modules': require('fs').readdirSync('./monitor').reduce(function(re,fileName){
		if(!/^[a-zA-Z0-9_-]+\.js$/.test(fileName)) return;
		var moduleName=fileName.substring(0,fileName.length-3);
		try{
			re[moduleName]=require('./monitor/'+fileName);
			stdmsg.log('載入模組 '+moduleName+' '+re[moduleName].version);
		}catch(e){
			stdmsg.log('載入模組 '+moduleName+' 失敗: '+e.toString());
		}
		return re;
	},{}),
	'monitors': monitors
});

stdmsg.log('啟動完畢');
