package com.boxmobileapp;
import android.os.Bundle;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;
import android.view.View;
import android.view.WindowManager;
import android.graphics.Color;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "BoxMobileApp";
  }
    @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    
    // Remove any fullscreen flags
    getWindow().clearFlags(
        WindowManager.LayoutParams.FLAG_FULLSCREEN |
        WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS |
        WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS
    );
    
    // Make status bar solid (not transparent)
    getWindow().setStatusBarColor(Color.parseColor("#2DBDEE"));
    
    // Force black icons and prevent system from overriding
    int flags = View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR |
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE;
    
    getWindow().getDecorView().setSystemUiVisibility(flags);
    
    // Prevent the window from adjusting resize
    getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_NOTHING);
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. Here we use a util class {@link
   * DefaultReactActivityDelegate} which allows you to easily enable Fabric and Concurrent React
   * (aka React 18) with two boolean flags.
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        // If you opted-in for the New Architecture, we enable the Fabric Renderer.
        DefaultNewArchitectureEntryPoint.getFabricEnabled());
  }

  @Override
  public void onWindowFocusChanged(boolean hasFocus) {
    super.onWindowFocusChanged(hasFocus);
    if (hasFocus) {
      // Reapply system UI flags when window gains focus
      int flags = View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR |
                  View.SYSTEM_UI_FLAG_LAYOUT_STABLE;
      getWindow().getDecorView().setSystemUiVisibility(flags);
    }
  }

  // Override onResume to ensure settings persist
  @Override
  protected void onResume() {
    super.onResume();
    int flags = View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR |
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE;
    getWindow().getDecorView().setSystemUiVisibility(flags);
  }
}
