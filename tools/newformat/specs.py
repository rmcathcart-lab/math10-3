from pics import *
T = lambda x: '<span class="tex">%s</span>' % x
BIG = lambda html: f'<div class="vw-q">{html}</div>'
SPECS = {}
SPECS['u4l9'] = dict(
    warm=dict(title='Who Am I?', rule='A number riddle. Find the number, and be ready to say how you know.',
              body=BIG('“My square is <b>5 times</b> me.”<small>Who am I?</small>'),
              nudge='How do you know?',
              reveal=f'<b>5</b>, because {T(r"5^2=25=5\times5")}. And also <b>0</b>, because {T(r"0^2=0=5\times0")}. Two numbers fit.'),
    extra_expl=['zeroGrid', 'notZero', 'subCheck', 'decompSolve'],
    practice=dict(after='ex3', qs='1–4', rest='5–15', line='Solve by factoring. Rearrange first when one side isn’t 0.',
                  chips=[('1', 'Already factored'), ('2', 'Factor, then split'), ('3–4', 'Rearrange first')],
                  note='We carry on when most of the class has finished Question 3.'),
)
SPECS['u4l10'] = dict(
    warm=dict(title='Two Truths and a Lie', rule='Two of these are true. One is a lie. Which one?',
              body=f'<div class="vw-tiles" style="--n:3;--fs:27px"><div><b>A</b>{T("x^2-9=(x-3)(x+3)")}</div><div><b>B</b>{T("x^2+9=(x+3)^2")}</div><div><b>C</b>{T("x^2+6x+9=(x+3)^2")}</div></div>',
              nudge='How could you prove it?',
              reveal=f'<b>B is the lie.</b> Expand it: {T("(x+3)^2=x^2+6x+9")}, not {T("x^2+9")}. A sum of squares doesn’t factor.'),
    extra_expl=['gcfEx', 'inspectA', 'inspectB', 'squares', 'perfect', 'decomp', 'flow', 'solveRev', 'garden'],
    replace=[(' (The checklist explainer in Section 7 replays Challenge 1, and the solving explainer in Section 8 replays Challenge 2.)',
              '<span data-extra> (The checklist explainer in Section 7 replays Challenge 1, and the solving explainer in Section 8 replays Challenge 2.)</span>')],
    practice=dict(after='ex5', qs='1–11', rest='12–24', line='One factoring type at a time.',
                  chips=[('1–3', 'Common factor'), ('4–7', 'Trinomials, ' + T('a=1')), ('8–11', 'Difference of squares and perfect squares')],
                  note='We carry on when most of the class has reached Question 8.'),
)

def grid_svg(cols, rows, marks, cell=46, extra=''):
    """A bare grid (no axes, no numbers). marks: [(col, row, text, colour)] at grid crossings, rows counted from the bottom."""
    W, H = cols * cell, rows * cell
    ln = ''.join(f'<line x1="{c*cell}" y1="0" x2="{c*cell}" y2="{H}"/>' for c in range(cols + 1)) + ''.join(f'<line x1="0" y1="{r*cell}" x2="{W}" y2="{r*cell}"/>' for r in range(rows + 1))
    mk = ''.join(f'<text x="{c*cell}" y="{H - r*cell}" fill="{col}" font-size="{int(cell*.9)}" font-weight="800" text-anchor="middle" dominant-baseline="central">{t}<animate attributeName="opacity" values="1;.3;1" dur="1.8s" begin="{i*.4}s" repeatCount="indefinite"/></text>' for i, (c, r, t, col) in enumerate(marks))
    return f'<svg class="vw-grid" viewBox="-24 -24 {W+48} {H+48}" style="max-height:{H+48}px"><g stroke="#cfc8b8" stroke-width="1.5">{ln}</g>{extra}{mk}</svg>'
PIC = lambda inner, cap='': f'<div class="vw-pic">{inner}{("<p>" + cap + "</p>") if cap else ""}</div>'

SPECS['u5l1'] = dict(
    warm=dict(title='Where Is the ✕?', rule='Your friend has the same grid, but no ✕. You can only send them <b>numbers</b>. What do you send?',
              body=PIC(grid_svg(10, 6, [(7, 4, '✕', '#c93a33')])),
              nudge='Would your friend put it in exactly the right spot?',
              reveal='Two numbers are enough, for example <b>7 across and 4 up</b> from the bottom-left corner. But you both have to agree on where to start, and which number comes first.'),
    extra_cards=['s4b'],
    extra_expl=['readPoint', 'quadrants', 'pattern'],
    practice=dict(after='ex3', qs='1–9', rest='10–15', line='Vocabulary, reading points and plotting points.',
                  chips=[('1', 'Vocabulary'), ('2–7', 'Reading a grid'), ('8–9', 'Plotting and joining points')],
                  note='We carry on when most of the class has reached Question 8.'),
)

def toothpicks(n=3, s=84):
    L = []
    def t(x1, y1, x2, y2): L.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}"/>')
    top, bot = s * .62, s * 1.62
    t(0, top + 6, 0, bot - 6)
    for i in range(n):
        x = i * s
        t(x + 6, top, x + s - 6, top); t(x + 6, bot, x + s - 6, bot); t(x + s, top + 6, x + s, bot - 6)
        t(x + 4, top - 6, x + s / 2 - 3, 6); t(x + s / 2 + 3, 6, x + s - 4, top - 6)
    W = n * s
    return f'<svg viewBox="-14 -6 {W+28} {bot+16}" style="max-width:{int(W*1.5)}px"><g stroke="#c9902f" stroke-width="7" stroke-linecap="round">{"".join(L)}</g></svg>'

SPECS['u5l2'] = dict(
    warm=dict(title='Toothpick Street', rule='These 3 houses took <b>16 toothpicks</b>. How many toothpicks for a street of <b>10 houses</b>?',
              body=PIC(toothpicks()),
              nudge='Why isn’t it just 10 times one house?',
              reveal=f'<b>51 toothpicks.</b> The first house takes 6. Every house after that shares a wall, so it only adds 5: {T(r"6+9\times5=51")}.'),
    extra_expl=['tableDiffs', 'sortVars', 'causeEffect'],
    extra_with_prev=['streetCount'],
    practice=dict(after='ex3', qs='1–7', rest='8–13', line='Patterns, tables of values, and independent or dependent.',
                  chips=[('1–2', 'Vocabulary and review'), ('3–5', 'Patterns and tables'), ('6–7', 'Independent and dependent')],
                  note='We carry on when most of the class has reached Question 6.'),
)
MACH = lambda rows: '<div class="vw-mach">' + ''.join(f'<div><span>{a}</span><i>→</i><span class="{("q" if b == "?" else "")}">{b}</span></div>' for a, b in rows) + '</div>'
SPECS['u5l3'] = dict(
    warm=dict(title='The Mystery Machine', rule='A number goes in, the machine does something to it, and a number comes out. What comes out when <b>10</b> goes in?',
              body=MACH([('1', '4'), ('2', '7'), ('5', '16'), ('10', '?')]),
              nudge='What is the machine doing to each number?',
              reveal=f'<b>31.</b> The machine multiplies by 3, then adds 1: {T(r"3\times10+1=31")}.'),
    extra_cards=['s4b'],
    extra_expl=['plotPairs', 'threeViews', 'tableRead'],
    replace=[(' (like Jo’s in the warm-up).</p>', '<span data-extra> (like Jo’s in “Who’s Connected?”, near the end of these notes)</span>.</p>')],
    practice=dict(after='ex3', qs='1–6', rest='7–13', line='Ordered pairs, tables of values and mapping diagrams.',
                  chips=[('1–4', 'Ordered pairs and tables'), ('5–6', 'Mapping diagrams')],
                  note='We carry on when most of the class has reached Question 5.'),
)

SPECS['u5l4'] = dict(
    warm=dict(title='Low Battery!', rule='You both start right now. Whose phone dies first?',
              body='<div class="vw-tiles" style="--n:2"><div><b>You</b><span>80%<small>texting: loses <b>10%</b> every hour</small></span></div><div><b>Jordan</b><span>100%<small>streaming video: loses <b>20%</b> every hour</small></span></div></div>',
              nudge='How long does each phone last?',
              reveal='<b>Jordan’s dies first,</b> after 5 hours (100 ÷ 20). Yours lasts 8 hours (80 ÷ 10), even though it started lower.'),
    extra_expl=['axisZero', 'meetAxes', 'countMeet', 'tableInt', 'readGraph'],
    practice=dict(after='ex34', qs='1–8', rest='9–13', line='Find the intercepts from graphs and from tables.',
                  chips=[('1–5', 'Intercepts from graphs'), ('6–8', 'Intercepts from tables, and key facts')],
                  note='We carry on when most of the class has reached Question 6.'),
)
def stick():
    cell = 46; H = 5 * cell
    ex = f'<line x1="0" y1="{H}" x2="{9*cell}" y2="{H}" stroke="#4a4436" stroke-width="5" stroke-linecap="round"/><line x1="{2*cell}" y1="{H-1*cell}" x2="{6*cell}" y2="{H-4*cell}" stroke="#9a6a24" stroke-width="9" stroke-linecap="round"/>'
    return grid_svg(9, 5, [(4, 5.1, '☀', '#e0a11b')], cell, ex)
