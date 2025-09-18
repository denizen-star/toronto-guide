#!/usr/bin/env python3
"""
Create Circular Favicons - Simple Version
"""

import os
import sys
import subprocess

def install_pillow():
    """Install Pillow if not available"""
    try:
        import PIL
        return True
    except ImportError:
        print("📦 Installing Pillow...")
        subprocess.run([sys.executable, "-m", "pip", "install", "Pillow"], check=True)
        return True

def create_circular_favicon(input_path, output_path, size):
    """Create circular favicon"""
    from PIL import Image, ImageDraw
    
    # Open the original image
    with Image.open(input_path) as img:
        # Convert to RGBA for transparency support
        img = img.convert('RGBA')
        
        # Resize to target size
        img = img.resize((size, size), Image.Resampling.LANCZOS)
        
        # Create a new transparent image
        output = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        
        # Create circular mask
        mask = Image.new('L', (size, size), 0)
        draw = ImageDraw.Draw(mask)
        draw.ellipse((0, 0, size, size), fill=255)
        
        # Apply circular mask
        output.paste(img, (0, 0))
        output.putalpha(mask)
        
        # Save as PNG
        output.save(output_path, 'PNG')
        return True

def main():
    # Install Pillow if needed
    if not install_pillow():
        print("❌ Failed to install Pillow")
        return
    
    # Paths
    input_image = "/Users/kervinleacock/Documents/Development/LifePlanner/assets/branding/rainbow_logo/rainbow logo.jpg"
    output_dir = "/Users/kervinleacock/Documents/Development/LifePlanner/static/favicons"
    
    # Sizes to create
    sizes = [16, 32, 48]
    
    print("🌈 Creating Circular Favicons...")
    
    success = 0
    for size in sizes:
        output_path = os.path.join(output_dir, f"favicon-{size}x{size}.png")
        try:
            create_circular_favicon(input_image, output_path, size)
            print(f"✅ Created {size}×{size} circular favicon")
            success += 1
        except Exception as e:
            print(f"❌ Failed {size}×{size}: {e}")
    
    # Create favicon.ico
    if success > 0:
        try:
            from PIL import Image
            favicon_32 = os.path.join(output_dir, "favicon-32x32.png")
            favicon_ico = os.path.join(output_dir, "favicon.ico")
            
            with Image.open(favicon_32) as img:
                img.save(favicon_ico, 'ICO', sizes=[(32, 32)])
            print("✅ Created favicon.ico")
        except Exception as e:
            print(f"❌ Failed to create favicon.ico: {e}")
    
    print(f"\n🎉 Created {success} circular favicons!")
    print("🌐 Refresh http://localhost:8082 to see the circular favicon!")

if __name__ == "__main__":
    main()
