package ir.arvanping.mahghasi;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

public class BootReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context c, Intent in) {
        String j = c.getSharedPreferences("mg", Context.MODE_PRIVATE).getString("alarms", null);
        if (j != null) Sched.apply(c, j);
    }
}
