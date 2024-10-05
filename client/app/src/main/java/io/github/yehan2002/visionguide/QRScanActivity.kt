package io.github.yehan2002.visionguide

import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.util.Log
import androidx.annotation.OptIn
import androidx.annotation.RequiresApi
import androidx.camera.core.ExperimentalGetImage
import androidx.camera.core.ImageCapture
import androidx.camera.view.CameraController
import androidx.camera.view.LifecycleCameraController
import androidx.camera.view.PreviewView
import androidx.core.content.ContextCompat
import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.google.mlkit.vision.barcode.BarcodeScannerOptions
import com.google.mlkit.vision.barcode.BarcodeScanning
import com.google.mlkit.vision.barcode.common.Barcode
import com.google.mlkit.vision.common.InputImage
import io.github.yehan2002.visionguide.MainActivity.Companion.TAG
import io.github.yehan2002.visionguide.camera.CameraActivity
import io.github.yehan2002.visionguide.databinding.ActivityQrscanBinding
import io.github.yehan2002.visionguide.util.TTS


class QRScanActivity : CameraActivity() {
    private lateinit var tts: TTS
    private lateinit var viewBinding: ActivityQrscanBinding
    private val mapper = jacksonObjectMapper()


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        viewBinding = ActivityQrscanBinding.inflate(layoutInflater)
        setContentView(viewBinding.root)

        viewBinding.main.setOnClickListener {
            tts.say(getString(R.string.tts_scan_qr))
        }

        tts = TTS(this)
        startCamera()
    }

    @RequiresApi(Build.VERSION_CODES.P)
    @OptIn(ExperimentalGetImage::class)
    override fun onCameraStart() {
        val previewView: PreviewView = viewBinding.viewFinder
        val cameraController = LifecycleCameraController(baseContext)
        cameraController.imageCaptureMode = ImageCapture.CAPTURE_MODE_MAXIMIZE_QUALITY
        cameraController.setEnabledUseCases(CameraController.IMAGE_ANALYSIS)

        val options = BarcodeScannerOptions.Builder()
            .setBarcodeFormats(Barcode.FORMAT_AZTEC or Barcode.FORMAT_QR_CODE)
            .build()

        cameraController.setImageAnalysisAnalyzer(
            ContextCompat.getMainExecutor(this)
        ) { proxy ->
            val mediaImage = proxy.image
            if (mediaImage != null) {
                val image = InputImage.fromMediaImage(mediaImage, proxy.imageInfo.rotationDegrees)

                val scanner = BarcodeScanning.getClient(options)
                scanner.process(image)
                    .addOnSuccessListener { barcodes ->
                        barcodes.forEach {
                            try {
                                if (onQRRead(it)) {
                                    proxy.close()
                                    cameraController.unbind()
                                    return@addOnSuccessListener
                                }

                            } catch (e: Exception) {
                                Log.e(TAG, "Failed to parse qr code", e)
                            }
                        }
                        proxy.close()
                    }
                    .addOnFailureListener {
                        Log.e(TAG, "Failed to get qrcode", it)
                        proxy.close()
                    }
            }
        }

        cameraController.bindToLifecycle(this)
        previewView.controller = cameraController
    }


    private fun onQRRead(code: Barcode): Boolean {
        if (code.format != Barcode.FORMAT_QR_CODE) return false
        val content = code.rawValue ?: return false

        val shopQR: ShopQR = mapper.readValue(content)
        if (shopQR.type != "SV") return false

        Log.d(TAG, "Found QR $shopQR")

        val intent = Intent(this, MainActivity::class.java)
        intent.putExtra("servers", shopQR.server.toTypedArray())
        intent.putExtra("size", shopQR.size)
        startActivity(intent)
        finish()
        return true
    }

    override fun onPause() {
        tts.stop()
        super.onPause()
    }

    override fun onDestroy() {
        tts.shutdown()
        super.onDestroy()
    }


    data class ShopQR(
        @JsonProperty("t") val type: String,
        @JsonProperty("i") val server: List<String>,
        @JsonProperty("ms") val size: Double = 0.06
    )
}