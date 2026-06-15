from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm, mm
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame,
    Paragraph, Spacer, Table, TableStyle,
    HRFlowable, PageBreak, KeepTogether, NextPageTemplate
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY, TA_RIGHT
from reportlab.platypus import Flowable

# ── Colour palette ──────────────────────────────────────────────────────────
NAVY        = colors.HexColor("#0f2044")
BLUE        = colors.HexColor("#1d4ed8")
LIGHTBLUE   = colors.HexColor("#dbeafe")
TEAL        = colors.HexColor("#0d9488")
LIGHTTEAL   = colors.HexColor("#ccfbf1")
ORANGE      = colors.HexColor("#ea580c")
LIGHTORANGE = colors.HexColor("#fff7ed")
PURPLE      = colors.HexColor("#7c3aed")
LIGHTPURPLE = colors.HexColor("#ede9fe")
GREEN       = colors.HexColor("#16a34a")
LIGHTGREEN  = colors.HexColor("#dcfce7")
GREY        = colors.HexColor("#f1f5f9")
MIDGREY     = colors.HexColor("#e2e8f0")
DARKGREY    = colors.HexColor("#475569")
BLACK       = colors.HexColor("#0f172a")
WHITE       = colors.white
RED         = colors.HexColor("#dc2626")
GOLD        = colors.HexColor("#d97706")
LIGHTGOLD   = colors.HexColor("#fef3c7")
INDIGO      = colors.HexColor("#4338ca")
LIGHTINDIGO = colors.HexColor("#e0e7ff")

W, H = A4

# ── Helper flowable: coloured banner ────────────────────────────────────────
class Banner(Flowable):
    def __init__(self, text, bg=NAVY, fg=WHITE, height=30, fontsize=14):
        super().__init__()
        self.text = text; self.bg = bg; self.fg = fg
        self.bh = height; self.fontsize = fontsize
        self.width = W - 4*cm; self.height = height + 4

    def draw(self):
        self.canv.setFillColor(self.bg)
        self.canv.roundRect(0, 0, self.width, self.bh, 7, fill=1, stroke=0)
        self.canv.setFillColor(self.fg)
        self.canv.setFont("Helvetica-Bold", self.fontsize)
        self.canv.drawString(14, (self.bh - self.fontsize) / 2 + 2, self.text)


class CodeBox(Flowable):
    """Dark code block."""
    def __init__(self, lines, width=None):
        super().__init__()
        self.lines = lines
        self.width = width or (W - 4*cm)
        self.height = len(lines) * 14 + 20

    def draw(self):
        self.canv.setFillColor(colors.HexColor("#1e293b"))
        self.canv.roundRect(0, 0, self.width, self.height, 6, fill=1, stroke=0)
        # line numbers gutter
        self.canv.setFillColor(colors.HexColor("#334155"))
        self.canv.rect(0, 0, 28, self.height, fill=1, stroke=0)
        y = self.height - 14
        line_num = 1
        for line in self.lines:
            if line.strip():
                self.canv.setFillColor(colors.HexColor("#64748b"))
                self.canv.setFont("Courier", 7.5)
                self.canv.drawString(5, y, str(line_num))
            # syntax colour
            stripped = line.lstrip()
            if stripped.startswith("/*") or stripped.startswith("//"):
                clr = colors.HexColor("#6ee7b7")   # green – comments
            elif stripped.startswith("@"):
                clr = colors.HexColor("#f9a8d4")   # pink – at-rules
            elif ":" in stripped and not stripped.startswith("<") and not stripped.startswith("}"):
                clr = colors.HexColor("#bae6fd")   # light-blue – declarations
            elif stripped.startswith(".") or stripped.startswith("#") or stripped.endswith("{"):
                clr = colors.HexColor("#fde68a")   # yellow – selectors
            elif stripped in ("}", "{", ""):
                clr = colors.HexColor("#94a3b8")
            else:
                clr = colors.HexColor("#e2e8f0")
            self.canv.setFillColor(clr)
            self.canv.setFont("Courier", 8.5)
            self.canv.drawString(34, y, line)
            y -= 14
            line_num += 1


class SideBar(Flowable):
    """Coloured left-border callout."""
    def __init__(self, text, bar_color=BLUE, bg=LIGHTBLUE, width=None, fontsize=9.5):
        super().__init__()
        self.text = text
        self.bar_color = bar_color
        self.bg = bg
        self.width = width or (W - 4*cm)
        self.fontsize = fontsize
        # estimate height
        chars_per_line = int(self.width / (fontsize * 0.55))
        lines = max(1, len(text) // chars_per_line + text.count("\n") + 1)
        self.height = lines * (fontsize + 4) + 16

    def draw(self):
        self.canv.setFillColor(self.bg)
        self.canv.roundRect(0, 0, self.width, self.height, 4, fill=1, stroke=0)
        self.canv.setFillColor(self.bar_color)
        self.canv.rect(0, 0, 5, self.height, fill=1, stroke=0)
        self.canv.setFillColor(colors.HexColor("#1e3a5f"))
        self.canv.setFont("Helvetica", self.fontsize)
        y = self.height - self.fontsize - 6
        max_w = self.width - 20
        words = self.text.split()
        line = ""
        for word in words:
            test = (line + " " + word).strip()
            if self.canv.stringWidth(test, "Helvetica", self.fontsize) < max_w:
                line = test
            else:
                self.canv.drawString(12, y, line)
                y -= self.fontsize + 3
                line = word
        if line:
            self.canv.drawString(12, y, line)


# ── Page template callbacks ──────────────────────────────────────────────────
def on_cover(canvas, doc):
    pass   # cover draws itself

def on_page(canvas, doc):
    canvas.saveState()
    # Top header
    canvas.setFillColor(NAVY)
    canvas.rect(0, H - 1.4*cm, W, 1.4*cm, fill=1, stroke=0)
    canvas.setFillColor(colors.HexColor("#3b82f6"))
    canvas.rect(0, H - 1.4*cm, 5, 1.4*cm, fill=1, stroke=0)
    canvas.setFillColor(WHITE)
    canvas.setFont("Helvetica-Bold", 8.5)
    canvas.drawString(1.8*cm, H - 0.95*cm, "Module 4  |  CSS Text, Backgrounds & Borders")
    canvas.setFont("Helvetica", 8.5)
    canvas.drawRightString(W - 1.8*cm, H - 0.95*cm, "Ethnotech Academy  —  Jaswanth Narne")

    # Footer
    canvas.setFillColor(GREY)
    canvas.rect(0, 0, W, 1.0*cm, fill=1, stroke=0)
    canvas.setFillColor(colors.HexColor("#3b82f6"))
    canvas.rect(0, 0, W, 2, fill=1, stroke=0)
    canvas.setFillColor(DARKGREY)
    canvas.setFont("Helvetica", 7.5)
    canvas.drawString(1.8*cm, 0.35*cm, "© Ethnotech Academy — For Student Use Only")
    canvas.drawRightString(W - 1.8*cm, 0.35*cm, f"Page {doc.page}")
    canvas.restoreState()

# ── Styles ───────────────────────────────────────────────────────────────────
def S(name, **kw):
    return ParagraphStyle(name, **kw)

h1 = S("h1", fontSize=20, textColor=NAVY, fontName="Helvetica-Bold",
        leading=26, spaceBefore=16, spaceAfter=5)
h2 = S("h2", fontSize=14, textColor=BLUE, fontName="Helvetica-Bold",
        leading=20, spaceBefore=12, spaceAfter=4)
h3 = S("h3", fontSize=11.5, textColor=TEAL, fontName="Helvetica-Bold",
        leading=16, spaceBefore=10, spaceAfter=3)
h4 = S("h4", fontSize=10.5, textColor=INDIGO, fontName="Helvetica-Bold",
        leading=15, spaceBefore=8, spaceAfter=2)
body = S("bd", fontSize=10, textColor=BLACK, fontName="Helvetica",
         leading=16, spaceAfter=5, alignment=TA_JUSTIFY)
bullet = S("bl", fontSize=10, textColor=BLACK, fontName="Helvetica",
           leading=15, leftIndent=18, spaceBefore=2,
           bulletIndent=7, bulletFontName="Helvetica")
tip_s  = S("tip", fontSize=9.5, textColor=colors.HexColor("#92400e"),
           fontName="Helvetica", leading=14, leftIndent=8, rightIndent=8)
note_s = S("note", fontSize=9.5, textColor=colors.HexColor("#1e40af"),
           fontName="Helvetica", leading=14, leftIndent=8, rightIndent=8)
warn_s = S("warn", fontSize=9.5, textColor=colors.HexColor("#7f1d1d"),
           fontName="Helvetica-Bold", leading=14, leftIndent=8, rightIndent=8)
toc_main = S("tm", fontSize=12, textColor=NAVY, fontName="Helvetica-Bold", leading=18)
toc_sub  = S("ts", fontSize=10.5, textColor=DARKGREY, fontName="Helvetica", leading=16)

def sp(n=6): return Spacer(1, n)

def tip_box(text, label="💡 Tip"):
    data = [[Paragraph(f"<b>{label}</b>", tip_s), Paragraph(text, tip_s)]]
    t = Table(data, colWidths=[2.2*cm, None])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), LIGHTORANGE),
        ("BOX", (0,0), (-1,-1), 1, ORANGE),
        ("VALIGN", (0,0), (-1,-1), "TOP"),
        ("TOPPADDING", (0,0), (-1,-1), 7),
        ("BOTTOMPADDING", (0,0), (-1,-1), 7),
        ("LEFTPADDING", (0,0), (-1,-1), 8),
        ("RIGHTPADDING", (0,0), (-1,-1), 8),
    ]))
    return t

def note_box(text, label="📝 Note"):
    data = [[Paragraph(f"<b>{label}</b>", note_s), Paragraph(text, note_s)]]
    t = Table(data, colWidths=[1.8*cm, None])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), LIGHTBLUE),
        ("BOX", (0,0), (-1,-1), 1, BLUE),
        ("VALIGN", (0,0), (-1,-1), "TOP"),
        ("TOPPADDING", (0,0), (-1,-1), 7),
        ("BOTTOMPADDING", (0,0), (-1,-1), 7),
        ("LEFTPADDING", (0,0), (-1,-1), 8),
        ("RIGHTPADDING", (0,0), (-1,-1), 8),
    ]))
    return t

