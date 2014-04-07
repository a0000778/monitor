/***************************************
多伺服器監控 v1.X 模組 dns v2.0 by a0000778
授權方式：CC-BY-SA-3.0
***************************************/
var dns=require('dns');

function dnsMonitor(domain,record,freq,callback){
	this.domain=domain;
	this.records=record;
	this.callback=callback;
	this.daemon=setInterval(this.check.bind(this),freq);
}
dnsMonitor.prototype.check=function(){
	for(record in this.records){
		dns.resolve(this.domain,record,this.diff.bind(this,record,this.records[record]));
	}
}
dnsMonitor.prototype.diff=function(record,configRecord,err,returnRecord){
	if(err){
		this.callback.fail(err,record);
		return;
	}
	switch(record){
		case 'A':
		case 'AAAA':
		case 'CNAME':
		case 'NS':
		case 'TXT':
			if(configRecord.length!=returnRecord.length){
				this.callback.fail(err,record);
				return;
			}
			if(
				configRecord.reduce(function(re,record){
					if(!re.result) return re;
					var index=re.record.indexOf(record);
					if(index>=0) re.record.splice(index,1);
					else re.result=false;
					return re;
				},{
					'result': true,
					'record': returnRecord
				}).result
			) this.callback.success(err,record);
			else this.callback.fail(err,record);
		break;
		case 'MX':
			if(configRecord.length!=returnRecord.length){
				this.callback.fail(err,record);
				return;
			}
			if(
				configRecord.reduce(function(re,record){
					if(!re.result) return re;
					var index=re.record.exchange.indexOf(record);
					if(index>=0){
						re.record.exchange.splice(index,1);
						re.record.priority.splice(index,1);
					}else re.result=false;
					return re;
				},{
					'result': true,
					'record': returnRecord.reduce(function(result,record){
						result.exchange.push(record.exchange);
						result.priority.push(record.priority);
					},{'exchange':[],'priority':[]})
				}).result
			) this.callback.success(err,record);
			else this.callback.fail(err,record);
		break;
		default:
			this.callback.fail('未知的記錄類型',record);
	}
}

module.exports={
	'version': '2.0',
	'createMonitor': function(config){
		return new dnsMonitor(config.domain,config.records,config.freq,{
			'success': config.success,
			'fail': config.fail
		});
	}
}
