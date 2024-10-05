package io.github.yehan2002.visionguide.util

import android.widget.EditText
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity


fun TextDialog(activity: AppCompatActivity, title: String, handler: (String?) -> Unit) {
    val input = EditText(activity)

    AlertDialog.Builder(activity)
        .setTitle(title)
        .setView(input)
        .setPositiveButton(
            "Ok"
        ) { _, _ ->
            val text = input.text.toString()
            handler(text)
        }
        .setNegativeButton(
            "Cancel"
        ) { _, _ -> handler(null) }
        .show()
}