/***************************************
多伺服器監控 v1.0 by a0000778
授權方式：CC-BY-SA-3.0

Date.getFormatTime 為 a0000778 的函式庫，
授權方式：CC-BY-3.0
***************************************/
Date.prototype.getFormatTime=function(format,str){
	"use strict"
	var str=str? {
		'ampm': str.ampm? str.ampm:['AM','PM'],
		'week': str.week? str.week:['日','一','二','三','四','五','六']
	}:{'ampm':['AM','PM'],'week':['日','一','二','三','四','五','六']};
	var at=0;
	var re='';
	var c='';
	var z=function(num,len){
		num=num.toString();
		while(num.length<len)
			num='0'+num;
		return num;
	}
	while(at<format.length){
		c=format.charAt(at);
		switch(c){
			case 'Y': re+=this.getFullYear(); break;
			case 'm': re+=this.getMonth()+1; break;
			case 'M': re+=z(this.getMonth()+1,2); break;
			case 'd': re+=this.getDate(); break;
			case 'D': re+=z(this.getDate(),2); break;
			case 'a': re+=(this.getHours()<12)? str.ampm[0]:str.ampm[1]; break;
			case 'w': re+=str.week[this.getDay()]; break;
			case 'h':
				var h=this.getHours();
				re+=(h<12)? h:h-12;
			break;
			case 'H':
				var h=this.getHours();
				re+=z(((h<12)? h:h-12),2);
			break;
			case 'g': re+=this.getHours(); break;
			case 'G': re+=z(this.getHours(),2); break;
			case 'i': re+=this.getMinutes(); break;
			case 'I': re+=z(this.getMinutes(),2); break;
			case 's': re+=this.getSeconds(); break;
			case 'S': re+=z(this.getSeconds(),2); break;
			case 'u': re+=this.getMilliseconds(); break;
			case 'U': re+=z(this.getMilliseconds(),3); break;
			default: re+=c;
		}
		at++;
	}
	return re;
}

module.exports={
	'format': 'Y/M/D G:I:S',
	'log': function(msg){
		console.log('%s: %s',new Date().getFormatTime(this.format),msg);
	}
}
