#!/usr/bin/env python3
import os
import platform
import subprocess
import shutil
import argparse

def main():
    parser = argparse.ArgumentParser(description="Build the Gemini Live API Client as a standalone application")
    parser.add_argument('--release', action='store_true', help='Build for release (with optimizations)')
    parser.add_argument('--icon', help='Path to icon file (.ico for Windows, .icns for Mac)')
    args = parser.parse_args()
    
    # Install PyInstaller if not already installed
    try:
        import PyInstaller
    except ImportError:
        print("PyInstaller not found. Installing...")
        subprocess.run(["pip", "install", "pyinstaller"], check=True)
    
    app_name = "GeminiLiveClient"
    script_path = os.path.join("examples", "live_api_gui.py")
    
    if not os.path.exists(script_path):
        print(f"Error: Script not found at {script_path}")
        return
    
    # Create build command
    cmd = ["pyinstaller", "--name", app_name, "--noconfirm"]
    
    # Add icon if specified
    if args.icon:
        if os.path.exists(args.icon):
            cmd.extend(["--icon", args.icon])
        else:
            print(f"Warning: Icon file not found at {args.icon}")
    
    # Add release optimizations
    if args.release:
        cmd.extend(["--clean", "--windowed"])
    else:
        cmd.append("--debug=all")
    
    # Platform-specific options
    system = platform.system()
    if system == "Windows":
        cmd.append("--add-data=favicon.ico;.")
    elif system == "Darwin":  # macOS
        cmd.append("--add-data=favicon.ico:.")
    else:  # Linux
        cmd.append("--add-data=favicon.ico:.")
    
    # Add main script
    cmd.append(script_path)
    
    # Run PyInstaller
    print(f"Building {app_name} with command: {' '.join(cmd)}")
    subprocess.run(cmd, check=True)
    
    print(f"Build complete. Executable can be found in the 'dist/{app_name}' directory")

if __name__ == "__main__":
    main()