SPECS['u5l5'] = dict(
    warm=dict(title='The Shadow', rule='The sun is <b>straight overhead</b>. How long is the shadow of the blue stick on the ground?',
              body=PIC(stick(), 'Each square is 1 unit.'),
              nudge='Is the shadow as long as the stick?',
              reveal='<b>4 units.</b> The shadow runs from under one end of the stick to under the other end. The stick itself is 5 units long, but the shadow only shows how far it reaches left to right.'),
    extra_cards=['s5b'],
    extra_expl=['discrete', 'scan'],
    practice=dict(after='ex4', qs='1–7', rest='8–13', line='Read the domain and range from each graph.',
                  chips=[('1–7', 'Domain and range from a graph')],
                  note='We carry on when most of the class has reached Question 5.'),
)

SPECS['u5l6'] = dict(
    warm=dict(title='Who Gets On?', rule='The sign at the ride says: <b>“You must be at least 120 cm tall, and under 195 cm.”</b> Which of these five people can ride?',
              body='<div class="vw-tiles" style="--n:5"><div><b>A</b>119.5 cm</div><div><b>B</b>120 cm</div><div><b>C</b>150 cm</div><div><b>D</b>194 cm</div><div><b>E</b>195 cm</div></div>',
              
              reveal='<b>B, C and D.</b> “At least 120” includes 120 itself, so B rides. “Under 195” does not include 195, so E can’t.'),
    extra_cards=['s2b'],
    extra_expl=['recall', 'table', 'setNote', 'real'],
    practice=dict(after='ex3', qs='1–8', rest='9–15', line='Domain and range from ordered pairs and tables, then in set notation.',
                  chips=[('1–5', 'Ordered pairs and tables'), ('6–8', 'Set notation and inequalities')],
                  note='We carry on when most of the class has reached Question 6.'),
)
def window_svg(full=False):
    v = '<polyline points="20,20 150,200 280,20" fill="none" stroke="#9a6a24" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>'
    if full:
        return f'<svg viewBox="0 0 300 220" style="width:220px;flex:none">{v}<rect x="176" y="96" width="70" height="70" fill="rgba(224,161,27,.18)" stroke="#e0a11b" stroke-width="4"/></svg>'
    return '<svg viewBox="170 90 82 82" style="max-width:300px"><defs><clipPath id="vwwin"><rect x="176" y="96" width="70" height="70"/></clipPath></defs><rect x="176" y="96" width="70" height="70" fill="#fbfaf6"/><g clip-path="url(#vwwin)">' + v + '</g><rect x="176" y="96" width="70" height="70" fill="none" stroke="#4a4436" stroke-width="3"/></svg>'
SPECS['u5l7'] = dict(
    warm=dict(title='Through the Window', rule='This is all you can see through a small window. What is the <b>whole picture</b>?',
              body=PIC(window_svg()),
              nudge='How sure are you?',
              reveal='<span style="display:flex;gap:18px;align-items:center">' + window_svg(True) + '<span><b>A big V.</b> The window only showed a small piece of one side, so it looked like a plain straight line. What you see depends on where the window is and how big it is.</span></span>'),
    extra_expl=['keys', 'fixWindow', 'table', 'offEdges', 'context'],
    practice=dict(after='ex4', qs='1–7', rest='8–12', line='Choose a window, then read intercepts, domain and range off the screen.',
                  chips=[('1–3', 'Vocabulary and choosing a window'), ('4–7', 'Intercepts, domain and range off a screen')],
                  note='We carry on when most of the class has reached Question 5.'),
)
VEND = lambda name, rows: f'<div><b>{name}</b><span class="vw-vend">' + ''.join(f'<span>Press <b>{a}</b> → {b}</span>' for a, b in rows) + '</span></div>'
SPECS['u5l8'] = dict(
    warm=dict(title='Which Machine Is Broken?', rule='Two vending machines. One of them is broken. Which one?',
              body='<div class="vw-tiles" style="--n:2">' + VEND('Machine A', [('1', 'chips'), ('2', 'chips'), ('3', 'gum')]) + VEND('Machine B', [('1', 'chips'), ('1', 'gum'), ('2', 'pop')]) + '</div>',
              nudge='What would make you stop trusting a machine?',
              reveal='<b>Machine B.</b> The same button gave two different snacks, so you can’t know what you’ll get. Machine A is fine: two buttons can give the same snack.'),
    extra_cards=['s4b'],
    extra_expl=['arrows', 'pairsCheck', 'families', 'context'],
    practice=dict(after='ex3', qs='1–8', rest='9–15', line='Is it a function? Check the pairs, the tables and the graphs.',
                  chips=[('1–6', 'Is it a function?'), ('7–8', 'The vertical line test')],
                  note='We carry on when most of the class has reached Question 7.'),
)

SPECS['u5l9'] = dict(
    warm=dict(title='Crack the Rule', rule='What is the last one?',
              body=BIG(f'{T(r"f(\text{dog})=3")} &emsp; {T(r"f(\text{horse})=5")} &emsp; {T(r"f(\text{cat})=3")}<small>{T(r"f(\text{elephant})=\ ?")}</small>'),
              nudge='What is the rule doing with each word?',
              reveal=f'<b>8.</b> The rule counts the letters: {T(r"f(\text{elephant})=8")}. The word goes in, a number comes out.'),
    extra_cards=['s2b', 's3b'],
    extra_expl=['anatomy', 'context'],
    practice=dict(after='ex2', qs='1–9', rest='10–16', line='Read the notation, then evaluate for a number.',
                  chips=[('1–3', 'Notation and vocabulary'), ('4–9', 'Evaluating for a number')],
                  note='We carry on when most of the class has reached Question 7.'),
)
SPECS['u5l10'] = dict(
    warm=dict(title='Crack the Code', rule='What is the last one?',
              body=BIG(f'{T(r"h(\text{STOP})=\text{POTS}")} &emsp; {T(r"h(\text{LIVE})=\text{EVIL}")}<small>{T(r"h(\text{DRAW})=\ ?")}</small>'),
              nudge='What does h do to a word?',
              reveal=f'<b>WARD.</b> The rule {T("h")} writes the word backwards.'),
    extra_cards=['s5b', 's5d'],
    extra_expl=['pointLink', 'swap', 'tableFill'],
    practice=dict(after='ex3', qs='1–8', rest='9–15', line='Switch between the two notations, then read values from graphs and tables.',
                  chips=[('1–3', 'Converting between notations'), ('4–8', 'Reading values from graphs and tables')],
                  note='We carry on when most of the class has reached Question 6.'),
)
def battery():
    X = lambda h: 60 + (h - 8) * 40; Y = lambda p: 250 - p * 2.2
    pts = ' '.join(f'{X(h)},{Y(p)}' for h, p in [(8, 100), (15, 40), (17, 90), (22, 20)])
    g = ''.join(f'<line x1="{X(h)}" y1="{Y(0)}" x2="{X(h)}" y2="{Y(100)}" stroke="#e4dfd2" stroke-width="1.5"/><text x="{X(h)}" y="{Y(0)+26}" text-anchor="middle" font-size="17" fill="#6b6557">{lab}</text>' for h, lab in [(8, '8 am'), (10, '10'), (12, 'noon'), (14, '2 pm'), (16, '4'), (18, '6'), (20, '8'), (22, '10 pm')])
    g += ''.join(f'<line x1="{X(8)}" y1="{Y(p)}" x2="{X(22)}" y2="{Y(p)}" stroke="#e4dfd2" stroke-width="1.5"/><text x="{X(8)-10}" y="{Y(p)+6}" text-anchor="end" font-size="17" fill="#6b6557">{p}%</text>' for p in (0, 25, 50, 75, 100))
    return f'<svg viewBox="0 0 660 290" style="max-width:820px">{g}<polyline points="{pts}" fill="none" stroke="#12805a" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/></svg>'
def race():
    X = lambda t: 70 + t * 56; Y = lambda d: 250 - d * 2.2
    g = ''.join(f'<line x1="{X(t)}" y1="{Y(0)}" x2="{X(t)}" y2="{Y(100)}" stroke="#e4dfd2" stroke-width="1.5"/><text x="{X(t)}" y="{Y(0)+26}" text-anchor="middle" font-size="17" fill="#6b6557">{t}</text>' for t in range(0, 11, 2))
    g += ''.join(f'<line x1="{X(0)}" y1="{Y(d)}" x2="{X(10)}" y2="{Y(d)}" stroke="#e4dfd2" stroke-width="1.5"/><text x="{X(0)-10}" y="{Y(d)+6}" text-anchor="end" font-size="17" fill="#6b6557">{d} m</text>' for d in (0, 25, 50, 75, 100))
    line = lambda pts, col: f'<polyline points="{" ".join(f"{X(t)},{Y(d)}" for t, d in pts)}" fill="none" stroke="{col}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>'
    return f'<svg viewBox="0 0 660 300" style="max-width:820px">{g}<text x="{X(5)}" y="296" text-anchor="middle" font-size="17" fill="#6b6557">time (seconds)</text>{line([(0, 0), (2, 60), (7, 60), (9, 100)], "#c93a33")}{line([(0, 0), (8, 100)], "#12805a")}</svg>'
