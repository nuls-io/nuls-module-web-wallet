package io.nuls.wallet.controller;

import com.sun.grizzly.http.embed.GrizzlyWebServer;
import com.sun.grizzly.http.servlet.ServletAdapter;
import org.glassfish.jersey.servlet.ServletContainer;

import java.io.IOException;

/**
 * @Author: zhoulijun
 * @Time: 2019-06-25 16:56
 * @Description: 功能描述
 */
public class WebServer {

    public static void start() throws IOException {
        GrizzlyWebServer server = new GrizzlyWebServer(8080);

        ServletAdapter jerseyAdapter = new ServletAdapter("/dist");
        jerseyAdapter.addInitParameter("com.sun.jersey.config.property.packages",
                "io.nuls");
        jerseyAdapter.setContextPath("/");
        jerseyAdapter.setServletInstance(new ServletContainer());
        jerseyAdapter.setHandleStaticResources(true);

        server.addGrizzlyAdapter(jerseyAdapter, new String[]{"/"});

        server.start();
    }

}
