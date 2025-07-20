from flask import Flask, request, send_file, render_template, abort
import io, os

app = Flask(__name__, template_folder="templates")

# Load names list
DATA_PATH = os.path.dirname(__file__)
with open(os.path.join(DATA_PATH, "names.txt"), encoding="utf-8") as f:
    NAMES = [line.strip() for line in f if line.strip()]

@app.route("/", methods=["GET"])
def index():
    return render_template("index.html", names=NAMES)

@app.route("/generate", methods=["POST"])
def generate():
    names = request.form.getlist("players")
    if len(names) != 11:
        return "You must pick exactly 11 players.", 400

    # Read the JSX template
    tpl_file = os.path.join(DATA_PATH, "template.jsx")
    try:
        with open(tpl_file, encoding="utf-8") as f:
            template = f.read()
    except FileNotFoundError:
        abort(500, "template.jsx not found.")

    # Build blocks: for each name, reference Desktop/<Name>.png
    blocks = []
    for nm in names:
        if nm not in NAMES:
            return f"Unknown player: {nm}", 400
        # Use ExtendScript’s Folder.desktop to locate files on the user’s desktop
        blocks.append(f"""\
 // ● {nm}
 var imgFile = new File( Folder.desktop + "/{nm}.png" );
 if (imgFile.exists) {{
   app.open(imgFile);
 }} else {{
   $.writeln("❌ Missing image for {nm}: {nm}.png");
 }}
""")

    # Inject and send
    final_jsx = template.replace("{{REPLACEMENTS}}", "\n".join(blocks))
    return send_file(
        io.BytesIO(final_jsx.encode("utf-8")),
        mimetype="application/javascript",
        as_attachment=True,
        download_name="photoshop_xi_script.jsx"
    )

if __name__ == "__main__":
    app.run(debug=True, port=5000)
