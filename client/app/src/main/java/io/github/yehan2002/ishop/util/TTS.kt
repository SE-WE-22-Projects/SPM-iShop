package io.github.yehan2002.ishop.util

import android.speech.tts.TextToSpeech
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import io.github.yehan2002.ishop.MainActivity.Companion.TAG
import java.util.Locale

class TTS(private val activity: AppCompatActivity) {
    private lateinit var textToSpeechEngine: TextToSpeech

    init {
        textToSpeechEngine = TextToSpeech(
            activity
        ) { status ->
            if (status == TextToSpeech.SUCCESS) {
                textToSpeechEngine.language = Locale.US
            }
        }
    }

    /**
     * Plays the given text as a TTS message.
     * If flush is true, any pending messages are canceled before playing the current message.
     */
    fun say(text: String, flush: Boolean = true) {
        activity.runOnUiThread {
            textToSpeechEngine.speak(
                text,
                if (flush) TextToSpeech.QUEUE_FLUSH else TextToSpeech.QUEUE_ADD,
                null,
                TAG
            )

            Toast.makeText(
                activity,
                text,
                Toast.LENGTH_SHORT
            ).show()
        }
    }

    /**
     * Stops the current tts message and clears the queue
     */
    fun stop() {
        textToSpeechEngine.stop()
    }

    /**
     * Shuts down the TTS engine. This must be called in the onDestroy method of the activity
     */
    fun shutdown() {
        textToSpeechEngine.shutdown()
    }
}