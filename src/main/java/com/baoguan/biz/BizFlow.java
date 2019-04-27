package com.baoguan.biz;/**
 * Function: <br/>
 * REASON: <br/>
 * VERSION: 4.0
 *
 * @Auther: zhangyang
 * @Date: 2019/4/22.
 */

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * File Name:BizFlow  
 * @Description TODO
 * Date:2019/4/22 11:12  
 * @author zhangyang
 * @Version 4.0
 * Copyright (c) 2019,  All Rights Reserved.  
 */
public abstract class BizFlow<T> {

	public Log log = LogFactory.getLog(this.getClass());

    //header
    public Map<String,String> getHeader(){
        Map<String,String> headerMap = new HashMap<>();
        headerMap.put("Referer","");
        headerMap.put("Accept","text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8");
        headerMap.put("Upgrade-Insecure-Requests","1");
        headerMap.put("Pragma","no-cache");
        headerMap.put("Accept-Language","zh-CN,zh;q=0.9");
        headerMap.put("Cookie",this.getCookie());
        headerMap.put("User-Agent","Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36");
        return headerMap;
    }

    protected abstract String getCookie();
    
    public abstract boolean login() ;
    
    
    //判断当前是否在登录的状态中
    public abstract boolean checkLogined();
    
    
    
    private int isLogin() {
    	if(!checkLogined()) {//尝试重新登录
    		if(!this.login()) {
    			log.info("尝试登录失败");
    			return -1;
    		}
    	}
    	return 0;
    }
    
   /**
    * 根据条件搜索单据
    * 1、集装箱号
    * 2、船名称
    * init:(). <br/>  
    * @author zhangyang    
    *  
    * @param condation
    * @return  
    * @since JDK 1.8
    */
    public Object init(String condation) {
    	if(this.isLogin()==-1) {
    		return null;
    	}
    	return initData(condation);
    }

	protected abstract Object initData(String condation);//页面初始化获得数据

	public int insert(T data){
    	if(this.isLogin()==-1) {
    		return -1;
    	}
        if(this.checkIns(data)){
            return this.insertData(data);
        }
        return -1;
    }

    public int send(T data){
    	if(this.isLogin()==-1) {//判断是否是登录状态
    		return -1;
    	}
        if(this.checkSend(data)){
            return this.sendData(data);
        }
        return -1;
    }
    public int update(T data){
    	if(this.isLogin()==-1) {
    		return -1;
    	}
    	
        if(this.checkUpd(data)){
            return this.updateData(data);
        }
        return -1;
    }
    public int delete(T data){
    	if(this.isLogin()==-1) {
    		return -1;
    	}
    	
        if(this.checkDel(data)){
            return this.deleteData(data);
        }
        return -1;
    }

    
    protected abstract boolean checkDel(T data);

    protected abstract boolean checkUpd(T data);

    protected abstract boolean checkSend(T data);

    protected abstract boolean checkIns(T data);

    public abstract int insertData(T data);//可以使用domain的模式，该处现在为了省事故，使用了map

    public abstract int sendData(T data);

    public abstract int updateData(T data);

    public abstract int deleteData(T data);
}
