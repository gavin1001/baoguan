package com.baoguan.tools;
 
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
 
/**
 * 
 * ClassName: WordEncode <br/>  
 * Function: JAVA中url特殊字符的处理. <br/>  
 * Reason: TODO ADD REASON(可选). <br/>  
 * date: 2019年3月5日 下午4:18:53 <br/>  
 *  
 * @author zhangyang  
 * @version   
 * @since JDK 1.8
 */
public class WordEncode {
	
	public static String encode(String code,String enc) {
		try {
			return URLEncoder.encode(code, enc);
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	public static String encode(String code) {
		return encode(code,"UTF-8");
	}
	
	public static String decode(String code,String enc) {
		try {
			return URLDecoder.decode(code, enc);
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	public static String decode(String code) {
		return decode(code,"UTF-8");
	}
}
