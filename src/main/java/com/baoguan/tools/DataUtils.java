
package com.baoguan.tools;

import java.io.IOException;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.math.BigDecimal;
import java.sql.Clob;
import java.sql.SQLException;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang3.reflect.FieldUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


/**
 * 提供各种对数据进行处理的方法
 * 
 * @author peiwei
 * @date 2016年1月26日
 */
@SuppressWarnings("unchecked")
public final class DataUtils {

    private static final Log logger = LogFactory.getLog(DataUtils.class);

    private static final Object[] ZERO_OBJECT_ARRAY = new Object[0];

    private static final DecimalFormat NUMBER_FORMAT = new DecimalFormat("###0");

    private static final DecimalFormat DOUBLE_FORMAT = new DecimalFormat("###0.00");

    private static final String[] TRUE_ARRAY = new String[]{"y", "yes", "true", "t", "是", "1"};

    private static final String[] FALSE_ARRAY = new String[]{"n", "no", "false", "f", "否", "0"};

    /** copySimpleObject 时支持的数据类型 */
    private static Map<Object, String> supportTypeMap = new HashMap<Object, String>();

    static {
        supportTypeMap.put(int.class, "");
        supportTypeMap.put(long.class, "");
        supportTypeMap.put(double.class, "");
        supportTypeMap.put(boolean.class, "");
        supportTypeMap.put(Integer.class, "");
        supportTypeMap.put(Long.class, "");
        supportTypeMap.put(Double.class, "");
        supportTypeMap.put(BigDecimal.class, "");
        supportTypeMap.put(String.class, "");
        supportTypeMap.put(Date.class, "");
        supportTypeMap.put(Boolean.class, "");
        supportTypeMap.put(byte[].class, "");
    }

    /**
     * 添加mergePO时支持的类型
     * 
     * @param clazz
     */
    public static void addSupportType(Object clazz) {
        supportTypeMap.put(clazz, "");
    }

    /**
     * 比较两个存放了数字的字符串的大小，如果不为数字将抛出异常. <br>
     * <br>
     * <b>示例 </b> <code>
     * <br>DataUtils.compareByValue(&quot;19&quot;,&quot;2&quot;) 返回 1
     * <br>DataUtils.compareByValue(&quot;0021&quot;,&quot;21&quot;) 返回 0
     * <br>DataUtils.compareByValue(&quot;3001&quot;,&quot;5493&quot;) 返回 -1
     * </code>
     * 
     * @param str1
     *            第一个字符串
     * @param str2
     *            第二个字符串
     * @return 返回比较的结果 str1>str2返回1，str1 <str2返回-1，str1=str2返回0
     */
    public static int compareByValue(final String str1, final String str2) {
        return new BigDecimal(str1).compareTo(new BigDecimal(str2));
    }

    /**
     * 
     * getAnnocationByAnnoName:(). <br/> 
     * TODO(获取指定的annocation – 可选).<br/> 
     * @author zhangyang
     * @param field
     * @return
     * @since JDK
     */
    public static String getAnnocationByAnnoName(Field field) {
//        if (field == null) {
//            return null;
//        }
//        if (field.isAnnotationPresent(AliasColum.class)) {
//            return field.getAnnotation(AliasColum.class).mappingName();
//        }
        return null;
    }

    public static void main(String[] args) {
        //    	Test1 t1 = new Test1();
        //    	Test test =  new Test();
        //    	t1.setPid("123");
        //    	copySimpleObject(t1, test);
        //    	System.out.println(test.getId());
    }

    /**
     * 拷贝简单对象，如果源对象的属性为null默认不拷贝.
     * 
     * @param target
     *            传入的目标对象
     * @param source
     *            传入的源对象
     */
    public static void copySimpleObject(Object source, Object target) {
        copySimpleObjectToTargetFromSource(source, target, false);
    }

    /**
     * 拷贝简单对象.
     * 
     * @param target
     *            传入的目标对象
     * @param source
     *            传入的源对象
     * @param isCopyNull
     *            是否拷贝Null值
     */
    public static void copySimpleObject(final Object source, Object target, boolean isCopyNull) {
        copySimpleObjectToTargetFromSource(source, target, isCopyNull);
    }

