package io.nuls.wallet.controller;

import io.nuls.core.core.annotation.Component;

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

/**
 * @Author: zhoulijun
 * @Time: 2019-10-17 14:43
 * @Description: 功能描述
 */
@Path("/market-api/")
@Component
public class MarketApiController {

    HttpClient client = HttpClient.newBuilder()
            .connectTimeout(Duration.ofMillis(5000))
            .followRedirects(HttpClient.Redirect.NORMAL)
            .build();

    @Path("/nuls-price")
    @GET
    @Consumes(MediaType.APPLICATION_JSON)
    public Object api(@Context HttpServletRequest request,
                      @Context HttpServletResponse response) throws IOException, InterruptedException {
        HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create("http://binanceapi.zhoulijun.top/api/v3/ticker/price?symbol=NULSUSDT"))
                .timeout(Duration.ofMillis(5009))
                .build();
        HttpResponse<String> res =
                client.send(req, HttpResponse.BodyHandlers.ofString());
        return res.body();
    }

}