def warn_box(text, label="⚠️ Warning"):
    data = [[Paragraph(f"<b>{label}</b>", warn_s), Paragraph(text, warn_s)]]
    t = Table(data, colWidths=[2*cm, None])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), colors.HexColor("#fef2f2")),
        ("BOX", (0,0), (-1,-1), 1.5, RED),
        ("VALIGN", (0,0), (-1,-1), "TOP"),
        ("TOPPADDING", (0,0), (-1,-1), 7),
        ("BOTTOMPADDING", (0,0), (-1,-1), 7),
        ("LEFTPADDING", (0,0), (-1,-1), 8),
        ("RIGHTPADDING", (0,0), (-1,-1), 8),
    ]))
    return t

def key_box(text, label="🔑 Key Concept"):
    data = [[Paragraph(f"<b>{label}</b>", S("ks", fontSize=9.5, fontName="Helvetica-Bold",
                                             textColor=colors.HexColor("#3b0764"), leading=14)),
             Paragraph(text, S("kv", fontSize=9.5, fontName="Helvetica",
                                textColor=colors.HexColor("#3b0764"), leading=14))]]
    t = Table(data, colWidths=[2.5*cm, None])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), LIGHTPURPLE),
        ("BOX", (0,0), (-1,-1), 1, PURPLE),
        ("VALIGN", (0,0), (-1,-1), "TOP"),
        ("TOPPADDING", (0,0), (-1,-1), 7),
        ("BOTTOMPADDING", (0,0), (-1,-1), 7),
        ("LEFTPADDING", (0,0), (-1,-1), 8),
        ("RIGHTPADDING", (0,0), (-1,-1), 8),
    ]))
    return t

def prop_table(rows, col_w=None):
    col_w = col_w or [4*cm, 5*cm, 9*cm]
    header = [Paragraph(h, S("th", fontSize=9, fontName="Helvetica-Bold", textColor=WHITE))
              for h in rows[0]]
    data = [header]
    for row in rows[1:]:
        data.append([Paragraph(str(c),
                     S("td", fontSize=9,
                       fontName="Courier" if i == 0 else "Helvetica",
                       textColor=colors.HexColor("#be185d") if i == 0 else BLACK,
                       leading=13))
                     for i, c in enumerate(row)])
    t = Table(data, colWidths=col_w, repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,0), NAVY),
        ("ROWBACKGROUNDS", (0,1), (-1,-1), [WHITE, GREY]),
        ("BOX", (0,0), (-1,-1), 0.5, MIDGREY),
        ("INNERGRID", (0,0), (-1,-1), 0.3, MIDGREY),
        ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
        ("TOPPADDING", (0,0), (-1,-1), 5),
        ("BOTTOMPADDING", (0,0), (-1,-1), 5),
        ("LEFTPADDING", (0,0), (-1,-1), 7),
    ]))
    return t

def compare_table(rows, col_w=None):
    """Two-column compare table."""
    col_w = col_w or [9*cm, 9*cm]
    header = [Paragraph(h, S("cth", fontSize=9.5, fontName="Helvetica-Bold", textColor=WHITE))
              for h in rows[0]]
    data = [header]
    for row in rows[1:]:
        data.append([Paragraph(str(c), S("ctd", fontSize=9, fontName="Helvetica",
                                          textColor=BLACK, leading=14))
                     for c in row])
    t = Table(data, colWidths=col_w, repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,0), TEAL),
        ("ROWBACKGROUNDS", (0,1), (-1,-1), [WHITE, LIGHTTEAL]),
        ("BOX", (0,0), (-1,-1), 0.5, TEAL),
        ("INNERGRID", (0,0), (-1,-1), 0.3, MIDGREY),
        ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
        ("TOPPADDING", (0,0), (-1,-1), 6),
        ("BOTTOMPADDING", (0,0), (-1,-1), 6),
        ("LEFTPADDING", (0,0), (-1,-1), 8),
    ]))
    return t

# ════════════════════════════════════════════════════════════════════
#  COVER PAGE
# ════════════════════════════════════════════════════════════════════
class CoverPage(Flowable):
    def draw(self):
        c = self.canv
        # Background gradient effect
        c.setFillColor(colors.HexColor("#080f2a"))
        c.rect(0, 0, W, H, fill=1, stroke=0)

        # Decorative arcs
        c.setFillColor(colors.HexColor("#1d3a6e"))
        c.circle(W + 40, H + 30, 260, fill=1, stroke=0)
        c.setFillColor(colors.HexColor("#0d2248"))
        c.circle(-40, -30, 180, fill=1, stroke=0)

        # Top accent bar
        c.setFillColor(BLUE)
        c.rect(0, H - 0.5*cm, W, 0.5*cm, fill=1, stroke=0)
        c.setFillColor(TEAL)
        c.rect(0, H - 0.8*cm, W*0.4, 0.3*cm, fill=1, stroke=0)

        # Academy badge
        c.setFillColor(TEAL)
        c.roundRect(W/2 - 100, H*0.85, 200, 32, 16, fill=1, stroke=0)
        c.setFillColor(WHITE)
        c.setFont("Helvetica-Bold", 12)
        c.drawCentredString(W/2, H*0.85 + 10, "ETHNOTECH ACADEMY")

        # Title block
        c.setFillColor(WHITE)
        c.setFont("Helvetica-Bold", 36)
        c.drawCentredString(W/2, H*0.68, "CSS Fundamentals")
        c.setFont("Helvetica-Bold", 28)
        c.setFillColor(colors.HexColor("#93c5fd"))
        c.drawCentredString(W/2, H*0.60, "Module 4")

        # Subtitle
        c.setFillColor(colors.HexColor("#bfdbfe"))
        c.setFont("Helvetica", 14)
        c.drawCentredString(W/2, H*0.53, "Text Formatting  ·  Backgrounds  ·  Borders")

        # Divider line
        c.setFillColor(TEAL)
        c.rect(W/2 - 80, H*0.50, 160, 2, fill=1, stroke=0)

        # Author line
        c.setFillColor(colors.HexColor("#94a3b8"))
        c.setFont("Helvetica", 11)
        c.drawCentredString(W/2, H*0.46, "Prepared by  Jaswanth Narne")

        # Pillars
        pillars = ["Text Formatting", "Backgrounds", "Borders"]
        pal     = [BLUE, TEAL, PURPLE]
        xs      = [W*0.22, W*0.5, W*0.78]
        for txt, col, x in zip(pillars, pal, xs):
            c.setFillColor(col)
            c.roundRect(x - 55, H*0.32, 110, 50, 8, fill=1, stroke=0)
            c.setFillColor(WHITE)
            c.setFont("Helvetica-Bold", 10)
            c.drawCentredString(x, H*0.32 + 18, txt)

        # Bottom strip
        c.setFillColor(colors.HexColor("#0b1630"))
        c.rect(0, 0, W, 2.2*cm, fill=1, stroke=0)
        c.setFillColor(colors.HexColor("#64748b"))
        c.setFont("Helvetica", 9)
        c.drawCentredString(W/2, 0.8*cm, "CSS Module 4  |  Complete Study Guide  |  Ethnotech Academy")

cp = CoverPage()
cp.width = W; cp.height = H

story = []
story.append(cp)
story.append(NextPageTemplate("Normal"))
story.append(PageBreak())

# ════════════════════════════════════════════════════════════════════
#  TABLE OF CONTENTS
# ════════════════════════════════════════════════════════════════════
story.append(Banner("📚  Table of Contents", bg=NAVY, height=36, fontsize=15))
story.append(sp(14))

toc_entries = [
    ("1", "CSS Text Formatting", "3", True),
    ("  1.1", "font-family — Setting the Typeface", "3", False),
    ("  1.2", "color — Setting Text Colour", "4", False),
    ("  1.3", "font-size — Controlling Text Size", "4", False),
    ("  1.4", "font-weight — Bold and Thin Text", "5", False),
    ("  1.5", "font-style — Italic and Oblique", "5", False),
    ("  1.6", "font-variant — Small Caps", "5", False),
    ("  1.7", "Link (Anchor) Colours & States", "6", False),
    ("  1.8", "text-align — Horizontal Alignment", "7", False),
    ("  1.9", "text-decoration — Lines on Text", "7", False),
    ("  1.10","text-indent — First-Line Indent", "8", False),
    ("  1.11","line-height — Vertical Spacing", "8", False),
    ("  1.12","word-wrap — Preventing Overflow", "9", False),
    ("  1.13","letter-spacing — Character Spacing", "9", False),
    ("2", "CSS Backgrounds", "10", True),
    ("  2.1", "background-color", "10", False),
    ("  2.2", "background-image", "10", False),
    ("  2.3", "background-position", "11", False),
    ("  2.4", "background-repeat", "12", False),
    ("  2.5", "background shorthand", "12", False),
    ("3", "CSS Borders", "13", True),
    ("  3.1", "border-color", "13", False),
    ("  3.2", "border-style — The Required Property", "13", False),
    ("  3.3", "border-width", "14", False),
    ("  3.4", "border shorthand & border-radius", "15", False),
    ("4", "Quick-Reference Cheatsheet", "16", True),
    ("5", "Practice Questions & Answers", "17", True),
]

toc_data = []
for num, title, pg, is_main in toc_entries:
    rs = toc_main if is_main else toc_sub
    ps = S("tp", fontSize=12 if is_main else 10.5,
           fontName="Helvetica-Bold" if is_main else "Helvetica",
           textColor=BLUE if is_main else DARKGREY,
           leading=16, alignment=TA_CENTER)
    toc_data.append([
        Paragraph(f"{num}  {title}", rs),
        Paragraph(pg, ps)
    ])

toc_tbl = Table(toc_data, colWidths=[14.5*cm, 2*cm])
toc_tbl.setStyle(TableStyle([
    ("ROWBACKGROUNDS", (0,0), (-1,-1), [WHITE, GREY]),
    ("TOPPADDING", (0,0), (-1,-1), 5),
    ("BOTTOMPADDING", (0,0), (-1,-1), 5),
    ("LEFTPADDING", (0,0), (0,-1), 10),
    ("LINEBELOW", (0,-1), (-1,-1), 0.4, MIDGREY),
]))
story.append(toc_tbl)
story.append(PageBreak())

