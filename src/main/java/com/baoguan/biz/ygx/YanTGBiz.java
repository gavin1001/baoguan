package com.baoguan.biz.ygx;/**
 * Function: <br/>
 * REASON: <br/>
 * VERSION: 4.0
 *
 * @Auther: zhangyang
 * @Date: 2019/3/2.
 */

import com.baoguan.tools.HttpTransfer;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.*;

/**
 * File Name:YanTGBiz
 * @Description 盐田港
 * Date:2019/3/2 11:21  
 * @author zhangyang
 * @Version 4.0
 * Copyright (c) 2019,  All Rights Reserved.  
 */
public class YanTGBiz {

    private Map<String,String> getHeader(){
        Map<String,String> headerMap = new HashMap<>();
        headerMap.put("Referer","http://www.yesinfo.com.cn/pqs_revision/pages/jsp/popuPublic.jsp");
        headerMap.put("Accept","text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8");
        headerMap.put("Upgrade-Insecure-Requests","1");
        headerMap.put("Pragma","no-cache");
        headerMap.put("Accept-Language","zh-CN,zh;q=0.9");
        headerMap.put("Cookie","WLSESSIONID=HVfWc8QZfZps7psgpKvrTvJ8s8CLZgydzGdYnbpkZf9HwTvJSlRp!-448405180");
        headerMap.put("User-Agent","Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36");
        return headerMap;
    }


    private Map<String,String> getCookieHeader(){
        Map<String,String> headerMap = new HashMap<>();
        headerMap.put("Referer","http://www.yesinfo.com.cn/publicInfoService/index.action");
        headerMap.put("Host","www.yesinfo.com.cn");
        headerMap.put("Accept","text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8");
        headerMap.put("Upgrade-Insecure-Requests","1");
        headerMap.put("Cache-Control","max-age=0");
        headerMap.put("Proxy-Connection","keep-alive");
        headerMap.put("Accept-Language","zh-CN,zh;q=0.9");
        headerMap.put("Accept-Encoding","gzip, deflate");
        headerMap.put("User-Agent","Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36");
        return headerMap;
    }



    public String getHtmlByCond(String cond){
        String ur = "http://www.yesinfo.com.cn/pqs_revision/pages/jsp/popcontquery.jsp?contid=YMLU8772365&p=&param=";
        return HttpTransfer.httpGet(ur,null,this.setCookie(),"GBK");
    }



    /**
     * 设置cookie
     * setCookie:(). <br/>  
     * @author zhangyang    
     *  
     * @return  
     * @since JDK 1.8
     */
    public Map<String,String> setCookie()  {
        Map<String,String> headerMap =  this.getHeader();
        String totleCookie = "";
        String url1= "http://www.yesinfo.com.cn/pqs_revision/pages/jsp/popuPublic.jsp";
        String cookie1 = null;
        try {
            cookie1 = HttpTransfer.getCookieByGet(url1,null,this.getCookieHeader());
        } catch (IOException e) {
            e.printStackTrace();
        }
        String setCoo = cookie1.split(";")[0];
        totleCookie+=setCoo+"";
        headerMap.put("Cookie",totleCookie);//WLSESSIONID=nSHhc84hDlYNln1LnQ6p7z6Jf19CSdn5ZLhvvs2XvH1phJ6R08yH!-448405180
        HttpTransfer.httpGet("http://www.yesinfo.com.cn/pqs_revision/pages/resources/css/toolShowDiv.css?0.48565905760984296",null,headerMap);
        return headerMap;
    }


    //获取通过集装箱号查询出的信息
    public Map<String,String> parseXMl(String s){
        Document doc = Jsoup.parse(s);
        Map<String,String> dataMap = new HashMap<>();
        Element body = doc.body();
        Elements tables =  body.select("tbody");

        Elements trs = tables.select("tr");

        for(Element tr:trs){
            Elements tds =  tr.select("td");
            if(tds.size()==4){
                dataMap.put(tds.get(0).text(),tds.get(1).text());
                dataMap.put(tds.get(2).text(),tds.get(3).text());
            }else if(tds.size()==2){
                dataMap.put(tds.get(0).text(),tds.get(1).text());
            }
        }
        for(Map.Entry<String, String> es:dataMap.entrySet()){
            System.out.println(es.getKey()+"-----"+es.getValue());
        }
        return dataMap;
    }



    public static void main(String[] args) throws IOException, URISyntaxException {
//        String idata = "cntrId=YMLU8772365";
//        dataMap.put("cntrId","TCNU2370437");
        YanTGBiz y = new YanTGBiz();
        String s = y.getHtmlByCond("YMLU8772365");
        y.parseXMl(s);
     }


}
