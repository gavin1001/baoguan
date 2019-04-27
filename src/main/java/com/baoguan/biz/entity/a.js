/**
 * saveConsignment
 */

function setContaStatus(){
   //如果散货
   if ($("isBulk").value=="1"){
      $("cmdSaveConta").disabled=true;
      $("contaId1").disabled=true ;
   }else{
     $("cmdSaveConta").disabled=false ;
     $("contaId1").disabled=false ;
   }
}

function getOwnerInfo(inputCode,name,address,nextFocus){
   var code = $(inputCode).value ;
   var info = new OwnerInfo() ;
   prepItemCache.getOwnerInfoByCode(code,
        {
            callback:function (data)
            {
                info = data;
                if (null!=info)
                {
                  $(name).value = info.name ;
                  $(address).value = info.address ;
                  $("ownerOldCode").value = info.code ;
                  $("ownerOldName").value = info.name ;
                  $("ownerOldAdderss").value = info.address ;                                              
                 }
                
            }, 
			timeout:60000,
		    errorHandler:function(msg){alert(msg);}
        });
        $(nextFocus).focus() ;           
}
function updateOwnerInfo(codeValue,nameValue,addressValue){
   var code = $(codeValue).value ;
   var name = $(nameValue).value ;
   var address = $(addressValue).value ;   
   prepItemCache.updateOwnerInfo(code,name,address);
}
//校验订舱单号是否已被其他公司占用
function checkBookingNum(bookingNumTag){
	
	
   var bookNum = $(bookingNumTag).value ;
   if(bookNum==""){
	alert("请输入订舱单号！");
	//$("bookingNumber").focus();
	return ;
   }
   var upperBookNum =bookNum.toUpperCase();
   //alert("upperBookNum--->" + upperBookNum);
   $(bookingNumTag).value=upperBookNum;
   
   prepItemCache.getConsignByBookingNum(upperBookNum,
        {
            callback:function (data)
            {   
                if (data>0)
                {
                  if(confirm("该订舱单号已被其他公司使用,是否重新输入！")){
//                    $(bookingNumTag).focus() ; 
                  }      
                  return ;     
                }                
            }, 
			timeout:60000,
		    errorHandler:function(msg){alert(msg);}
        });        
}
//根据订舱单号得到总装船单号、总运单号、分装船单号、分运单号 modify by 
function getFourNumber(agentId) 
{
   
   var pingNum = "0" ;  //非拼箱
   //船代ID 
   if (agentId==""){
      alert("请选择船代.");
      $("shipagentId").focus();
      return ;
   }
  var str5=getShippingNo(agentId);
  
  var str2="";
  var str4="";
  var m = nowDate.getMonth()+1;
  var d = nowDate.getDate();
  if(m<10)m = '0'+m.toString();
  if(d<10)d = '0'+d.toString();
  str2 = m+''+d;
   
  $("shippingNo").value = str5; 
  $("dateNo").value=str2;
  $("subShippingNo").value= str4;  
  //设置隐藏域
  $("hidden_dateNo").value= str2;  
  $("hidden_subShippingNo").value= str4;  
  
  $("contractId").value=str5+str2+str4;  
  $("carrierId").focus();
  /**
   prepItemCache.getConsignmentSameNoWithBookNumber("",agentId,pingNum,
        {
            callback:function (data)
            {
                if (null!=data)
                {
                  //生成装船单号
                  var strShippingNo = data[0];
                  var str5="";
                  var str2="";
                  var str4="";
                  if(strShippingNo.length==11){
                  	str5=strShippingNo.substring(0,3);
                  	str2=strShippingNo.substring(3,7);
                  	str4=strShippingNo.substring(7,11);
                  }else if(strShippingNo.length==7){
                  	str5=strShippingNo.substring(0,3);
                  	str2=strShippingNo.substring(3,7);
                  }else{
                  	str2=strShippingNo.substring(strShippingNo.length-2);
                  	str5=strShippingNo.substring(0,strShippingNo.length-2);
                  }
                  
                  $("shippingNo").value = str5; 
                  $("dateNo").value=str2;
                  $("subShippingNo").value= str4;  
                  //设置隐藏域
                  $("hidden_dateNo").value= str2;  
                  $("hidden_subShippingNo").value= str4;  
                    
                  
                  $("contractId").value=strShippingNo;  
                  $("carrierId").focus();                
                  //$("subShippingNo").focus();                  
                 }                 
            }, 
			timeout:60000,
		    errorHandler:function(msg){alert(msg);}
        });  
       */
       //拼箱人代码设置为空，并不能填写
       $("consolidatorId").value="" ; 
       $("consolidatorId").readOnly=true ;
}
//对生成的装船单号(后两位)日期进行检查
function checkDateNo(obj){
	var data=obj.value;
	if(obj.value==""){
		obj.value=$("hidden_dateNo").value;
		$("contractId").value=$("shippingNo").value+ obj.value + $("subShippingNo").value;
		return;
	}
	if( isNaN(data) || data.length!=4 ){ 
     alert('请输入装船单号后面2位日期,数字类型,且输入长度必须是4位!');  
     obj.value=""; 
     $("contractId").value=$("shippingNo").value+ obj.value + $("subShippingNo").value;  
     obj.focus();
     return ;
   } else{
   	 $("contractId").value=$("shippingNo").value+ obj.value + $("subShippingNo").value;
   }  
}
// 保存预配舱单数据
function saveConsignmentData(){
    var btm=new BorderTransportMeans();
    btm.shipagentId=$("shipagentId").value;
    btm.transportId=$("transportId").value;
    btm.transportName=$("transportName").value;

    btm.journeyId=$("journeyId").value;
    btm.carrierId=$("carrierId").value;
    /*if ($("customsOfficeId").value=="")
    {
        btm.customsOfficeId="CNYTN" ;
    }
    else
    {
       btm.customsOfficeId=$("customsOfficeId").value;
    }*/
    btm.customsOfficeId="CNYTN" ;
    if($("borderTransportId").value!=''){
        btm.id=$("borderTransportId").value;
    }
   //运输方式默认：海运
    btm.typeCode="1";
    var info = new Consignment();
    info.borderTransport=btm;
    info.id=$("consgnId").value;
    info.referId=$("referId").value;
    info.agentId=$("shipagentId").value;
    info.contractId=$("contractId").value;
    info.associatedId=$("associatedId").value;    
    info.shippingNo=$("shippingNo").value + $("dateNo").value +$("subShippingNo").value.trim();
    info.conditionCode=$("conditionCode").value;
    info.grossVolumeMeasure=$("grossVolumeMeasure").value;
    info.packagesTypeCode=$("packagesTypeCode").value;
    info.loadingId=$("loadingId").value;  
    if($("loadingDate").value!="")
    {
        info.loadingDateNew = $("loadingDate").value;
    }
    /*************去掉转关启运地代码和转关目的地代码取值判断 --add by wangmin 20140327 start****************/
    //如果是转关，则获取转关启运地代码和转关目的地代码
    //if($("declType").value=="Z"){
    	    info.transhipmentLocationId=$("transhipmentLocationId").value;
    		info.transitDestinationId=$("transitDestinationId").value;    		
   // }else{
   // 	    info.transhipmentLocationId="";
   //		info.transitDestinationId="";
   //}
	/*************去掉转关启运地代码和转关目的地代码取值判断 --add by wangmin 20140327 end****************/
    info.quantityQuantity=$("quantityQuantity").value;
    info.totalGrossMassMeasure=$("totalGrossMassMeasure").value;
    info.methodCode=$("methodCode").value;
    info.bulkNum = $("bulkNum").value ; //拼几
    info.isBulk = parseInt($("isBulk").value) ;         //是否散货
    info.oldUnloadPort =''; 
    //$("oldUnloadPort").value ;//卸货港代码(旧)
    //分装船单号求值，现在已经没有什么用，因为分装船单号为空 add by cyx 20091231
	info.branShippingNo=$("branShippingNo").value+$("subBranShippingNo").value.trim();
	info.customsStatusCode=$("customsStatusCode").value;//货物海关状态
    info.consolidatorId =$("consolidatorId").value;  //拼箱人代码
   //收货人信息
    var consignee=new PersonInfo();
    if($("consigneeCode").value.trim() != ""){
    	consignee.code=$("consigneeType").value.trim()+"+"+$("consigneeCode").value.trim();	
    }else{
    	consignee.code=$("consigneeCode").value ;
    }
    consignee.name=$("consigneeName").value;
    consignee.aeo=$("consigneeAEO").value.trim().toUpperCase();
    consignee.typeCode="consignee";
   //收货人地址
    var address=new Address();
    address.line=$("consigneeLine").value;
    address.countryCode = $("consigneecountryCode").value.trim().toUpperCase();
    address.typeCode="consignee";
    consignee.address=address;
    
    //收货人联系号码
    var communication=new Communication();
    var communicationList=new Array();
    communication.typeId=$("consigneeConType").value;
    
    communication.code=$("consigneeConCode").value;
    communicationList[0]=communication;
    consignee.communicationList=communicationList;
    
    info.consignee=consignee;

   //发货人信息
    var consignor=new PersonInfo();
    //consignor.code=$("ownerCode").value ;
    //consignor.code="USCI"+$("consignorRealCode").value
    consignor.code=$("consignorTypeCode").value+$("consignorRealCode").value;
    consignor.name=$("consignorName").value;
    consignor.aeo=$("consignorAEO").value.trim().toUpperCase();
    consignor.typeCode="consignor";
   //发货人地址
    address=new Address();
    address.line=$("consignorLine").value;
    address.countryCode = $("consignorcountryCode").value.trim().toUpperCase();
    address.typeCode="consignor";
    consignor.address=address;
    //发货人联系号码
    var communication=new Communication();
    var communicationList=new Array();
    communication.typeId=$("consignorConType").value;
    communication.code=$("consignorConCode").value;
    communicationList[0]=communication;
    consignor.communicationList=communicationList;
    
    info.consignor=consignor;
    
    //var consigneeName = $("consigneeName").value.replace(/\s/g,"").toUpperCase();
    /*if($("notifyName").value!="" && consigneeName == "TOORDER")*/
    //通知人信息
    if($("notifyName").value!="")
    {
        var notifyParty=new PersonInfo();
        if($("notifyCode").value.trim() != ""){
        	notifyParty.code=$("notifyType").value.trim()+"+"+$("notifyCode").value.trim();	
        }else{
        	notifyParty.code=$("notifyCode").value ;
        }
        notifyParty.name=$("notifyName").value;
        notifyParty.typeCode="notify";
      //通知人地址
        if($("notifyLine").value!="")
        {
            address=new Address();
            address.line=$("notifyLine").value;
            address.countryCode = $("notifycountryCode").value.trim().toUpperCase();
            address.typeCode="notify";
            notifyParty.address=address;
        }
      //通知人联系号码
        var communication=new Communication();
        var communicationList=new Array();
        communication.typeId=$("notifyConType").value;
        communication.code=$("notifyConCode").value;
        communicationList[0]=communication;
        notifyParty.communicationList=communicationList;
        
        info.notifyParty=notifyParty;
    }
   // 危险品
    if($("isDanger").value=="1"){
        var undg=new PersonInfo();
        undg.name=$("undgName").value;
        //undg.code=$("undgCode").value ;
        undg.typeCode="undg";
      //联系方式
        if($("undgTel").value!=""){
            var communication=new Communication();
            var communicationList=new Array();
            communication.typeId=$("undgConType").value;
            communication.code=$("undgTel").value;
            communicationList[0]=communication;
            undg.communicationList=communicationList;
        }
        info.undgContact=undg;
    }
    
    
   //集装箱信息
    if(contaList.length>0){
        info.contaInfoList=contaList;
    }

   //货物信息
    if(goodsList.length>0){
        info.consignmentItemList=goodsList;
    }
   //老装船单需要的数据
    info.declType=$("declType").value;
    info.bookingNumber=$("bookingNumber").value;
    info.ownerCode=$("ownerCode").value;
    info.unloadPort=$("unloadPort").value;
    info.tradeMode=$("tradeMode").value;
    //info.taxRet=$("taxRet").value;
    //info.ownerCode=$("ownerCode").value;
    //info.ownerCode="USCI"+$("consignorRealCode").value;
    info.ownerCode=$("consignorTypeCode").value+$("consignorRealCode").value;
    info.hsCode='';
    //$("hsCode").value;
    info.mainGName=$("mainGName").value;
    info.isNoPaper=$("isNoPaper").value;
    info.billId=$("billId").value;
    info.manifestNo = $("manifestNo").value;
    
    
    return info;
}
var exlude_firms2 = [948, 1092, 2609, 1098, 2610, 769, 972];