# ════════════════════════════════════════════════════════════════════
#  SECTION 1 — CSS TEXT FORMATTING
# ════════════════════════════════════════════════════════════════════
story.append(Banner("Section 1  |  CSS Text Formatting", bg=NAVY, height=38, fontsize=17))
story.append(sp(10))
story.append(Paragraph(
    "Text formatting is the foundation of CSS. Every website you see relies on CSS text properties "
    "to control how words look — their typeface, size, colour, alignment, spacing, and decorations. "
    "Understanding each property thoroughly will allow you to style any text element with confidence.",
    body))
story.append(sp(10))

# ─── 1.1 font-family ────────────────────────────────────────────────────────
story.append(Banner("1.1  font-family", bg=BLUE, height=28, fontsize=13))
story.append(sp(8))
story.append(Paragraph(
    "The <b>font-family</b> property tells the browser which typeface to use for the text. "
    "You can list multiple fonts separated by commas — this is called a <b>font stack</b>. "
    "The browser reads the list left to right and uses the first font it finds installed on the user's computer. "
    "If none of the named fonts are available, the browser falls back to the last entry, "
    "which should always be a <b>generic family name</b>.", body))
story.append(sp(6))

story.append(Paragraph("<b>Generic Family Names (always use one as the last fallback):</b>", h4))
story.append(sp(4))
generic_data = [
    ["Generic Name", "Description", "Example Fonts"],
    ["serif",      "Fonts with small strokes (serifs) at ends of letters", "Georgia, Times New Roman"],
    ["sans-serif", "Fonts without serifs — clean and modern",              "Arial, Helvetica, Verdana"],
    ["monospace",  "Every character has equal width",                       "Courier New, Lucida Console"],
    ["cursive",    "Mimics handwriting",                                    "Comic Sans MS, Brush Script"],
    ["fantasy",    "Decorative / display fonts",                            "Impact, Papyrus"],
]
story.append(prop_table(generic_data, col_w=[3*cm, 7*cm, 8*cm]))
story.append(sp(8))

story.append(Paragraph("<b>Multi-word font names must be in quotes:</b>", h4))
story.append(sp(4))
story.append(CodeBox([
    "/* Single-word font names — no quotes needed */",
    "body {",
    "    font-family: Arial, Helvetica, sans-serif;",
    "}",
    "",
    "/* Multi-word font names — quotes required */",
    "h1 {",
    "    font-family: 'Times New Roman', 'Georgia', serif;",
    "}",
    "",
    "/* Recommended modern approach (Google Font style stack) */",
    "p {",
    "    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;",
    "}",
]))
story.append(sp(8))
story.append(tip_box(
    "Always end your font-family list with a generic name (serif, sans-serif, etc.). "
    "This guarantees text always displays correctly even if none of the named fonts are installed. "
    "Multi-word font names like 'Times New Roman' must be wrapped in single or double quotes."))
story.append(sp(12))

# ─── 1.2 color ───────────────────────────────────────────────────────────────
story.append(Banner("1.2  color — Setting Text Colour", bg=BLUE, height=28, fontsize=13))
story.append(sp(8))
story.append(Paragraph(
    "The <b>color</b> property sets the <b>foreground (text) colour</b> of an element. "
    "It only affects the text — not the background. "
    "CSS supports multiple colour formats.", body))
story.append(sp(6))

story.append(prop_table([
    ["Format", "Example", "Notes"],
    ["Named colour",    "color: red",              "147 CSS named colours. Simple but limited palette."],
    ["Hexadecimal",     "color: #ff0000",          "Most common. 6-digit hex: #RRGGBB. Short form: #f00."],
    ["rgb()",           "color: rgb(255, 0, 0)",   "Red, Green, Blue values from 0–255."],
    ["rgba()",          "color: rgba(255,0,0,0.5)","Same as rgb() but adds alpha (opacity) 0.0–1.0."],
    ["hsl()",           "color: hsl(0, 100%, 50%)","Hue (0-360°), Saturation %, Lightness %."],
    ["hsla()",          "color: hsla(0,100%,50%,0.8)","hsl() with alpha transparency."],
], col_w=[3.5*cm, 5.5*cm, 9*cm]))
story.append(sp(8))

story.append(CodeBox([
    "/* Various colour formats — all produce red */",
    "p.a { color: red; }",
    "p.b { color: #ff0000; }",
    "p.c { color: #f00; }              /* shorthand hex */",
    "p.d { color: rgb(255, 0, 0); }",
    "p.e { color: rgba(255, 0, 0, 0.7); }  /* 70% opacity */",
    "p.f { color: hsl(0, 100%, 50%); }",
]))
story.append(sp(8))
story.append(warn_box(
    "color sets TEXT colour only. To change the element's background colour, use background-color. "
    "Also note: CSS uses the American spelling 'color' (not 'colour')."))
story.append(sp(12))

# ─── 1.3 font-size ───────────────────────────────────────────────────────────
story.append(Banner("1.3  font-size — Controlling Text Size", bg=BLUE, height=28, fontsize=13))
story.append(sp(8))
story.append(Paragraph(
    "The <b>font-size</b> property sets how large the text appears. "
    "CSS provides several units — choosing the right unit matters for responsiveness and accessibility.", body))
story.append(sp(6))

story.append(compare_table([
    ["Unit", "How It Works — When to Use"],
    ["px  (pixels)",    "Absolute, fixed size. 16px = default browser size. Use for exact control."],
    ["em",              "Relative to the PARENT element's font-size. 2em = 2× parent size. Can compound when nested."],
    ["rem",             "Relative to the ROOT &lt;html&gt; font-size (usually 16px). More predictable than em. Preferred."],
    ["%  (percent)",    "Relative to parent font-size. 150% = 1.5× parent."],
    ["pt  (points)",    "Print unit (1pt = 1/72 inch). Mostly used for print stylesheets."],
    ["Named sizes",     "xx-small, x-small, small, medium, large, x-large, xx-large — rarely used today."],
], col_w=[3.5*cm, 14.5*cm]))
story.append(sp(8))

story.append(CodeBox([
    "body { font-size: 16px; }         /* base size */",
    "",
    "h1   { font-size: 2rem; }         /* 32px  — 2 × 16px root */",
    "h2   { font-size: 1.5rem; }       /* 24px */",
    "h3   { font-size: 1.25rem; }      /* 20px */",
    "p    { font-size: 1rem; }         /* 16px — same as root */",
    "small{ font-size: 0.875rem; }     /* 14px */",
    "",
    "/* em example — relative to parent */",
    ".parent { font-size: 20px; }",
    ".child  { font-size: 1.5em; }     /* 30px = 1.5 x 20px */",
]))
story.append(sp(8))
story.append(key_box(
    "rem is the recommended unit for font-size in modern CSS. "
    "It gives you consistent, predictable sizing across the whole page because it always "
    "refers back to the root element, never the parent."))
story.append(sp(12))

# ─── 1.4 font-weight ─────────────────────────────────────────────────────────
story.append(Banner("1.4  font-weight — Controlling Text Thickness", bg=BLUE, height=28, fontsize=13))
story.append(sp(8))
story.append(Paragraph(
    "The <b>font-weight</b> property controls how thick or thin the strokes of characters appear. "
    "You can use keyword values or numeric values from 100 to 900 (in multiples of 100).", body))
story.append(sp(6))

story.append(prop_table([
    ["Value", "Numeric Equiv.", "Description"],
    ["normal",     "400", "Default weight — standard thickness."],
    ["bold",       "700", "Bold text — the most common weight change."],
    ["lighter",    "–",   "One weight lighter than the parent element."],
    ["bolder",     "–",   "One weight heavier than the parent element."],
    ["100",        "100", "Thin (Hairline) — very light."],
    ["200",        "200", "Extra Light."],
    ["300",        "300", "Light."],
    ["400",        "400", "Normal (same as 'normal')."],
    ["500",        "500", "Medium."],
    ["600",        "600", "Semi Bold."],
    ["700",        "700", "Bold (same as 'bold')."],
    ["800",        "800", "Extra Bold."],
    ["900",        "900", "Black (Heavy)."],
], col_w=[3.5*cm, 3.5*cm, 11*cm]))
story.append(sp(8))

story.append(CodeBox([
    "h1 { font-weight: bold; }         /* same as 700 */",
    "h2 { font-weight: 600; }          /* semi-bold */",
    "p  { font-weight: normal; }       /* same as 400 */",
    "small { font-weight: 300; }       /* light */",
]))
story.append(sp(8))
story.append(note_box(
    "Not all fonts support every weight from 100–900. If the exact weight is not available, "
    "the browser picks the nearest available weight. Always check your font's supported weights."))
story.append(sp(12))

# ─── 1.5 font-style ──────────────────────────────────────────────────────────
story.append(Banner("1.5  font-style — Italic & Oblique", bg=BLUE, height=28, fontsize=13))
story.append(sp(8))
story.append(Paragraph(
    "The <b>font-style</b> property controls whether text is displayed upright, italic, or oblique.", body))
story.append(sp(6))

story.append(prop_table([
    ["Value",   "Description"],
    ["normal",  "Text is displayed upright. This is the default value."],
    ["italic",  "Uses the font's genuine italic variant (a specially designed slanted version). "
                "Preferred because it looks better and is designed by the font creator."],
    ["oblique", "Algorithmically slants the regular font if no italic variant exists. "
                "Can optionally specify angle: oblique 15deg."],
], col_w=[3*cm, 15*cm]))
story.append(sp(8))

story.append(CodeBox([
    "em       { font-style: italic; }   /* emphasis — use italic */",
    "cite     { font-style: italic; }   /* citations */",
    "blockquote { font-style: oblique; }",
    ".normal  { font-style: normal; }   /* reset italic back to normal */",
]))
story.append(sp(8))
story.append(tip_box(
    "Use italic for semantic emphasis (&lt;em&gt; tags). italic uses the designed slanted version of a font; "
    "oblique just mechanically tilts the regular version. Always prefer italic when the font supports it."))
story.append(sp(12))

# ─── 1.6 font-variant ────────────────────────────────────────────────────────
story.append(Banner("1.6  font-variant — Small Caps", bg=BLUE, height=28, fontsize=13))
story.append(sp(8))
story.append(Paragraph(
    "The <b>font-variant</b> property is most commonly used to display text in <b>small caps</b> — "
    "where lowercase letters appear as smaller versions of uppercase letters.", body))
story.append(sp(6))

