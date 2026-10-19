# 角色图

仓库自带一张小克 Q 版半身图（`assets/xiaoke-bust.png`，CC BY-NC-SA 4.0，见 [CHARACTER-NOTICE](../assets/CHARACTER-NOTICE.txt)）。
想换成别的角色时，按下面的规格准备一张，覆盖 `assets\xiaoke-bust.png`，再重新运行 `install.cmd`。

如果新图改编自别人的作品，记得遵守原作的许可并更新署名。

## 规格

和 GPT-Niang 的龙娘图一致，换上去就能用：

- **正方形 1254×1254 PNG，真透明背景**（带 alpha 通道，不是白底或棋盘格）。
- Q 版大头半身：头和头发占满大部分画面，边距很小，底边裁在胸口上方。
- 几乎正面，只带一点点歪头。贴左边时挂件会**左右镜像**，所以画面上不要有文字。
- 透明区域会被当成“点不到”的地方，所以发丝外围不要留白边。

## 用图像模型生成

准备好角色设定图（正面 / 侧面 / 背面），再加一张画风参考（例如 GPT-Niang 的 `gpt-dragon-niang-bust.png`），按顺序上传，然后发下面这段。
把 `Draw the character…` 那一段换成你的角色特征即可。

```
Use case: character re-skin for a desktop widget sprite. Produce ONE new image.

Image 1 is the STYLE AND COMPOSITION reference only: a chibi big-head bust. Copy its art style exactly: chibi proportions with a very large head, thick clean dark outlines, flat cel shading with only one soft shadow tone, pastel highlights, half-lidded calm eyes with large glossy irises, two small diagonal blush strokes on one cheek, and NO MOUTH AT ALL (the skin between nose and chin is smooth and blank, no line, no dot, no lips). Copy its framing: near square canvas, head and hair fill most of the frame with minimal margin, head is almost front-facing with only a small subtle tilt, and the bottom edge crops at the upper chest. Long hair spreads out wide on both sides down to the bottom edge. Transparent background.

Images 2, 3 and 4 are the CHARACTER reference (front, side and back views of the same girl). Do NOT use the style reference's identity, hair colour, accessories or palette.

Draw the character from images 2–4 as that chibi bust:
- Hair: very long straight vivid orange hair (warm tangerine, around #E8763A), wispy bangs, long side locks framing the face. Outline the hair in deep warm brown.
- Hair ornament on the right side of the image: a large orange sunburst flower with a glossy amber-gold center, a black ribbon bow beneath it and a short white ribbon tail ending in a small gold tassel.
- Eyes: warm amber / golden-brown irises, half-lidded calm expression. Pale skin.
- Clothes visible at the upper chest: a white high ruffled collar, a small orange sunburst brooch at the throat, a black cravat with thin gold trim over a white ruffled jabot, and the shoulders of a white gold-trimmed capelet.
- Palette: orange, white/ivory, black and gold. Outlines in deep warm brown (around #3B2A24).

Output: square 1254x1254 PNG with a fully transparent background (real alpha, no white or checkerboard background, no drop shadow, no frame). No text, no watermark, no extra objects.
```

想让她拿书，可以在第二轮补一句：

```
Keep this image exactly as it is. Add ONE thing: she holds a small closed hardcover book with a dark reddish-brown leather cover, thin gold border lines and a small orange sunburst emblem (no text anywhere). Her small chibi hand in a white glove holds it upright against her chest on the lower left, so only the upper half of the book rises into the frame from the bottom edge. It must not cover her face, the collar flower or the cravat. Keep the transparent background.
```

下载时请保存原始 PNG，不要截图（截图会丢失透明背景）。