/**
 * 保存预配舱单
 * @param {} strMethod :按钮功能
 * @param {} strPage :新增或是修改页面判断
 * @return {Boolean}
 */
function saveConsignment(strMethod,strPage){
	
	//页面数据验证不通过
	if(!checkPageData()){
		return ;
	}  
	var flag = true;
	if($('customsStatusCode').value != '001'){
		for(var i in exlude_firms2){
			if(exlude_firms2[i] == firmIds){
				flag = true; 
				break;
			}else{
				flag = false; 
			}
		}
	}
	
	if(!flag){
		alert('货物海关状态只能选择进出口货物');
		return false;
	}
	if(strMethod=="addNew"){//新增
		if(!confirm("确定要保存预配舱单吗？")){
			if(strPage=="add"){
				//document.location.href="prep_item.action";
			}			
			return;
		}	
	}else if(strMethod=="copy"){//复制
		if(!confirm("确定要保存并复制该预配舱单吗？")){
			if(strPage=="add"){ 
				//document.location.href="prep_item.action";
			}			
			return;
		}
	}else if(strMethod=="print"){//打印
		if(!confirm("确定要保存并打印该预配舱单吗？")){
			if(strPage=="add"){ 
				//document.location.href="prep_item.action";
			}			
			return;
		}
	}
	
	
	//csf 注释20170731
	/*var isEditOpen = true;
	var is_open_vadate =  document.getElementById("consgn_id_is_open_vadate");
    if(!!is_open_vadate){
    	if(is_open_vadate.value!=0){
    		isEditOpen = false;
    	}
    }	
	
	//验证码是否拼图成功判断
	var isoOpenVadate = jQuery("#isoOpenVadate").val();
	if(isoOpenVadate == 1 && isEditOpen){
		if(is_check != 1){
			alert("请先完成验证码拼图");
			return;
		}
	}*/


	
    var info=saveConsignmentData();
    
    if(info!=null){
    
        var contractId1 = info.contractId;
        var shippingNo1 = info.shippingNo;
        if(contractId1!=shippingNo1){
        	alert("提运单号与装船单号不匹配！");
        	return;
        }else{
        	if(contractId1.length!=11){
        		alert("提运单号长度为11位!");
        		return ;
        	}
            var yearStr = contractId1.substr(1,2);
        	var monthStr = contractId1.substr(3,2);   
        	if(monthStr=='13'){
        		yearStr = parseInt(yearStr) + 1;
        		info.contractId = contractId1.substr(0,1) + yearStr + '01' + contractId1.substr(5,10);
        		info.shippingNo = info.contractId;
        	}
        }
        
    	var btnId = '';
		if(strMethod=="addNew"){//新增
			btnId = 'cmdAddNew';
			
			//新增时执行是否控制录单限制检查  fish add 2014-02-21
			var imo = $("transportId").value;
			var journeyId = $("journeyId").value;
			var bookingNumber = $("bookingNumber").value;
			var isReturn = false;
			prepItemCache.checkBargeForCopy(imo,journeyId,bookingNumber,
            {
				async:false,
             	callback:function (data){
					if(data != null && data != ""){
						isReturn = true;
						alert(data);
						//alert("此单需到驳船管理处做船名确认后方可录单！");
					}
	    		}
	    	});
	    	if(isReturn == true)
				return;
			
		}else if(strMethod=="copy"){//复制
			btnId = 'cmdAddCopy';
			
			//新增时执行是否控制录单限制检查  fish add 2014-02-21
			var imo = $("transportId").value;
			var journeyId = $("journeyId").value;
			var bookingNumber = $("bookingNumber").value;
			var isReturn = false;
			prepItemCache.checkBargeForCopy(imo,journeyId,bookingNumber,
            {
				async:false,
             	callback:function (data){
					if(data != null && data != ""){
						isReturn = true;
						alert(data);
						//alert("此单需到驳船管理处做船名确认后方可录单！");
					}
	    		}
	    	});
	    	if(isReturn == true)
				return;
			
		}else if(strMethod=="print"){//打印
			btnId = 'cmdAddPrint';
		}else if(strMethod=="save"){//保存
			btnId = 'cmdSave';
		}
		
		
		//提交数据前对验证码进行第二次验证
//		if(isoOpenVadate == 1 && isEditOpen){
//			
//			var NECaptchaValidate = jQuery("#NECaptchaValidate").val()
//			var contextPath = jQuery("#contextPath").val();
//			//服务器验证状态
//			var serverVStatus = true ;
//			jQuery.ajax({  
//		        type: "post",  
//		        url:   contextPath+"/seconValidate",  
//		        data: {"valiType":"input","NECaptchaValidate":NECaptchaValidate},  
//		        dataType: "text",
//		        async: false,
//		        success: function(data){ 
//		        	if(data == 'false' ){
//		        		alert("服务器对验证码进行二次验证失败，请稍后再试")
//		        		serverVStatus = false;
//		        	}
//		        }  
//		    });
//			
//			if(!serverVStatus){
//				is_check = 0;
//	    		ins.refresh();
//				return;
//			}
//			
//		}
		//校验完成，进入验证码流程
		if(!checkValidateCode()){
			return;
		}
		
		var $t = jQuery('input:.form_button').attr("disabled","disabled");
		
		var serverCode = $("serverCode").value;
		var method = $("method").value;
		
		if (is_check!=2) {
			prepItemCache.saveConsignment(info,serverCode,method,
			//prepItemCache.saveConsignment(info,
            {
             callback:function (data){
                returnValue = data;
				//对返回数据项进行解析
                if(returnValue!=null&&returnValue.length>0)
                {
                	var flag = "id#_#id";
                	var index1 = returnValue[0].indexOf(flag);
                	if(index1>0){
                		if(returnValue.length > 1){
                			alert(returnValue[1]);
                			window.parent.close(window);
                		}else{
	                		var consignId = returnValue[0].substring(0, index1);
	                		if(strMethod=="save"){
	                    		document.location.href="list_item.action";
		                    }else if(strMethod=="addNew"){
		                    	document.location.href="prep_item.action";
		                    }else if(strMethod=="copy"){
		                    	document.location.href="copyAct_item.action?consignmentId=" + consignId;
		                    }else if(strMethod=="print"){
		                    	window.open("../report/shipOrder.action?ID=" + consignId);
		                    	if(strPage == 'add')
		                    		document.location.href="prep_item.action";
		                    	else
		                    		document.location.href="edit_item.action?consgn.id="+consignId;
		                    		
		                    }
                		}
                	}else{
                		
                		/*//刷新验证码 ；20170731 csf注释
                		if(isoOpenVadate == 1 && isEditOpen){
	                		is_check = 0;
			        		ins.refresh();
                		}*/
                		if(returnValue[0]!="error"){
                			var viewValue="";
                			for(var i=0;i<returnValue.length;i++){
                				viewValue+=("\n"+returnValue[i]);
                			}
                			alert(viewValue);
                		}
                		$t.removeAttr("disabled");
                		return ;
                   }
                }
	            }, 
				timeout:60000,
			    errorHandler:function(msg){$t.removeAttr("disabled");alert(msg);}
	        });
		}else{
			alert("验证码校验失败");
			is_check=0;
			showValidateCode();//重新加载验证码
		}
         
     }else{
        window.alert("要保存的信息不能为空!");
     }
}
var shipArr = [['942','E'],['943','C'],['826','G'],['4646','G'],['824','N'],['941','B'],['977','H'],['1150','F'],['864','1'],['944','A']];
//var nowDate = new Date();
function getShippingNo(agentId){
	 for(var i = 0,len = shipArr.length;i<len;i++){
	 	var year = nowDate.getFullYear().toString().substring(2,4);
	 	if(agentId == shipArr[i][0]){
	 		return shipArr[i][1]+year;
	 	}
	 }
}
//验证预配舱单录入页面上数据是否合法
function checkPageData(){
    //如果通关方式为转关 
	/*************货物海关状 为 国际转运货物(002)时,转关目的地代码'为必填项 --add by wangmin 20140327 start****************/
    if ( $("customsStatusCode").value=="002" && $("transitDestinationId").value==""){
       alert("当货物海关状态为国际转运货物时,'转关目的地代码'为必填项!");
       $("transitDestinationId").focus();
       return false;
    }
    if($("customsStatusCode").value=="002" && $("transitDestinationId").value!="") {
    	var tdi = $("transitDestinationId").value;
    	if(tdi.substr(0,2)=='CN') {
    		if(!confirm("国际转运货物时，转关目的地代码不能为国内港口，是否确定保存?")) {
    			return false;
    		}
    		$("transitDestinationId").focus();
    		//return false; //这里只做提示,不进行验证
    	}
    }
    /*************货物海关状 为 国际转运货物(002)时,转关目的地代码'为必填项 --add by wangmin 20140327 end****************/
    
    /*************去掉默认值 --add by wangmin 20140326 start****************/
   //转关目的地代码，如果为转关，并且转关目的地代码为空，则设置默认值 add by cyx 20091214
   /*if (""==$("transitDestinationId").value && $("declType").value=="Z"){
      $("transitDestinationId").value = "CNYTN" ;
   }*/
   /*************去掉默认值 --add by wangmin 20140326 end****************/
   
	//如果是危险品
    if ($("isDanger").value=="1" ){
      if ($("undgName").value==""){
         alert("当是危险品时，'危险品联系人姓名为'必填项.");         
         $("undgName").focus() ;
         return false;
      }
      if ($("undgTel").value==""){
         alert("当是危险品时，'危险品联系人电话'为必填项.");         
         $("undgTel").focus() ;
         return false;
      }      
    }

	   var totalGross=0;
	   var totalQuantity=0;
	   if (null!=goodsList){
	   	   //定义货物毛重的小数位数
	   	   var grossLen=0;
	   	   var quantityLen=0;
		   for(var t=0;t<goodsList.length;t++){
		     //单条货物毛重
		   	 var strGross = goodsList[t].grossMassMeasure;
		   	 //货物毛重累加
			 totalGross += parseFloat(strGross); 
			 //单条货物件数 
			 var strQuantity = goodsList[t].quantityQuantity;
			 //货物件数累加
			 totalQuantity+=parseFloat(strQuantity);
			 
			 //计算货物毛重的最大小数位数
			 if(strGross.indexOf('.')>0){
			 	var tmpGrossLen= strGross.substring(strGross.indexOf('.') + 1).length;
			 	if(tmpGrossLen>grossLen){
			 		grossLen=tmpGrossLen;
			 	}
			 }
			 //计算货物件数的最大小数位数
			 if(strQuantity.indexOf('.')>0){
			 	var tmpQuantityLen= strQuantity.substring(strQuantity.indexOf('.') + 1).length;
			 	if(tmpQuantityLen>quantityLen){
			 		quantityLen=tmpQuantityLen;
			 	}
			 }
		   }
		   //调用一个函数，对累加后的小数位数进行截取
		   totalGross = totalGross.toFixed(grossLen);
		   totalQuantity = totalQuantity.toFixed(quantityLen);
		   
	   }
	   if (Math.abs(parseFloat($("quantityQuantity").value)-totalQuantity)>=0.00000001){
	   		alert("舱单中的总件数和货物信息列表中的总件数不符,不能保存！");
	   		return false;
//	     if(!confirm("舱单中的总件数和货物信息列表中的总件数不符，是否继续保存？")){
//	          $("quantityQuantity").focus() ;
//	          return false;
//	     }
       }
       //alert("页面上的总毛重为:" + $("totalGrossMassMeasure").value);
       //alert("计算后的总毛重为:" + totalGross);
       if (Math.abs(parseFloat($("totalGrossMassMeasure").value)-totalGross)>=0.00000000000001){
       	alert("舱单中的总毛重和货物信息列表中的总毛重不符,不能保存！");
       	return false;
//         if(!confirm("舱单中的总毛重和货物信息列表中的总毛重不符，是否继续保存？")){
//	           $("totalGrossMassMeasure").focus() ;
//	          return false;
//	     }
       } 
    
    //是散货 isBulk=1是散货  isBulk=0非散货      
    if ($("isBulk").value=="1"){
    	if(contaList.length>0){
    		alert("当货物是散货时,不能存在集装箱信息,请先删除集装箱信息.");        
       		return false;
    	}
       
    }else if ($("isBulk").value=="0"){
    	if(contaList.length<=0){
    		alert("非散货时，必须存在集装箱信息，请录入集装箱信息.");
        	$("contaId").focus();
        	return false;
    	}
    	
    	/**
    	//验证货物所填写的装箱号是否存在所定义的集装箱列表中
    	var msg = "" ;        
        for (var t=0;t<goodsList.length;t++){
           var count = 0 ;
           for(var i=0;i<contaList.length;i++){
             if (goodsList[t].contaId==contaList[i].contaId){
                count = count+1 ;         
             }             
           }
           if (count==0){
           	  if(goodsList[t].contaId=="" ||goodsList[t].contaId==null){
           	  	msg+="第 "+(t+1)+" 条货物没有集装箱信息,请填写货物的集装箱号.\n" ;
           	  }else{
				msg+="第 "+(t+1)+" 条货物的集装箱号不存在集装箱信息列表中,请修改货物的集装箱号.\n" ;           	  
           	  }
           }
        }
        if (msg!=""){
           alert(msg);
           return false;
        }
        
        //验证集装箱下面必须有货物，如果没有货物，则给出提示信息用户"该集装箱下面没有货物，请添加货物或是删除集装箱"  
        var msg2="";      
        for(var w1=0;w1<contaList.length;w1++){
        	var count2=0;
        	for (var t1=0;t1<goodsList.length;t1++){
        	    if (contaList[w1].contaId==goodsList[t1].contaId){
                	count2 = count2+1 ;         
             	}  
        	}
        	if (count2==0){
              msg2+="集装箱号为'" + contaList[w1].contaId + "'的集装箱下没有货物信息。\n" ;
           	}
           	if(contaList[w1].isLcl=="" || contaList[w1].isLcl==null){
           	  msg2+="集装箱号为'" + contaList[w1].contaId + "'的集装箱没有设置 是否拼箱 信息，请填写。\n" ;
           	}
           	if(contaList[w1].sealType=="" || contaList[w1].sealType==null){
           	  msg2+="集装箱号为'" + contaList[w1].contaId + "'的集装箱没有设置 封制类型 信息，请填写。\n" ;
           	}
          }
          if (msg2!=""){
           alert(msg2);
           return false;
          }
    	
    	*/
    }
    var shipagentId = $("shipagentId").value.trim();
      if (shipagentId == ""){
         alert("船代不能空！");
         return false;
      }else{
      	 var shippingNo = $("shippingNo").value;
      	 for(var i = 0,len = shipArr.length;i<len;i++){
      	 	shippingNo = shippingNo.substring(0,1);
      	 	if(shipagentId == shipArr[i][0] && shippingNo != shipArr[i][1]){
      	 		alert("装船单号命名错误！");
      	 		return false;
      	 	}
      	 }
      }
      
      var consignorLineStr = $("consignorLine").value.trim().replace(/\s/g,"").toUpperCase();
      if(consignorLineStr != "" && consignorLineStr=="TOORDER"){
    	  $("consignorLine").focus() ;
	      alert("发货人地址不能为TO ORDER.");
	      return false;
      }
   
   //当收货人名称为'TOORDER'时,通知人名称/地址为必填项.
   var strValue = $("consigneeName").value.replace(/\s/g,"").toUpperCase();
   if(strValue != ""){
	   if(strValue=="TOORDER"){
		   var notifyValue = $("notifyName").value.replace(/\s/g,"").toUpperCase();
		   if ($("notifyName").value.trim() == ""){
		         $("notifyName").focus() ;
		         alert("当收货人名称为'TO ORDER'时,通知人代码/名称/地址/联系号码/国家代码为必填项.");
		         return false;
		      }else if(notifyValue == "TOORDER") {
		    	  $("notifyName").focus() ;
		          alert("当收货人名称为'TO ORDER'时,通知人名称必须为详细信息.");
		          return false;
		      }else if ($("notifyLine").value.trim()== ""){
		        $("notifyLine").focus() ; 
		        alert("当收货人名称为'TO ORDER'时,通知人代码/名称/地址/联系号码/国家代码为必填项.");
		        return false;
		      }else if($("notifyConCode").value.trim()== ""){
		    	  $("notifyConCode").focus() ; 
		          alert("当收货人名称为'TO ORDER'时,通知人代码/名称/地址/联系号码/国家代码为必填项.");
		          return false;
		      }else if($("notifyCode").value.trim()== ""){
		    	  $("notifyCode").focus() ; 
		          alert("当收货人名称为'TO ORDER'时,通知人代码/名称/地址/联系号码/国家代码为必填项.");
		          return false;
		      }else if($("consigneeLine").value.trim()== ""){
		    	  $("consigneeLine").focus() ; 
		          alert("当收货人名称为'TO ORDER'时,收货人地址为必填项.");
		          return false;
		      }else if($("notifycountryCode").value.trim()==""){
		    	  $("notifycountryCode").focus() ; 
		          alert("当收货人名称为'TO ORDER'时,通知人代码/名称/地址/联系号码/国家代码为必填项.");
		          return false;
		      }
	   }else{
		   if($("consigneeCode").value.trim() == ""){
			   $("consigneeCode").focus();
			   alert("当收货人名称不为'TO ORDER'时,收货人代码/名称/地址/联系号码/国家代码为必填项.");
			   return false;
		   }else if($("consigneeLine").value.trim() == ""){
			   $("consigneeLine").focus();
			   alert("当收货人名称不为'TO ORDER'时,收货人代码/名称/地址/联系号码/国家代码为必填项.");
			   return false;
		   }else if($("consigneeConCode").value.trim() == ""){
			   $("consigneeConCode").focus();
			   alert("当收货人名称不为'TO ORDER'时,收货人代码/名称/地址/联系号码/国家代码为必填项.");
			   return false;   
		   }else if($("consigneecountryCode").value.trim() == ""){
			   $("consigneecountryCode").focus();
			   alert("当收货人名称不为'TO ORDER'时,收货人代码/名称/地址/联系号码/国家代码为必填项.");
			   return false; 
		   }
		   
	   }
   }else{
	   $("consigneeName").focus();
	   alert("收货人名称不能为空.");
	   return false;
   }
   
   if( ($("notifyCode").value.trim() != "") || ($("notifyName").value.trim() != "") ||
	  ($("notifyLine").value.trim()!= "") || ($("notifyConCode").value.trim()!= "") ||
	  ($("notifycountryCode").value.trim()!="") ){
	   
	   if($("notifyCode").value.trim()== ""){
		   $("notifyCode").focus();
		   alert("请输入通知人代码.");
		   return false;
	   }
	   
	   if($("notifyName").value.trim()== ""){
		   $("notifyName").focus();
		   alert("请输入通知人名称.");
		   return false;
	   }
	   
	   if($("notifyLine").value.trim()== ""){
		   $("notifyLine").focus();
		   alert("请输入通知人地址.");
		   return false;
	   }
	   
	   if($("notifyConCode").value.trim()== ""){
		   $("notifyConCode").focus();
		   alert("请输入通知人联系号码.");
		   return false;
	   }
	   
	   if($("notifycountryCode").value.trim()== ""){
		   $("notifycountryCode").focus();
		   alert("请输入通知人国家代码.");
		   return false;
	   }
   }
   
   //获取装船单号后四位流水号
   var val = $("subShippingNo").value ;
   if( isNaN(val) || val.length!=4 ){ 
     alert('请输入装船单号后面4位流水号,数字类型,且输入长度必须是4位!');
     $("subShippingNo").focus();    
     return false;
   }
   //alert("333333--->" + $("customsOfficeId").value);
   if ($("customsOfficeId").value==""){
      alert('请输入离境地港口!');
      $("customsOfficeId").focus(); 
      return false;
   }
   //发货人统一社会信用代码
   var realCode = $("consignorRealCode").value;
   if($("consignorRealCode").value ==""){
	   alert('请输入统一社会信用代码!');
	   $("consignorRealCode").focus();    
	   return false;
   }
   
   //对收发通等人员代码进行校验 add by rick 2013-07-03
   if ($("consignorRealCode").value!=""){
   	   if(!(/^[\d\w]*$/g).test($("consignorRealCode").value)){
   	       alert('发货人代码只能输入字母和数字！');
   	       $("ownerCode").focus();
   	       return false;
   	   }
   }
   //发货人联系号码
   if($("consignorConCode").value.trim() == ""){
	   alert('请输入发货人联系号码!');
	   $("consignorConCode").focus();    
	   return false;
   }
  /* //收货人国家代码
   if ($("consigneecountryCode").value!=""){
   	   if(!(/^[a-zA-Z]*$/g).test($("consigneecountryCode").value )){
   	       alert('收货人国家代码只能输入2位英文字母.');
   	       $("consigneecountryCode").focus();
   	       return false;
   	   }
   	   if( $("consigneecountryCode").value.length!=2 ){
   		alert('收货人国家代码只能输入2位英文字母.');
	       $("consigneecountryCode").focus();
	       return false;
   	   }
   }*/
   
 /*//通知人国家代码
   if ($("notifycountryCode").value!=""){
   	   if(!(/^[a-zA-Z]*$/g).test($("notifycountryCode").value )){
   	       alert('收货人国家代码只能输入2位英文字母.');
   	       $("notifycountryCode").focus();
   	       return false;
   	   }
   	   if( $("notifycountryCode").value.length!=2 ){
   		alert('收货人国家代码只能输入2位英文字母.');
	       $("notifycountryCode").focus();
	       return false;
   	   }
   }*/
   /*if ($("consigneeCode").value!=""){
   	   if(!(/^[\d\w]*$/g).test($("consigneeCode").value)){
   	       alert('收货人代码只能输入字母和数字！');
   	       $("consigneeCode").focus();
   	       return false;
   	   }
   }
   
   if ($("consigneeCode").value!=""){
   	   if(!(/^[\d\w]*$/g).test($("consigneeCode").value)){
   	       alert('通知人代码只能输入字母和数字！');
   	       $("notifyCode").focus();
   	       return false;
   	   }
   }*/
   
   if($("consignorAEO").value!=""){
	   if(!(/^[\d\w]*$/g).test($("consignorAEO").value)){
   	       alert('发货人AEO编码只能输入字母和数字！');
   	       $("consignorAEO").focus();
   	       return false;
   	   }
   }
   
   if($("consigneeAEO").value!=""){
	   if(!(/^[\d\w]*$/g).test($("consigneeAEO").value)){
   	       alert('收货人AEO编码只能输入字母和数字！');
   	       $("consigneeAEO").focus();
   	       return false;
   	   }
   }
   
   for(var i=0;i<contaList.length;i++){
   		var count = i+1;
		if (5==contaList[i].fullnessCode && ""==contaList[i].sealInfo){
			alert("第"+count+"条集装箱空重标识为重箱时，承运人铅封号和海关封制号必须填写一个");
			return false;
		}
   }
    //货物信息
    if(goodsList.length<1){
        alert("提单中至少有一条货物信息，请填写！");
        return false;
    }
    var isDanger = $('isDanger').value, flag = false;
   for(var i=0;i<goodsList.length;i++){
   		var count = i+1;
   		if(isDanger == 0){
			if (goodsList[i].undgCode != ''){
				alert("当货物填写了危险品编号，请选择是否危险品为是，并填写危险品联系人姓名和电话");
				return false;
			}
			flag = true;
   		}else{
			if (goodsList[i].undgCode != ''){
				flag = true;
				break;
			}
   		}
   }
   if(!flag){
	   	alert("当是否危险品选择为是时，至少有一条货物填写了危险品编号");
	   	return false;
   }
   //当船代为中远船代(826)货物信息中集装箱号未全部使用给出提示信息-add 2016-6-27-begin
   if($("shipagentId").value==826 || $("shipagentId").value==4646 ){
	   var ff = true;
	   var contaIdStr = "";
	   for(var ii = 0; ii < contaList.length; ii++){
		   var f = false;
		   for(var jj = 0; jj < goodsList.length; jj++){
			   if(contaList[ii].contaId == goodsList[jj].contaId)
			   {
				   f = true;
				   break;
			   }
		   }
		   if(!f){
			  ff = false;
			  contaIdStr = contaList[ii].contaId;
			  break; 
		   }
	   }
	   if(!ff){
		  //if(!confirm("集装箱["+contaIdStr+"]未有包含货物信息，是否继续保存?"))return false;
		  alert("集装箱["+contaIdStr+"]下必须录入货物信息！");
		  return false;
	   }
	   /**如果为中远船代826 装船单号后面4位流水号范围检查 --add 2016-8-30**/
	   var rst = false;
	   var errMsg = "";
	   prepItemCache.getSerialRange($("shipagentId").value,{async:false,callback:function(data){
			if(data != ''){
				var range = data.split(",");
				if(range.length>1){
					errMsg = "装船单号后面4位流水号超出范围，请重新输入";
				}else{
					errMsg = "装船单号后面4位流水号范围为"+data+",请重新输入";
				}
				var subShippingNo = $("subShippingNo").value;
				for(var i = 0 ; i < range.length; i++){
					var rangeSon = range[i].split("-");
					if(parseInt(subShippingNo,10) >= parseInt(rangeSon[0],10) 
							&& parseInt(subShippingNo,10) <= parseInt(rangeSon[1],10)){
						rst = true;
						break;
					}
				}
			}else{
				rst = true;
			}
	   },timeout:60000,errorHandler:function(msg){alert(msg);}});
	   if(!rst){
		   alert(errMsg);
		   return false;
	   }
   }
 
   
   
   
   if($("declType").value=="Z"){
	   
	    var manifestNo = $("manifestNo").value.trim();
	    if(manifestNo==null || manifestNo ==""){
	    	alert("请输入载货清单号,数字类型,且输入长度必须是16位!");  
	    	$("manifestNo").focus();
	    	return false;
	    }
	    if(manifestNo.match(/\d/g).length!=16)  
	    {  
	        alert("请输入载货清单号,数字类型,且输入长度必须是16位!");  
	        $("manifestNo").focus();    
	        return false;  
	    } 
   }
   
//   else{
//	   var manifestNo = $("manifestNo").value;
//	   if(manifestNo!=null && manifestNo!=''){
//		    manifestNo = manifestNo.trim();
//		    if(manifestNo==null || manifestNo ==""){
//		    	alert("请输入载货清单号,数字类型,且输入长度必须是16位!");  
//		    	$("manifestNo").focus();
//		    	return false;
//		    }
//		    if(manifestNo.match(/\d/g).length!=16)  
//		    {  
//		        alert("请输入载货清单号,数字类型,且输入长度必须是16位!");  
//		        $("manifestNo").focus();    
//		        return false;  
//		    } 
//	   }
//  }
   
   //-----end
	return true;
}



