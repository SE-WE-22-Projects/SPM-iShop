package io.github.yehan2002.visionguide

import android.os.Build
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Toast
import androidx.annotation.OptIn
import androidx.annotation.RequiresApi
import androidx.camera.camera2.interop.ExperimentalCamera2Interop
import androidx.camera.view.PreviewView
import io.github.yehan2002.visionguide.camera.CameraActivity
import io.github.yehan2002.visionguide.camera.CameraBridge
import io.github.yehan2002.visionguide.databinding.ActivityMainBinding
import io.github.yehan2002.visionguide.drawable.DebugInfoDrawable
import io.github.yehan2002.visionguide.drawable.MapDrawable
import io.github.yehan2002.visionguide.drawable.TagDrawable
import io.github.yehan2002.visionguide.navigation.MapObjects
import io.github.yehan2002.visionguide.navigation.StoreNavigator
import io.github.yehan2002.visionguide.net.OfflineData
import io.github.yehan2002.visionguide.net.ShopService
import io.github.yehan2002.visionguide.net.dto.Item
import io.github.yehan2002.visionguide.net.dto.MapData
import io.github.yehan2002.visionguide.util.Direction
import io.github.yehan2002.visionguide.util.TTS
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.Response
import org.opencv.android.OpenCVLoader
import retrofit2.Retrofit
import retrofit2.converter.jackson.JacksonConverterFactory
import retrofit2.converter.scalars.ScalarsConverterFactory
import kotlin.math.roundToInt


class MainActivity : CameraActivity(), StoreNavigator.NavigationHandler {
    private lateinit var viewBinding: ActivityMainBinding
    private lateinit var navigator: StoreNavigator
    private lateinit var shopService: ShopService

    private lateinit var tts: TTS

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

        tts = TTS(this)

        navigator = StoreNavigator(this)

        var serverUrls = intent.getStringArrayExtra("servers")
        var markerSize = intent.getDoubleExtra("size", 0.17)

        val isDev = serverUrls == null
        if (serverUrls == null) {
            serverUrls = arrayOf("http://192.168.8.156:5000")
        }

        navigator.setMarkerSize(markerSize)

        CoroutineScope(Dispatchers.IO).launch {
            val client = OkHttpClient()
            for (url in serverUrls) {

                try {
                    val serverURL = "http://$url:5000"
                    Log.i(TAG, "Checking URL $serverURL")

                    val request: Request = Request.Builder()
                        .url("$serverURL/api/test/204").get()
                        .build()

                    val call = client.newCall(request)
                    val response: Response = call.execute()

                    if (response.code() == 204) {
                        Log.i(TAG, "Found URL $serverURL")

                        val retrofit = Retrofit.Builder()
                            .baseUrl(serverURL)
                            .addConverterFactory(ScalarsConverterFactory.create())
                            .addConverterFactory(JacksonConverterFactory.create())
                            .build()

                        shopService = retrofit.create(ShopService::class.java)
                        loadShopMap()
                        return@launch
                    }
                } catch (e: Exception) {
                    Log.e(TAG, "Failed to connect", e)
                }
            }

            if (isDev) {
                runOnUiThread {
                    Toast.makeText(this@MainActivity, "Running in offline mode", Toast.LENGTH_SHORT)
                        .show()
                }


                shopService = OfflineData(this@MainActivity)
                loadShopMap()
            } else {
                tts.say(getString(R.string.tts_server_error))
                finish()
            }
        }

        startCamera()

        viewBinding.viewFinder.setOnClickListener {
            this.onLocationClick()
        }

        viewBinding.mapLoader.setOnClickListener {
            tts.say(getString(R.string.tts_map_loading))
        }

