package ir.arvanping.mahghasi;

import android.Manifest;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;

import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

public class AlarmReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context c, Intent in) {
        String title = in.getStringExtra("title");
        String body = in.getStringExtra("body");
        if (body == null) return;
        if (Build.VERSION.SDK_INT >= 33 && c.checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) return;
        Sched.channel(c);
        Intent open = new Intent(c, MainActivity.class);
        open.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        PendingIntent pi = PendingIntent.getActivity(c, 0, open, PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
        NotificationCompat.Builder b = new NotificationCompat.Builder(c, MainActivity.CH)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle(title == null ? "Lunar cycle" : title)
                .setContentText(body)
                .setStyle(new NotificationCompat.BigTextStyle().bigText(body))
                .setAutoCancel(true)
                .setContentIntent(pi)
                .setPriority(NotificationCompat.PRIORITY_HIGH);
        int nid = in.getIntExtra("nid", (int) (System.currentTimeMillis() % 100000));
        String act = in.getStringExtra("act");
        if (act != null && !act.isEmpty()) {
            Intent ai = new Intent(c, ActionReceiver.class);
            ai.setAction("ir.arvanping.mahghasi.ACT." + nid);
            ai.putExtra("act", act);
            ai.putExtra("nid", nid);
            PendingIntent api = PendingIntent.getBroadcast(c, nid, ai, PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
            String al = in.getStringExtra("al");
            b.addAction(0, al == null || al.isEmpty() ? "ثبت" : al, api);
        }
        try {
            NotificationManagerCompat.from(c).notify(nid, b.build());
        } catch (SecurityException ignored) { }
    }
}
