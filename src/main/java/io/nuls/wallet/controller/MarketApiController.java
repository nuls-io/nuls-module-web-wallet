package io.nuls.wallet.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import io.nuls.core.core.annotation.Component;
import io.nuls.core.log.Log;
import io.nuls.core.parse.JSONUtils;
import org.apache.http.HttpEntity;
import org.apache.http.HttpStatus;
import org.apache.http.StatusLine;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.Map;

/**
 * @Author: zhoulijun
 * @Time: 2019-10-17 16:00
 * @Description: 功能描述
 */
@Path("/market-api/")
@Component
public class MarketApiController {

    static final String URL = "https://public.nerve.network";
//    @Path("/nuls-price")
//    @GET
//    @Consumes(MediaType.APPLICATION_JSON)
//    public String api(@Context HttpServletRequest request,
//                      @Context HttpServletResponse response) throws IOException {
//        Response res = client.target("https://api.binance.com").path("/api/v3/ticker/price").queryParam("symbol","NULSUSDT").request(MediaType.APPLICATION_JSON_TYPE).get();
//        Map<String,Object> data = res.readEntity(Map.class);
//        return JSONUtils.obj2json(data);
//    }

    @Path("/nuls-price")
    @GET
    @Consumes(MediaType.APPLICATION_JSON)
    public String api(@Context HttpServletRequest request,
                      @Context HttpServletResponse response) throws IOException {

        String res = doPost(URL,Map.of(
                "jsonrpc","2.0",
                "method", "getSymbolInfo", "params", new Integer[]{1,1}, "id", 715
        ));
        Log.info("{}",res);
        Map<String,Object> data = JSONUtils.json2map(res);
        data = (Map<String, Object>) data.get("result");
        Log.info("{}",data.get("usdPrice"));
        return JSONUtils.obj2json(Map.of(
                "symbol" , "NULSUSDT",
                "price" ,  data.get("usdPrice")
        ));
    }

    public static String doPost(String url, Map params) throws JsonProcessingException, UnsupportedEncodingException {

        CloseableHttpClient httpclient = HttpClients.createDefault();
        HttpPost httpPost = new HttpPost(url);// 创建httpPost
        httpPost.setHeader("Accept", "application/json");
        httpPost.setHeader("Content-Type", "application/json");
        String charSet = "UTF-8";
        StringEntity entity = new StringEntity(JSONUtils.obj2json(params), charSet);
        httpPost.setEntity(entity);
        CloseableHttpResponse response = null;

        try {

            response = httpclient.execute(httpPost);
            StatusLine status = response.getStatusLine();
            int state = status.getStatusCode();
            if (state == HttpStatus.SC_OK) {
                HttpEntity responseEntity = response.getEntity();
                String jsonString = EntityUtils.toString(responseEntity);
                return jsonString;
            }
            else{
                Log.error("请求返回:"+state+"("+url+")");
            }
        } catch (ClientProtocolException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (response != null) {
                try {
                    response.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            try {
                httpclient.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return null;
    }


    public static void main(String[] args) throws IOException, InterruptedException {
        String URL = "https://public.nerve.network";
        String res = doPost(URL,Map.of(
                "jsonrpc","2.0",
                "method", "getSymbolInfo", "params", new Integer[]{1,1}, "id", 715
        ));
        Log.info("{}",res);
        Map<String,Object> data = JSONUtils.json2map(res);
        data = (Map<String, Object>) data.get("result");
        Log.info("{}",data.get("usdPrice"));
//        var values = new HashMap<String, String>() {{
//            put("name", "John Doe");
//            put ("occupation", "gardener");
//        }};
//
//        "jsonrpc": "2.0", "method": "getSymbolInfo", "params": [1,1], "id": 715
//
//        var objectMapper = new ObjectMapper();
//        String requestBody = objectMapper
//                .writeValueAsString(values);
//
//        HttpClient client = HttpClient.newHttpClient();
//        HttpRequest request = HttpRequest.newBuilder()
//                .uri(URI.create(URL))
//                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
//                .build();
//
//        HttpResponse<String> response = client.send(request,
//                HttpResponse.BodyHandlers.ofString());
//
//        System.out.println(response.body());
    }

}
