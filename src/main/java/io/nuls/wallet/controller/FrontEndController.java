package io.nuls.wallet.controller;

import io.nuls.core.core.annotation.Component;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response;
import java.io.File;
import java.net.URISyntaxException;

/**
 * @Author: zhoulijun
 * @Time: 2019-06-26 18:11
 * @Description: 功能描述
 */
@Path("/{path:.*}")
@Component
public class FrontEndController {

    @GET
    public Response getHtml() throws URISyntaxException {
        return Response.ok(new File("www/index.html")).build();
    }


}