story.append(prop_table([
    ["Value",       "Description"],
    ["normal",      "Text is displayed normally (default)."],
    ["small-caps",  "Lowercase letters are rendered as smaller uppercase letters. "
                    "The font's small-caps variant is used if available; otherwise the browser scales down uppercase letters."],
], col_w=[3.5*cm, 14.5*cm]))
story.append(sp(8))

story.append(CodeBox([
    "/* Small caps example */",
    ".subtitle {",
    "    font-variant: small-caps;",
    "    font-size: 1.1rem;",
    "}",
    "",
    "/* Result: 'hello world' appears as 'HELLO WORLD' */",
    "/* but the 'HELLO WORLD' part is in smaller size */",
]))
story.append(sp(8))
story.append(note_box(
    "small-caps is used for subheadings, chapter titles, and formal document headings. "
    "It gives text a classic, typographic feel without changing the actual letter case in the HTML."))
story.append(PageBreak())

# ─── 1.7 Link Colours ────────────────────────────────────────────────────────
story.append(Banner("1.7  Link (Anchor) Colours & States", bg=TEAL, height=30, fontsize=13))
story.append(sp(10))
story.append(Paragraph(
    "HTML anchor tags (<b>&lt;a&gt;</b>) have four interactive states. "
    "CSS provides <b>pseudo-classes</b> to style each state differently. "
    "These pseudo-classes must be declared in a specific order for them to work correctly.", body))
story.append(sp(8))

story.append(Paragraph(
    "<b>The four link pseudo-classes — remember: LoVe HAte</b>", h3))
story.append(sp(6))

story.append(prop_table([
    ["Pseudo-class", "When It Applies",               "What to Style"],
    ["a:link",       "Unvisited link (never clicked)",  "Default link appearance — usually blue, underlined."],
    ["a:visited",    "Link the user has already visited", "Usually changed to purple to show it was visited."],
    ["a:hover",      "Mouse cursor is hovering over the link", "Colour change, underline add/remove, cursor: pointer."],
    ["a:active",     "The moment the link is being clicked", "Briefly shows a pressed state — often a darker/brighter colour."],
], col_w=[3.5*cm, 6*cm, 8.5*cm]))
story.append(sp(8))

story.append(Paragraph(
    "<b>Why order matters — the LoVe HAte rule:</b>", h4))
story.append(sp(4))
story.append(Paragraph(
    "CSS reads rules from top to bottom. All four pseudo-classes have equal specificity, "
    "so the last one wins for overlapping states. "
    "If :hover comes before :visited, the hover style will never show for visited links. "
    "The correct order is: <b>L</b>ink → <b>V</b>isited → <b>H</b>over → <b>A</b>ctive", body))
story.append(sp(6))

story.append(CodeBox([
    "/* Correct order — LoVe HAte */",
    "",
    "a:link {",
    "    color: #1d4ed8;               /* blue for unvisited */",
    "    text-decoration: none;        /* remove underline */",
    "}",
    "",
    "a:visited {",
    "    color: #7c3aed;               /* purple for visited */",
    "}",
    "",
    "a:hover {",
    "    color: #ea580c;               /* orange on mouse-over */",
    "    text-decoration: underline;   /* show underline on hover */",
    "    cursor: pointer;              /* hand cursor */",
    "}",
    "",
    "a:active {",
    "    color: #dc2626;               /* red while clicking */",
    "    font-weight: bold;",
    "}",
]))
story.append(sp(8))
story.append(warn_box(
    "CRITICAL: Getting the LoVe HAte order wrong is one of the most common CSS mistakes. "
    "Wrong order = the wrong state colour shows up. Always declare them as: "
    ":link → :visited → :hover → :active."))
story.append(sp(10))

story.append(Paragraph("<b>Styling links like buttons:</b>", h4))
story.append(sp(4))
story.append(CodeBox([
    "/* Transform a link into a styled button */",
    "a.btn {",
    "    display: inline-block;",
    "    background-color: #1d4ed8;",
    "    color: white;",
    "    padding: 10px 20px;",
    "    border-radius: 6px;",
    "    text-decoration: none;",
    "}",
    "a.btn:hover {",
    "    background-color: #1e40af;",
    "}",
]))
story.append(sp(12))

# ─── 1.8 text-align ──────────────────────────────────────────────────────────
story.append(Banner("1.8  text-align — Horizontal Alignment", bg=BLUE, height=28, fontsize=13))
story.append(sp(8))
story.append(Paragraph(
    "The <b>text-align</b> property controls the horizontal alignment of text "
    "inside a <b>block-level element</b> (like &lt;p&gt;, &lt;div&gt;, &lt;h1&gt;–&lt;h6&gt;).", body))
story.append(sp(6))

story.append(prop_table([
    ["Value",   "Behaviour"],
    ["left",    "Text is aligned to the left edge. This is the DEFAULT for left-to-right languages."],
    ["right",   "Text is aligned to the right edge. Used for prices, dates, RTL languages."],
    ["center",  "Text is centred horizontally within the element."],
    ["justify", "Text is spread so both the left AND right edges are straight "
                "(like a newspaper column). The last line remains left-aligned."],
    ["start",   "Aligns to the start of the text direction (left for LTR, right for RTL). Modern CSS."],
    ["end",     "Aligns to the end of the text direction. Modern CSS."],
], col_w=[3*cm, 15*cm]))
story.append(sp(8))

story.append(CodeBox([
    "h1      { text-align: center; }",
    "p       { text-align: justify; }    /* newspaper-style */",
    ".price  { text-align: right; }",
    ".reset  { text-align: left; }       /* override inherited alignment */",
]))
story.append(sp(8))
story.append(note_box(
    "text-align only works on block-level elements. It has no effect on inline elements "
    "unless they are given display: block or display: inline-block."))
story.append(sp(12))

# ─── 1.9 text-decoration ─────────────────────────────────────────────────────
story.append(Banner("1.9  text-decoration — Lines on Text", bg=BLUE, height=28, fontsize=13))
story.append(sp(8))
story.append(Paragraph(
    "The <b>text-decoration</b> property adds or removes lines from text. "
    "It is most commonly used to remove the default underline from hyperlinks "
    "or to add strikethrough for deleted content.", body))
story.append(sp(6))

story.append(prop_table([
    ["Value",        "Description"],
    ["none",         "Removes any decoration. Most commonly used to remove underlines from &lt;a&gt; tags."],
    ["underline",    "Draws a line below the text. Default for hyperlinks."],
    ["overline",     "Draws a line above the text. Rarely used in practice."],
    ["line-through", "Draws a horizontal line through the middle of the text — shows deleted/struck content."],
    ["blink",        "Makes text blink. Deprecated — do not use."],
], col_w=[3.5*cm, 14.5*cm]))
story.append(sp(8))

story.append(Paragraph("<b>Extended syntax (CSS3) — text-decoration is a shorthand:</b>", h4))
story.append(sp(4))
story.append(CodeBox([
    "/* Basic usage */",
    "a           { text-decoration: none; }        /* remove underline */",
    "del         { text-decoration: line-through; }",
    "abbr        { text-decoration: underline; }",
    "",
    "/* CSS3 extended shorthand: line  style  color  thickness */",
    ".custom {",
    "    text-decoration: underline wavy #ea580c 2px;",
    "}",
    "",
    "/* Individual sub-properties */",
    ".styled {",
    "    text-decoration-line:   underline;",
    "    text-decoration-style:  dashed;     /* solid|dotted|dashed|wavy|double */",
    "    text-decoration-color:  #1d4ed8;",
    "}",
]))
story.append(sp(8))
story.append(tip_box(
    "The most important use of text-decoration: none is removing underlines from navigation links. "
    "Designers commonly remove the default underline and then add it back on :hover for a cleaner look."))
story.append(PageBreak())

# ─── 1.10 text-indent ────────────────────────────────────────────────────────
story.append(Banner("1.10  text-indent — First-Line Indentation", bg=BLUE, height=28, fontsize=13))
story.append(sp(8))
story.append(Paragraph(
    "The <b>text-indent</b> property indents <b>only the first line</b> of a block of text. "
    "It is commonly used in editorial and book-style layouts.", body))
story.append(sp(6))

story.append(prop_table([
    ["Value",        "Example",     "Notes"],
    ["Length (px)",  "30px",        "Fixed pixel indent on the first line."],
    ["Length (em)",  "2em",         "Relative to font-size. 2em = 2× font-size. Preferred."],
    ["Percentage",   "5%",          "Relative to the containing element's width."],
    ["Negative",     "-30px",       "Creates a hanging indent (first line sticks out to the left)."],
], col_w=[3.5*cm, 3.5*cm, 11*cm]))
story.append(sp(8))

story.append(CodeBox([
    "/* Standard paragraph indent */",
    "p {",
    "    text-indent: 2em;",
    "}",
    "",
    "/* Hanging indent — first line protrudes left */",
    ".hanging {",
    "    text-indent: -2em;",
    "    padding-left: 2em;   /* compensate so text doesn't go off-screen */",
    "}",
    "",
    "/* Reset indent on specific paragraph */",
    ".no-indent {",
    "    text-indent: 0;",
    "}",
]))
story.append(sp(8))
story.append(warn_box(
    "text-indent ONLY affects the first line of a paragraph. "
    "If you want to indent ALL lines, use padding-left instead. "
    "This is a very commonly tested point."))
story.append(sp(12))

# ─── 1.11 line-height ────────────────────────────────────────────────────────
story.append(Banner("1.11  line-height — Vertical Line Spacing", bg=BLUE, height=28, fontsize=13))
story.append(sp(8))
story.append(Paragraph(
    "The <b>line-height</b> property sets the height of a single line of text — "
    "essentially the vertical space between lines. "
    "Good line-height greatly improves readability.", body))
story.append(sp(6))

story.append(compare_table([
    ["Unit / Value",      "How It Works"],
    ["Unitless (1.5)",    "RECOMMENDED. Multiplied by the element's own font-size. "
                          "1.5 means the line height = 1.5 × font-size. Scales automatically."],
    ["px (24px)",         "Fixed — does not scale with font-size changes. Avoid for responsive design."],
    ["em (1.5em)",        "Relative to parent font-size. Can cause compounding issues when nested."],
    ["% (150%)",          "Percentage of font-size. Same result as unitless but less readable in code."],
    ["normal",            "Browser default, usually around 1.2. Differs across browsers."],
], col_w=[4*cm, 14*cm]))
story.append(sp(8))

