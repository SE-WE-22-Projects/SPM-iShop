package io.github.yehan2002.ishop

import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.speech.tts.TextToSpeech
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
import io.github.yehan2002.ishop.navigation.MapObjects
import io.github.yehan2002.ishop.navigation.StoreNavigator
import io.github.yehan2002.ishop.net.ShopService
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import org.opencv.android.OpenCVLoader
import retrofit2.Retrofit
import retrofit2.converter.jackson.JacksonConverterFactory
import retrofit2.converter.scalars.ScalarsConverterFactory
import java.util.Locale
import kotlin.math.roundToInt


class MainActivity : AppCompatActivity(), StoreNavigator.NavigationHandler {
    private lateinit var viewBinding: ActivityMainBinding
    private lateinit var navigator: StoreNavigator
    private lateinit var shopService: ShopService

    private lateinit var textToSpeechEngine: TextToSpeech

    @RequiresApi(Build.VERSION_CODES.P)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        viewBinding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(viewBinding.root)

        // load openCV library
        if (!OpenCVLoader.initLocal()) {
            Log.e(TAG, "OpenCV initialization failed")
            (Toast.makeText(this, "OpenCV initialization failed", Toast.LENGTH_LONG)).show()
            finish()
        }

        navigator = StoreNavigator(this)

        val retrofit = Retrofit.Builder().baseUrl("http://192.168.8.156:5000")
            .addConverterFactory(ScalarsConverterFactory.create())
            .addConverterFactory(JacksonConverterFactory.create())
            .build()
        shopService = retrofit.create(ShopService::class.java)

        textToSpeechEngine = TextToSpeech(
            this
        ) { status ->
            if (status == TextToSpeech.SUCCESS) {
                textToSpeechEngine.language = Locale.US
            }
        }

        // Request camera permissions
        if (allPermissionsGranted()) {
            startCamera()
        } else {
            ActivityCompat.requestPermissions(
                this, REQUIRED_PERMISSIONS, REQUEST_CODE_PERMISSIONS
            )
        }

        viewBinding.viewFinder.setOnClickListener {
            this.onLocationClick()
        }

        viewBinding.appBar.setOnItemSelectedListener {
            when (it.itemId) {
                R.id.promo_btn -> this.onPromoClick()
                R.id.search_btn -> this.onSearchClick()
            }

            return@setOnItemSelectedListener true
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

    /**
     * Handles the user clicking anywhere on the screen to get the current location.
     * This method plays a TTS message that contains the current location.
     */
    private fun onLocationClick() {
        // check if the user is in a valid section
        if (navigator.section == MapObjects.UnknownSection) {
            tts(getString(R.string.tts_loc_error))
            return
        }

        tts(getString(R.string.tts_loc, navigator.section.name))
    }

    private fun onSearchClick() {
        Toast.makeText(this, "Search items", Toast.LENGTH_SHORT)
            .show()
        CoroutineScope(Dispatchers.IO).launch {
            Log.i(TAG, shopService.getMap())
        }
    }

    /**
     * Handles the user clicking the promotions button.
     * All promotions in the current section are played as TTS messages.
     */
    private fun onPromoClick() {
        CoroutineScope(Dispatchers.IO).launch {
            try {

                // check if the user is in a valid section
                if (navigator.section == MapObjects.UnknownSection) {
                    tts(getString(R.string.tts_loc_error))
                    return@launch
                }

                // get the promotions from the server
                val promos = shopService.getPromotions(navigator.section.sectionId)

                if (promos.promos.isEmpty()) {
                    // no promotions in the section
                    tts(getString(R.string.tts_promo_none))
                } else {
                    tts(getString(R.string.tts_promo_number, promos.promos.size))
                    for (promo in promos.promos) {
                        tts(promo, flush = false)
                    }
                }
            } catch (e: Exception) {
                Log.e(TAG, "Failed to get promotions", e)
                tts(getString(R.string.tts_promo_error))
            }
        }
    }

    override fun onSectionChange(section: MapObjects.Section, prevSection: MapObjects.Section) {
        Toast.makeText(this, "Section changed to ${section.name}", Toast.LENGTH_SHORT).show()
    }

    /**
     * Plays the given text as a TTS message.
     * If flush is true, any pending messages are canceled before playing the current message.
     */
    private fun tts(text: String, flush: Boolean = true) {
        runOnUiThread {
            textToSpeechEngine.speak(
                text,
                if (flush) TextToSpeech.QUEUE_FLUSH else TextToSpeech.QUEUE_ADD,
                null,
                TAG
            )

            Toast.makeText(
                this,
                text,
                Toast.LENGTH_SHORT
            ).show()
        }
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

    override fun onPause() {
        textToSpeechEngine.stop()
        super.onPause()
    }

    override fun onDestroy() {
        textToSpeechEngine.shutdown()
        super.onDestroy()
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