//把通知人名称和通知人地址设置为必须选项
function changeNonsignee(obj){
	if(obj.checked==true){
	    setValuesByStr("Y");
	}else{
		setValuesByStr("N");
	}
}

//如果收货人名称为TO ORDER，设置收货人名称，通知人名称，通知人地址属性
function setValuesByStr(str){
	if(str=="Y"){
	  //收货人名称设置为：TO ORDER
		$("consigneeName").value="TO ORDER";
		$("consigneecountryCode").value="";
		$("consigneeName").readOnly=true;
		/*//通知人名称设置为必输项
		var obj=$("notifyName_notNull");
	    obj.setAttribute("class","notnull");
        obj.setAttribute("className","notnull");
        //通知人地址设置为必输项
     	var obj2 = $("notifyLine_notNull");
      	obj2.setAttribute("class","notnull");
      	obj2.setAttribute("className","notnull");*/
		jQuery(".notifyInfo").addClass("notnull");
		jQuery(".consigneeInfo").removeClass("notnull");
		jQuery("#consigneeNameTH").addClass("notnull");
		jQuery("#consigneeLineTH").addClass("notnull");
		
	}else if(str=="N"){
	    //收货人名称设置为：TO ORDER
		$("consigneeName").value="";
		$("consigneeName").readOnly=false;
		/*//通知人名称设置为必输项
		var obj=$("notifyName_notNull");
	    obj.setAttribute("class","");
        obj.setAttribute("className","");
        //通知人地址设置为必输项
     	var obj2 = $("notifyLine_notNull");
      	obj2.setAttribute("class","");
      	obj2.setAttribute("className","");*/
		jQuery(".consigneeInfo").addClass("notnull");
		jQuery(".notifyInfo").removeClass("notnull");
		
	}
}
//对收货人名称进行检查
function checkConsigneeName(obj){
	if((obj.value).toUpperCase()=="TO ORDER"){
		$("nosignee_1").checked=true;
    	setValuesByStr("Y");
    	obj.value="TO ORDER";
	}
}

