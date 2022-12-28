package com.hellogpt;

import android.os.*;
import android.app.*;
import android.webkit.*;

public class MainActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
            super.onCreate(savedInstanceState);
            setContentView(R.layout.activity_main);

            /// set up the webview   //////
            WebView myWebView = (WebView) findViewById(R.id.webview);

            myWebView.setWebViewClient(new WebViewClient() {
                @Override
                public boolean shouldOverrideUrlLoading(WebView view, String url) {
                    String cookieStr = CookieManager.getInstance().getCookie(url); // android.webkit.CookieManager
                    return super.shouldOverrideUrlLoading(view, url);
                }
            });

            WebSettings webSettings = myWebView.getSettings();
            webSettings.setJavaScriptEnabled(true);
            webSettings.setAllowFileAccess(true);
            webSettings.setAllowFileAccessFromFileURLs(true);
            webSettings.setDomStorageEnabled(true);

            //start file. were loading our own javascript projects from the assets folder (the compilation puts 'project/assets' in 'android_asset' for whatever reason, appears uncontrollable AFAICT)
            String filePath = "file:///android_asset/index.html";
            myWebView.loadUrl(filePath);

        } ///// ends OnCreate

} //close of MainActivity