        viewBinding.appBar.setOnItemSelectedListener {
            when (it.itemId) {
                R.id.promo_btn -> this.onPromoClick()
                R.id.search_btn -> this.onSearchClick()
                R.id.navigate_btn -> this.onNavigateClick()
            }

            return@setOnItemSelectedListener true
        }

    }


    @RequiresApi(Build.VERSION_CODES.P)
    @OptIn(ExperimentalCamera2Interop::class)
    override fun onCameraStart() {
        val previewView: PreviewView = viewBinding.viewFinder
        val bridge = CameraBridge(this, previewView) { bridge, proxy ->
            val startTime = System.nanoTime()

            navigator.findMarkers(bridge, proxy)

            val tags = navigator.lastTags
            if (DISPLAY_TAGS && tags != null) {
                // display all detected tags as a overlay
                tags.forEach {
                    bridge.overlay.add(
                        TagDrawable(it)
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
                    "Section: ${navigator.section.name}(${navigator.section.sectionId})",
                    "Facing: ${navigator.userFacing}"
                )
            )


            // display the map
            bridge.overlay.add(
                MapDrawable(
                    navigator.shopMap,
                    navigator.position,
                    navigator.route,
                    navigator.target,
                    navigator.userFacing
                )
            )
        }
        bridge.start()
    }


    private fun loadShopMap() {
        CoroutineScope(Dispatchers.IO).launch {
            val map: MapData
            try {
                map = shopService.getMap()
            } catch (e: Exception) {
                tts.say(getString(R.string.tts_map_load_error))
                Log.e(TAG, "Failed to load shop map", e)
                return@launch
            }

            navigator.loadMap(map)

            runOnUiThread {
                viewBinding.mapLoader.visibility = View.GONE
                tts.say(getString(R.string.tts_map_load_ok))
            }
        }
    }

    /**
     * Handles the user clicking anywhere on the screen to get the current location.
     * This method plays a TTS message that contains the current location.
     */
    private fun onLocationClick() {
        // check if the user is in a valid section
        if (navigator.section == MapObjects.UnknownSection) {
            tts.say(getString(R.string.tts_loc_error))
            return
        }

        tts.say(getString(R.string.tts_loc, navigator.section.name))
    }

    private fun onSearchClick() {
        CoroutineScope(Dispatchers.IO).launch {

            val item: Item?
            try {
                item = shopService.searchItem("Laptop")
                if (item == null) {
                    tts.say(getString(R.string.tts_search_not_found))
                    return@launch
                }
            } catch (e: Exception) {
                tts.say(getString(R.string.tts_search_error))
                Log.e(TAG, "Failed to search", e)
                return@launch
            }

            val target = navigator.shopMap.getRackPosition(item.rackId)
            if (target == null) {
                tts.say(getString(R.string.tts_nav_no_route))
            }
            navigator.target = target

        }
    }

    private fun onNavigateClick() {
        if (navigator.target == null) {
            tts.say(getString(R.string.tts_nav_no_dest))
            return
        }
        val route = navigator.route
        val facing = navigator.userFacing

        if (facing == Direction.UNKNOWN) {
            tts.say(getString(R.string.tts_loc_error))
            return
        }

        if (route == null) {
            tts.say(getString(R.string.tts_nav_no_route))
            return
        }

        if (route.size < 2) {
            return
        }

        val travelDirection = route[0].direction(route[1])
        val start = route[0]
        var end = route[1]

        for (idx in route.indices) {
            if (idx == 0) continue

            if (start.direction(route[idx]) != travelDirection)
                break

            end = route[idx]
        }

        val distance = start.distance(end)

        val turn = facing.turnDirection(travelDirection)
        Log.i(TAG, "turn $turn $travelDirection $facing")

        when (turn) {
            Direction.Turn.NONE -> tts.say("Continue Straight for $distance meters")
            Direction.Turn.RIGHT -> tts.say("Turn Right and walk $distance meters")
            Direction.Turn.LEFT -> tts.say("Turn Left and walk $distance meters")
            Direction.Turn.AROUND -> tts.say("Turn Around and walk $distance meters")
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
                    tts.say(getString(R.string.tts_loc_error))
                    return@launch
                }

                // get the promotions from the server
                val promos = shopService.getPromotions(navigator.section.sectionId)

                if (promos.descriptions.isEmpty()) {
                    // no promotions in the section
                    tts.say(getString(R.string.tts_promo_none))
                } else {
                    tts.say(getString(R.string.tts_promo_number, promos.descriptions.size))
                    for (promo in promos.descriptions) {
                        tts.say(promo, flush = false)
                    }
                }
            } catch (e: Exception) {
                Log.e(TAG, "Failed to get promotions", e)
                tts.say(getString(R.string.tts_promo_error))
            }
        }
    }

    override fun onSectionChange(section: MapObjects.Section, prevSection: MapObjects.Section) {
        Toast.makeText(this, "Section changed to ${section.name}", Toast.LENGTH_SHORT).show()
    }

    override fun onDestinationReached() {
        tts.say(getString(R.string.tts_nav_complete))
    }

    override fun onRouteDirectionChange() {
        TODO("Not yet implemented")
    }

    override fun onPause() {
        tts.stop()
        super.onPause()
    }

    override fun onDestroy() {
        tts.shutdown()
        super.onDestroy()
    }

    companion object {
        const val TAG = "VG_Log"
        const val DISPLAY_TAGS = true
    }
}
