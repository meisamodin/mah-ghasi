package ir.arvanping.mahghasi;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;

import androidx.core.app.NotificationManagerCompat;

import org.json.JSONArray;
import org.json.JSONObject;

public class ActionReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context c, Intent in) {
        String act = in.getStringExtra("act");
        int nid = in.getIntExtra("nid", 0);
        if (act != null) {
            SharedPreferences sp = c.getSharedPreferences("mg", Context.MODE_PRIVATE);
            try {
                JSONArray a = new JSONArray(sp.getString("acts", "[]"));
                JSONObject o = new JSONObject();
                o.put("act", act);
                o.put("at", System.currentTimeMillis());
                a.put(o);
                sp.edit().putString("acts", a.toString()).apply();
            } catch (Exception ignored) { }
        }
        try { NotificationManagerCompat.from(c).cancel(nid); } catch (Exception ignored) { }
    }
}