    /**
     * 拷贝简单对象.
     * 
     * @param target
     *            传入的目标对象
     * @param source
     *            传入的源对象
     * @param isCopyNull
     *            是否拷贝Null值
     */
    private static void copySimpleObjectToTargetFromSource(final Object source, Object target, boolean isCopyNull) {
        if (target == null || source == null) {
            return;
        }
        List<Method> targetMethodList = BeanUtils.getSetter(target.getClass());
        List<Method> sourceMethodList = BeanUtils.getGetter(source.getClass());
        Map<String, Method> map = new HashMap<String, Method>();
        for (Iterator<Method> iter = sourceMethodList.iterator(); iter.hasNext();) {
            Method method = (Method) iter.next();
            map.put(method.getName(), method);
        }
        Object value = null;
        Object[] objArray = new Object[1];
        String methodName = null;
        for (Iterator<Method> iter = targetMethodList.iterator(); iter.hasNext();) {
            Method method = (Method) iter.next();
            String fieldName = method.getName().substring(3);
            //update by zhangyang 添加对annotation支持 start at 20180428
            Field field = null;
            Field[] fields = null;
            try {

                fields = target.getClass().getDeclaredFields();

                for (Field fiel : fields) {
                    if (fiel.getName().toLowerCase().equals(fieldName.toLowerCase())) {
                        field = fiel;
                        if (field != null)
                            field.setAccessible(true);
                    }
                }

            } catch (SecurityException e1) {
                logger.error("the error is get field: " + e1.getMessage());
                e1.printStackTrace();
            }
            try {
                if (field != null && field.getAnnotations().length > 0) {
                    String arg = getAnnocationByAnnoName(field);
                    if (arg != null && arg.length() > 0) {
                        fieldName = arg;
                        char[] c = fieldName.toCharArray();
                        if (c[0] >= 'a' && c[0] <= 'z')
                            c[0] = (char) (c[0] - 32);
                        fieldName = new String(c);
                        methodName = "get" + fieldName;
                        if (map.get(methodName) == null) {
                        }
                    }

                }
                //update by zhangyang 添加对annotation支持 end at 20180428
                methodName = "get" + fieldName;
                Method sourceMethod = null;
                if (map.containsKey(methodName)) {
                    sourceMethod = (Method) map.get(methodName);
                } else {
                    methodName = "is" + fieldName;
                    if (map.containsKey(methodName)) {
                        sourceMethod = (Method) map.get(methodName);
                    }
                }
                if (sourceMethod == null) {
                    continue;
                }
                if (!supportTypeMap.containsKey(sourceMethod.getReturnType())) {
                    continue;
                }
                value = sourceMethod.invoke(source, ZERO_OBJECT_ARRAY);
                objArray[0] = value;
                if (isCopyNull) {
                    method.invoke(target, objArray);
                } else {
                    if (value != null) {
                        method.invoke(target, objArray);
                    }
                }
            } catch (Exception e) {
                if (logger.isDebugEnabled()) {
                    logger.debug(e);
                    //                    throw new RuntimeException(e);
                    e.printStackTrace();
                }
            }
        }
    }

    /**
     * 提供精确的小数位四舍五入处理. <br>
     * <br>
     * <b>示例 </b> <code>
     * <br>DataUtils.round(0.574,2) 返回 0.57
     * <br>DataUtils.round(0.575,2) 返回 0.58
     * <br>DataUtils.round(0.576,2) 返回 0.58
     * </code>
     * 
     * @param value
     *            需要四舍五入的数字
     * @param scale
     *            小数点后保留几位
     * @return 四舍五入后的结果
     */
    public static double round(final double value, final int scale) {
        BigDecimal obj = new BigDecimal(Double.toString(value));
        return obj.divide(BigDecimal.ONE, scale, BigDecimal.ROUND_HALF_UP).doubleValue();
    }

    /**
     * @param sourceMap
     * @param targetClazz
     * @return
     * @throws IllegalAccessException
     * @throws InstantiationException
     * @throws InvocationTargetException
     * @throws IllegalArgumentException
     * @throws SQLException
     * @throws IOException
     */
    public static <T> T mapToBean(Map<String, ?> sourceMap, Class<T> targetClazz) throws SQLException, IllegalAccessException, InstantiationException {
        Object clazzNewObject = targetClazz.newInstance();

        mapToBean(sourceMap, clazzNewObject);

        return (T) clazzNewObject;
    }