//预配舱单变更保存
function modifyConsignment()
{
    //货物信息
    if(goodsList.length<1){
        alert('单中至少有一条货物信息！请填写！');
        return;
    }
    var changeReason=$("changeReasonCode").value;
    if(changeReason==-1){
        alert("请选择变更原因");
        return;
    }
    //生成舱单对象，并设置变更原因
    var info=saveConsignmentData();
    //alert("222222--->");
    info.changeReasonCode=changeReason;
    if(info!=null){
        prepItemCache.modifyConsignment(info,
        {
            callback:function (data){
                returnValue = data;
                if(returnValue!=null&&returnValue.length>0){
                    var viewValue="";
                    for(var i=0;i<returnValue.length;i++){
                        viewValue+=("\n"+returnValue[i]);
                    }
                    alert(viewValue);
                    return ;
                }else{
                    document.location.href="list_maintenance.action";
                }
            }, 
			timeout:60000,
		    errorHandler:function(msg){alert(msg);}
        });
    }else{
        window.alert("要保存的信息不能为空!");
    }

}
function showContaList(){
	var len = contaList.length;
    document.goodsInfo.contaId1.length = len;
    for(var t=0;t<len;t++){
       document.goodsInfo.contaId1.options[t].value = contaList[t].contaId;
       document.goodsInfo.contaId1.options[t].text = contaList[t].contaId;
    }
    //document.goodsInfo.contaId1.options[len].text = '请选择';
    
}

function contaSave(){   
   	var contaListTemp=contaList;
   	if (null==$("contaId").value||""==$("contaId").value){
	       alert("集装箱号不能为空");
	   $("contaId").focus();
	  return ;
	}else if($("characteristicCode").value == '' || $("characteristicCode").value == 'subCharacteristicCode'){
		alert("尺寸和类型不能为空");
		return;
	}else if($("supplierPartyTypeCode").value == ''){
		alert("来源不能为空");
		return;
	}else if($("fullnessCode").value == ''){
		alert("空重标识不能为空");
		return;
	}else if($("sealType").value == ''){
		alert("封制类型不能为空");
		return;
	}else if($("isLcl").value == ''){
		alert("是否拼箱不能为空");
		return;
	}
	var trs = jQuery('#contaTable').children('tbody').children('tr:gt(1)');
	var flag = true;
	trs.each(function(){
		var $tr = jQuery(this);
		var cid_ = $tr.find('td:eq(1)').text().trim();
		var cid2_ = jQuery('#contaId').val();
		if(cid_ == cid2_){
			flag = false;
			return false;
		}
	});
	if(!flag){
		alert('该单下已存在该集装箱号！');
		$("contaId").focus();
		return;
	}
   	return saveContaData();
}   
// 保存集装箱信息
function saveContaData()
{
    var info = new ContaInfo();
    info.contaId = $("contaId").value;
    //尺寸和类型字段由尺寸和类型两个下拉列表拼装
    var characteristicCode = $("characteristicCode").value;
    var subCharacteristicCode = $("subCharacteristicCode").value;
    info.characteristicCode = characteristicCode + subCharacteristicCode;

    info.supplierPartyTypeCode = $("supplierPartyTypeCode").value;
    info.fullnessCode = $("fullnessCode").value;

    if($("supplierPartyTypeCode").value=='1'){
        info.supplierPatryTypeName='货主自备箱';
    }
    if($("supplierPartyTypeCode").value=='2'){
        info.supplierPatryTypeName='承运人提供箱';
    }
    if($("supplierPartyTypeCode").value=='3'){
        info.supplierPatryTypeName='拼箱人提供箱';
    }
    if($("supplierPartyTypeCode").value=='4'){
        info.supplierPatryTypeName='拆箱人提供箱';
    }
    if($("supplierPartyTypeCode").value=='5'){
        info.supplierPatryTypeName='第三方提供箱';
    }
    if($("fullnessCode").value=='1'){
        info.fullnessName='货物多于1/4容量';
    }
    if($("fullnessCode").value=='2'){
        info.fullnessName='货物多于1/2容量';
    }
    if($("fullnessCode").value=='3'){
        info.fullnessName='货物多于3/4容量';
    }
    if($("fullnessCode").value=='5'){
        info.fullnessName='重箱（满箱）';
    }
    if($("fullnessCode").value=='7'){
        info.fullnessName='拼箱';
    }
    if($("fullnessCode").value=='8'){
        info.fullnessName='整箱';
    }
	info.sealType=$("sealType").value;
	info.sealID = "";
	var tempValue = "" ;
    if ($("sealNo_CA").value !="" && $("sealNo_CU").value =="")
    {
       info.agencyCode = "CA" ;
       info.sealID = info.sealID + $("sealNo_CA").value ;
    }
    if ($("sealNo_CA").value =="" && $("sealNo_CU").value !="")
    {
       info.agencyCode = "CU" ;
       info.sealID = info.sealID + $("sealNo_CU").value ;
    }
    if ($("sealNo_CA").value !="" && $("sealNo_CU").value !="")
    {
       info.agencyCode = "CA;CU" ;
       info.sealID = info.sealID + $("sealNo_CA").value + ";"+  $("sealNo_CU").value ;
    }
    info.sealInfo =sealInfoSave();
    
    //是否拼箱
    info.isLcl=$("isLcl").value;
     if($("isLcl").value=='0'){
        info.isLclName='非拼箱';
     }
     if($("isLcl").value=='1'){
        info.isLclName='拼箱';
     }
    return info;
}

//解析封铅号
var agentCode=new Array("CA","CU");

function sealInfoSave(){  
   var i=0;
   var  retVal="";
   var sealVal="";
   for(i=0; i<agentCode.length; i++){
      sealVal=$("sealNo_"+agentCode[i]).value;
      if(sealVal!="")
      {
         retVal=retVal+sealVal+","+agentCode[i]+";"
      }
   }
   if(retVal!="")
   {
      retVal=retVal.substring(0,retVal.length-1);
   }
  return retVal;
}

function addContaInfoNew(){
	//增加修改标志
	var contaMethodFlag = $("contaMethodFlag").value;
   	if (5==$("fullnessCode").value && ""==$("sealNo_CA").value && ""==$("sealNo_CU").value){
	   alert("空重标识为重箱时，承运人铅封号和海关封制号必须填写一个");
	   $("sealNo_CA").focus();
	  return ;
	}else if (7==$("fullnessCode").value && ""==$("sealNo_CA").value && ""==$("sealNo_CU").value){
 	   alert("空重标识为拼箱时，承运人铅封号和海关封制号必须填写一个");
 	   $("sealNo_CA").focus();
 	  return ;
 	}else if (8==$("fullnessCode").value && ""==$("sealNo_CA").value && ""==$("sealNo_CU").value){
 	   alert("空重标识为整箱时，承运人铅封号和海关封制号必须填写一个");
 	   $("sealNo_CA").focus();
 	  return ;
 	}
   	//判断集装箱号尺寸是否合理--船代为中远船代826添加此判断-add 2016-6-27--start
   	var f = true;
   	if($("shipagentId").value==826 || $("shipagentId").value==4646){
   		prepItemCache.getContaSize($("contaId").value,{async:false,callback:function(data){
	   		if(data != ''){
	   			var show = false;
	   			if($("characteristicCode").value==20){
	   				var array20 = new Array("20","22","25","28");
	   				if(jQuery.inArray(data,array20)==-1)
	   					show = true;
	   			}else if($("characteristicCode").value==40){
	   				var array40 = new Array("40","42","43","46","4C","4E");
	   				if(jQuery.inArray(data,array40)==-1)
	   					show = true;
	   			}else if($("characteristicCode").value==45){
	   				var array45 = new Array("45","95","L5","LE");
	   				if(jQuery.inArray(data,array45)==-1)
	   					show =true;
	   			}else if($("characteristicCode").value==48){
	   				var array48 = new Array("48");
	   				if(jQuery.inArray(data,array48)==-1)
	   					show =true;
	   			}else if($("characteristicCode").value==53){
	   				var array53 = new Array("PP");
	   				if(jQuery.inArray(data,array53)==-1)
	   					show =true;
	   			}
	   			if(show){
	   				if(!confirm("集装箱号尺寸与实际尺寸["+data+"]不符，是否继续保存？")){
	   		   			f = false;return;
	   		   		};
	   			}
	   		}
	   	},timeout:60000,errorHandler:function(msg){alert(msg);}});
   	}
  //---end
   	if(f){
   		if("add"==contaMethodFlag){//新增
   			addContaInfo();	
   		}else if("edit"==contaMethodFlag){//修改
   			onlySaveConta();	
   			//如果是编辑，则修改后把标志改为新增加 add by cyx
   	       $("contaMethodFlag").value="add";
   		}	
   		//把保存标志设置为1：已保存
   	    $("contaSaveFlag").value="1";
   	}
}

