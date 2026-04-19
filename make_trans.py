from PIL import Image
import numpy as np
import os

def remove_black(in_path, out_path):
    if not os.path.exists(in_path):
        return
    img = Image.open(in_path).convert("RGBA")
    data = np.array(img)
    rgb_max = np.max(data[:,:,:3], axis=2)
    alpha = np.clip((rgb_max.astype(float) - 10) * 10, 0, 255).astype(np.uint8)
    data[:,:,3] = alpha
    Image.fromarray(data).save(out_path)
    print(f"Processed {in_path}")

try:
    # First, restore originals if we ever overwrote them with black
    remove_black('public/branch.png', 'public/branch-trans.png')
    remove_black('public/frog-closed.png', 'public/frog-closed-trans.png')
    remove_black('public/frog-open.png', 'public/frog-open-trans.png')
except Exception as e:
    print(f"Error: {e}")
