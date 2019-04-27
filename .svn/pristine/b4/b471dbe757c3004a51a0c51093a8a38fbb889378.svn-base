package com.baoguan.tools;

import java.io.*;
import java.util.HashMap;
import java.util.Map;

public class Util {

	
//	private static String coki="JSESSIONID=A9F16F3023D5A37475F139E2B80986A9;  AIPortal_Oper_LastAccessedTime=MTUyOTI0MzUzMDU2MQ==; Domain=ln.cmcc;  AIPortal_Oper_ActiveUrl=aHR0cDovL3Nzby40YS5sbi5jbWNj; Domain=ln.cmcc;  AIPortal_HostIp=MTAuNjcuMTIuMjQ=; Domain=ln.cmcc;  AIPortal_Port=ODA4Mg==; Domain=ln.cmcc;  AIPortal_SessionId=f9267b27a2f42e439080a1924033a5e6b8c2d1e45be3be78e61f767787d2319a636f501b16399f8fe030d92a43f931d2132f3c5f31d3f59c0347838c5327691bd7a8908ca4d01b06e5b18d502904ea79077f293e956a6ff887c5f53df1d1506c2048c6a7725fbddf2397622e9e8c98d42e46eb335b4e8e07465584d42ab75f84e68d7adffdafaca25eebaa23718507c7f9dcf64d31de0de54d2e37288b2c0304020af1201776cc59a3e899c6e29353590699c4360161aaf5798dc4649ff433674be58e7a6618a1a02a4ac246a5e255b2ac04526d5edd71e5; Domain=ln.cmcc;  AIPortal_Oper_OpId=\"\"; Domain=ln.cmcc;  AIPortal_Oper_LogName=MTAwMDQ0ODEwNA==; Domain=ln.cmcc;  AIPortal_Oper_HostIp=MTcyLjIzLjEuMTk0; Domain=ln.cmcc;  AIPortal_Cybercaname=6IOh5b2sMTAwMDQ0ODEwNA==; Domain=ln.cmcc;  AIPortal_Master=VDEwMDM1MDAwMw==; Domain=ln.cmcc;  AIPortal_Ready=\"\"; Domain=ln.cmcc;  Result=dHJ1ZQ==; Domain=ln.cmcc;  sso=sso_24_8082;  ";



	public static Map<String,String> getHeaderMap(){
		Map<String,String> headerMap = new HashMap<String,String>();
		
		headerMap.put("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8");
		headerMap.put("Accept-Encoding", "gzip, deflate, sdch");
		headerMap.put("Accept-Language", "zh-CN,zh;q=0.8");
		headerMap.put("Cache-Control", "max-age=0");
		headerMap.put("Connection", "keep-alive");
		
		headerMap.put("Cookie", "");

		headerMap.put("Host", "yyta.crm.ln.cmcc");
		headerMap.put("Upgrade-Insecure-Requests", "1");
		headerMap.put("User-Agent", "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36");
   
		
		return headerMap;
	}
	
	
	public static Map<String,String> getPostHeaderMap(){
		Map<String,String> headerMap = new HashMap<String,String>();
		
		headerMap.put("Accept", "*/*");
		headerMap.put("Accept-Encoding", "gzip, deflate");
		headerMap.put("Accept-Language", "zh-Hans-CN,zh-Hans;q=0.5");
		headerMap.put("Cache-Control", "no-cache");
		headerMap.put("Connection", "keep-alive");
		headerMap.put("Content-Type", "multipart/form-data");
		
		
		headerMap.put("Cookie", "");
		
		
		headerMap.put("Host", "yyta.crm.ln.cmcc");
		headerMap.put("User-Agent", "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0)");
   
		
		return headerMap;
	}
	
	public static String getTextForFile(String dir) throws IOException{
		InputStreamReader isr = new InputStreamReader(new FileInputStream(new File(dir)), "GBK");
		BufferedReader br = new BufferedReader(isr);
		String reData = null;
		String s = "";
		while((s = br.readLine())!=null){
			reData +=s;
		}
		isr.close();
		br.close();
		
		return reData;
	}
	
	
	
}
