package ir.arvanping.mahghasi;

import android.Manifest;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
import android.provider.MediaStore;
import android.provider.Settings;
import android.util.Base64;
import android.view.Gravity;
import android.view.View;
import android.webkit.GeolocationPermissions;
import android.webkit.JavascriptInterface;
import android.webkit.PermissionRequest;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.content.FileProvider;
import androidx.webkit.WebViewAssetLoader;
import androidx.webkit.ServiceWorkerClientCompat;
import androidx.webkit.ServiceWorkerControllerCompat;
import androidx.webkit.WebViewFeature;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

public class MainActivity extends Activity {
    static final String HOST = "appassets.androidplatform.net";
    static final String START = "https://" + HOST + "/assets/www/index.html";
    static final String CH = "mg_main";
    static final int RQ_FILE = 11, RQ_PERM = 12, RQ_NOTIF = 13;

    WebView web;
    ValueCallback<Uri[]> fileCb;
    PermissionRequest pendingWebPerm;
    GeolocationPermissions.Callback geoCb;
    String geoOrigin;
    final Handler ui = new Handler(Looper.getMainLooper());
    int notifId = 100;
    boolean askedNotif = false;

    static final String SHIM = "(function(){if(window.__mgShim)return;window.__mgShim=1;" +
            "try{navigator.share=function(d){d=d||{};MGNative.share(((d.title||'')+'\\n'+(d.text||'')+(d.url?'\\n'+d.url:'')).trim());return Promise.resolve()};}catch(e){}" +
            "try{var N=function(t,o){MGNative.notify(String(t||''),String((o&&o.body)||''))};N.permission='granted';N.requestPermission=function(cb){MGNative.reqNotif();cb&&cb('granted');return Promise.resolve('granted')};window.Notification=N;}catch(e){}" +
            "try{var oc=HTMLAnchorElement.prototype.click;HTMLAnchorElement.prototype.click=function(){var h=this.href||'';if(this.download&&(h.indexOf('blob:')===0||h.indexOf('data:')===0)){var n=this.download;fetch(h).then(function(r){return r.blob()}).then(function(b){var fr=new FileReader();fr.onload=function(){var s=String(fr.result);MGNative.saveFile(n,b.type||'application/octet-stream',s.substring(s.indexOf(',')+1))};fr.readAsDataURL(b)});return}return oc.call(this)};" +
            "document.addEventListener('click',function(e){var a=e.target&&e.target.closest&&e.target.closest('a[download]');if(!a)return;var h=a.href||'';if(h.indexOf('blob:')===0||h.indexOf('data:')===0){e.preventDefault();a.click()}},true);}catch(e){}" +
            "window.MG_APP={version:MGNative.version(),code:MGNative.versionCode()};" +
            "})();";

    @Override
    protected void onCreate(Bundle b) {
        super.onCreate(b);
        final Thread.UncaughtExceptionHandler prev = Thread.getDefaultUncaughtExceptionHandler();
        Thread.setDefaultUncaughtExceptionHandler((t, e) -> {
            try {
                java.io.StringWriter sw = new java.io.StringWriter();
                e.printStackTrace(new java.io.PrintWriter(sw));
                getSharedPreferences("mg", MODE_PRIVATE).edit().putString("crash", BuildConfig.VERSION_NAME + " " + sw.toString().substring(0, Math.min(1500, sw.toString().length()))).commit();
            } catch (Exception ignored) {
            }
            if (prev != null) prev.uncaughtException(t, e);
        });
        createChannel();
        web = new WebView(this);
        web.setBackgroundColor(Color.WHITE);
        setContentView(web);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setGeolocationEnabled(true);
        s.setAllowFileAccess(false);
        s.setTextZoom(100);
        s.setCacheMode(WebSettings.LOAD_DEFAULT);
        web.addJavascriptInterface(new Bridge(), "MGNative");

        final WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
                .setDomain(HOST)
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();

        try {
            if (WebViewFeature.isFeatureSupported(WebViewFeature.SERVICE_WORKER_BASIC_USAGE)) {
                ServiceWorkerControllerCompat.getInstance().setServiceWorkerClient(new ServiceWorkerClientCompat() {
                    @Override
                    public WebResourceResponse shouldInterceptRequest(WebResourceRequest r) {
                        WebResourceResponse px = proxy(r);
                        if (px != null) return px;
                        return loader.shouldInterceptRequest(r.getUrl());
                    }
                });
            }
        } catch (Exception ignored) {
        }

        web.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView v, WebResourceRequest r) {
                WebResourceResponse px = proxy(r);
                if (px != null) return px;
                return loader.shouldInterceptRequest(r.getUrl());
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest r) {
                Uri u = r.getUrl();
                if (HOST.equals(u.getHost())) return false;
                openExternal(u);
                return true;
            }