SPECS['u5l11'] = dict(
    warm=dict(title='The Race', rule='Two runners, one 100 m race. <b>Who won?</b>',
              body=PIC(race(), '<b style="color:#c93a33">Red</b> and <b style="color:#12805a">Green</b>: distance from the start line as time goes by.'),
              nudge='What happened to the other runner?',
              reveal='<b>Green won.</b> Green reaches 100 m after 8 seconds; Red gets there after 9. Red sprinted ahead, then stood still for 5 seconds (the flat part), then ran again.'),
    extra_cards=['ex1c', 'ex2b'],
    extra_expl=['rate', 'shapes'],
    replace=[('Watch the warm-up trips happen, in step with their graphs.', 'Watch each trip happen, in step with its graph.')],
    practice=dict(after='ex2', qs='1–5', rest='6–14', line='Read each graph, then match a story to a graph.',
                  chips=[('1–3', 'Reading and interpreting graphs'), ('4–5', 'Matching a story to a graph')],
                  note='We carry on when most of the class has reached Question 4.'),
)
SPECS['u5l12'] = dict(
    warm=dict(title='Where Am I?', rule='A riddle from a point on the grid.',
              body=BIG('“My two coordinates <b>add to 10</b> and <b>multiply to 21</b>.”<small>Where am I?</small>'),
              
              reveal=f'The numbers are 3 and 7. But the point could be {T("(3,\\ 7)")} <b>or</b> {T("(7,\\ 3)")}: two different points, because the order matters.'),
    move_with_warm=['wuex'],
    extra_cards=['s3b', 's5b', 's9b'],
    extra_expl=['plane', 'intercepts', 'screen', 'vlt', 'fwdBack', 'story'],
    replace=[('<span class="muted">(Check them with the Challenge chips in the explainers of Sections 3, 4, 5, 7 and 8.)</span>', '<span class="muted" data-extra>(Check them with the Challenge chips in the explainers of Sections 3, 4, 5, 7 and 8.)</span>')],
    practice=dict(after='ex5', qs='1–11', rest='12–26', line='The first half of the unit, one skill at a time.',
                  chips=[('1–3', 'The Cartesian plane'), ('4–7', 'Patterns and relations'), ('8–11', 'Intercepts, domain and range')],
                  note='We carry on when most of the class has reached Question 8.'),
)

# ======================= Unit 1 =======================
TILES = lambda n, items, fs=None: f'<div class="vw-tiles" style="--n:{n}' + (f';--fs:{fs}px' if fs else '') + '">' + ''.join((f'<div class="lab"><b>{a}</b><span>{b}</span></div>' if len(a) > 2 else f'<div><b>{a}</b>{b}</div>') for a, b in items) + '</div>'
def PR(after, qs, rest, line, chips, upto=None):
    return dict(after=after, qs=qs, rest=rest, line=line, chips=chips, note=f'We carry on when most of the class has reached Question {upto}.' if upto else 'We carry on when most of the class has finished.')
SPECS['u1l1'] = dict(
    warm=dict(title='The Comment Section', rule=f'Someone posts: “What is {T(r"3+4\times2")}?” Two comments reply. Who is right?',
              body=TILES(2, [('1.2k likes', '14'), ('87 likes', '11')]), nudge='Does the most-liked answer win?',
              reveal=f'<b>11.</b> Multiply first: {T(r"3+4\times2=3+8=11")}. The most-liked comment added first, and likes don’t make it right.'),
    extra_cards=['s2b', 's3b'], extra_expl=['chips', 'signs', 'sub'],
    practice=PR('ex3', '1–10', '11–16', 'Integer operations, then the order of operations.', [('1–4', 'Adding and subtracting'), ('5–7', 'Multiplying and dividing'), ('8–10', 'Order of operations')], 8))
SPECS['u1l2'] = dict(
    warm=dict(pic=COOKIE, title='The Cookie Recipe', rule='How many scoops?',
              body=BIG(f'The recipe needs {T(r"1\tfrac12")} cups of flour.<small>Your little brother hid every measuring cup except the {T(r"\tfrac13")} cup.</small>'),
              nudge='How could you check with a drawing?',
              reveal=f'<b>{T(r"4\tfrac12")} scoops.</b> Three scoops make 1 cup, so {T(r"1\tfrac12")} cups takes {T(r"3+1\tfrac12=4\tfrac12")} scoops. That is {T(r"1\tfrac12\div\tfrac13")}.'),
    extra_cards=['s1b', 's2b', 's3c', 's4b'], extra_expl=['equiv', 'times', 'fbedmas', 'decimals'],
    practice=PR('ex3', '1–7', '8–16', 'Equivalent fractions, then adding, subtracting, multiplying and dividing.', [('1–2', 'Equivalent fractions and simplifying'), ('3–7', 'Operations with fractions and mixed numbers')], 5))
SPECS['u1l3'] = dict(
    warm=dict(pic=CICADA, title='Together Again', rule='How many years until both kinds are out together again?',
              body=BIG('Some cicadas come out of the ground every <b>13 years</b>. Others come out every <b>17 years</b>.<small>Both kinds came out this year.</small>'),
              nudge='Why can’t it be sooner?',
              reveal=f'<b>221 years.</b> 13 and 17 share no factors, so the first year both lists hit is {T(r"13\times17=221")}.'),
    extra_cards=['s3b'], extra_expl=['rectangles', 'gcfList', 'frogs', 'bags'],
    replace=[('The warm-up did it with 4 and 6 (the first number on <b>both</b> lists is 12), and', 'With 4 and 6, the first number on <b>both</b> lists is 12. With'), ('That’s the slow way:</p>', 'That’s the slow way.</p>')],
    practice=PR('ex4', '1–9', '10–14', 'Prime factorization, then GCF and LCM.', [('1–4', 'Factors, primes and prime factorization'), ('5–9', 'GCF and LCM')], 7))
SPECS['u1l4'] = dict(
    warm=dict(title='Spot the Impostor', rule='Three of these are the same number in disguise. Which one is the impostor?',
              body=TILES(4, [('A', T(r'\sqrt{9}')), ('B', T(r'\dfrac{6}{2}')), ('C', T(r'\sqrt{10}')), ('D', T(r'3.0'))]),
              reveal=f'<b>C.</b> {T(r"\sqrt9")}, {T(r"\tfrac62")} and {T("3.0")} are all 3. {T(r"\sqrt{10}")} is about 3.16, and its decimal never ends or repeats.'),
    extra_cards=['s2b', 's3b', 's4b'], extra_expl=['nwi', 'asFrac', 'perfectSq', 'order'],
    practice=PR('ex4', '1–8', '9–14', 'Name the sets, then reason about them.', [('1–5', 'Naming the sets'), ('6–8', 'Reasoning about the sets')], 6))
SPECS['u1l5'] = dict(
    warm=dict(pic=PHOTOS, title='The Photo Wall', rule='About how many photos wide will the wall be?',
              body=BIG('The whole school brings in <b>200 photos</b> for one giant <b>square</b> wall.<small>Every photo is the same size.</small>'),
              nudge='How close can you get without a calculator?',
              reveal=f'<b>About 14.</b> {T(r"14\times14=196")}, just under 200, and {T(r"15\times15=225")} is too many.'),
    extra_expl=['cubes', 'zoom', 'round', 'garden'],
    practice=PR('ex3', '1–8', '9–14', 'Perfect squares and cubes, then estimating square roots.', [('1–3', 'Perfect squares and perfect cubes'), ('4–8', 'Estimating square roots')], 6))
SPECS['u1l6'] = dict(
    warm=dict(title='Which Is Biggest?', rule='No calculator. Which one is the biggest?',
              body=TILES(3, [('A', T(r'2\sqrt{5}')), ('B', T(r'3\sqrt{2}')), ('C', T(r'\sqrt{19}'))]),
              reveal=f'<b>A.</b> Put each one under a single root: {T(r"2\sqrt5=\sqrt{20}")}, {T(r"3\sqrt2=\sqrt{18}")} and {T(r"\sqrt{19}")}.'),
    extra_expl=['area', 'order', 'again'],
    practice=PR('ex3', '1–7', '8–14', 'Entire to mixed, then mixed to entire.', [('1–2', 'Vocabulary'), ('3–5', 'Entire to mixed'), ('6–7', 'Mixed to entire')], 5))
SPECS['u1l7'] = dict(
    warm=dict(pic=DICE, title='The Giant Die', rule='How many times as tall as a normal die is the giant one?',
              body=BIG('A toy store sells a giant die that holds exactly <b>16 normal dice</b>.'),
              nudge='Could it be a whole number?',
              reveal=f'<b>About 2.5 times.</b> A die 2 tall holds {T(r"2\times2\times2=8")} and a die 3 tall holds 27, so 16 is in between. The exact height is {T(r"\sqrt[3]{16}")}.'),
    extra_cards=['s2c', 's5b', 'w4'], extra_expl=['anatomy', 'cubeMeaning', 'signs', 'finderN'],
    practice=PR('ex3', '1–6', '7–12', 'Cube roots: entire to mixed, then mixed to entire.', [('1–4', 'Entire cube radicals to mixed'), ('5–6', 'Mixed cube radicals to entire')], 5))
