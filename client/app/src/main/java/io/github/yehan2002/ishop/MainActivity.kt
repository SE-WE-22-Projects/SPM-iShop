package io.github.yehan2002.ishop

import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.annotation.OptIn
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AppCompatActivity
import androidx.camera.camera2.interop.ExperimentalCamera2Interop
import androidx.camera.view.PreviewView
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import io.github.yehan2002.ishop.camera.CameraBridge
import io.github.yehan2002.ishop.databinding.ActivityMainBinding
import io.github.yehan2002.ishop.drawable.DebugInfoDrawable
import io.github.yehan2002.ishop.drawable.MapDrawable
import io.github.yehan2002.ishop.drawable.TagDrawable
import io.github.yehan2002.ishop.navigation.StoreNavigator
import org.opencv.android.OpenCVLoader
import kotlin.math.roundToInt


class MainActivity : AppCompatActivity() {
    private lateinit var viewBinding: ActivityMainBinding
    private lateinit var navigator: StoreNavigator

    @RequiresApi(Build.VERSION_CODES.P)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        viewBinding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(viewBinding.root)

        // load openCV library
        if (!OpenCVLoader.initLocal()) {
            Log.e(TAG, "OpenCV initialization failed")
            (Toast.makeText(this, "OpenCV initialization failed", Toast.LENGTH_LONG)).show()
            return
        }

        navigator = StoreNavigator()

        // Request camera permissions
        if (allPermissionsGranted()) {
            startCamera()
        } else {
            ActivityCompat.requestPermissions(
                this, REQUIRED_PERMISSIONS, REQUEST_CODE_PERMISSIONS
            )
        }


    }

    @RequiresApi(Build.VERSION_CODES.P)
    @OptIn(ExperimentalCamera2Interop::class)
    private fun startCamera() {
        val previewView: PreviewView = viewBinding.viewFinder
        val bridge = CameraBridge(this, previewView) { bridge, proxy ->
            val startTime = System.nanoTime()

            navigator.findMarkers(bridge, proxy)

            val tags = navigator.lastTags
            if (DISPLAY_TAGS && tags != null) {
                // display all detected tags as a overlay
                tags.forEach {
                    bridge.overlay.add(
                        TagDrawable(it, bridge.correctionMatrix)
                    )
                }
            }

            val processingTime = ((System.nanoTime() - startTime) / 1e6).roundToInt()

            // display the debug information overlay
            bridge.overlay.add(
                DebugInfoDrawable(
                    processingTime,
                    tags?.size ?: 0,
                    navigator.position,
                    "Tile: ${navigator.currentTile}",
                    "Section: ${navigator.section.name}(${navigator.section.sectionId})"
                )
            )


            // display the map
            bridge.overlay.add(
                MapDrawable(
                    navigator.shopMap,
                    navigator.position,
                    navigator.route
                )
            )
        }
        bridge.start()
    }


    private fun allPermissionsGranted() = REQUIRED_PERMISSIONS.all {
        ContextCompat.checkSelfPermission(
            baseContext, it
        ) == PackageManager.PERMISSION_GRANTED
    }


    @RequiresApi(Build.VERSION_CODES.P)
    @OptIn(ExperimentalCamera2Interop::class)
    override fun onRequestPermissionsResult(
        requestCode: Int, permissions: Array<String>, grantResults:
        IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == REQUEST_CODE_PERMISSIONS) {
            if (allPermissionsGranted()) {
                startCamera()
            } else {
                Toast.makeText(
                    this,
                    "Permissions not granted by the user.",
                    Toast.LENGTH_SHORT
                ).show()
                finish()
            }
        }
    }

    companion object {
        const val TAG = "IShop_Log"
        const val DISPLAY_TAGS = true

        private const val REQUEST_CODE_PERMISSIONS = 10
        private val REQUIRED_PERMISSIONS =
            mutableListOf(
                android.Manifest.permission.CAMERA,
            ).toTypedArray()
    }
}
