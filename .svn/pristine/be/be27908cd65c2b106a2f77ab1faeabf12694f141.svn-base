
package com.baoguan.tools;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;


import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.module.SimpleModule;

public class JsonObjectMapper extends ObjectMapper {

    /** serialVersionUID */
    private static final long serialVersionUID = 1L;


    /**
     * 构造方法（不允许修改）
     * 
     * @author peiwei
     * @date 2016-5-13
     */
    public JsonObjectMapper() {
        /**
         * 序列化时的配置
         */
        // 忽略空map值异常
        this.configure(SerializationFeature.WRITE_NULL_MAP_VALUES, false);
        // 忽略空bean异常
        this.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
        // 忽略未知属性异常
        this.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        // 允许单引号
        this.configure(JsonParser.Feature.ALLOW_SINGLE_QUOTES, true);
        // 允许反斜杠
        this.configure(JsonParser.Feature.ALLOW_UNQUOTED_CONTROL_CHARS, true);
        // 取消时间格式使用long形式
        // configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);

        // 设置为北京时间
        this.setTimeZone(TimeZone.getTimeZone("GMT+08:00"));
        // 序列化时，日期的统一格式
        this.setDateFormat(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"));

        // 空值不序列化
        //this.setSerializationInclusion(Include.NON_NULL);

        /**
         * 重写特定类型，序列化方法
         */
        SimpleModule simpleModule = new SimpleModule();
        /*
         * JSON序列化(Object => JSON)
         */
        /*        simpleModule.addSerializer(Date.class, new StdSerializer<Date>(Date.class)
        {
            public void serialize(Date dateValue, JsonGenerator jsonGenerator, SerializerProvider provider)
            {
                
                Class date = dateValue.getClass();
                Annotation[] annotationArr = date.getAnnotations();
                
                String dateString = DateTime.toString(dateValue);
                try
                {
                    jsonGenerator.writeString(dateString);
                }
                catch (Exception e)
                {
                    logger.warn("JSON序列化(Object => JSON)出错", e);
                }
            }
        });*/

        /*
         * JSON反序列化(JSON => Object)
         */
        simpleModule.addDeserializer(Date.class, new JsonDeserializer<Date>() {

            public Date deserialize(JsonParser jsonParser, DeserializationContext deseriCtx) {
                String dateValueStr = "";
                try {
                    dateValueStr = jsonParser.getValueAsString();
                } catch (Exception e) {
                }
                return DateUtils.toDate(dateValueStr);
            }
        });

        this.registerModule(simpleModule);
    }

    public static void main(String[] args) {
        TimeZone timeZone = TimeZone.getTimeZone("GMT+08:00");

    }

}