//如果集装箱号修改了，则把货物所引用的集装箱号也进行修改
function updateGoodsConta(){
	//取新的集装箱号
	var contaId = $("contaId").value;
	var hidden_contaId= $("hidden_contaId").value;
	if(contaId==hidden_contaId){
		return;
	}else{
		//alert("集装箱号改了--->" + goodsList.length);
		for(var i=0;i<goodsList.length;i++){
			var strContaId = goodsList[i].contaId;
			if(strContaId==""){
				continue;
			}else{
				//如果货物中有引用旧的集装箱信息
				if(strContaId==hidden_contaId){
					goodsList[i].contaId=contaId;//引用更改后的集装箱
				}
			}
		}
	}
	
	//把已添加的货物信息列表中的集装箱信息更新
	updateGoodsContaHtml(hidden_contaId,contaId);		
	
}
//把页面上显示的集装箱信息列表进行更新
function updateGoodsContaHtml(oldConta,newConta){
	var goodTable = $("goodsListTable").rows.length
	for(var i=2;i<goodTable;i++){
		
		var $_trNode = jQuery("#goodsListTable tr:eq("+(i)+")")
        var htmContaId = $_trNode.find("td:eq("+(1)+")").html();
		if(oldConta==htmContaId){
			$_trNode.find("td:eq("+(1)+")").html(newConta)
		}
		
//		var trNote=goodsListTable.rows(i);
//		var htmContaId = trNote.childNodes[1].innerHTML;
//		if(oldConta==htmContaId){
//			trNote.childNodes[1].innerHTML=newConta;
//		}
		
	}
}


// 增加集装箱窗口 add by cyx
function addContaInfo(){	
    iOrder = $("contaTable").rows.length - 1;   
    var valueObjs = contaSave() ;
    if(valueObjs != null&&verifyContaInfo(valueObjs)){
		if (!chkcntrno($("contaId").value.toUpperCase())){
			if(!confirm("集装箱号不符合国际标准，是否继续保存？"))	return ;									  
		}
        contaList[contaList.length] = valueObjs;        
        addContaRow(); 
        //保存完集装箱信息后，把光标定位到新增按钮 add by cyx
        $("cmdAddConta").focus(); 
    }
    $("hidden_contaId").value="";
}

//验证集装箱
function verifyContaInfo(conta){
  var regContaId=/^[A-Z0-9]+$/g;
  var regCharacteristic=/^[A-Z0-9]{2}$/g;
  if (!regContaId.test($("contaId").value)){
	  $("contaId").focus();
	   alert("集装箱号必须是大写字母或数字组成！");
	  return false ;
  }
  var characteristicCode=$("characteristicCode").value;
  if (!regCharacteristic.test(characteristicCode)){
      $("characteristicCode").focus();
	   alert("尺寸和类型必须是2位大写字母或数字组成！");
	  return false ;
  }
  return true ;
}

function clearContaData()
{
	//判断集装箱信息是否保存了，如果没有保存，则给出提示。
	var contaSaveFlag = $("contaSaveFlag").value;
	//alert("contaSaveFlag--->" + contaSaveFlag);
	if(contaSaveFlag=="0" && $("contaId").value!=""){
		if(confirm("集装箱信息没有保存，确定保存吗！")){
			//$("cmdSaveConta").focus();
			$("cmdSaveConta").click();
			//return;
		}
	}
    $("contaId").value="" ;
    //尺寸和类型不能清空，默认为40
    $("sealNo_CA").value="" ;
    $("sealNo_CU").value="" ;
    //把集装箱号中的隐藏域清空
    $("hidden_contaId").value="";
    
    //把集装箱保存标志恢复默认值：0，未保存
    $("contaSaveFlag").value="0";
    //点击新增按钮，把光标定位到集装箱编号文本框
    $("contaId").focus();
    
    
}
String.prototype.trim = function(){
  var str = this,
  str = str.replace(/^\s\s*/, ''),
  ws = /\s/,
  i = str.length;
  while (ws.test(str.charAt(--i)));
  return str.slice(0, i + 1);
}
// 添加一行集装箱信息
function addContaRow()
{
    var i = 0;
    var col;
    var iOrder = $("contaTable").rows.length-2;
    var trNode = $("contaTable").insertRow(iOrder+2);    
    var tdNode = trNode.insertCell(0);
    tdNode.innerHTML = iOrder +1;
    trNode.align = "center";
    var bg = "#eeeeee";
    if($("contaTable").rows.length % 2 == 0)
    {
        bg = "#ffffff"
    }
    trNode.bgColor = bg;
    var info=contaList[iOrder];
    var tdNode = trNode.insertCell(1);
    tdNode.innerHTML = info.contaId + "&nbsp;";
    tdNode = trNode.insertCell(2);
    tdNode.innerHTML = info.characteristicCode + "&nbsp;";
    //来源
    tdNode = trNode.insertCell(3);
    tdNode.innerHTML = info.supplierPartyTypeCode+" ("+info.supplierPatryTypeName+")"+ "&nbsp;";
    //空重标识
    tdNode = trNode.insertCell(4);
    tdNode.innerHTML = info.fullnessCode +" ("+info.fullnessName+")"+ "&nbsp;";
    //封制类型
	tdNode = trNode.insertCell(5);
    tdNode.innerHTML = info.sealType + "&nbsp;";
    //封制号/施封人
    tdNode = trNode.insertCell(6);
    tdNode.innerHTML = info.sealInfo + "&nbsp;";
    //新增是否拼箱
    tdNode = trNode.insertCell(7);
    tdNode.innerHTML = info.isLcl +" ("+info.isLclName+")"+ "&nbsp;";
    
    tdNode = trNode.insertCell(8);    
    tdNode.innerHTML = "<a href='javascript:void(0)'onclick='editConta()'/><img src='../images/edit.gif' border='0' alt='修改'/></a> &nbsp;<a href='javascript:void(0)' onclick='removeConta()'/><img src='../images/del.gif' border='0' alt='删除'/></a> ";
    
    //document.forms[0].cmdSaveConta.disabled=true ;
    showContaList(); //设置货物信息栏里的集装箱信息下列列表
}
// 修改的集装箱信息
function editConta(allowModify)
{
    var the_obj = event.srcElement;
    var the_td	 = get_Element(the_obj, "td");
    if(the_td == null){
        return;
    }
    var the_tr	 = the_td.parentElement;
    var iOrder = the_tr.rowIndex;
    var valueObjs ;
     var info=contaList[iOrder-2];
     rowNumber = iOrder-2 ;
     $("contaId").value = info.contaId ; 
     //把集装箱号放到隐藏域中
     $("hidden_contaId").value = info.contaId ;
     
     var characteristicCode= info.characteristicCode;
     $("characteristicCode").value = characteristicCode.substring(0,2); 
     $("subCharacteristicCode").value = characteristicCode.substring(2,4);
     $("supplierPartyTypeCode").value = info.supplierPartyTypeCode ;    
     if (info.fullnessCode==""){
        $("fullnessCode").value="5" ; 
     }else{
         $("fullnessCode").value = info.fullnessCode ; 
     }
     //把值先清空
     $("sealNo_CA").value="";
	 $("sealNo_CU").value="";
	  if (null!=info.sealID&&""!=info.sealID.trim()){
	  	  //alert("info.sealID-->" + info.sealID);
		  var sids=info.sealID.split(";");
		  var ages = info.agencyCode.split(";");	
		   //alert("AAAAAAA-->"+info.agencyCode); 		 
		  for(i=0;i<sids.length;i++){
		  if (ages[i]=="CA" || ages[i]=="CU")
		  {
		     $("sealNo_"+ages[i]).value=sids[i];
	      }
	     }
	  }
	  	
    if (info.sealType=="M")
    {
       $("sealType").options[0].selected=true ;
    }
    if (info.sealType=="E")
    {
       $("sealType").options[1].selected=true ;
    }
    //设置是否拼箱
    if(info.isLcl=="0"){
    	$("isLcl").options[0].selected=true;
    }else if(info.isLcl=="1"){
    	$("isLcl").options[1].selected=true;
    }
      document.forms[0].cmdSaveConta.disabled=false ;
      showContaList();//设置货物信息栏里的集装箱信息下列列表
      //如果是编辑，则把集装箱标志改为编辑 add by cyx
      $("contaMethodFlag").value="edit";
      $("contaSaveFlag").value="0";
      //编辑时，把光标定位到集装箱上
      $("contaId").focus();
      
}
// 查看详细信息的集装箱信息
function editContaDetail()
{
    var the_obj = event.srcElement;
    var the_td	 = get_Element(the_obj, "td");
    if(the_td == null)
    {
        return;
    }
    var the_tr	 = the_td.parentElement;
    var iOrder = the_tr.rowIndex;
    var thetime = new Date ();
    var currentTime = thetime.getHours() * 10000 + thetime.getMinutes() * 100 + thetime.getSeconds();
    var valueObjs = window.showModalDialog("../common/contadetail.jsp?iOrder=" + (iOrder-2) + "&realOrder="+(iOrder-1)+"&currentTime=" + currentTime, window, "dialogWidth:500px;status:no;dialogHeight:200px");

}
// 删除集装箱信息
function removeConta()
{
	//如果集装箱没有保存，则直接保存后再执行删除操作	
	if($("contaSaveFlag").value==0){
		$("contaMethodFlag").value="add";
	}
    var the_obj = event.srcElement;
    var the_td	 = get_Element(the_obj, "td");
    if(the_td == null){
        return;
    }
    var the_tr	 = the_td.parentElement;
    var rowIndex = the_tr.rowIndex;
    //var trNote=$("contaTable").rows(rowIndex); 
    var tempContaId = contaList[rowIndex-2].contaId ;
    var contaMsg = "";
    for(var b=0;b<goodsList.length;b++){
       if (tempContaId == goodsList[b].contaId &&  goodsList[b].contaId!=""){
          contaMsg+="第 "+(b+1)+" 条货物信息存在该集装箱号码,请先修改货物信息.\n" ;
       }          
    }
    if(contaMsg!=""){
         alert(contaMsg);
         return ;
    }
       
    //判断集装箱有没有保存，如果没有保存，则给出提示 add by cyx 20091115
	//clearContaData();
	
    if(confirm("确定要删除第 " + (rowIndex - 1) + " 个集装箱信息吗？")){
        $("contaTable").deleteRow(rowIndex);
      // 更新箱号和集装箱列表
        var count = $("contaTable").rows.length;
        for(var j = rowIndex; j < count; j ++ ){
        	
        	var $_trNode = jQuery("#contaTable tr:eq("+(j)+")")
            $_trNode.find("td:eq("+(0)+")").html(j-1);
//          $("contaTable").rows(j).childNodes[0].innerHTML = j-1;
            contaList[j-2]=contaList[j-1];
        }
        contaList.length=j-2;
        //删除集装箱后，把光标定位到集装箱上
        $("contaId").focus();
    }
    //document.forms[0].cmdSaveConta.disabled=true ;
    showContaList();//设置货物信息栏里的集装箱信息下列列表
}
function onlySaveConta()
{
    var valueObjs = saveContaData() ;     
	if (!verifyContaInfo(valueObjs)){
	  return ;
	}
	for(var x=0;x<contaList.length;x++){  
	   if((contaList[x].contaId==$("contaId").value ) &&$("fullnessCode").value!=7&& (x!=rowNumber) ){ 
		  alert('该单下已存在该集装箱号！');		  
		   return;
	   }
	}  
	if (!chkcntrno($("contaId").value.toUpperCase())){
			if(!confirm("集装箱号不符合国际标准，是否继续保存？"))	return ;									  
	}

    if(valueObjs != null){
        var i=1;
        contaList[rowNumber] = valueObjs;
        var info=valueObjs;   
        
        
        var $_trNode = jQuery("#contaTable tr:eq("+(rowNumber+2)+")")
        $_trNode.find("td:eq("+(i++)+")").html(info.contaId + "&nbsp;");
        $_trNode.find("td:eq("+(i++)+")").html(info.characteristicCode + "&nbsp;");
        $_trNode.find("td:eq("+(i++)+")").html(info.supplierPartyTypeCode+" ("+info.supplierPatryTypeName+")"+ "&nbsp;");
        $_trNode.find("td:eq("+(i++)+")").html(info.fullnessCode +" ("+info.fullnessName+")"+ "&nbsp;");
        $_trNode.find("td:eq("+(i++)+")").html(info.sealType + "&nbsp;");
        $_trNode.find("td:eq("+(i++)+")").html(info.sealInfo + "&nbsp;");
        $_trNode.find("td:eq("+(i++)+")").html(info.isLcl +" ("+info.isLclName+")"+ "&nbsp;");
        
        
//        var trNote=$("contaTable").rows[rowNumber+2]; 
//        trNote.childNodes[i++].innerHTML = info.contaId + "&nbsp;";       
//        trNote.childNodes[i++].innerHTML = info.characteristicCode + "&nbsp;";       
//        trNote.childNodes[i++].innerHTML = info.supplierPartyTypeCode+" ("+info.supplierPatryTypeName+")"+ "&nbsp;";       
//        trNote.childNodes[i++].innerHTML = info.fullnessCode +" ("+info.fullnessName+")"+ "&nbsp;"; 
//        trNote.childNodes[i++].innerHTML = info.sealType + "&nbsp;";              
//        trNote.childNodes[i++].innerHTML = info.sealInfo + "&nbsp;";
//        trNote.childNodes[i++].innerHTML = info.isLcl +" ("+info.isLclName+")"+ "&nbsp;";
        
        showContaList();//设置货物信息栏里的集装箱信息下列列表    
    }
     
     //集装改了，所货物所引用的集装箱也改了：
	 updateGoodsConta();
	 $("cmdAddConta").focus(); 
	 //把隐藏域清空
	 $("hidden_contaId").value="";
  
}