SPECS['u1l8'] = dict(
    warm=dict(title='Two Truths and a Lie', rule='Two of these are true. One is a lie. Which one?',
              body=TILES(3, [('A', T(r'\sqrt{50}=5\sqrt2')), ('B', T(r'-3^2=9')), ('C', T(r'0.75=\dfrac34'))]),
              nudge='How could you prove it?',
              reveal=f'<b>B is the lie.</b> The exponent only reaches the 3, so {T("-3^2=-9")}. It would be 9 with brackets: {T("(-3)^2")}.'),
    extra_cards=['s3b', 's4b', 'chk'], extra_expl=['bedmas', 'bars', 'estimate', 'radicals'],
    practice=PR('ex3', '1–10', '11–25', 'The first half of the unit, one skill at a time.', [('1–3', 'Integers and order of operations'), ('4–6', 'Fractions and decimals'), ('7–10', 'Primes, GCF and LCM')], 7))

# ======================= Unit 2 =======================
SPECS['u2l1'] = dict(
    warm=dict(pic=TREE, title='Pass It On', rule='In which round does a single round first reach more than <b>1000</b> people?',
              body=BIG('You send a meme to <b>3 friends</b>.<small>Each of them sends it to 3 new people. Then each of those sends it to 3 new people, and so on.</small>'),
              nudge='How fast do the rounds grow?',
              reveal=f'<b>Round 7.</b> The rounds go 3, 9, 27, 81, 243, 729, 2187. That is {T("3^7=2187")}.'),
    extra_expl=['anatomy', 'order', 'signs', 'substitute', 'coef'],
    replace=[(' Watch the two kinds of power side by side as the exponent grows.</p>', '<span data-extra> Watch the two kinds of power side by side as the exponent grows.</span></p>')],
    practice=PR('ex3', '1–6', '7–13', 'Vocabulary and evaluating powers.', [('1–6', 'Vocabulary and evaluating')], 5))
SPECS['u2l2'] = dict(
    warm=dict(pic=NEST, title='Boxes Inside Boxes', rule='How many candies are on the truck?',
              body=BIG('A bag holds <b>5</b> candies. A box holds <b>5</b> bags.<small>A crate holds 5 boxes. A truck holds 5 crates.</small>'),
              nudge='Is there a quick way to write it?',
              reveal=f'<b>625.</b> {T(r"5\times5\times5\times5=5^4=625")}.'),
    extra_cards=['s3b'], extra_expl=['coefDiv', 'chain'],
    practice=PR('ex4', '1–7', '8–14', 'The Quotient Law, then the Power of a Power Law.', [('1–4', 'The Quotient Law'), ('5–7', 'Power of a power')], 5))
SPECS['u2l3'] = dict(
    warm=dict(pic=SUPER, title='Supersize It!', rule='How many normal dice fit inside the giant one?',
              body=BIG('A giant die is <b>10 times as long</b>, <b>10 times as wide</b> and <b>10 times as tall</b> as a normal die.'),
              nudge='Why isn’t it 30?',
              reveal=f'<b>1000.</b> {T(r"10\times10\times10=10^3")}: 10 along, 10 across, 10 layers high.'),
    extra_cards=['s2c', 's3b'], extra_expl=['recap', 'chain', 'check'],
    replace=[('data-section="2. Back to the warm-up"', 'data-section="2. Supersize a tile"'), ('Back to the warm-up: supersize a tile', 'Supersize a tile')],
    practice=PR('ex3', '1–6', '7–12', 'Power of a product, then power of a quotient.', [('1–6', 'The two new laws')], 5))
SPECS['u2l4'] = dict(
    warm=dict(title='The Power Maze', rule='Start with <b>2</b>. Use each tile exactly once. Which order gives the <b>largest</b> end result?',
              body=TILES(3, [('', '× 4'), ('', 'square it'), ('', '÷ 2')]),
              nudge='Does the order really matter?',
              reveal=f'<b>× 4, then square it, then ÷ 2 gives 32.</b> {T(r"2\times4=8")}, {T("8^2=64")}, {T(r"64\div2=32")}. Squaring after the × 4 makes a big number much bigger. The smallest end result is 4.'),
    extra_cards=['s3b'], extra_expl=['which', 'columns'],
    practice=PR('ex3', '1–5', '6–14', 'Combine two laws at a time.', [('1–5', 'Two-law combinations')], 4))
SPECS['u2l5'] = dict(
    warm=dict(pic=MOON, title='Fold to the Moon', rule='About how many folds until the stack reaches the Moon?',
              body=BIG('A sheet of paper is <b>0.1 mm</b> thick. Every fold <b>doubles</b> the stack.<small>The Moon is 384 400 km away. Pretend you can keep folding.</small>'),
              nudge='Hundreds? Thousands? Millions?',
              reveal=f'<b>Only 42 folds.</b> Doubling 42 times multiplies by {T("2^{42}")}, about 4.4 trillion, which turns 0.1 mm into about 440 000 km.'),
    extra_cards=['s4b'], extra_expl=['zcancel', 'zsimp'],
    practice=PR('ex3', '1–7', '8–13', 'Zero exponents on numbers, then on variables.', [('1–5', 'Zero exponents with numbers'), ('6–7', 'Variables')], 6))
SPECS['u2l6'] = dict(
    warm=dict(pic=MOULD, title='The Fridge Mould', rule='How big was the spot <b>6 hours earlier</b>?',
              body=BIG('A spot of mould <b>triples</b> in size every hour.<small>Right now it covers 81 cm².</small>'),
              nudge='Keep going back, one hour at a time.',
              reveal=f'{T(r"\tfrac19")} <b>cm².</b> Going back, divide by 3 each hour: 81, 27, 9, 3, 1, {T(r"\tfrac13")}, {T(r"\tfrac19")}. The pattern doesn’t stop at 1.'),
    extra_expl=['nline', 'nvar', 'ndiv', 'ncancel'],
    practice=PR('ex3', '1–5', '6–13', 'Use the negative exponent rule.', [('1–5', 'The negative exponent rule')], 4))
SPECS['u2l7'] = dict(
    warm=dict(title='Which Is Bigger?', rule='No calculator. Which one is bigger?',
              body=TILES(2, [('A', T('2^{-3}')), ('B', T('3^{-2}'))]),
              reveal=f'<b>A.</b> {T(r"2^{-3}=\tfrac18")} and {T(r"3^{-2}=\tfrac19")}. An eighth is a little more than a ninth. Neither one is negative.'),
    extra_cards=['s1b', 's3b', 's5b'], extra_expl=['laws', 'outer', 'steps5'],
    practice=PR('ex3', '1–8', '9–16', 'One law at a time, then two or more together.', [('1–4', 'One law at a time'), ('5–8', 'Two or more laws together')], 6))
SPECS['u2l8'] = dict(
    warm=dict(title='Which Is More?', rule='Guess first, then estimate. Which is more?',
              body=TILES(2, [('A', 'the number of <b>seconds</b> in one year'), ('B', 'the number of <b>people</b> living in Canada')], 30),
              nudge='How would you count the seconds?',
              reveal=f'<b>B, the people.</b> A year has {T(r"60\times60\times24\times365")}, about 31.5 million seconds. Canada has a little over 41 million people.'),
    extra_cards=['s4b'], extra_expl=['places', 'toStd', 'ladder'],
    practice=PR('ex3', '1–7', '8–15', 'Convert between standard and scientific notation.', [('1–7', 'Converting between forms')], 5))
SPECS['u2l9'] = dict(
    warm=dict(pic=CUBE, title='One Million Cubes', rule='How tall is the giant cube?',
              body=BIG('A unit cube is <b>1 cm</b> on each edge.<small>Stack exactly one million of them into one giant cube.</small>'),
              nudge='Taller than you? Taller than the school?',
              reveal=f'<b>100 cm, just 1 metre.</b> {T(r"100\times100\times100=1\,000\,000")}, so each edge is 100 cubes long.'),
    extra_cards=['s1b'], extra_expl=['whyRoot', 'toPow', 'laws'],
    practice=PR('ex4', '1–5', '6–16', 'Evaluate, then convert between radicals and powers.', [('1–3', 'Evaluating rational-exponent powers'), ('4–5', 'Converting between radicals and powers')], 4))
