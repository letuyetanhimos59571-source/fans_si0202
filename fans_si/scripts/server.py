import http.server
import socketserver
import os
import sys
import urllib.parse

PORT = 8006
if len(sys.argv) > 1:
    try:
        PORT = int(sys.argv[1])
    except ValueError:
        print(f"Invalid port number: {sys.argv[1]}, using default {PORT}")

DIRECTORY = "F:\\work\\si-main\\fans_si"

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def do_GET(self):
        # Force UTF-8 for JSON and HTML
        super().do_GET()

    def send_head(self):
        path = self.translate_path(self.path)
        f = None
        if os.path.isdir(path):
            parts = urllib.parse.urlsplit(self.path)
            if not parts.path.endswith('/'):
                # redirect browser - doing basically what simplehttp does
                self.send_response(301)
                new_parts = (parts[0], parts[1], parts[2] + '/',
                             parts[3], parts[4])
                new_url = urllib.parse.urlunsplit(new_parts)
                self.send_header("Location", new_url)
                self.end_headers()
                return None
            for index in "index.html", "index.htm":
                index = os.path.join(path, index)
                if os.path.exists(index):
                    path = index
                    break
        
        ctype = self.guess_type(path)
        # Manually force charset for text types
        if ctype.startswith("text/") or ctype == "application/json":
            ctype += "; charset=utf-8"
            
        try:
            f = open(path, 'rb')
        except OSError:
            self.send_error(404, "File not found")
            return None
            
        try:
            self.send_response(200)
            self.send_header("Content-type", ctype)
            fs = os.fstat(f.fileno())
            self.send_header("Content-Length", str(fs[6]))
            self.send_header("Last-Modified", self.date_time_string(fs.st_mtime))
            self.end_headers()
            return f
        except:
            f.close()
            raise

import urllib.parse

os.chdir(DIRECTORY)

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving at port {PORT}")
    httpd.serve_forever()
