"""
Local development server for ScamShield Lab on port 5050 (Rule 7).
Supports Cloudflare Pages-style extensionless URLs (/quiz -> quiz.html, / -> index.html).
"""
import http.server
import os
import socketserver
from urllib.parse import unquote, urlsplit

PORT = 5050
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class CleanUrlHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def translate_path(self, path):
        parsed = urlsplit(path)
        clean_path = unquote(parsed.path)
        if clean_path == "/":
            return os.path.join(ROOT, "index.html")
        candidate = os.path.join(ROOT, clean_path.lstrip("/").replace("/", os.sep))
        if not os.path.exists(candidate) and not clean_path.endswith(".html"):
            html_candidate = candidate + ".html"
            if os.path.isfile(html_candidate):
                return html_candidate
        return super().translate_path(path)


if __name__ == "__main__":
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("127.0.0.1", PORT), CleanUrlHandler) as httpd:
        print(f"ScamShield Lab local server running at http://localhost:{PORT}/")
        httpd.serve_forever()