story.append(CodeBox([
    "/* Best practice — unitless line-height */",
    "body {",
    "    font-size: 16px;",
    "    line-height: 1.6;     /* 16px × 1.6 = 25.6px per line */",
    "}",
    "",
    "h1 { line-height: 1.2; } /* headings need tighter spacing */",
    "p  { line-height: 1.7; } /* body text needs more breathing room */",
    "",
    "/* The vertical rhythm — space between lines */",
    "/* font-size: 20px   line-height: 1.5  → 30px per line */",
    "/* font-size: 20px   line-height: 2.0  → 40px per line */",
]))
story.append(sp(8))
story.append(key_box(
    "Always use a unitless value for line-height. It is the most reliable unit because "
    "it multiplies the element's OWN font-size, not the parent's. "
    "The recommended reading line-height is 1.4 to 1.8 for body text."))
story.append(sp(12))

# ─── 1.12 word-wrap ──────────────────────────────────────────────────────────
story.append(Banner("1.12  word-wrap — Preventing Text Overflow", bg=BLUE, height=28, fontsize=13))
story.append(sp(8))
story.append(Paragraph(
    "The <b>word-wrap</b> property (also known as <b>overflow-wrap</b> in modern CSS) "
    "controls what happens when a word is too long to fit within its container. "
    "Without this property, a very long word (like a URL) can break the layout.", body))
story.append(sp(6))

story.append(prop_table([
    ["Value",        "Description"],
    ["normal",       "Default. Words are not broken. Long words may overflow their container."],
    ["break-word",   "Allows long words to be broken and wrapped onto the next line to prevent overflow. "
                     "The break happens at an arbitrary point in the word if necessary."],
    ["anywhere",     "Similar to break-word but also considered for min-content sizing. Modern CSS."],
], col_w=[3.5*cm, 14.5*cm]))
story.append(sp(8))

story.append(CodeBox([
    "/* Prevent long URLs and words from breaking layouts */",
    ".card {",
    "    word-wrap: break-word;  /* old but widely supported */",
    "}",
    "",
    "/* Modern equivalent */",
    ".card {",
    "    overflow-wrap: break-word;",
    "}",
    "",
    "/* Also useful: word-break */",
    ".strict { word-break: break-all; }  /* breaks anywhere, even mid-word */",
    ".normal { word-break: normal; }     /* only break at allowed break points */",
]))
story.append(sp(8))
story.append(note_box(
    "word-wrap: break-word is the most commonly tested value. "
    "It is most useful for containers with a fixed width where long strings (URLs, filenames) might overflow."))
story.append(sp(12))

# ─── 1.13 letter-spacing ─────────────────────────────────────────────────────
story.append(Banner("1.13  letter-spacing — Character Spacing (Tracking)", bg=BLUE, height=28, fontsize=13))
story.append(sp(8))
story.append(Paragraph(
    "The <b>letter-spacing</b> property adds or reduces space between individual characters in text. "
    "In typography this is called <b>tracking</b>. "
    "Increasing letter-spacing on headings can make them feel more elegant and airy.", body))
story.append(sp(6))

story.append(prop_table([
    ["Value",     "Example",       "Effect"],
    ["normal",    "normal",        "Default browser spacing between characters."],
    ["px value",  "letter-spacing: 3px",   "Adds 3px of extra space after each character."],
    ["em value",  "letter-spacing: 0.1em", "Scales with font-size. Preferred for headings."],
    ["negative",  "letter-spacing: -1px",  "Reduces space between characters (tighter tracking). Use sparingly."],
], col_w=[3*cm, 5*cm, 10*cm]))
story.append(sp(8))

story.append(CodeBox([
    "/* Elegant spaced heading */",
    "h1 {",
    "    letter-spacing: 0.08em;   /* 8% of font-size between each char */",
    "    text-transform: uppercase;",
    "}",
    "",
    "/* Tight monogram / logo text */",
    ".logo {",
    "    letter-spacing: -0.02em;  /* slightly tighter */",
    "    font-weight: 700;",
    "}",
    "",
    "/* Normal text — reset if inherited */",
    "p { letter-spacing: normal; }",
]))
story.append(sp(8))
story.append(tip_box(
    "Do not confuse letter-spacing (space between characters) with word-spacing (space between words). "
    "letter-spacing affects the gap after EACH character. "
    "There is no property called 'font-spacing' or 'character-spacing'."))
story.append(PageBreak())

# ════════════════════════════════════════════════════════════════════
#  SECTION 2 — CSS BACKGROUNDS
# ════════════════════════════════════════════════════════════════════
story.append(Banner("Section 2  |  CSS Backgrounds", bg=NAVY, height=38, fontsize=17))
story.append(sp(10))
story.append(Paragraph(
    "Background properties control what appears behind an element's content. "
    "You can set a solid colour, a gradient, or an image — and control its position, size, and repetition. "
    "These properties are essential for building visually rich layouts.", body))
story.append(sp(10))

# ─── 2.1 background-color ─────────────────────────────────────────────────────
story.append(Banner("2.1  background-color", bg=TEAL, height=28, fontsize=13))
story.append(sp(8))
story.append(Paragraph(
    "The <b>background-color</b> property fills the <b>background area</b> of an element with a solid colour. "
    "This includes the content area and the padding, but not the margin.", body))
story.append(sp(6))

story.append(prop_table([
    ["Value",           "Example",                      "Notes"],
    ["Named colour",    "background-color: white",       "Simple, limited palette."],
    ["Hex colour",      "background-color: #f0f9ff",     "Most commonly used in practice."],
    ["rgb/rgba",        "background-color: rgba(0,0,0,0.5)", "rgba useful for semi-transparent overlays."],
    ["transparent",     "background-color: transparent", "The DEFAULT value — shows parent background through."],
    ["inherit",         "background-color: inherit",     "Inherits the parent's background-color."],
], col_w=[3.5*cm, 6*cm, 8.5*cm]))
story.append(sp(8))

story.append(CodeBox([
    "/* Page background */",
    "body {",
    "    background-color: #f8fafc;",
    "}",
    "",
    "/* Card with white background */",
    ".card {",
    "    background-color: #ffffff;",
    "}",
    "",
    "/* Semi-transparent dark overlay (e.g., modal backdrop) */",
    ".overlay {",
    "    background-color: rgba(0, 0, 0, 0.6);",
    "}",
    "",
    "/* Highlight / alert boxes */",
    ".success { background-color: #dcfce7; }  /* light green */",
    ".error   { background-color: #fee2e2; }  /* light red */",
    ".warning { background-color: #fef3c7; }  /* light yellow */",
]))
story.append(sp(8))
story.append(note_box(
    "background-color is always shown BEHIND background-image. "
    "When using a background image, always set a background-color as a fallback "
    "in case the image fails to load."))
story.append(sp(12))

# ─── 2.2 background-image ─────────────────────────────────────────────────────
story.append(Banner("2.2  background-image", bg=TEAL, height=28, fontsize=13))
story.append(sp(8))
story.append(Paragraph(
    "The <b>background-image</b> property sets an image (or gradient) as the background of an element. "
    "The image is placed <b>on top</b> of the background-color.", body))
story.append(sp(6))

story.append(prop_table([
    ["Value",             "Example",                               "Notes"],
    ["url()",             "background-image: url('img.jpg')",       "Path to an image file. Can be relative or absolute."],
    ["none",              "background-image: none",                 "Default. No background image."],
    ["linear-gradient()", "background-image: linear-gradient(…)",   "Creates a smooth colour gradient."],
    ["radial-gradient()", "background-image: radial-gradient(…)",   "Creates a circular/elliptical gradient."],
    ["Multiple images",   "url('top.png'), url('bottom.png')",      "Multiple images layered (first listed is on top)."],
], col_w=[4*cm, 6*cm, 8*cm]))
story.append(sp(8))

story.append(CodeBox([
    "/* Image background */",
    "body {",
    "    background-color: #0f172a;        /* fallback colour */",
    "    background-image: url('hero.jpg');",
    "}",
    "",
    "/* Linear gradient — left to right */",
    "header {",
    "    background-image: linear-gradient(to right, #0f2044, #1d4ed8);",
    "}",
    "",
    "/* Radial gradient — circular burst */",
    ".hero {",
    "    background-image: radial-gradient(circle at center, #1d4ed8, #0f172a);",
    "}",
    "",
    "/* Remove background image */",
    ".reset { background-image: none; }",
]))
story.append(sp(8))
story.append(tip_box(
    "Always pair background-image with a background-color as a fallback. "
    "If the image path is wrong or slow to load, the colour shows immediately. "
    "The image renders ON TOP of the colour."))
story.append(sp(12))

# ─── 2.3 background-position ──────────────────────────────────────────────────
story.append(Banner("2.3  background-position", bg=TEAL, height=28, fontsize=13))
story.append(sp(8))
story.append(Paragraph(
    "The <b>background-position</b> property sets the starting position of the background image "
    "within its container. It takes two values: <b>horizontal</b> then <b>vertical</b>.", body))
story.append(sp(6))

story.append(prop_table([
    ["Format",              "Example",                   "Description"],
    ["Keywords",            "center center",             "Use keyword pairs: left|center|right  top|center|bottom."],
    ["Percentage",          "50% 50%",                   "50% 50% = centred. 0% 0% = top-left. 100% 100% = bottom-right."],
    ["Length values",       "20px 40px",                 "Exact pixel offset from top-left of the element."],
    ["Mixed",               "center 20px",               "Mix keywords and lengths. Horizontal keyword, vertical px."],
], col_w=[4*cm, 4.5*cm, 9.5*cm]))
story.append(sp(8))

story.append(Paragraph("<b>Visual keyword positions:</b>", h4))
story.append(sp(4))

