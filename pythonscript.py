import os
import json

# Corrected BASE_URL to match the structure served by the HTTP server.
BASE_URL = "http://192.168.1.10:8000/dist"  # Update with your server's IP if needed.
DIST_DIR = "site/dist"
OUTPUT_JSON = "site/dist.json"

def generate_file_list(base_path, relative_path=""):
    file_list = []
    full_path = os.path.join(base_path, relative_path)

    print(f"Scanning directory: {full_path}")  # Log which directory is being scanned

    for item in os.listdir(full_path):
        item_path = os.path.join(full_path, item)
        relative_item_path = os.path.join(relative_path, item)
        if os.path.isdir(item_path):
            print(f"Found directory: {item_path}")
            # Recursively list contents of directories.
            file_list.append({
                "name": item,
                "type": "directory",
                "files": generate_file_list(base_path, relative_item_path)
            })
        else:
            print(f"Found file: {item_path}")
            # Add file details.
            file_list.append({
                "name": item,
                "type": "file",
                "url": f"{BASE_URL}/{relative_item_path.replace(os.sep, '/')}"
            })

    return file_list

def main():
    # Generate the file list starting from the DIST_DIR.
    print(f"Generating file list for: {DIST_DIR}")
    if not os.path.exists(DIST_DIR):
        print(f"Error: Directory {DIST_DIR} does not exist.")
        return

    file_structure = {
        "files": generate_file_list(DIST_DIR)
    }

    # Write the JSON structure to the output file.
    print(f"Writing output to: {OUTPUT_JSON}")
    with open(OUTPUT_JSON, "w") as json_file:
        json.dump(file_structure, json_file, indent=4)
    
    print(f"Generated {OUTPUT_JSON} with the file listing.")

if __name__ == "__main__":
    main()
