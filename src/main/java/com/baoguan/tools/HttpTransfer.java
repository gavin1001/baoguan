package com.baoguan.tools;

import org.apache.http.*;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.conn.ConnectTimeoutException;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.CharArrayBuffer;
import org.apache.http.util.EntityUtils;

import java.io.*;
import java.net.SocketTimeoutException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;
import java.util.Map.Entry;

//import org.jsoup.nodes.Node;

/**
 * @Author zhangyang
 * @Description //通过登录的session换取获取数据的session
 * @Date 11:39 2019/3/26
 * @param
 * @return
 **/
public abstract class HttpTransfer {

    private static final int TIMEOUTCONNECTION = 30000;//http连接请求时间
    private static final int TIMEOUTSOCKET = 300000;//
    private static HttpClient httpClient = null;

    public static String getCookieByPost(String url, Map<String, String> headerMap, Map params) throws URISyntaxException, ClientProtocolException, IOException {
        HttpClient client = HttpClients.createDefault();
        // 实例化HTTP方法    
        HttpPost request = new HttpPost();
        request.setURI(new URI(url));

        for (Entry<String, String> set : headerMap.entrySet()) {
            request.setHeader(set.getKey(), set.getValue());
        }

        //设置参数  
        List<NameValuePair> nvps = new ArrayList<NameValuePair>();
        for (Iterator iter = params.keySet().iterator(); iter.hasNext(); ) {
            String name = (String) iter.next();
            String value = String.valueOf(params.get(name));
            nvps.add(new BasicNameValuePair(name, value));

            //System.out.println(name +"-"+value);  
        }
        request.setEntity(new UrlEncodedFormEntity(nvps, "UTF-8"));

        HttpResponse response = client.execute(request);
        org.apache.http.Header[] headers = response.getHeaders("Set-Cookie");
        String cookie = "";
        for (org.apache.http.Header hea : headers) {
            cookie += hea.getValue();
        }

        return cookie;
    }


    public static String doPost(String url, Map<String, String> headerMap, Map params) {
        return doPost(url,headerMap,params,"UTF-8");
    }

