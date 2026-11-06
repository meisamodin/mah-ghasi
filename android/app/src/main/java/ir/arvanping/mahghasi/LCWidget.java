package ir.arvanping.mahghasi;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.widget.RemoteViews;

import org.json.JSONObject;

import java.util.Calendar;

public class LCWidget extends AppWidgetProvider {
    @Override
    public void onUpdate(Context c, AppWidgetManager m, int[] ids) {
        render(c, m, ids);
    }

    static String fa(String s) {
        StringBuilder b = new StringBuilder();
        for (char ch : s.toCharArray()) b.append(ch >= '0' && ch <= '9' ? (char) ('۰' + (ch - '0')) : ch);
        return b.toString();
    }

    static long day0(long ms) {
        Calendar k = Calendar.getInstance();
        k.setTimeInMillis(ms);
        k.set(Calendar.HOUR_OF_DAY, 12);
        k.set(Calendar.MINUTE, 0);
        k.set(Calendar.SECOND, 0);
        k.set(Calendar.MILLISECOND, 0);
        return k.getTimeInMillis();
    }

    static void updateAll(Context c) {
        AppWidgetManager m = AppWidgetManager.getInstance(c);
        int[] ids = m.getAppWidgetIds(new ComponentName(c, LCWidget.class));
        if (ids != null && ids.length > 0) render(c, m, ids);
    }

    static void render(Context c, AppWidgetManager m, int[] ids) {
        SharedPreferences sp = c.getSharedPreferences("mg", Context.MODE_PRIVATE);
        String big = "🌙", sm = "Lunar cycle", sub = "برای شروع برنامه را باز کن";
        boolean blue = false;
        try {
            JSONObject o = new JSONObject(sp.getString("widget", "{}"));
            blue = o.optInt("sp", 0) == 1;
            String st = o.optString("s", "");
            if (!st.isEmpty()) {
                String[] p = st.split("-");
                Calendar k = Calendar.getInstance();
                k.set(Integer.parseInt(p[0]), Integer.parseInt(p[1]) - 1, Integer.parseInt(p[2]), 12, 0, 0);
                long diff = Math.round((day0(System.currentTimeMillis()) - day0(k.getTimeInMillis())) / 86400000.0);
                int C = Math.max(15, o.optInt("c", 28)), P = Math.max(1, o.optInt("p", 5));
                String mode = o.optString("m", "n"), nm = o.optString("n", "");
                String who = nm.isEmpty() ? "" : " " + nm;
                if (mode.equals("preg")) {
                    big = fa(String.valueOf(Math.max(0, diff / 7)));
                    sm = "هفته‌ی بارداری" + who;
                    sub = "Lunar cycle";
                } else if (mode.equals("meno") || mode.equals("baby")) {
                    big = mode.equals("baby") ? "👶" : "🌿";
                    sm = "Lunar cycle";
                    sub = "";
                } else if (diff < 0) {
                    sub = "Lunar cycle";
                } else if (diff < P) {
                    big = fa(String.valueOf(diff + 1));
                    sm = "روز پریود" + who;
                    sub = "روز " + fa(String.valueOf(diff + 1)) + " چرخه";
                } else if (diff >= C) {
                    big = fa(String.valueOf(diff - C + 1));
                    sm = "روز تأخیر" + who;
                    sub = "اگر شروع شد، ثبتش کن";
                } else {
                    big = fa(String.valueOf(C - diff));
                    sm = "روز تا پریود" + who;
                    sub = "روز " + fa(String.valueOf(diff + 1)) + " از " + fa(String.valueOf(C));
                }
            }
        } catch (Exception ignored) { }
        Intent open = new Intent(c, MainActivity.class);
        PendingIntent pi = PendingIntent.getActivity(c, 7, open, PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
        for (int id : ids) {
            RemoteViews v = new RemoteViews(c.getPackageName(), R.layout.widget_lc);
            v.setInt(R.id.w_root, "setBackgroundResource", blue ? R.drawable.wbg_blue : R.drawable.wbg_pink);
            v.setTextViewText(R.id.w_big, big);
            v.setTextViewText(R.id.w_sm, sm);
            v.setTextViewText(R.id.w_sub, sub);
            v.setOnClickPendingIntent(R.id.w_root, pi);
            m.updateAppWidget(id, v);
        }
    }
}