# Position grid table
pos_data = [
    [Paragraph("<b>top left</b>", S("pg",fontSize=9,fontName="Helvetica-Bold",textColor=NAVY,alignment=TA_CENTER)),
     Paragraph("<b>top center</b>", S("pg",fontSize=9,fontName="Helvetica-Bold",textColor=NAVY,alignment=TA_CENTER)),
     Paragraph("<b>top right</b>", S("pg",fontSize=9,fontName="Helvetica-Bold",textColor=NAVY,alignment=TA_CENTER))],
    [Paragraph("center left", S("pg2",fontSize=9,fontName="Helvetica",textColor=DARKGREY,alignment=TA_CENTER)),
     Paragraph("center  (default)", S("pg3",fontSize=9,fontName="Helvetica-Bold",textColor=BLUE,alignment=TA_CENTER)),
     Paragraph("center right", S("pg2",fontSize=9,fontName="Helvetica",textColor=DARKGREY,alignment=TA_CENTER))],
    [Paragraph("bottom left", S("pg2",fontSize=9,fontName="Helvetica",textColor=DARKGREY,alignment=TA_CENTER)),
     Paragraph("bottom center", S("pg2",fontSize=9,fontName="Helvetica",textColor=DARKGREY,alignment=TA_CENTER)),
     Paragraph("bottom right", S("pg2",fontSize=9,fontName="Helvetica",textColor=DARKGREY,alignment=TA_CENTER))],
]
pos_tbl = Table(pos_data, colWidths=[5*cm, 5*cm, 5*cm])
pos_tbl.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (-1,-1), GREY),
    ("BACKGROUND", (1,1), (1,1), LIGHTBLUE),
    ("GRID", (0,0), (-1,-1), 0.5, MIDGREY),
    ("TOPPADDING", (0,0), (-1,-1), 10),
    ("BOTTOMPADDING", (0,0), (-1,-1), 10),
    ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
]))
story.append(pos_tbl)
story.append(sp(8))

story.append(CodeBox([
    "/* Centre the background image */",
    "body {",
    "    background-position: center center;   /* or just: center */",
    "}",
    "",
    "/* Pin image to top-right corner */",
    ".banner {",
    "    background-position: top right;",
    "}",
    "",
    "/* Offset with pixels */",
    ".custom {",
    "    background-position: 20px 50px;       /* 20px from left, 50px from top */",
    "}",
]))
story.append(sp(12))

# ─── 2.4 background-repeat ────────────────────────────────────────────────────
story.append(Banner("2.4  background-repeat", bg=TEAL, height=28, fontsize=13))
story.append(sp(8))
story.append(Paragraph(
    "By default, background images tile (repeat) both horizontally and vertically to fill the element. "
    "The <b>background-repeat</b> property controls this tiling behaviour.", body))
story.append(sp(6))

story.append(prop_table([
    ["Value",       "Description"],
    ["repeat",      "DEFAULT. The image tiles in both directions (horizontally and vertically) to fill the element."],
    ["no-repeat",   "The image is shown exactly once — no tiling. Most common for hero/banner images."],
    ["repeat-x",    "Tiles only horizontally (left to right). Useful for header background patterns."],
    ["repeat-y",    "Tiles only vertically (top to bottom). Useful for side border patterns."],
    ["round",       "Tiles the image but scales it so no partial tiles appear at the edges."],
    ["space",       "Tiles the image with equal spacing between tiles — no cropping."],
], col_w=[3.5*cm, 14.5*cm]))
story.append(sp(8))

story.append(CodeBox([
    "/* Full-page hero image — shown once, no tiling */",
    "body {",
    "    background-image:  url('hero.jpg');",
    "    background-repeat: no-repeat;",
    "}",
    "",
    "/* Horizontal texture strip at the top */",
    "header {",
    "    background-image:  url('stripe.png');",
    "    background-repeat: repeat-x;",
    "}",
    "",
    "/* Small icon watermark — tile everywhere */",
    ".watermark {",
    "    background-image:  url('logo-faint.png');",
    "    background-repeat: repeat;   /* default — could omit */",
    "}",
]))
story.append(sp(8))
story.append(tip_box(
    "The most common exam scenario: 'Display a background image centred without repeating.' "
    "Answer: background-repeat: no-repeat  +  background-position: center  +  background-size: cover."))
story.append(sp(10))

# ─── 2.5 background shorthand ─────────────────────────────────────────────────
story.append(Banner("2.5  background Shorthand Property", bg=TEAL, height=28, fontsize=13))
story.append(sp(8))
story.append(Paragraph(
    "The <b>background</b> shorthand lets you set all background sub-properties in a single declaration. "
    "The order is: <b>color  image  repeat  position / size</b>", body))
story.append(sp(6))

story.append(CodeBox([
    "/* Long-hand (explicit each property) */",
    "body {",
    "    background-color:    #0f172a;",
    "    background-image:    url('hero.jpg');",
    "    background-repeat:   no-repeat;",
    "    background-position: center center;",
    "    background-size:     cover;",
    "}",
    "",
    "/* Equivalent shorthand */",
    "body {",
    "    background: #0f172a url('hero.jpg') no-repeat center / cover;",
    "}          /* ^color  ^image           ^repeat    ^position / ^size */",
    "",
    "/* Gradient shorthand */",
    "header {",
    "    background: linear-gradient(to bottom, #1d4ed8, #0f172a) no-repeat;",
    "}",
]))
story.append(sp(8))
story.append(note_box(
    "Not all values are required in the shorthand. "
    "Any omitted values reset to their defaults. "
    "The slash (/) separates background-position from background-size: position / size."))
story.append(PageBreak())

# ════════════════════════════════════════════════════════════════════
#  SECTION 3 — CSS BORDERS
# ════════════════════════════════════════════════════════════════════
story.append(Banner("Section 3  |  CSS Borders", bg=NAVY, height=38, fontsize=17))
story.append(sp(10))
story.append(Paragraph(
    "Border properties add frames around HTML elements. "
    "A CSS border has three core components: its <b>colour</b>, <b>style</b>, and <b>width</b>. "
    "All three work together — but <b>border-style is the only mandatory one</b>. "
    "Without it, no border appears at all.", body))
story.append(sp(10))

# ─── 3.1 border-color ────────────────────────────────────────────────────────
story.append(Banner("3.1  border-color", bg=PURPLE, height=28, fontsize=13))
story.append(sp(8))
story.append(Paragraph(
    "The <b>border-color</b> property sets the colour of the element's border. "
    "It accepts the same colour formats as the <b>color</b> property "
    "(named, hex, rgb, rgba, hsl, hsla).", body))
story.append(sp(6))

story.append(prop_table([
    ["Usage",                  "Example",                         "Notes"],
    ["All sides same",         "border-color: red",               "Sets all four sides to red."],
    ["Top/Bottom Left/Right",  "border-color: red blue",          "2 values: top-bottom  left-right."],
    ["Top Right Bottom Left",  "border-color: red blue green orange", "4 values: clockwise from top."],
    ["transparent",            "border-color: transparent",       "Makes border invisible but reserves the space."],
    ["currentColor",           "border-color: currentColor",      "Inherits the element's text colour."],
], col_w=[4.5*cm, 5.5*cm, 8*cm]))
story.append(sp(8))

story.append(CodeBox([
    "/* Single colour — all sides */",
    ".box { border-color: #1d4ed8; }",
    "",
    "/* Different colour per side */",
    ".fancy {",
    "    border-color: red blue green orange;",
    "}          /* top  right  bottom  left (clockwise) */",
    "",
    "/* Transparent border — reserves space (useful for hover effects) */",
    "nav a {",
    "    border-bottom: 3px solid transparent;  /* space reserved */",
    "}",
    "nav a:hover {",
    "    border-bottom-color: #1d4ed8;          /* colour appears on hover */",
    "}",
]))
story.append(sp(8))
story.append(note_box(
    "If you set border-color without also setting border-style, "
    "NO border will be visible. border-style is always required."))
story.append(sp(12))

# ─── 3.2 border-style ────────────────────────────────────────────────────────
story.append(Banner("3.2  border-style — The REQUIRED Property", bg=PURPLE, height=28, fontsize=13))
story.append(sp(8))
story.append(Paragraph(
    "The <b>border-style</b> property specifies the visual style of the border line. "
    "This is the <b>only border property that is required</b> for a border to appear. "
    "Without border-style, setting border-color or border-width has no visible effect.", body))
story.append(sp(6))

story.append(prop_table([
    ["Value",    "Appearance",              "When to Use"],
    ["none",     "No border (default)",     "Remove borders explicitly."],
    ["solid",    "A continuous solid line", "Most common. Clean and professional."],
    ["dashed",   "A series of short dashes","Separators, callout boxes, form fields."],
    ["dotted",   "A series of dots",        "Subtle borders, focus indicators."],
    ["double",   "Two parallel solid lines","Decorative — formal/classic look."],
    ["groove",   "Carved-in 3D effect",     "Legacy/retro UI style."],
    ["ridge",    "Raised 3D effect",        "Legacy/retro UI style."],
    ["inset",    "Box looks pressed in",    "Legacy button effects."],
    ["outset",   "Box looks raised out",    "Legacy button effects."],
    ["hidden",   "No border but space kept","Used in table border collapse."],
], col_w=[3*cm, 5*cm, 10*cm]))
story.append(sp(8))

story.append(CodeBox([
    "/* Most common styles */",
    ".solid   { border-style: solid; }",
    ".dashed  { border-style: dashed; }",
    ".dotted  { border-style: dotted; }",
    ".double  { border-style: double; }",
    "",
    "/* Multiple styles — one per side */",
    ".mixed {",
    "    border-style: solid dashed dotted double;",
    "}         /* top   right  bottom  left */",
    "",
    "/* Only top and bottom borders */",
    ".separator {",
    "    border-top-style:    solid;",
    "    border-bottom-style: solid;",
    "    border-left-style:   none;",
    "    border-right-style:  none;",
    "}",
]))
story.append(sp(8))
story.append(warn_box(
    "CRITICAL RULE: border-style must be set for any border to appear. "
    "Setting only border-color: red will show NOTHING. "
    "Setting only border-width: 3px will show NOTHING. "
    "You MUST include border-style."))
story.append(sp(12))

# ─── 3.3 border-width ────────────────────────────────────────────────────────
story.append(Banner("3.3  border-width — Controlling Border Thickness", bg=PURPLE, height=28, fontsize=13))
story.append(sp(8))
story.append(Paragraph(
    "The <b>border-width</b> property sets the thickness (width) of the border. "
    "Like border-color and border-style, it can set all sides at once or each side individually.", body))
story.append(sp(6))

