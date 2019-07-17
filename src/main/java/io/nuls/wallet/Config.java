package io.nuls.wallet;

import io.nuls.core.core.annotation.Configuration;

/**
 * @Author: zhoulijun
 * @Time: 2019-06-26 11:43
 * @Description: 功能描述
 */
@Configuration(domain = "nuls-module-web-wallet")
public class Config {

    private String apiModuleApi;

    private int webWalletPort;

    private String webWalletHost;

    public String getApiModuleApi() {
        return apiModuleApi;
    }

    public void setApiModuleApi(String apiModuleApi) {
        this.apiModuleApi = apiModuleApi;
    }

    public int getWebWalletPort() {
        return webWalletPort;
    }

    public void setWebWalletPort(int webWalletPort) {
        this.webWalletPort = webWalletPort;
    }

    public String getWebWalletHost() {
        return webWalletHost;
    }

    public void setWebWalletHost(String webWalletHost) {
        this.webWalletHost = webWalletHost;
    }
}
