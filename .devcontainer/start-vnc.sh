#!/usr/bin/env bash
set -euo pipefail

export DISPLAY=:99

pgrep -x Xvfb       >/dev/null || Xvfb :99 -screen 0 1280x800x24 >/tmp/xvfb.log 2>&1 &
pgrep -x fluxbox    >/dev/null || fluxbox >/tmp/fluxbox.log 2>&1 &
pgrep -x x11vnc     >/dev/null || x11vnc -display :99 -nopw -forever -shared -rfbport 5900 >/tmp/x11vnc.log 2>&1 &
pgrep -f websockify >/dev/null || websockify --web=/usr/share/novnc 6080 localhost:5900 >/tmp/novnc.log 2>&1 &

echo "noVNC ready at http://localhost:6080/vnc.html"
