# -*- coding: utf-8 -*-
"""
Ethnotech Academy — CSS/HTML Exam Prep
Generates Module 1, 2 & 3 Study Guide PDFs
Author: Jaswanth Narne
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame,
    Paragraph, Spacer, Table, TableStyle,
    PageBreak, NextPageTemplate
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import Flowable

# ── Colours ─────────────────────────────────────────────────────────────────
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
INDIGO      = colors.HexColor("#4338ca")
LIGHTINDIGO = colors.HexColor("#e0e7ff")
GOLD        = colors.HexColor("#d97706")
LIGHTGOLD   = colors.HexColor("#fef3c7")

W, H = A4


# ── Flowables ────────────────────────────────────────────────────────────────
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
    def __init__(self, lines, width=None):
        super().__init__()
        self.lines = lines
        self.width = width or (W - 4*cm)
        self.height = len(lines) * 13.5 + 18

    def draw(self):
        self.canv.setFillColor(colors.HexColor("#1e293b"))
        self.canv.roundRect(0, 0, self.width, self.height, 6, fill=1, stroke=0)
        self.canv.setFillColor(colors.HexColor("#334155"))
        self.canv.rect(0, 0, 26, self.height, fill=1, stroke=0)
        y = self.height - 13
        for i, line in enumerate(self.lines, 1):
            if line.strip():
                self.canv.setFillColor(colors.HexColor("#64748b"))
                self.canv.setFont("Courier", 7)
                self.canv.drawString(4, y, str(i))
            stripped = line.lstrip()
            if stripped.startswith("<!--") or stripped.startswith("//") or stripped.startswith("/*"):
                clr = colors.HexColor("#6ee7b7")
            elif stripped.startswith("<"):
                clr = colors.HexColor("#fde68a")
            elif ":" in stripped and not stripped.startswith("<"):
                clr = colors.HexColor("#bae6fd")
            elif stripped in ("}", "{", ""):
                clr = colors.HexColor("#94a3b8")
            else:
                clr = colors.HexColor("#e2e8f0")
            self.canv.setFillColor(clr)
            self.canv.setFont("Courier", 8.2)
            self.canv.drawString(32, y, line)
            y -= 13.5


class CoverPage(Flowable):
    def __init__(self, mod_num, mod_title, mod_sub, pillars, pal):
        super().__init__()
        self.mod_num = mod_num
        self.mod_title = mod_title
        self.mod_sub = mod_sub
        self.pillars = pillars
        self.pal = pal
        self.width = W; self.height = H

    def draw(self):
        c = self.canv
        c.setFillColor(colors.HexColor("#080f2a"))
        c.rect(0, 0, W, H, fill=1, stroke=0)
        c.setFillColor(colors.HexColor("#1d3a6e"))
        c.circle(W + 40, H + 30, 260, fill=1, stroke=0)
        c.setFillColor(colors.HexColor("#0d2248"))
        c.circle(-40, -30, 180, fill=1, stroke=0)
        c.setFillColor(BLUE)
        c.rect(0, H - 0.5*cm, W, 0.5*cm, fill=1, stroke=0)
        c.setFillColor(TEAL)
        c.rect(0, H - 0.8*cm, W*0.35, 0.3*cm, fill=1, stroke=0)
        # Academy badge
        c.setFillColor(TEAL)
        c.roundRect(W/2 - 105, H*0.85, 210, 32, 16, fill=1, stroke=0)
        c.setFillColor(WHITE)
        c.setFont("Helvetica-Bold", 12)
        c.drawCentredString(W/2, H*0.85 + 10, "ETHNOTECH ACADEMY")
        # Module badge
        c.setFillColor(BLUE)
        c.roundRect(W/2 - 55, H*0.76, 110, 28, 14, fill=1, stroke=0)
        c.setFillColor(WHITE)
        c.setFont("Helvetica-Bold", 11)
        c.drawCentredString(W/2, H*0.76 + 8, "MODULE  " + self.mod_num)
        # Title
        c.setFillColor(WHITE)
        c.setFont("Helvetica-Bold", 26)
        c.drawCentredString(W/2, H*0.64, self.mod_title)
        # Subtitle
        c.setFillColor(colors.HexColor("#93c5fd"))
        c.setFont("Helvetica", 13)
        c.drawCentredString(W/2, H*0.57, self.mod_sub)
        # Divider
        c.setFillColor(TEAL)
        c.rect(W/2 - 70, H*0.54, 140, 2, fill=1, stroke=0)
        # Author
        c.setFillColor(colors.HexColor("#94a3b8"))
        c.setFont("Helvetica", 11)
        c.drawCentredString(W/2, H*0.50, "Prepared by  Jaswanth Narne")
        # Topic pillars
        n = len(self.pillars)
        xs = [W * (i + 1) / (n + 1) for i in range(n)]
        for txt, col, x in zip(self.pillars, self.pal, xs):
            c.setFillColor(col)
            c.roundRect(x - 60, H*0.34, 120, 46, 8, fill=1, stroke=0)
            c.setFillColor(WHITE)
            c.setFont("Helvetica-Bold", 9)
            # wrap text
            words = txt.split()
            if len(words) <= 2:
                c.drawCentredString(x, H*0.34 + 16, txt)
            else:
                line1 = " ".join(words[:2])
                line2 = " ".join(words[2:])
                c.drawCentredString(x, H*0.34 + 22, line1)
                c.drawCentredString(x, H*0.34 + 10, line2)
        # Bottom strip
        c.setFillColor(colors.HexColor("#0b1630"))
        c.rect(0, 0, W, 2*cm, fill=1, stroke=0)
        c.setFillColor(colors.HexColor("#64748b"))
        c.setFont("Helvetica", 8.5)
        c.drawCentredString(W/2, 0.75*cm,
            "HTML & CSS Module " + self.mod_num + "  |  Complete Study Guide  |  Ethnotech Academy")


# ── Page callbacks ────────────────────────────────────────────────────────────
def on_cover(canvas, doc): pass

def make_header(hdr_text):
    def on_page(canvas, doc):
        canvas.saveState()
        canvas.setFillColor(NAVY)
        canvas.rect(0, H - 1.4*cm, W, 1.4*cm, fill=1, stroke=0)
        canvas.setFillColor(BLUE)
        canvas.rect(0, H - 1.4*cm, 5, 1.4*cm, fill=1, stroke=0)
        canvas.setFillColor(WHITE)
        canvas.setFont("Helvetica-Bold", 8.5)
        canvas.drawString(1.8*cm, H - 0.95*cm, hdr_text)
        canvas.setFont("Helvetica", 8.5)
        canvas.drawRightString(W - 1.8*cm, H - 0.95*cm,
                               "Ethnotech Academy  --  Jaswanth Narne")
        canvas.setFillColor(GREY)
        canvas.rect(0, 0, W, 1.0*cm, fill=1, stroke=0)
        canvas.setFillColor(BLUE)
        canvas.rect(0, 0, W, 2, fill=1, stroke=0)
        canvas.setFillColor(DARKGREY)
        canvas.setFont("Helvetica", 7.5)
        canvas.drawString(1.8*cm, 0.35*cm, "(c) Ethnotech Academy -- For Student Use Only")
        canvas.drawRightString(W - 1.8*cm, 0.35*cm, "Page %d" % doc.page)
        canvas.restoreState()
    return on_page


# ── Styles ────────────────────────────────────────────────────────────────────
def S(name, **kw): return ParagraphStyle(name, **kw)

h1   = S("h1", fontSize=19, textColor=NAVY, fontName="Helvetica-Bold", leading=25, spaceBefore=14, spaceAfter=5)
h2   = S("h2", fontSize=13.5, textColor=BLUE, fontName="Helvetica-Bold", leading=19, spaceBefore=11, spaceAfter=4)
h3   = S("h3", fontSize=11, textColor=TEAL, fontName="Helvetica-Bold", leading=16, spaceBefore=9, spaceAfter=3)
h4   = S("h4", fontSize=10.5, textColor=INDIGO, fontName="Helvetica-Bold", leading=15, spaceBefore=7, spaceAfter=2)
body = S("bd", fontSize=10, textColor=BLACK, fontName="Helvetica", leading=16, spaceAfter=5, alignment=TA_JUSTIFY)
tip_s  = S("tip",  fontSize=9.5, textColor=colors.HexColor("#92400e"), fontName="Helvetica", leading=14, leftIndent=8, rightIndent=8)
note_s = S("note", fontSize=9.5, textColor=colors.HexColor("#1e40af"), fontName="Helvetica", leading=14, leftIndent=8, rightIndent=8)
warn_s = S("warn", fontSize=9.5, textColor=colors.HexColor("#7f1d1d"), fontName="Helvetica-Bold", leading=14, leftIndent=8, rightIndent=8)
key_s  = S("key",  fontSize=9.5, textColor=colors.HexColor("#3b0764"), fontName="Helvetica", leading=14, leftIndent=8, rightIndent=8)
toc_m  = S("tm", fontSize=12, textColor=NAVY, fontName="Helvetica-Bold", leading=18)
toc_s  = S("ts", fontSize=10.5, textColor=DARKGREY, fontName="Helvetica", leading=16)


def sp(n=6): return Spacer(1, n)


def tip_box(text, label="Tip"):
    lab = "  " + label
    data = [[Paragraph("<b>" + lab + "</b>", tip_s), Paragraph(text, tip_s)]]
    t = Table(data, colWidths=[2.4*cm, None])
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


def note_box(text, label="Note"):
    lab = "  " + label
    data = [[Paragraph("<b>" + lab + "</b>", note_s), Paragraph(text, note_s)]]
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


def warn_box(text, label="Warning"):
    lab = "  " + label
    data = [[Paragraph("<b>" + lab + "</b>", warn_s), Paragraph(text, warn_s)]]
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


def key_box(text, label="Key Concept"):
    lab = "  " + label
    data = [[Paragraph("<b>" + lab + "</b>",
                       S("kl", fontSize=9.5, fontName="Helvetica-Bold",
                         textColor=colors.HexColor("#3b0764"), leading=14)),
             Paragraph(text, key_s)]]
    t = Table(data, colWidths=[2.8*cm, None])
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
    header = [Paragraph(h, S("th" + str(i), fontSize=9, fontName="Helvetica-Bold", textColor=WHITE))
              for i, h in enumerate(rows[0])]
    data = [header]
    for row in rows[1:]:
        data.append([Paragraph(str(c),
                     S("td" + str(i), fontSize=9,
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


def toc_table(entries):
    data = []
    for num, title, pg, is_main in entries:
        rs = toc_m if is_main else toc_s
        ps = S("tp"+num, fontSize=12 if is_main else 10.5,
               fontName="Helvetica-Bold" if is_main else "Helvetica",
               textColor=BLUE if is_main else DARKGREY,
               leading=16, alignment=TA_CENTER)
        data.append([Paragraph(num + "  " + title, rs), Paragraph(pg, ps)])
    t = Table(data, colWidths=[14.5*cm, 2*cm])
    t.setStyle(TableStyle([
        ("ROWBACKGROUNDS", (0,0), (-1,-1), [WHITE, GREY]),
        ("TOPPADDING", (0,0), (-1,-1), 5),
        ("BOTTOMPADDING", (0,0), (-1,-1), 5),
        ("LEFTPADDING", (0,0), (0,-1), 10),
        ("LINEBELOW", (0,-1), (-1,-1), 0.4, MIDGREY),
    ]))
    return t


def q_block(story, q_num, question, options, answer):
    q_head = Table([[
        Paragraph("<b>" + q_num + "</b>",
                  S("qn"+q_num, fontSize=11, fontName="Helvetica-Bold",
                    textColor=WHITE, alignment=TA_CENTER)),
        Paragraph(question,
                  S("qt"+q_num, fontSize=10, fontName="Helvetica-Bold",
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
    opt_data = [[
        Paragraph("<br/>".join(options[:2]),
                  S("ol"+q_num, fontSize=9.5, fontName="Helvetica",
                    leading=16, textColor=BLACK, leftIndent=6)),
        Paragraph("<br/>".join(options[2:]),
                  S("or"+q_num, fontSize=9.5, fontName="Helvetica",
                    leading=16, textColor=BLACK, leftIndent=6)),
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
    ans_tbl = Table([[
        Paragraph("<b>Answer:</b>  " + answer,
                  S("ans"+q_num, fontSize=9, fontName="Helvetica",
                    textColor=GREEN, leading=14))
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


def summary_panel(story, items):
    for clr, title, desc in items:
        data = [[
            Paragraph(title, S("st"+title[:4], fontSize=10.5,
                               fontName="Helvetica-Bold", textColor=WHITE)),
            Paragraph(desc, S("sd"+title[:4], fontSize=9.5,
                              fontName="Helvetica", textColor=BLACK, leading=14))
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


def closing_banner(story, text):
    final = Table([[
        Paragraph(text, S("fin", fontSize=11, fontName="Helvetica-Bold",
                          textColor=WHITE, alignment=TA_CENTER, leading=18))
    ]], colWidths=[W - 4*cm])
    final.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), NAVY),
        ("TOPPADDING", (0,0), (-1,-1), 16),
        ("BOTTOMPADDING", (0,0), (-1,-1), 16),
        ("LEFTPADDING", (0,0), (-1,-1), 20),
        ("RIGHTPADDING", (0,0), (-1,-1), 20),
    ]))
    story.append(final)


# ─────────────────────────────────────────────────────────────────────────────
#  MODULE 1 — HTML Fundamentals, Metadata & Document Structure
# ─────────────────────────────────────────────────────────────────────────────
def build_module1():
    s = []

    # Cover
    cp = CoverPage("1", "HTML Fundamentals",
                   "Metadata & Document Structure",
                   ["Document Structure", "Metadata Elements", "Lists & Tables"],
                   [BLUE, TEAL, PURPLE])
    s.append(cp)
    s.append(NextPageTemplate("Normal"))
    s.append(PageBreak())

    # TOC
    s.append(Banner("Table of Contents", bg=NAVY, height=36, fontsize=15))
    s.append(sp(12))
    s.append(toc_table([
        ("1", "DOCTYPE Declaration", "3", True),
        ("2", "HTML Document Structure", "3", True),
        ("  2.1", "The &lt;html&gt; Element", "3", False),
        ("  2.2", "The &lt;head&gt; Element", "3", False),
        ("  2.3", "The &lt;body&gt; Element", "4", False),
        ("3", "Metadata Elements", "4", True),
        ("  3.1", "&lt;meta&gt; — charset, viewport, description, keywords", "4", False),
        ("  3.2", "&lt;link&gt;, &lt;style&gt;, &lt;script&gt;, &lt;noscript&gt;", "5", False),
        ("4", "CSS Style Sheets", "6", True),
        ("  4.1", "Inline Styles", "6", False),
        ("  4.2", "Internal (Embedded) Styles", "6", False),
        ("  4.3", "External Style Sheets", "7", False),
        ("  4.4", "Priority & Precedence", "7", False),
        ("5", "Text & Structural Elements", "8", True),
        ("  5.1", "Headings h1 to h6", "8", False),
        ("  5.2", "Paragraphs, Line Breaks & Horizontal Rules", "8", False),
        ("6", "Container Elements", "9", True),
        ("  6.1", "&lt;div&gt; — Block Container", "9", False),
        ("  6.2", "&lt;span&gt; — Inline Container", "9", False),
        ("7", "Lists", "10", True),
        ("  7.1", "Unordered Lists &lt;ul&gt;", "10", False),
        ("  7.2", "Ordered Lists &lt;ol&gt;", "10", False),
        ("  7.3", "Nested Lists", "11", False),
        ("8", "Tables", "11", True),
        ("  8.1", "Basic Table Structure", "11", False),
        ("  8.2", "colspan & rowspan", "12", False),
        ("  8.3", "thead, tbody, tfoot", "12", False),
        ("9", "Quick-Reference Cheatsheet", "13", True),
        ("10", "Practice Questions & Answers", "14", True),
    ]))
    s.append(PageBreak())

    # ── Section 1: DOCTYPE ──
    s.append(Banner("1  |  DOCTYPE Declaration", bg=NAVY, height=36, fontsize=16))
    s.append(sp(8))
    s.append(Paragraph(
        "The <b>DOCTYPE declaration</b> tells the web browser which version of HTML the page uses. "
        "It must be the very first line of every HTML document — even before the "
        "&lt;html&gt; tag. Without it, browsers enter <b>Quirks Mode</b>, which causes "
        "inconsistent rendering across different browsers.", body))
    s.append(sp(6))
    s.append(prop_table([
        ["DOCTYPE", "HTML Version", "Notes"],
        ["&lt;!DOCTYPE html&gt;",       "HTML5", "The current standard. Simple, short, and case-insensitive."],
        ["&lt;!DOCTYPE HTML PUBLIC...&gt;", "HTML 4.01", "Old, complex syntax. No longer used."],
        ["&lt;!DOCTYPE html PUBLIC...&gt;", "XHTML 1.0", "Strict XML-based syntax. Obsolete."],
    ], col_w=[5.5*cm, 3*cm, 9.5*cm]))
    s.append(sp(8))
    s.append(CodeBox([
        "<!DOCTYPE html>",
        "<html lang=\"en\">",
        "  <head>",
        "    <meta charset=\"UTF-8\">",
        "    <title>My First Page</title>",
        "  </head>",
        "  <body>",
        "    <h1>Hello World</h1>",
        "  </body>",
        "</html>",
    ]))
    s.append(sp(8))
    s.append(tip_box(
        "The HTML5 DOCTYPE is always: &lt;!DOCTYPE html&gt; — just those 15 characters. "
        "It is NOT case-sensitive, but writing it in uppercase is the convention. "
        "It is not an HTML tag — it is a declaration to the browser.", "Exam Tip"))
    s.append(sp(10))

    # ── Section 2: Document Structure ──
    s.append(Banner("2  |  HTML Document Structure", bg=NAVY, height=36, fontsize=16))
    s.append(sp(8))
    s.append(Paragraph(
        "Every HTML document has a required structure built from three root elements. "
        "Understanding what belongs inside each element is fundamental to writing correct HTML.", body))
    s.append(sp(8))

    s.append(Banner("2.1  The &lt;html&gt; Element", bg=BLUE, height=26, fontsize=12))
    s.append(sp(6))
    s.append(Paragraph(
        "The <b>&lt;html&gt;</b> element is the <b>root element</b> — the top-level container "
        "that wraps the entire HTML document. All other elements must be inside it. "
        "The <b>lang</b> attribute specifies the language of the page content.", body))
    s.append(sp(6))
    s.append(prop_table([
        ["Attribute", "Example",        "Purpose"],
        ["lang",      "lang=\"en\"",    "Declares the language. 'en' = English, 'fr' = French, etc. Used by screen readers and search engines."],
        ["xmlns",     "xmlns=\"...\"",  "XML namespace. Only needed for XHTML documents."],
    ], col_w=[2.5*cm, 3.5*cm, 12*cm]))
    s.append(sp(8))

    s.append(Banner("2.2  The &lt;head&gt; Element", bg=BLUE, height=26, fontsize=12))
    s.append(sp(6))
    s.append(Paragraph(
        "The <b>&lt;head&gt;</b> element contains <b>metadata</b> — information about the page "
        "that is NOT displayed on screen. It tells the browser and search engines about the document.", body))
    s.append(sp(6))
    s.append(note_box(
        "Elements that go inside &lt;head&gt;: &lt;title&gt;, &lt;meta&gt;, &lt;link&gt;, "
        "&lt;style&gt;, &lt;script&gt;, &lt;noscript&gt;, &lt;base&gt;. "
        "None of these are visible to the user directly.", "What Goes in head?"))
    s.append(sp(8))

    s.append(Banner("2.3  The &lt;body&gt; Element", bg=BLUE, height=26, fontsize=12))
    s.append(sp(6))
    s.append(Paragraph(
        "The <b>&lt;body&gt;</b> element contains <b>all visible page content</b> — everything "
        "the user sees and interacts with: text, images, links, forms, tables, etc.", body))
    s.append(sp(8))
    s.append(key_box(
        "The three essential elements of every HTML page: "
        "1) &lt;html&gt; — root wrapper. "
        "2) &lt;head&gt; — metadata (not shown to user). "
        "3) &lt;body&gt; — all visible content. "
        "Every HTML element must have a matching closing tag (e.g., &lt;/body&gt;) "
        "except self-closing tags like &lt;meta&gt;, &lt;br&gt;, &lt;img&gt;, &lt;hr&gt;, &lt;input&gt;, &lt;link&gt;."))
    s.append(PageBreak())

    # ── Section 3: Metadata ──
    s.append(Banner("3  |  Metadata Elements", bg=NAVY, height=36, fontsize=16))
    s.append(sp(8))

    s.append(Banner("3.1  &lt;meta&gt; — The Metadata Tag", bg=TEAL, height=26, fontsize=12))
    s.append(sp(6))
    s.append(Paragraph(
        "The <b>&lt;meta&gt;</b> tag provides metadata about the HTML document. "
        "It is a <b>self-closing</b> tag that always lives inside &lt;head&gt;. "
        "The most important meta tags for the exam are:", body))
    s.append(sp(6))
    s.append(prop_table([
        ["Meta Tag", "Purpose"],
        ["&lt;meta charset=\"UTF-8\"&gt;",
         "Sets the character encoding. UTF-8 supports all languages and special characters. "
         "MUST be the first meta tag in &lt;head&gt;. Without it, special characters may display incorrectly."],
        ["&lt;meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"&gt;",
         "Controls how the page is displayed on mobile devices. "
         "width=device-width sets the page width to the device screen width. "
         "initial-scale=1.0 sets the initial zoom level. Essential for responsive design."],
        ["&lt;meta name=\"description\" content=\"...\"&gt;",
         "A short summary (150-160 characters) of the page content. "
         "Displayed by search engines as the snippet under the page title in search results. "
         "Crucial for SEO."],
        ["&lt;meta name=\"keywords\" content=\"html, css, web\"&gt;",
         "A comma-separated list of keywords related to the page. "
         "Used by older search engines. Modern search engines largely ignore this tag."],
        ["&lt;meta http-equiv=\"refresh\" content=\"5;url=page.html\"&gt;",
         "Automatically redirects to another URL after a set number of seconds."],
    ], col_w=[6*cm, 12*cm]))
    s.append(sp(8))
    s.append(CodeBox([
        "<!DOCTYPE html>",
        "<html lang=\"en\">",
        "<head>",
        "  <meta charset=\"UTF-8\">",
        "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">",
        "  <meta name=\"description\" content=\"Learn HTML and CSS with Ethnotech Academy.\">",
        "  <meta name=\"keywords\" content=\"html, css, web development, ethnotech\">",
        "  <title>Ethnotech Academy — Module 1</title>",
        "</head>",
    ]))
    s.append(sp(8))
    s.append(warn_box(
        "The charset meta tag must come BEFORE the title tag in the head section. "
        "If charset is declared after title, the browser may misinterpret characters in the title.", "Order Matters"))
    s.append(sp(10))

    s.append(Banner("3.2  &lt;link&gt;, &lt;style&gt;, &lt;script&gt;, &lt;noscript&gt;", bg=TEAL, height=26, fontsize=12))
    s.append(sp(6))
    s.append(prop_table([
        ["Element", "Purpose & Key Attributes"],
        ["&lt;link&gt;",
         "Links an external resource (most commonly a CSS file) to the HTML document. "
         "SELF-CLOSING. Key attributes: rel (relationship, e.g. 'stylesheet'), "
         "href (path to file), type (MIME type, e.g. 'text/css'). "
         "Example: &lt;link rel=\"stylesheet\" href=\"style.css\"&gt;"],
        ["&lt;style&gt;",
         "Contains internal/embedded CSS that applies only to this page. "
         "Placed inside &lt;head&gt;. "
         "Example: &lt;style&gt; h1 { color: blue; } &lt;/style&gt;"],
        ["&lt;script&gt;",
         "Embeds or references JavaScript. "
         "Can go in &lt;head&gt; (with defer attribute) or at the bottom of &lt;body&gt; (traditional). "
         "defer = runs script after page loads. async = runs script asynchronously. "
         "src attribute links to external .js file."],
        ["&lt;noscript&gt;",
         "Contains fallback content shown when JavaScript is disabled in the browser. "
         "Important for accessibility. Can contain any HTML visible elements."],
    ], col_w=[3.5*cm, 14.5*cm]))
    s.append(sp(8))
    s.append(CodeBox([
        "<head>",
        "  <!-- External CSS file -->",
        "  <link rel=\"stylesheet\" href=\"css/style.css\" type=\"text/css\">",
        "",
        "  <!-- Internal CSS -->",
        "  <style>",
        "    body { font-family: Arial, sans-serif; }",
        "  </style>",
        "",
        "  <!-- External JavaScript (defer = runs after page loads) -->",
        "  <script src=\"js/main.js\" defer></script>",
        "",
        "  <!-- Fallback for no-JavaScript -->",
        "  <noscript>",
        "    <p>Please enable JavaScript to use this site.</p>",
        "  </noscript>",
        "</head>",
    ]))
    s.append(sp(8))
    s.append(tip_box(
        "Placing &lt;script&gt; tags at the BOTTOM of &lt;body&gt; (before &lt;/body&gt;) "
        "makes pages load faster because the browser loads all HTML first before running JavaScript. "
        "The modern alternative is &lt;script defer&gt; in the &lt;head&gt;.", "Performance Tip"))
    s.append(PageBreak())

    # ── Section 4: Style Sheets ──
    s.append(Banner("4  |  CSS Style Sheets", bg=NAVY, height=36, fontsize=16))
    s.append(sp(8))
    s.append(Paragraph(
        "CSS (Cascading Style Sheets) can be added to HTML pages in three ways. "
        "Understanding the differences — and the priority order — is essential for the exam.", body))
    s.append(sp(8))

    s.append(Banner("4.1  Inline Styles", bg=PURPLE, height=26, fontsize=12))
    s.append(sp(6))
    s.append(Paragraph(
        "Inline styles are written directly inside an HTML element using the <b>style</b> attribute. "
        "They apply ONLY to that one specific element.", body))
    s.append(sp(6))
    s.append(CodeBox([
        "<!-- Inline style — applies to this h1 tag only -->",
        "<h1 style=\"color: blue; font-size: 24px;\">Welcome</h1>",
        "",
        "<!-- Each CSS property separated by semicolon -->",
        "<p style=\"color: red; background-color: yellow;\">Highlighted text</p>",
    ]))
    s.append(sp(6))
    s.append(note_box(
        "Pros: Quick to apply, highest specificity. "
        "Cons: Hard to maintain, mixes content with presentation, cannot be reused, "
        "makes HTML cluttered. Avoid inline styles except for testing or email templates."))
    s.append(sp(10))

    s.append(Banner("4.2  Internal (Embedded) Styles", bg=PURPLE, height=26, fontsize=12))
    s.append(sp(6))
    s.append(Paragraph(
        "Internal styles are written inside a <b>&lt;style&gt;</b> tag in the &lt;head&gt; section. "
        "They apply to the entire current page only.", body))
    s.append(sp(6))
    s.append(CodeBox([
        "<head>",
        "  <style>",
        "    /* Internal CSS — applies to the whole page */",
        "    body {",
        "      background-color: #f0f0f0;",
        "      font-family: Arial, sans-serif;",
        "    }",
        "    h1 { color: navy; text-align: center; }",
        "    p  { line-height: 1.6; color: #333; }",
        "  </style>",
        "</head>",
    ]))
    s.append(sp(6))
    s.append(note_box(
        "Pros: Good for single-page styles, no extra file needed. "
        "Cons: Cannot be shared across multiple pages. "
        "Page load is slightly slower if the stylesheet is large."))
    s.append(sp(10))

    s.append(Banner("4.3  External Style Sheets", bg=PURPLE, height=26, fontsize=12))
    s.append(sp(6))
    s.append(Paragraph(
        "External styles are stored in a separate <b>.css file</b> and linked to the HTML page "
        "using the &lt;link&gt; tag. This is the <b>best practice</b> for real websites.", body))
    s.append(sp(6))
    s.append(CodeBox([
        "<!-- In HTML file (index.html) -->",
        "<head>",
        "  <link rel=\"stylesheet\" href=\"style.css\">",
        "</head>",
        "",
        "/* In CSS file (style.css) */",
        "body { margin: 0; padding: 0; }",
        "h1   { color: #1d4ed8; }",
    ]))
    s.append(sp(6))
    s.append(note_box(
        "Pros: One CSS file can style MANY pages. Changes in one file update the whole site. "
        "Browser caches the CSS file for faster page loads. "
        "Best separation of concerns (HTML = structure, CSS = style). "
        "Cons: Requires an extra HTTP request to load the file."))
    s.append(sp(10))

    s.append(Banner("4.4  Priority & Precedence", bg=PURPLE, height=26, fontsize=12))
    s.append(sp(6))
    s.append(Paragraph(
        "When conflicting styles exist, CSS uses this priority order "
        "(highest to lowest):", body))
    s.append(sp(6))
    s.append(prop_table([
        ["Priority", "Type",             "Rule"],
        ["1st (Highest)", "Inline Style", "style=\"...\" attribute directly on the element. Overrides all others."],
        ["2nd",           "Internal CSS", "&lt;style&gt; tag in &lt;head&gt;."],
        ["3rd (Lowest)",  "External CSS", "Linked .css file with &lt;link&gt; tag."],
    ], col_w=[3.5*cm, 3.5*cm, 11*cm]))
    s.append(sp(8))
    s.append(warn_box(
        "!important overrides EVERYTHING, including inline styles. "
        "Example: h1 { color: red !important; } will always be red, even if inline style says blue. "
        "However, !important should be used sparingly — it breaks the natural cascade."))
    s.append(sp(8))
    s.append(key_box(
        "Priority order: Inline &gt; Internal &gt; External. "
        "If two rules have the same priority level, the one declared LAST wins (cascade). "
        "Specificity also plays a role: ID (#id) &gt; Class (.class) &gt; Element (p, h1)."))
    s.append(PageBreak())

    # ── Section 5: Text Elements ──
    s.append(Banner("5  |  Text & Structural Elements", bg=NAVY, height=36, fontsize=16))
    s.append(sp(8))

    s.append(Banner("5.1  Headings &lt;h1&gt; to &lt;h6&gt;", bg=BLUE, height=26, fontsize=12))
    s.append(sp(6))
    s.append(Paragraph(
        "HTML provides six levels of headings from &lt;h1&gt; (largest/most important) "
        "to &lt;h6&gt; (smallest/least important). Headings are <b>block-level elements</b> "
        "— each one starts on a new line and takes the full width.", body))
    s.append(sp(6))
    s.append(prop_table([
        ["Tag",  "Default Size", "Usage"],
        ["&lt;h1&gt;", "Largest (~2em)",   "Main page title. Use ONLY ONE per page for SEO."],
        ["&lt;h2&gt;", "~1.5em",           "Major section headings."],
        ["&lt;h3&gt;", "~1.17em",          "Sub-sections within h2 sections."],
        ["&lt;h4&gt;", "~1em (bold)",      "Sub-sections within h3 sections."],
        ["&lt;h5&gt;", "~0.83em",          "Rarely used — very specific sub-section."],
        ["&lt;h6&gt;", "Smallest (~0.67em)", "Very rarely used. Least important heading."],
    ], col_w=[3*cm, 3.5*cm, 11.5*cm]))
    s.append(sp(8))
    s.append(warn_box(
        "Do NOT skip heading levels for styling purposes. "
        "Do NOT use &lt;h1&gt; multiple times on one page. "
        "Heading hierarchy matters for SEO and screen readers (accessibility). "
        "Use CSS to change visual size, not heading level choice."))
    s.append(sp(10))

    s.append(Banner("5.2  Paragraphs, Line Breaks & Horizontal Rules", bg=BLUE, height=26, fontsize=12))
    s.append(sp(6))
    s.append(prop_table([
        ["Tag", "Type", "Description"],
        ["&lt;p&gt;",  "Block", "Defines a paragraph. The browser automatically adds space before and after. Block element."],
        ["&lt;br&gt;", "Inline / Self-closing", "Line break. Moves content to the next line within the same paragraph. Does NOT create a new paragraph. Self-closing — no &lt;/br&gt; needed."],
        ["&lt;hr&gt;", "Block / Self-closing",  "Horizontal rule. Draws a horizontal dividing line across the page. Often used to separate content sections. Self-closing."],
    ], col_w=[3*cm, 3.5*cm, 11.5*cm]))
    s.append(sp(8))
    s.append(CodeBox([
        "<p>This is the first paragraph.</p>",
        "",
        "<p>This is the second paragraph.<br>",
        "This text is on a new line but in the same paragraph.</p>",
        "",
        "<hr>",
        "",
        "<p>This paragraph is after the horizontal rule.</p>",
    ]))
    s.append(sp(8))
    s.append(tip_box(
        "Self-closing tags in HTML5: &lt;br&gt;, &lt;hr&gt;, &lt;img&gt;, "
        "&lt;meta&gt;, &lt;link&gt;, &lt;input&gt;. "
        "In HTML5, you write just &lt;br&gt; (not &lt;br/&gt; like in XHTML). "
        "Both work but &lt;br&gt; is the HTML5 standard."))
    s.append(PageBreak())

    # ── Section 6: Containers ──
    s.append(Banner("6  |  Container Elements", bg=NAVY, height=36, fontsize=16))
    s.append(sp(8))
    s.append(Paragraph(
        "Container elements group other HTML elements together. "
        "They have no visual appearance by default but are essential for applying CSS and JavaScript.", body))
    s.append(sp(8))

    s.append(Banner("6.1  &lt;div&gt; — Block Container", bg=TEAL, height=26, fontsize=12))
    s.append(sp(6))
    s.append(Paragraph(
        "The <b>&lt;div&gt;</b> (Division) element is a <b>block-level</b> container. "
        "It takes up the full width of its parent and starts on a new line. "
        "Used to group large sections of HTML for layout purposes.", body))
    s.append(sp(6))
    s.append(CodeBox([
        "<!-- div groups elements into a named section -->",
        "<div id=\"header\">",
        "  <h1>Site Title</h1>",
        "  <p>Tagline goes here</p>",
        "</div>",
        "",
        "<div class=\"card\">",
        "  <h2>Card Title</h2>",
        "  <p>Card content here.</p>",
        "</div>",
    ]))
    s.append(sp(10))

    s.append(Banner("6.2  &lt;span&gt; — Inline Container", bg=TEAL, height=26, fontsize=12))
    s.append(sp(6))
    s.append(Paragraph(
        "The <b>&lt;span&gt;</b> element is an <b>inline-level</b> container. "
        "It does NOT start on a new line and only takes up as much width as its content. "
        "Used to target specific words or phrases within text for styling.", body))
    s.append(sp(6))
    s.append(CodeBox([
        "<!-- span highlights part of a sentence inline -->",
        "<p>The sky is <span style=\"color: blue;\">very blue</span> today.</p>",
        "",
        "<p>Price: <span class=\"price\">$49.99</span></p>",
    ]))
    s.append(sp(8))
    s.append(prop_table([
        ["Feature",       "&lt;div&gt;",            "&lt;span&gt;"],
        ["Display type",  "Block",                  "Inline"],
        ["New line?",     "Yes — always",           "No — stays in line with text"],
        ["Default width", "100% of parent",         "Only as wide as content"],
        ["Used for",      "Page sections, layouts", "Highlighting words, phrases"],
        ["Can contain",   "Block + inline elements","Inline elements only"],
    ], col_w=[3.5*cm, 6.5*cm, 8*cm]))
    s.append(PageBreak())

    # ── Section 7: Lists ──
    s.append(Banner("7  |  Lists", bg=NAVY, height=36, fontsize=16))
    s.append(sp(8))
    s.append(Paragraph(
        "HTML supports three types of lists. Unordered lists use bullet points, "
        "ordered lists use numbers or letters, and definition lists define terms.", body))
    s.append(sp(8))

    s.append(Banner("7.1  Unordered Lists &lt;ul&gt;", bg=ORANGE, fg=WHITE, height=26, fontsize=12))
    s.append(sp(6))
    s.append(Paragraph(
        "An <b>unordered list</b> displays items with bullet points. "
        "The &lt;ul&gt; tag wraps the list; each item uses &lt;li&gt;. "
        "The bullet style is controlled with the CSS <b>list-style-type</b> property.", body))
    s.append(sp(6))
    s.append(prop_table([
        ["CSS Value",    "Bullet Style"],
        ["disc",         "Filled circle (DEFAULT for ul)"],
        ["circle",       "Hollow circle"],
        ["square",       "Filled square"],
        ["none",         "No bullet — useful for navigation menus"],
    ], col_w=[4*cm, 14*cm]))
    s.append(sp(8))
    s.append(CodeBox([
        "<ul>",
        "  <li>HTML</li>",
        "  <li>CSS</li>",
        "  <li>JavaScript</li>",
        "</ul>",
        "",
        "/* CSS to change bullet style */",
        "ul { list-style-type: square; }",
        "ul { list-style-type: none; }   /* nav menus */",
    ]))
    s.append(sp(10))

    s.append(Banner("7.2  Ordered Lists &lt;ol&gt;", bg=ORANGE, fg=WHITE, height=26, fontsize=12))
    s.append(sp(6))
    s.append(Paragraph(
        "An <b>ordered list</b> displays items with sequential numbers or letters. "
        "The <b>type</b> attribute sets the numbering style. "
        "The <b>start</b> attribute sets the starting number.", body))
    s.append(sp(6))
    s.append(prop_table([
        ["type Attribute", "Output"],
        ["type=\"1\"",  "Numbers: 1, 2, 3, ... (DEFAULT)"],
        ["type=\"A\"",  "Uppercase letters: A, B, C, ..."],
        ["type=\"a\"",  "Lowercase letters: a, b, c, ..."],
        ["type=\"I\"",  "Uppercase Roman numerals: I, II, III, ..."],
        ["type=\"i\"",  "Lowercase Roman numerals: i, ii, iii, ..."],
    ], col_w=[4.5*cm, 13.5*cm]))
    s.append(sp(8))
    s.append(CodeBox([
        "<!-- Numbered list starting at 1 -->",
        "<ol>",
        "  <li>First step</li>",
        "  <li>Second step</li>",
        "  <li>Third step</li>",
        "</ol>",
        "",
        "<!-- Alphabetical, starting from C -->",
        "<ol type=\"A\" start=\"3\">",
        "  <li>Third item</li>",
        "  <li>Fourth item</li>",
        "</ol>",
    ]))
    s.append(sp(10))

    s.append(Banner("7.3  Nested Lists", bg=ORANGE, fg=WHITE, height=26, fontsize=12))
    s.append(sp(6))
    s.append(Paragraph(
        "Lists can be nested inside other lists. A nested &lt;ul&gt; or &lt;ol&gt; "
        "must be placed <b>inside</b> an &lt;li&gt; element — not between &lt;li&gt; tags.", body))
    s.append(sp(6))
    s.append(CodeBox([
        "<ul>",
        "  <li>Frontend",
        "    <ul>",
        "      <li>HTML</li>",
        "      <li>CSS</li>",
        "      <li>JavaScript</li>",
        "    </ul>",
        "  </li>",
        "  <li>Backend",
        "    <ul>",
        "      <li>Python</li>",
        "      <li>Node.js</li>",
        "    </ul>",
        "  </li>",
        "</ul>",
    ]))
    s.append(sp(8))
    s.append(warn_box(
        "A common mistake: placing the nested &lt;ul&gt; OUTSIDE the &lt;li&gt; tag. "
        "Always put the nested list INSIDE the &lt;li&gt; element of the parent list."))
    s.append(PageBreak())

    # ── Section 8: Tables ──
    s.append(Banner("8  |  Tables", bg=NAVY, height=36, fontsize=16))
    s.append(sp(8))
    s.append(Paragraph(
        "HTML tables display data in rows and columns. "
        "Tables should only be used for <b>tabular data</b> — never for page layout.", body))
    s.append(sp(8))

    s.append(Banner("8.1  Basic Table Structure", bg=GREEN, fg=WHITE, height=26, fontsize=12))
    s.append(sp(6))
    s.append(prop_table([
        ["Tag",           "Purpose"],
        ["&lt;table&gt;", "The container for the entire table."],
        ["&lt;tr&gt;",    "Table Row — each row inside the table."],
        ["&lt;th&gt;",    "Table Header cell — bold and centred by default. Describes the column/row."],
        ["&lt;td&gt;",    "Table Data cell — regular text, left-aligned by default. Contains actual data."],
        ["&lt;caption&gt;","Gives the table a title. Goes directly after &lt;table&gt; tag."],
    ], col_w=[3.5*cm, 14.5*cm]))
    s.append(sp(8))
    s.append(CodeBox([
        "<table border=\"1\">",
        "  <caption>Student Marks</caption>",
        "  <tr>",
        "    <th>Name</th>",
        "    <th>Subject</th>",
        "    <th>Score</th>",
        "  </tr>",
        "  <tr>",
        "    <td>Alice</td>",
        "    <td>HTML</td>",
        "    <td>95</td>",
        "  </tr>",
        "  <tr>",
        "    <td>Bob</td>",
        "    <td>CSS</td>",
        "    <td>88</td>",
        "  </tr>",
        "</table>",
    ]))
    s.append(sp(10))

    s.append(Banner("8.2  colspan & rowspan", bg=GREEN, fg=WHITE, height=26, fontsize=12))
    s.append(sp(6))
    s.append(prop_table([
        ["Attribute",           "Purpose",             "Example"],
        ["colspan=\"N\"",       "Merges N columns into one cell", "colspan=\"2\" — this cell spans 2 columns"],
        ["rowspan=\"N\"",       "Merges N rows into one cell",    "rowspan=\"3\" — this cell spans 3 rows"],
    ], col_w=[4*cm, 6*cm, 8*cm]))
    s.append(sp(8))
    s.append(CodeBox([
        "<table border=\"1\">",
        "  <tr>",
        "    <th colspan=\"3\">Full Week Schedule</th>  <!-- spans 3 cols -->",
        "  </tr>",
        "  <tr>",
        "    <td rowspan=\"2\">Monday</td>  <!-- spans 2 rows -->",
        "    <td>HTML</td>",
        "    <td>9:00 AM</td>",
        "  </tr>",
        "  <tr>",
        "    <!-- no Monday cell here — it's merged above -->",
        "    <td>CSS</td>",
        "    <td>11:00 AM</td>",
        "  </tr>",
        "</table>",
    ]))
    s.append(sp(10))

    s.append(Banner("8.3  &lt;thead&gt;, &lt;tbody&gt;, &lt;tfoot&gt;", bg=GREEN, fg=WHITE, height=26, fontsize=12))
    s.append(sp(6))
    s.append(Paragraph(
        "For large tables, HTML provides semantic grouping elements that also help browsers "
        "render, print, and scroll tables correctly.", body))
    s.append(sp(6))
    s.append(prop_table([
        ["Tag",             "Purpose"],
        ["&lt;thead&gt;",   "Groups the header rows. Content remains at top even when scrolling."],
        ["&lt;tbody&gt;",   "Groups the main data rows. Required when using thead/tfoot."],
        ["&lt;tfoot&gt;",   "Groups the footer rows (e.g., totals). Displayed at bottom."],
    ], col_w=[3.5*cm, 14.5*cm]))
    s.append(sp(8))
    s.append(CodeBox([
        "<table>",
        "  <thead>",
        "    <tr><th>Item</th><th>Price</th></tr>",
        "  </thead>",
        "  <tbody>",
        "    <tr><td>Keyboard</td><td>$25</td></tr>",
        "    <tr><td>Mouse</td><td>$15</td></tr>",
        "  </tbody>",
        "  <tfoot>",
        "    <tr><td>Total</td><td>$40</td></tr>",
        "  </tfoot>",
        "</table>",
    ]))
    s.append(PageBreak())

    # ── Section 9: Cheatsheet ──
    s.append(Banner("9  |  Quick-Reference Cheatsheet", bg=NAVY, height=36, fontsize=16))
    s.append(sp(10))
    cheat = [
        ["Element / Concept", "Syntax / Value", "Key Point"],
        ["DOCTYPE",    "!DOCTYPE html",              "Must be FIRST line. Prevents quirks mode."],
        ["html lang",  "lang=\"en\"",                 "Root element. Declares page language."],
        ["head",       "Contains metadata",           "Not visible to user."],
        ["body",       "Contains visible content",    "Everything user sees."],
        ["meta charset","charset=\"UTF-8\"",          "First meta tag. Supports all characters."],
        ["meta viewport","width=device-width",        "Needed for mobile responsive pages."],
        ["meta description","name=\"description\"",  "SEO snippet in search results."],
        ["link",       "rel=\"stylesheet\" href=\"\"","Links external CSS. Self-closing."],
        ["script defer","src=\"file.js\" defer",      "Loads JS after HTML. Best practice."],
        ["Inline style","style=\"color:red\"",        "Highest priority. Only one element."],
        ["Internal CSS","&lt;style&gt; in head",      "One page only."],
        ["External CSS","&lt;link&gt; .css file",     "Best practice. Shared across pages."],
        ["h1 to h6",   "Block, bold",                 "Only ONE h1 per page."],
        ["p",          "Block element",               "Auto space before/after."],
        ["br",         "Self-closing",                "Line break — same paragraph."],
        ["hr",         "Self-closing",                "Horizontal divider line."],
        ["div",        "Block container",             "Full-width. For layout sections."],
        ["span",       "Inline container",            "Stays in line. For styling words."],
        ["ul + li",    "Unordered list",              "list-style-type: disc/circle/square/none"],
        ["ol + li",    "Ordered list",                "type: 1/A/a/I/i  start: N"],
        ["table tr th td","Table structure",          "th = header (bold). td = data."],
        ["colspan",    "colspan=\"N\"",               "Cell spans N columns."],
        ["rowspan",    "rowspan=\"N\"",               "Cell spans N rows."],
        ["thead tbody tfoot","Table sections",        "Semantic grouping of table rows."],
    ]
    cheat_styled = []
    for i, row in enumerate(cheat):
        if i == 0:
            cheat_styled.append([
                Paragraph(c, S("ch1"+str(j), fontSize=9, fontName="Helvetica-Bold", textColor=WHITE))
                for j, c in enumerate(row)
            ])
        else:
            cheat_styled.append([
                Paragraph(row[0], S("cp1"+str(i), fontSize=8.5, fontName="Courier",
                                    textColor=colors.HexColor("#be185d"))),
                Paragraph(row[1], S("cv1"+str(i), fontSize=8.5, fontName="Courier",
                                    textColor=colors.HexColor("#0369a1"))),
                Paragraph(row[2], S("cn1"+str(i), fontSize=8.5, fontName="Helvetica", textColor=BLACK)),
            ])
    ct = Table(cheat_styled, colWidths=[4.5*cm, 5*cm, 8.5*cm], repeatRows=1)
    ct.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,0), NAVY),
        ("ROWBACKGROUNDS", (0,1), (-1,-1), [WHITE, GREY]),
        ("BOX", (0,0), (-1,-1), 0.5, MIDGREY),
        ("INNERGRID", (0,0), (-1,-1), 0.3, MIDGREY),
        ("TOPPADDING", (0,0), (-1,-1), 4),
        ("BOTTOMPADDING", (0,0), (-1,-1), 4),
        ("LEFTPADDING", (0,0), (-1,-1), 6),
        ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
    ]))
    s.append(ct)
    s.append(PageBreak())

    # ── Section 10: Practice Questions ──
    s.append(Banner("10  |  Practice Questions & Answers", bg=NAVY, height=36, fontsize=16))
    s.append(sp(10))

    qs = [
        ("Q1", "What must be the very first line of an HTML document?",
         ["A) &lt;html&gt;", "B) &lt;head&gt;", "C) &lt;!DOCTYPE html&gt; (Correct)", "D) &lt;meta charset&gt;"],
         "C -- &lt;!DOCTYPE html&gt; must be the very first line. It tells the browser to use HTML5 and prevents Quirks Mode."),
        ("Q2", "Which meta tag is used to make a website responsive on mobile devices?",
         ["A) meta charset", "B) meta keywords",
          "C) meta viewport (Correct)", "D) meta description"],
         "C -- &lt;meta name='viewport' content='width=device-width, initial-scale=1.0'&gt; controls the mobile layout."),
        ("Q3", "What is the correct priority order for CSS style sheets (highest first)?",
         ["A) External, Internal, Inline", "B) Inline, Internal, External (Correct)",
          "C) Internal, Inline, External", "D) All have equal priority"],
         "B -- Inline styles have the highest priority, then Internal (&lt;style&gt;), then External (.css file)."),
        ("Q4", "What is the difference between &lt;th&gt; and &lt;td&gt;?",
         ["A) No difference", "B) th = table header (bold, centred); td = table data (Correct)",
          "C) th = table data; td = table header", "D) th is block; td is inline"],
         "B -- &lt;th&gt; is a header cell (bold and centred by default). &lt;td&gt; is a regular data cell."),
        ("Q5", "Which attribute makes a table cell span across 3 columns?",
         ["A) rowspan=\"3\"", "B) cellspan=\"3\"", "C) colspan=\"3\" (Correct)", "D) span=\"3\""],
         "C -- colspan='3' merges the cell across 3 columns horizontally. rowspan merges rows vertically."),
        ("Q6", "Which HTML tag is an INLINE container?",
         ["A) &lt;div&gt;", "B) &lt;section&gt;", "C) &lt;p&gt;", "D) &lt;span&gt; (Correct)"],
         "D -- &lt;span&gt; is an inline container. &lt;div&gt;, &lt;section&gt;, and &lt;p&gt; are block-level."),
        ("Q7", "How do you create an ordered list with uppercase letters (A, B, C...)?",
         ["A) &lt;ol type='1'&gt;", "B) &lt;ol type='A'&gt; (Correct)",
          "C) &lt;ul type='A'&gt;", "D) &lt;ol style='upper-alpha'&gt;"],
         "B -- type='A' gives uppercase letters. type='a' = lowercase, type='I' = Roman numerals."),
        ("Q8", "Where should the &lt;script&gt; tag go for best page loading performance?",
         ["A) In the &lt;head&gt; without attributes",
          "B) At the bottom of &lt;body&gt; OR with defer in &lt;head&gt; (Correct)",
          "C) Before DOCTYPE", "D) Inside &lt;meta&gt;"],
         "B -- Placing scripts at bottom of body (or using defer) ensures HTML loads first, making the page appear faster."),
        ("Q9", "What does the &lt;br&gt; tag do?",
         ["A) Creates a new paragraph", "B) Draws a horizontal line",
          "C) Creates a line break within the same element (Correct)", "D) Adds bold text"],
         "C -- &lt;br&gt; creates a line break within the same paragraph. &lt;hr&gt; draws a horizontal line. &lt;p&gt; creates a new paragraph."),
        ("Q10", "Which CSS property controls the bullet style of an unordered list?",
         ["A) bullet-style", "B) list-style-type (Correct)", "C) list-marker", "D) ul-style"],
         "B -- list-style-type accepts: disc, circle, square, none. Applied to &lt;ul&gt; or &lt;li&gt; elements."),
    ]
    for args in qs:
        q_block(s, *args)

    s.append(sp(10))
    summary_panel(s, [
        (BLUE,   "Document Structure", "DOCTYPE first. html=root. head=metadata. body=visible content. All tags need closing tags."),
        (TEAL,   "Metadata",           "charset UTF-8 first. viewport for mobile. description for SEO. link for CSS. script defer for JS."),
        (PURPLE, "Style Sheets",       "Inline > Internal > External priority. External = best practice. !important overrides all."),
        (ORANGE, "Elements",           "h1-h6 hierarchy (one h1). br=line break. hr=divider. div=block. span=inline. Nested lists inside li."),
        (GREEN,  "Tables",             "table > tr > th/td. th=header (bold). colspan=columns. rowspan=rows. thead/tbody/tfoot for groups."),
    ])
    closing_banner(s, "Module 1 complete! Master the document structure and you have the foundation for all HTML. -- Ethnotech Academy")
    return s


# ─────────────────────────────────────────────────────────────────────────────
#  MODULE 2 — Semantic HTML, Navigation & Forms
# ─────────────────────────────────────────────────────────────────────────────
def build_module2():
    s = []

    cp = CoverPage("2", "Semantic HTML", "Navigation & Forms",
                   ["Semantic Tags", "Navigation & Links", "HTML Forms"],
                   [BLUE, TEAL, ORANGE])
    s.append(cp)
    s.append(NextPageTemplate("Normal"))
    s.append(PageBreak())

    s.append(Banner("Table of Contents", bg=NAVY, height=36, fontsize=15))
    s.append(sp(12))
    s.append(toc_table([
        ("1", "Semantic HTML5 Elements", "3", True),
        ("  1.1", "Page Structure: header, nav, main, footer", "3", False),
        ("  1.2", "Content: section, article, aside", "4", False),
        ("  1.3", "Details, Summary, Figure, Figcaption", "4", False),
        ("2", "Navigation & Hyperlinks", "5", True),
        ("  2.1", "The &lt;a&gt; Anchor Tag", "5", False),
        ("  2.2", "Absolute vs Relative URLs", "5", False),
        ("  2.3", "target Attribute", "6", False),
        ("  2.4", "Bookmark Links (Anchors)", "6", False),
        ("  2.5", "Folder Hierarchies & Paths", "7", False),
        ("  2.6", "Image Maps", "7", False),
        ("3", "HTML Forms", "8", True),
        ("  3.1", "Form Element & Attributes (action, method)", "8", False),
        ("  3.2", "GET vs POST", "8", False),
        ("  3.3", "Input Types", "9", False),
        ("  3.4", "Input Validation Attributes", "10", False),
        ("  3.5", "select & option", "11", False),
        ("  3.6", "textarea", "11", False),
        ("  3.7", "button", "12", False),
        ("  3.8", "label", "12", False),
        ("4", "Quick-Reference Cheatsheet", "13", True),
        ("5", "Practice Questions & Answers", "14", True),
    ]))
    s.append(PageBreak())

    # ── Sec 1 Semantic ──
    s.append(Banner("1  |  Semantic HTML5 Elements", bg=NAVY, height=36, fontsize=16))
    s.append(sp(8))
    s.append(Paragraph(
        "<b>Semantic HTML</b> uses elements that clearly describe their meaning and purpose — "
        "both to the browser and to developers. HTML5 introduced many semantic elements to replace "
        "the overuse of generic &lt;div&gt; tags. They improve <b>accessibility</b>, "
        "<b>SEO</b>, and code readability.", body))
    s.append(sp(8))

    s.append(Banner("1.1  Page Structure Elements", bg=BLUE, height=26, fontsize=12))
    s.append(sp(6))
    s.append(prop_table([
        ["Element",         "Purpose & When to Use"],
        ["&lt;header&gt;",  "Introductory content for the page or a section. "
                            "Typically contains: site logo, site title, tagline, main navigation. "
                            "Can appear at page level or inside &lt;article&gt;/&lt;section&gt;."],
        ["&lt;nav&gt;",     "Contains the main navigation links. "
                            "Usually holds a set of &lt;a&gt; links or a &lt;ul&gt; list. "
                            "There can be multiple nav elements (main nav, footer nav, breadcrumbs)."],
        ["&lt;main&gt;",    "The dominant, unique content of the page. "
                            "There should be ONLY ONE &lt;main&gt; per page. "
                            "Repeated elements like nav and footer should NOT be inside &lt;main&gt;."],
        ["&lt;footer&gt;",  "Bottom section of the page or section. "
                            "Contains: copyright, contact info, social links, sitemap. "
                            "Can appear multiple times on a page (for page + articles)."],
    ], col_w=[3.5*cm, 14.5*cm]))
    s.append(sp(8))
    s.append(CodeBox([
        "<!DOCTYPE html>",
        "<html lang=\"en\">",
        "<body>",
        "  <header>",
        "    <h1>Ethnotech Academy</h1>",
        "    <nav>",
        "      <a href=\"index.html\">Home</a>",
        "      <a href=\"about.html\">About</a>",
        "    </nav>",
        "  </header>",
        "",
        "  <main>",
        "    <!-- main content here -->",
        "  </main>",
        "",
        "  <footer>",
        "    <p>&copy; 2024 Ethnotech Academy</p>",
        "  </footer>",
        "</body>",
        "</html>",
    ]))
    s.append(sp(10))

    s.append(Banner("1.2  Content Sectioning: section, article, aside", bg=BLUE, height=26, fontsize=12))
    s.append(sp(6))
    s.append(prop_table([
        ["Element",          "Purpose & When to Use"],
        ["&lt;section&gt;",  "A thematic grouping of content, typically with its own heading. "
                             "Use for chapters, tabs, or logically distinct parts of the page. "
                             "Different from &lt;div&gt; — has semantic meaning."],
        ["&lt;article&gt;",  "Self-contained, independently distributable content. "
                             "Examples: blog post, news story, product card, comment. "
                             "Should make sense if taken out of context (e.g., shared on social media)."],
        ["&lt;aside&gt;",    "Content tangentially related to the main content. "
                             "Examples: sidebar, pull quote, glossary, related links, advertisements. "
                             "Usually displayed alongside the main content."],
    ], col_w=[3.5*cm, 14.5*cm]))
    s.append(sp(8))
    s.append(key_box(
        "Rule of thumb: Use &lt;article&gt; if the content makes sense on its own (blog post). "
        "Use &lt;section&gt; to group related content under a heading. "
        "Use &lt;aside&gt; for supplementary/sidebar content. "
        "Use &lt;div&gt; only when no semantic element fits."))
    s.append(sp(10))

    s.append(Banner("1.3  Details, Summary, Figure, Figcaption", bg=BLUE, height=26, fontsize=12))
    s.append(sp(6))
    s.append(prop_table([
        ["Element",              "Purpose"],
        ["&lt;details&gt;",      "Creates an interactive disclosure widget — content is hidden by default "
                                 "and shown when the user clicks. No JavaScript needed."],
        ["&lt;summary&gt;",      "The visible, clickable label for a &lt;details&gt; widget. "
                                 "Must be the first child of &lt;details&gt;."],
        ["&lt;figure&gt;",       "Groups self-contained media (images, diagrams, code, charts). "
                                 "The content can be moved without affecting the main flow."],
        ["&lt;figcaption&gt;",   "Caption for the &lt;figure&gt; element. "
                                 "Can be the first or last child of &lt;figure&gt;."],
    ], col_w=[4*cm, 14*cm]))
    s.append(sp(8))
    s.append(CodeBox([
        "<!-- Collapsible details widget -->",
        "<details>",
        "  <summary>Click to expand</summary>",
        "  <p>Hidden content is shown when expanded.</p>",
        "</details>",
        "",
        "<!-- Figure with caption -->",
        "<figure>",
        "  <img src=\"chart.png\" alt=\"Sales chart\">",
        "  <figcaption>Fig 1: Monthly sales data 2024</figcaption>",
        "</figure>",
    ]))
    s.append(PageBreak())

    # ── Sec 2 Navigation ──
    s.append(Banner("2  |  Navigation & Hyperlinks", bg=NAVY, height=36, fontsize=16))
    s.append(sp(8))

    s.append(Banner("2.1  The &lt;a&gt; Anchor Tag", bg=TEAL, height=26, fontsize=12))
    s.append(sp(6))
    s.append(Paragraph(
        "The <b>&lt;a&gt;</b> (anchor) tag creates hyperlinks. "
        "The <b>href</b> attribute specifies the destination URL. "
        "Without href, it renders like normal text.", body))
    s.append(sp(6))
    s.append(prop_table([
        ["Attribute",    "Example",                      "Purpose"],
        ["href",         "href=\"page.html\"",            "Destination URL. REQUIRED for a clickable link."],
        ["target",       "target=\"_blank\"",             "Where to open the link (see next section)."],
        ["title",        "title=\"Visit homepage\"",      "Tooltip text shown on hover."],
        ["download",     "download=\"file.pdf\"",         "Prompts the user to download the file."],
        ["rel",          "rel=\"noopener noreferrer\"",   "Security attribute for external links (use with target=_blank)."],
    ], col_w=[3*cm, 5*cm, 10*cm]))
    s.append(sp(8))

    s.append(Banner("2.2  Absolute vs Relative URLs", bg=TEAL, height=26, fontsize=12))
    s.append(sp(6))
    s.append(prop_table([
        ["Type",     "Example",                           "When to Use"],
        ["Absolute", "https://www.ethnotech.com/about",   "Links to external websites. Full URL including protocol (http/https)."],
        ["Relative", "about.html",                        "Links within the same website. Path relative to current file location."],
        ["Root rel.", "/images/logo.png",                 "Starts from the website root. Works regardless of current page location."],
    ], col_w=[3*cm, 6*cm, 9*cm]))
    s.append(sp(8))
    s.append(CodeBox([
        "<!-- Absolute link — external site -->",
        "<a href=\"https://www.google.com\">Google</a>",
        "",
        "<!-- Relative link — same website -->",
        "<a href=\"about.html\">About Us</a>",
        "<a href=\"../index.html\">Go Up One Folder</a>",
        "<a href=\"products/item.html\">Go Into Subfolder</a>",
        "",
        "<!-- Email link -->",
        "<a href=\"mailto:info@ethnotech.com\">Email Us</a>",
        "",
        "<!-- Phone link -->",
        "<a href=\"tel:+911234567890\">Call Us</a>",
    ]))
    s.append(sp(10))

    s.append(Banner("2.3  target Attribute", bg=TEAL, height=26, fontsize=12))
    s.append(sp(6))
    s.append(prop_table([
        ["Value",      "Behaviour"],
        ["_self",      "DEFAULT. Opens link in the SAME tab/window."],
        ["_blank",     "Opens link in a NEW tab or window."],
        ["_parent",    "Opens in the parent frame (used with iframes)."],
        ["_top",       "Opens in the full window, breaking out of all frames."],
        ["framename",  "Opens in a named &lt;iframe&gt;."],
    ], col_w=[3.5*cm, 14.5*cm]))
    s.append(sp(8))
    s.append(tip_box(
        "Always add rel='noopener noreferrer' when using target='_blank' for external links. "
        "Without it, the opened page can access and manipulate your page via window.opener, "
        "which is a security vulnerability.",  "Security Tip"))
    s.append(sp(10))

    s.append(Banner("2.4  Bookmark Links (Same-Page Navigation)", bg=TEAL, height=26, fontsize=12))
    s.append(sp(6))
    s.append(Paragraph(
        "Bookmark links (also called anchor links) jump to a specific section on the same page. "
        "They use the <b>id</b> attribute as the target.", body))
    s.append(sp(6))
    s.append(CodeBox([
        "<!-- Step 1: Give the target section an id -->",
        "<h2 id=\"contact\">Contact Us</h2>",
        "<p id=\"top\">Page start</p>",
        "",
        "<!-- Step 2: Link to it with # + id -->",
        "<a href=\"#contact\">Jump to Contact</a>",
        "<a href=\"#top\">Back to Top</a>",
        "",
        "<!-- Link to section on ANOTHER page -->",
        "<a href=\"about.html#team\">Our Team</a>",
    ]))
    s.append(sp(10))

    s.append(Banner("2.5  Folder Hierarchies & File Paths", bg=TEAL, height=26, fontsize=12))
    s.append(sp(6))
    s.append(prop_table([
        ["Path Notation", "Meaning",             "Example"],
        ["filename.html", "Same folder",         "href=\"about.html\""],
        ["./file.html",   "Same folder (explicit)", "href=\"./about.html\""],
        ["../",           "One folder UP",       "href=\"../index.html\""],
        ["../../",        "Two folders up",      "href=\"../../home.html\""],
        ["folder/file",   "Into a subfolder",    "href=\"pages/contact.html\""],
        ["/file.html",    "From root of website","href=\"/index.html\""],
    ], col_w=[4*cm, 4.5*cm, 9.5*cm]))
    s.append(sp(10))

    s.append(Banner("2.6  Image Maps", bg=TEAL, height=26, fontsize=12))
    s.append(sp(6))
    s.append(Paragraph(
        "An <b>image map</b> makes different regions of an image clickable, "
        "each linking to a different URL. It uses the &lt;map&gt; and &lt;area&gt; elements.", body))
    s.append(sp(6))
    s.append(prop_table([
        ["Element/Attribute", "Purpose"],
        ["&lt;map name=\"...\"&gt;",  "Container for the clickable areas. The name must match the usemap attribute of &lt;img&gt;."],
        ["&lt;area&gt;",              "Defines one clickable region. Self-closing."],
        ["shape=\"rect\"",            "Rectangular area. coords: left,top,right,bottom"],
        ["shape=\"circle\"",          "Circular area. coords: center-x,center-y,radius"],
        ["shape=\"poly\"",            "Polygon area. coords: x1,y1,x2,y2,..."],
        ["shape=\"default\"",         "The entire image (fallback area)."],
    ], col_w=[4.5*cm, 13.5*cm]))
    s.append(sp(8))
    s.append(CodeBox([
        "<img src=\"map.png\" alt=\"Diagram\" usemap=\"#diagrammap\">",
        "",
        "<map name=\"diagrammap\">",
        "  <area shape=\"rect\"   coords=\"0,0,100,100\"   href=\"cpu.html\"    alt=\"CPU\">",
        "  <area shape=\"circle\" coords=\"200,200,50\"     href=\"ram.html\"    alt=\"RAM\">",
        "  <area shape=\"poly\"   coords=\"10,100,50,200,100,100\" href=\"gpu.html\" alt=\"GPU\">",
        "</map>",
    ]))
    s.append(PageBreak())

    # ── Sec 3 Forms ──
    s.append(Banner("3  |  HTML Forms", bg=NAVY, height=36, fontsize=16))
    s.append(sp(8))
    s.append(Paragraph(
        "HTML forms collect user input and send it to a server for processing. "
        "Forms are built with the &lt;form&gt; element and various input controls.", body))
    s.append(sp(8))

    s.append(Banner("3.1  The &lt;form&gt; Element & Attributes", bg=ORANGE, fg=WHITE, height=26, fontsize=12))
    s.append(sp(6))
    s.append(prop_table([
        ["Attribute",  "Values",                   "Purpose"],
        ["action",     "URL string",               "Specifies WHERE to send the form data (the server script URL). If omitted, sends to the current page."],
        ["method",     "GET  or  POST",            "Specifies HOW to send the data. GET appends data to URL; POST sends in HTTP body."],
        ["enctype",    "multipart/form-data",      "Required when form includes file uploads. Tells browser how to encode data."],
        ["autocomplete","on  or  off",             "Whether browser should auto-fill form fields."],
        ["novalidate", "(attribute)",              "Disables browser-side validation for testing."],
        ["target",     "_self, _blank",            "Where to display the server response."],
    ], col_w=[3.5*cm, 4.5*cm, 10*cm]))
    s.append(sp(10))

    s.append(Banner("3.2  GET vs POST — The Critical Difference", bg=ORANGE, fg=WHITE, height=26, fontsize=12))
    s.append(sp(6))
    s.append(prop_table([
        ["Feature",        "GET",                                 "POST"],
        ["Data Location",  "Appended to URL: ?name=john&age=25",  "In HTTP request body — not visible in URL"],
        ["Security",       "LESS secure — data visible in URL, browser history, server logs", "MORE secure — data not in URL"],
        ["Data Size",      "Limited (~2000 chars) by URL length",  "No practical limit"],
        ["Caching",        "Can be cached and bookmarked",         "Not cached"],
        ["Best Used For",  "Search queries, filtering, non-sensitive data", "Login forms, payment, file uploads, sensitive data"],
        ["Idempotent?",    "Yes — same request gives same result", "No — each request may change server state"],
    ], col_w=[3.5*cm, 6*cm, 8.5*cm]))
    s.append(sp(8))
    s.append(CodeBox([
        "<!-- GET form — data appears in URL -->",
        "<form action=\"search.php\" method=\"GET\">",
        "  <input type=\"text\" name=\"query\">",
        "  <button type=\"submit\">Search</button>",
        "</form>",
        "<!-- URL becomes: search.php?query=html -->",
        "",
        "<!-- POST form — data in request body -->",
        "<form action=\"login.php\" method=\"POST\">",
        "  <input type=\"email\" name=\"email\">",
        "  <input type=\"password\" name=\"pass\">",
        "  <button type=\"submit\">Login</button>",
        "</form>",
    ]))
    s.append(PageBreak())

    s.append(Banner("3.3  Input Types", bg=ORANGE, fg=WHITE, height=26, fontsize=12))
    s.append(sp(6))
    s.append(Paragraph(
        "The <b>type</b> attribute of &lt;input&gt; determines what kind of data it accepts "
        "and how it appears on screen.", body))
    s.append(sp(6))
    s.append(prop_table([
        ["type Value",   "Input Appearance & Behaviour"],
        ["text",         "Single-line plain text field. Default if type is omitted."],
        ["email",        "Text field with email format validation. Mobile keyboard shows @ key."],
        ["password",     "Text field that hides characters (shows dots/asterisks)."],
        ["number",       "Numeric input with up/down arrows. Accepts min, max, step attributes."],
        ["date",         "Date picker control. Value format: YYYY-MM-DD."],
        ["time",         "Time picker control. Value format: HH:MM."],
        ["tel",          "Telephone number field. No format validation — use pattern for this."],
        ["url",          "URL field with format validation (must include http:// or https://)."],
        ["search",       "Search field. Browser may add X button to clear."],
        ["radio",        "Round button — only ONE option in the same name group can be selected."],
        ["checkbox",     "Square box — MULTIPLE options can be selected simultaneously."],
        ["file",         "File upload button. Use accept attribute to restrict file types."],
        ["range",        "Slider control. Use min, max, step attributes."],
        ["color",        "Color picker control."],
        ["hidden",       "Not visible to user. Sends data silently with the form."],
        ["submit",       "Button that submits the form. value attribute sets button text."],
        ["reset",        "Button that clears all form fields to their default values."],
        ["button",       "Generic clickable button. No default behaviour — use with JavaScript."],
        ["image",        "Submit button displayed as an image (src attribute required)."],
    ], col_w=[3.5*cm, 14.5*cm]))
    s.append(sp(8))
    s.append(CodeBox([
        "<!-- Common input types -->",
        "<input type=\"text\"     name=\"name\"     placeholder=\"Full Name\">",
        "<input type=\"email\"    name=\"email\"    placeholder=\"you@example.com\">",
        "<input type=\"password\" name=\"pass\"     placeholder=\"Min 8 chars\">",
        "<input type=\"number\"   name=\"age\"      min=\"1\" max=\"120\">",
        "<input type=\"date\"     name=\"dob\">",
        "",
        "<!-- Radio buttons — same name = one group -->",
        "<input type=\"radio\" name=\"gender\" value=\"male\">   Male",
        "<input type=\"radio\" name=\"gender\" value=\"female\"> Female",
        "",
        "<!-- Checkboxes — same name = multiple OK -->",
        "<input type=\"checkbox\" name=\"terms\" value=\"yes\"> I agree",
        "<input type=\"checkbox\" name=\"newsletter\" value=\"yes\"> Subscribe",
        "",
        "<!-- File upload -->",
        "<input type=\"file\" name=\"photo\" accept=\"image/*\">",
    ]))
    s.append(sp(8))
    s.append(key_box(
        "Radio buttons in the same group MUST share the same name attribute. "
        "Only one can be selected at a time. "
        "Checkboxes with the same name can ALL be selected simultaneously. "
        "The value attribute is what gets sent to the server."))
    s.append(sp(10))

    s.append(Banner("3.4  Input Validation Attributes", bg=ORANGE, fg=WHITE, height=26, fontsize=12))
    s.append(sp(6))
    s.append(Paragraph(
        "HTML5 provides built-in validation attributes. "
        "The browser checks these before submitting the form — no JavaScript needed!", body))
    s.append(sp(6))
    s.append(prop_table([
        ["Attribute",  "Works On",               "Purpose"],
        ["required",   "Most input types",        "Field cannot be left empty. Form won't submit until filled."],
        ["min",        "number, date, range",     "Minimum allowed value. E.g., min=\"0\" or min=\"2024-01-01\""],
        ["max",        "number, date, range",     "Maximum allowed value."],
        ["minlength",  "text, email, password",   "Minimum number of characters required."],
        ["maxlength",  "text, email, password",   "Maximum number of characters allowed."],
        ["pattern",    "text, email, tel, url",   "Regular expression the value must match. E.g., pattern=\"[A-Za-z]{3,}\""],
        ["step",       "number, range, date",     "Legal increments. step=\"5\" allows 0, 5, 10, 15..."],
        ["placeholder","text inputs",             "Hint text displayed when field is empty. NOT a label."],
        ["readonly",   "Most input types",        "User cannot edit the field but value IS submitted."],
        ["disabled",   "All inputs",              "User cannot interact AND value is NOT submitted."],
    ], col_w=[3.5*cm, 4.5*cm, 10*cm]))
    s.append(sp(8))
    s.append(CodeBox([
        "<form>",
        "  <!-- Required email -->",
        "  <input type=\"email\" name=\"email\" required placeholder=\"Email\">",
        "",
        "  <!-- Number between 18 and 100 -->",
        "  <input type=\"number\" name=\"age\" min=\"18\" max=\"100\" required>",
        "",
        "  <!-- Password: 8+ chars, letters+numbers -->",
        "  <input type=\"password\" name=\"pass\"",
        "         minlength=\"8\" pattern=\"(?=.*[0-9])(?=.*[a-zA-Z]).+\"",
        "         required title=\"Min 8 chars, must include a letter and number\">",
        "",
        "  <!-- Indian phone number pattern -->",
        "  <input type=\"tel\" name=\"phone\" pattern=\"[0-9]{10}\"",
        "         placeholder=\"10-digit number\">",
        "</form>",
    ]))
    s.append(PageBreak())

    s.append(Banner("3.5  &lt;select&gt; & &lt;option&gt; — Dropdown List", bg=ORANGE, fg=WHITE, height=26, fontsize=12))
    s.append(sp(6))
    s.append(Paragraph(
        "The <b>&lt;select&gt;</b> element creates a dropdown list. "
        "Each option in the list is defined by an &lt;option&gt; tag. "
        "The <b>name</b> attribute on &lt;select&gt; is sent to the server; "
        "the <b>value</b> on &lt;option&gt; is what's sent.", body))
    s.append(sp(6))
    s.append(prop_table([
        ["Attribute/Element", "Purpose"],
        ["name",              "On &lt;select&gt;. The field name sent to the server."],
        ["value",             "On &lt;option&gt;. The value sent when this option is selected."],
        ["selected",          "On &lt;option&gt;. Sets the default selected option."],
        ["multiple",          "On &lt;select&gt;. Allows selecting multiple options (Ctrl+Click)."],
        ["size",              "On &lt;select&gt;. Shows N options visible without scrolling."],
        ["&lt;optgroup&gt;",  "Groups &lt;option&gt; elements with a label (non-selectable heading)."],
        ["disabled",          "On &lt;option&gt;. Makes the option non-selectable (grayed out)."],
    ], col_w=[4*cm, 14*cm]))
    s.append(sp(8))
    s.append(CodeBox([
        "<label for=\"country\">Country:</label>",
        "<select name=\"country\" id=\"country\">",
        "  <option value=\"\">-- Select a country --</option>",
        "  <optgroup label=\"South Asia\">",
        "    <option value=\"in\" selected>India</option>",
        "    <option value=\"pk\">Pakistan</option>",
        "  </optgroup>",
        "  <optgroup label=\"Europe\">",
        "    <option value=\"uk\">United Kingdom</option>",
        "    <option value=\"de\">Germany</option>",
        "  </optgroup>",
        "</select>",
    ]))
    s.append(sp(10))

    s.append(Banner("3.6  &lt;textarea&gt; — Multi-line Text Input", bg=ORANGE, fg=WHITE, height=26, fontsize=12))
    s.append(sp(6))
    s.append(Paragraph(
        "The <b>&lt;textarea&gt;</b> element creates a multi-line text input. "
        "Unlike &lt;input&gt;, it has a closing tag and the default value goes between the tags.", body))
    s.append(sp(6))
    s.append(prop_table([
        ["Attribute", "Purpose"],
        ["rows",      "Visible height in number of text lines (default: 2)."],
        ["cols",      "Visible width in average character widths."],
        ["name",      "Field name sent to server."],
        ["placeholder","Hint text shown when empty."],
        ["maxlength", "Maximum number of characters allowed."],
        ["readonly",  "User cannot edit. Value is still submitted."],
        ["resize",    "CSS: resize: none stops user from resizing the textarea."],
    ], col_w=[3*cm, 15*cm]))
    s.append(sp(8))
    s.append(CodeBox([
        "<label for=\"address\">Address:</label>",
        "<textarea name=\"address\" id=\"address\"",
        "          rows=\"4\" cols=\"50\"",
        "          placeholder=\"Enter your full address\"",
        "          maxlength=\"500\"></textarea>",
        "",
        "<!-- Note: content between tags is the default value -->",
        "<textarea name=\"bio\">Edit this text...</textarea>",
    ]))
    s.append(sp(10))

    s.append(Banner("3.7  &lt;button&gt; Element", bg=ORANGE, fg=WHITE, height=26, fontsize=12))
    s.append(sp(6))
    s.append(prop_table([
        ["type Value", "Behaviour"],
        ["submit",     "DEFAULT. Submits the form data to the action URL."],
        ["reset",      "Resets all form fields to their initial/default values."],
        ["button",     "No default action. Must be used with JavaScript onclick to do anything."],
    ], col_w=[3*cm, 15*cm]))
    s.append(sp(8))
    s.append(CodeBox([
        "<!-- These are equivalent for submitting -->",
        "<button type=\"submit\">Submit Form</button>",
        "<input  type=\"submit\" value=\"Submit Form\">",
        "",
        "<!-- Reset button clears all fields -->",
        "<button type=\"reset\">Clear Form</button>",
        "",
        "<!-- Generic button — needs JavaScript -->",
        "<button type=\"button\" onclick=\"doSomething()\">Click Me</button>",
    ]))
    s.append(sp(8))
    s.append(note_box(
        "Use &lt;button&gt; instead of &lt;input type='submit'&gt; when you want to "
        "include HTML inside the button (like an icon or styled text). "
        "&lt;input type='submit'&gt; can only show plain text via its value attribute."))
    s.append(sp(10))

    s.append(Banner("3.8  &lt;label&gt; — Form Field Labels", bg=ORANGE, fg=WHITE, height=26, fontsize=12))
    s.append(sp(6))
    s.append(Paragraph(
        "The <b>&lt;label&gt;</b> element associates descriptive text with a form control. "
        "When the user clicks the label text, the associated input becomes focused. "
        "Essential for accessibility.", body))
    s.append(sp(6))
    s.append(prop_table([
        ["Method",      "How it Works",                    "Example"],
        ["for + id",    "Label's for matches input's id.", "for='email' matches id='email'"],
        ["Wrapping",    "Input is nested inside label.",   "&lt;label&gt;Email &lt;input type='email'&gt;&lt;/label&gt;"],
    ], col_w=[3*cm, 5*cm, 10*cm]))
    s.append(sp(8))
    s.append(CodeBox([
        "<!-- Method 1: for attribute (preferred) -->",
        "<label for=\"email\">Email Address:</label>",
        "<input type=\"email\" id=\"email\" name=\"email\">",
        "",
        "<!-- Method 2: wrapping the input -->",
        "<label>",
        "  Password:",
        "  <input type=\"password\" name=\"password\">",
        "</label>",
        "",
        "<!-- Full accessible form example -->",
        "<form action=\"register.php\" method=\"POST\">",
        "  <label for=\"username\">Username:</label>",
        "  <input type=\"text\" id=\"username\" name=\"username\" required>",
        "",
        "  <label for=\"gender-m\">Male</label>",
        "  <input type=\"radio\" id=\"gender-m\" name=\"gender\" value=\"male\">",
        "</form>",
    ]))
    s.append(sp(8))
    s.append(warn_box(
        "The label's for attribute value MUST exactly match the input's id attribute value. "
        "A missing or mismatched for/id pair breaks accessibility — screen readers "
        "won't be able to associate the label with its control."))
    s.append(PageBreak())

    # Cheatsheet
    s.append(Banner("4  |  Quick-Reference Cheatsheet", bg=NAVY, height=36, fontsize=16))
    s.append(sp(10))
    cheat2 = [
        ["Element / Concept", "Syntax / Value", "Key Point"],
        ["header",      "&lt;header&gt;",       "Top of page or section. Logo, title, nav."],
        ["nav",         "&lt;nav&gt;",           "Navigation links container."],
        ["main",        "&lt;main&gt;",          "ONE per page. Unique page content."],
        ["footer",      "&lt;footer&gt;",        "Bottom. Copyright, contact info."],
        ["section",     "&lt;section&gt;",       "Thematic group with heading."],
        ["article",     "&lt;article&gt;",       "Self-contained content. Blog post, card."],
        ["aside",       "&lt;aside&gt;",         "Sidebar, related links, ads."],
        ["details/summary","&lt;details&gt;&lt;summary&gt;", "Collapsible content. No JS needed."],
        ["figure",      "&lt;figure&gt;",        "Groups image + figcaption."],
        ["a href",      "href=\"url\"",           "Link to URL. Empty href = current page."],
        ["target=_blank","Opens new tab",        "Add rel='noopener' for security."],
        ["Absolute URL","https://example.com",   "Full URL for external links."],
        ["Relative URL","../page.html",          ".. = up one folder."],
        ["#bookmark",   "href=\"#id\"",          "Jump to element with that id."],
        ["Image map",   "&lt;map&gt; + &lt;area&gt;", "Clickable regions on an image. usemap='#name'."],
        ["form action", "action=\"url\"",        "Where to send data."],
        ["method GET",  "data in URL",           "Visible, limited, cacheable."],
        ["method POST", "data in body",          "Secure, unlimited, not cached."],
        ["required",    "(attribute)",           "Field must be filled before submit."],
        ["pattern",     "pattern=\"regex\"",     "Validates input format."],
        ["min / max",   "number/date limits",    "Range validation."],
        ["select+option","dropdown list",        "value = what's sent. selected = default."],
        ["textarea",    "rows + cols",           "Multi-line. Default value between tags."],
        ["button type", "submit/reset/button",   "submit=send. reset=clear. button=JS only."],
        ["label for",   "for='input-id'",        "Must match input's id. Click label = focus input."],
    ]
    cs2 = []
    for i, row in enumerate(cheat2):
        if i == 0:
            cs2.append([Paragraph(c, S("ch2"+str(j), fontSize=9, fontName="Helvetica-Bold", textColor=WHITE))
                        for j, c in enumerate(row)])
        else:
            cs2.append([
                Paragraph(row[0], S("cp2"+str(i), fontSize=8.5, fontName="Courier",
                                    textColor=colors.HexColor("#be185d"))),
                Paragraph(row[1], S("cv2"+str(i), fontSize=8.5, fontName="Courier",
                                    textColor=colors.HexColor("#0369a1"))),
                Paragraph(row[2], S("cn2"+str(i), fontSize=8.5, fontName="Helvetica", textColor=BLACK)),
            ])
    ct2 = Table(cs2, colWidths=[4.5*cm, 5*cm, 8.5*cm], repeatRows=1)
    ct2.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,0), NAVY),
        ("ROWBACKGROUNDS", (0,1), (-1,-1), [WHITE, GREY]),
        ("BOX", (0,0), (-1,-1), 0.5, MIDGREY),
        ("INNERGRID", (0,0), (-1,-1), 0.3, MIDGREY),
        ("TOPPADDING", (0,0), (-1,-1), 4),
        ("BOTTOMPADDING", (0,0), (-1,-1), 4),
        ("LEFTPADDING", (0,0), (-1,-1), 6),
        ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
    ]))
    s.append(ct2)
    s.append(PageBreak())

    # Questions
    s.append(Banner("5  |  Practice Questions & Answers", bg=NAVY, height=36, fontsize=16))
    s.append(sp(10))
    qs2 = [
        ("Q1", "Which semantic element represents the MAIN navigation links of a page?",
         ["A) &lt;header&gt;", "B) &lt;nav&gt; (Correct)", "C) &lt;main&gt;", "D) &lt;aside&gt;"],
         "B -- &lt;nav&gt; is specifically designed for the primary navigation links of a page."),
        ("Q2", "What is the key difference between GET and POST methods?",
         ["A) GET is faster; POST is slower",
          "B) GET appends data to URL; POST sends data in request body (Correct)",
          "C) POST is only for file uploads", "D) GET is more secure than POST"],
         "B -- GET appends form data to the URL (?name=value). POST sends data in the HTTP body, making it more secure and better for sensitive data."),
        ("Q3", "Which input type restricts users to selecting only ONE option from a group?",
         ["A) checkbox", "B) select", "C) radio (Correct)", "D) option"],
         "C -- Radio buttons with the same name attribute form a group where only one can be selected. Checkboxes allow multiple selections."),
        ("Q4", "What attribute makes a form field mandatory before submission?",
         ["A) mandatory", "B) validate", "C) required (Correct)", "D) must"],
         "C -- The required attribute prevents form submission until the field has a valid value. No JavaScript needed."),
        ("Q5", "What does target='_blank' do on an anchor tag?",
         ["A) Opens in same tab", "B) Opens in a new tab/window (Correct)", "C) Downloads the file", "D) Opens in parent frame"],
         "B -- target='_blank' opens the linked page in a new browser tab or window."),
        ("Q6", "In the path '../images/photo.jpg', what does '../' mean?",
         ["A) Go into a subfolder", "B) Go to the root", "C) Go up one folder level (Correct)", "D) Go to the parent domain"],
         "C -- '../' means go UP one directory level. '../../' goes up two levels. A bare filename means same folder."),
        ("Q7", "Which element is used to create a collapsible section without JavaScript?",
         ["A) &lt;collapse&gt;", "B) &lt;toggle&gt;", "C) &lt;details&gt; (Correct)", "D) &lt;accordion&gt;"],
         "C -- The &lt;details&gt; element (with &lt;summary&gt;) creates a native browser toggle/collapsible section."),
        ("Q8", "What must match between &lt;label for='x'&gt; and its input element?",
         ["A) The name attribute", "B) The class attribute", "C) The id attribute (Correct)", "D) The value attribute"],
         "C -- The label's for attribute must match the input's id attribute to link them. This is essential for accessibility."),
        ("Q9", "For a contact form with sensitive messages, which method should you use?",
         ["A) GET", "B) POST (Correct)", "C) PUT", "D) SEND"],
         "B -- POST should be used for sensitive data as it doesn't expose data in the URL, browser history, or server logs."),
        ("Q10", "In an image map, which attribute on &lt;img&gt; connects it to the &lt;map&gt;?",
         ["A) map-name", "B) src", "C) usemap (Correct)", "D) mapref"],
         "C -- The usemap attribute on &lt;img&gt; points to the map using # + the map's name: usemap='#mymap'."),
    ]
    for args in qs2:
        q_block(s, *args)

    summary_panel(s, [
        (BLUE,   "Semantic HTML", "Use semantic elements for meaning: header, nav, main, footer, section, article, aside."),
        (TEAL,   "Links",         "href=URL. _blank=new tab (add rel=noopener). #id=bookmark. ../=up a folder."),
        (ORANGE, "Forms",         "action=where to send. method: GET=URL data, POST=body data. POST for sensitive info."),
        (PURPLE, "Inputs",        "type determines input kind. required, pattern, min, max for validation. radio=one, checkbox=many."),
        (GREEN,  "Form Elements", "select+option=dropdown. textarea=multi-line. button type: submit/reset/button. label for=id."),
    ])
    closing_banner(s, "Module 2 complete! Forms and semantic HTML are core to building real websites. -- Ethnotech Academy")
    return s


# ─────────────────────────────────────────────────────────────────────────────
#  MODULE 3 — Multimedia & CSS Fundamentals
# ─────────────────────────────────────────────────────────────────────────────
def build_module3():
    s = []

    cp = CoverPage("3", "Multimedia & CSS", "Fundamentals",
                   ["Images & Media", "Video & Audio", "CSS Selectors & Cascade"],
                   [TEAL, ORANGE, PURPLE])
    s.append(cp)
    s.append(NextPageTemplate("Normal"))
    s.append(PageBreak())

    s.append(Banner("Table of Contents", bg=NAVY, height=36, fontsize=15))
    s.append(sp(12))
    s.append(toc_table([
        ("1", "Images — &lt;img&gt; Element", "3", True),
        ("  1.1", "Core Attributes: src, alt, width, height", "3", False),
        ("  1.2", "Responsive Images with &lt;picture&gt;", "4", False),
        ("  1.3", "srcset & sizes", "4", False),
        ("2", "Video & Audio", "5", True),
        ("  2.1", "The &lt;video&gt; Element", "5", False),
        ("  2.2", "The &lt;audio&gt; Element", "6", False),
        ("  2.3", "The &lt;source&gt; Element", "6", False),
        ("  2.4", "The &lt;track&gt; Element", "7", False),
        ("3", "Embedded Content — &lt;iframe&gt;", "7", True),
        ("4", "CSS Rule Syntax", "8", True),
        ("  4.1", "Anatomy of a CSS Rule", "8", False),
        ("  4.2", "CSS Comments", "8", False),
        ("5", "CSS Selectors", "9", True),
        ("  5.1", "Element (Type) Selector", "9", False),
        ("  5.2", "Class Selector", "9", False),
        ("  5.3", "ID Selector", "9", False),
        ("  5.4", "Universal Selector", "10", False),
        ("  5.5", "Attribute Selector", "10", False),
        ("  5.6", "Grouping & Combining Selectors", "10", False),
        ("  5.7", "Pseudo-class Selectors", "11", False),
        ("6", "CSS Cascade, Specificity & Inheritance", "12", True),
        ("  6.1", "The Cascade", "12", False),
        ("  6.2", "Specificity — The Scoring System", "12", False),
        ("  6.3", "Inheritance", "13", False),
        ("  6.4", "!important", "13", False),
        ("7", "Quick-Reference Cheatsheet", "14", True),
        ("8", "Practice Questions & Answers", "15", True),
    ]))
    s.append(PageBreak())

    # ── Sec 1 Images ──
    s.append(Banner("1  |  Images — The &lt;img&gt; Element", bg=NAVY, height=36, fontsize=16))
    s.append(sp(8))

    s.append(Banner("1.1  Core Attributes: src, alt, width, height", bg=TEAL, height=26, fontsize=12))
    s.append(sp(6))
    s.append(Paragraph(
        "The <b>&lt;img&gt;</b> tag embeds an image. It is a <b>self-closing</b>, "
        "<b>inline</b> element — it doesn't need a closing tag.", body))
    s.append(sp(6))
    s.append(prop_table([
        ["Attribute",  "Required?", "Purpose"],
        ["src",        "YES",       "Source path (URL or relative path) to the image file. Without src, no image appears."],
        ["alt",        "YES",       "Alternative text description. Shown when image fails to load. "
                                    "Read by screen readers. Required for accessibility and SEO. "
                                    "Use alt='' (empty) for purely decorative images."],
        ["width",      "Recommended", "Width of the image in pixels (or CSS). Prevents layout shift while loading."],
        ["height",     "Recommended", "Height of the image in pixels (or CSS). Prevents layout shift while loading."],
        ["title",      "No",        "Tooltip text shown when hovering over the image."],
        ["loading",    "No",        "loading='lazy' defers loading until image is near viewport. Improves performance."],
    ], col_w=[3*cm, 3.5*cm, 11.5*cm]))
    s.append(sp(8))
    s.append(CodeBox([
        "<!-- Basic image with all recommended attributes -->",
        "<img src=\"images/logo.png\"",
        "     alt=\"Ethnotech Academy Logo\"",
        "     width=\"200\"",
        "     height=\"80\">",
        "",
        "<!-- External image -->",
        "<img src=\"https://example.com/photo.jpg\" alt=\"Sample photo\">",
        "",
        "<!-- Decorative image — empty alt -->",
        "<img src=\"divider.png\" alt=\"\">",
        "",
        "<!-- Lazy loaded image -->",
        "<img src=\"hero-large.jpg\" alt=\"Hero banner\" loading=\"lazy\">",
    ]))
    s.append(sp(8))
    s.append(warn_box(
        "NEVER omit the alt attribute. Without alt, images are inaccessible to blind users and "
        "screen readers. For purely decorative images (e.g., background shapes), use alt='' "
        "(empty string) — this tells screen readers to skip it."))
    s.append(sp(10))

    s.append(Banner("1.2  Responsive Images with &lt;picture&gt;", bg=TEAL, height=26, fontsize=12))
    s.append(sp(6))
    s.append(Paragraph(
        "The <b>&lt;picture&gt;</b> element lets you serve <b>different images</b> based on "
        "screen size, resolution, or format support. "
        "The browser picks the FIRST &lt;source&gt; that matches its conditions.", body))
    s.append(sp(6))
    s.append(CodeBox([
        "<picture>",
        "  <!-- Source for large screens (min-width: 800px) -->",
        "  <source media=\"(min-width: 800px)\" srcset=\"hero-desktop.jpg\">",
        "",
        "  <!-- Source for medium screens -->",
        "  <source media=\"(min-width: 400px)\" srcset=\"hero-tablet.jpg\">",
        "",
        "  <!-- Fallback — also shown if picture/source not supported -->",
        "  <img src=\"hero-mobile.jpg\" alt=\"Hero image\">",
        "</picture>",
        "",
        "<!-- WebP with JPEG fallback (format-based) -->",
        "<picture>",
        "  <source type=\"image/webp\" srcset=\"image.webp\">",
        "  <source type=\"image/jpeg\" srcset=\"image.jpg\">",
        "  <img src=\"image.jpg\" alt=\"Sample image\">",
        "</picture>",
    ]))
    s.append(sp(8))
    s.append(key_box(
        "The &lt;img&gt; tag inside &lt;picture&gt; is MANDATORY. "
        "It acts as the fallback for browsers that don't support &lt;picture&gt;. "
        "The alt attribute goes on the &lt;img&gt; element, not on &lt;picture&gt;."))
    s.append(sp(10))

    s.append(Banner("1.3  srcset Attribute on &lt;img&gt;", bg=TEAL, height=26, fontsize=12))
    s.append(sp(6))
    s.append(Paragraph(
        "The <b>srcset</b> attribute lets you provide multiple image versions so the browser "
        "can pick the best one for the user's screen resolution.", body))
    s.append(sp(6))
    s.append(CodeBox([
        "<!-- Pixel density descriptor: 1x, 2x for retina -->",
        "<img src=\"image.jpg\"",
        "     srcset=\"image.jpg 1x, image@2x.jpg 2x\"",
        "     alt=\"Sample\">",
        "",
        "<!-- Width descriptor: browser picks based on screen -->",
        "<img src=\"small.jpg\"",
        "     srcset=\"small.jpg 480w, medium.jpg 800w, large.jpg 1200w\"",
        "     sizes=\"(max-width: 600px) 480px, 100vw\"",
        "     alt=\"Responsive image\">",
    ]))
    s.append(PageBreak())

    # ── Sec 2 Video & Audio ──
    s.append(Banner("2  |  Video & Audio", bg=NAVY, height=36, fontsize=16))
    s.append(sp(8))

    s.append(Banner("2.1  The &lt;video&gt; Element", bg=ORANGE, fg=WHITE, height=26, fontsize=12))
    s.append(sp(6))
    s.append(Paragraph(
        "The <b>&lt;video&gt;</b> element embeds video content directly in the page "
        "without any plugin (like Flash). Content between the tags is fallback text for "
        "browsers that don't support the video element.", body))
    s.append(sp(6))
    s.append(prop_table([
        ["Attribute",   "Purpose"],
        ["src",         "Path to the video file. Alternative: use nested &lt;source&gt; elements."],
        ["controls",    "Displays the video player controls (play, pause, volume, fullscreen). No value needed."],
        ["autoplay",    "Starts playing automatically when page loads. Usually blocked by browsers without muted."],
        ["muted",       "Mutes the audio. Required for autoplay to work in most modern browsers."],
        ["loop",        "Replays the video when it ends."],
        ["poster",      "URL of an image shown before the video plays (like a thumbnail)."],
        ["width/height","Sets video player dimensions in pixels."],
        ["preload",     "none=no preload. metadata=load only metadata. auto=load entire video."],
    ], col_w=[3.5*cm, 14.5*cm]))
    s.append(sp(8))
    s.append(CodeBox([
        "<!-- Basic video with controls -->",
        "<video src=\"movie.mp4\" controls width=\"640\" height=\"360\">",
        "  Your browser does not support the video tag.",
        "</video>",
        "",
        "<!-- Multiple formats for compatibility -->",
        "<video controls width=\"640\" height=\"360\" poster=\"thumbnail.jpg\">",
        "  <source src=\"movie.mp4\"  type=\"video/mp4\">",
        "  <source src=\"movie.webm\" type=\"video/webm\">",
        "  <source src=\"movie.ogv\"  type=\"video/ogg\">",
        "  Your browser does not support HTML5 video.",
        "</video>",
        "",
        "<!-- Autoplay requires muted in modern browsers -->",
        "<video src=\"bg-video.mp4\" autoplay muted loop></video>",
    ]))
    s.append(sp(10))

    s.append(Banner("2.2  The &lt;audio&gt; Element", bg=ORANGE, fg=WHITE, height=26, fontsize=12))
    s.append(sp(6))
    s.append(Paragraph(
        "The <b>&lt;audio&gt;</b> element embeds audio content. "
        "It shares most attributes with &lt;video&gt; except poster, width, and height.", body))
    s.append(sp(6))
    s.append(prop_table([
        ["Attribute",  "Purpose"],
        ["src",        "Path to audio file. Alternative: use nested &lt;source&gt; elements."],
        ["controls",   "Displays the audio player controls. Without this, nothing is visible."],
        ["autoplay",   "Starts playing automatically. Usually blocked by browsers."],
        ["muted",      "Mutes the audio initially."],
        ["loop",       "Replays when audio ends."],
        ["preload",    "Controls how much of the audio is preloaded."],
    ], col_w=[3.5*cm, 14.5*cm]))
    s.append(sp(8))
    s.append(CodeBox([
        "<!-- Basic audio player -->",
        "<audio controls>",
        "  <source src=\"music.mp3\"  type=\"audio/mpeg\">",
        "  <source src=\"music.ogg\"  type=\"audio/ogg\">",
        "  Your browser does not support audio.",
        "</audio>",
        "",
        "<!-- Autoplay background music (muted required) -->",
        "<audio src=\"bg-music.mp3\" autoplay muted loop></audio>",
    ]))
    s.append(sp(10))

    s.append(Banner("2.3  &lt;source&gt; Element", bg=ORANGE, fg=WHITE, height=26, fontsize=12))
    s.append(sp(6))
    s.append(Paragraph(
        "The <b>&lt;source&gt;</b> element specifies multiple media files inside "
        "&lt;video&gt;, &lt;audio&gt;, or &lt;picture&gt;. The browser tries each in order "
        "and uses the first one it can play.", body))
    s.append(sp(6))
    s.append(prop_table([
        ["Attribute", "Purpose"],
        ["src",       "URL of the media file."],
        ["type",      "MIME type of the media. Helps browser decide without downloading. "
                      "E.g., type='video/mp4', type='audio/mpeg', type='image/webp'"],
        ["media",     "Media query — used inside &lt;picture&gt; to pick based on screen size."],
        ["srcset",    "List of image URLs for &lt;picture&gt; &lt;source&gt;."],
    ], col_w=[3*cm, 15*cm]))
    s.append(sp(8))
    s.append(tip_box(
        "Always provide the type attribute on &lt;source&gt;. Without it, the browser must "
        "download part of each file to determine if it can play it. "
        "With type, it can skip unsupported formats immediately.",  "Performance Tip"))
    s.append(sp(10))

    s.append(Banner("2.4  &lt;track&gt; Element — Subtitles & Captions", bg=ORANGE, fg=WHITE, height=26, fontsize=12))
    s.append(sp(6))
    s.append(Paragraph(
        "The <b>&lt;track&gt;</b> element provides timed text tracks for &lt;video&gt; "
        "and &lt;audio&gt; — most commonly subtitles and captions. "
        "Track files are in WebVTT format (.vtt).", body))
    s.append(sp(6))
    s.append(prop_table([
        ["Attribute", "Purpose"],
        ["src",       "URL to the .vtt track file."],
        ["kind",      "subtitles / captions / descriptions / chapters / metadata"],
        ["srclang",   "Language of the track (e.g., 'en', 'fr', 'te')."],
        ["label",     "User-visible name for the track in the player menu."],
        ["default",   "Makes this track the default one shown."],
    ], col_w=[3.5*cm, 14.5*cm]))
    s.append(sp(8))
    s.append(CodeBox([
        "<video controls>",
        "  <source src=\"lecture.mp4\" type=\"video/mp4\">",
        "  <track src=\"captions-en.vtt\" kind=\"captions\"",
        "         srclang=\"en\" label=\"English\" default>",
        "  <track src=\"captions-te.vtt\" kind=\"subtitles\"",
        "         srclang=\"te\" label=\"Telugu\">",
        "</video>",
    ]))
    s.append(PageBreak())

    # ── Sec 3 iFrame ──
    s.append(Banner("3  |  Embedded Content — &lt;iframe&gt;", bg=NAVY, height=36, fontsize=16))
    s.append(sp(8))
    s.append(Paragraph(
        "The <b>&lt;iframe&gt;</b> (inline frame) element embeds another web page or resource "
        "directly inside your page. Commonly used for YouTube videos, Google Maps, and external widgets.", body))
    s.append(sp(6))
    s.append(prop_table([
        ["Attribute",       "Purpose"],
        ["src",             "URL of the page or resource to embed."],
        ["width / height",  "Dimensions of the iframe in pixels. Use CSS for responsive sizing."],
        ["title",           "Accessibility description. Required for screen readers."],
        ["allowfullscreen", "Allows the embedded content to be viewed fullscreen. Needed for video players."],
        ["loading",         "loading='lazy' defers loading until near viewport."],
        ["allow",           "Permission policy. E.g., allow='accelerometer; autoplay; clipboard-write'"],
        ["sandbox",         "Restricts iframe content for security (no scripts, no forms, no popups)."],
        ["frameborder",     "0 = no border (deprecated — use CSS border: none instead)."],
    ], col_w=[4*cm, 14*cm]))
    s.append(sp(8))
    s.append(CodeBox([
        "<!-- Embed a YouTube video -->",
        "<iframe",
        "  src=\"https://www.youtube.com/embed/VIDEO_ID\"",
        "  width=\"560\"",
        "  height=\"315\"",
        "  title=\"YouTube Tutorial\"",
        "  allowfullscreen",
        "  allow=\"accelerometer; autoplay; clipboard-write; encrypted-media\"",
        "></iframe>",
        "",
        "<!-- Embed Google Maps -->",
        "<iframe",
        "  src=\"https://maps.google.com/maps?q=hyderabad&output=embed\"",
        "  width=\"600\" height=\"450\"",
        "  title=\"Our Location\"",
        "  style=\"border:0;\"",
        "  loading=\"lazy\"",
        "></iframe>",
    ]))
    s.append(sp(8))
    s.append(warn_box(
        "iframes are a potential security risk. Use the sandbox attribute when embedding "
        "untrusted content. For YouTube, always use the /embed/ URL format, "
        "not the regular watch URL."))
    s.append(PageBreak())

    # ── Sec 4 CSS Syntax ──
    s.append(Banner("4  |  CSS Rule Syntax", bg=NAVY, height=36, fontsize=16))
    s.append(sp(8))

    s.append(Banner("4.1  Anatomy of a CSS Rule", bg=BLUE, height=26, fontsize=12))
    s.append(sp(6))
    s.append(Paragraph(
        "Every CSS rule has two parts: a <b>selector</b> (which elements to style) "
        "and a <b>declaration block</b> (what styles to apply).", body))
    s.append(sp(6))
    s.append(CodeBox([
        "/* CSS Rule Anatomy */",
        "",
        "selector {",
        "    property: value;       /* one declaration */",
        "    property: value;       /* another declaration */",
        "}",
        "",
        "/* Real example */",
        "h1 {",
        "    color: navy;           /* property: color   value: navy */",
        "    font-size: 2rem;       /* property: font-size  value: 2rem */",
        "    text-align: center;",
        "}",
        "",
        "/* Multiple selectors — same styles */",
        "h1, h2, h3 {",
        "    font-family: Arial, sans-serif;",
        "}",
    ]))
    s.append(sp(8))
    s.append(prop_table([
        ["Term",              "Definition",              "Example"],
        ["Selector",          "Targets the element(s) to style", "h1, .card, #header"],
        ["Declaration block", "Everything inside { }",   "{ color: red; }"],
        ["Declaration",       "One property + value pair","color: red;"],
        ["Property",          "What aspect to style",    "color, font-size, margin"],
        ["Value",             "How to style that property","red, 16px, 2em"],
    ], col_w=[3.5*cm, 6*cm, 8.5*cm]))
    s.append(sp(8))

    s.append(Banner("4.2  CSS Comments", bg=BLUE, height=26, fontsize=12))
    s.append(sp(6))
    s.append(CodeBox([
        "/* This is a CSS comment — ignored by the browser */",
        "",
        "/* Single-line comment */",
        "h1 { color: navy; /* inline comment */ }",
        "",
        "/*",
        "  Multi-line comment:",
        "  Used to explain sections of CSS",
        "*/",
    ]))
    s.append(sp(8))
    s.append(note_box(
        "CSS only has one comment style: /* ... */. "
        "Unlike JavaScript, // does NOT work in CSS. "
        "Commented-out CSS is completely ignored by the browser."))
    s.append(PageBreak())

    # ── Sec 5 Selectors ──
    s.append(Banner("5  |  CSS Selectors", bg=NAVY, height=36, fontsize=16))
    s.append(sp(8))
    s.append(Paragraph(
        "A CSS selector determines WHICH HTML elements a CSS rule applies to. "
        "There are many types of selectors — from simple to complex.", body))
    s.append(sp(8))

    s.append(Banner("5.1  Element (Type) Selector", bg=BLUE, height=26, fontsize=12))
    s.append(sp(6))
    s.append(Paragraph(
        "Targets ALL elements of a given HTML tag name. Affects every instance of that tag on the page.", body))
    s.append(sp(6))
    s.append(CodeBox([
        "p    { color: #333; line-height: 1.6; }  /* all paragraphs */",
        "h1   { font-size: 2rem; color: navy; }   /* all h1 headings */",
        "a    { text-decoration: none; }           /* all links */",
        "table{ border-collapse: collapse; }       /* all tables */",
    ]))
    s.append(sp(10))

    s.append(Banner("5.2  Class Selector (.classname)", bg=BLUE, height=26, fontsize=12))
    s.append(sp(6))
    s.append(Paragraph(
        "Targets elements that have a specific <b>class</b> attribute value. "
        "Uses a <b>dot (.)</b> prefix. "
        "Multiple elements can share the same class. One element can have multiple classes.", body))
    s.append(sp(6))
    s.append(CodeBox([
        "/* CSS */",
        ".highlight { background-color: yellow; }",
        ".btn { padding: 10px 20px; border-radius: 4px; }",
        ".btn.primary { background-color: blue; color: white; }",
        "",
        "/* HTML */",
        "<p class=\"highlight\">This text is highlighted.</p>",
        "<button class=\"btn primary\">Click Me</button>",
        "<!-- Multiple classes: btn AND primary both apply -->",
    ]))
    s.append(sp(10))

    s.append(Banner("5.3  ID Selector (#idname)", bg=BLUE, height=26, fontsize=12))
    s.append(sp(6))
    s.append(Paragraph(
        "Targets the ONE element with a specific <b>id</b> attribute. "
        "Uses a <b>hash (#)</b> prefix. "
        "ID must be <b>unique</b> on the page — no two elements should share the same ID.", body))
    s.append(sp(6))
    s.append(CodeBox([
        "/* CSS */",
        "#header { background-color: navy; height: 80px; }",
        "#nav-menu { display: flex; gap: 20px; }",
        "",
        "/* HTML */",
        "<header id=\"header\">Site Header</header>",
        "<nav id=\"nav-menu\">Navigation</nav>",
    ]))
    s.append(sp(8))
    s.append(prop_table([
        ["Feature",       "Element Selector",   "Class Selector",     "ID Selector"],
        ["Syntax",        "p, h1, div",         ".classname",         "#idname"],
        ["Targets",       "ALL matching tags",  "Any elements with that class", "ONE unique element"],
        ["Reusable?",     "Yes",                "Yes",                "No — unique per page"],
        ["Specificity",   "1  (lowest)",        "10",                 "100 (highest of these 3)"],
    ], col_w=[3.5*cm, 4.5*cm, 4.5*cm, 5.5*cm]))
    s.append(sp(10))

    s.append(Banner("5.4  Universal Selector (*)", bg=BLUE, height=26, fontsize=12))
    s.append(sp(6))
    s.append(Paragraph(
        "The <b>*</b> (asterisk) selects ALL elements on the page. "
        "Commonly used for CSS resets.", body))
    s.append(sp(6))
    s.append(CodeBox([
        "/* CSS Reset — remove default browser margin and padding */",
        "* {",
        "    margin: 0;",
        "    padding: 0;",
        "    box-sizing: border-box;",
        "}",
    ]))
    s.append(sp(10))

    s.append(Banner("5.5  Attribute Selectors", bg=BLUE, height=26, fontsize=12))
    s.append(sp(6))
    s.append(prop_table([
        ["Selector",           "Matches"],
        ["[attr]",             "Elements with the attribute present (any value)."],
        ["[attr='value']",     "Elements with attribute exactly equal to 'value'."],
        ["[attr^='value']",    "Elements where attribute starts with 'value'."],
        ["[attr$='value']",    "Elements where attribute ends with 'value'."],
        ["[attr*='value']",    "Elements where attribute contains 'value' anywhere."],
    ], col_w=[5*cm, 13*cm]))
    s.append(sp(8))
    s.append(CodeBox([
        "a[target]        { color: green; }       /* links with target attribute */",
        "a[target='_blank']{ color: orange; }      /* links opening in new tab */",
        "input[type='text']{ border: 1px solid; }  /* text inputs only */",
        "a[href^='https'] { color: blue; }         /* links starting with https */",
        "a[href$='.pdf']  { color: red; }          /* links to PDFs */",
    ]))
    s.append(sp(10))

    s.append(Banner("5.6  Grouping & Combinators", bg=BLUE, height=26, fontsize=12))
    s.append(sp(6))
    s.append(prop_table([
        ["Selector",     "Name",               "Selects"],
        ["A, B",         "Grouping",           "Both A and B elements."],
        ["A B",          "Descendant",         "B elements ANYWHERE inside A (any depth)."],
        ["A > B",        "Direct Child",       "B elements that are DIRECT children of A only."],
        ["A + B",        "Adjacent Sibling",   "B that is IMMEDIATELY after A (same parent)."],
        ["A ~ B",        "General Sibling",    "ALL B siblings that come after A (same parent)."],
    ], col_w=[3*cm, 4*cm, 11*cm]))
    s.append(sp(8))
    s.append(CodeBox([
        "/* Grouping */",
        "h1, h2, h3 { font-family: Arial; }",
        "",
        "/* Descendant — any p inside .article */",
        ".article p { line-height: 1.8; }",
        "",
        "/* Direct child — only direct li inside nav ul */",
        "nav > ul > li { display: inline-block; }",
        "",
        "/* Adjacent sibling — p immediately after h2 */",
        "h2 + p { margin-top: 0; }",
        "",
        "/* General sibling — all p after h2 */",
        "h2 ~ p { color: gray; }",
    ]))
    s.append(PageBreak())

    s.append(Banner("5.7  Pseudo-class Selectors", bg=BLUE, height=26, fontsize=12))
    s.append(sp(6))
    s.append(Paragraph(
        "Pseudo-classes select elements based on their <b>state</b> or <b>position</b>. "
        "They are written with a colon (:) after the selector.", body))
    s.append(sp(6))
    s.append(prop_table([
        ["Pseudo-class",         "When It Applies"],
        [":hover",               "Mouse cursor is over the element."],
        [":focus",               "Element has keyboard focus (clicked into or tabbed to). Important for form fields."],
        [":active",              "Element is being clicked/activated."],
        [":visited",             "Link that the user has already visited."],
        [":link",                "Unvisited link."],
        [":checked",             "Checkbox or radio button that is checked."],
        [":disabled",            "Form element that is disabled."],
        [":first-child",         "Element that is the FIRST child of its parent."],
        [":last-child",          "Element that is the LAST child of its parent."],
        [":nth-child(n)",        "Element that is the Nth child. Can use formulas: 2n = even, 2n+1 = odd."],
        [":nth-child(odd)",      "Every odd child (1st, 3rd, 5th...). Same as nth-child(2n+1)."],
        [":nth-child(even)",     "Every even child (2nd, 4th, 6th...). Same as nth-child(2n)."],
        [":first-of-type",       "First element of a specific type within its parent."],
        [":not(selector)",       "Elements that do NOT match the given selector."],
        [":root",                "The root element of the page — same as html but with higher specificity."],
    ], col_w=[5*cm, 13*cm]))
    s.append(sp(8))
    s.append(CodeBox([
        "/* State pseudo-classes */",
        "button:hover   { background-color: #1d4ed8; }",
        "input:focus    { outline: 2px solid blue; border-color: blue; }",
        "input:disabled { background-color: #f0f0f0; cursor: not-allowed; }",
        "",
        "/* Structural pseudo-classes */",
        "li:first-child { font-weight: bold; }",
        "li:last-child  { border-bottom: none; }",
        "tr:nth-child(even) { background-color: #f8f8f8; }  /* zebra table */",
        "tr:nth-child(odd)  { background-color: #ffffff; }",
        "",
        "/* :not() exclusion */",
        "p:not(.intro) { color: gray; }  /* all p except .intro */",
    ]))
    s.append(PageBreak())

    # ── Sec 6 Cascade & Specificity ──
    s.append(Banner("6  |  CSS Cascade, Specificity & Inheritance", bg=NAVY, height=36, fontsize=16))
    s.append(sp(8))

    s.append(Banner("6.1  The Cascade", bg=PURPLE, height=26, fontsize=12))
    s.append(sp(6))
    s.append(Paragraph(
        "The <b>Cascade</b> is the algorithm CSS uses to decide which rule wins "
        "when multiple rules target the same element and property. "
        "It works in this priority order:", body))
    s.append(sp(6))
    s.append(prop_table([
        ["Priority", "Factor",         "Explanation"],
        ["1st",  "Origin & !important","User-agent (browser) < Author (developer) < User. !important reverses order."],
        ["2nd",  "Specificity",        "More specific selectors win. Calculated as a score (see below)."],
        ["3rd",  "Source Order",       "If specificity ties, the rule declared LAST in the CSS wins."],
    ], col_w=[2*cm, 4*cm, 12*cm]))
    s.append(sp(10))

    s.append(Banner("6.2  Specificity — The Scoring System", bg=PURPLE, height=26, fontsize=12))
    s.append(sp(6))
    s.append(Paragraph(
        "Specificity is calculated as a <b>three-part score</b>: (A, B, C). "
        "Higher score always wins, compared left to right.", body))
    s.append(sp(6))
    s.append(prop_table([
        ["Column", "Value",  "What Contributes"],
        ["A (hundreds)", "100 per ID",       "Each ID selector (#name) = 100 points"],
        ["B (tens)",     "10 per class",     "Each class (.name), attribute ([type]), pseudo-class (:hover) = 10 points"],
        ["C (ones)",     "1 per element",    "Each element/type selector (p, h1, div) and pseudo-element (::before) = 1 point"],
        ["Inline style", "1000 (override)",  "style='...' attribute on the element itself = 1000 (always wins over external/internal CSS)"],
        ["!important",   "Wins everything",  "Overrides all of the above. Use only as a last resort."],
    ], col_w=[3.5*cm, 3.5*cm, 11*cm]))
    s.append(sp(8))
    s.append(CodeBox([
        "/* Specificity examples */",
        "",
        "p               { color: black; }    /* (0,0,1) = 1  */",
        ".intro          { color: blue;  }    /* (0,1,0) = 10 */",
        "#main           { color: green; }    /* (1,0,0) = 100*/",
        "p.intro         { color: red;   }    /* (0,1,1) = 11 */",
        "#main p.intro   { color: purple;}    /* (1,1,1) = 111*/",
        "",
        "/* inline style — 1000 points */",
        "<p style=\"color: orange\">             /* 1000 — beats all above */",
        "",
        "/* !important — overrides everything */",
        "p { color: pink !important; }         /* wins over inline too */",
    ]))
    s.append(sp(8))
    s.append(key_box(
        "Specificity Score Cheatsheet: "
        "!important > inline style (1000) > ID (100) > Class/Attribute/Pseudo-class (10) > Element (1). "
        "When scores are equal, the LAST declared rule wins."))
    s.append(sp(10))

    s.append(Banner("6.3  Inheritance", bg=PURPLE, height=26, fontsize=12))
    s.append(sp(6))
    s.append(Paragraph(
        "Some CSS properties are <b>inherited</b> — child elements automatically get "
        "the property value of their parent unless overridden.", body))
    s.append(sp(6))
    s.append(prop_table([
        ["Type",              "Examples",                             "Notes"],
        ["Inherited",         "color, font-family, font-size, font-weight, "
                              "line-height, text-align, letter-spacing, list-style",
         "Text/font properties are almost always inherited."],
        ["Not Inherited",     "margin, padding, border, background, width, "
                              "height, display, position, float",
         "Box model and layout properties are NOT inherited."],
    ], col_w=[3.5*cm, 8*cm, 6.5*cm]))
    s.append(sp(8))
    s.append(CodeBox([
        "/* Parent sets font — all children inherit */",
        "body {",
        "    font-family: Arial, sans-serif;   /* inherited by ALL elements */",
        "    color: #333;                       /* inherited by ALL text */",
        "}",
        "",
        "/* Child overrides the inherited value */",
        "h1 { color: navy; }   /* overrides body's color: #333 */",
        "",
        "/* Force inheritance for non-inherited property */",
        "div { border: inherit; }",
    ]))
    s.append(sp(10))

    s.append(Banner("6.4  !important — Override Everything", bg=PURPLE, height=26, fontsize=12))
    s.append(sp(6))
    s.append(Paragraph(
        "The <b>!important</b> declaration makes a CSS rule override ALL other declarations, "
        "including inline styles, regardless of specificity.", body))
    s.append(sp(6))
    s.append(CodeBox([
        "/* !important overrides inline styles and IDs */",
        "p { color: red !important; }",
        "",
        "/* HTML: even inline style is overridden */",
        "<p style=\"color: blue;\">This text is RED (due to !important)</p>",
        "",
        "/* When two !important rules conflict, higher specificity wins */",
        "#myid p { color: green !important; }   /* wins — higher specificity */",
        "p       { color: red   !important; }   /* loses to the ID rule above */",
    ]))
    s.append(sp(8))
    s.append(warn_box(
        "Avoid using !important in general CSS. It makes debugging very difficult "
        "because it breaks the natural cascade. Use it only when you cannot increase "
        "specificity (e.g., overriding third-party library styles)."))
    s.append(PageBreak())

    # Cheatsheet
    s.append(Banner("7  |  Quick-Reference Cheatsheet", bg=NAVY, height=36, fontsize=16))
    s.append(sp(10))
    cheat3 = [
        ["Concept / Element", "Syntax / Value", "Key Point"],
        ["img src",         "src='path'",                 "Required. Relative or absolute URL."],
        ["img alt",         "alt='description'",          "Required for accessibility. Empty alt='' for decorative."],
        ["picture",         "&lt;picture&gt;+&lt;source&gt;+&lt;img&gt;","Serves different images by screen/format."],
        ["video controls",  "&lt;video controls&gt;",     "Shows play/pause/volume controls."],
        ["video autoplay",  "autoplay muted",             "autoplay only works with muted in modern browsers."],
        ["audio controls",  "&lt;audio controls&gt;",     "Without controls, audio is invisible."],
        ["source type",     "type='video/mp4'",           "Helps browser skip incompatible files."],
        ["track kind",      "kind='subtitles/captions'",  ".vtt file for timed text."],
        ["iframe src",      "src='https://...'",          "Embeds another page. title required for accessibility."],
        ["CSS rule",        "selector { prop: value; }",  "Semicolon after each declaration."],
        ["CSS comment",     "/* comment */",              "Only this format. // does NOT work in CSS."],
        ["Element selector","p, h1, div",                 "Targets all matching tags. Specificity = 1."],
        ["Class selector",  ".classname",                 "Targets all with class. Specificity = 10."],
        ["ID selector",     "#idname",                    "Unique element. Specificity = 100."],
        ["Universal",       "*",                          "All elements. Used in CSS resets."],
        ["Descendant",      "A B",                        "B inside A (any depth)."],
        ["Child",           "A > B",                      "B is direct child of A only."],
        [":hover",          "element:hover",              "Mouse over the element."],
        [":focus",          "input:focus",                "Element has keyboard focus."],
        [":nth-child(n)",   "tr:nth-child(even)",         "Zebra striping tables."],
        ["Specificity",     "ID=100 Class=10 Element=1",  "Higher score always wins."],
        ["!important",      "color: red !important",      "Overrides everything. Use sparingly."],
        ["Cascade order",   "Specificity > Source order", "Last declared wins if equal specificity."],
        ["Inheritance",     "color, font-family",         "Text props inherited. Margin/padding NOT."],
    ]
    cs3 = []
    for i, row in enumerate(cheat3):
        if i == 0:
            cs3.append([Paragraph(c, S("ch3"+str(j), fontSize=9, fontName="Helvetica-Bold", textColor=WHITE))
                        for j, c in enumerate(row)])
        else:
            cs3.append([
                Paragraph(row[0], S("cp3"+str(i), fontSize=8.5, fontName="Courier",
                                    textColor=colors.HexColor("#be185d"))),
                Paragraph(row[1], S("cv3"+str(i), fontSize=8.5, fontName="Courier",
                                    textColor=colors.HexColor("#0369a1"))),
                Paragraph(row[2], S("cn3"+str(i), fontSize=8.5, fontName="Helvetica", textColor=BLACK)),
            ])
    ct3 = Table(cs3, colWidths=[4.5*cm, 5*cm, 8.5*cm], repeatRows=1)
    ct3.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,0), NAVY),
        ("ROWBACKGROUNDS", (0,1), (-1,-1), [WHITE, GREY]),
        ("BOX", (0,0), (-1,-1), 0.5, MIDGREY),
        ("INNERGRID", (0,0), (-1,-1), 0.3, MIDGREY),
        ("TOPPADDING", (0,0), (-1,-1), 4),
        ("BOTTOMPADDING", (0,0), (-1,-1), 4),
        ("LEFTPADDING", (0,0), (-1,-1), 6),
        ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
    ]))
    s.append(ct3)
    s.append(PageBreak())

    # Questions
    s.append(Banner("8  |  Practice Questions & Answers", bg=NAVY, height=36, fontsize=16))
    s.append(sp(10))
    qs3 = [
        ("Q1", "Which attribute is REQUIRED on the &lt;img&gt; element for accessibility?",
         ["A) src", "B) width", "C) alt (Correct)", "D) title"],
         "C -- The alt attribute provides alternative text for screen readers and when images fail to load. It is required for accessibility."),
        ("Q2", "What is the purpose of the &lt;picture&gt; element?",
         ["A) Displays a photo gallery",
          "B) Serves different images based on screen size or format (Correct)",
          "C) Creates image slideshows", "D) Adds captions to images"],
         "B -- &lt;picture&gt; with &lt;source&gt; elements lets the browser choose the best image for the screen size and format support."),
        ("Q3", "Which attribute must be present for the &lt;video&gt; element to show play/pause controls?",
         ["A) play", "B) src", "C) controls (Correct)", "D) type"],
         "C -- The controls attribute (no value needed) displays the browser's built-in video player controls."),
        ("Q4", "Which CSS selector has the HIGHEST specificity?",
         ["A) p (element)", "B) .highlight (class)", "C) #main (ID) (Correct)", "D) * (universal)"],
         "C -- ID selectors have specificity 100. Class = 10. Element = 1. Universal = 0."),
        ("Q5", "What does the descendant combinator (space) do in 'nav a' ?",
         ["A) Selects a elements that are direct children of nav",
          "B) Selects ALL a elements inside nav, at any depth (Correct)",
          "C) Selects nav and a separately", "D) Selects a elements next to nav"],
         "B -- A space between selectors is the descendant combinator. It selects all matching elements anywhere inside the parent, not just direct children."),
        ("Q6", "If two CSS rules have equal specificity, which one wins?",
         ["A) The first declared rule", "B) The rule with more properties",
          "C) The last declared rule (Correct)", "D) They cancel each other"],
         "C -- When specificity is equal, the CASCADE applies: the rule declared LAST in the CSS wins."),
        ("Q7", "Which CSS pseudo-class applies styles when a user's mouse is over an element?",
         ["A) :focus", "B) :active", "C) :hover (Correct)", "D) :visited"],
         "C -- :hover applies when the mouse cursor is positioned over an element."),
        ("Q8", "For video autoplay to work in modern browsers, which other attribute is required?",
         ["A) loop", "B) controls", "C) muted (Correct)", "D) poster"],
         "C -- Modern browsers block autoplay with sound for user experience. autoplay only works when the video is also muted."),
        ("Q9", "What is the specificity score of the selector: #nav .menu li ?",
         ["A) (0,0,3) = 3", "B) (1,1,1) = 111 (Correct)", "C) (0,1,1) = 11", "D) (1,0,0) = 100"],
         "B -- #nav = 100 (ID), .menu = 10 (class), li = 1 (element). Total = 111."),
        ("Q10", "Which CSS property value is inherited by child elements by default?",
         ["A) margin", "B) padding", "C) border", "D) color (Correct)"],
         "D -- color (and other text/font properties) are inherited. margin, padding, and border are NOT inherited."),
        ("Q11", "What does tr:nth-child(even) select?",
         ["A) The first row", "B) All odd rows",
          "C) Every even-numbered row (2nd, 4th, 6th...) (Correct)", "D) The last row"],
         "C -- :nth-child(even) selects every even child. Used for zebra-striping tables. even = 2n, odd = 2n+1."),
        ("Q12", "What is the purpose of the &lt;track&gt; element inside &lt;video&gt;?",
         ["A) Adds a progress bar", "B) Provides subtitles and captions (Correct)",
          "C) Sets video quality", "D) Links to a thumbnail image"],
         "B -- &lt;track&gt; links to a .vtt file providing timed text like subtitles, captions, or chapter markers."),
    ]
    for args in qs3:
        q_block(s, *args)

    summary_panel(s, [
        (TEAL,   "Images",       "src + alt required. alt='' for decorative. picture+source for responsive images."),
        (ORANGE, "Video/Audio",  "controls shows player. autoplay needs muted. source type helps browser. track for subtitles."),
        (BLUE,   "iframe",       "Embeds external pages. title required. sandbox for security. allowfullscreen for video."),
        (INDIGO, "CSS Selectors","Element(1) < Class(10) < ID(100). Space=descendant. > =child. :hover/:focus=state."),
        (PURPLE, "Cascade",      "Specificity wins. Equal specificity: last wins. !important overrides all. Avoid overuse."),
    ])
    closing_banner(s, "Module 3 complete! CSS selectors and specificity are the engine behind all styling. -- Ethnotech Academy")
    return s


# ─────────────────────────────────────────────────────────────────────────────
#  PDF BUILDER
# ─────────────────────────────────────────────────────────────────────────────
def build_pdf(story, output_path, header_text):
    cover_frame = Frame(0, 0, W, H,
                        leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
    cover_tmpl = PageTemplate(id="Cover", frames=[cover_frame], onPage=on_cover)

    normal_frame = Frame(2*cm, 1.35*cm, W - 4*cm, H - 3.1*cm,
                         leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
    normal_tmpl = PageTemplate(id="Normal", frames=[normal_frame],
                                onPage=make_header(header_text))

    doc = BaseDocTemplate(
        output_path, pagesize=A4,
        leftMargin=2*cm, rightMargin=2*cm,
        topMargin=2*cm, bottomMargin=1.35*cm,
    )
    doc.addPageTemplates([cover_tmpl, normal_tmpl])
    doc.build(story)
    print("Saved -> " + output_path)


# ─────────────────────────────────────────────────────────────────────────────
#  MAIN
# ─────────────────────────────────────────────────────────────────────────────
BASE = r"d:\Eth_Quiz_New\quiz"

modules = [
    (build_module1,
     BASE + r"\Module1_HTML_Fundamentals.pdf",
     "Module 1  |  HTML Fundamentals, Metadata & Document Structure"),
    (build_module2,
     BASE + r"\Module2_Semantic_HTML_Forms.pdf",
     "Module 2  |  Semantic HTML, Navigation & Forms"),
    (build_module3,
     BASE + r"\Module3_Multimedia_CSS_Fundamentals.pdf",
     "Module 3  |  Multimedia & CSS Fundamentals"),
]

for builder, path, header in modules:
    print("Building " + path + " ...")
    story = builder()
    build_pdf(story, path, header)

print("\nAll 3 PDFs generated successfully!")
