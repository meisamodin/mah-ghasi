package ir.arvanping.mahghasi;

import android.app.AlarmManager;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;

import org.json.JSONArray;
import org.json.JSONObject;

public class Sched {
    static final int MAX = 150;

    static void channel(Context c) {
        if (Build.VERSION.SDK_INT >= 26) {
            NotificationChannel ch = new NotificationChannel(MainActivity.CH, "یادآوری‌ها", NotificationManager.IMPORTANCE_HIGH);
            ch.enableVibration(true);
            ((NotificationManager) c.getSystemService(Context.NOTIFICATION_SERVICE)).createNotificationChannel(ch);
        }
    }

    static PendingIntent pi(Context c, int i, String title, String body) {
        return pi(c, i, title, body, null, null);
    }

    static PendingIntent pi(Context c, int i, String title, String body, String act, String al) {
        Intent it = new Intent(c, AlarmReceiver.class);
        it.setAction("ir.arvanping.mahghasi.REMIND." + i);
        if (title != null) {
            it.putExtra("title", title);
            it.putExtra("body", body);
            it.putExtra("nid", 1000 + i);
            if (act != null && !act.isEmpty()) {
                it.putExtra("act", act);
                it.putExtra("al", al);
            }
        }
        return PendingIntent.getBroadcast(c, i, it, PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
    }

    static void apply(Context c, String json) {
        AlarmManager am = (AlarmManager) c.getSystemService(Context.ALARM_SERVICE);
        if (am == null) return;
        int old = c.getSharedPreferences("mg", Context.MODE_PRIVATE).getInt("alarmCount", MAX);
        for (int i = 0; i < Math.min(old, MAX); i++) {
            try { am.cancel(pi(c, i, null, null)); } catch (Exception ignored) { }
        }
        int n = 0;
        try {
            JSONArray a = new JSONArray(json == null ? "[]" : json);
            long now = System.currentTimeMillis();
            for (int i = 0; i < a.length() && n < MAX; i++) {
                JSONObject o = a.getJSONObject(i);
                long t = o.optLong("t", 0);
                if (t <= now) continue;
                PendingIntent p = pi(c, n, o.optString("title", "Lunar cycle"), o.optString("body", ""), o.optString("act", ""), o.optString("al", ""));
                if (Build.VERSION.SDK_INT >= 23) am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, t, p);
                else am.set(AlarmManager.RTC_WAKEUP, t, p);
                n++;
            }
        } catch (Exception ignored) { }
        c.getSharedPreferences("mg", Context.MODE_PRIVATE).edit().putString("alarms", json).putInt("alarmCount", n).apply();
    }
}