    /**
     * post请求(用于key-value格式的参数)
     *
     * @param url
     * @param params
     * @return
     */
    public static String doPost(String url, Map<String, String> headerMap, Map params,String encoding) {

        BufferedReader in = null;
        try {
            // 定义HttpClient    
            HttpClient client = HttpClients.createDefault();
            // 实例化HTTP方法    
            HttpPost request = new HttpPost();
            request.setURI(new URI(url));

            for (Entry<String, String> set : headerMap.entrySet()) {
                request.setHeader(set.getKey(), set.getValue());
            }


            //设置参数  
            List<NameValuePair> nvps = new ArrayList<NameValuePair>();
            for (Iterator iter = params.keySet().iterator(); iter.hasNext(); ) {
                String name = (String) iter.next();
                String value = String.valueOf(params.get(name));
                nvps.add(new BasicNameValuePair(name, value));

                //System.out.println(name +"-"+value);  
            }
            request.setEntity(new UrlEncodedFormEntity(nvps, "UTF-8"));

            HttpResponse response = client.execute(request);

            int code = response.getStatusLine().getStatusCode();
           if(code==302){
               String turl = response.getLastHeader("Location").getValue();
               String da = httpGet(turl,"",headerMap,encoding);
               return da;
           }

            if (code == 200 || code == 304 ) {    //请求成功
                in = new BufferedReader(new InputStreamReader(response.getEntity()
                        .getContent(), encoding));
                StringBuffer sb = new StringBuffer("");
                String line = "";
                String NL = System.getProperty("line.separator");
                while ((line = in.readLine()) != null) {
                    sb.append(line + NL);
                }
                in.close();
                return sb.toString();
            } else {   //
                System.out.println("状态码：" + code);
                return null;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * post请求(用于key-value格式的参数)
     *
     * @param url
     * @return
     */
    public static String doMuitPost(String url, Map<String, String> headerMap, String text) {

        BufferedReader in = null;
        try {
            // 定义HttpClient
            HttpClient client = HttpClients.createDefault();
            // 实例化HTTP方法
            HttpPost request = new HttpPost(url);


            for (Entry<String, String> set : headerMap.entrySet()) {
                request.setHeader(set.getKey(), set.getValue());
            }

            request.setHeader("Content-type", "application/x-www-form-urlencoded");
            StringEntity entity1 = new StringEntity(text, HTTP.UTF_8);

            entity1.setContentType("application/x-www-form-urlencoded");
            request.setEntity(entity1);

//            request.setHeader("Content-Type", ContentType.MULTIPART_FORM_DATA.toString());
            HttpResponse response = client.execute(request);
            int code = response.getStatusLine().getStatusCode();
            if (code == 200) {    //请求成功

//                org.apache.http.Header[] headers = response.getHeaders("Set-Cookie");
//                String cookie = "";
//                for (org.apache.http.Header hea : headers) {
//                    cookie += hea.getValue();
//                }
//                cookie = cookie.replaceAll("Path=/", " ");
//                setCookie(cookie);

//    			System.out.println(code);
                in = new BufferedReader(new InputStreamReader(response.getEntity()
                        .getContent(), "GBK"));
                StringBuffer sb = new StringBuffer("");
                String line = "";
                String NL = System.getProperty("line.separator");
                while ((line = in.readLine()) != null) {
                    sb.append(line + NL);
                }

                in.close();
                return sb.toString();
            } else {   //
                return String.valueOf("state-" + code);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }


    private static void setCookie(String cookie) {

    }

    public static String httpGet(String url, String params, Map<String, String> headerMap,String encode) {
        return httpGet(url, params, headerMap, "", 0,encode);
    }

    public static String httpGet(String url, String params, Map<String, String> headerMap) {
        return httpGet(url, params, headerMap, "", 0,"UTF-8");
    }

    /**
     * <p>Discription: [get方式获得请求]</p>
     *
     * @param url
     * @param params
     * @return0
     * @author : zhang.yang_neu@neusoft.com
     * @update :
     */
    public static String httpGet(String url, String params, Map<String, String> headerMap, String taskNo, int iTry,String encode) {
        RequestConfig requestConfig = RequestConfig.custom().setSocketTimeout(TIMEOUTCONNECTION).setConnectTimeout(TIMEOUTCONNECTION).build();
        String response = null; // 返回信息
        HttpResponse httpResponse;
        InputStream is = null;
        Reader read = null;
        try {
            if (null != params && !params.equals("")) {
                url += "?" + params;
            }
            HttpGet httpGet = new HttpGet(url);
            if (headerMap != null) {
                for (Entry<String, String> entry : headerMap.entrySet()) {
//                    System.out.println(entry.getKey()+"----"+entry.getValue());
                    httpGet.addHeader(entry.getKey(), entry.getValue());
                }
            }
            httpClient = HttpClients.createDefault();
            httpGet.setConfig(requestConfig);


            httpResponse = httpClient.execute(httpGet);//此处下载失败、2018、1、4 wyy


            Header[] header = httpResponse.getAllHeaders();
            for(Header h:header){
//                System.out.println(h.getName()+"----"+h.getValue());
            }

            int statusCode = httpResponse.getStatusLine().getStatusCode();
            if (statusCode == HttpStatus.SC_OK) {
                // 获得返回结果
                HttpEntity he = httpResponse.getEntity();

                is = he.getContent();
                read = new InputStreamReader(is, encode);
                CharArrayBuffer buffer = new CharArrayBuffer(4096);
                int step = 0;
                char tmp[] = new char[1024];
                while ((step = read.read(tmp)) != -1) {
                    buffer.append(tmp, 0, step);
                }
                response = buffer.toString();
            } else {
                response = "state-" + statusCode;
            }

        } catch (ClientProtocolException e) {
//			System.out.println("不符合http协议");
//			log.error(url+" ;不符合http协议"+e.getMessage());
//			e.printStackTrace();
        } catch (ConnectTimeoutException e) {//新加入请求超时异常

//			log.error("请求超时异常");
//			e.printStackTrace();
            //sql语句
        } catch (SocketTimeoutException e) {//加入响应超时异常

//			log.error("响应超时异常");
//			e.printStackTrace();
            //sql语句
        } catch (IOException e) {
            e.printStackTrace();

        } finally {
            try {
                if (is != null) is.close();
                if (read != null) read.close();
            } catch (IOException e) {
//				log.error("关闭文件错误");
//				e.printStackTrace();
            }
        }
//		System.out.println(response);
        return response;
    }


    public Map<String, String> getResponseHeaderByGet(String url, String params, Map<String, String> headerMap) {

        return null;
    }


    public static String getCookieByGet(String url, String params, Map<String, String> headerMap) throws ClientProtocolException, IOException {
        RequestConfig requestConfig = RequestConfig.custom().setSocketTimeout(TIMEOUTCONNECTION).setConnectTimeout(TIMEOUTCONNECTION).build();
//		RequestConfig requestConfig = RequestConfig.custom().build();
        String response = null; // 返回信息
        HttpResponse httpResponse;
        InputStream is = null;
        Reader read = null;
        if (null != params && !params.equals("")) {
            url += "?" + params;
        }
//		if(null==httpClient){
//			httpClient = HttpClients.createDefault();
//		}
        HttpGet httpGet = new HttpGet(url);
        if (headerMap != null) {
            for (Entry<String, String> entry : headerMap.entrySet()) {
                httpGet.addHeader(entry.getKey(), entry.getValue());
            }
        }
        httpClient = HttpClients.createDefault();
        httpGet.setConfig(requestConfig);
        httpResponse = httpClient.execute(httpGet);
        org.apache.http.Header[] headers = httpResponse.getHeaders("Set-Cookie");
        String cookie = "";
        for (org.apache.http.Header hea : headers) {
            cookie += hea.getValue();
        }
//        System.out.println(cookie);
        return cookie;
    }


    /**
     * <p>Discription: [登陆的方法，在程序段了后;通过parseDownUnSuccFile方法为任务断点传输时，https需要先登陆才可以下载]</p>
     *
     * @author : zhang.yang_neu@neusoft.com
     * @update :
     */
    public abstract String login(String url, String username, String password, String taskNo);

}
