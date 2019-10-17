package io.nuls.wallet.controller;

import io.nuls.core.core.annotation.Component;
import io.nuls.core.parse.JSONUtils;

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
import java.util.Map;

/**
 * @Author: zhoulijun
 * @Time: 2019-10-17 16:00
 * @Description: 功能描述
 */
@Path("/market-api/")
@Component
public class MarketApiController {


    Client client = ClientBuilder.newClient();

    @Path("/nuls-price")
    @GET
    @Consumes(MediaType.APPLICATION_JSON)
    public String api(@Context HttpServletRequest request,
                      @Context HttpServletResponse response) throws IOException {
        Response res = client.target("https://api.binance.com").path("/api/v3/ticker/price").queryParam("symbol","NULSUSDT").request(MediaType.APPLICATION_JSON_TYPE).get();
        Map<String,Object> data = res.readEntity(Map.class);
        return JSONUtils.obj2json(data);
    }


}
