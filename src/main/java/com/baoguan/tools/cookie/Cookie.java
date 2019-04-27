package com.baoguan.tools.cookie;

import java.util.HashMap;
import java.util.Map;

public abstract class Cookie {

    public abstract String getCookie();
    public Map<String,String> getHeaderMap(){
        Map<String,String> headerMap = new HashMap<String,String>();
        headerMap.put("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8");
        headerMap.put("Accept-Encoding", "gzip, deflate, sdch");
        headerMap.put("Accept-Language", "zh-CN,zh;q=0.8");
        headerMap.put("Cache-Control", "max-age=0");
        headerMap.put("Connection", "keep-alive");
        headerMap.put("Cookie", getCookie());
        headerMap.put("Host", "yyta.crm.ln.cmcc");
        headerMap.put("Upgrade-Insecure-Requests", "1");
        headerMap.put("User-Agent", "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36");
        return headerMap;
    }

}
