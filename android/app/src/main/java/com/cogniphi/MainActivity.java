package com.cogniphi;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.zoontek.rnbootsplash.RNBootSplash;
import android.app.PictureInPictureParams;
import android.os.Build;
import android.util.Rational;
import android.os.Bundle;
import android.widget.Toast;

public class MainActivity extends ReactActivity {
  public static long tripId = 0L;
  public static long driverId = 0L;
  public static long vehicleId = 0L;
  PictureInPictureParams.Builder pipBuilder = null;
  /**
   * Returns the name of the main component registered from JavaScript. This is
   * used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "cogniphi";
  }

  /*
   * React native Screen which at the moment has a problem with instantiating fragments and To avoid that set super.onCreate to null.
   * Refer 01:https://stackoverflow.com/questions/57709742/unable-to-instantiate-fragment-com-swmansion-rnscreens-screen
   * Refer 02:https://github.com/software-mansion/react-native-screens/issues/17#issuecomment-424704067
   */
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    //Below Try 01: Resolved Fragment Inconsistency but Retain Last Screen broken
    //super.onCreate(null);

    //Below Try 02: Improvise by remove only specific Fragments
    if (savedInstanceState != null) {
      savedInstanceState.remove("android:support:fragments");
      savedInstanceState.remove("android:fragments");
    }
    super.onCreate(savedInstanceState);
  }

  @Override
  protected void onSaveInstanceState(Bundle outState) {
    super.onSaveInstanceState(outState);
    if (outState != null)
    {
      outState.clear();
    }
  }

  // @Override
  // protected void onUserLeaveHint() {
  //   super.onUserLeaveHint();
  //   if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
  //     enterPictureInPictureMode(createPictureInPictureParams());
  //   }
  // }

  // private PictureInPictureParams createPictureInPictureParams() {
  //   if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
  //     pipBuilder = new  PictureInPictureParams.Builder();
  //     // Set the aspect ratio for the PiP window (e.g., 16:9)
  //     Rational aspectRatio = new Rational(16, 9);
  //     pipBuilder.setAspectRatio(aspectRatio);
  //     if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
  //       pipBuilder.setAutoEnterEnabled(true);
  //     }
  //     else {
  //       Toast.makeText(MainActivity.this, "PIP Supported in Android Snow Cone or Above", Toast.LENGTH_LONG).show();
  //     }
  //     return pipBuilder.build();
  //   }
  //   else {
  //     Toast.makeText(MainActivity.this, "PIP Supported in Android Oreo or Above", Toast.LENGTH_LONG).show();
  //     return null;
  //   }
  // }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. There the RootView
   * is created and
   * you can specify the renderer you wish to use - the new renderer (Fabric) or
   * the old renderer
   * (Paper).
   */

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new MainActivityDelegate(this, getMainComponentName());
  }

  public static class MainActivityDelegate extends ReactActivityDelegate {
    public MainActivityDelegate(ReactActivity activity, String mainComponentName) {
      super(activity, mainComponentName);
    }

    @Override
    protected ReactRootView createRootView() {
      ReactRootView reactRootView = new ReactRootView(getContext());
      // If you opted-in for the New Architecture, we enable the Fabric Renderer.
      reactRootView.setIsFabric(BuildConfig.IS_NEW_ARCHITECTURE_ENABLED);
      return reactRootView;
    }

    @Override
    protected boolean isConcurrentRootEnabled() {
      // If you opted-in for the New Architecture, we enable Concurrent Root (i.e.
      // React 18).
      // More on this on https://reactjs.org/blog/2022/03/29/react-v18.html
      return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
    }

    @Override
    protected void loadApp(String appKey) {
      RNBootSplash.init(getPlainActivity()); // <- initialize the splash screen
      super.loadApp(appKey);
    }

  }
}
