# scripts/generate-icons.py
import struct
import zlib
import os
import math

def create_png(width, height, get_pixel):
    raw = bytearray()
    for y in range(height):
        raw.append(0)  # Filter type: None
        for x in range(width):
            r, g, b, a = get_pixel(x, y, width, height)
            raw.extend((r, g, b, a))

    def chunk(tag, data):
        c = struct.pack('>I', len(data)) + tag + data
        crc = zlib.crc32(tag + data) & 0xffffffff
        return c + struct.pack('>I', crc)

    png = bytearray(b'\x89PNG\r\n\x1a\n')
    ihdr = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    png.extend(chunk(b'IHDR', ihdr))
    png.extend(chunk(b'IDAT', zlib.compress(bytes(raw), 9)))
    png.extend(chunk(b'IEND', b''))
    return bytes(png)

def logo_pixel(x, y, w, h):
    # Normalized coordinates (-1.0 to 1.0)
    nx = (x / (w - 1)) * 2.0 - 1.0
    ny = (y / (h - 1)) * 2.0 - 1.0
    dist = math.sqrt(nx * nx + ny * ny)

    # Outside outer circle
    if dist > 0.96:
        return (0, 0, 0, 0)

    # Border gradient ring (0.84 to 0.95)
    if dist >= 0.84:
        t = (nx + ny + 2.0) / 4.0
        # Cyan (#38bdf8) to Emerald (#34d399)
        r = int(56 * (1 - t) + 52 * t)
        g = int(189 * (1 - t) + 211 * t)
        b = int(248 * (1 - t) + 153 * t)
        return (r, g, b, 255)

    # Deep Navy Blue Background (#0f172a)
    bg_r, bg_g, bg_b = 15, 23, 42

    # Draw Mortarboard Diamond
    # Center diamond at ny = -0.25
    dy = ny - (-0.25)
    diamond_dist = abs(nx) / 0.65 + abs(dy) / 0.32
    if diamond_dist <= 1.0:
        # Vibrant Cyan (#38bdf8)
        return (56, 189, 248, 255)

    # Cap base support (underneath cap)
    if 0.05 <= ny <= 0.38 and abs(nx) <= 0.40:
        return (2, 132, 199, 255) # #0284c7

    # Gold Tassel on right side
    if 0.20 <= nx <= 0.58 and -0.25 <= ny <= 0.20:
        if abs(ny - (0.8 * nx - 0.2)) < 0.08:
            return (250, 204, 21, 255) # #facc15

    # Neural Edge Lines & Center Circuit
    if ny >= 0.40:
        # Center vertical line
        if abs(nx) <= 0.06 and 0.40 <= ny <= 0.75:
            return (56, 189, 248, 255)
        # Left branch line
        if -0.45 <= nx <= 0 and 0.55 <= ny <= 0.75:
            if abs(ny - (-0.45 * nx + 0.55)) < 0.07:
                return (56, 189, 248, 255)
        # Right branch line
        if 0 <= nx <= 0.45 and 0.55 <= ny <= 0.75:
            if abs(ny - (0.45 * nx + 0.55)) < 0.07:
                return (56, 189, 248, 255)

        # Terminal Nodes (circles at terminals)
        # Center terminal (0, 0.75)
        if math.sqrt(nx * nx + (ny - 0.75) ** 2) <= 0.12:
            return (52, 211, 153, 255) # #34d399
        # Left terminal (-0.42, 0.75)
        if math.sqrt((nx + 0.42) ** 2 + (ny - 0.75) ** 2) <= 0.10:
            return (56, 189, 248, 255) # #38bdf8
        # Right terminal (0.42, 0.75)
        if math.sqrt((nx - 0.42) ** 2 + (ny - 0.75) ** 2) <= 0.10:
            return (56, 189, 248, 255) # #38bdf8

    return (bg_r, bg_g, bg_b, 255)

def make_ico(png_list):
    # ICO header: 6 bytes
    num_images = len(png_list)
    header = struct.pack('<HHH', 0, 1, num_images)
    offset = 6 + (16 * num_images)
    entries = bytearray()
    datas = bytearray()

    for w, h, data in png_list:
        w_byte = 0 if w >= 256 else w
        h_byte = 0 if h >= 256 else h
        size = len(data)
        # 16-byte directory entry: width, height, colors(0), reserved(0), planes(1), bpp(32), size, offset
        entry = struct.pack('<BBBBHHII', w_byte, h_byte, 0, 0, 1, 32, size, offset)
        entries.extend(entry)
        datas.extend(data)
        offset += size

    return bytes(header + entries + datas)

def main():
    os.makedirs('static/img', exist_ok=True)

    print("Generating icons from School AI Logo specification...")
    png16 = create_png(16, 16, logo_pixel)
    png32 = create_png(32, 32, logo_pixel)
    png48 = create_png(48, 48, logo_pixel)
    png64 = create_png(64, 64, logo_pixel)
    png180 = create_png(180, 180, logo_pixel)
    png192 = create_png(192, 192, logo_pixel)
    png512 = create_png(512, 512, logo_pixel)

    # Save PNG files
    with open('static/img/favicon-16x16.png', 'wb') as f:
        f.write(png16)
    with open('static/img/favicon-32x32.png', 'wb') as f:
        f.write(png32)
    with open('static/img/apple-touch-icon.png', 'wb') as f:
        f.write(png180)
    with open('static/img/logo.png', 'wb') as f:
        f.write(png192)
    with open('static/img/logo-512.png', 'wb') as f:
        f.write(png512)

    # Build multi-resolution ICO file
    ico_data = make_ico([
        (16, 16, png16),
        (32, 32, png32),
        (48, 48, png48),
        (64, 64, png64),
    ])

    with open('static/favicon.ico', 'wb') as f:
        f.write(ico_data)
    with open('static/img/favicon.ico', 'wb') as f:
        f.write(ico_data)

    print("All favicon and logo icons generated successfully!")

if __name__ == '__main__':
    main()