SPECS['u2l10'] = dict(
    warm=dict(title='The Biggest One', rule='No calculator. Which is the biggest?',
              body=TILES(3, [('A', T('10^{100}')), ('B', T('100^{10}')), ('C', T('1000^{5}'))]),
              nudge='Can you write them all with the same base?',
              reveal=f'<b>A, by a huge amount.</b> {T("100^{10}=(10^2)^{10}=10^{20}")} and {T("1000^5=(10^3)^5=10^{15}")}. Both are tiny beside {T("10^{100}")}.'),
    extra_expl=['count', 'dist', 'steps1', 'anatomy', 'flip', 'steps2', 'sci', 'radical'],
    replace=[('<p class="muted">Replay the counting with the <b>Example 2 check</b> chips in the explainer above.</p>', '<p class="muted" data-extra>Replay the counting with the <b>Example 2 check</b> chips in the explainer above.</p>'), (' Try each one by hand first, then check it with the <b>Challenge</b> chips in the Section 7 stepper and the Section 8 scientific-notation explainer.</p>', '<span data-extra> Try each one by hand first, then check it with the <b>Challenge</b> chips in the Section 7 stepper and the Section 8 scientific-notation explainer.</span></p>')],
    practice=PR('ex4', '1–9', '10–25', 'The exponent laws, one at a time.', [('1–9', 'The exponent laws')], 6))

# ======================= Unit 3 =======================
CAL = lambda a: f'<span class="vw-cal"><span>{a}</span><span>{a+1}</span><span>{a+7}</span><span>{a+8}</span></span>'
SPECS['u3l1'] = dict(
    warm=dict(title='The Fruit Puzzle', rule='What is the last line worth?',
              body=BIG('🍎 + 🍎 + 🍎 = 30<br>🍎 + 🍌 + 🍌 = 18<br>🍌 − 🥥 = 2<small style="font-size:40px;color:inherit">🥥 + 🍎 + 🍌 = ?</small>'),
              nudge='What is each fruit worth?',
              reveal='<b>16.</b> An apple is 10, a banana is 4 and a coconut is 2, so the last line is 2 + 10 + 4.'),
    extra_cards=['s1b', 's4b', 's4c', 's4d', 's5b', 's5c'], extra_expl=['anatomy'],
    practice=PR('ex3', '1–7', '8–15', 'Vocabulary, like terms, then collecting.', [('1–5', 'Vocabulary and like terms'), ('6–7', 'Collecting like terms')], 5))
SPECS['u3l2'] = dict(
    warm=dict(title='Beat the Calculator', rule='In your head. No calculator, no paper.',
              body=BIG(T(r'8\times1\,997')), nudge='1 997 is almost a very friendly number.',
              reveal=f'<b>15 976.</b> {T(r"8\times2\,000=16\,000")}, then take away {T(r"8\times3=24")}.'),
    extra_expl=['monoMul', 'areaGrid', 'distB', 'distC'],
    replace=[('That is exactly what the warm-up rectangles did.', 'That is exactly how the warm-up worked: 8 × 2 000, take away 8 × 3.')],
    practice=PR('ex3', '1–5', '6–15', 'Multiply monomials, then distribute.', [('1–3', 'Monomials and binomials'), ('4–5', 'Trinomials')], 4))
SPECS['u3l3'] = dict(
    warm=dict(title='The Calendar Trick', rule='Take any 2 by 2 block from a calendar. Multiply each diagonal pair. What do you notice?',
              body='<div class="vw-tiles" style="--n:2"><div>' + CAL(9) + '</div><div>' + CAL(20) + '</div></div>',
              nudge='Try another block. Does it always happen?',
              reveal=f'<b>The two products always differ by 7.</b> {T(r"10\times16-9\times17=160-153=7")} and {T(r"21\times27-20\times28=567-560=7")}.'),
    extra_cards=['s2b'], extra_expl=['areaGrow', 'foilNeg', 'middle', 'combine'],
    practice=PR('ex3', '1–9', '10–16', 'Distribute and FOIL, then negative terms.', [('1–5', 'Distributing and FOIL'), ('6–9', 'Negative terms and two variables')], 6))
SPECS['u3l4'] = dict(
    warm=dict(title='In Your Head', rule='No calculator, no paper.',
              body=BIG(T(r'49\times51')), nudge='Both numbers are very close to 50.',
              reveal=f'<b>2 499.</b> It is one less than {T(r"50\times50=2\,500")}.'),
    extra_expl=['foilRecall', 'squareSplit', 'minusSquare'],
    replace=[(', so warm up with one full expansion first.</p>', '.<span data-extra> Warm up with one full expansion first.</span></p>')],
    practice=PR('ex4', '1–8', '9–16', 'Expand with the two patterns.', [('1–8', 'Expand and simplify')], 6))
SPECS['u3l5'] = dict(
    warm=dict(title='Jordan’s Shortcut', rule='How far off is Jordan?',
              body=BIG(f'Jordan says {T(r"23\times123=2\,009")}<small>“because {T(r"20\times100=2\,000")} and {T(r"3\times3=9")}.”</small>'),
              nudge='What did Jordan leave out?',
              reveal=f'<b>Off by 820.</b> The real answer is 2 829. Jordan left out {T(r"20\times23=460")} and {T(r"3\times100=300")} and {T(r"20\times3=60")}: every part has to multiply every part.'),
    extra_cards=['s2c'], extra_expl=['recall', 'sort', 'signs', 'combo'],
    replace=[('The warm-up already did this with numbers.', 'Multiplying two numbers already works this way: every part times every part.')],
    practice=PR('ex3', '1–6', '7–16', 'Six partial products, then collect.', [('1–6', 'Six partial products, then collect')], 4))
SPECS['u3l6'] = dict(
    warm=dict(title='The Open-Top Box', rule='Cut the same square from each corner of a <b>20 cm by 20 cm</b> sheet and fold up the sides. Which cut makes the box that <b>holds the most</b>?',
              body=TILES(4, [('A', '1 cm'), ('B', '3 cm'), ('C', '5 cm'), ('D', '8 cm')]),
              nudge='A small cut is wide but flat. A big cut is tall but skinny.',
              reveal=f'<b>B, the 3 cm cut:</b> {T(r"14\times14\times3=588")} cm³. The others hold 324, 500 and 128 cm³.'),
    extra_expl=['area', 'box', 'tank'],
    replace=[('Every row of the warm-up table followed', 'Every cut in the warm-up followed')],
    practice=PR('ex2', '1–4', '5–13', 'Area and volume of simple shapes.', [('1–4', 'Area and volume of simple shapes')], 3))
SPECS['u3l7'] = dict(
    warm=dict(title='The Mind Reader', rule='Do each step in your head. Don’t tell anyone your number.',
              body=BIG('Think of a number. <b>Add 3.</b> <b>Double it.</b> <b>Subtract 4.</b> <b>Halve it.</b><small>Now subtract the number you started with.</small>'),
              nudge='Compare answers with the person beside you.',
              reveal=f'<b>Everyone gets 1.</b> Start with {T("n")}: {T(r"n+3\to2n+6\to2n+2\to n+1")}, and taking away {T("n")} leaves 1.'),
    extra_cards=['mach', 's1b', 's4b'], extra_expl=['tiles', 'dist', 'foil', 'patterns', 'grid', 'measure'],
    replace_all=[('<p class="muted u3l7-chk">', '<p class="muted u3l7-chk" data-extra>')],
    practice=PR('ex3', '1–11', '12–22', 'The first half of the unit, one skill at a time.', [('1–4', 'Like terms, adding and subtracting'), ('5–8', 'Monomial times polynomial'), ('9–11', 'Two binomials')], 8))

# ======================= Unit 4, lessons 1–7 =======================
SPECS['u4l1'] = dict(
    warm=dict(title='How Many Rectangles?', rule='Use <b>every</b> tile in the pile to build a rectangle. Which pile can build the <b>most different</b> rectangles?',
              body=TILES(4, [('A', '13 tiles'), ('B', '16 tiles'), ('C', '20 tiles'), ('D', '24 tiles')]),
              nudge='Which pile is stuck with one long row?',
              reveal=f'<b>D.</b> 24 tiles make four rectangles: {T(r"1\times24")}, {T(r"2\times12")}, {T(r"3\times8")}, {T(r"4\times6")}. The 16 and 20 piles make three each. The 13 pile only makes one long row.'),
    extra_cards=['s1b', 's2b'], extra_expl=['twoWay', 'columnsM', 'tileRect'],
    practice=PR('ex3', '1–4', '5–13', 'From multiplying to factoring, then greatest common factors.', [('1', 'From multiplying to factoring'), ('2–4', 'Greatest common factors')], 3))
SPECS['u4l2'] = dict(
    warm=dict(title='The Party Bags', rule='Every bag must be <b>identical</b>, with nothing left over. What is the <b>most</b> bags you can make?',
              body=TILES(3, [('', '24 candies'), ('', '36 stickers'), ('', '30 balloons')]),
              nudge='What has to be true about the number of bags?',
              reveal='<b>6 bags.</b> 6 is the biggest number that divides 24, 36 and 30. Each bag gets 4 candies, 6 stickers and 5 balloons.'),
    extra_cards=['s3b'], extra_expl=['bags', 'lowest', 'pullN'],
    practice=PR('ex3', '1–6', '7–14', 'Find the GCF and take it out.', [('1–4', 'Finding and removing a GCF'), ('5–6', 'GCFs that include variables')], 5))