function goodsSave(){
	//货物输入项验证不通过
	if(!checkGoodsData()){
		return ;
	}		
   	if(goodsType!="packing"){
	      if($("contaId1").value!=null&&$("contaId1").value!=''){
	      		clist=contaList;	      		
	      		if(clist.length==0){
	      			alert('集装箱号必须来自集装箱列表信息!');
	      			return ;
	      		}
	      	   var tmpContaId=$("contaId1").value;
			   var contaArray = tmpContaId.split(";");
			   var i=0;
			   for(i=0; i<contaArray.length; i++)
			   {
		      		var tmpValue=0;
		      		for(var j=0;j<clist.length;j++){
		      			if(contaArray[i]==clist[j].contaId){
		      				tmpValue++;
		      				break;
		      			}
		      		}
		      		if(tmpValue==0){
		      			alert("号码为："+contaArray[i]+"的集装箱不在列表信息中！");
		      			return;
		      		}
			   }
	      }
	   }	  
	   var goodsListTemp=goodsList;	  
   	   return saveGoodsData(goodsType);
}
// 查看货物信息详细
function detailGoods(){
    var the_obj = event.srcElement;
    var the_td	 = get_Element(the_obj, "td");
    if(the_td == null)
    {
        return;
    }
    var the_tr	 = the_td.parentElement;
    var iOrder = the_tr.rowIndex;
    var thetime = new Date ();
    var currentTime = thetime.getHours() * 10000 + thetime.getMinutes() * 100 + thetime.getSeconds();
    

    if(isChrome()){
    	window.openWin("../common/goodsdetail.jsp?iOrder=" + (iOrder-2) +"&realOrder="+(iOrder-1)+ "&currentTime=" + currentTime, "newwindow",500,240);
    }else{
    	window.showModalDialog("../common/goodsdetail.jsp?iOrder=" + (iOrder-2) +"&realOrder="+(iOrder-1)+ "&currentTime=" + currentTime, window, "dialogWidth:500px;status:no;dialogHeight:240px");
    }

}



function saveGoodsData(goodsType){
   var info = new ConsignmentItem();
   info.sequenceNumeric =goodsList.length+1 /*$("sequenceNumeric").value*/;
   info.cargoDescription = $("cargoDescription").value;
   info.typeCode = $("typeCode").value;
   info.packagesTypeCodeName = $("packageTypeCodeName").value;
   var tmpQuantity=$("goodQuantityQuantity").value;
   info.quantityQuantity = $("goodQuantityQuantity").value;
   info.grossMassMeasure = $("grossMassMeasure").value;
   info.marksNumbers = $("marksNumbers").value;
   info.undgCode = $("undgCode1").value;
   if(goodsType!="packing"){
      info.contaId = $("contaId1").value;
     
   }   
   info.content = $("content").value;
   return info;
}

function clearGoodsData()
{
  //判断集货物信息是否保存了，如果没有保存，则给出提示。
	var goodsSaveFlag = $("goodsSaveFlag").value;
	if(goodsSaveFlag=="0" && $("goodQuantityQuantity").value!="" && $("grossMassMeasure").value!=""){
		if(confirm("货物信息没有保存，确定保存吗！")){
			$("cmdGoodsSave").click();
			//return;
		}
	}
  //货物描述不能清空
  $("goodQuantityQuantity").value = "" ;
  //包装种类不用清空
  $("grossMassMeasure").value = "" ;
  //唛头不能清空
  $("undgCode1").value = "" ;
  $("content").value = "" ;
  
  //如果集装箱可操作，则集装箱号文本框获取焦点
        if(!$("contaId1").disabled ||($("contaId1").disabled && $("contaId1").length>0)){ 
        	$("contaId1").focus();
        }else{//如果集装箱不可操作，则货物描述获取焦点
        	$("cargoDescription").focus();
        }
  //把货物信息保存标志恢复为0：未保存
  $("goodsSaveFlag").value="0";
}

// 增加货物窗口
function addGoods()
{
    var thetime = new Date ();
    var currentTime = thetime.getHours() * 10000 + thetime.getMinutes() * 100 + thetime.getSeconds();
    var iOrder = $("goodsListTable").rows.length - 1;
    var valueObjs = goodsSave() ;
        
    if(valueObjs != null){
        goodsList[goodsList.length] = valueObjs;
        var returnValue1 = 0;var returnValue2 = 0;
        for(var j = 0; j < goodsList.length; j++ ){
            if(goodsList[j].quantityQuantity!=""&&!isNaN(goodsList[j].quantityQuantity)){
                returnValue1 = parseInt(returnValue1) + parseInt(goodsList[j].quantityQuantity);
            }
        }for(var j = 0; j < goodsList.length; j++ ){
	        if(goodsList[j].grossMassMeasure!=""&&!isNaN(goodsList[j].grossMassMeasure)){
	            returnValue2 = parseFloat(returnValue2) + parseFloat(goodsList[j].grossMassMeasure);
	        }
    	}
        $("totalQuantity").value=returnValue1;
        $("totalGross").value=parseFloat(returnValue2.toFixed(4));
        
        addGoodsRow();
        
        //设置总重量和总件数在表头栏目中
        setColoumnQuantityAndGross();
        
        //货物保存后，把光标定位到新增按钮
        $("cmdGoodsAdd").focus();
        
    }
    $("goodsMethodFlag").value="add";
}

function addGoodsNew(){
	
	//增加修改标志
	var goodsMethodFlag = $("goodsMethodFlag").value;
	if("add"==goodsMethodFlag){//新增
		addGoods();		
	}else if("edit"==goodsMethodFlag){//修改
		var flag = onlySave();
		if(flag != false){
			//如果是编辑，则修改后把标志改为新增加 add by cyx
       		$("goodsMethodFlag").value="add";
		}
	}
	//货物保存后把保存标志设置为已保存
	$("goodsSaveFlag").value="1";
}


// 添加一行货物信息
function addGoodsRow()
{
    var i = 0;
    var col;
    var iOrder = goodsListTable.rows.length-2;
    var trNode = goodsListTable.insertRow();
    trNode.align = "center";
    var bg = "#eeeeee";
    if(goodsListTable.rows.length % 2 == 0)
    {
        bg = "#ffffff"
    }
    trNode.bgColor = bg;
    var info=goodsList[iOrder];
    var tdNode = trNode.insertCell();
    //tdNode.innerHTML = info.sequenceNumeric + "&nbsp;";
	tdNode.innerHTML = goodsListTable.rows.length-2 + "&nbsp;";
    tdNode = trNode.insertCell();
    tdNode.innerHTML = info.contaId + "";
    tdNode = trNode.insertCell();
    tdNode.innerHTML = info.cargoDescription + "&nbsp;";
    tdNode = trNode.insertCell();
    tdNode.innerHTML = info.quantityQuantity + "&nbsp;";
    tdNode = trNode.insertCell();
    tdNode.innerHTML = info.typeCode +"("+info.packagesTypeCodeName+")"+ "&nbsp;";
    tdNode = trNode.insertCell();
    tdNode.innerHTML = info.grossMassMeasure + "&nbsp;";
    tdNode = trNode.insertCell();    
    tdNode.innerHTML = "<a href='javascript:void(0)'onclick='editGoods()'/><img src='../images/edit.gif' border='0' alt='修改'/></a> &nbsp;<a href='javascript:void(0)'onclick='removeGoods()'/><img src='../images/del.gif' border='0' alt='删除'/></a> ";
    
    // 修改汇总
//	var trs = jQuery('#goodsListTable').children('tbody').children('tr:gt(1)');
//	var t_qty = 0, t_gw = 0;
//	trs.each(function(){
//		var $tr = jQuery(this);
//		var qty_ = $tr.find('td:eq(3)').text().trim(),
//			gw_ = $tr.find('td:eq(5)').text().trim();
//		t_qty += parseInt(qty_);
//		t_gw += parseInt(gw_);
//	});
//    jQuery('#good_qty').text(t_qty);
//    jQuery('#good_qw').text(t_qw);
}

// 修改货物信息
function editGoods()
{
    var the_obj = event.srcElement;
    var the_td	 = get_Element(the_obj, "td");
    if(the_td == null)
    {
        return;
    }
    var the_tr	 = the_td.parentElement;
    var iOrder = the_tr.rowIndex;
    var i=0;
    var info=goodsList[iOrder-2];
    rowNumber = iOrder-2 ;  
    //$("sequenceNumeric").value= info.sequenceNumeric; 
    $("cargoDescription").value=   info.cargoDescription ;
    $("typeCode").value= info.typeCode ;
    $("packageTypeCodeName").value= info.packagesTypeCodeName ;
    $("goodQuantityQuantity").value= info.quantityQuantity ;
    $("grossMassMeasure").value=   info.grossMassMeasure ;
    $("marksNumbers").value= info.marksNumbers ;
    $("undgCode1").value= info.undgCode;
    if(goodsType!="packing")
    {
      $("contaId1").value = info.contaId;     
    }   
      $("content").value = info.content;
      $("cmdGoodsSave").disabled=false ;
     
      //操作标志改为编辑
      $("goodsMethodFlag").value="edit";
      $("goodsSaveFlag").value="0";   
       //编辑货物时把光标定位到集装箱文本框上
      $("contaId1").focus() ;    
}

