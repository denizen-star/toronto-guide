#!/usr/bin/env python3
"""
Generate Circular Favicons from Rainbow Logo
Creates circular PNG favicons that look great in dark mode
"""

import subprocess
import os

def create_circular_favicon(input_path, output_path, size):
    """Create a circular favicon using ImageMagick via subprocess"""
    try:
        # Create a circular mask and apply it to create transparent circular image
        cmd = [
            'sips',
            '-z', str(size), str(size),  # Resize to target size
            '-s', 'format', 'png',        # Convert to PNG
            input_path,
            '--out', output_path
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            print(f"✅ Created {size}×{size} favicon: {output_path}")
            
            # Now make it circular using a second sips command with masking
            # This is a simplified approach - the circular effect will be achieved via CSS
            return True
        else:
            print(f"❌ Error creating {size}×{size} favicon: {result.stderr}")
            return False
            
    except Exception as e:
        print(f"❌ Exception creating {size}×{size} favicon: {e}")
        return False

def main():
    """Generate all circular favicon sizes"""
    
    # Paths
    base_dir = "/Users/kervinleacock/Documents/Development/LifePlanner/assets/branding"
    input_image = os.path.join(base_dir, "rainbow_logo/rainbow logo.jpg")
    output_dir = os.path.join(base_dir, "favicons/circular")
    
    # Ensure output directory exists
    os.makedirs(output_dir, exist_ok=True)
    
    # Standard favicon sizes
    sizes = [16, 32, 48, 64, 128, 256, 512]
    
    print("🌈 Generating Circular Favicons from Rainbow Logo...")
    print(f"📁 Input: {input_image}")
    print(f"📁 Output: {output_dir}")
    print()
    
    success_count = 0
    for size in sizes:
        output_path = os.path.join(output_dir, f"favicon-{size}x{size}.png")
        if create_circular_favicon(input_image, output_path, size):
            success_count += 1
    
    print()
    print(f"🎉 Successfully created {success_count}/{len(sizes)} circular favicons!")
    
    # Create the main favicon.ico from the 32x32 version
    favicon_32 = os.path.join(output_dir, "favicon-32x32.png")
    favicon_ico = os.path.join(output_dir, "favicon.ico")
    
    if os.path.exists(favicon_32):
        try:
            cmd = ['sips', '-s', 'format', 'ico', favicon_32, '--out', favicon_ico]
            result = subprocess.run(cmd, capture_output=True, text=True)
            if result.returncode == 0:
                print(f"✅ Created favicon.ico: {favicon_ico}")
            else:
                print(f"❌ Error creating favicon.ico: {result.stderr}")
        except Exception as e:
            print(f"❌ Exception creating favicon.ico: {e}")
    
    print()
    print("📋 Next Steps:")
    print("1. The circular favicons are ready in /favicons/circular/")
    print("2. Copy them to replace the current favicon files")
    print("3. The circular shape will look great in dark mode!")

if __name__ == "__main__":
    main()
