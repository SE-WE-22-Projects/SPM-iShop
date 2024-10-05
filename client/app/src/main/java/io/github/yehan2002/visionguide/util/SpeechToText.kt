package io.github.yehan2002.visionguide.util

import android.content.Intent
import android.os.Bundle
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import io.github.yehan2002.visionguide.MainActivity.Companion.TAG

class SpeechToText(
    private val activity: AppCompatActivity,
    private val handler: (ArrayList<String>?) -> Unit
) {


    private lateinit var speechRecognizer: SpeechRecognizer

    init {
        // Get SpeechRecognizer instance
        if (!SpeechRecognizer.isRecognitionAvailable(activity)) {
            Log.e(TAG, "Not supported")
        }

        speechRecognizer = SpeechRecognizer.createSpeechRecognizer(activity)

        speechRecognizer.setRecognitionListener(object : RecognitionListener {
            override fun onReadyForSpeech(params: Bundle?) {}

            override fun onBeginningOfSpeech() {}

            override fun onRmsChanged(rmsdB: Float) {}

            override fun onBufferReceived(buffer: ByteArray?) {}

            override fun onEndOfSpeech() {}

            override fun onError(error: Int) {
                Log.d(TAG, "Speech recognizer error: $error")
                handler(null)
            }


            override fun onResults(results: Bundle) {
                val data: ArrayList<String>? =
                    results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                handler(data)
                Log.d(TAG, "Speech recognition results received: $data")
            }

            override fun onPartialResults(partialResults: Bundle?) {
            }

            override fun onEvent(eventType: Int, params: Bundle?) {
            }
        })
    }

    fun startListening() {
        val recognizerIntent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH)
        recognizerIntent.putExtra(
            RecognizerIntent.EXTRA_LANGUAGE_MODEL,
            RecognizerIntent.LANGUAGE_MODEL_WEB_SEARCH
        )

        speechRecognizer.startListening(recognizerIntent)
    }

}