//验证货物数据项是否完整
function checkGoodsData(){
	
	
	
	if ($("isBulk").value=="0" && $("contaId1").value==""){
	    alert("集装箱号不能为空.");
	     $("contaId1").focus();
	    return false;
	}
	if($("cargoDescription").value==''){
		alert("货物描述不能为空.");
		 $("cargoDescription").focus();
		return false;
	}else{
		var valueStr = $("cargoDescription").value.toUpperCase();
		if((/^([a-zA-Z])(\1){2,}$/g).test(valueStr) || !isNaN(valueStr) || valueStr.length == 1){
			alert("货物简要描述填制不规范，请填写具体货物描述.");
			return false;
		}
		if($("mainGName").value==''){
			$("mainGName").value = $("cargoDescription").value;
		}else{
			
			if($("mainGName").value != $("cargoDescription").value){
				if(!confirm('"货物描述" 与表头中的 "主要商品名称" 不一致，是否确定保存?')){
					return false;
				}
			}
		}
	}
	var qty = $("goodQuantityQuantity").value;
	if(qty==''){
		alert("件数不能为空.");
		 $("goodQuantityQuantity").focus();
		return false;
	}
	if(isNaN(qty) || parseInt(qty) <= 0){
		alert("件数必须为数字并且大于0.");
		 $("goodQuantityQuantity").focus();
		return false;
	}
	if($("typeCode").value==''){
		alert("包装不能为空.");
		 $("typeCode").focus();
		return false;
	}
	var gw = $("grossMassMeasure").value;
	if(gw==''){
		alert("毛重不能为空.");
		 $("grossMassMeasure").focus();
		return false;
	}
	if(isNaN(gw) || parseFloat(gw) <= 0){
		alert("毛重必须为数字并且大于0.");
		 $("grossMassMeasure").focus();
		return false;
	}
	if($("marksNumbers").value==''){
		alert("唛头不能为空.");
		 $("marksNumbers").focus();
		return false;
	}
	//如果提运单中选择了"是否危险品"，则货物列表中的“危险品编号“是必输选项
	
	
	var tmpDanger = document.forms[0].isDanger.value;
	if(tmpDanger=='1'){
		if($("undgCode1").value.trim()==''){
			alert("危险品编号不能为空.");
			$("undgCode1").value='';
			$("undgCode1").focus();
			return false;
		 }
	    if(!(/^[0-9A-Z]*$/g).test($("undgCode1").value)){
	       alert('危险品编号只能输入大写字母和数字,且输入长度不超过4位');
	       $("undgCode1").focus();
	       return false;
	    }
	    if($("undgCode1").value.length>4)  
	    {  
	        alert("危险品编号只能输入大写字母和数字,且输入长度不超过4位");  
	        $("undgCode1").focus();    
	        return false;  
	    } 
	}else{
		
		  if($("undgCode1").value!=''){
			  
			    if(!(/^[0-9A-Z]*$/g).test($("undgCode1").value)){
			       alert('危险品编号只能输入大写字母和数字,且输入长度不超过4位');
			       $("undgCode1").focus();
			       return false;
			    }
			    if($("undgCode1").value.length>4)  
			    {  
			        alert("危险品编号只能输入大写字母和数字,且输入长度不超过4位");  
			        $("undgCode1").focus();    
			        return false;  
			    } 
	     }
		
	}

	
	
	

	
	var trs = jQuery('#goodsListTable').children('tbody').children('tr:gt(1)');
	var flag = true;
	trs.each(function(){
		var $tr = jQuery(this);
		var cid_ = $tr.find('td:eq(1)').text().trim(),
			desc_ = $tr.find('td:eq(2)').text().trim(),
			qty_ = $tr.find('td:eq(3)').text().trim(),
			gw_ = $tr.find('td:eq(5)').text().trim();
		var cid2_ = jQuery('#contaId1').children('option:selected').text(),
			desc2_ = jQuery('#cargoDescription').val(),
			qty2_ = jQuery('#goodQuantityQuantity').val(),
			gw2_ = jQuery('#grossMassMeasure').val();
		if(cid_ == cid2_ && desc_==desc2_ && qty_==qty2_ && gw_ == gw2_){
			flag = false;
			return false;
		}
	});
	var goodsMethodFlag = $("goodsMethodFlag").value;
	if(!flag && goodsMethodFlag != 'edit'){
		alert('不能重复添加货物！');
		return false;
	}
	
	return true;
}


function onlySave(){
    //验证货物数据项是否完整
	if(!checkGoodsData()){
		return false;
	}
    var valueObjs = saveGoodsData(goodsType) ;    
	valueObjs.sequenceNumeric=rowNumber+1;
    var nowId = valueObjs.sequenceNumeric ;            //现在的货物序号	      
    if(valueObjs != null){
        var i=0;
        goodsList[rowNumber] = valueObjs;   
        var info=valueObjs;       
        
        
        var $_trNode = jQuery("#goodsListTable tr:eq("+(rowNumber+2)+")")
        $_trNode.find("td:eq("+(i++)+")").html(info.sequenceNumeric + "&nbsp;");
        $_trNode.find("td:eq("+(i++)+")").html(info.contaId + "");
        $_trNode.find("td:eq("+(i++)+")").html(info.cargoDescription + "&nbsp;");
        $_trNode.find("td:eq("+(i++)+")").html(info.quantityQuantity + "&nbsp;");
        $_trNode.find("td:eq("+(i++)+")").html(info.typeCode +"("+info.packagesTypeCodeName+")"+ "&nbsp;");
        $_trNode.find("td:eq("+(i++)+")").html(info.grossMassMeasure + "&nbsp;");
        
//        var trNote=goodsListTable.rows[rowNumber+2];
//        trNote.childNodes[i++].innerHTML = info.sequenceNumeric + "&nbsp;";
//        trNote.childNodes[i++].innerHTML = info.contaId + "";
//        trNote.childNodes[i++].innerHTML = info.cargoDescription + "&nbsp;";
//        trNote.childNodes[i++].innerHTML = info.quantityQuantity + "&nbsp;";
//        trNote.childNodes[i++].innerHTML = info.typeCode +"("+info.packagesTypeCodeName+")"+ "&nbsp;";
//        trNote.childNodes[i++].innerHTML = info.grossMassMeasure + "&nbsp;";   
        
        var returnValue1 = 0;var returnValue2 = 0;
        for(var j = 0; j < goodsList.length; j++ ){
            if(goodsList[j].quantityQuantity!=""&&!isNaN(goodsList[j].quantityQuantity)){
                returnValue1 = parseInt(returnValue1) + parseInt(goodsList[j].quantityQuantity);
            }
        }for(var j = 0; j < goodsList.length; j++ ){
	        if(goodsList[j].grossMassMeasure!=""&&!isNaN(goodsList[j].grossMassMeasure)){
	            returnValue2 = parseFloat(returnValue2) + parseFloat(goodsList[j].grossMassMeasure);
	        }
    	}
        $("totalQuantity").value=returnValue1;
        $("totalGross").value=parseFloat(returnValue2.toFixed(4));
        
        //设置总重量和总件数在表头栏目中
        setColoumnQuantityAndGross();
    }
}

// 删除货物信息
function removeGoods(){
	//如果集装箱没有保存，则直接保存后再执行删除操作	
	//alert("aa--->" + $("goodsSaveFlag"));
	if($("goodsSaveFlag").value==0){
		$("goodsMethodFlag").value="add";
	}
    var the_obj = event.srcElement;
    var the_td	 = get_Element(the_obj, "td");
    if(the_td == null)
    {
        return;
    }
    var the_tr	 = the_td.parentElement;
    var rowIndex = the_tr.rowIndex;
    if(confirm("确定要删除第 " + (rowIndex - 1) + " 个货物信息吗？")){
        goodsListTable.deleteRow(rowIndex);
      // 货物列表
        
        var count = goodsListTable.rows.length;
        for(var j = rowIndex; j < count; j ++ ){
        	
        	var $_trNode = jQuery("#goodsListTable tr:eq("+(j)+")")
            $_trNode.find("td:eq("+(0)+")").html(j-1);
//          goodsListTable.rows(j).childNodes[0].innerHTML = j-1;
            goodsList[j-2]=goodsList[j-1];
        }
        goodsList.length=j-2;
        var returnValue1 = 0;var returnValue2 = 0;
        for(var j = 0; j < goodsList.length; j++ ){
            if(goodsList[j].quantityQuantity!=""&&!isNaN(goodsList[j].quantityQuantity)){
                returnValue1 = parseInt(returnValue1) + parseInt(goodsList[j].quantityQuantity);
            }
        }for(var j = 0; j < goodsList.length; j++ ){
	        if(goodsList[j].grossMassMeasure!=""&&!isNaN(goodsList[j].grossMassMeasure)){
	            returnValue2 = parseFloat(returnValue2) + parseFloat(goodsList[j].grossMassMeasure);
	        }
    	}
        $("totalQuantity").value=returnValue1;
        $("totalGross").value=parseFloat(returnValue2.toFixed(4));
        
       //设置总重量和总件数在表头栏目中
       setColoumnQuantityAndGross();
      //删除货物后把光标定位到集装箱文本框上 add by cyx 20091215
      $("contaId1").focus() ; 
    }    
}


//装船单号被选中的计数器
var getShipNoCount = 0;
function getShippingNoAct(){
    var agentId = $("shipagentId").value;
    if(agentId == ""){
        //alert('请选择船代！');
        return;
    }
    if($("shippingNo").value != ""){
        return;
    }
    //dwr后台存储
    prepItemCache.getNextSerial(agentId, {callback:function (data) {
        if(data != ""){
            $("shippingNo").value = data;
        }else{
            if(window.getShipNoCount==0){
                alert("无法自动生成装船单号，请先设置对应船代的流水号或手工录入装船单号");
                window.getShipNoCount++;
            }
        }
    },
     timeout:60000,
	 errorHandler:function(msg){alert(msg);}
    });
}

//根据通关方式，将相关的选项设置为只读
function changeStatus(declType,focusEle,change){
 //获取通关方式

 val =declType.value;
 if (null!=val){
  //如果为"清关"或"监管仓"
  if ("Q"==val||"J"==val){
  	//转关启动地代码	
	$("transhipmentLocationId").value="";
	//转关启动地代码(名称)
	$("transhipmentLocationName").value="";
	//转关目的地代码
	$("transitDestinationId").value="";
	//转关目的地代码(名称)
	$("transitDestinationIdName").value="";
	
	jQuery("#zaihuoqingdan").attr("class","")
//	$("zaihuoqingdan").setAttribute("class","");
	
	$("manifestNo").setAttribute("disabled",true);
	$("manifestNo").value="";
	/* --add by wangmin 20140327 去掉不可用限制
	$("transhipmentLocationId").setAttribute("className","disabled");
	$("transitDestinationIdName").setAttribute("className","disabled");
	
	$("transitDestinationId").setAttribute("className","disabled");
	$("transhipmentLocationName").setAttribute("className","disabled");

	//转关启运地代码 中 选择图标
	$("selectTranshipmentLocation").setAttribute("className","disabled");
	//转关目的地代码 中 选择图标
	$("selectTransitDestinationId").setAttribute("className","disabled");*/ 

	//把转关启运地代码 "文字标签"   的样式恢复默认值  比如设置文字显示为红色，现在是把文本恢复为默认值(黑色)
	//$("locationId1").setAttribute("className","");
	//把转关目的地代码 "文字标签"   的样式恢复默认值
	//$("id1").setAttribute("className","");

  }else if("Z"==val){//如果为转关  
  	//转关启运地代码 数据项恢复为可用	
	/*$("transhipmentLocationId").disabled=false ;
	$("transhipmentLocationName").disabled=false;
	$("selectTranshipmentLocation").disabled=false;
	//转关目的地代码 数据项恢复为可用	
	$("transitDestinationId").disabled=false ;	
	$("selectTransitDestinationId").disabled=false;	
	$("transitDestinationIdName").disabled=false;*/
	
	$("transhipmentLocationId").setAttribute("className","textinput21");
	$("transhipmentLocationName").setAttribute("className","textinput21");
	$("selectTranshipmentLocation").setAttribute("className","textinput21");
	
	$("transitDestinationId").setAttribute("className","textinput21");	
	$("selectTransitDestinationId").setAttribute("className","textinput21");	
	$("transitDestinationIdName").setAttribute("className","textinput21");
	
	$("transitDestinationIdName").setAttribute("className","textinput21");
	
	jQuery("#zaihuoqingdan").attr("class","notnull")
//	$("zaihuoqingdan").setAttribute("class","notnull");
	
	$("manifestNo").removeAttribute("disabled",false);
	
	
	//把转关启运地代码和转关目的地代码中的样式设置为必输项
	//$("locationId1").setAttribute("className","notnull");
	//$("id1").setAttribute("className","notnull");
	
	//通关方式为转关时,"转关目的地代码"默认为CNYTN
	$("transitDestinationId").value="CNYTN"; 
	getNameByCode('PORT_CN','transitDestinationId','transitDestinationIdName','转关目的地代码');
	
	if ("1"==change){
	   $("transitDestinationId").value = $("customsOfficeId").value ;
	   getNameByCode('PORT_CN','transitDestinationId','transitDestinationIdName','转关目的地代码');//重新加载	转关目的地代码 add by cyx 20100106	     
	}	

  }
   //转关目的地代码
   //var objDiv1 = $("id1");
   //if ($("transitDestinationId").value=="" && "Z"==val){
   //    $("transitDestinationId").value="CNYTN" ;            
   //}
   
   //设置离境地港口代码 
   if ($("customsOfficeId").value==""){
       $("customsOfficeId").value="CNYTN" ;            
   }
 }
}
//add by wangmin 20140327 加入"货物海关状态"联动
function changeGoodsStatus(obj) {
	val = obj.value;
	if(val == '002') {
		$("id1").setAttribute("className","notnull");
	} else {
		$("id1").setAttribute("className","");
	}
}

