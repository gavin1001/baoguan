
package com.baoguan.tools;

import java.util.List;
import java.util.Map;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;

public class JsonUtils extends ObjectMapper {

    /** serialVersionUID */
    private static final long serialVersionUID = 1L;


    private final static JsonObjectMapper objectMapper = new JsonObjectMapper();

    /**
     * 构造方法（不允许修改）
     * 
     * @author peiwei
     * @date 2016-5-13
     */
    private JsonUtils() {
    }

    /**
     * @author peiwei
     * @date 2016-5-13
     * @param <T>
     * @param str
     * @param clazz
     * @return
     */
    public static <T> T jsonToObject(String str, Class<T> clazz) {
        try {
            return objectMapper.readValue(str, clazz);
        } catch (Exception e) {
        }
        return null;
    }

    /**
     * 
     *<p>
      * method:  parseMap<BR>
      * description:  TODO<BR>
      * author:  peiwei<BR>
      * date:  2018年1月3日 下午4:05:13<BR>
      * 
      * @param str
      * @return
     */
    public static Map jsonToMap(String str) {
        try {
            return objectMapper.readValue(str, Map.class);
        } catch (Exception e) {
        }
        return null;
    }

    /**
     * @author peiwei
     * @date 2016-5-13
     * @param <T>
     * @param str
     * @param clazz
     * @return
     */
    public static <T> List<T> jsonToArray(String str, Class<T> clazz) {
        JavaType javaType = objectMapper.getTypeFactory().constructParametricType(List.class, clazz);
        try {
            return objectMapper.readValue(str, javaType);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * @author peiwei
     * @date 2016-5-24
     * @param obj
     * @return
     */
    public static String OjectToJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (JsonProcessingException e) {
        }
        return "";
    }

    /**
     * @author peiwei
     * @date 2016-5-24
     * @param args
     */
    public static void main(String[] args) {

    }

}