SPECS['u4l3'] = dict(
    warm=dict(title='The Impossible Sum', rule='Two whole numbers <b>multiply to 12</b>. Which of these sums is <b>impossible</b>?',
              body=TILES(4, [('A', 'add to 7'), ('B', 'add to 8'), ('C', 'add to 9'), ('D', 'add to 13')]),
              nudge='How do you know you have checked every pair?',
              reveal=f'<b>C.</b> The only pairs are {T(r"1\times12")}, {T(r"2\times6")} and {T(r"3\times4")}, which add to 13, 8 and 7. Nothing adds to 9.'),
    extra_cards=['s4b'], extra_expl=['tileRect', 'expandGrid', 'signFlip', 'inspectC'],
    practice=PR('ex3', '1–5', '6–15', 'The sum and product pattern, then factoring.', [('1–3', 'FOIL and the sum–product pattern'), ('4–5', 'Factoring')], 4))
SPECS['u4l4'] = dict(
    warm=dict(title='Secret Number Pairs', rule=f'Two integers <b>multiply to {T("-24")}</b>. Which of these sums is <b>impossible</b>?',
              body=TILES(4, [('A', 'add to 5'), ('B', f'add to {T("-10")}'), ('C', 'add to 3'), ('D', f'add to {T("-2")}')]),
              nudge='How do you know you have checked every pair?',
              reveal=f'<b>C.</b> {T("-3")} and 8 add to 5, 2 and {T("-12")} add to {T("-10")}, 4 and {T("-6")} add to {T("-2")}. No pair adds to 3.'),
    extra_cards=['s1b', 's1d'], extra_expl=['ladderP', 'gcfFirst'],
    practice=PR('ex2', '1–5', '6–15', 'Opposite signs: find the pair, then factor.', [('1–2', 'The opposite-sign pattern'), ('3–5', 'Factoring with c negative')], 4))
SPECS['u4l5'] = dict(
    warm=dict(title='The Prime Suspect', rule='It isn’t even, it doesn’t end in 5, and 3 doesn’t divide it. <b>Is it prime?</b> No calculator.',
              body=BIG('899'), nudge='What friendly number is it very close to?',
              reveal=f'<b>No.</b> {T(r"899=900-1=30^2-1^2=29\times31")}.'),
    extra_cards=['s1b', 's2b', 's4b'], extra_expl=['rootFinder', 'tileGroups'],
    practice=PR('ex2', '1–4', '5–14', 'Recognize a difference of squares and factor it.', [('1–4', 'Recognizing and factoring')], 3))
SPECS['u4l6'] = dict(
    warm=dict(title='In Your Head', rule='No calculator, no paper.',
              body=BIG(T('31^2')), nudge='You know 30 squared.',
              reveal=f'<b>961.</b> {T(r"31^2=(30+1)^2=900+60+1")}. The 60 is {T(r"2\times30\times1")}, the part people forget.'),
    extra_cards=['s1b', 's3b'], extra_expl=['squarePic', 'signCase'],
    replace=[('Name the tiles from the warm-up (', 'Name the tiles ('), (' and every square you built is one of these:', ' and every square is one of these:')],
    practice=PR('ex3', '1–5', '6–14', 'Test for a perfect square, then factor the two cases.', [('1–2', 'Recognizing perfect square trinomials'), ('3–5', 'Factoring the two cases')], 4))
SPECS['u4l7'] = dict(
    warm=dict(title='Who Are We?', rule='A riddle from two whole numbers.',
              body=BIG('“We <b>multiply to 36</b> and <b>add to 13</b>.”<small>Who are we?</small>'),
              nudge='How did you find them?',
              reveal=f'<b>4 and 9.</b> {T(r"4\times9=36")} and {T("4+9=13")}. Listing the pairs that multiply to 36 finds them fast: 1 and 36, 2 and 18, 3 and 12, 4 and 9.'),
    practice=PR('ex2', '1–4', '5–14', 'Find the two numbers, then factor with positive coefficients.', [('1–2', 'Finding the two integers'), ('3–4', 'Decomposition with positive coefficients')], 3))

# ======================= Unit 6 =======================
SPECS['u6l1'] = dict(
    warm=dict(pic=TRUNK, title='Will It Fit?', rule='What is the longest thin rod that can lie flat on the floor of the trunk?',
              body=BIG('The floor of a car trunk is a rectangle, <b>120 cm</b> by <b>50 cm</b>.'),
              nudge='Longer than 120 cm?',
              reveal=f'<b>130 cm.</b> Lay it corner to corner: {T(r"120^2+50^2=14\,400+2\,500=16\,900=130^2")}.'),
    extra_cards=['s2b'], extra_expl=['nameSides', 'verify', 'simplify', 'decide'],
    practice=PR('ex3', '1–8', '9–15', 'Name the sides, verify the theorem, find the hypotenuse.', [('1–3', 'Naming the sides'), ('4–8', 'Verifying, and finding the hypotenuse')], 6))
SPECS['u6l2'] = dict(
    warm=dict(pic=ELEVATOR, title='The Elevator', rule='How many floors did you travel?',
              body=BIG(f'You park on floor {T("-3")} and ride the elevator up to floor <b>5</b>.'),
              nudge='Count them.', reveal=f'<b>8 floors.</b> Three floors up to floor 0, then five more: {T("5-(-3)=8")}.'),
    extra_cards=['s2b', 's2c', 's3b'], extra_expl=['segIntro', 'lengthsV'],
    practice=PR('ex4', '1–6', '7–13', 'Find each length from the coordinates.', [('1–6', 'Finding lengths from coordinates')], 5))
SPECS['u6l3'] = dict(
    warm=dict(pic=DRONE, title='Drone vs. Delivery Truck', rule='How far does the drone fly?',
              body=BIG('To reach the farm, the truck drives <b>12 blocks east</b>, then <b>5 blocks north</b>: 17 blocks.<small>The drone flies there in a straight line.</small>'),
              nudge='More than 12? Less than 17?',
              reveal=f'<b>13 blocks.</b> The drone flies the hypotenuse: {T(r"12^2+5^2=169=13^2")}.'),
    extra_cards=['s1b', 's2b'], extra_expl=['lift', 'simplify', 'map'],
    practice=PR('ex3', '1–7', '8–15', 'Build the right triangle, then use the distance formula.', [('1–3', 'Building the right triangle'), ('4–7', 'The distance formula')], 5))
SPECS['u6l4'] = dict(
    warm=dict(pic=HALFWAY, title='Meet Me Halfway', rule='They walk straight toward each other and meet exactly halfway. Where?',
              body=BIG(f'Ava is at {T("(2,\\ 1)")}. Dev is at {T("(8,\\ 5)")}.'),
              nudge='How could you check?',
              reveal=f'{T("(5,\\ 3)")}. Halfway between 2 and 8 is 5, and halfway between 1 and 5 is 3.'),
    extra_expl=['halfway', 'midcount', 'trail'],
    practice=PR('ex4', '1–5', '6–15', 'Find each midpoint.', [('1–5', 'Finding midpoints')], 4))
SPECS['u6l5'] = dict(
    warm=dict(pic=ZIP, title='The Other End of the Zip-Line', rule='Where is the hidden end?',
              body=BIG(f'A zip-line starts at {T("S(2,\\ 9)")}.<small>Its exact middle is at {T("M(6,\\ 6)")}.</small>'),
              nudge='How did the line get from S to M?',
              reveal=f'{T("E(10,\\ 3)")}. From S to M is 4 right and 3 down. Do the same again from M.'),
    extra_cards=['s2b'], extra_expl=['tools', 'rescue', 'busstop', 'which'],
    practice=PR('ex2', '1–4', '5–16', 'Find the missing endpoint.', [('1–4', 'Finding a missing endpoint')], 3))
SPECS['u6l6'] = dict(
    warm=dict(title='Which Slide Is Scariest?', rule='Four playground slides. Which one is the <b>steepest</b>?',
              body=TILES(4, [('A', '3 m tall<small>6 m along the ground</small>'), ('B', '4 m tall<small>4 m along the ground</small>'), ('C', '5 m tall<small>10 m along the ground</small>'), ('D', '6 m tall<small>20 m along the ground</small>')], 30),
              nudge='Is the tallest one the steepest?',
              reveal='<b>B.</b> It climbs 1 m for every 1 m along the ground. A and C climb 1 m for every 2 m. D is the tallest but the gentlest: 1 m for every 3 m or so.'),
    extra_cards=['s2b', 's3b'], extra_expl=['stairs', 'grade'],
    practice=PR('ex4', '1–4', '5–15', 'Count rise and run, then use the slope formula.', [('1–2', 'Counting rise and run'), ('3–4', 'Using the slope formula')], 3))
def mini_line(x1, y1, x2, y2):
    return f'<svg viewBox="0 0 120 90" style="width:150px;height:auto"><line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="#9a6a24" stroke-width="7" stroke-linecap="round"/></svg>'
SPECS['u6l7'] = dict(
    warm=dict(title='The Walk', rule='You walk each path from <b>left to right</b>. Which one is impossible to walk?',
              body=TILES(4, [('A', mini_line(15, 75, 105, 15)), ('B', mini_line(15, 15, 105, 75)), ('C', mini_line(15, 45, 105, 45)), ('D', mini_line(60, 80, 60, 10))]),
              nudge='How would you describe each of the other three?',
              reveal='<b>D.</b> It is a wall: all up and no across. A is uphill, B is downhill and C is flat.'),
    extra_cards=['s2b', 's2c'], extra_expl=['mirror', 'walk', 'ex5'],
    practice=PR('ex4', '1–5', '6–15', 'One type of slope at a time.', [('1–5', 'Vocabulary and one type at a time')], 4))