function changeSomeVal(fromTag,toTag){
   var val = $("subShippingNo").value ;
   if(val==""){
   //如果装船单号后面的文本没有输值，则总运单号=$("shippingNo").value + $("dateShippingNo").value
   //$("contractId").value = $("shippingNo").value;
   //alert('请输入装船单号后面4位,数字类型,且输入长度必须是4位!');
   //$("subShippingNo").focus();
   $("subShippingNo").value=$("hidden_subShippingNo").value;
   $("contractId").value = $("shippingNo").value + $("dateNo").value +  $("subShippingNo").value;
    return;    
    }
   
   if( isNaN(val) || val.length!=4 ){ 
     alert('请输入装船单号后面4位流水号,数字类型,且输入长度必须是4位!');     
     $("subShippingNo").value=""; 
     $("contractId").value = $("shippingNo").value + $("dateNo").value;
     $("subShippingNo").focus();
     return ;
   }   
   
   //总运单号==装船单号+""
   $("contractId").value = $("shippingNo").value + $("dateNo").value +  $("subShippingNo").value;

}

function changeInputModel(){
   if ($("bulkNum").value<2 && $("bulkNum").value>0){
      $("consolidatorId").readOnly=true ;
      $("consolidatorId").value="" ;            
   }else if ($("bulkNum").value<=0){
      $("consolidatorId").readOnly=true ; 
      $("bulkNum").value="1" ;
      $("consolidatorId").value="" ;
     
   }else{       
       $("consolidatorId").readOnly=false ;   
       $("consolidatorId").focus();        
   }
}

//批量选择舱单 val值为true或false
function selectedAll(val){
	var pidsObj = document.getElementsByName('pids');
	if(pidsObj.length==0 && typeof(pidsObj.tagName)=='undefined'){
		return;
	}	
	if(pidsObj){	 
	 if (val){//选中
	  if (pidsObj.length==0){
	    pidsObj.checked=1;
	  }else {
	   for(i=0;i<pidsObj.length;i++){
	    pidsObj[i].checked=1;
	   }
	 }
	}else{//取消
	   if (pidsObj.length==0){
	    pidsObj.checked=0;
	  }else {
	   for(i=0;i<pidsObj.length;i++){
	    pidsObj[i].checked=0;
	   }
	 }
	}
	}
}

//预配舱单信息批量改状态
function resetConsignment(){
	
	
	var pidsObj = document.getElementsByName('pids');
	if(pidsObj.length==0 && typeof(pidsObj.tagName)=='undefined'){
		alert("请选择需要操作的舱单记录！");
		return;
	}
	if(pidsObj.length>0){
		   //如果没有选择的记录，则给出提示
		   if (pidsObj.length==0){
		    if(!pidsObj.checked){
			 alert("请选择需要操作的舱单记录！");
			 return ;
			}
		  }else {
		  var consIds='';
		   for(var i=0;i<pidsObj.length;i++){
	    	if(pidsObj[i].checked){
	    		consIds=consIds+ ',' + pidsObj[i].value;
		   	}
		   }
		   //alert("111111111-->" + pidsObj.length);
		   
		   //如果选择了要改状态的记录
		   if(consIds!='' && consIds.length>0){
		   	 //更新状态
		   	 if(!confirm("确定要将所选择的舱单置为新单吗？")){
		   	 	return ;
		   	 }
		   	 prepItemCache.updateConsignmentStatus(consIds.substring(1),"0",{
		   	 callback:function (data){
	                var info = data;
	                if (null!=info && info=='0')
	                {
	                	alert("已成功将所选择的预配舱单置为新单!");
	                	document.forms[0].submit();
	                }else{
	                	alert("把预配舱单置为新单操作失败:" + info);
	                }
	            }, 
			    timeout:60000,
		        errorHandler:function(msg){alert(msg);}   
	            });
		   }else{
		   	   alert("请选择要置为新单的舱单！");
		   }
		 } 
		 
	}
}

//在集装箱的的表头中加入统计的件数和毛重
function setColoumnQuantityAndGross(){
  var totalQuantity=$("totalQuantity").value;
  var totalGross=$("totalGross").value;
  if(totalQuantity==''){
    totalQuantity=0;
  }
  if(totalGross==''){
    totalGross=0;
  }
  $("coloumnGross").innerText=totalGross;
  $("coloumnQuantity").innerText=totalQuantity;
  $("totalGrossMassMeasure").value=totalGross;
  $("quantityQuantity").value=totalQuantity;
}
//计算和设置重量
function sumQuantityAndGross(){
   var totalGross=0;
   var totalQuantity=0;
  if (null!=goodsList){
	   	   //定义货物毛重的小数位数
	   	   var grossLen=0;
	   	   var quantityLen=0;
		   for(var t=0;t<goodsList.length;t++){
		     //单条货物毛重
		   	 var strGross = goodsList[t].grossMassMeasure;
		   	 //货物毛重累加
			 totalGross += parseFloat(strGross); 
			 //单条货物件数 
			 var strQuantity = goodsList[t].quantityQuantity;
			 //货物件数累加
			 totalQuantity+=parseFloat(strQuantity);
			 //计算货物毛重的最大小数位数
			 if(strGross.indexOf('.')>0){
			 	var tmpGrossLen= strGross.substring(strGross.indexOf('.') + 1).length;
			 	if(tmpGrossLen>grossLen){
			 		grossLen=tmpGrossLen;
			 	}
			 }
			 /**
			 //计算货物件数的最大小数位数
			 if(strQuantity.indexOf('.')>0){
			 	var tmpQuantityLen= strQuantity.substring(strQuantity.indexOf('.') + 1).length;
			 	if(tmpQuantityLen>quantityLen){
			 		quantityLen=tmpQuantityLen;
			 	}
			 }
			 */
		   }
		   //调用一个函数，对累加后的小数位数进行截取
		   totalGross = totalGross.toFixed(grossLen);
		   totalQuantity = totalQuantity.toFixed(0);
		   $("coloumnGross").innerText=totalGross;
           $("coloumnQuantity").innerText=totalQuantity;
		   $("totalGrossMassMeasure").value=totalGross;
		   $("quantityQuantity").value=totalQuantity;
   }
}


function selectLinkMan(type){
	var thetime = new Date();
	var currentTime=thetime.getHours()*10000+thetime.getMinutes()*100+thetime.getSeconds();
	var pType='' ;
	if(type=='1'){
		pType='consignor';
	}else if(type=='3'){
		pType='notify';
	}else if(type=='2'){
		pType='consignee';
	}
	var url="url:../customerlinkman/searchLinkMan.action?type="+pType+"&current="+currentTime;
	jQuery.dialog({
		id:'selectLinkMan',
		title: "代码选择",
		content: url,
		width : "660px",
		height : "480px",
		max:false,
		min:false,
		resize:false,
		lock:true,
		drag:false,
	    init:function(){
	    	window.returnDate = '';
	    },
	    close:function(){
			var returnValue = window.returnValue;
			var returnDate = window.returnDate;
			if(null != returnValue && returnDate == 1)
			{
				var info=returnValue.split("^");
				 if(type=='1'){
			         $("ownerCode").value=info[0];
			         $("consignorName").value=info[1];
			         $("consignorLine").value=info[2];
			         $("consignorRealCode").value=info[3];
			         $("consignorConCode").value=info[4];
			      }
				 if(type=='2'){
			         cascadeCheck();
			         $("consigneeCode").value=info[0];
			         $("consigneeName").value=info[1];
			         $("consigneeLine").value=info[2];
			         $("consigneeConCode").value=info[4];
			         $()
			         cascadeCheck();
			         $("consigneeCode").value=info[0];
			         $("consigneeName").value=info[1];
			         $("consigneeLine").value=info[2];
			         $("consigneeConCode").value=info[4];
			      }
				 if(type=='3'){
			         $("notifyCode").value=info[0];
			         $("notifyName").value=info[1];
			         $("notifyLine").value=info[2];
			         $("notifyConCode").value=info[4];
			      }
			}
	    }
	});
}

//根据数据获取收发通人员
function getLinkManRemote(type){
    var code='';
    var pType='';
    if(type=='1'){
    	 pType='consignor';
         code=$("ownerCode").value;
    }
    if(type=='2'){
         code=$("consigneeCode").value;
         if(code.toUpperCase()=="TO ORDER"){
          return;
         }
         pType='consignee';
    }
    if(type=='3'){
        code=$("notifyCode").value;
        pType='notify';
    }
    
    if(code!=''){
      code=code.toUpperCase();
      customerLinkManAction.getCustomerLinkManByCode(code,pType,{
		   	 callback:function (data){
		   	   if(data!=null){
		   	      var name=data.name;
		   	      var addr=data.addr;
		   	      if(type=='1'){
			         $("consignorName").value=name;
			         $("consignorLine").value=addr;
			         $("consignorRealCode").value=data.realCode;
			         $("consignorConCode").value=data.tel;
			      }
			      if(type=='2'){
			         $("consigneeName").value=name;
			         $("consigneeLine").value=addr;
			         $("consigneeConCode").value=data.tel;
			      }
			      if(type=='3'){
			         $("notifyName").value=name;
			         $("notifyLine").value=addr;
			         $("notifyConCode").value=data.tel;
			      }
		   	   }
		   	 },
		   	 timeout:60000,
		     errorHandler:function(msg){}   
		   	 });
    }
}

function getEntTypeByCountryCode(type){
	var countryCode='';
	if(type=="1"){
		countryCode = $("consigneecountryCode").value.trim().toUpperCase();
	}else{
		countryCode = $("notifycountryCode").value.trim().toUpperCase();
	}
	if(countryCode == "")
		return;
	
   if (countryCode!=""){
   	   if(!(/^[a-zA-Z]*$/g).test(countryCode)){
   	       alert('国家代码只能输入2位英文字母.');
   	       if(type=="1"){
   	    	   $("consigneecountryCode").focus();
		   }else{
			   $("notifycountryCode").focus();
		   }
   	       return false;
   	   }
   	   if( countryCode.length!=2 ){
   		   alert('国家代码只能输入2位英文字母.');
   		   if(type=="1"){
	    	   $("consigneecountryCode").focus();
		   }else{
			   $("notifycountryCode").focus();
		   }
	       return false;
   	   }
   }
	   
   DWREngine.setAsync(false);
	entCodeTypeAction.getEntCodeTypeByCountryCode(countryCode,{
		   callback:function(data){
			   var select;
			   if(type=="1"){
				   select = jQuery("#consigneeType");
			   }else{
				   select = jQuery("#notifyType");
			   }
			   jQuery(select).empty();
			  if (null!=data){
				  for(var i=0;i<data.length;i++ ){
					  var option = jQuery("<option value='"+data[i].entType+"'>"+data[i].entType+"</option>");
					  jQuery(select).append(option);
				  }
				  var option = jQuery("<option value='9999'>9999</option>");
				  var option1 = jQuery("<option value='8888'>8888</option>");
				  var option2 = jQuery("<option value='PASSPORT'>PASSPORT</option>");
				  var option3 = jQuery("<option value='ID'>ID</option>");
				  jQuery(select).append(option);
				  jQuery(select).append(option1);
				  jQuery(select).append(option2);
				  jQuery(select).append(option3);
			  }else{
				  var option = jQuery("<option value='9999'>9999</option>");
				  var option1 = jQuery("<option value='8888'>8888</option>");
				  var option2 = jQuery("<option value='PASSPORT'>PASSPORT</option>");
				  var option3 = jQuery("<option value='ID'>ID</option>");
				  jQuery(select).append(option);
				  jQuery(select).append(option1);
				  jQuery(select).append(option2);
				  jQuery(select).append(option3);
			  }
		   },
        timeout:60000,
        errorHandler:function(msg){alert(msg);}
		}								   
	 )
	 DWREngine.setAsync(true);
}