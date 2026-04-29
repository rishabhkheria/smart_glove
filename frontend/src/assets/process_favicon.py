from PIL import Image, ImageDraw
import sys

def process_logo(input_path, output_path):
    try:
        print(f"Processing {input_path}...")
        img = Image.open(input_path).convert("RGBA")
        
        # Make it a square
        min_dim = min(img.size)
        left = (img.width - min_dim) / 2
        top = (img.height - min_dim) / 2
        right = (img.width + min_dim) / 2
        bottom = (img.height + min_dim) / 2
        img = img.crop((left, top, right, bottom))
        
        # Resize down from 4MB size to a standard favicon size (256x256)
        img = img.resize((256, 256), Image.Resampling.LANCZOS)
        
        # Create circular mask
        mask = Image.new("L", img.size, 0)
        draw = ImageDraw.Draw(mask)
        draw.ellipse((0, 0) + img.size, fill=255)
        
        # Apply mask
        img.putalpha(mask)
        
        # Save
        img.save(output_path, "PNG")
        print(f"Successfully saved to {output_path}")
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    import os
    input_file = r"c:\Users\risha\OneDrive\Desktop\Smart Gloves\frontend\src\assets\logo.png"
    output_file = r"c:\Users\risha\OneDrive\Desktop\Smart Gloves\frontend\public\favicon.png"
    process_logo(input_file, output_file)
