#!/usr/bin/env python3
"""Rewrite the "Course content" script tags in index.html and teacher/index.html from the files in js/lessons and js/exits.
Order: for each unit, lessons by number (u1l1, u1l2, … — a later lesson may use an earlier lesson's kit), then uNtest.js;
then every js/exits/uN.js (exit slips reuse lesson and test kits).
In teacher/index.html the tags say `defer`: the Teacher Ledger opens on its Live tab without waiting for the question
bank (teacher/dash.js: partsIn / bankIn). Deferred scripts still run in the order written."""
import os, re
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def key(f):
    m = re.match(r'u(\d+)(?:l(\d+)|(test))\.js$', f); return (int(m.group(1)), 999 if m.group(3) else int(m.group(2)))
les = sorted([f for f in os.listdir(f'{R}/js/lessons') if re.match(r'u\d+(l\d+|test)\.js$', f)], key=key)
ex = sorted([f for f in os.listdir(f'{R}/js/exits') if f.endswith('.js')]) if os.path.isdir(f'{R}/js/exits') else []
for page, pre in (('index.html', ''), ('teacher/index.html', '../')):
    p = f'{R}/{page}'; s = open(p).read()
    s = re.sub(r'\n<script (?:defer )?src="(\.\./)?js/(lessons|exits)/[^"]+"></script>', '', s)
    d = 'defer ' if page.startswith('teacher/') else ''
    tags = ''.join(f'\n<script {d}src="{pre}js/lessons/{f}"></script>' for f in les) + ''.join(f'\n<script {d}src="{pre}js/exits/{f}"></script>' for f in ex)
    i = s.index('<!-- Course content'); j = s.index('\n', i)
    s = s[:j] + tags + s[j:]
    open(p, 'w').write(s)
print(len(les), 'lesson files,', len(ex), 'exit files')
