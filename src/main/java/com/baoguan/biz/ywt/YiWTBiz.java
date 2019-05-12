package com.baoguan.biz.ywt;
/**
 * Function: <br/>
 * REASON: <br/>
 * VERSION: 4.0
 *
 * @Auther: zhangyang
 * @Date: 2019/3/4.
 */

import com.baoguan.biz.entity.ywt.*;
import com.baoguan.tools.DateUtils;
import com.baoguan.tools.HttpTransfer;
import com.baoguan.tools.JsonUtils;

import java.lang.reflect.Field;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.net.URLEncoder;
import java.util.*;

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
    public int INDEX = 1;
    private StringBuffer sb = new StringBuffer();
    private StringBuffer dataSb = new StringBuffer();
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
        Ywt_BorderTransportMeans y = new Ywt_BorderTransportMeans();
        y.setAgentId("123");
        y.setArrivalDateTime("123-123-123");
        y.setCarrierId("123");
        yi.setBorderTransport(y);

        Ywt_PersonInfo personInfo = new Ywt_PersonInfo();
        Ywt_Address address  = new Ywt_Address();
        address.setCityName("zhongguo");
        address.setCountrySubEntityID("1231231");
        address.setContent("test");
        address.setCountryCode("123");
        address.setCountrySubEntityName("123Name");
        address.setId(123);
        address.setLine("linetest");
        address.setPostcodeID("dfasdf");
        address.setReferId(123);
        address.setReferType("fasd");
        address.setTypeCode("aaaa");
        personInfo.setAddress(address);
        personInfo.setName("yy");
        personInfo.setAeo("aeo");
        personInfo.setCode("123");
        List<Ywt_Communication> listsCommunications = new ArrayList<Ywt_Communication>();
        Ywt_Communication ywt_Communication = new Ywt_Communication();
        ywt_Communication.setCode("123");
        ywt_Communication.setId(12222);
        ywt_Communication.setPersonId(411);
        ywt_Communication.setTypeId("type123");
        listsCommunications.add(ywt_Communication);
        personInfo.setCommunicationList(listsCommunications);
        personInfo.setContactPerson("percontact");
        personInfo.setId(5555);
        yi.setConsignor(personInfo);
        
        
        
        List<Ywt_ContaInfo> list = new ArrayList<>();

        Ywt_ContaInfo yc = new Ywt_ContaInfo();
        yc.setBeUse(1);
        yc.setAgencyCodeList("测试汉字");
        list.add(yc);


        //----------------------------------

        Ywt_ContaInfo yc1 = new Ywt_ContaInfo();
        yc1.setBeUse(1);
        yc1.setAgencyCodeList("atetest");
        list.add(yc1);
        //----------------------------------

        yi.setContaInfoList(list);

    	yi.setConsolidatorId("afadsdfasdf");
        yi.setIsAuto(33);
        //c0-e1=string:001

        Field[] field = yi.getClass().getDeclaredFields();
        for(Field f :field){
            f.setAccessible(true);
//            System.out.println(f.getType().getSimpleName()+"   "+f.getName());
//            sb.append(SEINDEX).append(index).append("=").append(str_str).append(f.get(yi)).append("\n");
            spllData(f, f.get(yi));
            resultDataMap.put(f.getName(), INDEX);
            INDEX++;
        }
        sb.append("c0-param0=Object_Consignment:{").append(dataSb.substring(0,dataSb.length()-1))
                .append("}").append("\n");
        System.out.println(sb.toString());

        for(Map.Entry<String, Integer> s:resultDataMap.entrySet()){
            System.out.println(s.getKey()+"   "+s.getValue());
        }

    }

    private void spllData(Field  field,Object value){
//        if(value==null){
//            sb.append(SEINDEX).append(index).append("=").append(str_null).append("\n");
//        } else
        String type = field.getType().getSimpleName();
    	if(Objects.equals(type, "String")){
    	    if(value==null){
                sb.append(SEINDEX).append(INDEX).append("=").append(str_str).append(value).append("\n");
            }else{
                System.out.println(value+"----"+URLEncoder.encode((String)value));
                sb.append(SEINDEX).append(INDEX).append("=").append(str_str).append(URLEncoder.encode((String)value)).append("\n");
            }
    	}else if(Objects.equals(type, "int")){
            sb.append(SEINDEX).append(INDEX).append("=").append(str_number).append(value).append("\n");
        }else if(Objects.equals(type, "List")){
            this.reflushList(field,value);
//        	sb.append(SEINDEX).append(INDEX).append("=").append("list").append(value).append("\n");
        }else if(Objects.equals(type, "Ywt_BorderTransportMeans")){
    	    this.reflushBorder((Ywt_BorderTransportMeans)value);
//        	sb.append(SEINDEX).append(INDEX).append("=").append("Ywt_BorderTransportMeans").append(value).append("\n");
        }else if(Objects.equals(type, "Ywt_PersonInfo")){
        	this.reflushPersonInfo((Ywt_PersonInfo)value);
        }else if(Objects.equals(type, "Ywt_BorderTransportMeans")){
        	sb.append(SEINDEX).append(INDEX).append("=").append("Ywt_BorderTransportMeans").append(value).append("\n");
        }else if(Objects.equals(type, "Ywt_BorderTransportMeans")){
        	sb.append(SEINDEX).append(INDEX).append("=").append("Ywt_BorderTransportMeans").append(value).append("\n");
        }else if(Objects.equals(type, "Ywt_Address")){
        	this.reflushAddress((Ywt_Address)value);
        }else if(Objects.equals(type, "Ywt_Communication")){
        	this.reflushCommunication((Ywt_Communication)value);
        }

        dataSb.append(field.getName()).append(":reference:").append(SEINDEX).append(INDEX).append(",");


    }


    private void reflushCommunication(Ywt_Communication y) {

    	StringBuffer ss = new StringBuffer();
    	try {
			Field[] fields = y.getClass().getDeclaredFields();
			for(Field field:fields) {
				field.setAccessible(true);
				spllData(field, field.get(y));
				ss.append(field.getName()).append(":").append("reference:").append(SEINDEX).append(INDEX).append(",");
				INDEX++;
			}
            sb.append(SEINDEX).append(INDEX).append("=").append("Object_Communication{").append(ss.toString().substring(0,ss.length()-1))
                    .append("}").append("\n");
			INDEX++;
        } catch (Exception e) {
            // TODO: handle exception
        }
    	
    	
    	
	}


	private void reflushAddress(Ywt_Address y) {

    	StringBuffer ss = new StringBuffer();
    	try {
			Field[] fields = y.getClass().getDeclaredFields();
			for(Field field:fields) {
				field.setAccessible(true);
				spllData(field, field.get(y));
				ss.append(field.getName()).append(":").append("reference:").append(SEINDEX).append(INDEX).append(",");
				INDEX++;
			}
            sb.append(SEINDEX).append(INDEX).append("=").append("Object_Address{").append(ss.toString().substring(0,ss.length()-1))
                    .append("}").append("\n");
			INDEX++;
        } catch (Exception e) {
            // TODO: handle exception
        }
    	
	}


	public void reflushList(Field field,Object value) {
        List<String> addlist = new ArrayList<>();
        field.setAccessible(true);
//            System.out.println("==================="+field.getType().getSimpleName());
//            if(Objects.equals(field.getType().getSimpleName(),"List")){
            Type genericType = field.getGenericType();
            if(genericType == null) return;
            if(genericType instanceof ParameterizedType){
                ParameterizedType pt = (ParameterizedType) genericType;
                //得到泛型里的class类型对象
                List list = (List)value;
                if(list==null){
                	sb.append(SEINDEX).append(INDEX).append("=").append("list:").append(value).append("\n");
                    return;
                }
                Class<?> genericClazz = (Class<?>)pt.getActualTypeArguments()[0];
                String simpleName = genericClazz.getSimpleName();
                for(int i = 0 ; i<list.size();i++){
                    if(Objects.equals(simpleName,"Ywt_ContaInfo")){
                        this.reflushContaInof((Ywt_ContaInfo)list.get(i));
                    }else if(Objects.equals(simpleName,"")){

                    }
                    addlist.add("reference:"+SEINDEX+""+(INDEX-1));
                }
                String abc = "";
                for(String s: addlist){
                    abc+=s+",";
                }
                sb.append(SEINDEX).append(INDEX).append("=").append("Array:[").append(abc.substring(0,abc.length()-1))
                        .append("]").append("\n");
//                INDEX++;
            }
//            }
    }

    
    public void reflushPersonInfo(Ywt_PersonInfo y) {
    	StringBuffer ss = new StringBuffer();
    	try {
			Field[] fields = y.getClass().getDeclaredFields();
			for(Field field:fields) {
				field.setAccessible(true);
				spllData(field, field.get(y));
				ss.append(field.getName()).append(":").append("reference:").append(SEINDEX).append(INDEX).append(",");
				INDEX++;
			}
            sb.append(SEINDEX).append(INDEX).append("=").append("Object_PersonInfo{").append(ss.toString().substring(0,ss.length()-1))
                    .append("}").append("\n");
			INDEX++;
        } catch (Exception e) {
            // TODO: handle exception
        }
    	
    	
    }
    

    public void reflushContaInof(Ywt_ContaInfo y) {
        StringBuffer ss = new StringBuffer();
    	try {
			Field[] fields = y.getClass().getDeclaredFields();
			for(Field field:fields) {
				field.setAccessible(true);
				spllData(field, field.get(y));
				ss.append(field.getName()).append(":").append("reference:").append(SEINDEX).append(INDEX).append(",");
				INDEX++;
			}
            sb.append(SEINDEX).append(INDEX).append("=").append("Object_ContaInfo{").append(ss.toString().substring(0,ss.length()-1))
                    .append("}").append("\n");
			INDEX++;
        } catch (Exception e) {
            // TODO: handle exception
        }
    }
    

    public void reflushBorder(Ywt_BorderTransportMeans b) {
        StringBuffer ss = new StringBuffer();
        try {
            Field[] fields = b.getClass().getDeclaredFields();
            for(Field field:fields){
                field.setAccessible(true);
                spllData(field, field.get(b));
                ss.append(field.getName()).append(":").append("reference:").append(SEINDEX).append(INDEX).append(",");
                INDEX++;
            }
            sb.append(SEINDEX).append(INDEX).append("=").append("Object_BorderTransportMeans{").append(ss.toString().substring(0,ss.length()-1))
            .append("}").append("\n");
            INDEX++;
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        }

    }
    
    
    
    

    

}