    /**
     * @author peiwei
     * @date 2016-5-18
     * @param sourceMap
     * @param targetObj
     * @return
     * @throws InstantiationException
     * @throws IllegalAccessException
     * @throws IllegalArgumentException
     * @throws InvocationTargetException
     * @throws SQLException
     */
    public static void mapToBean(Map<String, ?> sourceMap, Object targetObj) throws  IllegalAccessException, SQLException {
        Class<?> clazz = targetObj.getClass();

        Set<String> mapKeySet = sourceMap.keySet();
        //Field[] clazzFieldArr = clazz.getDeclaredFields();
        
        //update by jinyy @2019.1.31 start get all field contains superClass
        Field[] clazzFieldArr = FieldUtils.getAllFields(clazz);
        //end by jinyy
        
        for (String mapKey : mapKeySet) {
            for (Field clazzField : clazzFieldArr) {

                String clazzFieldStr = getMappingColumnName(clazzField);
                String clazzFieldStrUpper = clazzFieldStr.toUpperCase();// 类属性名称大写

                String mapKeyStrUpper = mapKey.toUpperCase();// mapKey名称大写

                if (clazzFieldStrUpper.equals(mapKeyStrUpper)) {
                    Object mapValue = sourceMap.get(mapKey);// map对象key所对应的值

                    if (mapValue != null) {
                        Class<?> clazzFieldType = clazzField.getType();// pojo对象属性类型

                        if (clazzFieldType == Integer.class || clazzFieldType == int.class) {
                            mapValue = Integer.valueOf(mapValue.toString());
                        } else if (clazzFieldType == Long.class || clazzFieldType == long.class) {
                            mapValue = Long.valueOf(mapValue.toString());
                        } else if (clazzFieldType == Float.class || clazzFieldType == float.class) {
                            mapValue = Float.valueOf(mapValue.toString());
                        } else if (clazzFieldType == Double.class || clazzFieldType == double.class) {
                            mapValue = Double.valueOf(mapValue.toString());
                        } else if (clazzFieldType == Date.class) {
                            String dateStr = mapValue.toString();

                            DateUtils dateTime = null;
                            if (dateStr.length() <= 10) {
                                dateTime = new DateUtils(dateStr, DateUtils.YEAR_TO_DAY);
                            } else {
                                dateTime = new DateUtils(dateStr, DateUtils.YEAR_TO_SECOND);
                            }

                            mapValue = dateTime.toDate();
                        } else if (clazzFieldType == String.class && mapValue instanceof Clob) {
                            Clob clob = (Clob) mapValue;
                            mapValue = clob.getSubString(1L, (int) clob.length());
                        }
                    }
                    // 将mapValue赋值给pojo对象的属性值上
                    clazzField.setAccessible(true);
                    clazzField.set(targetObj, mapValue);
                }

            }
        }
    }

