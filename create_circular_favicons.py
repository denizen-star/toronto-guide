#!/usr/bin/env python3
"""
Create Circular Favicons using PIL
Generates circular PNG favicons that look great in dark mode
"""

try:
    from PIL import Image, ImageDraw
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False

import os
import sys

def create_circular_image(input_path, output_path, size):
    """Create a circular image with transparent background"""
    global PIL_AVAILABLE
    
    if not PIL_AVAILABLE:
        print("❌ PIL (Pillow) not available. Installing...")
        import subprocess
        subprocess.run([sys.executable, "-m", "pip", "install", "Pillow"])
        try:
            from PIL import Image, ImageDraw
            PIL_AVAILABLE = True
        except ImportError:
            return False
    
    try:
        # Open and resize the original image
        with Image.open(input_path) as img:
            # Convert to RGBA for transparency
            img = img.convert('RGBA')
            
            # Resize to target size
            img = img.resize((size, size), Image.Resampling.LANCZOS)
            
            # Create a transparent image for the output
            output = Image.new('RGBA', (size, size), (0, 0, 0, 0))
            
            # Create a circular mask
            mask = Image.new('L', (size, size), 0)
            draw = ImageDraw.Draw(mask)
            draw.ellipse((0, 0, size, size), fill=255)
            
            # Apply the mask to make it circular
            output.paste(img, (0, 0))
            output.putalpha(mask)
            
            # Save the circular image
            output.save(output_path, 'PNG')
            return True
            
    except Exception as e:
        print(f"❌ Error creating circular image: {e}")
        return False

def main():
    """Generate circular favicons"""
    
    # Paths
    input_image = "/Users/kervinleacock/Documents/Development/LifePlanner/assets/branding/rainbow_logo/rainbow logo.jpg"
    static_dir = "/Users/kervinleacock/Documents/Development/LifePlanner/static/favicons"
    
    # Ensure directories exist
    os.makedirs(static_dir, exist_ok=True)
    
    # Favicon sizes to create
    sizes = [16, 32, 48]
    
    print("🌈 Creating Circular Favicons for Dark Mode...")
    print(f"📁 Input: {input_image}")
    print(f"📁 Output: {static_dir}")
    print()
    
    if not PIL_AVAILABLE:
        print("📦 Installing Pillow for image processing...")
    
    success_count = 0
    for size in sizes:
        output_path = os.path.join(static_dir, f"favicon-{size}x{size}.png")
        print(f"🔄 Creating {size}×{size} circular favicon...")
        
        if create_circular_image(input_image, output_path, size):
            print(f"✅ Created: {output_path}")
            success_count += 1
        else:
            print(f"❌ Failed: {output_path}")
    
    # Create favicon.ico from the 32x32 version if possible
    if success_count > 0:
        favicon_32 = os.path.join(static_dir, "favicon-32x32.png")
        favicon_ico = os.path.join(static_dir, "favicon.ico")
        
        if os.path.exists(favicon_32):
            try:
                with Image.open(favicon_32) as img:
                    img.save(favicon_ico, 'ICO', sizes=[(32, 32)])
                    print(f"✅ Created: {favicon_ico}")
            except Exception as e:
                print(f"❌ Error creating favicon.ico: {e}")
    
    print()
    print(f"🎉 Successfully created {success_count}/{len(sizes)} circular favicons!")
    print()
    print("🔄 The circular favicons are now active on your server!")
    print("🌙 They will look great in dark mode with transparent circular shape.")
    print("🌐 Refresh http://localhost:8082 to see the new circular favicon!")

if __name__ == "__main__":
    main()
