package com.baoguan.biz.ywt;/**
 * Function: <br/>
 * REASON: <br/>
 * VERSION: 4.0
 *
 * @Auther: zhangyang
 * @Date: 2019/3/4.
 */

import java.lang.reflect.Field;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import com.baoguan.biz.entity.ywt.*;
import com.baoguan.tools.DateUtils;
import com.baoguan.tools.HttpTransfer;
import com.baoguan.tools.JsonUtils;

/**
 * File Name:易网通
 * @Description TODO
 * Date:2019/3/4 17:15  
 * @author zhangyang
 * @Version 4.0
 * Copyright (c) 2019,  All Rights Reserved.  
 */
public class YiWTBiz {

    public static final String str_null = "NULL:NULL";
    public static String str_str = "string:";
    public static String str_number = "number:";
    public int index = 0;
    private StringBuffer sb = new StringBuffer();
    private Map<String,Integer> resultDataMap = new HashMap<>();
    private static final String SEINDEX = "c0-e";

    private Map<String,String> getHeader(){
        Map<String,String> headerMap = new HashMap<>();
        headerMap.put("Accept"  ,"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8");
        headerMap.put("Accept-Encoding"  ,"gzip, deflate");
        headerMap.put("User-Agent"  ,"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36");
        headerMap.put("Cookie"  ,"JSESSIONID=E938C9F2EFE806BAF97D57C740C6E609.mf2");
//        headerMap.put(""  ,"");
//        headerMap.put(""  ,"");
//        headerMap.put(""  ,"");
//        headerMap.put(""  ,"");

        return headerMap;
    }


    private String getDate(int pos,String par){

        long time = new Date().getTime();
        long _pos = pos*24*60*60*1000;
        String date = null;
        if("+".equals(par)){
            date = DateUtils.dateFormat(new Date(time+_pos),"yyyy-MM-dd");
        }else{
            date = DateUtils.dateFormat(new Date(time-_pos),"yyyy-MM-dd");
        }
        System.out.println(date);
        return date;
    }

    public void getBoatByName(String name,String no,String agentid){
//        String url = "http://120.76.198.92:8988/mf/ship/search_ship.action?agentid=941&selectType=null";
        String url = "http://120.76.198.92:8988/mf/ship/search_ship.action?agentid="+agentid+"&selectType=null";
        Map<String,String> dataMap = new HashMap<>();
        dataMap.put("shippingInfo.evoyageNo",no);
        dataMap.put("shippingInfo.shipName",name);
        dataMap.put("shippingInfo.startDate",this.getDate(7,"-"));
        dataMap.put("shippingInfo.endDate",this.getDate(7,"+"));
        dataMap.put("page","1");
        String s = HttpTransfer.doPost(url,this.getHeader(),dataMap,"UTF-8");
        System.out.println("------"+s);
    }


    public static void main(String[] args) throws IllegalAccessException {
        YiWTBiz y = new YiWTBiz();
//        y.getBoatByName("","","");
    	
    	Ywt_Consignment yi = new Ywt_Consignment();
    	String s = JsonUtils.OjectToJson(yi);
//    	System.out.println(s);
        y.reflush(yi);
    }

    
    //获取model的值并进行字符串拼接
    public void reflush(Ywt_Consignment yi) throws IllegalArgumentException, IllegalAccessException{
    	List<Ywt_ConsignmentItem> conList = yi.getConsignmentItemList();
    	Ywt_PersonInfo consPerson = yi.getConsignee();
    	List<Ywt_ContaInfo> contaList = yi.getContaInfoList();
    	Ywt_PersonInfo conorPerson = yi.getConsignor();
        yi.setConsolidatorId("afadsdfasdf");
        yi.setIsAuto(33);
        //c0-e1=string:001

        Field[] field = yi.getClass().getDeclaredFields();
        for(Field f :field){
            f.setAccessible(true);
            System.out.println(f.getType().getSimpleName()+"   "+f.getName());
//            sb.append(SEINDEX).append(index).append("=").append(str_str).append(f.get(yi)).append("\n");
            spllDate(f.getType().getSimpleName(), f.get(yi));

            resultDataMap.put(f.getName(), index);
            index++;
        }
        System.out.println(sb.toString());

        for(Map.Entry<String, Integer> s:resultDataMap.entrySet()){
            System.out.println(s.getKey()+"   "+s.getValue());
        }

    }

    private void spllDate(String type,Object value){
        if(value==null){
            sb.append(SEINDEX).append(index).append("=").append(str_null).append("\n");
        }else if(Objects.equals(type, "String")){
            sb.append(SEINDEX).append(index).append("=").append(str_str).append(value).append("\n");
    	}else if(Objects.equals(type, "int")){
            sb.append(SEINDEX).append(index).append("=").append(str_number).append(value).append("\n");
        }else if(Objects.equals(type, "List")){

        }else if(Objects.equals(type, "Ywt_BorderTransportMeans")){

        }else if(Objects.equals(type, "Ywt_PersonInfo")){

        }else if(Objects.equals(type, "Ywt_BorderTransportMeans")){

        }else if(Objects.equals(type, "Ywt_BorderTransportMeans")){

        }

    }

    public void reflushPerson(Ywt_PersonInfo p){
        List<Ywt_Communication> commList =  p.getCommunicationList();
        Ywt_Address add = p.getAddress();
    }

}
