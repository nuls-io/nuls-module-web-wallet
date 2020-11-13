package io.nuls.wallet.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import io.nuls.core.core.annotation.Component;
import io.nuls.core.log.Log;
import io.nuls.core.parse.JSONUtils;
import io.nuls.core.parse.MapUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Map;

/**
 * @Author: zhoulijun
 * @Time: 2019-10-17 16:00
 * @Description: 功能描述
 */
@Path("/market-api/")
@Component
public class MarketApiController {

    static HttpClient client1 = HttpClient.newBuilder()
            .connectTimeout(Duration.ofMillis(5000))
            .followRedirects(HttpClient.Redirect.NORMAL)
            .build();

    Client client = ClientBuilder.newClient();

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
        String URL = "https://public.nerve.network";
        Map res = post(URL,Map.of(
                "jsonrpc","2.0",
                "method", "getSymbolInfo", "params", new Integer[]{1,1}, "id", 715
        ));
        Map<String,Object> data = (Map<String, Object>) res.get("result");
        return JSONUtils.obj2json(Map.of(
                "symbol" , "NULSUSDT",
                "price" ,  data.get("usdPrice")
        ));
    }


    private static Map post(String url, Map<String, Object> param) {
        try {
            URI uri = URI.create(url);
            String requestBody = JSONUtils.obj2json(param);
            Log.debug("call dex api url :{}, request boy : {}", uri, requestBody);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(uri)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .timeout(Duration.ofMillis(5000))
                    .build();
            HttpResponse<String> response = client1.send(request, HttpResponse.BodyHandlers.ofString());
            String body = response.body();
            Log.debug("result : {} ", body);
            return JSONUtils.json2map(body);
        } catch (JsonProcessingException e) {
            Log.error("序列化错误", e);
            throw new RuntimeException(e);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    public static void main(String[] args) throws IOException, InterruptedException {
        String URL = "https://public.nerve.network";
        Map res = post(URL,Map.of(
                "jsonrpc","2.0",
                "method", "getSymbolInfo", "params", new Integer[]{1,1}, "id", 715
        ));
        Map<String,Object> data = (Map<String, Object>) res.get("result");
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
