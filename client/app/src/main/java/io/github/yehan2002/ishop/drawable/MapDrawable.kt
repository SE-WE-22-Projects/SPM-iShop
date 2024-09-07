package io.github.yehan2002.ishop.drawable

import android.graphics.Canvas
import android.graphics.ColorFilter
import android.graphics.PixelFormat
import android.graphics.drawable.Drawable
import io.github.yehan2002.ishop.map.StoreMap

class MapDrawable(private val storeMap: StoreMap) : Drawable() {
    override fun draw(canvas: Canvas) {
        for (x in 0..<storeMap.width.toInt()) {
            for (y in 0..<storeMap.height.toInt()) {
                storeMap.map[x][y];
            }
        }
    }

    override fun setAlpha(alpha: Int) {
//        TODO("Not yet implemented")
    }

    override fun setColorFilter(colorFilter: ColorFilter?) {
//        TODO("Not yet implemented")
    }

    @Deprecated("Deprecated in Java")
    override fun getOpacity(): Int = PixelFormat.TRANSLUCENT
}