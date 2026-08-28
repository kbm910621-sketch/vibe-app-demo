package com.example.name

import android.annotation.SuppressLint
import android.content.ActivityNotFoundException
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.net.Uri
import android.net.http.SslError
import android.os.Bundle
import android.view.View
import android.webkit.JavascriptInterface
import android.webkit.JsPromptResult
import android.webkit.JsResult
import android.webkit.SslErrorHandler
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Button
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout

import android.Manifest
import android.content.pm.PackageManager
import android.os.Build
import android.util.Log
import androidx.core.content.ContextCompat
import com.google.firebase.messaging.FirebaseMessaging

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var swipeRefreshLayout: SwipeRefreshLayout
    private lateinit var progressBar: ProgressBar
    private lateinit var errorLayout: LinearLayout
    private lateinit var btnRetry: Button

    private val defaultTargetUrl = "https://kemboll.dothome.co.kr/html2"
    private var currentFcmToken: String = ""
    private var backPressedTime: Long = 0
    private var fileUploadCallback: ValueCallback<Array<Uri>>? = null

    // Notification Permission Launcher (Android 13+)
    private val notificationPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        if (isGranted) {
            Log.d("FCM", "알림 권한이 허용되었습니다.")
        } else {
            Log.w("FCM", "알림 권한이 거부되었습니다.")
        }
    }

    // File chooser launcher for WebView file uploads
    private val fileChooserLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (fileUploadCallback != null) {
            val results = WebChromeClient.FileChooserParams.parseResult(result.resultCode, result.data)
            fileUploadCallback?.onReceiveValue(results)
            fileUploadCallback = null
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main)

        initViews()
        setupEdgeToEdgeInsets()
        setupWebView()
        setupSwipeRefresh()
        setupBackPressHandler()

        // Request Notification permission for Android 13+
        requestNotificationPermission()

        // Fetch and register FCM Token
        fetchFcmToken()

        // Handle initial URL (from Push Notification or default)
        val initialUrl = handlePushIntent(intent) ?: defaultTargetUrl
        webView.loadUrl(initialUrl)
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        val targetUrl = handlePushIntent(intent)
        if (!targetUrl.isNullOrEmpty()) {
            webView.loadUrl(targetUrl)
        }
    }

    private fun handlePushIntent(intent: Intent?): String? {
        if (intent == null) return null
        return intent.getStringExtra("push_target_url")
    }

    private fun requestNotificationPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                notificationPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
            }
        }
    }

    private fun fetchFcmToken() {
        FirebaseMessaging.getInstance().token.addOnCompleteListener { task ->
            if (!task.isSuccessful) {
                Log.w("FCM", "FCM 토큰 가져오기 실패", task.exception)
                return@addOnCompleteListener
            }
            val token = task.result
            currentFcmToken = token
            Log.d("FCM", "👉 현재 기기 FCM 푸시 토큰: $token")

            // SharedPreferences 저장
            val prefs = getSharedPreferences(MyFirebaseMessagingService.PREFS_NAME, Context.MODE_PRIVATE)
            prefs.edit().putString(MyFirebaseMessagingService.KEY_FCM_TOKEN, token).apply()
        }
    }

    private fun initViews() {
        webView = findViewById(R.id.webView)
        swipeRefreshLayout = findViewById(R.id.swipeRefreshLayout)
        progressBar = findViewById(R.id.progressBar)
        errorLayout = findViewById(R.id.errorLayout)
        btnRetry = findViewById(R.id.btnRetry)

        btnRetry.setOnClickListener {
            errorLayout.visibility = View.GONE
            webView.visibility = View.VISIBLE
            webView.reload()
        }
    }

    private fun setupEdgeToEdgeInsets() {
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { _, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            // Top padding for status bar if desired, or let WebView go under translucent bar
            progressBar.setPadding(0, systemBars.top, 0, 0)
            insets
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView() {
        val settings: WebSettings = webView.settings
        settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            loadWithOverviewMode = true
            useWideViewPort = true
            setSupportZoom(false)
            builtInZoomControls = false
            displayZoomControls = false
            cacheMode = WebSettings.LOAD_DEFAULT
            allowFileAccess = true
            allowContentAccess = true
            mediaPlaybackRequiresUserGesture = false
            mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
            
            // Custom UserAgent to identify Hybrid Android App
            val defaultUserAgent = userAgentString
            userAgentString = "$defaultUserAgent HybridApp/BusanAcademy/1.0 (Android)"
        }

        // Bridge for Web to Native calls
        webView.addJavascriptInterface(WebAppInterface(this), "AndroidBridge")

        // WebView Client
        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val url = request?.url?.toString() ?: return false

                // Handle external schemes (tel, mailto, sms, kakaolink, intent, market)
                if (url.startsWith("tel:") || url.startsWith("mailto:") || url.startsWith("sms:")) {
                    try {
                        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                        startActivity(intent)
                    } catch (e: ActivityNotFoundException) {
                        Toast.makeText(this@MainActivity, "해당 기능을 실행할 수 있는 앱이 없습니다.", Toast.LENGTH_SHORT).show()
                    }
                    return true
                }

                if (url.startsWith("intent:") || url.startsWith("kakaolink:") || url.startsWith("market:")) {
                    try {
                        val intent = Intent.parseUri(url, Intent.URI_INTENT_SCHEME)
                        if (intent != null) {
                            startActivity(intent)
                            return true
                        }
                    } catch (e: Exception) {
                        try {
                            val fallbackUrl = Intent.parseUri(url, Intent.URI_INTENT_SCHEME).getStringExtra("browser_fallback_url")
                            if (!fallbackUrl.isNullOrEmpty()) {
                                view?.loadUrl(fallbackUrl)
                                return true
                            }
                        } catch (ignored: Exception) {
                        }
                    }
                    return true
                }

                return false
            }

            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                super.onPageStarted(view, url, favicon)
                progressBar.visibility = View.VISIBLE
                errorLayout.visibility = View.GONE
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                progressBar.visibility = View.GONE
                swipeRefreshLayout.isRefreshing = false
            }

            override fun onReceivedError(view: WebView?, request: WebResourceRequest?, error: WebResourceError?) {
                super.onReceivedError(view, request, error)
                if (request?.isForMainFrame == true) {
                    progressBar.visibility = View.GONE
                    swipeRefreshLayout.isRefreshing = false
                    webView.visibility = View.GONE
                    errorLayout.visibility = View.VISIBLE
                }
            }

            @SuppressLint("WebViewClientOnReceivedSslError")
            override fun onReceivedSslError(view: WebView?, handler: SslErrorHandler?, error: SslError?) {
                // In production, proceed handler or show dialog
                handler?.proceed()
            }
        }

        // WebChrome Client
        webView.webChromeClient = object : WebChromeClient() {
            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                progressBar.progress = newProgress
                if (newProgress == 100) {
                    progressBar.visibility = View.GONE
                }
            }

            override fun onJsAlert(view: WebView?, url: String?, message: String?, result: JsResult?): Boolean {
                AlertDialog.Builder(this@MainActivity)
                    .setTitle("부산전문학원 알림")
                    .setMessage(message)
                    .setPositiveButton("확인") { _, _ -> result?.confirm() }
                    .setCancelable(false)
                    .create()
                    .show()
                return true
            }

            override fun onJsConfirm(view: WebView?, url: String?, message: String?, result: JsResult?): Boolean {
                AlertDialog.Builder(this@MainActivity)
                    .setTitle("부산전문학원 확인")
                    .setMessage(message)
                    .setPositiveButton("확인") { _, _ -> result?.confirm() }
                    .setNegativeButton("취소") { _, _ -> result?.cancel() }
                    .setCancelable(false)
                    .create()
                    .show()
                return true
            }

            override fun onShowFileChooser(
                webView: WebView?,
                filePathCallback: ValueCallback<Array<Uri>>?,
                fileChooserParams: FileChooserParams?
            ): Boolean {
                fileUploadCallback?.onReceiveValue(null)
                fileUploadCallback = filePathCallback

                val intent = fileChooserParams?.createIntent() ?: Intent(Intent.ACTION_GET_CONTENT).apply {
                    type = "*/*"
                    addCategory(Intent.CATEGORY_OPENABLE)
                }

                try {
                    fileChooserLauncher.launch(intent)
                } catch (e: ActivityNotFoundException) {
                    fileUploadCallback = null
                    Toast.makeText(this@MainActivity, "파일 선택기를 열 수 없습니다.", Toast.LENGTH_SHORT).show()
                    return false
                }
                return true
            }
        }
    }

    private fun setupSwipeRefresh() {
        swipeRefreshLayout.setColorSchemeResources(
            android.R.color.holo_blue_bright,
            android.R.color.holo_green_light,
            android.R.color.holo_orange_light
        )
        swipeRefreshLayout.setOnRefreshListener {
            webView.reload()
        }

        // Enable pull-to-refresh only when webview is at top
        webView.viewTreeObserver.addOnScrollChangedListener {
            swipeRefreshLayout.isEnabled = (webView.scrollY == 0)
        }
    }

    private fun setupBackPressHandler() {
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack()
                } else {
                    if (System.currentTimeMillis() - backPressedTime < 2000) {
                        finish()
                    } else {
                        backPressedTime = System.currentTimeMillis()
                        Toast.makeText(this@MainActivity, "뒤로가기 버튼을 한 번 더 누르면 종료됩니다.", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        })
    }

    override fun onDestroy() {
        webView.stopLoading()
        webView.destroy()
        super.onDestroy()
    }

    // Native Bridge Interface
    inner class WebAppInterface(private val context: Context) {
        @JavascriptInterface
        fun showToast(message: String) {
            Toast.makeText(context, message, Toast.LENGTH_SHORT).show()
        }

        @JavascriptInterface
        fun getAppVersion(): String {
            return "1.0.0"
        }

        @JavascriptInterface
        fun getFcmToken(): String {
            val prefs = context.getSharedPreferences(MyFirebaseMessagingService.PREFS_NAME, Context.MODE_PRIVATE)
            return currentFcmToken.ifEmpty {
                prefs.getString(MyFirebaseMessagingService.KEY_FCM_TOKEN, "") ?: ""
            }
        }

        @JavascriptInterface
        fun openExternalBrowser(url: String) {
            val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
            context.startActivity(intent)
        }
    }
}