/*
 * MIT License
 *
 * Copyright (c) 2017-2019 nuls.io
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

package io.nuls.wallet.controller;

import io.nuls.core.log.Log;
import org.glassfish.grizzly.http.server.HttpServer;
import org.glassfish.grizzly.http.server.NetworkListener;
import org.glassfish.grizzly.http.server.ServerConfiguration;
import org.glassfish.grizzly.http.server.StaticHttpHandler;
import org.glassfish.grizzly.nio.transport.TCPNIOTransport;
import org.glassfish.grizzly.servlet.WebappContext;
import org.glassfish.grizzly.strategies.WorkerThreadIOStrategy;
import org.glassfish.grizzly.threadpool.ThreadPoolConfig;
import org.glassfish.grizzly.utils.Charsets;
import org.glassfish.jersey.internal.guava.ThreadFactoryBuilder;
import org.glassfish.jersey.servlet.ServletContainer;

import javax.servlet.ServletRegistration;
import javax.ws.rs.core.UriBuilder;
import java.io.IOException;
import java.net.URI;

/**
 * @author: Niels Wang
 */
public class WebServerManager {


    private static final WebServerManager INSTANCE = new WebServerManager();

    private HttpServer httpServer;

    private WebServerManager() {
    }

    public static WebServerManager getInstance() {
        return INSTANCE;
    }

    public void startServer(String ip, int port) {
        URI serverURI = UriBuilder.fromUri("http://" + ip).port(port).build();
        // Create test web application context.
        WebappContext webappContext = new WebappContext("NULS-MAIL-SERVER", "/");
        ServletRegistration servletRegistration = webappContext.addServlet("jersey-servlet", ServletContainer.class);
        servletRegistration.setInitParameter("javax.ws.rs.Application", "io.nuls.wallet.controller.NulsResourceConfig");
        servletRegistration.addMapping("/*");
        httpServer = new HttpServer();
        NetworkListener listener = new NetworkListener("grizzly2", ip, port);
        TCPNIOTransport transport = listener.getTransport();
        ThreadPoolConfig workerPool = ThreadPoolConfig.defaultConfig()
                .setCorePoolSize(4)
                .setMaxPoolSize(4)
                .setQueueLimit(1000)
                .setThreadFactory((new ThreadFactoryBuilder()).setNameFormat("grizzly-http-server-%d").build());
        transport.configureBlocking(false);
        transport.setSelectorRunnersCount(2);
        transport.setWorkerThreadPoolConfig(workerPool);
        transport.setIOStrategy(WorkerThreadIOStrategy.getInstance());
        transport.setTcpNoDelay(true);
        listener.setSecure(false);
        httpServer.addListener(listener);
        ServerConfiguration config = httpServer.getServerConfiguration();
        config.setDefaultQueryEncoding(Charsets.UTF8_CHARSET);
        final StaticHttpHandler staticHandler = new StaticHttpHandler("www");
        // change to true in the deploy time
        staticHandler.setFileCacheEnabled(true);
        httpServer.getServerConfiguration().addHttpHandler(staticHandler, "/dist");
//        final StaticHttpHandler indexHandler = new StaticHttpHandler("data/index.html");
//        // change to true in the deploy time
//        indexHandler.setFileCacheEnabled(true);
//        httpServer.getServerConfiguration().addHttpHandler(indexHandler, "/dist");

        webappContext.deploy(httpServer);
        try {
            httpServer.start();
            Log.info("http restFul server is started!url is " + serverURI.toString());
        } catch (IOException e) {
            Log.error("",e);
            httpServer.shutdownNow();
        }
    }

}