            @Override
            public void onPageStarted(WebView v, String url, android.graphics.Bitmap f) {
                v.evaluateJavascript(SHIM, null);
            }

            @Override
            public void onPageFinished(WebView v, String url) {
                v.evaluateJavascript(SHIM, null);
            }
        });

        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onShowCustomView(View view, CustomViewCallback cb) {
                if (customView != null) {
                    cb.onCustomViewHidden();
                    return;
                }
                customView = view;
                customCb = cb;
                ((android.view.ViewGroup) getWindow().getDecorView()).addView(view, new android.widget.FrameLayout.LayoutParams(-1, -1));
                immersive(true, true);
            }

            @Override
            public void onHideCustomView() {
                hideCustom();
            }

            @Override
            public boolean onShowFileChooser(WebView v, ValueCallback<Uri[]> cb, FileChooserParams p) {
                if (fileCb != null) fileCb.onReceiveValue(null);
                fileCb = cb;
                try {
                    Intent i = p.createIntent();
                    i.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, p.getMode() == FileChooserParams.MODE_OPEN_MULTIPLE);
                    startActivityForResult(Intent.createChooser(i, "انتخاب فایل"), RQ_FILE);
                } catch (Exception e) {
                    fileCb = null;
                    return false;
                }
                return true;
            }

            @Override
            public void onPermissionRequest(final PermissionRequest req) {
                ui.post(() -> {
                    List<String> need = new ArrayList<>();
                    for (String r : req.getResources()) {
                        if (PermissionRequest.RESOURCE_VIDEO_CAPTURE.equals(r) && !has(Manifest.permission.CAMERA))
                            need.add(Manifest.permission.CAMERA);
                        if (PermissionRequest.RESOURCE_AUDIO_CAPTURE.equals(r) && !has(Manifest.permission.RECORD_AUDIO))
                            need.add(Manifest.permission.RECORD_AUDIO);
                    }
                    if (need.isEmpty()) req.grant(req.getResources());
                    else {
                        pendingWebPerm = req;
                        requestPermissions(need.toArray(new String[0]), RQ_PERM);
                    }
                });
            }

            @Override
            public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback cb) {
                if (has(Manifest.permission.ACCESS_FINE_LOCATION)) cb.invoke(origin, true, false);
                else {
                    geoCb = cb;
                    geoOrigin = origin;
                    requestPermissions(new String[]{Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION}, RQ_PERM);
                }
            }
        });

        if (b != null) web.restoreState(b);
        else web.loadUrl(START);
        ui.postDelayed(() -> checkUpdate(false), 2500);
    }

    View customView;
    WebChromeClient.CustomViewCallback customCb;
    boolean fsOn = false;
    String UA = null;

    void hideCustom() {
        if (customView == null) return;
        try {
            ((android.view.ViewGroup) getWindow().getDecorView()).removeView(customView);
        } catch (Exception ignored) {
        }
        customView = null;
        try {
            if (customCb != null) customCb.onCustomViewHidden();
        } catch (Exception ignored) {
        }
        customCb = null;
        if (!fsOn) immersive(false, false);
    }

    void immersive(boolean on, boolean land) {
        android.view.Window w = getWindow();
        View d = w.getDecorView();
        if (on) {
            d.setSystemUiVisibility(View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
            w.addFlags(android.view.WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
            if (land) setRequestedOrientation(android.content.pm.ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE);
        } else {
            d.setSystemUiVisibility(View.SYSTEM_UI_FLAG_VISIBLE);
            w.clearFlags(android.view.WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
            setRequestedOrientation(android.content.pm.ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED);
            web.evaluateJavascript("window.syncBars&&syncBars()", null);
        }
    }

    static final java.util.regex.Pattern URI_ATTR = java.util.regex.Pattern.compile("URI=\"([^\"]+)\"");

    static String pxUrl(String abs) {
        return "https://" + HOST + "/__px?u=" + Uri.encode(abs);
    }

    static String absUrl(URL base, String rel) {
        try {
            return new URL(base, rel.trim()).toString();
        } catch (Exception e) {
            return rel;
        }
    }

    WebResourceResponse proxy(WebResourceRequest r) {
        Uri u0 = r.getUrl();
        if (u0 == null || !HOST.equals(u0.getHost()) || !"/__px".equals(u0.getPath())) return null;
        java.util.Map<String, String> h = new java.util.HashMap<>();
        h.put("Access-Control-Allow-Origin", "*");
        h.put("Access-Control-Allow-Headers", "*");
        h.put("Cache-Control", "no-store");
        if ("OPTIONS".equalsIgnoreCase(r.getMethod()))
            return new WebResourceResponse("text/plain", "utf-8", 200, "OK", h, new java.io.ByteArrayInputStream(new byte[0]));
        String target = u0.getQueryParameter("u");
        try {
            if (UA == null) UA = WebSettings.getDefaultUserAgent(this);
            URL url = new URL(target);
            HttpURLConnection c = null;
            for (int i = 0; i < 6; i++) {
                c = (HttpURLConnection) url.openConnection();
                c.setInstanceFollowRedirects(false);
                c.setConnectTimeout(12000);
                c.setReadTimeout(20000);
                c.setRequestProperty("User-Agent", UA);
                String rg = r.getRequestHeaders() == null ? null : r.getRequestHeaders().get("Range");
                if (rg != null) c.setRequestProperty("Range", rg);
                int code = c.getResponseCode();
                if (code >= 300 && code < 400 && c.getHeaderField("Location") != null) {
                    url = new URL(url, c.getHeaderField("Location"));
                    c.disconnect();
                    continue;
                }
                break;
            }
            int code = c.getResponseCode();
            String ct = c.getContentType() == null ? "application/octet-stream" : c.getContentType();
            String mime = ct.split(";")[0].trim();
            InputStream in = code >= 400 ? c.getErrorStream() : c.getInputStream();
            if (in == null) in = new java.io.ByteArrayInputStream(new byte[0]);
            String path = url.getPath() == null ? "" : url.getPath().toLowerCase();
            boolean pl = mime.contains("mpegurl") || path.endsWith(".m3u8") || path.endsWith(".m3u");
            if (pl && code < 400) {
                java.io.ByteArrayOutputStream bo = new java.io.ByteArrayOutputStream();
                byte[] buf = new byte[16384];
                int n;
                while ((n = in.read(buf)) > 0) {
                    bo.write(buf, 0, n);
                    if (bo.size() > 8 * 1024 * 1024) break;
                }
                in.close();
                String txt = bo.toString("UTF-8");
                if (txt.trim().startsWith("#EXTM3U")) {
                    StringBuilder sb = new StringBuilder();
                    for (String line : txt.split("\\r?\\n")) {
                        String t = line.trim();
                        if (t.isEmpty()) {
                            sb.append('\n');
                            continue;
                        }
                        if (t.startsWith("#")) {
                            java.util.regex.Matcher m = URI_ATTR.matcher(line);
                            StringBuffer o = new StringBuffer();
                            while (m.find()) m.appendReplacement(o, java.util.regex.Matcher.quoteReplacement("URI=\"" + pxUrl(absUrl(url, m.group(1))) + "\""));
                            m.appendTail(o);
                            sb.append(o).append('\n');
                        } else sb.append(pxUrl(absUrl(url, t))).append('\n');
                    }
                    txt = sb.toString();
                    mime = "application/vnd.apple.mpegurl";
                }
                return new WebResourceResponse(mime, "utf-8", 200, "OK", h, new java.io.ByteArrayInputStream(txt.getBytes("UTF-8")));
            }
            String cr = c.getHeaderField("Content-Range");
            if (cr != null) h.put("Content-Range", cr);
            String cl = c.getHeaderField("Content-Length");
            if (cl != null) h.put("Content-Length", cl);
            h.put("Accept-Ranges", "bytes");
            String reason = c.getResponseMessage();
            if (reason == null || reason.isEmpty()) reason = "OK";
            if (code < 200 || (code >= 300 && code < 400)) code = 200;
            return new WebResourceResponse(mime, null, code, reason, h, in);
        } catch (Exception e) {
            return new WebResourceResponse("text/plain", "utf-8", 502, "Bad Gateway", h, new java.io.ByteArrayInputStream(String.valueOf(e).getBytes()));
        }
    }

    boolean has(String p) {
        return checkSelfPermission(p) == PackageManager.PERMISSION_GRANTED;
    }

    @Override
    public void onRequestPermissionsResult(int rq, String[] perms, int[] res) {
        super.onRequestPermissionsResult(rq, perms, res);
        if (rq == RQ_PERM) {
            if (pendingWebPerm != null) {
                List<String> ok = new ArrayList<>();
                for (String r : pendingWebPerm.getResources()) {
                    if (PermissionRequest.RESOURCE_VIDEO_CAPTURE.equals(r) && has(Manifest.permission.CAMERA)) ok.add(r);
                    else if (PermissionRequest.RESOURCE_AUDIO_CAPTURE.equals(r) && has(Manifest.permission.RECORD_AUDIO)) ok.add(r);
                }
                if (ok.isEmpty()) pendingWebPerm.deny();
                else pendingWebPerm.grant(ok.toArray(new String[0]));
                pendingWebPerm = null;
            }
            if (geoCb != null) {
                geoCb.invoke(geoOrigin, has(Manifest.permission.ACCESS_FINE_LOCATION) || has(Manifest.permission.ACCESS_COARSE_LOCATION), false);
                geoCb = null;
            }
        }
    }

    @Override
    protected void onActivityResult(int rq, int rc, Intent data) {
        super.onActivityResult(rq, rc, data);
        if (rq == RQ_FILE && fileCb != null) {
            Uri[] r = null;
            if (rc == RESULT_OK && data != null) {
                if (data.getClipData() != null) {
                    int n = data.getClipData().getItemCount();
                    r = new Uri[n];
                    for (int i = 0; i < n; i++) r[i] = data.getClipData().getItemAt(i).getUri();
                } else if (data.getData() != null) r = new Uri[]{data.getData()};
            }
            fileCb.onReceiveValue(r);
            fileCb = null;
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (web != null) web.evaluateJavascript("window.natActions&&natActions()", null);
        ui.postDelayed(() -> checkUpdate(false), 1500);
    }

    @Override
    protected void onSaveInstanceState(Bundle o) {
        super.onSaveInstanceState(o);
        web.saveState(o);
    }

    @Override
    public void onBackPressed() {
        if (customView != null) {
            hideCustom();
            return;
        }
        web.evaluateJavascript("(function(){try{if(window.mgBack&&mgBack())return 'b';var m=document.getElementById('xmn');if(m){m.remove();return 'm'}if(typeof XV!=='undefined'&&XV){XV=null;draw();return 'v'}if(typeof tab!=='undefined'&&tab!=='home'){tab='home';draw();window.scrollTo(0,0);return 't'}}catch(e){}return ''})()", r -> {
            if (r == null || r.equals("\"\"") || r.equals("null")) MainActivity.super.onBackPressed();
        });
    }

    void openExternal(Uri u) {
        try {
            String sc = u.getScheme() == null ? "" : u.getScheme();
            Intent i = sc.equals("tel") ? new Intent(Intent.ACTION_DIAL, u) : new Intent(Intent.ACTION_VIEW, u);
            startActivity(i);
        } catch (ActivityNotFoundException e) {
            toast("برنامه‌ای برای باز کردن پیدا نشد");
        }
    }

    void toast(String t) {
        ui.post(() -> Toast.makeText(this, t, Toast.LENGTH_SHORT).show());
    }

    void createChannel() {
        if (Build.VERSION.SDK_INT >= 26) {
            NotificationChannel c = new NotificationChannel(CH, "یادآوری‌ها", NotificationManager.IMPORTANCE_HIGH);
            c.enableVibration(true);
            ((NotificationManager) getSystemService(NOTIFICATION_SERVICE)).createNotificationChannel(c);
        }
    }

    /* ---------- auto update ---------- */
    String httpGet(String u) throws Exception {
        HttpURLConnection c = (HttpURLConnection) new URL(u + "?t=" + System.currentTimeMillis()).openConnection();
        c.setConnectTimeout(10000);
        c.setReadTimeout(15000);
        c.setInstanceFollowRedirects(true);
        try (InputStream in = c.getInputStream(); BufferedReader r = new BufferedReader(new InputStreamReader(in, "UTF-8"))) {
            StringBuilder sb = new StringBuilder();
            String l;
            while ((l = r.readLine()) != null) sb.append(l).append('\n');
            return sb.toString();
        } finally {
            c.disconnect();
        }
    }

    void checkUpdate(final boolean manual) {
        SharedPreferences sp = getSharedPreferences("mg", MODE_PRIVATE);
        if (!manual && System.currentTimeMillis() - sp.getLong("lastCheck", 0) < 60 * 1000L) return;
        sp.edit().putLong("lastCheck", System.currentTimeMillis()).apply();
        if (manual) toast("در حال بررسی نسخه‌ی جدید…");
        new Thread(() -> {
            JSONObject j = null;
            for (String u : new String[]{BuildConfig.UPDATE_URL3, BuildConfig.UPDATE_URL, BuildConfig.UPDATE_URL2}) {
                try {
                    j = new JSONObject(httpGet(u));
                    break;
                } catch (Exception ignored) {
                }
            }
            final JSONObject jj = j;
            ui.post(() -> {
                if (isFinishing()) return;
                if (jj == null) {
                    if (manual) toast("اتصال برای بررسی به‌روزرسانی برقرار نشد");
                    return;
                }
                int code = jj.optInt("versionCode", 0);
                if (code <= BuildConfig.VERSION_CODE) {
                    if (manual) toast("شما آخرین نسخه را دارید (" + BuildConfig.VERSION_NAME + ")");
                    return;
                }
                if (!manual && jj.optInt("skip", 0) == 1) return;
                showUpdate(jj);
            });
        }).start();
    }

    void showUpdate(final JSONObject j) {
        web.evaluateJavascript("(typeof mgShowUpdate==='function')?mgShowUpdate(" + j.toString() + "):false", r -> {
            if (r == null || !r.contains("true")) showUpdateNative(j);
        });
    }

    void js(final String code) {
        ui.post(() -> web.evaluateJavascript(code, null));
    }

    void downloadWeb(final String urls) {
        if (urls == null || urls.trim().isEmpty()) return;
        new Thread(() -> {
            File out = new File(getExternalFilesDir(null), "LunarCycle-update.apk");
            String url = "";
            for (String u : urls.split("\n")) {
                url = u.trim();
                if (url.isEmpty()) continue;
                if (fetchApk(url, out) && newer(out)) {
                    js("window.mgUpdDone&&mgUpdDone()");
                    ui.post(() -> install(out));
                    return;
                }
            }
            js("window.mgUpdErr&&mgUpdErr(" + JSONObject.quote(url) + ")");
        }).start();
    }

    boolean newer(File f) {
        try {
            android.content.pm.PackageInfo pi = getPackageManager().getPackageArchiveInfo(f.getPath(), 0);
            if (pi == null) return false;
            long vc = Build.VERSION.SDK_INT >= 28 ? pi.getLongVersionCode() : pi.versionCode;
            return vc > BuildConfig.VERSION_CODE;
        } catch (Exception e) {
            return true;
        }
    }

    boolean fetchApk(String url, File out) {
        {
            try {
                HttpURLConnection c = (HttpURLConnection) new URL(url).openConnection();
                c.setInstanceFollowRedirects(true);
                c.setConnectTimeout(15000);
                c.setReadTimeout(30000);
                int total = c.getContentLength();
                int last = -1;
                try (InputStream in = c.getInputStream(); OutputStream os = new FileOutputStream(out)) {
                    byte[] buf = new byte[32768];
                    int n;
                    long done = 0;
                    if (c.getResponseCode() >= 400) return false;
                    while ((n = in.read(buf)) > 0) {
                        os.write(buf, 0, n);
                        done += n;
                        if (total > 0) {
                            int pc = (int) (done * 100L / total);
                            if (pc != last) {
                                last = pc;
                                js("window.mgUpdProg&&mgUpdProg(" + pc + "," + (done / 1048576.0) + "," + (total / 1048576.0) + ")");
                            }
                        }
                    }
                    if (total > 0 && done < total) return false;
                    if (done < 100000) return false;
                }
                return true;
            } catch (Exception e) {
                js("window.mgUpdProg&&mgUpdProg(0,0,0)");
                return false;
            }
        }
    }

    void showUpdateNative(final JSONObject j) {
        String notes = j.optString("notes", "");
        AlertDialog.Builder d = new AlertDialog.Builder(this)
                .setTitle("نسخه‌ی جدید Lunar cycle (" + j.optString("versionName", "") + ")")
                .setMessage((notes.isEmpty() ? "نسخه‌ی تازه آماده است." : notes) + "\n\nاطلاعات شما حفظ می‌شود.")
                .setPositiveButton("به‌روزرسانی", (x, y) -> download(j.optString("apk")));
        if (!j.optBoolean("force", false)) d.setNegativeButton("بعداً", null);
        else d.setCancelable(false);
        d.show();
    }

    void download(final String url) {
        if (url == null || url.isEmpty()) return;
        LinearLayout box = new LinearLayout(this);
        box.setOrientation(LinearLayout.VERTICAL);
        box.setPadding(60, 40, 60, 20);
        final TextView tv = new TextView(this);
        tv.setText("در حال دانلود…");
        tv.setGravity(Gravity.START);
        final ProgressBar pb = new ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal);
        pb.setMax(100);
        box.addView(tv);
        box.addView(pb);
        final AlertDialog dlg = new AlertDialog.Builder(this).setTitle("به‌روزرسانی").setView(box).setCancelable(false).create();
        dlg.show();
        new Thread(() -> {
            File out = new File(getExternalFilesDir(null), "LunarCycle-update.apk");
            try {
                HttpURLConnection c = (HttpURLConnection) new URL(url).openConnection();
                c.setInstanceFollowRedirects(true);
                c.setConnectTimeout(15000);
                c.setReadTimeout(30000);
                int total = c.getContentLength();
                try (InputStream in = c.getInputStream(); OutputStream os = new FileOutputStream(out)) {
                    byte[] buf = new byte[32768];
                    int n, done = 0;
                    while ((n = in.read(buf)) > 0) {
                        os.write(buf, 0, n);
                        done += n;
                        if (total > 0) {
                            final int pc = (int) (done * 100L / total);
                            final int dd = done;
                            ui.post(() -> {
                                pb.setProgress(pc);
                                tv.setText("در حال دانلود… " + pc + "٪ (" + (dd / 1024 / 1024) + " MB)");
                            });
                        }
                    }
                }
                ui.post(() -> {
                    dlg.dismiss();
                    install(out);
                });
            } catch (Exception e) {
                ui.post(() -> {
                    dlg.dismiss();
                    new AlertDialog.Builder(this).setTitle("خطا در دانلود")
                            .setMessage("دانلود کامل نشد. اتصال اینترنت را بررسی کن یا از مرورگر دانلود کن.")
                            .setPositiveButton("دانلود در مرورگر", (x, y) -> openExternal(Uri.parse(url)))
                            .setNegativeButton("بستن", null).show();
                });
            }
        }).start();
    }

    void install(File f) {
        if (Build.VERSION.SDK_INT >= 26 && !getPackageManager().canRequestPackageInstalls()) {
            new AlertDialog.Builder(this).setTitle("یک اجازه لازم است")
                    .setMessage("برای نصب نسخه‌ی جدید، در صفحه‌ی بعد گزینه‌ی «اجازه از این منبع» را برای Lunar cycle روشن کن، بعد برگرد و دوباره «به‌روزرسانی» را بزن.")
                    .setPositiveButton("باشه", (x, y) -> {
                        try {
                            startActivity(new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES, Uri.parse("package:" + getPackageName())));
                        } catch (Exception ignored) {
                        }
                    }).show();
            return;
        }
        try {
            Uri u = FileProvider.getUriForFile(this, getPackageName() + ".files", f);
            Intent i = new Intent(Intent.ACTION_VIEW);
            i.setDataAndType(u, "application/vnd.android.package-archive");
            i.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(i);
        } catch (Exception e) {
            toast("نصب باز نشد");
        }
    }

    /* ---------- JS bridge ---------- */
    class Bridge {
        @JavascriptInterface
        public boolean pxOk() {
            return true;
        }

        @JavascriptInterface
        public void fullscreen(final boolean on, final boolean land) {
            ui.post(() -> {
                fsOn = on;
                immersive(on, land);
            });
        }

        @JavascriptInterface
        public String version() {
            return BuildConfig.VERSION_NAME;
        }

        @JavascriptInterface
        public int versionCode() {
            return BuildConfig.VERSION_CODE;
        }

        @JavascriptInterface
        public void schedule(String json) {
            if (Build.VERSION.SDK_INT >= 33 && !has(Manifest.permission.POST_NOTIFICATIONS)) reqNotif();
            Sched.apply(getApplicationContext(), json);
        }

        @JavascriptInterface
        public boolean autoBackup(String json) {
            return writeBackup(json);
        }

        @JavascriptInterface
        public void bioAuth(String mode) {
            ui.post(() -> doBio(mode));
        }

        @JavascriptInterface
        public void widget(String json) {
            getSharedPreferences("mg", MODE_PRIVATE).edit().putString("widget", json).apply();
            try { LCWidget.updateAll(getApplicationContext()); } catch (Exception ignored) { }
        }

        @JavascriptInterface
        public String takeActions() {
            SharedPreferences sp = getSharedPreferences("mg", MODE_PRIVATE);
            String a = sp.getString("acts", "[]");
            sp.edit().putString("acts", "[]").apply();
            return a;
        }

        @JavascriptInterface
        public String lastCrash() {
            SharedPreferences sp = getSharedPreferences("mg", MODE_PRIVATE);
            String c = sp.getString("crash", "");
            sp.edit().remove("crash").apply();
            return c;
        }

        @JavascriptInterface
        public void setBars(String status, String nav, boolean lightIcons) {
            ui.post(() -> {
                try {
                    android.view.Window w = getWindow();
                    w.setStatusBarColor(Color.parseColor(status));
                    w.setNavigationBarColor(Color.parseColor(nav));
                    View d = w.getDecorView();
                    int f = d.getSystemUiVisibility();
                    if (Build.VERSION.SDK_INT >= 23) f = lightIcons ? (f | View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR) : (f & ~View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
                    if (Build.VERSION.SDK_INT >= 26) f = lightIcons ? (f | View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR) : (f & ~View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR);
                    d.setSystemUiVisibility(f);
                } catch (Exception ignored) {
                }
            });
        }

        @JavascriptInterface
        public void startUpdate(String url) {
            ui.post(() -> downloadWeb(url));
        }

        @JavascriptInterface
        public void checkUpdate() {
            ui.post(() -> MainActivity.this.checkUpdate(true));
        }

        @JavascriptInterface
        public void share(String text) {
            ui.post(() -> {
                Intent i = new Intent(Intent.ACTION_SEND);
                i.setType("text/plain");
                i.putExtra(Intent.EXTRA_TEXT, text);
                startActivity(Intent.createChooser(i, "اشتراک‌گذاری"));
            });
        }

        @JavascriptInterface
        public void openUrl(String u) {
            ui.post(() -> openExternal(Uri.parse(u)));
        }

        @JavascriptInterface
        public void reqNotif() {
            if (askedNotif) return;
            askedNotif = true;
            if (Build.VERSION.SDK_INT >= 33 && !has(Manifest.permission.POST_NOTIFICATIONS))
                ui.post(() -> requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS}, RQ_NOTIF));
        }

        @JavascriptInterface
        public void notify(String title, String body) {
            if (Build.VERSION.SDK_INT >= 33 && !has(Manifest.permission.POST_NOTIFICATIONS)) {
                reqNotif();
                return;
            }
            Intent it = new Intent(MainActivity.this, MainActivity.class);
            it.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
            PendingIntent pi = PendingIntent.getActivity(MainActivity.this, 0, it, PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
            NotificationCompat.Builder nb = new NotificationCompat.Builder(MainActivity.this, CH)
                    .setSmallIcon(R.mipmap.ic_launcher)
                    .setContentTitle(title)
                    .setContentText(body)
                    .setStyle(new NotificationCompat.BigTextStyle().bigText(body))
                    .setAutoCancel(true)
                    .setContentIntent(pi)
                    .setPriority(NotificationCompat.PRIORITY_HIGH);
            try {
                NotificationManagerCompat.from(MainActivity.this).notify(notifId++, nb.build());
            } catch (SecurityException ignored) {
            }
        }

        @JavascriptInterface
        public void shareFile(String name, String mime, String b64) {
            try {
                byte[] data = Base64.decode(b64, Base64.DEFAULT);
                File dir = new File(getCacheDir(), "share");
                dir.mkdirs();
                File f = new File(dir, name.replaceAll("[^A-Za-z0-9._-]", "_"));
                try (OutputStream os = new FileOutputStream(f)) {
                    os.write(data);
                }
                final Uri fu = FileProvider.getUriForFile(MainActivity.this, getPackageName() + ".files", f);
                ui.post(() -> {
                    Intent i = new Intent(Intent.ACTION_SEND);
                    i.setType(mime);
                    i.putExtra(Intent.EXTRA_STREAM, fu);
                    i.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                    startActivity(Intent.createChooser(i, "ارسال پشتیبان به…"));
                });
            } catch (Exception e) {
                toast("ارسال فایل انجام نشد");
            }
        }

        @JavascriptInterface
        public void saveFile(String name, String mime, String b64) {
            try {
                byte[] data = Base64.decode(b64, Base64.DEFAULT);
                if (Build.VERSION.SDK_INT >= 29) {
                    android.content.ContentValues cv = new android.content.ContentValues();
                    cv.put(MediaStore.MediaColumns.DISPLAY_NAME, name);
                    cv.put(MediaStore.MediaColumns.MIME_TYPE, mime);
                    cv.put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS + "/LunarCycle");
                    Uri u = getContentResolver().insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, cv);
                    try (OutputStream os = getContentResolver().openOutputStream(u)) {
                        os.write(data);
                    }
                    toast("ذخیره شد: Download/LunarCycle/" + name);
                    final Uri fu = u;
                    ui.post(() -> offerOpen(fu, mime));
                } else {
                    File f = new File(getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS), name);
                    try (OutputStream os = new FileOutputStream(f)) {
                        os.write(data);
                    }
                    final Uri fu = FileProvider.getUriForFile(MainActivity.this, getPackageName() + ".files", f);
                    toast("ذخیره شد");
                    ui.post(() -> offerOpen(fu, mime));
                }
            } catch (Exception e) {
                toast("ذخیره‌ی فایل انجام نشد");
            }
        }
    }

    boolean writeBackup(String json) {
        try {
            byte[] data = json.getBytes("UTF-8");
            SharedPreferences sp = getSharedPreferences("mg", MODE_PRIVATE);
            if (Build.VERSION.SDK_INT >= 29) {
                String saved = sp.getString("bkUri", null);
                if (saved != null) {
                    try (OutputStream os = getContentResolver().openOutputStream(Uri.parse(saved), "wt")) {
                        if (os != null) {
                            os.write(data);
                            return true;
                        }
                    } catch (Exception ignored) {
                    }
                }
                android.content.ContentValues cv = new android.content.ContentValues();
                cv.put(MediaStore.MediaColumns.DISPLAY_NAME, "LunarCycle-backup.json");
                cv.put(MediaStore.MediaColumns.MIME_TYPE, "application/json");
                cv.put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS + "/LunarCycle");
                Uri u = getContentResolver().insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, cv);
                if (u == null) return false;
                try (OutputStream os = getContentResolver().openOutputStream(u)) {
                    os.write(data);
                }
                sp.edit().putString("bkUri", u.toString()).apply();
                return true;
            } else {
                File f = new File(getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS), "LunarCycle-backup.json");
                try (OutputStream os = new FileOutputStream(f)) {
                    os.write(data);
                }
                return true;
            }
        } catch (Exception e) {
            return false;
        }
    }

    void doBio(final String mode) {
        if (Build.VERSION.SDK_INT < 28) {
            js("window.mgBio&&mgBio('" + mode + "',false,'اثر انگشت روی این نسخه‌ی اندروید پشتیبانی نمی‌شود')");
            return;
        }
        try {
            android.hardware.biometrics.BiometricPrompt.Builder b = new android.hardware.biometrics.BiometricPrompt.Builder(this)
                    .setTitle("Lunar cycle")
                    .setSubtitle(mode.equals("reg") ? "برای فعال کردن ورود با اثر انگشت تأیید کن" : "برای باز کردن برنامه");
            if (Build.VERSION.SDK_INT >= 30) {
                b.setAllowedAuthenticators(android.hardware.biometrics.BiometricManager.Authenticators.BIOMETRIC_WEAK | android.hardware.biometrics.BiometricManager.Authenticators.DEVICE_CREDENTIAL);
            } else if (Build.VERSION.SDK_INT == 29) {
                b.setDeviceCredentialAllowed(true);
            } else {
                b.setNegativeButton("استفاده از رمز", getMainExecutor(), (d, w) -> js("window.mgBio&&mgBio('" + mode + "',false,'')"));
            }
            b.build().authenticate(new android.os.CancellationSignal(), getMainExecutor(), new android.hardware.biometrics.BiometricPrompt.AuthenticationCallback() {
                @Override
                public void onAuthenticationSucceeded(android.hardware.biometrics.BiometricPrompt.AuthenticationResult r) {
                    js("window.mgBio&&mgBio('" + mode + "',true,'')");
                }

                @Override
                public void onAuthenticationError(int code, CharSequence msg) {
                    js("window.mgBio&&mgBio('" + mode + "',false," + JSONObject.quote(mode.equals("reg") ? String.valueOf(msg) : "") + ")");
                }
            });
        } catch (Exception e) {
            js("window.mgBio&&mgBio('" + mode + "',false,'قفل صفحه‌ی گوشی (اثر انگشت یا رمز) را اول تنظیم کن')");
        }
    }

    void offerOpen(Uri u, String mime) {
        new AlertDialog.Builder(this).setMessage("فایل ذخیره شد. می‌خواهی آن را بفرستی یا باز کنی؟")
                .setPositiveButton("ارسال", (x, y) -> {
                    Intent i = new Intent(Intent.ACTION_SEND);
                    i.setType(mime);
                    i.putExtra(Intent.EXTRA_STREAM, u);
                    i.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                    startActivity(Intent.createChooser(i, "ارسال فایل"));
                })
                .setNeutralButton("باز کردن", (x, y) -> {
                    try {
                        Intent i = new Intent(Intent.ACTION_VIEW);
                        i.setDataAndType(u, mime);
                        i.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                        startActivity(i);
                    } catch (Exception e) {
                        toast("برنامه‌ای برای باز کردن پیدا نشد");
                    }
                })
                .setNegativeButton("بستن", null).show();
    }
}
