#!/usr/bin/env python3
"""
Local dev server for PsychoPharmRef.
Handles pretty URLs (/blog/smoking-cessation/ → /blog/smoking-cessation.html)
so sidebar links work the same way they do on Netlify.

Usage:  python3 serve.py
        Then open http://localhost:8000
"""

import http.server
import os

PORT = 8000

class PrettyURLHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        path = self.path.split('?')[0].split('#')[0]  # strip query/hash

        # Pretty URLs: redirect /blog/something/ → /blog/something.html
        # Must be a redirect (not a silent rewrite) so the browser's URL
        # changes and relative paths (../css/styles.css, blog.css, sidebar.html)
        # resolve correctly from the /blog/ directory.
        if path != '/' and path.endswith('/'):
            html_path = path.rstrip('/') + '.html'
            if os.path.isfile('.' + html_path):
                self.send_response(302)
                self.send_header('Location', html_path)
                self.end_headers()
                return

        # Also handle /blog/smoking-cessation (no trailing slash)
        if not os.path.exists('.' + path) and not path.endswith('.html'):
            html_path = path + '.html'
            if os.path.isfile('.' + html_path):
                self.send_response(302)
                self.send_header('Location', html_path)
                self.end_headers()
                return

        return super().do_GET()

if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    with http.server.HTTPServer(('', PORT), PrettyURLHandler) as httpd:
        print(f'Serving PsychoPharmRef at http://localhost:{PORT}')
        print('Press Ctrl+C to stop.')
        httpd.serve_forever()
