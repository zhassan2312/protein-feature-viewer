import sys
from pathlib import Path
from bs4 import BeautifulSoup

def get_data(file_path: Path) -> str:
    content = file_path.read_text(encoding='utf-8')
    return content.replace('\n', '\\n').replace('\r', '\\r')

def inject_data(input_html: Path, output_html: Path, safe_content: str):
    soup = BeautifulSoup(input_html.read_text(encoding='utf-8'), 'html.parser')
    for script in soup.find_all("script"):
        if "var inputValues" in script.text:
            script.string = f'var inputValues = "{safe_content}";'
            break
    output_html.write_text(str(soup), encoding='utf-8')

def main():
    if len(sys.argv) < 2:
        print("Usage: python script.py <path_to_input_text_file>")
        sys.exit(1)

    input_path = Path(sys.argv[1])
    data = get_data(input_path)

    file_names = [
        "index", 
        "Main_Panel", 
        "Disorder_Panel", 
        "ASA_Panel", 
        "SS_Panel",
        "Protein_Panel",
        "DNA_Panel", 
        "RNA_Panel", 
        "SignalP_Panel", 
        "Conservation_Panel",
        "Linker_Panel", 
        "PTM_Panel_allrow"
    ]

    for name in file_names:
        # Webpack must have name set exactly to index for serve
        # index_Canvas would break serve functionality 
        if name == "index":
            input_html = Path(f"dist/{name}.html")
        else:
            input_html = Path(f"dist/{name}_Canvas.html")

        output_html = Path(f"dist/{name}.html")
        inject_data(input_html, output_html, data)


if __name__ == "__main__":
    main()


