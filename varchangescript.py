import sys
from bs4 import BeautifulSoup

# Ensure correct number of arguments
if len(sys.argv) < 2:
    print("Usage: python script.py '<new_value>'")
    sys.exit(1)

# Path to file given in arg
filename = sys.argv[1]

# Read file to string
with open(filename, 'r') as file:
    
    file_content = file.read()
    
    # Prevents Error: string literal contains an unescaped line break
    # TODO: Look into alternative solutions; This was done on fly
    safe_file_content = file_content.replace('\n', '\\n').replace('\r', '\\r')


# Load HTML template file with BeautifulSoup
with open("dist/index.html", "r", encoding="utf-8") as file:
    soup = BeautifulSoup(file, "html.parser")

# Find the <script> tag containing "var inputValues"
# TODO: Create id tag on script so searching for first instance is not necessary
for script in soup.find_all("script"):
    if "var inputValues" in script.text:
        # Set inputValues to data from file
        script.string = f'var inputValues = "{safe_file_content}";'
        break

# Save the modified HTML template back to a file
with open("dist/index_data.html", "w", encoding="utf-8") as file:
    file.write(str(soup))
