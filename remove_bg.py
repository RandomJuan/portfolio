from PIL import Image
import numpy as np

def remove_black(in_path, out_path):
    img = Image.open(in_path).convert("RGBA")
    data = np.array(img)
    rgb_max = np.max(data[:,:,:3], axis=2)
    # feather the alpha
    alpha = np.clip((rgb_max.astype(float) - 15) * 5, 0, 255).astype(np.uint8)
    data[:,:,3] = alpha
    Image.fromarray(data).save(out_path)

try:
    remove_black('public/frog-pano-wide.png', 'public/frog-pano-wide.png')
    remove_black('public/frog-pano-wide-open.png', 'public/frog-pano-wide-open.png')
    print("Background removed")
except Exception as e:
    print(f"Error: {e}")