SPECS['u6l8'] = dict(
    warm=dict(title='Is the Fence Straight?', rule='Three fence posts on a grid. Is the fence <b>perfectly</b> straight?',
              body=PIC(grid_svg(9, 7, [(1, 1, '●', '#c93a33'), (4, 3, '●', '#c93a33'), (8, 6, '●', '#c93a33')], 42)),
              nudge='How could you be sure without a ruler?',
              reveal='<b>No.</b> From the first post to the second is 3 across and 2 up. From the second to the third is 4 across and 3 up. The steepness changes, so there is a slight bend.'),
    extra_cards=['s3b'], extra_expl=['ruler', 'missing', 'road'], extra_with_prev=['shots'],
    practice=PR('ex3', '1–6', '7–16', 'Test whether three points are collinear.', [('1–3', 'Reading and testing for collinearity'), ('4–6', 'Negative coordinates')], 4))
SPECS['u6l9'] = dict(
    warm=dict(title='Square Corners', rule='At which of these times do the hands of a clock make a <b>perfect square corner</b>?',
              body=TILES(4, [('A', '3:00'), ('B', '6:00'), ('C', '12:15'), ('D', '9:30')]),
              nudge='Picture exactly where the hour hand is.',
              reveal='<b>Only A.</b> At 6:00 the hands make a straight line. At 12:15 the hour hand has already crept past the 12, and at 9:30 it is halfway to the 10, so neither is exactly a square corner.'),
    extra_cards=['s2b', 's3c'], extra_expl=['translate', 'rotate', 'dialK'],
    practice=PR('ex4', '1–5', '6–15', 'Parallel segments, then perpendicular segments.', [('1–2', 'Slope review and parallel segments'), ('3–5', 'Perpendicular segments')], 4))
SPECS['u6l10'] = dict(
    warm=dict(pic=CORNER, title='The Missing Corner', rule='Where is the fourth corner?',
              body=BIG(f'Three corners of a <b>square</b> are {T("(1,\\ 1)")}, {T("(4,\\ 2)")} and {T("(3,\\ 5)")}.'),
              nudge='How do you get from one corner to the next?',
              reveal=f'{T("(0,\\ 4)")}. From (1, 1) to (4, 2) is 3 right, 1 up. The opposite side makes the same move, so go 3 left and 1 down from (3, 5).'),
    replace=[('<span class="muted">(Check Challenge 2 with the chip in the warm-up check explainer.)</span>', '<span class="muted" data-extra>(Check Challenge 2 with the chip in the “which suspect?” explainer near the end.)</span>')],
    move_with_warm=['wuex'], extra_cards=['s10b'], extra_expl=['pyth', 'lengths', 'midpoint', 'slopes', 'collinear', 'pairs', 'triangle'],
    practice=PR('ex3', '1–8', '9–26', 'Pythagoras, segment lengths and the distance formula.', [('1–5', 'Pythagorean theorem and segment lengths'), ('6–8', 'The distance formula')], 6))

# ======================= Unit 7 =======================
SPECS['u7l1'] = dict(
    warm=dict(title='Spot the Fake', rule=f'A rule makes the points {T("(0,\\ 2)")}, {T("(1,\\ 5)")}, {T("(2,\\ 8)")}, {T("(3,\\ 11)")} and keeps going forever. One of these far-away points is a <b>fake</b>. Which one?',
              body=TILES(3, [('A', T('(10,\\ 32)')), ('B', T('(20,\\ 62)')), ('C', T('(30,\\ 90)'))]),
              nudge='What is the rule doing to the first number?',
              reveal=f'<b>C.</b> The rule multiplies the first number by 3 and adds 2, so the point should be {T("(30,\\ 92)")}.'),
    extra_cards=['s1b', 's3b'], extra_expl=['onLine'],
    practice=PR('ex4', '1–8', '9–15', 'Linear or not, tables of values, then graphing.', [('1–8', 'Linear or non-linear, tables and graphs')], 6))
SPECS['u7l2'] = dict(
    warm=dict(title='Pick a Phone Plan', rule='You use <b>6 GB</b> of data a month. Which plan is the cheapest?',
              body=TILES(3, [('A · Spark', '$20 a month<small>plus $5 per GB</small>'), ('B · Orbit', '$35 a month<small>plus $2 per GB</small>'), ('C · Pixel', '$0 a month<small>plus $10 per GB</small>')], 30),
              nudge='Would your answer change if you used 1 GB?',
              reveal='<b>B, Orbit: $47.</b> Spark costs 20 + 5 × 6 = $50 and Pixel costs 10 × 6 = $60. The plan with the biggest fee wins because each GB costs the least.'),
    extra_cards=['s5b'], extra_expl=['meaning', 'balance', 'tableCheck'],
    practice=PR('ex2', '1–6', '7–16', 'Read the slope and the y-intercept off each equation.', [('1–6', 'Reading m and b directly')], 5))
SPECS['u7l3'] = dict(
    warm=dict(title='Frog Hops', rule='Do the two frogs ever land on the same spot?',
              body=TILES(2, [('Green frog', f'starts at {T("(0,\\ 1)")}<small>every hop: up 2, right 3</small>'), ('Blue frog', f'starts at {T("(0,\\ 8)")}<small>every hop: down 1, right 2</small>')], 30),
              nudge='Where does each frog land after 1 hop? 2 hops?',
              reveal=f'<b>Yes, at {T("(6,\\ 5)")}.</b> Green lands there on its 2nd hop: (3, 3), then (6, 5). Blue lands there on its 3rd: (2, 7), (4, 6), (6, 5).'),
    extra_expl=['readMB', 'start', 'overOne', 'fracStep'],
    practice=PR('ex4', '1–6', '7–14', 'Read the slope and the y-intercept, then graph.', [('1–6', 'Reading m and b, then graphing')], 5))
SPECS['u7l4'] = dict(
    warm=dict(pic=TAXI, title='The Taxi', rule='How far can you go with <b>$20</b>?',
              body=BIG('A taxi costs <b>$4</b> just to get in.<small>After that it costs $2 for every kilometre.</small>'),
              nudge='How did you work it out?',
              reveal=f'<b>8 km.</b> $20 take away the $4 leaves $16, and $16 buys 8 km at $2 each. As an equation: {T("y=2x+4")}.'),
    extra_cards=['s1b', 's2b', 's4b'], extra_expl=['sub', 'story'],
    practice=PR('ex3', '1–4', '5–15', 'Write the equation from a slope and y-intercept, then from graphs and tables.', [('1', 'From a given slope and y-intercept'), ('2–4', 'From graphs and tables')], 3))
SPECS['u7l5'] = dict(
    warm=dict(pic=JAR, title='The Piggy Bank', rule='How much was in the jar at the very start?',
              body=BIG('You add the <b>same amount</b> to a jar every week.<small>After 3 weeks it holds $29. After 5 weeks it holds $41.</small>'),
              nudge='How much goes in each week?',
              reveal='<b>$11.</b> Two weeks added $12, so $6 goes in each week. Going back 3 weeks from $29: 29 − 18 = 11.'),
    extra_expl=['family', 'drop1', 'drop2', 'drop3', 'drop4', 'hop', 'half'],
    practice=PR('ex3', '1–6', '7–15', 'Substitute the point, solve for b, write the equation.', [('1–6', 'Substitute and solve')], 4))
SPECS['u7l6'] = dict(
    warm=dict(pic=CANDLE, title='Candle Clues', rule='How tall was the candle when it was first lit?',
              body=BIG('A candle burns down at a steady rate.<small>After 2 hours it is 20 cm tall. After 5 hours it is 14 cm tall.</small>'),
              nudge='And when will it be all gone?',
              reveal='<b>24 cm.</b> It lost 6 cm in 3 hours, so 2 cm every hour. Two hours before the first clue it was 20 + 4 = 24 cm. It is all gone after 12 hours.'),
    extra_cards=['s1b', 's2b'], extra_expl=['stages1', 'stages2', 'stages3', 'stages4', 'travel', 'reduce'],
    practice=PR('ex3', '1–4', '5–14', 'Slope first, then the equation.', [('1–4', 'Slope first, then the equation')], 3))
SPECS['u7l7'] = dict(
    warm=dict(title='Same Line, Different Outfit', rule=f'Three of these are the line {T("y=2x+3")} in disguise. Which one is <b>not</b>?',
              body=TILES(4, [('A', T('y-3=2x')), ('B', T('2x-y+3=0')), ('C', T('y=3+2x')), ('D', T('2y=2x+3'))], 30),
              nudge='How could you test one quickly?',
              reveal=f'<b>D.</b> Dividing by 2 gives {T(r"y=x+\tfrac32")}, a different line. Quick test: {T("(0,\\ 3)")} is on the real line, but D gives {T("2y=3")} there.'),
    extra_cards=['s2b', 's2c'], extra_expl=['zeroMeter', 'solveYFrac'],
    practice=PR('ex4', '1–4', '5–15', 'Convert between the two forms.', [('1–4', 'Converting between the two forms')], 3))
