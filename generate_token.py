from http.server import BaseHTTPRequestHandler, HTTPServer
import threading
import time
from urllib.parse import urlparse, parse_qs
import webbrowser

SERVER: HTTPServer | None = None
GOT_TOKEN = False

class SimpleRequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if not self.path.startswith("/auth"):
            self.send_response(404)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(b"Not found!")
            return

        if not "?" in self.path:
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(b"<script>let url = window.location.href.replace(\"#\",\"?\");"
                             b"window.location.replace(url);</script>")

        url_parts = urlparse(self.path)
        params = parse_qs(url_parts.query, errors="strict")

        token = params.get("access_token", None)
        if token is None:
            self.send_response(400)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(b"Missing OAUTH token!")
            return

        with open("auth.js") as fp:
            lines = fp.readlines()

        lines[0] = f"const OAUTH_TOKEN = \"{token[0]}\"; // View the README to fill this out!\n"

        with open("auth.js", "w") as fp:
            fp.writelines(lines)

        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        self.wfile.write(b"Authorization successful. You can now close this tab.")
        self.wfile.write(b"<script>window.close()</script>")

        global GOT_TOKEN
        GOT_TOKEN = True

def run_server(port=5000):
    global SERVER

    server_address = ('', port)
    httpd = HTTPServer(server_address, SimpleRequestHandler)

    SERVER = httpd

    httpd.serve_forever()

def main():
    server_thread = threading.Thread(target=run_server)
    server_thread.start()

    with open("CLIENT_ID.txt") as fp:
        CLIENT_ID = fp.read()

    TWITCH_AUTH_LINK = ("https://id.twitch.tv/oauth2/authorize"
                         f"?client_id={CLIENT_ID}"
                         "&redirect_uri=http://localhost:5000/auth"
                         "&response_type=token"
                         "&scope=channel:moderate+chat:edit+chat:read+channel:manage:broadcast+user:edit:broadcast+channel:read"
                         ":redemptions+user:read:email")

    print("=" * 25)
    print("Open this link in your browser, if one doesn't open automatically.")
    print(TWITCH_AUTH_LINK)
    print("=" * 25)
    webbrowser.open_new_tab(TWITCH_AUTH_LINK)

    while not GOT_TOKEN:
        time.sleep(0.1)

    SERVER.shutdown()

if __name__ == '__main__':
    main()