    /**
     * 把通过JdbcTemplate查出的结果集封装到List中<br>
     * 只要字段名和DTO的属性名能对应上的就把值封装进去，对应不上的就不管了
     * 
     * @param jdbcResultList
     *            用JdbcTemplate查出的结果集
     * @param clazz
     *            DTO的Class对象
     * @return 把每行数据封装到一个DTO对象中，最后返回DTO的List
     */
    public static List generateListFromJdbcResult(List jdbcResultList, final Class clazz) {
        List objectList = new ArrayList();
        Object[] clazzParamObjArray = new Object[1];
        try {
            List<Method> methodList = BeanUtils.getSetter(clazz);
            for (int i = 0; i < jdbcResultList.size(); i++) {
                Map rowMap = (Map) jdbcResultList.get(i);
                Object[] rowKeys = rowMap.keySet().toArray();
                Object clazzNewObject = clazz.newInstance();
                for (int j = 0; j < rowKeys.length; j++) {
                    String column = (String) rowKeys[j];
                    for (int k = 0; k < methodList.size(); k++) {
                        Method method = (Method) methodList.get(k);
                        String upperMethodName = method.getName().toUpperCase();
                        if (upperMethodName.equals("SET" + column.toUpperCase())) {
                            Class type = method.getParameterTypes()[0];
                            Object value = rowMap.get(column);
                            if (value != null) {
                                if (type == Integer.class) {
                                    value = Integer.valueOf(value.toString());
                                } else if (type == Double.class) {
                                    value = Double.valueOf(value.toString());
                                } else if (type == Long.class) {
                                    value = Long.valueOf(value.toString());
                                }
                            }
                            clazzParamObjArray[0] = value;
                            method.invoke(clazzNewObject, clazzParamObjArray);
                            break;
                        }
                    }
                }
                objectList.add(clazzNewObject);
            }
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
        return objectList;
    }

    /**
     * zhangguoxiao 将父对象转换成子对象
     * 
     * @date 2016-4-20
     * @param father
     * @param child
     * @throws Exception
     */
    public static void father2Child(Object father, Object child) throws Exception {
        if (child.getClass().getSuperclass() != father.getClass()) {
            throw new Exception("child不是father的子类");
        }
        Class<?> fatherClass = father.getClass();
        Field[] fatherFields = fatherClass.getDeclaredFields();

        for (Field field : fatherFields) {
            try {
                Class<?> type = field.getType();

                String methodName = "";
                if ("boolean".equals(type.getName())) {
                    methodName = "is" + StringUtils.capitalize(field.getName());
                } else {
                    methodName = "get" + StringUtils.capitalize(field.getName());
                }
                Method method = fatherClass.getMethod(methodName);
                Object obj = method.invoke(father);

                field.setAccessible(true);
                field.set(child, obj);
            } catch (Exception e) {
                logger.warn("转换过程中出错", e);
            }
        }
    }

    /**
     * 对表达布尔型含义的字符串转换为boolean型的true/false. <br>
     * <br>
     * <b>示例 </b> <code>
     * <br>DataUtils.getBoolean(&quot;y&quot;) 返回 true
     * <br>DataUtils.getBoolean(&quot;yes&quot;) 返回 true
     * <br>DataUtils.getBoolean(&quot;Y&quot;) 返回 true
     * <br>DataUtils.getBoolean(&quot;true&quot;) 返回 true
     * <br>DataUtils.getBoolean(&quot;t&quot;) 返回 true
     * <br>
     * <br>DataUtils.getBoolean(&quot;n&quot;) 返回 false
     * <br>DataUtils.getBoolean(&quot;No&quot;) 返回 false
     * <br>DataUtils.getBoolean(&quot;N&quot;) 返回 false
     * <br>DataUtils.getBoolean(&quot;false&quot;) 返回 false
     * <br>DataUtils.getBoolean(&quot;f&quot;) 返回 false
     * </code>
     * 
     * @param str
     *            表达布尔型含义的字符串. <br>
     *            合法的输入包括"y","n","yes","no","true","false","t","f","是","否","1",
     *            "0" ,""这些字符串的各种大小写形式也属于合法的 <br>
     *            除了上述合法的入参值之外，输入其它的字符串，将抛出异常
     * @return boolean型的true/false
     */
    public static boolean getBoolean(final String str) {
        if (str == null) {
            throw new IllegalArgumentException("argument is null");
        }
        for (int i = 0; i < TRUE_ARRAY.length; i++) {
            if (str.equalsIgnoreCase(TRUE_ARRAY[i])) {
                return true;
            }
        }
        for (int i = 0; i < FALSE_ARRAY.length; i++) {
            if (str.equalsIgnoreCase(FALSE_ARRAY[i])) {
                return false;
            }
        }
        if (str.trim().equals("")) {
            return false;
        } else {
            throw new IllegalArgumentException(
                    "argument not in ('y','n','yes','no','true','false','t','f','是','否','1','0','')");
        }
    }

    /**
     * 返回对应boolean型变量的字符串型中文描述：'是'/'否'. <br>
     * <br>
     * <b>示例 </b> <code>
     * <br>DataUtils.getBooleanDescribe(true) 返回 '是'
     * <br>DataUtils.getBooleanDescribe(false) 返回 '否'
     * </code>
     * 
     * @param value
     *            布尔型变量. <br>
     * @return 字符串型中文描述：'是'/'否'
     */
    public static String getBooleanDescribe(final boolean value) {
        if (value) {
            return getBooleanDescribe("true");
        }
        return getBooleanDescribe("false");
    }

    /**
     * 对表达布尔型含义的字符串转换为中文的"是"/"否". <br>
     * <br>
     * <b>示例 </b> <code>
     * <br>DataUtils.getBooleanDescribe(&quot;y&quot;) 返回 &quot;是&quot;
     * <br>DataUtils.getBooleanDescribe(&quot;yes&quot;) 返回 &quot;是&quot;
     * <br>DataUtils.getBooleanDescribe(&quot;Y&quot;) 返回 &quot;是&quot;
     * <br>DataUtils.getBooleanDescribe(&quot;true&quot;) 返回 &quot;是&quot;
     * <br>DataUtils.getBooleanDescribe(&quot;t&quot;) 返回 &quot;是&quot;
     * <br>
     * <br>DataUtils.getBooleanDescribe(&quot;n&quot;) 返回 &quot;否&quot;
     * <br>DataUtils.getBooleanDescribe(&quot;No&quot;) 返回 &quot;否&quot;
     * <br>DataUtils.getBooleanDescribe(&quot;N&quot;) 返回 &quot;否&quot;
     * <br>DataUtils.getBooleanDescribe(&quot;false&quot;) 返回 &quot;否&quot;
     * <br>DataUtils.getBooleanDescribe(&quot;f&quot;) 返回 &quot;否&quot;
     * </code>
     * 
     * @param str
     *            表达布尔型含义的字符串. <br>
     *            合法的输入包括"y","n","yes","no","true","false","t","f","是","否","1",
     *            "0" ,""这些字符串的各种大小写形式也属于合法的 <br>
     *            除了上述合法的入参值之外，输入其它的字符串，将抛出异常
     * @return 布尔变量对应的中文描述："是"/"否"/""
     */
    public static String getBooleanDescribe(final String str) {
        if (str == null) {
            throw new IllegalArgumentException("argument is null");
        }
        String retValue = null;
        if (str.trim().equals("")) {
            retValue = "";
        }
        for (int i = 0; i < TRUE_ARRAY.length; i++) {
            if (str.equalsIgnoreCase(TRUE_ARRAY[i])) {
                retValue = "是";
                break;
            }
        }
        for (int i = 0; i < FALSE_ARRAY.length; i++) {
            if (str.equalsIgnoreCase(FALSE_ARRAY[i])) {
                retValue = "否";
                break;
            }
        }
        if (retValue == null) {
            throw new IllegalArgumentException(
                    "argument not in ('y','n','yes','no','true','false','t','f','是','否','1','0','')");
        }
        return retValue;
    }

    /**
     * 把Object对象转换为Double对象。
     * 
     * @param object
     * @return Double对象或null（如果object是null）。
     */
    public static Double getDouble(Object object) {
        Double _double = null;
        if (object != null) {
            _double = new Double(object.toString());
        }
        return _double;
    }

    /**
     * 把Object对象转换为Integer对象。
     * 
     * @param object
     * @return Integer对象或null（如果object是null）。
     */
    public static Integer getInteger(Object object) {
        Integer value = null;
        if (object != null) {
            value = Integer.valueOf(object.toString());
        }
        return value;
    }

    /**
     * 把Object对象转换为Long对象。
     * 
     * @param object
     * @return Long对象或null（如果object是null）。
     */
    public static Long getLong(Object object) {
        Long value = null;
        if (object != null) {
            value = Long.valueOf(object.toString());
        }
        return value;
    }

    public static String getPlainNumber(Double value) {
        if (value == null) {
            return "";
        }
        return DOUBLE_FORMAT.format(value);
    }

    public static String getPlainNumber(Integer value) {
        if (value == null) {
            return "";
        }
        return NUMBER_FORMAT.format(value);
    }

    public static String getPlainNumber(Long value) {
        if (value == null) {
            return "";
        }
        return NUMBER_FORMAT.format(value);
    }

    /**
     * 把Object对象转换为String对象。
     * 
     * @param object
     * @return String对象或null（如果object是null）。
     */
    public static String getString(Object object) {
        String string = null;
        if (object != null) {
            string = object.toString();
        }
        return string;
    }

    /**
     * 把Object对象连接起来并转换为String对象。
     * 
     * @param arguments
     * @return String对象或空串（如果object是null）。
     */
    public static String join(Object... arguments) {
        if (arguments == null || arguments.length < 1) {
            return "";
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < arguments.length; i++) {
            sb.append(arguments[i]);
        }
        return sb.toString();
    }

    /**
     * 当字符串为"null"或为null时,返回字符串"". <br>
     * <br>
     * <b>示例 </b> <code>
     * <br>DataUtils.dbNullToEmpty(null) 返回 &quot;&quot;
     * <br>DataUtils.dbNullToEmpty(&quot;null&quot;) 返回 &quot;&quot;
     * <br>DataUtils.dbNullToEmpty(&quot;abc&quot;) 返回 &quot;abc&quot;
     * </code>
     * 
     * @param str
     *            输入字符串
     * @return 返回字符串
     */
    public static String dbNullToEmpty(final String str) {
        if (str == null || str.equalsIgnoreCase("null")) {
            return "";
        }
        return str;
    }

    /**
     * 当字符串为""时,返回null. <br>
     * <br>
     * <b>示例 </b> <code>
     * <br>DataUtils.emptyToNull(null) 返回 null
     * <br>DataUtils.emptyToNull(&quot;&quot;) 返回 null
     * <br>DataUtils.emptyToNull(&quot;abc&quot;) 返回 &quot;abc&quot;
     * </code>
     * 
     * @param str
     *            输入字符串
     * @return 返回字符串
     */
    public static String emptyToNull(final String str) {
        if (str == null || str.trim().length() == 0) {
            return null;
        }
        return str;
    }

    /**
     * 当字符串为null时,返回字符串"". <br>
     * <br>
     * <b>示例 </b> <code>
     * <br>DataUtils.nullToEmpty(null) 返回 &quot;&quot;
     * <br>DataUtils.nullToEmpty(&quot;null&quot;) 返回 &quot;null&quot;
     * <br>DataUtils.nullToEmpty(&quot;abc&quot;) 返回 &quot;abc&quot;
     * </code>
     * 
     * @param str
     *            输入字符串
     * @return 返回字符串
     */
    public static String nullToEmpty(final String str) {
        return str == null ? "" : str;
    }

    /**
     * 当字符串为null或""或全部为空格时,返回字符串"0",否则将字符串原封不动的返回. <br>
     * <br>
     * <b>示例 </b> <code>
     * <br>DataUtils.nullToZero(null) 返回 &quot;0&quot;
     * <br>DataUtils.nullToZero(&quot;&quot;) 返回 &quot;0&quot;
     * <br>DataUtils.nullToZero(&quot;123&quot;) 返回 &quot;123&quot;
     * <br>DataUtils.nullToZero(&quot;abc&quot;) 返回 &quot;abc&quot; 注意：从方法的本意出发，请用于数值型字符串
     * </code>
     * 
     * @param str
     *            输入字符串
     * @return 返回字符串
     */
    public static String nullToZero(final String str) {
        if (str == null || str.trim().length() == 0) {
            return "0";
        }
        return str;
    }

    /**
     * 当浮点型数值为0时,返回字符串"",否则将浮点型值转化为字符串返回. <br>
     * <br>
     * <b>示例 </b> <code>
     * <br>DataUtils.zeroToEmpty(0d) 返回 &quot;&quot;
     * <br>DataUtils.zeroToEmpty(1.2d) 返回 &quot;1.2&quot;
     * </code>
     * 
     * @param value
     *            输入的浮点型值
     * @return 返回字符串
     */
    public static String zeroToEmpty(final double value) {
        return value == 0 ? "" : String.valueOf(value);
    }

    /**
     * 当整型数值为0时,返回字符串"",否则将整型值转化为字符串返回. <br>
     * <br>
     * <b>示例 </b> <code>
     * <br>DataUtils.zeroToEmpty(0) 返回 &quot;&quot;
     * <br>DataUtils.zeroToEmpty(1) 返回 &quot;1&quot;
     * </code>
     * 
     * @param value
     *            输入的整型值
     * @return 返回字符串
     */
    public static String zeroToEmpty(final int value) {
        return value == 0 ? "" : String.valueOf(value);
    }

    /**
     * 如果类的属性存在注解，使用注解作为映射（属性名称与字段名称不一致的情况）
     * 
     * @param field
     * @return
     */
    public static String getMappingColumnName(Field field) {
        String mappingColumnName = "";
//        if (field.isAnnotationPresent(AliasColum.class)) {
//            AliasColum coreColumn = field.getAnnotation(AliasColum.class);
//            mappingColumnName = coreColumn.mappingName();
//        } else {
//            mappingColumnName = field.getName();
//        }
//
        return mappingColumnName;
    }

    /**
     * 构造方法，禁止实例化
     */
    private DataUtils() {
    }
}