SPECS['u7l8'] = dict(
    warm=dict(pic=SHIP, title='Sink the Ship', rule='A ship covers these four squares. <b>One short rule</b> describes every square on the ship. What is it?',
              body=BIG(f'{T("(3,\\ 1)")} &emsp; {T("(3,\\ 2)")} &emsp; {T("(3,\\ 3)")} &emsp; {T("(3,\\ 4)")}'),
              nudge='What stays the same? What changes?',
              reveal=f'{T("x=3")}. The first number is always 3, and the second can be anything. The ship is a vertical line.'),
    extra_cards=['s4b'], extra_expl=['pinnedV', 'mixup', 'sorter', 'graphMix'],
    practice=PR('ex3', '1–6', '7–16', 'Horizontal and vertical lines.', [('1–6', 'Horizontal and vertical lines')], 5))
SPECS['u7l9'] = dict(
    warm=dict(title='The Head Start', rule='The finish line is <b>72 m</b> from the start. Nobody changes speed. Who crosses it first?',
              body=TILES(2, [('Tortoise', 'starts 60 m ahead<small>walks 1 m every second</small>'), ('Hare', 'starts at 0 m<small>runs 4 m every second</small>')], 30),
              nudge='When does the hare catch up?',
              reveal='<b>The tortoise.</b> It only has 12 m to go, so it finishes in 12 seconds. The hare needs 72 ÷ 4 = 18 seconds. The hare would catch up at 80 m, but the race is over by then.'),
    extra_cards=['s1b', 's4b'], extra_expl=['rate', 'candle'],
    replace=[('<p>Watch a story and its graph together: each step of', '<p><span data-extra>Watch a story and its graph together. </span>Each step of')],
    practice=PR('ex3', '1–8', '9–16', 'Say what the slope and the y-intercept mean.', [('1–8', 'Interpreting slope and y-intercept')], 6))
SPECS['u7l10'] = dict(
    warm=dict(title='Two Truths and a Lie', rule='Two of these are true. One is a lie. Which one?',
              body=TILES(3, [('A', f'{T("y=3x+2")} passes through {T("(0,\\ 2)")}'), ('B', f'{T("x=4")} is a horizontal line'), ('C', f'the slope of {T("y=5")} is 0')], 27),
              nudge='How could you prove it?',
              reveal=f'<b>B is the lie.</b> On {T("x=4")} every point has the same first number, like (4, 0), (4, 1), (4, 2). That is a vertical line.'),
    move_with_warm=['wuex'], extra_expl=['table', 'rearrange', 'stepper', 'solveB', 'twoPts', 'general', 'hv', 'parperp'],
    practice=PR('ex3', '1–7', '8–26', 'Tables, slope–intercept basics and graphing.', [('1–7', 'Tables, slope–intercept basics and graphing')], 5))

# ======================= Unit 8 =======================
SPECS['u8l1'] = dict(
    warm=dict(pic=TWOQ, title='Two Mystery Numbers', rule='What are my two numbers?',
              body=BIG('“My two numbers <b>add to 10</b>.”<small>“The bigger one minus the smaller one is 4.”</small>'),
              nudge='How many pairs fit the first clue on its own?',
              reveal='<b>7 and 3.</b> Lots of pairs add to 10, and lots of pairs differ by 4, but only one pair does both.'),
    extra_cards=['s2b', 's3d', 's4b', 's4c'], extra_expl=['rearrange'],
    practice=PR('ex2', '1–5', '6–14', 'Read the solution off a graph, then solve by graphing.', [('1–5', 'Reading and solving by graphing')], 4))
SPECS['u8l2'] = dict(
    warm=dict(title='The Chase', rule='When does Blue catch up to Red?',
              body=TILES(2, [('Red car', 'starts 30 km ahead<small>drives 100 km/h</small>'), ('Blue car', 'starts at 0 km<small>drives 100 km/h</small>')], 30),
              nudge='How big is the gap after 1 hour? After 2 hours?',
              reveal='<b>Never.</b> They drive at the same speed, so the gap stays 30 km forever. On a graph the two lines are parallel.'),
    extra_cards=['ex1c', 's1b', 'ex2c', 'ex3c', 'ex5c'], extra_expl=['gapB'],
    practice=PR('ex3', '1–3', '4–15', 'Graph each system and say how many solutions it has.', [('1–3', 'Graph and classify')], 2))
SPECS['u8l3'] = dict(
    warm=dict(title='Swap It Out!', rule='How heavy is one banana?',
              body=BIG('🍎 = 🍌 + 🍌<br>🍎 + 🍌 = 150 g'),
              nudge='What could you swap the apple for?',
              reveal='<b>50 g.</b> Swap the apple for two bananas: then three bananas weigh 150 g. The apple is 100 g.'),
    extra_cards=['s2b', 's3b', 's4b'], extra_expl=['brackets', 'checkBoth'],
    practice=PR('ex3', '1–3', '4–6', 'Substitute, solve, back-substitute.', [('1–3', 'Substitute, solve, back-substitute')], 2))
SPECS['u8l4'] = dict(
    warm=dict(pic=MOVIE, title='Movie Night', rule='How much is one ticket?',
              body=BIG('3 tickets and 1 popcorn cost <b>$22</b>.<small>2 tickets and 5 popcorn cost $32.</small>'),
              nudge='Could a ticket be $5? Try it.',
              reveal='<b>$6.</b> Popcorn is $4. Check: 3 × 6 + 4 = 22 and 2 × 6 + 5 × 4 = 32.'),
    extra_cards=['s1c', 's2c'], extra_expl=['table', 'fracs'],
    practice=PR('ex3', '1–5', '6–14', 'Choose a variable to isolate, then solve.', [('1–5', 'Choosing a variable and solving')], 4))
SPECS['u8l5'] = dict(
    warm=dict(title='The Two Receipts', rule='How much is one drink?',
              body=TILES(2, [('Monday', '2 tacos + 3 drinks<small>$17</small>'), ('Tuesday', '2 tacos + 1 drink<small>$11</small>')], 30),
              nudge='What is different about the two orders?',
              reveal='<b>$3.</b> Monday has 2 more drinks and costs $6 more. A taco is $4.'),
    move_with_warm=['warm2'], extra_cards=['s2b', 's3b', 's4b'], extra_expl=['balance', 'zero'],
    practice=PR('ex2', '1–5', '6–15', 'Eliminate by subtracting, then by adding.', [('1–3', 'Eliminate by subtraction'), ('4–5', 'Eliminate by addition')], 4))
SPECS['u8l6'] = dict(
    warm=dict(pic=STORE, title='The School Store', rule='How much for <b>1 pencil and 1 eraser</b>?',
              body=BIG('3 pencils and 2 erasers cost <b>$7</b>.<small>2 pencils and 3 erasers cost $8.</small>'),
              reveal='<b>$3.</b> Put the two orders together: 5 pencils and 5 erasers cost $15, so one of each costs $3.'),
    move_with_warm=['warm2'], extra_cards=['s2b', 's4b'], extra_expl=['stuck', 'route'],
    practice=PR('ex2', '1–5', '6–14', 'Multiply one equation, then both.', [('1', 'Identify the multiplier'), ('2–3', 'Multiply one equation'), ('4–5', 'Multiply both equations')], 4))
SPECS['u8l7'] = dict(
    warm=dict(pic=CAGE, title='Heads and Legs', rule='This puzzle is over 1 500 years old. How many <b>rabbits</b>?',
              body=BIG('A cage holds pheasants (2 legs) and rabbits (4 legs).<small>There are 35 heads and 94 feet.</small>'),
              nudge='What if they were all pheasants?',
              reveal='<b>12 rabbits</b> and 23 pheasants. If all 35 were pheasants there would be 70 feet. The 24 extra feet come in pairs from the rabbits.'),
    extra_cards=['ex1c', 'ex2c', 'ex34c', 'ex5c'], extra_expl=['translate', 'bars', 'swap'],
    practice=PR('ex2', '1–5', '6–14', 'Translate, then solve number and age problems.', [('1', 'Translating only'), ('2–5', 'Number and age problems')], 4))
SPECS['u8l8'] = dict(
    warm=dict(title='Odd One Out', rule='Three pairs of lines. Which pair is the odd one out?',
              body=TILES(3, [('A', f'{T("y=2x+1")}<br>{T("y=2x-3")}'), ('B', f'{T("y=x+1")}<br>{T("y=-x+5")}'), ('C', f'{T("y=3x")}<br>{T("y=x+4")}')], 30),
              nudge='Picture each pair on a graph.',
              reveal='<b>A.</b> Its two lines have the same slope, so they are parallel and never meet. B crosses at (2, 3) and C crosses at (2, 6).'),
    extra_cards=['ex1c', 'ex2c', 'ex34c', 'ex56c', 'ex7c', 'ch2c'], extra_expl=['howMany'],
    practice=PR('ex34', '1–11', '12–24', 'Graphing, classifying and substitution.', [('1–7', 'Graphing and classifying'), ('8–11', 'Substitution')], 8))
