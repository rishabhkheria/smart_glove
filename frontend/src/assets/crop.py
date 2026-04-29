from PIL import Image, ImageDraw
import sys

def crop_to_circle(input_path, output_path):
    try:
        img = Image.open(input_path).convert("RGBA")
        
        # Crop to square
        min_dim = min(img.size)
        left = (img.width - min_dim)/2
        top = (img.height - min_dim)/2
        right = (img.width + min_dim)/2
        bottom = (img.height + min_dim)/2
        img = img.crop((left, top, right, bottom))
        
        # Create circular mask
        mask = Image.new("L", img.size, 0)
        draw = ImageDraw.Draw(mask)
        draw.ellipse((0, 0) + img.size, fill=255)
        
        # Apply mask
        img.putalpha(mask)
        
        # Save
        img.save(output_path)
        print("Success")
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    crop_to_circle("logo.png", "logo_circle.png")