story.append(prop_table([
    ["Value",          "Example",                "Description"],
    ["Length in px",   "border-width: 2px",      "Most common. Sets all 4 sides to 2px thick."],
    ["thin",           "border-width: thin",     "Keyword = approximately 1px."],
    ["medium",         "border-width: medium",   "Keyword = approximately 3px. Browser default."],
    ["thick",          "border-width: thick",    "Keyword = approximately 5px."],
    ["2 values",       "border-width: 2px 5px",  "top+bottom = 2px, left+right = 5px."],
    ["4 values",       "border-width: 1px 2px 3px 4px", "top right bottom left (clockwise)."],
    ["Per side",       "border-top-width: 4px",  "Set thickness for one specific side only."],
], col_w=[4*cm, 5*cm, 9*cm]))
story.append(sp(8))

story.append(CodeBox([
    "/* Uniform border */",
    ".box {",
    "    border-width: 2px;",
    "    border-style: solid;",
    "    border-color: #1d4ed8;",
    "}",
    "",
    "/* Thick top, thin sides */",
    ".card {",
    "    border-width: 4px 1px 1px 1px;   /* top right bottom left */",
    "    border-style: solid;",
    "    border-color: #0d9488;",
    "}",
    "",
    "/* Only left border — sidebar accent */",
    ".quote {",
    "    border-left-width: 6px;",
    "    border-left-style: solid;",
    "    border-left-color: #7c3aed;",
    "    /* short: border-left: 6px solid #7c3aed; */",
    "}",
]))
story.append(sp(12))

# ─── 3.4 border shorthand ────────────────────────────────────────────────────
story.append(Banner("3.4  border Shorthand  &  border-radius", bg=PURPLE, height=28, fontsize=13))
story.append(sp(8))

story.append(Paragraph("<b>border Shorthand:</b>", h3))
story.append(sp(4))
story.append(Paragraph(
    "Instead of writing three separate declarations, you can use the <b>border</b> shorthand "
    "to set width, style, and colour in one line. The order is: <b>width  style  color</b>. "
    "Only border-style is required.", body))
story.append(sp(6))

story.append(CodeBox([
    "/* Shorthand: border: width style color */",
    ".basic  { border: 1px solid #ccc; }",
    ".bold   { border: 3px solid #1d4ed8; }",
    ".dashed { border: 2px dashed #ea580c; }",
    "",
    "/* Per-side shorthand */",
    ".top    { border-top:    4px solid #0d9488; }",
    ".right  { border-right:  1px dashed #94a3b8; }",
    ".bottom { border-bottom: 2px solid #1d4ed8; }",
    ".left   { border-left:   6px solid #7c3aed; }",
    "",
    "/* Style only — width defaults to medium, color to text color */",
    ".minimal { border: solid; }",
]))
story.append(sp(10))

story.append(Paragraph("<b>border-radius — Rounded Corners:</b>", h3))
story.append(sp(4))
story.append(Paragraph(
    "The <b>border-radius</b> property rounds the corners of an element's border box. "
    "It can even create a perfect circle! "
    "Note: border-radius works even without a visible border — "
    "it clips the background-color and background-image too.", body))
story.append(sp(6))

story.append(prop_table([
    ["Value",             "Example",                    "Result"],
    ["Single px",         "border-radius: 8px",         "All 4 corners rounded equally."],
    ["Percentage",        "border-radius: 50%",         "On a square: creates a perfect circle."],
    ["Large px",          "border-radius: 9999px",      "Fully rounded pill shape (for buttons)."],
    ["4 values",          "border-radius: 4px 8px 4px 8px", "TL TR BR BL (top-left clockwise)."],
    ["Per corner",        "border-top-left-radius: 12px","Sets one specific corner."],
], col_w=[4*cm, 5*cm, 9*cm]))
story.append(sp(8))

story.append(CodeBox([
    "/* Card with rounded corners */",
    ".card {",
    "    border: 1px solid #e2e8f0;",
    "    border-radius: 12px;",
    "    background-color: #ffffff;",
    "}",
    "",
    "/* Perfect circle avatar */",
    ".avatar {",
    "    width: 80px;",
    "    height: 80px;         /* must be equal width & height */",
    "    border: 3px solid #1d4ed8;",
    "    border-radius: 50%;   /* 50% = circle */",
    "}",
    "",
    "/* Pill-shaped button */",
    ".pill-btn {",
    "    border-radius: 9999px;",
    "    border: 2px solid #0d9488;",
    "    padding: 8px 24px;",
    "}",
    "",
    "/* Only top corners rounded (e.g., card header) */",
    ".card-header {",
    "    border-radius: 12px 12px 0 0;  /* TL TR BR BL */",
    "}",
]))
story.append(sp(8))
story.append(key_box(
    "border-radius: 50% creates a circle ONLY when the element has equal width and height. "
    "If width ≠ height, it creates an ellipse. "
    "Also, border-radius works on background colours and images even without a border-style."))
story.append(PageBreak())

# ════════════════════════════════════════════════════════════════════
#  SECTION 4 — QUICK REFERENCE CHEATSHEET
# ════════════════════════════════════════════════════════════════════
story.append(Banner("Section 4  |  Complete Quick-Reference Cheatsheet", bg=NAVY, height=38, fontsize=17))
story.append(sp(10))

cheat = [
    ["Property", "Key Values", "Critical Point to Remember"],
    # ── Text ──
    ["font-family", "'Arial', sans-serif", "End with generic name. Multi-word names in quotes."],
    ["color",        "#hex / rgb() / name", "TEXT colour only — not background."],
    ["font-size",    "16px / 1rem / 1.5em", "rem = relative to root. em = relative to parent."],
    ["font-weight",  "normal(400) / bold(700) / 100–900", "Must be multiples of 100."],
    ["font-style",   "normal / italic / oblique", "italic = designed; oblique = slanted algorithmically."],
    ["font-variant", "normal / small-caps", "small-caps = lowercase shown as smaller UPPERCASE."],
    ["a:link",       "color + text-decoration", "L — Unvisited link. Step 1 in LoVe HAte."],
    ["a:visited",    "color (often purple)", "V — Already visited link. Step 2."],
    ["a:hover",      "color / decoration change", "H — Mouse over link. Step 3."],
    ["a:active",     "color (darker/brighter)", "A — Link being clicked. Step 4."],
    ["text-align",   "left / center / right / justify", "Works on block elements only."],
    ["text-decoration","none / underline / line-through", "none = remove underline from links."],
    ["text-indent",  "2em / 30px", "FIRST LINE ONLY. Use padding-left for all lines."],
    ["line-height",  "1.5 (unitless)",        "Unitless is preferred — scales with font-size."],
    ["word-wrap",    "normal / break-word",   "break-word prevents long text from overflowing containers."],
    ["letter-spacing","0.05em / 2px / normal","Space between individual characters (tracking)."],
    # ── Backgrounds ──
    ["background-color", "#fff / transparent", "Solid fill behind content. Default = transparent."],
    ["background-image", "url('img.jpg') / none", "Layers ON TOP of background-color."],
    ["background-position","center / top right / 50% 50%","2 values: horizontal then vertical."],
    ["background-repeat","repeat / no-repeat / repeat-x","no-repeat = show image once, no tiling."],
    ["background (shorthand)","color image repeat position/size","Order matters. Slash before size."],
    # ── Borders ──
    ["border-color", "#hex / red / transparent", "Defaults to text color if not set."],
    ["border-style", "solid / dashed / dotted / none", "REQUIRED — without it no border shows."],
    ["border-width", "1px / thin / medium / thick", "T R B L shorthand. Clockwise."],
    ["border (shorthand)", "2px solid #333", "Order: width  style  color."],
    ["border-radius", "8px / 50% / 9999px", "50% on square = circle. Works without visible border."],
]

cheat_styled = []
for i, row in enumerate(cheat):
    if i == 0:
        cheat_styled.append([
            Paragraph(c, S(f"ch{j}", fontSize=9, fontName="Helvetica-Bold", textColor=WHITE))
            for j, c in enumerate(row)
        ])
    else:
        cheat_styled.append([
            Paragraph(row[0], S(f"cp{i}", fontSize=8.5, fontName="Courier",
                                textColor=colors.HexColor("#be185d"))),
            Paragraph(row[1], S(f"cv{i}", fontSize=8.5, fontName="Courier",
                                textColor=colors.HexColor("#0369a1"))),
            Paragraph(row[2], S(f"cn{i}", fontSize=8.5, fontName="Helvetica", textColor=BLACK)),
        ])

cheat_tbl = Table(cheat_styled, colWidths=[4.5*cm, 5*cm, 8.5*cm], repeatRows=1)
cheat_tbl.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (-1,0), NAVY),
    ("ROWBACKGROUNDS", (0,1), (-1,-1), [WHITE, GREY]),
    ("BOX", (0,0), (-1,-1), 0.5, MIDGREY),
    ("INNERGRID", (0,0), (-1,-1), 0.3, MIDGREY),
    ("TOPPADDING", (0,0), (-1,-1), 4),
    ("BOTTOMPADDING", (0,0), (-1,-1), 4),
    ("LEFTPADDING", (0,0), (-1,-1), 6),
    ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
]))
story.append(cheat_tbl)
story.append(PageBreak())

# ════════════════════════════════════════════════════════════════════
#  SECTION 5 — PRACTICE QUESTIONS & ANSWERS
# ════════════════════════════════════════════════════════════════════
story.append(Banner("Section 5  |  Practice Questions & Answers", bg=NAVY, height=38, fontsize=17))
story.append(sp(10))
story.append(Paragraph(
    "Test your understanding with these carefully designed questions. "
    "Each question targets a concept from Module 4. "
    "Read each question, choose your answer, then check the explanation.", body))
story.append(sp(10))

questions = [
    ("Q1",
     "Which CSS property is used to set the typeface (font) of text?",
     ["A) text-family", "B) font-family ✓", "C) typeface", "D) font-face"],
     "B — font-family sets the typeface. "
     "font-face is an @font-face rule used to load custom fonts, not to select them. "
     "Always include a generic fallback at the end of the list."),

    ("Q2",
     "What is the correct order for declaring link pseudo-class styles?",
     ["A) hover, active, link, visited",
      "B) link, visited, hover, active ✓",
      "C) visited, link, active, hover",
      "D) Any order works — order doesn't matter"],
     "B — The LoVe HAte rule: :link → :visited → :hover → :active. "
     "Wrong order causes specificity conflicts where one state overrides another incorrectly."),

    ("Q3",
     "Which value of background-repeat prevents the background image from tiling?",
     ["A) repeat-once", "B) single", "C) no-repeat ✓", "D) once"],
     "C — no-repeat shows the background image exactly once without any tiling."),

    ("Q4",
     "A developer sets border-color: red and border-width: 3px but no border appears. What is missing?",
     ["A) border-radius", "B) border-style ✓", "C) border-image", "D) Nothing — it should display"],
     "B — border-style is REQUIRED for any border to appear. "
     "Without border-style, neither border-color nor border-width has any visible effect."),

    ("Q5",
     "Which CSS property adds space between individual characters?",
     ["A) word-spacing", "B) text-spacing", "C) letter-spacing ✓", "D) char-spacing"],
     "C — letter-spacing controls the space between individual characters (tracking). "
     "word-spacing controls space between words. There is no 'text-spacing' or 'char-spacing'."),

    ("Q6",
     "To make a square &lt;div&gt; (100px x 100px) appear as a circle, you would apply:",
     ["A) border-style: round",
      "B) border-radius: 50% ✓",
      "C) shape: circle",
      "D) border-shape: circle"],
     "B — border-radius: 50% on an element with equal width and height creates a perfect circle. "
     "shape and border-shape are not valid CSS properties."),

    ("Q7",
     "Which unit for line-height is most recommended for body text?",
     ["A) px (e.g. 24px)", "B) em (e.g. 1.5em)",
      "C) % (e.g. 150%)", "D) Unitless (e.g. 1.5) ✓"],
     "D — A unitless value like 1.5 scales relative to the element's own font-size, "
     "making it reliable in all contexts. px is absolute and doesn't scale; em can compound when nested."),

    ("Q8",
     "Which property and value removes the default underline from hyperlinks?",
     ["A) font-style: none",
      "B) text-decoration: none ✓",
      "C) text-underline: remove",
      "D) underline: false"],
     "B — text-decoration: none removes the default underline from &lt;a&gt; tags. "
     "font-style affects italic/oblique, not decorations."),

    ("Q9",
     "text-indent applies indentation to:",
     ["A) All lines of the paragraph",
      "B) The last line only",
      "C) The first line only ✓",
      "D) Every other line"],
     "C — text-indent ONLY indents the first line of a block of text. "
     "To indent all lines, use padding-left instead."),

    ("Q10",
     "Which CSS declaration correctly sets a background image centred and not repeating?",
     ["A) background: url('img.jpg') center repeat;",
      "B) background: url('img.jpg') no-repeat center / cover; ✓",
      "C) background: img('image.jpg') no-repeat;",
      "D) background-image: center no-repeat url('img.jpg');"],
     "B — The correct shorthand is: background: url() repeat position / size. "
     "Option A incorrectly sets repeat. Option C uses invalid img() syntax. "
     "Option D has invalid property order."),

    ("Q11",
     "Which font-size unit is RELATIVE TO THE ROOT element's font-size?",
     ["A) em", "B) px", "C) rem ✓", "D) vh"],
     "C — rem (root em) is always relative to the font-size set on the &lt;html&gt; element. "
     "em is relative to the PARENT element. px is absolute. vh is relative to the viewport height."),

    ("Q12",
     "What does word-wrap: break-word do?",
     ["A) Adds a hyphen where words break",
      "B) Prevents any word from wrapping to the next line",
      "C) Allows long words to break and wrap onto the next line ✓",
      "D) Sets the maximum number of words per line"],
     "C — word-wrap: break-word allows an overflowing long word (like a URL) to break "
     "at an arbitrary point and wrap to the next line, preventing layout overflow."),
]

for q_num, question, options, answer in questions:
    # Question header
    q_head = Table([[
        Paragraph(f"<b>{q_num}</b>",
                  S("qn", fontSize=11, fontName="Helvetica-Bold",
                    textColor=WHITE, alignment=TA_CENTER)),
        Paragraph(question,
                  S("qt", fontSize=10, fontName="Helvetica-Bold",
                    textColor=NAVY, leading=15))
    ]], colWidths=[1.2*cm, 16.8*cm])
    q_head.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (0,0), PURPLE),
        ("BACKGROUND", (1,0), (1,0), LIGHTPURPLE),
        ("TOPPADDING", (0,0), (-1,-1), 7),
        ("BOTTOMPADDING", (0,0), (-1,-1), 7),
        ("LEFTPADDING", (1,0), (1,0), 10),
        ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
        ("BOX", (0,0), (-1,-1), 0.5, PURPLE),
    ]))
    story.append(q_head)

    # Options (2 columns)
    opt_data = [[
        Paragraph("<br/>".join(options[:2]),
                  S("ol", fontSize=9.5, fontName="Helvetica", leading=16,
                    textColor=BLACK, leftIndent=6)),
        Paragraph("<br/>".join(options[2:]),
                  S("or", fontSize=9.5, fontName="Helvetica", leading=16,
                    textColor=BLACK, leftIndent=6)),
    ]]
    opt_tbl = Table(opt_data, colWidths=[9*cm, 9*cm])
    opt_tbl.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), GREY),
        ("TOPPADDING", (0,0), (-1,-1), 6),
        ("BOTTOMPADDING", (0,0), (-1,-1), 6),
        ("LEFTPADDING", (0,0), (-1,-1), 10),
        ("BOX", (0,0), (-1,-1), 0.5, MIDGREY),
    ]))
    story.append(opt_tbl)

    # Answer
    ans_tbl = Table([[
        Paragraph(f"<b>✓ Answer:</b>  {answer}",
                  S("ans", fontSize=9, fontName="Helvetica", textColor=GREEN, leading=14))
    ]])
    ans_tbl.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), LIGHTGREEN),
        ("BOX", (0,0), (-1,-1), 0.8, GREEN),
        ("TOPPADDING", (0,0), (-1,-1), 6),
        ("BOTTOMPADDING", (0,0), (-1,-1), 6),
        ("LEFTPADDING", (0,0), (-1,-1), 10),
    ]))
    story.append(ans_tbl)
    story.append(sp(9))

# ─── Final Summary Panel ─────────────────────────────────────────────────────
story.append(PageBreak())
story.append(Banner("📌  Module 4 — Key Takeaways", bg=NAVY, height=36, fontsize=16))
story.append(sp(12))

takeaways = [
    (BLUE, "Text Formatting",
     "font-family (always add generic fallback) · color = TEXT colour only · "
     "font-size: use rem · font-weight: 400=normal, 700=bold · "
     "font-style: italic vs oblique · font-variant: small-caps · "
     "text-align works on block elements · text-decoration: none removes underlines · "
     "text-indent = first line only · line-height: use unitless (1.5) · "
     "word-wrap: break-word prevents overflow · letter-spacing = character spacing"),
    (TEAL, "Link States — LoVe HAte",
     "Order is mandatory: a:link → a:visited → a:hover → a:active. "
     "Wrong order = specificity bugs. Use :hover to add visual feedback. "
     "Links can be styled as buttons using display: inline-block."),
    (ORANGE, "CSS Backgrounds",
     "background-color = solid fill (always set as fallback for images) · "
     "background-image: url() layers ON TOP of background-color · "
     "background-repeat: no-repeat = show once, no tiling · "
     "background-position: center = centre the image · "
     "Shorthand: background: color url() repeat position / size"),
    (PURPLE, "CSS Borders",
     "border-style is REQUIRED — no border shows without it. "
     "Shorthand order: border: width style color. "
     "border-radius: 50% = circle (needs equal width & height). "
     "Use transparent borders for smooth hover transitions. "
     "4-value clockwise order: Top Right Bottom Left."),
]

for clr, title, desc in takeaways:
    data = [[
        Paragraph(title, S("st", fontSize=11, fontName="Helvetica-Bold", textColor=WHITE)),
        Paragraph(desc, S("sd", fontSize=9.5, fontName="Helvetica", textColor=BLACK, leading=14))
    ]]
    t = Table(data, colWidths=[3.5*cm, 14.5*cm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (0,0), clr),
        ("BACKGROUND", (1,0), (1,0), colors.HexColor("#f8fafc")),
        ("BOX", (0,0), (-1,-1), 1.2, clr),
        ("TOPPADDING", (0,0), (-1,-1), 11),
        ("BOTTOMPADDING", (0,0), (-1,-1), 11),
        ("LEFTPADDING", (0,0), (0,0), 8),
        ("LEFTPADDING", (1,0), (1,0), 12),
        ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
    ]))
    story.append(t)
    story.append(sp(9))

story.append(sp(18))
final = Table([[
    Paragraph(
        "You are now fully prepared for Module 4!<br/>"
        "Master the LoVe HAte rule, remember border-style is always required, "
        "and use rem for font sizes.<br/>"
        "<b>Good luck — Ethnotech Academy is with you every step of the way!</b>",
        S("fm", fontSize=12, fontName="Helvetica-Bold", textColor=WHITE,
          alignment=TA_CENTER, leading=20))
]], colWidths=[W - 4*cm])
final.setStyle(TableStyle([
    ("BACKGROUND", (0,0), (-1,-1), NAVY),
    ("TOPPADDING", (0,0), (-1,-1), 18),
    ("BOTTOMPADDING", (0,0), (-1,-1), 18),
    ("LEFTPADDING", (0,0), (-1,-1), 20),
    ("RIGHTPADDING", (0,0), (-1,-1), 20),
]))
story.append(final)

# ── Build ────────────────────────────────────────────────────────────────────
OUTPUT = r"d:\Eth_Quiz_New\quiz\Module4_CSS_StudyNotes.pdf"

# Cover template: zero margins so CoverPage fills the full A4 page
cover_frame = Frame(0, 0, W, H, leftPadding=0, rightPadding=0,
                    topPadding=0, bottomPadding=0)
cover_template = PageTemplate(id="Cover", frames=[cover_frame], onPage=on_cover)

# Normal template: standard margins + header/footer
normal_frame = Frame(2*cm, 1.4*cm, W - 4*cm, H - 3.2*cm,
                     leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
normal_template = PageTemplate(id="Normal", frames=[normal_frame], onPage=on_page)

doc = BaseDocTemplate(
    OUTPUT, pagesize=A4,
    leftMargin=2*cm, rightMargin=2*cm,
    topMargin=2*cm, bottomMargin=1.4*cm,
    title="Module 4 — CSS Text, Backgrounds & Borders",
    author="Jaswanth Narne — Ethnotech Academy",
)
doc.addPageTemplates([cover_template, normal_template])

doc.build(story)
print(f"PDF saved -> {OUTPUT}")