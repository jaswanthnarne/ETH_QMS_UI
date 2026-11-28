export const HTML_CSS_OOPS_TRACKS = [
    /* =========================================================================
       6. HTML (10 CHAPTERS)
       ========================================================================= */
    {
        slug: 'html',
        name: 'HTML',
        fullName: 'HTML5 Semantic Architecture, Web Accessibility & DOM Standards',
        badge: 'HTML5',
        tagline: 'The structural backbone of the web: semantic markup, accessible ARIA trees, forms, media, and SEO metadata.',
        description:
            'Master HTML5 from browser DOM tree construction, document metadata, and semantic landmark architecture to accessible forms, constraint validation, responsive images, tables, SVG/Canvas, and Web APIs.',
        accentColor: '#EA580C',
        secondaryColor: '#FFEDD5',
        fileExtension: '.html',
        paradigm: 'Declarative Markup, Semantic Document Tree (DOM & AOM)',
        creatorInfo: 'Created by Tim Berners-Lee • WHATWG HTML Living Standard',
        sortOrder: 6,
        chapters: [
            {
                chapterNumber: 1,
                title: 'HTML5 Document Anatomy, DOM Tree Parsing & Standards Mode',
                duration: '12 min read',
                difficulty: 'Beginner',
                summary: 'Understand the <!DOCTYPE html> preamble, UTF-8 encoding, responsive viewport meta tags, and how browsers parse HTML into the DOM.',
                overview: `HTML (HyperText Markup Language) defines the structural meaning and hierarchy of web content. When a browser receives an HTML response byte stream, its HTML Parser tokenizes tags into an in-memory Document Object Model (DOM) tree alongside an Accessibility Object Model (AOM) tree used by assistive technologies.

The <!DOCTYPE html> declaration at line 1 forces the browser into Standards Mode (preventing legacy 1990s Quirks Mode layout bugs). Every valid HTML5 document splits into <head> (machine-readable metadata, character encoding, responsive viewport scaling, stylesheets) and <body> (rendered user-facing content).`,
                keyPoints: [
                    'Always declare <!DOCTYPE html> on line 1 and <html lang="en"> for screen readers and search engines.',
                    '<meta charset="UTF-8"> must appear within the first 1024 bytes of <head> to prevent character encoding corruption.',
                    '<meta name="viewport" content="width=device-width, initial-scale=1.0"> enables mobile responsive CSS media queries.',
                    'Void elements (<img />, <input />, <meta />, <link />, <br />, <hr />) have no closing tag and cannot contain child nodes.'
                ],
                diagramTitle: 'Browser HTML Byte Stream to DOM & Render Tree Pipeline',
                diagramSteps: [
                    'Network UTF-8 Byte Stream',
                    'HTML5 Tokenizer (<tag> Tokens)',
                    'Tree Construction -> DOM + AOM Trees',
                    'Combine with CSSOM -> Render Tree',
                    'Layout (Reflow) -> Paint -> GPU Composite'
                ],
                graphTitle: 'Script Loading Strategy Impact on First Contentful Paint (FCP)',
                graphMetricLabel: 'HTML Parser Blocking Time (ms — Lower is faster)',
                graphData: [
                    { label: '<script defer src="app.js">', value: 8, displayValue: '0 ms Blocking', note: 'Downloads in parallel, runs after DOM parse' },
                    { label: '<script type="module" src="main.js">', value: 10, displayValue: '0 ms Blocking', note: 'Deferred by default with ESM imports' },
                    { label: '<script async src="analytics.js">', value: 35, displayValue: '25 ms Pause', note: 'Executes immediately upon download' },
                    { label: 'Blocking <script src="app.js"> in <head>', value: 100, displayValue: '340 ms Blocked!', note: 'Halts HTML parser completely' }
                ],
                syntaxSummaryCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ethnotech Code2Career Portal</title>
    <link rel="stylesheet" href="/styles.css" />
    <script defer src="/app.js"></script>
</head>
<body>
    <main id="app">
        <h1>Welcome to HTML5 Architecture</h1>
    </main>
</body>
</html>`,
                syntaxTable: [
                    { construct: 'Standards Doctype', syntax: '<!DOCTYPE html>', description: 'Activates HTML5 Standards Mode in all browsers.' },
                    { construct: 'Viewport Meta', syntax: '<meta name="viewport" content="width=device-width, initial-scale=1.0">', description: 'Matches layout viewport width to physical device screen width.' },
                    { construct: 'Deferred Script', syntax: '<script defer src="bundle.js"></script>', description: 'Fetches script in parallel and executes after DOM parsing completes.' },
                    { construct: 'Custom Data Attr', syntax: '<div data-batch-id="B22" data-score="94">', description: 'Stores custom attributes readable in JS via el.dataset.batchId.' }
                ],
                examples: [
                    {
                        title: 'Inspecting Custom data-* Attributes via DOM dataset API',
                        code: `<!-- HTML Markup -->
<article id="card-1" data-student-usn="4MT22CS001" data-exam-status="completed">
    <h2>Assessment Summary</h2>
</article>

<!-- JavaScript Reader -->
<script>
    const card = document.getElementById("card-1");
    console.log(card.dataset.studentUsn);  // "4MT22CS001"
    console.log(card.dataset.examStatus);  // "completed"
</script>`,
                        output: `4MT22CS001
completed`,
                        explanation: 'Kebab-case attributes like data-student-usn are automatically converted to camelCase properties on element.dataset.'
                    }
                ],
                problems: [
                    {
                        title: 'Fix a Render-Blocked Mobile-Unfriendly HTML Document Head',
                        difficulty: 'Easy',
                        statement: 'Given an HTML page that renders zoomed-out on mobile phones and blocks for 500ms on a <script src="heavy.js"></script> in <head>, write the corrected <head> block.',
                        sampleInput: 'Legacy HTML without doctype, viewport, or defer',
                        sampleOutput: '<!DOCTYPE html> + viewport meta + <script defer src="heavy.js">',
                        constraints: 'Valid HTML5',
                        hint: 'Add <!DOCTYPE html>, <meta charset="UTF-8">, <meta name="viewport" content="width=device-width, initial-scale=1.0">, and the defer attribute on the script tag.'
                    },
                    {
                        title: 'Validate Proper Tag Nesting in an HTML Snippet',
                        difficulty: 'Medium',
                        statement: 'Given a simplified HTML string containing opening <tag> and closing </tag> tags, verify whether all tags are properly nested and closed in LIFO order.',
                        sampleInput: '"<main><section><h1>Title</h1></section></main>"',
                        sampleOutput: 'true',
                        constraints: 'Ignore void tags like <br> and <img>',
                        hint: 'Use a stack: push non-void opening tag names and verify top of stack matches each closing </tag>.'
                    }
                ]
            },
            {
                chapterNumber: 2,
                title: 'Semantic Landmarks, Heading Hierarchy & Document Outlines',
                duration: '14 min read',
                difficulty: 'Beginner',
                summary: 'Replace div-soup with semantic HTML5 landmarks (<header>, <nav>, <main>, <article>, <section>, <aside>, <footer>).',
                overview: `Semantic HTML uses tags that describe the meaning and role of content rather than its visual appearance. Screen readers, search engine crawlers, and reader-mode parsers rely on HTML5 Landmark Elements (<header>, <nav>, <main>, <article>, <section>, <aside>, <footer>) to navigate a page quickly.

Wait: What is the difference between <article> and <section>?
- <article> wraps a self-contained, independently distributable composition (a blog post, a forum comment, a news card, or a product widget) that would still make sense if syndicated on its own in an RSS feed.
- <section> groups thematically related content within a document and should almost always begin with a heading (<h2>–<h6>).`,
                keyPoints: [
                    'Every page should have exactly one visible <main> landmark and a single top-level <h1> heading.',
                    'Never skip heading levels (e.g., jumping from <h1> directly to <h4>) purely for font size—use CSS for visual sizing!',
                    'Use <button type="button"> for interactive in-page actions and <a href="..."> for navigation to a URL.',
                    'Use <time datetime="2026-11-28"> for machine-readable dates and timestamps.'
                ],
                diagramTitle: 'HTML5 Semantic Landmark & Accessibility Tree Hierarchy',
                diagramSteps: [
                    '<header> Banner + Primary <nav>',
                    '<main> Unique Page Primary Content',
                    '<article> Self-Contained Syndicatable Card',
                    '<section> Thematic Chapter with <h2>',
                    '<aside> Complementary Sidebar + <footer>'
                ],
                graphTitle: 'Accessibility & SEO Crawlability Score: Semantic HTML5 vs Div-Soup',
                graphMetricLabel: 'Audit Score out of 100 (Lighthouse / WCAG)',
                graphData: [
                    { label: 'Semantic Landmarks + Ordered h1–h3 + Native <button>', value: 98, displayValue: '98 / 100', note: 'Full keyboard & screen-reader navigation' },
                    { label: 'Divs with Manual ARIA role="..." Polyfills', value: 68, displayValue: '68 / 100', note: 'Extra maintenance & missing keyboard defaults' },
                    { label: 'Non-Semantic <div onclick="..."> Soup', value: 22, displayValue: '22 / 100', note: 'Unfocusable via Tab key, invisible to AOM' }
                ],
                syntaxSummaryCode: `<header>
    <nav aria-label="Primary Navigation">
        <a href="/dashboard">Dashboard</a>
        <a href="/blogs" aria-current="page">Blogs</a>
    </nav>
</header>

<main>
    <h1>Engineering &amp; Placement Articles</h1>
    <article>
        <header>
            <h2>Mastering Pointers in C</h2>
            <p>Published on <time datetime="2026-11-28">Nov 28, 2026</time></p>
        </header>
        <p>A pointer stores a virtual memory address...</p>
    </article>
</main>

<aside aria-label="Related Topics">
    <h2>Top Tags</h2>
</aside>
<footer>&copy; 2026 Ethnotech Academy</footer>`,
                syntaxTable: [
                    { construct: 'Main Landmark', syntax: '<main>...</main>', description: 'Identifies the dominant unique content of the document (1 per page).' },
                    { construct: 'Self-Contained Unit', syntax: '<article>...</article>', description: 'Independent item like a blog post, comment, or news card.' },
                    { construct: 'Thematic Group', syntax: '<section aria-labelledby="h-id">...</section>', description: 'Groups related content under a section heading.' },
                    { construct: 'Disclosure Widget', syntax: '<details><summary>FAQ</summary><p>Answer</p></details>', description: 'Native zero-JS collapsible accordion element.' }
                ],
                examples: [
                    {
                        title: 'Zero-JavaScript Interactive Accordion with <details> & <summary>',
                        code: `<section aria-labelledby="faq-heading">
    <h2 id="faq-heading">Frequently Asked Questions</h2>
    <details open>
        <summary>How is attendance percentage calculated?</summary>
        <p>Attendance is computed as (Attended Sessions / Total Conducted Sessions) &times; 100.</p>
    </details>
    <details>
        <summary>Can I resume a disconnected exam?</summary>
        <p>Yes, log back in within the reconnection window to resume from your saved question.</p>
    </details>
</section>`,
                        output: `[Interactive Native Accordion] -> Keyboard accessible (Enter/Space) with zero JS`,
                        explanation: 'The native <details> and <summary> elements provide built-in expand/collapse state and keyboard accessibility without JavaScript.'
                    }
                ],
                problems: [
                    {
                        title: 'Refactor Non-Semantic Div Card into Accessible Semantic HTML5',
                        difficulty: 'Easy',
                        statement: 'Convert a blog post card built purely with <div class="post">, <div class="title">, <div class="date">, and <div class="btn" onclick="..."> into proper semantic HTML5.',
                        sampleInput: '<div class="post"><div class="title">DSA Guide</div><div class="btn">Read</div></div>',
                        sampleOutput: '<article><h2>DSA Guide</h2><time datetime="...">...</time><a href="...">Read</a></article>',
                        constraints: 'Must be keyboard focusable',
                        hint: 'Replace outer div with <article>, title with <h2>, date with <time datetime="...">, and navigation button with <a href="..."> or <button type="button">.'
                    },
                    {
                        title: 'Audit Heading Hierarchy Violations in a Document Tree',
                        difficulty: 'Easy',
                        statement: 'Given an ordered list of heading levels in a page (e.g., [1, 2, 4, 2, 3]), detect if there are multiple h1 tags or if any heading jumps downward by more than 1 level (like h2 -> h4).',
                        sampleInput: 'levels = [1, 2, 4, 2, 3]',
                        sampleOutput: 'Violation at index 2: skipped from h2 to h4',
                        constraints: '1 <= levels[i] <= 6',
                        hint: 'Check count(1) === 1 and verify levels[i] - levels[i - 1] <= 1 for all i > 0.'
                    }
                ]
            },
            {
                chapterNumber: 3,
                title: 'Text Typography, Inline Semantics, Code Blocks & Entities',
                duration: '12 min read',
                difficulty: 'Beginner',
                summary: 'Distinguish semantic emphasis (<strong>, <em>) from stylistic tags, format technical code (<pre>, <code>, <kbd>), and use HTML entities.',
                overview: `HTML distinguishes between semantic importance and purely visual styling:
- <strong> denotes serious importance or urgency (screen readers can adjust vocal tone), whereas <b> draws visual attention without extra semantic importance.
- <em> denotes stress emphasis that changes sentence meaning, whereas <i> marks technical terms, foreign phrases, or taxonomic names.

For technical documentation and coding platforms, HTML provides <code> (inline code), <pre> (preformatted whitespace-preserving block), <kbd> (keyboard shortcut like Ctrl + S), <samp> (program sample output), and <var> (mathematical variable).`,
                keyPoints: [
                    'Always escape literal <, >, and & inside <code> blocks as &lt;, &gt;, and &amp; so the browser does not parse them as live HTML tags!',
                    'Wrap multi-line code snippets in <pre><code>...</code></pre> to preserve indentation and denote code semantics.',
                    'Use<blockquote> with a <cite> attribution for extended quotations, and <q> for inline quotes.',
                    'Use <mark> to highlight search query matches inside results.'
                ],
                diagramTitle: 'Inline Semantic Text & Technical Code Markup Hierarchy',
                diagramSteps: [
                    '<strong> Importance vs <em> Stress Emphasis',
                    '<pre><code> Multi-Line Escaped Source Block',
                    '<kbd>Ctrl</kbd> + <kbd>Enter</kbd> Shortcut',
                    '<blockquote cite="..."> + <figcaption><cite>'
                ],
                graphTitle: 'Screen Reader & Search Engine Semantic Signal Strength',
                graphMetricLabel: 'Semantic Meaning Clarity Score',
                graphData: [
                    { label: '<strong>, <em>, <pre><code>, <mark>, <abbr>', value: 96, displayValue: 'High Semantic Signal', note: 'Conveys intent to AOM & crawlers' },
                    { label: 'Presentational <b>, <i>, <u>, <span>', value: 35, displayValue: 'Visual Only', note: 'No structural or vocal emphasis' }
                ],
                syntaxSummaryCode: `<p>
    Press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to submit your solution in
    <strong>Code2Career</strong>. Time complexity must be at most
    <var>O</var>(<var>N</var> log <var>N</var>).
</p>

<pre><code>#include &lt;stdio.h&gt;
int main(void) {
    printf("5 &lt; 10 &amp;&amp; 10 &gt; 2\\n");
    return 0;
}</code></pre>

<figure>
    <blockquote cite="https://ethnotech.in">
        <p>Master 15 core algorithmic patterns deeply rather than memorizing 500 solutions.</p>
    </blockquote>
    <figcaption>&mdash; <cite>Placement Prep Handbook</cite></figcaption>
</figure>`,
                syntaxTable: [
                    { construct: 'Code Block', syntax: '<pre><code>...</code></pre>', description: 'Preserves whitespace/newlines and marks content as source code.' },
                    { construct: 'Keyboard Input', syntax: '<kbd>Ctrl</kbd> + <kbd>C</kbd>', description: 'Represents user keyboard or shortcut input.' },
                    { construct: 'Abbreviation', syntax: '<abbr title="Abstract Syntax Tree">AST</abbr>', description: 'Provides full expansion for acronyms on hover and screen readers.' },
                    { construct: 'HTML Entities', syntax: '&lt; &gt; &amp; &quot; &copy; &nbsp;', description: 'Escapes reserved characters: <, >, &, ", ©, non-breaking space.' }
                ],
                examples: [
                    {
                        title: 'Rendering Escaped C++ Template Code & Search Highlights in HTML',
                        code: `<article>
    <p>Search match for <mark>priority_queue</mark> in C++ STL:</p>
    <pre><code>std::priority_queue&lt;int, std::vector&lt;int&gt;, std::greater&lt;int&gt;&gt; min_pq;</code></pre>
    <p>Sample console output: <samp>Min element popped: 10</samp></p>
</article>`,
                        output: `Search match for [priority_queue] in C++ STL:
std::priority_queue<int, std::vector<int>, std::greater<int>> min_pq;
Sample console output: Min element popped: 10`,
                        explanation: 'Escaping < and > as &lt; and &gt; prevents the browser from misinterpreting <int> as an unknown HTML tag.'
                    }
                ],
                problems: [
                    {
                        title: 'Build a Search Term Highlighter Using <mark>',
                        difficulty: 'Easy',
                        statement: 'Given a plain text sentence and a search query keyword, return an HTML string where every case-insensitive match of query is wrapped in <mark>...</mark>.',
                        sampleInput: 'text = "Python and Java are popular", query = "java"',
                        sampleOutput: '"Python and <mark>Java</mark> are popular"',
                        constraints: 'Escape special regex chars in query',
                        hint: 'Replace matches using new RegExp(`(${escapedQuery})`, "gi") with "<mark>$1</mark>".'
                    },
                    {
                        title: 'Convert Markdown Inline Code & Bold to Semantic HTML',
                        difficulty: 'Easy',
                        statement: 'Convert a string containing **bold** text and `inline code` into <strong>bold</strong> and <code>inline code</code>.',
                        sampleInput: '"Use `deque.popleft()` for **O(1)** BFS"',
                        sampleOutput: '"Use <code>deque.popleft()</code> for <strong>O(1)</strong> BFS"',
                        constraints: 'Non-nested spans',
                        hint: 'Apply regex .replace(/\\*\\*(.+?)\\*\\*/g, "<strong>$1</strong>") and .replace(/`(.+?)`/g, "<code>$1</code>").'
                    }
                ]
            },
            {
                chapterNumber: 4,
                title: 'Hyperlinks, Security Rel Attributes, Lists & Navigation',
                duration: '13 min read',
                difficulty: 'Beginner',
                summary: 'Master anchor routing, target="_blank" security (rel="noopener noreferrer"), download links, and ordered/unordered/description lists.',
                overview: `The anchor element (<a href="...">) is the foundation of the World Wide Web. Links can target external URLs, same-page fragment IDs (href="#chapter-4"), email/phone schemes (mailto:, tel:), or trigger file downloads (<a href="/report.xlsx" download="Attendance.xlsx">).

Security Note: When opening an external link in a new tab with target="_blank", always include rel="noopener noreferrer" so the newly opened page cannot access your tab via window.opener or leak referrer tokens.

HTML provides three list structures: Unordered lists (<ul>), Ordered lists (<ol start="1" reversed>), and Description lists (<dl> with <dt> term and <dd> definition pairs).`,
                keyPoints: [
                    'Always pair target="_blank" with rel="noopener noreferrer" to prevent Reverse Tabnabbing attacks.',
                    'Mark the currently active navigation link with aria-current="page" for screen reader users.',
                    'Direct children of <ul> and <ol> MUST be <li> elements (nested lists go inside an <li>, not directly inside <ul>).',
                    'Use <dl> (<dt>Key</dt><dd>Value</dd>) for metadata key-value pairs and glossaries.'
                ],
                diagramTitle: 'Anchor Navigation & Accessible Breadcrumb List Structure',
                diagramSteps: [
                    '<nav aria-label="Breadcrumb">',
                    '<ol> Ordered Trail of <li> Steps',
                    '<a href="#section"> In-Page Smooth Scroll',
                    'target="_blank" + rel="noopener noreferrer"',
                    'aria-current="page" Active Indicator'
                ],
                graphTitle: 'Link Security & UX Best Practices Compliance',
                graphMetricLabel: 'Security & Accessibility Rating',
                graphData: [
                    { label: '<a href="https://..." target="_blank" rel="noopener noreferrer">', value: 100, displayValue: '100% Secure', note: 'Isolates window.opener process' },
                    { label: '<a href="#main-content" class="skip-link">', value: 96, displayValue: 'WCAG AAA Keyboard Skip', note: 'Bypasses repetitive header nav' },
                    { label: '<a href="javascript:void(0)" onclick="...">', value: 15, displayValue: 'Anti-Pattern!', note: 'Use <button type="button"> instead' }
                ],
                syntaxSummaryCode: `<!-- 1. Accessible Breadcrumb Navigation -->
<nav aria-label="Breadcrumb">
    <ol>
        <li><a href="/student/dashboard">Dashboard</a></li>
        <li><a href="/student/dashboard?tab=language-description">Languages</a></li>
        <li><a href="#html" aria-current="page">HTML5</a></li>
    </ol>
</nav>

<!-- 2. Secure External & Download Links -->
<a href="https://developer.mozilla.org" target="_blank" rel="noopener noreferrer">
    MDN Web Docs
</a>
<a href="/files/syllabus.pdf" download="Ethnotech-Syllabus-2026.pdf">
    Download Syllabus PDF
</a>

<!-- 3. Description List for Key-Value Metadata -->
<dl>
    <dt>Time Complexity</dt>
    <dd>O(N log N)</dd>
    <dt>Auxiliary Space</dt>
    <dd>O(1) In-Place</dd>
</dl>`,
                syntaxTable: [
                    { construct: 'External Tab Link', syntax: '<a href="url" target="_blank" rel="noopener noreferrer">', description: 'Opens URL in new tab safely without window.opener access.' },
                    { construct: 'In-Page Fragment', syntax: '<a href="#syntax-table">Jump to Syntax</a>', description: 'Scrolls directly to element with id="syntax-table".' },
                    { construct: 'Download Trigger', syntax: '<a href="/file.csv" download="Report.csv">', description: 'Prompts browser to save resource with specified filename.' },
                    { construct: 'Description List', syntax: '<dl><dt>Term</dt><dd>Definition</dd></dl>', description: 'Semantic key-value or glossary list.' }
                ],
                examples: [
                    {
                        title: 'Skip-to-Main-Content Link & Nested Curriculum Outline',
                        code: `<a href="#main-reader" class="sr-only focus:not-sr-only">Skip to main content</a>

<main id="main-reader" tabindex="-1">
    <h2>Module Tracks</h2>
    <ol start="1">
        <li>
            Core Systems
            <ul>
                <li>C Programming (10 Chapters)</li>
                <li>Modern C++ &amp; STL (10 Chapters)</li>
            </ul>
        </li>
        <li>Web Engineering (HTML, CSS, JS)</li>
    </ol>
</main>`,
                        output: `1. Core Systems
   • C Programming (10 Chapters)
   • Modern C++ & STL (10 Chapters)
2. Web Engineering (HTML, CSS, JS)`,
                        explanation: 'Nested lists must be placed inside the parent <li> element rather than as direct siblings of <li>.'
                    }
                ],
                problems: [
                    {
                        title: 'Security Audit: Inject rel="noopener noreferrer" on External Links',
                        difficulty: 'Easy',
                        statement: 'Given a DOM container, find all <a> elements that have target="_blank" and ensure their rel attribute includes both "noopener" and "noreferrer".',
                        sampleInput: '<a href="https://example.com" target="_blank">Link</a>',
                        sampleOutput: '<a href="https://example.com" target="_blank" rel="noopener noreferrer">Link</a>',
                        constraints: 'Use querySelectorAll(\'a[target="_blank"]\')',
                        hint: 'Iterate over container.querySelectorAll(\'a[target="_blank"]\') and set link.rel = "noopener noreferrer".'
                    },
                    {
                        title: 'Generate Nested Table of Contents List from Headings',
                        difficulty: 'Medium',
                        statement: 'Given an array of heading objects [{ id: "intro", text: "Intro" }, { id: "syntax", text: "Syntax" }], generate an ordered list <ol> of anchor links pointing to #id.',
                        sampleInput: '[{ id: "ch1", text: "Architecture" }, { id: "ch2", text: "Operators" }]',
                        sampleOutput: '<ol><li><a href="#ch1">Architecture</a></li><li><a href="#ch2">Operators</a></li></ol>',
                        constraints: 'Valid HTML5 list markup',
                        hint: 'Map each item to `<li><a href="#${item.id}">${item.text}</a></li>` and wrap in `<ol>...</ol>`.'
                    }
                ]
            },
            {
                chapterNumber: 5,
                title: 'Forms, Input Controls, Labels & Native Constraint Validation',
                duration: '16 min read',
                difficulty: 'Intermediate',
                summary: 'Build accessible, self-validating HTML5 forms using explicit <label for="..."> bindings, <fieldset>, input types, and the Constraint Validation API.',
                overview: `HTML5 forms are the primary data-entry mechanism on the web. Every form control (<input>, <select>, <textarea>) MUST be paired with an explicit <label for="input-id"> so screen readers announce the field purpose and clicking the label focuses the input. Related radio buttons or checkboxes should be grouped inside a <fieldset> with a <legend>.

HTML5 provides built-in client-side Constraint Validation attributes—required, minlength, maxlength, min, max, step, type="email", type="url", and pattern="regex"—which validate inputs natively before form submission and expose the CSS pseudo-classes :valid, :invalid, and :user-invalid.`,
                keyPoints: [
                    'Every <input id="x"> needs a matching <label for="x"> AND a name="x" attribute so FormData(form) serializes it.',
                    'Buttons inside a <form> default to type="submit"! Always write <button type="button"> for non-submitting helper buttons.',
                    'Use inputmode="numeric" and autocomplete="one-time-code" for smooth mobile OTP and number entry.',
                    'form.checkValidity() and input.setCustomValidity("msg") integrate custom JS rules with native browser validation popups.'
                ],
                diagramTitle: 'HTML5 Form Submission & Constraint Validation Lifecycle',
                diagramSteps: [
                    '<label for="usn"> Bound to <input id="usn" name="usn">',
                    'User Input -> Native Constraint Check (required, pattern)',
                    'form.checkValidity() == true -> Fires submit Event',
                    'new FormData(formElement) -> Key/Value Payload'
                ],
                graphTitle: 'Form Usability & Mobile Completion Rate by Markup Quality',
                graphMetricLabel: 'Successful Completion Rate (%)',
                graphData: [
                    { label: 'Semantic <label for> + autocomplete + inputmode + Native Validation', value: 96, displayValue: '96%', note: 'Autofill + right mobile keyboard + larger tap targets' },
                    { label: 'Inputs with placeholder Only (No <label>)', value: 44, displayValue: '44%', note: 'Context vanishes while typing, fails WCAG' }
                ],
                syntaxSummaryCode: `<form id="reg-form" action="/api/register" method="POST">
    <fieldset>
        <legend>Student Credentials</legend>

        <div>
            <label for="usn-input">University Seat Number (USN)</label>
            <input
                id="usn-input"
                name="usn"
                type="text"
                required
                pattern="[1-4][A-Za-z]{2}[0-9]{2}[A-Za-z]{2}[0-9]{3}"
                placeholder="e.g. 4MT22CS001"
                autocomplete="username"
            />
        </div>

        <div>
            <label for="cgpa-input">Current CGPA</label>
            <input id="cgpa-input" name="cgpa" type="number" min="0" max="10" step="0.01" required />
        </div>
    </fieldset>

    <button type="button" id="reset-btn">Clear</button>
    <button type="submit">Save Profile</button>
</form>`,
                syntaxTable: [
                    { construct: 'Explicit Label', syntax: '<label for="email">Email</label><input id="email" name="email">', description: 'Associates label text with input for accessibility and click focus.' },
                    { construct: 'Regex Pattern', syntax: '<input pattern="[A-Za-z0-9]{6,12}" title="6-12 alphanumeric chars">', description: 'Validates input value against regular expression on submit.' },
                    { construct: 'Datalist Autocomplete', syntax: '<input list="colleges"><datalist id="colleges"><option value="DSU"></datalist>', description: 'Provides native searchable dropdown suggestions on an input.' },
                    { construct: 'FormData Extract', syntax: 'const data = Object.fromEntries(new FormData(formEl));', description: 'Extracts all named form fields into a plain JS object in 1 line.' }
                ],
                examples: [
                    {
                        title: 'Extracting Form Payload via FormData & Custom Validity Check',
                        code: `// HTML: <form id="exam-launch"><input name="examKey" required minlength="6" /></form>
function handleLaunchSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    const payload = Object.fromEntries(new FormData(form));
    console.log("Validated Payload:", JSON.stringify(payload));
}

// Simulated invocation
console.log('Validated Payload: {"examKey":"ETH-2026"}');`,
                        output: `Validated Payload: {"examKey":"ETH-2026"}`,
                        explanation: 'Object.fromEntries(new FormData(form)) gathers every input with a name attribute without needing manual querySelector calls per field.'
                    }
                ],
                problems: [
                    {
                        title: 'Build an Accessible Password Confirmation Validator',
                        difficulty: 'Easy',
                        statement: 'Given two password inputs #pw and #confirmPw inside a form, use input.setCustomValidity() so the browser blocks submission with "Passwords do not match" whenever their values differ.',
                        sampleInput: 'pw = "Secret@123", confirmPw = "Secret@999"',
                        sampleOutput: 'confirmPw.validationMessage === "Passwords do not match"',
                        constraints: 'Clear custom validity with setCustomValidity("") when they match',
                        hint: 'On input event, call confirmPw.setCustomValidity(pw.value !== confirmPw.value ? "Passwords do not match" : "").'
                    },
                    {
                        title: 'Design a Multi-Option Filter Bar with <select>, <optgroup> & <datalist>',
                        difficulty: 'Easy',
                        statement: 'Write HTML5 markup for a course selector that groups options into "Core Programming" (C, C++, Java, Python) and "Web Stack" (HTML, CSS, JS) using <optgroup>.',
                        sampleInput: '2 category groups',
                        sampleOutput: '<select name="track"><optgroup label="Core Programming">...</optgroup>...</select>',
                        constraints: 'Include accessible <label for="track-select">',
                        hint: 'Wrap <option> elements inside <optgroup label="Group Name"> inside a <select id="track-select" name="track">.'
                    }
                ]
            },
            {
                chapterNumber: 6,
                title: 'Accessible Data Tables, Colgroups & Structured Grids',
                duration: '13 min read',
                difficulty: 'Beginner',
                summary: 'Structure financial, leaderboard, and attendance data tables with <caption>, <thead>, <tbody>, <tfoot>, and <th scope="...">. ',
                overview: `HTML tables (<table>) are designed specifically for tabular data with two-dimensional relationships (such as leaderboards, attendance logs, and syntax reference matrices)—never for page layout.

To make a table accessible to screen readers, include a <caption> title, separate header rows into <thead>, data rows into <tbody>, summary totals into <tfoot>, and specify scope="col" on column headers (<th>) and scope="row" on row headers so assistive technologies announce both the column and row context for every data cell (<td>).`,
                keyPoints: [
                    'Always add scope="col" to column header <th> tags and scope="row" to row identifier <th> tags.',
                    'Use colspan="N" to merge cells horizontally across N columns and rowspan="M" to merge vertically across M rows.',
                    'Wrap wide tables in a <div class="overflow-x-auto" tabindex="0"> container so mobile viewports scroll horizontally without breaking page width.',
                    '<tfoot> is placed after <tbody> and holds summary totals or averages.'
                ],
                diagramTitle: 'Accessible HTML5 Table Anatomy & Scope Binding',
                diagramSteps: [
                    '<table> + <caption> Title Summary',
                    '<thead> -> <tr> -> <th scope="col">',
                    '<tbody> -> <tr> -> <th scope="row"> + <td>',
                    '<tfoot> -> Summary Totals Row (colspan)'
                ],
                graphTitle: 'Screen Reader Cell Context Accuracy by Table Markup',
                graphMetricLabel: 'Assistive Navigation Accuracy (%)',
                graphData: [
                    { label: '<caption> + <thead>/<tbody> + <th scope="col/row">', value: 100, displayValue: '100% Accessible', note: 'Announces row + column header per cell' },
                    { label: 'Plain <tr><td> Rows Without <th> or scope', value: 28, displayValue: '28% Ambiguous', note: 'Screen reader cannot identify column names' }
                ],
                syntaxSummaryCode: `<div class="table-responsive">
    <table>
        <caption>Batch B22 Top Assessment Performers</caption>
        <thead>
            <tr>
                <th scope="col">Rank</th>
                <th scope="col">USN</th>
                <th scope="col">Candidate</th>
                <th scope="col">Score (%)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <th scope="row">#1</th>
                <td>4MT22CS001</td>
                <td>Aarav Sharma</td>
                <td>96.5%</td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <th scope="row" colspan="3">Batch Average</th>
                <td>84.2%</td>
            </tr>
        </tfoot>
    </table>
</div>`,
                syntaxTable: [
                    { construct: 'Table Caption', syntax: '<caption>Leaderboard Results</caption>', description: 'Must be the first child of <table>; provides accessible table title.' },
                    { construct: 'Column / Row Scope', syntax: '<th scope="col"> / <th scope="row">', description: 'Binds header cells to their corresponding column or row data.' },
                    { construct: 'Horizontal Span', syntax: '<td colspan="3">', description: 'Spans a single cell across 3 adjacent columns.' },
                    { construct: 'Vertical Span', syntax: '<td rowspan="2">', description: 'Spans a single cell downward across 2 rows.' }
                ],
                examples: [
                    {
                        title: 'Complex Schedule Table with colspan and rowspan',
                        code: `<table border="1">
    <caption>Weekly Lab Schedule</caption>
    <thead>
        <tr>
            <th scope="col">Day</th>
            <th scope="col">09:00 - 11:00</th>
            <th scope="col">11:00 - 13:00</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th scope="row">Monday</th>
            <td colspan="2">Full-Length Mock Coding Drive (4 Hours)</td>
        </tr>
        <tr>
            <th scope="row">Tuesday</th>
            <td>C Pointers Lab</td>
            <td>DSA Problem Solving</td>
        </tr>
    </tbody>
</table>`,
                        output: `Monday  | [Full-Length Mock Coding Drive (Spans 2 Columns)]
Tuesday | [C Pointers Lab] | [DSA Problem Solving]`,
                        explanation: 'When Monday row uses colspan="2", that row contains only 2 cells (1 <th> + 1 spanning <td>) to match the 3-column grid.'
                    }
                ],
                problems: [
                    {
                        title: 'Validate Row Column Count Consistency with colspan',
                        difficulty: 'Medium',
                        statement: 'Given a 2D array representing rows of cells where each cell has { text, colspan: number }, verify that every row in the table sums to the exact same total column count.',
                        sampleInput: 'Row 0: [{colspan:1}, {colspan:1}, {colspan:1}], Row 1: [{colspan:1}, {colspan:2}]',
                        sampleOutput: 'true (All rows span 3 columns)',
                        constraints: 'colspan >= 1',
                        hint: 'Compute the sum of cell.colspan || 1 for row 0, and verify every subsequent row matches that sum.'
                    },
                    {
                        title: 'Export HTML Table DOM to CSV String',
                        difficulty: 'Easy',
                        statement: 'Write a JavaScript function tableToCsv(tableElement) that extracts all rows from <thead> and <tbody> and formats them as a comma-separated CSV string.',
                        sampleInput: '<table> with 2 columns (USN, Score) and 2 rows',
                        sampleOutput: '"USN,Score\\n4MT22CS001,95"',
                        constraints: 'Quote cell values containing commas',
                        hint: 'Map Array.from(table.querySelectorAll("tr")) -> Array.from(tr.cells).map(c => c.textContent.trim()).join(",").'
                    }
                ]
            },
            {
                chapterNumber: 7,
                title: 'Responsive Images, <picture>, Multimedia & Core Web Vitals (LCP/CLS)',
                duration: '15 min read',
                difficulty: 'Intermediate',
                summary: 'Optimize images and media with srcset, sizes, <picture>, lazy loading, and width/height attributes to eliminate Cumulative Layout Shift (CLS).',
                overview: `Images and video account for over 65% of page weight on modern websites. HTML5 provides responsive image primitives so mobile devices download compact assets while 4K desktops receive high-DPI assets:
- srcset & sizes on <img> let the browser choose the optimal image resolution based on screen width and devicePixelRatio.
- <picture> with <source type="image/avif"> or <source media="(min-width: 768px)"> enables modern format fallbacks (AVIF -> WebP -> JPEG) and art direction.

To achieve top Google Core Web Vitals scores:
1. Always set explicit width and height attributes on every <img> so the browser reserves the exact aspect-ratio box before the image loads (0.00 Cumulative Layout Shift - CLS).
2. Add loading="lazy" to below-the-fold images, and fetchpriority="high" (without lazy) to the above-the-fold hero LCP image!`,
                keyPoints: [
                    'Every <img> MUST have an alt attribute: descriptive text for informative images, or alt="" (empty string) for purely decorative graphics.',
                    'Always specify width="W" height="H" on <img> to prevent page jump (Cumulative Layout Shift / CLS).',
                    'Never put loading="lazy" on the main top Hero image—use fetchpriority="high" on the hero and loading="lazy" on offscreen images.',
                    'Wrap standalone diagrams or photos with captions in <figure> and <figcaption>.'
                ],
                diagramTitle: 'HTML5 Responsive <picture> Format Negotiation & CLS Prevention',
                diagramSteps: [
                    'Browser Evaluates <picture> <source> Rules',
                    'Supports AVIF? -> Downloads .avif (50% Smaller)',
                    'Fallback -> WebP -> Standard <img> .jpg',
                    'width & height Attributes Reserve Aspect-Ratio Box',
                    'Zero Layout Shift (CLS = 0.00)'
                ],
                graphTitle: 'Image Payload Size by Format (1200x800 Hero Campus Photo)',
                graphMetricLabel: 'File Size in Kilobytes (Lower loads faster)',
                graphData: [
                    { label: 'AVIF (<source type="image/avif">)', value: 18, displayValue: '42 KB', note: 'Best compression ratio' },
                    { label: 'WebP (<source type="image/webp">)', value: 30, displayValue: '68 KB', note: 'Universal browser support' },
                    { label: 'Optimized Progressive JPEG', value: 65, displayValue: '150 KB', note: 'Legacy fallback in <img src>' },
                    { label: 'Uncompressed PNG Photo', value: 100, displayValue: '840 KB', note: 'Slow LCP on mobile networks' }
                ],
                syntaxSummaryCode: `<!-- 1. Above-the-fold Hero Image (High Priority, Zero CLS) -->
<img
    src="/assets/hero-1200.jpg"
    srcset="/assets/hero-600.jpg 600w, /assets/hero-1200.jpg 1200w"
    sizes="(max-width: 768px) 100vw, 1200px"
    width="1200"
    height="675"
    fetchpriority="high"
    alt="Students collaborating in the coding lab"
/>

<!-- 2. Modern Format Fallback with <picture> & Lazy Loading -->
<figure>
    <picture>
        <source srcset="/diagrams/memory.avif" type="image/avif" />
        <source srcset="/diagrams/memory.webp" type="image/webp" />
        <img
            src="/diagrams/memory.png"
            width="800"
            height="450"
            loading="lazy"
            decoding="async"
            alt="Stack and Heap memory layout diagram"
        />
    </picture>
    <figcaption>Figure 1: Process Virtual Address Space Layout</figcaption>
</figure>`,
                syntaxTable: [
                    { construct: 'Aspect-Ratio Box', syntax: '<img src="..." width="800" height="450" alt="...">', description: 'Prevents layout shift (CLS) by reserving aspect ratio before load.' },
                    { construct: 'Native Lazy Load', syntax: 'loading="lazy" decoding="async"', description: 'Defers downloading below-the-fold images until user scrolls near.' },
                    { construct: 'Hero LCP Priority', syntax: 'fetchpriority="high"', description: 'Boosts download priority of primary above-the-fold hero image.' },
                    { construct: 'Accessible Video', syntax: '<video controls preload="metadata"><track kind="captions" ...></video>', description: 'Embeds native video player with WebVTT closed captions.' }
                ],
                examples: [
                    {
                        title: 'Accessible HTML5 Video Player with Closed Captions & Poster',
                        code: `<video
    width="640"
    height="360"
    controls
    preload="metadata"
    poster="/assets/lecture-poster.jpg"
>
    <source src="/media/pointers-lecture.mp4" type="video/mp4" />
    <track
        kind="captions"
        src="/media/pointers-en.vtt"
        srclang="en"
        label="English"
        default
    />
    Your browser does not support HTML5 video.
</video>`,
                        output: `[640x360 Video Player] -> Metadata preloaded (fast init) + English WebVTT subtitles enabled`,
                        explanation: 'Setting preload="metadata" downloads only the duration and dimensions on page load, saving bandwidth until play is clicked.'
                    }
                ],
                problems: [
                    {
                        title: 'Audit Images for Missing Alt Text and CLS Dimensions',
                        difficulty: 'Easy',
                        statement: 'Given an array of image tag attribute objects [{ src, alt, width, height }], return a list of validation errors for any image missing alt (undefined/null) or missing numeric width/height.',
                        sampleInput: '[{ src: "a.png", alt: "", width: 100, height: 100 }, { src: "b.png" }]',
                        sampleOutput: '["b.png: missing alt attribute", "b.png: missing width/height (CLS risk)"]',
                        constraints: 'Note: alt="" (empty string) IS valid for decorative images!',
                        hint: 'Check typeof img.alt === "string" (so "" passes) and Boolean(img.width && img.height).'
                    },
                    {
                        title: 'Generate Responsive srcset Attribute String',
                        difficulty: 'Easy',
                        statement: 'Given a base image path "/img/banner" and an array of widths [400, 800, 1200], generate a valid srcset string "/img/banner-400.webp 400w, /img/banner-800.webp 800w, ...".',
                        sampleInput: 'base = "/img/hero", widths = [400, 800, 1200]',
                        sampleOutput: '"/img/hero-400.webp 400w, /img/hero-800.webp 800w, /img/hero-1200.webp 1200w"',
                        constraints: '1 <= widths.length <= 10',
                        hint: 'Use widths.map(w => `${base}-${w}.webp ${w}w`).join(", ").'
                    }
                ]
            },
            {
                chapterNumber: 8,
                title: 'Inline SVG Vector Graphics & HTML5 <canvas> 2D Rendering',
                duration: '14 min read',
                difficulty: 'Intermediate',
                summary: 'Compare resolution-independent DOM-accessible SVG vector graphics against pixel-buffered HTML5 <canvas> graphics.',
                overview: `HTML5 supports two complementary 2D graphics technologies:
1. Inline <svg> (Scalable Vector Graphics): XML-based vector elements (<rect>, <circle>, <path>, <line>, <text>, <g>) that live directly in the DOM tree. Because SVG nodes are real DOM elements, they scale crisply to any DPI, can be styled with CSS (stroke, fill, hover transitions), and are accessible to screen readers via role="img" and <title>.
2. <canvas>: An immediate-mode bitmap pixel surface driven by JavaScript (ctx = canvas.getContext("2d")). Once pixels are drawn, the canvas forgets the shapes, making <canvas> fast for particle simulations, real-time games, and 10,000+ point charts.`,
                keyPoints: [
                    'Use <svg viewBox="0 0 W H"> for UI icons, architecture diagrams, logos, and interactive charts (< 1,000 nodes).',
                    'Use <canvas> for high-frequency pixel rendering, image cropping/compression, and particle effects (> 5,000 objects).',
                    'Scale <canvas> by window.devicePixelRatio so text and lines look razor-sharp on Retina/HiDPI displays.',
                    'Add role="img" and an aria-label (or <title>) to informative <svg> diagrams; add aria-hidden="true" to decorative icons.'
                ],
                diagramTitle: 'Retained-Mode DOM <svg> vs Immediate-Mode Bitmap <canvas>',
                diagramSteps: [
                    '<svg viewBox="0 0 400 200"> -> Vector DOM Nodes',
                    'CSS Styled & Event Listeners per <path>/<rect>',
                    '<canvas width="800" height="400"> -> Pixel Buffer',
                    'ctx = canvas.getContext("2d") GPU Raster Calls'
                ],
                graphTitle: '60 FPS Frame Budget by Element Count: <svg> vs <canvas>',
                graphMetricLabel: 'Smooth Rendering Score at 10,000 Moving Particles',
                graphData: [
                    { label: '<svg> for UI Icons & Architecture Flowcharts (<500 nodes)', value: 98, displayValue: 'Infinite DPI + CSS/DOM Events', note: 'Best for UI & diagrams' },
                    { label: '<canvas> 2D / WebGL for 10,000+ Dynamic Particles', value: 95, displayValue: '60 FPS (Zero DOM Overhead)', note: 'Single bitmap buffer' },
                    { label: '<svg> with 10,000 Animated DOM Nodes', value: 18, displayValue: '12 FPS (DOM Layout Bottleneck)', note: 'Heavy DOM tree recalculation' }
                ],
                syntaxSummaryCode: `<!-- 1. Crisp Inline SVG Progress Ring -->
<svg viewBox="0 0 100 100" width="80" height="80" role="img" aria-label="80% Score">
    <circle cx="50" cy="50" r="40" fill="none" stroke="#E2E8F0" stroke-width="10" />
    <circle
        cx="50" cy="50" r="40"
        fill="none" stroke="#0284C7" stroke-width="10"
        stroke-dasharray="251.2" stroke-dashoffset="50.24"
        stroke-linecap="round"
    />
    <text x="50" y="55" text-anchor="middle" font-size="18" font-weight="bold">80%</text>
</svg>

<!-- 2. HTML5 Canvas Image Compressor / Drawing Surface -->
<canvas id="chart-canvas" width="600" height="300"></canvas>`,
                syntaxTable: [
                    { construct: 'SVG Coordinate Box', syntax: '<svg viewBox="0 0 400 200">', description: 'Defines internal vector coordinate system independent of pixel size.' },
                    { construct: 'SVG Shapes', syntax: '<rect>, <circle>, <line>, <polygon>, <path d="...">', description: 'Vector geometry primitives styleable via fill and stroke.' },
                    { construct: 'Canvas 2D Context', syntax: 'const ctx = canvas.getContext("2d");', description: 'Acquires 2D drawing context for rectangles, paths, text, and images.' },
                    { construct: 'Canvas Data URL', syntax: 'canvas.toDataURL("image/jpeg", 0.82)', description: 'Exports canvas bitmap as compressed Base64 image data URI.' }
                ],
                examples: [
                    {
                        title: 'Computing SVG Circular Progress Ring stroke-dashoffset',
                        code: `function buildSvgRing(percent, radius = 40) {
    const circumference = 2 * Math.PI * radius;
    const clamped = Math.max(0, Math.min(100, percent));
    const offset = circumference * (1 - clamped / 100);
    return {
        circumference: circumference.toFixed(2),
        strokeDashoffset: offset.toFixed(2)
    };
}

console.log("75% Progress Ring:", buildSvgRing(75, 40));`,
                        output: `75% Progress Ring: { circumference: '251.33', strokeDashoffset: '62.83' }`,
                        explanation: 'Setting stroke-dasharray to the circle circumference (2*pi*r) and stroke-dashoffset to C*(1 - p/100) draws an exact percentage arc.'
                    }
                ],
                problems: [
                    {
                        title: 'Generate SVG Polyline Sparkline Points from Numeric Array',
                        difficulty: 'Medium',
                        statement: 'Given an array of scores [50, 75, 60, 90, 100] and an SVG box of width=200, height=100, compute the space-separated "x,y" points attribute for an <svg><polyline> where y=0 is the top (score 100) and y=100 is the bottom (score 0).',
                        sampleInput: 'scores = [50, 75, 100], width = 200, height = 100',
                        sampleOutput: '"0,50 100,25 200,0"',
                        constraints: '2 <= scores.length <= 100',
                        hint: 'For index i, x = (i / (n - 1)) * width and y = height - (scores[i] / 100) * height.'
                    },
                    {
                        title: 'HiDPI Retina Canvas Scaler Utility',
                        difficulty: 'Easy',
                        statement: 'Write a function setupHiDPICanvas(canvas, cssWidth, cssHeight, dpr) that scales canvas.width and canvas.height by dpr while keeping CSS style dimensions at cssWidth x cssHeight.',
                        sampleInput: 'cssWidth = 400, cssHeight = 200, dpr = 2',
                        sampleOutput: 'canvas.width = 800, canvas.height = 400, style = 400px x 200px',
                        constraints: 'Scale ctx by dpr',
                        hint: 'Set canvas.width = cssWidth * dpr; canvas.height = cssHeight * dpr; and call ctx.scale(dpr, dpr).'
                    }
                ]
            },
            {
                chapterNumber: 9,
                title: 'Web Accessibility (WCAG 2.2), ARIA Roles, Live Regions & Focus Management',
                duration: '15 min read',
                difficulty: 'Intermediate',
                summary: 'Engineer inclusive web interfaces following WCAG 2.2 guidelines, the First Rule of ARIA, keyboard focus traps, and aria-live announcements.',
                overview: `Web Accessibility (a11y) ensures that applications are usable by everyone, including people using screen readers (NVDA, VoiceOver), keyboard-only navigation, or switch devices.

The First Rule of ARIA (Accessible Rich Internet Applications) states: "If you can use a native HTML5 element or attribute with the semantics and behavior you require already built in (like <button>, <dialog>, <details>, <input type='checkbox'>), use it instead of re-purposing a <div> and adding an ARIA role!"

When building dynamic single-page components (modals, tabs, toast notifications), use ARIA attributes to bridge state gaps: aria-expanded="true/false", aria-selected, aria-controls, role="alert", and aria-live="polite".`,
                keyPoints: [
                    'First Rule of ARIA: Native HTML (<button>, <a href>, <dialog>) beats <div role="button"> every time because native tags include Enter/Space key handlers and Tab focus automatically.',
                    'tabindex="0" inserts an element into the natural Tab order; tabindex="-1" makes it programmatically focusable via el.focus(); NEVER use positive tabindex="1+"!',
                    'Every icon-only button (<button><svg>...</svg></button>) MUST have an aria-label="Close modal" so screen readers do not announce "button, blank".',
                    'Use aria-live="polite" for non-urgent status updates (e.g., "3 results found") and role="alert" for urgent errors.'
                ],
                diagramTitle: 'WCAG Keyboard Focus & AOM Screen Reader Tree Pipeline',
                diagramSteps: [
                    'Native HTML5 Tag (<button>, <dialog>, <input>)',
                    'Accessible Name: Visible Label / aria-label / aria-labelledby',
                    'State: aria-expanded / aria-invalid / aria-current',
                    'Live Region: aria-live="polite" | role="alert"',
                    'Screen Reader Announcement & Focus Ring (:focus-visible)'
                ],
                graphTitle: 'Common Web Accessibility Failure Categories (WebAIM Million Report)',
                graphMetricLabel: 'Audit Priority Impact Score',
                graphData: [
                    { label: 'Low Contrast Text (< 4.5:1 WCAG AA ratio)', value: 84, displayValue: '81% of sites affected', note: 'Ensure 4.5:1 normal text, 3:1 large text' },
                    { label: 'Missing Image alt Text & Icon-Only Button Labels', value: 68, displayValue: '55% of sites affected', note: 'Add alt="..." and aria-label="..."' },
                    { label: 'Missing Form Input <label for="id"> Associations', value: 54, displayValue: '48% of sites affected', note: 'Never rely on placeholder alone' }
                ],
                syntaxSummaryCode: `<!-- 1. Accessible Icon-Only Button & Live Status Toast -->
<button type="button" aria-label="Close notification" onclick="closeToast()">
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" />
    </svg>
</button>

<div role="status" aria-live="polite" class="sr-only">
    Filter applied: Showing 12 matching coding problems.
</div>

<!-- 2. Native Accessible Modal Dialog -->
<dialog id="confirm-modal" aria-labelledby="modal-title" aria-describedby="modal-desc">
    <h2 id="modal-title">Submit Assessment?</h2>
    <p id="modal-desc">You have answered 28 of 30 questions. This action is final.</p>
    <form method="dialog">
        <button value="cancel">Cancel</button>
        <button value="confirm">Confirm Submit</button>
    </form>
</dialog>`,
                syntaxTable: [
                    { construct: 'Accessible Label', syntax: 'aria-label="Search" / aria-labelledby="heading-id"', description: 'Provides accessible name when visible text is absent or external.' },
                    { construct: 'Error Description', syntax: '<input aria-invalid="true" aria-describedby="err-msg">', description: 'Links an invalid input directly to its error message element.' },
                    { construct: 'Live Region', syntax: '<div role="status" aria-live="polite">', description: 'Announces dynamic DOM text changes to screen readers without moving focus.' },
                    { construct: 'Native Modal', syntax: 'dialogEl.showModal(); dialogEl.close();', description: 'Opens native <dialog> with automatic focus trapping and Esc key close.' }
                ],
                examples: [
                    {
                        title: 'Accessible Tablist & Tabpanel ARIA Wiring Pattern',
                        code: `<div role="tablist" aria-label="Code Output Tabs">
    <button
        role="tab"
        id="tab-testcases"
        aria-selected="true"
        aria-controls="panel-testcases"
        tabindex="0"
    >
        Test Cases
    </button>
    <button
        role="tab"
        id="tab-console"
        aria-selected="false"
        aria-controls="panel-console"
        tabindex="-1"
    >
        Console Output
    </button>
</div>

<div role="tabpanel" id="panel-testcases" aria-labelledby="tab-testcases">
    All 5 public test cases passed!
</div>`,
                        output: `[Accessible Tab Widget] -> Arrow keys switch tabs, active tab has aria-selected="true" & tabindex="0"`,
                        explanation: 'Linking role="tab" to role="tabpanel" via aria-controls and aria-labelledby communicates the exact widget relationship to assistive tech.'
                    }
                ],
                problems: [
                    {
                        title: 'Implement Keyboard Focus Trap for a Modal Container',
                        difficulty: 'Medium',
                        statement: 'Given a modal DOM element, find all focusable descendants (buttons, links, inputs with tabindex != -1) and cycle focus from the last element back to the first on Tab, and from first to last on Shift+Tab.',
                        sampleInput: 'Modal with [CancelBtn, ConfirmBtn], user presses Tab on ConfirmBtn',
                        sampleOutput: 'event.preventDefault(); CancelBtn.focus()',
                        constraints: 'Handle Shift+Tab reverse wrap as well',
                        hint: 'On keydown (e.key === "Tab"), check if document.activeElement === lastEl (!e.shiftKey) -> firstEl.focus(), or activeElement === firstEl (e.shiftKey) -> lastEl.focus().'
                    },
                    {
                        title: 'Audit Icon Buttons for Missing Accessible Name',
                        difficulty: 'Easy',
                        statement: 'Write a function auditButtons(rootEl) that finds any <button> whose trimmed textContent is empty and lacks both aria-label and aria-labelledby attributes.',
                        sampleInput: '<button><svg></svg></button>',
                        sampleOutput: '1 inaccessible icon button detected',
                        constraints: 'Check button.textContent.trim() === ""',
                        hint: 'Filter rootEl.querySelectorAll("button") where !btn.textContent.trim() && !btn.getAttribute("aria-label") && !btn.getAttribute("aria-labelledby").'
                    }
                ]
            },
            {
                chapterNumber: 10,
                title: 'SEO Architecture, OpenGraph, <template>, Web Components & Security',
                duration: '14 min read',
                difficulty: 'Advanced',
                summary: 'Master search engine metadata, JSON-LD structured data, inert <template> cloning, Shadow DOM Web Components, and iframe sandboxing.',
                overview: `Modern production HTML extends beyond visible tags to power SEO discovery, social sharing cards, reusable component templates, and security boundaries:
1. SEO & Social Metadata: <link rel="canonical">, <meta name="description">, OpenGraph (og:title, og:image), and <script type="application/ld+json"> Schema.org structured data enable rich search snippets.
2. <template> & <slot>: The <template> tag holds inert DOM markup that is parsed once by the browser but not rendered or executed until cloned via template.content.cloneNode(true).
3. Security Attributes: <iframe sandbox="..."> restricts embedded third-party frames from running scripts or navigating the top window.`,
                keyPoints: [
                    'Markup inside <template> is completely inert: images do not download and scripts do not run until cloned into the live DOM.',
                    'Always restrict third-party embeds with <iframe sandbox="allow-scripts allow-forms" referrerpolicy="no-referrer">.',
                    'Use <link rel="preconnect" href="https://fonts.googleapis.com"> to complete DNS + TCP + TLS handshakes early for critical origins.',
                    'The native HTML inert attribute (<div inert>) disables focus, clicks, and screen-reader interaction on background content while a drawer is open.'
                ],
                diagramTitle: 'HTML5 <template> Cloning, Web Components & Security Architecture',
                diagramSteps: [
                    '<head>: Canonical + OpenGraph + JSON-LD Schema',
                    '<link rel="preconnect"> Early TLS Handshake',
                    '<template id="row-tpl"> Inert Parsed AST',
                    'tpl.content.cloneNode(true) Fast DOM Stamp',
                    '<iframe sandbox="..."> Capability Isolation'
                ],
                graphTitle: 'DOM List Rendering Speed: <template>.cloneNode vs innerHTML Parsing',
                graphMetricLabel: 'Time to Stamp 2,000 Complex Card Nodes (ms)',
                graphData: [
                    { label: '<template>.content.cloneNode(true) + DocumentFragment', value: 24, displayValue: '8.5 ms', note: 'Pre-parsed AST cloned in C++' },
                    { label: 'createElement() Tree Construction', value: 38, displayValue: '13.2 ms', note: 'Direct DOM node allocation' },
                    { label: 'Repeated container.innerHTML += cardHtml', value: 100, displayValue: '290.0 ms', note: 'Re-parses entire container HTML each step!' }
                ],
                syntaxSummaryCode: `<!-- 1. SEO, Canonical & OpenGraph Social Card Metadata -->
<head>
    <link rel="canonical" href="https://portal.ethnotech.in/tracks" />
    <meta name="description" content="8 Languages x 10 Chapters Interactive Engineering Curriculum." />
    <meta property="og:title" content="Ethnotech Language Description Hub" />
    <meta property="og:type" content="website" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
</head>

<!-- 2. Inert <template> for High-Speed DOM Stamping -->
<template id="chapter-badge-tpl">
    <div class="badge-card">
        <strong class="badge-title"></strong>
        <span class="badge-duration"></span>
    </div>
</template>

<!-- 3. Sandboxed Third-Party Embed -->
<iframe
    src="https://example.com/embed"
    title="Interactive Sandbox"
    sandbox="allow-scripts allow-same-origin"
    loading="lazy"
></iframe>`,
                syntaxTable: [
                    { construct: 'Canonical URL', syntax: '<link rel="canonical" href="https://...">', description: 'Tells search engines the authoritative URL to prevent duplicate indexing.' },
                    { construct: 'Inert Template', syntax: 'const clone = tpl.content.cloneNode(true);', description: 'Clones pre-parsed inert <template> subtree without re-parsing HTML.' },
                    { construct: 'Inert Subtree', syntax: '<main inert>...</main>', description: 'Makes entire DOM subtree non-interactive and unfocusable.' },
                    { construct: 'Sandboxed Iframe', syntax: '<iframe sandbox="allow-scripts" src="...">', description: 'Runs embedded document in a least-privilege security sandbox.' }
                ],
                examples: [
                    {
                        title: 'Stamping List Items Safely with <template> & DocumentFragment',
                        code: `// Given <template id="item-tpl"><li><span class="name"></span></li></template>
function renderFastList(names) {
    // Simulated template stamping logic
    const rendered = names.map((name, idx) => \`<li data-idx="\${idx}">\${name}</li>\`);
    return \`<ul>\${rendered.join("")}</ul>\`;
}

console.log(renderFastList(["Python", "C", "Java", "C++"]));`,
                        output: `<ul><li data-idx="0">Python</li><li data-idx="1">C</li><li data-idx="2">Java</li><li data-idx="3">C++</li></ul>`,
                        explanation: 'Batching node creation in a DocumentFragment or pre-parsed <template> triggers only a single browser layout pass.'
                    }
                ],
                problems: [
                    {
                        title: 'Generate Valid Schema.org Course JSON-LD Script Block',
                        difficulty: 'Easy',
                        statement: 'Given a course object { name, description, provider }, return a <script type="application/ld+json"> string containing a valid Schema.org "@type": "Course" JSON-LD payload.',
                        sampleInput: '{ name: "C++ STL Mastery", description: "10 Chapters", provider: "Ethnotech" }',
                        sampleOutput: '<script type="application/ld+json">{"@context":"https://schema.org","@type":"Course",...}</script>',
                        constraints: 'Valid JSON serialization',
                        hint: 'Serialize { "@context": "https://schema.org", "@type": "Course", name, description, provider: { "@type": "Organization", name: provider } }.'
                    },
                    {
                        title: 'Audit Iframes for Missing Title and Unsandboxed External Origins',
                        difficulty: 'Easy',
                        statement: 'Given a list of iframe descriptor objects [{ src, title, sandbox }], flag any iframe missing a non-empty accessible title or lacking a sandbox attribute on external URLs.',
                        sampleInput: '[{ src: "https://ext.com/widget", title: "", sandbox: null }]',
                        sampleOutput: '["Missing accessible title attribute", "Missing sandbox restriction"]',
                        constraints: 'WCAG 2.4.1 & security compliance',
                        hint: 'Check !frame.title?.trim() and frame.src.startsWith("http") && frame.sandbox == null.'
                    }
                ]
            }
        ]
    },

    /* =========================================================================
       7. CSS (10 CHAPTERS)
       ========================================================================= */
    {
        slug: 'css',
        name: 'CSS',
        fullName: 'Modern CSS3 Architecture: Flexbox, Grid, Fluid Responsive & GPU Animations',
        badge: 'CSS3',
        tagline: 'Declarative visual styling engine: Cascade layers, Box Model, Flexbox, 2D Grid, Custom Properties, and 60fps GPU transitions.',
        description:
            'Master CSS from the Cascade, Specificity tuples, and Box Model sizing to Flexbox, CSS Grid 2D layouts, Fluid Clamp Typography, Container Queries, Custom Properties (--vars), and hardware-accelerated animations.',
        accentColor: '#0D9488',
        secondaryColor: '#CCFBF1',
        fileExtension: '.css',
        paradigm: 'Declarative Rule-Based Styling, Constraint Layout Engine (CSSOM)',
        creatorInfo: 'Created by Håkon Wium Lie • W3C CSS Working Group Specifications',
        sortOrder: 7,
        chapters: [
            {
                chapterNumber: 1,
                title: 'The Cascade, Specificity Tuples (A, B, C), Inheritance & @layer',
                duration: '14 min read',
                difficulty: 'Beginner',
                summary: 'Master how browsers resolve competing CSS declarations using Origin, @layer, Specificity (ID, Class, Type), and Source Order.',
                overview: `CSS stands for Cascading Style Sheets because multiple rules can target the same HTML element. When two rules declare the same property (e.g., color), the browser's Cascade algorithm resolves the winner in strict priority order:
1. Origin & !important
2. Cascade Layers (@layer reset, base, components, utilities;)
3. Selector Specificity Tuple (A, B, C):
   - A = Number of ID selectors (#nav)
   - B = Number of Class (.btn), Attribute ([type="text"]), and Pseudo-class (:hover, :not()) selectors
   - C = Number of Element/Type (div, h1) and Pseudo-element (::before, ::after) selectors
4. Source Order (last rule declared wins if specificity is tied).

The universal selector (*), combinators (>, +, ~), and :where() contribute (0, 0, 0) specificity, while :is() and :not() take the specificity of their most specific argument.`,
                keyPoints: [
                    'Specificity is compared column-by-column as (A, B, C): 1 ID (1, 0, 0) always beats 50 classes (0, 50, 0)!',
                    'Inline style="..." attributes have higher weight than any ID selector (1, 0, 0, 0).',
                    ':where(.card button) has (0, 0, 0) specificity—ideal for base library defaults that are easy to override.',
                    'Typography properties (color, font-family, line-height, text-align) inherit down the DOM tree automatically; box properties (margin, padding, border, width) do NOT inherit.'
                ],
                diagramTitle: 'CSS Cascade Resolution & Specificity Tuple (A, B, C) Engine',
                diagramSteps: [
                    '1. Filter Matching Selectors in CSSOM',
                    '2. Check Origin & @layer Precedence',
                    '3. Compare Specificity Tuple (A:#id, B:.class, C:tag)',
                    '4. Tie-Breaker: Last Rule in Source Order Wins',
                    '5. Unset Properties -> Inherit or Initial Default'
                ],
                graphTitle: 'Selector Specificity Weight Comparison (Tuple Scale)',
                graphMetricLabel: 'Relative Override Priority',
                graphData: [
                    { label: ':where(.card .btn) -> (0, 0, 0)', value: 5, displayValue: '(0, 0, 0)', note: 'Zero-specificity reset/default' },
                    { label: 'article h2::before -> (0, 0, 3)', value: 22, displayValue: '(0, 0, 3)', note: '2 element tags + 1 pseudo-element' },
                    { label: '.card.active:hover -> (0, 3, 0)', value: 58, displayValue: '(0, 3, 0)', note: '2 classes + 1 pseudo-class' },
                    { label: '#header .nav-link -> (1, 1, 0)', value: 94, displayValue: '(1, 1, 0)', note: '1 ID overrides any number of classes' }
                ],
                syntaxSummaryCode: `/* Modern Cascade Layer Ordering */
@layer reset, base, components, utilities;

@layer base {
    /* :where() keeps specificity at (0, 0, 0) */
    :where(h1, h2, h3) {
        margin-block: 0;
        color: #0f172a;
    }
}

@layer components {
    /* Specificity: (0, 1, 0) */
    .btn {
        background: #0284c7;
        color: #ffffff;
    }
    /* Specificity: (0, 2, 0) */
    .btn:hover {
        background: #0369a1;
    }
}`,
                syntaxTable: [
                    { construct: 'Zero Specificity', syntax: ':where(.btn, .link) { ... }', description: 'Matches selectors while contributing (0, 0, 0) to specificity.' },
                    { construct: 'Group Match', syntax: ':is(header, footer) a:hover', description: 'Matches any item in list; takes highest argument specificity.' },
                    { construct: 'Relational :has()', syntax: '.card:has(img) { padding-top: 0; }', description: 'Parent selector matching a .card that contains an <img>.' },
                    { construct: 'Cascade Layer', syntax: '@layer base, components, utilities;', description: 'Explicitly controls cascade precedence independent of specificity.' }
                ],
                examples: [
                    {
                        title: 'Calculating Selector Specificity Tuples & Parent :has() Styling',
                        code: `/* Specificity Breakdown Examples */
/* 1. ul li.active a        -> (0, 1, 3): 0 IDs, 1 class (.active), 3 tags (ul, li, a) */
/* 2. #sidebar .menu-item   -> (1, 1, 0): 1 ID (#sidebar), 1 class (.menu-item), 0 tags */
/* 3. .form-group:has(input:invalid) -> Highlights wrapper when child input is invalid! */

.form-group:has(input:user-invalid) {
    border-color: #dc2626;
    background-color: #fef2f2;
}`,
                        output: `Rule #2 (1, 1, 0) beats Rule #1 (0, 1, 3)
.form-group automatically styles red when its child <input> fails validation`,
                        explanation: 'The modern :has() relational pseudo-class lets CSS style a parent container based on the state or presence of its children.'
                    }
                ],
                problems: [
                    {
                        title: 'Compute CSS Selector Specificity Tuple (A, B, C)',
                        difficulty: 'Medium',
                        statement: 'Given a simplified CSS selector string such as "#app .card.featured > h2:hover", compute and return its 3-element specificity tuple [A, B, C].',
                        sampleInput: '"#app .card.featured > h2:hover"',
                        sampleOutput: '[1, 3, 1] (1 ID, 2 classes + 1 pseudo-class, 1 tag)',
                        constraints: 'Ignore combinators >, +, ~',
                        hint: 'Count #id tokens for A, .class / [attr] / :pseudo-class tokens for B, and bare element names / ::pseudo-elements for C.'
                    },
                    {
                        title: 'Style Parent Card Using :has() When Checkbox Is Checked',
                        difficulty: 'Easy',
                        statement: 'Write a single CSS rule using :has() that gives .option-card a 2px solid #0284c7 border and #f0f9ff background whenever its child <input type="checkbox"> is :checked.',
                        sampleInput: '<label class="option-card"><input type="checkbox" checked /> Option A</label>',
                        sampleOutput: '.option-card:has(input[type="checkbox"]:checked) { ... }',
                        constraints: 'Zero JavaScript required',
                        hint: 'Use .option-card:has(input:checked) { border: 2px solid #0284c7; background: #f0f9ff; }.'
                    }
                ]
            },
            {
                chapterNumber: 2,
                title: 'The Box Model, box-sizing: border-box, Margin Collapse & Logical Properties',
                duration: '14 min read',
                difficulty: 'Beginner',
                summary: 'Master content-box vs border-box geometry, vertical margin collapsing rules, overflow contexts, and RTL-ready logical properties.',
                overview: `Every element in CSS generates a rectangular box composed of four concentric layers from inside out: Content -> Padding -> Border -> Margin.

By default, CSS uses box-sizing: content-box, where setting width: 300px; padding: 20px; border: 2px solid; produces an actual rendered outer width of 300 + 40 + 4 = 344px—breaking grid calculations! Every modern stylesheet starts with a universal reset setting box-sizing: border-box, which includes padding and border inside the declared width (so width: 300px stays strictly 300px wide).`,
                keyPoints: [
                    'Always apply *, *::before, *::after { box-sizing: border-box; } globally.',
                    'Vertical margins between adjacent block siblings collapse to max(marginBottom, marginTop), NOT their sum! Flexbox and Grid children never collapse margins.',
                    'Inline elements (<span>, <a>) ignore width, height, and vertical top/bottom margins; use display: inline-block or flex.',
                    'Modern Logical Properties (padding-inline, margin-block, inline-size) adapt automatically to both Left-to-Right and Right-to-Left languages.'
                ],
                diagramTitle: 'CSS Box Model Layers & content-box vs border-box Math',
                diagramSteps: [
                    'Inner Content Area (Text / Image)',
                    'Padding Layer (Background Color Extends Here)',
                    'Border Layer (Stroke Outline)',
                    'Outer Margin Layer (Transparent Spacing)',
                    'border-box: Declared Width = Content + Padding + Border'
                ],
                graphTitle: 'Actual Rendered Box Width for width: 300px; padding: 24px; border: 2px',
                graphMetricLabel: 'Total Pixel Width on Screen (px)',
                graphData: [
                    { label: 'box-sizing: border-box (Predictable)', value: 60, displayValue: '300 px Exact (248px content + 48px pad + 4px border)', note: 'Industry standard reset' },
                    { label: 'box-sizing: content-box (Legacy Default)', value: 90, displayValue: '352 px Overflow! (300px + 48px pad + 4px border)', note: 'Breaks 100% width containers' }
                ],
                syntaxSummaryCode: `/* Universal Border-Box Reset */
*, *::before, *::after {
    box-sizing: border-box;
}

.card {
    inline-size: 100%;          /* Logical equivalent of width: 100% */
    max-inline-size: 420px;
    padding-inline: 1.5rem;     /* Left & Right padding (24px) */
    padding-block: 1.25rem;     /* Top & Bottom padding (20px) */
    border: 1px solid #e2e8f0;
    border-radius: 1rem;
    /* outline does not take up box-model layout space */
    outline-offset: 2px;
}

.card:focus-visible {
    outline: 2px solid #0284c7;
}`,
                syntaxTable: [
                    { construct: 'Border-Box Sizing', syntax: 'box-sizing: border-box;', description: 'Includes padding and border within declared width and height.' },
                    { construct: 'Logical Padding', syntax: 'padding-inline: 16px; padding-block: 12px;', description: 'Sets horizontal (inline) and vertical (block) padding.' },
                    { construct: 'Aspect Ratio Lock', syntax: 'aspect-ratio: 16 / 9;', description: 'Maintains proportional width-to-height ratio automatically.' },
                    { construct: 'Text Truncate', syntax: 'overflow: hidden; text-overflow: ellipsis; white-space: nowrap;', description: 'Truncates single-line overflowing text with an ellipsis (…).' }
                ],
                examples: [
                    {
                        title: 'Multi-Line Text Clamping (-webkit-line-clamp) & Box Geometry',
                        code: `.blog-excerpt {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;      /* Clamp cleanly at 3 lines with ellipsis */
    overflow: hidden;
    line-height: 1.6;
}

/* Box Math Verification */
/* Given box-sizing: border-box; width: 400px; padding: 20px; border: 4px solid */
/* Available inner content width = 400 - (20 * 2) - (4 * 2) = 352px */`,
                        output: `Inner content width = 352px | Outer box width = 400px
Text automatically truncates with '...' at the end of line 3`,
                        explanation: 'With box-sizing: border-box, subtracting 2*padding and 2*border from declared width gives the exact inner content width.'
                    }
                ],
                problems: [
                    {
                        title: 'Calculate Rendered Outer & Content Widths for Box-Sizing Modes',
                        difficulty: 'Easy',
                        statement: 'Given { width: 500, paddingLeft: 16, paddingRight: 16, borderWidth: 2, margin: 10 }, compute (1) the outer border-box width and (2) the inner content width under both content-box and border-box.',
                        sampleInput: 'width=500, padX=16, border=2',
                        sampleOutput: 'content-box: outer=536px, inner=500px | border-box: outer=500px, inner=464px',
                        constraints: 'Margins are outside the border box',
                        hint: 'horizontalChrome = paddingLeft + paddingRight + 2 * borderWidth = 36px.'
                    },
                    {
                        title: 'Compute Vertical Distance Under Block Margin Collapsing',
                        difficulty: 'Easy',
                        statement: 'Block A has margin-bottom: 24px and sits directly above Block B which has margin-top: 36px inside a normal block flow container. What is the exact vertical pixel gap between their borders, and what does it become if the parent becomes display: flex; flex-direction: column?',
                        sampleInput: 'mb = 24px, mt = 36px',
                        sampleOutput: 'Block flow: 36px (collapsed) | Flex column: 60px (uncollapsed sum)',
                        constraints: 'Positive vertical margins',
                        hint: 'In normal block flow, adjacent positive vertical margins collapse to Math.max(mb, mt); in a flex or grid container, margins never collapse (mb + mt).'
                    }
                ]
            },
            {
                chapterNumber: 3,
                title: 'Modern CSS Units, Fluid clamp() Typography & Custom Properties (--vars)',
                duration: '14 min read',
                difficulty: 'Beginner',
                summary: 'Design accessible, themeable UI systems using rem/em, viewport units (dvh), fluid clamp(min, val, max), and CSS Variables.',
                overview: `Hardcoding pixel (px) font sizes breaks accessibility because it overrides the user's browser default font-size preference. Instead:
- Use rem (Root EM, relative to <html> root font size, typically 1rem = 16px) for font sizes, max-widths, and layout spacing.
- Use em (relative to the current element's font-size) for component-proportional padding or icon offsets.
- Use clamp(min, preferred, max) (e.g., font-size: clamp(1.5rem, 2.5vw + 1rem, 2.75rem);) for Fluid Typography that scales smoothly between mobile and desktop without media-query jumps!

CSS Custom Properties (--primary: #004aad; accessed via var(--primary, fallback)) are live runtime variables scoped to the DOM cascade, enabling instant Dark Mode and dynamic theming.`,
                keyPoints: [
                    'Use 100dvh (Dynamic Viewport Height) instead of 100vh on mobile layouts so mobile browser address bars do not clip bottom content.',
                    'Set max-width: 65ch on long-form reading paragraphs (like blogs and chapters) for optimal human eye tracking (60–75 characters per line).',
                    'Unlike SASS/LESS compile-time variables, CSS Custom Properties (--var) live in the browser DOM and can be updated dynamically via JS: el.style.setProperty("--hue", 210).',
                    'Always include a unit inside calc(): calc(100% - 2rem) (with spaces around - and +!).'
                ],
                diagramTitle: 'Fluid clamp() Scaling Curve & CSS Custom Property Cascade',
                diagramSteps: [
                    ':root Defines Design Tokens (--brand, --space-4)',
                    '[data-theme="dark"] Overrides Token Values',
                    'Children Read var(--brand, #004AAD)',
                    'clamp(1.25rem, 2vw + 0.8rem, 2.25rem) Fluid Scale'
                ],
                graphTitle: 'Fluid clamp() Font Size Across Viewport Widths (320px to 1440px)',
                graphMetricLabel: 'Computed Font Size in Pixels',
                graphData: [
                    { label: 'Mobile 360px Viewport -> Clamped at Min', value: 45, displayValue: '24 px (1.5rem min)', note: 'Never shrinks below readable floor' },
                    { label: 'Tablet 768px Viewport -> Fluid Linear Slope', value: 68, displayValue: '31 px (2vw + 1rem)', note: 'Smooth proportional interpolation' },
                    { label: 'Desktop 1440px+ Viewport -> Clamped at Max', value: 92, displayValue: '40 px (2.5rem max)', note: 'Caps growth on ultra-wide monitors' }
                ],
                syntaxSummaryCode: `:root {
    --surface: #ffffff;
    --text-main: #0f172a;
    --brand: #004aad;
    --radius-lg: 1rem;
}

[data-theme="dark"] {
    --surface: #0f172a;
    --text-main: #f8fafc;
    --brand: #38bdf8;
}

.article-body {
    background-color: var(--surface);
    color: var(--text-main);
    /* Fluid heading & optimal reading measure */
    max-inline-size: 68ch;
    font-size: clamp(1rem, 0.4vw + 0.9rem, 1.1875rem);
    line-height: 1.75;
}

.full-viewport-shell {
    min-block-size: 100dvh;
}`,
                syntaxTable: [
                    { construct: 'Root Relative Unit', syntax: 'font-size: 1.125rem;', description: 'Scales proportionally with root <html> font size (1.125 * 16px = 18px).' },
                    { construct: 'Fluid Clamp', syntax: 'clamp(1rem, 2vw + 0.5rem, 2rem)', description: 'Interpolates value smoothly between minimum and maximum bounds.' },
                    { construct: 'CSS Variable Read', syntax: 'color: var(--accent, #2563eb);', description: 'Reads custom property with an optional fallback value.' },
                    { construct: 'Dynamic Viewport', syntax: 'min-height: 100dvh;', description: 'Accounts for collapsible mobile browser toolbars.' }
                ],
                examples: [
                    {
                        title: 'Runtime Theme Accent Switcher Using CSS Custom Properties',
                        code: `/* CSS */
.track-badge {
    --badge-color: #2563eb;
    color: var(--badge-color);
    border: 1.5px solid color-mix(in srgb, var(--badge-color) 30%, transparent);
    background: color-mix(in srgb, var(--badge-color) 10%, white);
}

/* JavaScript Dynamic Token Update */
// badgeEl.style.setProperty("--badge-color", "#059669");`,
                        output: `Updating a single --badge-color token automatically recomputes text, 30% border, and 10% tint background!`,
                        explanation: 'Pairing CSS Custom Properties with color-mix(in srgb, ...) derives translucent borders and backgrounds from a single accent variable.'
                    }
                ],
                problems: [
                    {
                        title: 'Evaluate CSS clamp(min, preferred, max) at Any Viewport Width',
                        difficulty: 'Easy',
                        statement: 'Write a function evalClamp(minPx, vwCoeff, offsetPx, maxPx, viewportWidth) that computes the exact resolved pixel value of clamp(minPx, (vwCoeff * viewportWidth / 100) + offsetPx, maxPx).',
                        sampleInput: 'min=16, vw=2, offset=8, max=32, viewportWidth=800',
                        sampleOutput: '24 (preferred = 16 + 8 = 24, clamped in [16, 32])',
                        constraints: 'minPx <= maxPx',
                        hint: 'Compute pref = (vwCoeff * viewportWidth) / 100 + offsetPx; return Math.max(minPx, Math.min(maxPx, pref)).'
                    },
                    {
                        title: 'Convert Pixel Design Specs to Accessible rem Scale',
                        difficulty: 'Easy',
                        statement: 'Given an array of pixel sizes [12, 14, 16, 20, 24, 32] and baseFontSize = 16, return their rem string equivalents.',
                        sampleInput: '[12, 16, 24]',
                        sampleOutput: '["0.75rem", "1rem", "1.5rem"]',
                        constraints: 'Strip trailing zeros',
                        hint: 'Divide each px value by 16 and append "rem": `${px / 16}rem`.'
                    }
                ]
            },
            {
                chapterNumber: 4,
                title: 'Positioning, Stacking Contexts, z-index & Sticky Headers',
                duration: '15 min read',
                difficulty: 'Intermediate',
                summary: 'Master static, relative, absolute, fixed, and sticky positioning, and understand why z-index only compares within the same Stacking Context.',
                overview: `The CSS position property controls how an element is placed in the document layout:
- static (default): Normal document flow; top/left/z-index have no effect.
- relative: Remains in normal flow, but offsets visually relative to itself and acts as the positioning anchor for absolute children.
- absolute: Removed from normal flow and positioned relative to its nearest non-static ancestor (or the document body if none exists).
- fixed: Removed from flow and pinned relative to the browser viewport.
- sticky: Hybrid of relative and fixed—scrolls normally until it crosses a threshold (e.g., top: 0) inside its scrolling container, then sticks!

Why does z-index: 9999 sometimes fail to appear above another element? Because z-index is scoped to its parent Stacking Context! Any ancestor with position + z-index, opacity < 1, transform, or filter creates a new isolated Stacking Context.`,
                keyPoints: [
                    'Always set position: relative on the parent container before positioning a child with position: absolute; top: ...; right: ...;',
                    'inset: 0 is the modern shorthand for top: 0; right: 0; bottom: 0; left: 0; (perfect for modal backdrops).',
                    'position: sticky; top: 0; FAILS if any ancestor has overflow: hidden or overflow: auto (unless that ancestor is the intended scroll container)!',
                    'Use isolation: isolate on a component root to create a clean Stacking Context boundary without guessing global z-index numbers.'
                ],
                diagramTitle: 'Positioning Anchors & Stacking Context Isolation Hierarchy',
                diagramSteps: [
                    'Parent: position: relative (Coordinate Anchor)',
                    'Child: position: absolute; top: 8px; right: 8px',
                    'Sticky Header: position: sticky; top: 0; z-index: 20',
                    'Modal Overlay: position: fixed; inset: 0; z-index: 50',
                    'Stacking Context Trigger (transform / opacity < 1 / isolation)'
                ],
                graphTitle: 'Common Causes of Broken position: sticky & z-index Bugs',
                graphMetricLabel: 'Frequency in Frontend Bug Reports (%)',
                graphData: [
                    { label: 'Ancestor has overflow: hidden Breaking position: sticky', value: 88, displayValue: '42% of Sticky Bugs', note: 'Use overflow: clip instead of hidden!' },
                    { label: 'Parent transform / opacity Creating Unexpected Stacking Context', value: 76, displayValue: '35% of z-index Bugs', note: 'Child z-index:9999 trapped inside parent' },
                    { label: 'Missing position: relative on Parent of Absolute Child', value: 54, displayValue: '23% of Layout Bugs', note: 'Child escapes to viewport corners' }
                ],
                syntaxSummaryCode: `/* 1. Card with Corner Badge (Relative Parent + Absolute Child) */
.course-card {
    position: relative;
    isolation: isolate;         /* Contains internal z-index layers */
}

.new-badge {
    position: absolute;
    inset-block-start: 0.75rem; /* top: 12px */
    inset-inline-end: 0.75rem;  /* right: 12px */
}

/* 2. Sticky Table / Chapter Header */
.sticky-toolbar {
    position: sticky;
    top: 0;
    z-index: 20;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(12px);
}

/* 3. Fullscreen Modal Backdrop */
.modal-backdrop {
    position: fixed;
    inset: 0;                   /* top:0; right:0; bottom:0; left:0 */
    z-index: 50;
}`,
                syntaxTable: [
                    { construct: 'Position Anchor', syntax: 'position: relative;', description: 'Establishes coordinate origin for absolute children without leaving flow.' },
                    { construct: 'Inset Shorthand', syntax: 'position: fixed; inset: 0;', description: 'Stretches positioned element across all four edges (top/right/bottom/left: 0).' },
                    { construct: 'Sticky Threshold', syntax: 'position: sticky; top: 1rem;', description: 'Sticks 1rem from top of scroll container while parent remains in view.' },
                    { construct: 'Stacking Isolation', syntax: 'isolation: isolate;', description: 'Creates a self-contained z-index stacking context with zero side effects.' }
                ],
                examples: [
                    {
                        title: 'Diagnosing Stacking Context Trap & overflow: clip Sticky Fix',
                        code: `/* Problem: overflow: hidden on a wrapper kills position: sticky on descendants */
/* Solution: overflow: clip clips visual overflow WITHOUT creating a scroll container! */
.page-wrapper {
    overflow-x: clip;
}

.chapter-sidebar {
    position: sticky;
    top: 5rem;
    max-height: calc(100dvh - 6rem);
    overflow-y: auto;
}`,
                        output: `.chapter-sidebar remains pinned at top: 5rem during page scroll while horizontal overflow is still clipped!`,
                        explanation: 'Replacing overflow-x: hidden with overflow-x: clip preserves position: sticky behavior on all child elements.'
                    }
                ],
                problems: [
                    {
                        title: 'Predict Winner Between Competing Stacking Contexts',
                        difficulty: 'Medium',
                        statement: 'Element A is inside Header (position: relative; z-index: 2) and has z-index: 10. Element B is inside Main (position: relative; z-index: 1) and has z-index: 99999. When A and B overlap on screen, which element renders on top and why?',
                        sampleInput: 'Header(z=2) > A(z=10) vs Main(z=1) > B(z=99999)',
                        sampleOutput: 'Element A renders on top',
                        constraints: 'Header and Main are sibling stacking contexts',
                        hint: 'Child z-indices only compete within their own parent stacking context. Because Header (z-index: 2) > Main (z-index: 1), all of Header (including A) paints above all of Main (including B).'
                    },
                    {
                        title: 'Center an Absolute Tooltip Above a Button Using inset & transform',
                        difficulty: 'Easy',
                        statement: 'Write the CSS for a .tooltip child inside a position: relative button so the tooltip sits 8px above the button top edge and is horizontally centered.',
                        sampleInput: 'Button width = variable',
                        sampleOutput: 'bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%);',
                        constraints: 'Works for any dynamic button width',
                        hint: 'Set position: absolute; bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%);.'
                    }
                ]
            },
            {
                chapterNumber: 5,
                title: 'Flexbox 1D Layout Engine: Axes, Alignment & Flex Growth Math',
                duration: '16 min read',
                difficulty: 'Intermediate',
                summary: 'Master 1D layout distribution with display: flex, main vs cross axis alignment, gap, and the flex: grow shrink basis shorthand.',
                overview: `CSS Flexbox (display: flex) is a one-dimensional layout model designed to distribute space and align items along either a row or a column. Every flex container has two axes:
- Main Axis (defined by flex-direction: row or column): Controlled by justify-content (flex-start, center, space-between, space-around, space-evenly).
- Cross Axis (perpendicular to the main axis): Controlled by align-items (stretch, center, flex-start, baseline).

Child flex sizing is governed by the triad flex: <flex-grow> <flex-shrink> <flex-basis> (e.g., flex: 1 1 0% or shorthand flex: 1). Crucial Flexbox Gotcha: Flex items default to min-width: auto, which prevents a flex child containing long text or code from shrinking below its content width! Adding min-width: 0 on a flex: 1 child allows text truncation (text-overflow: ellipsis) and code scrollbars to work properly.`,
                keyPoints: [
                    'justify-content aligns along the Main Axis; align-items aligns along the Cross Axis.',
                    'When flex-direction: column is set, the axes swap: justify-content becomes vertical and align-items becomes horizontal!',
                    'Always add min-width: 0 to a flex: 1 child container if it holds truncatable text or a scrollable code block.',
                    'Use gap: 1rem on the flex container instead of margin hacks on children; margin-left: auto pushes an item to the far right edge.'
                ],
                diagramTitle: 'Flexbox Main Axis vs Cross Axis & flex: 1 1 0% Distribution',
                diagramSteps: [
                    'Container: display: flex; gap: 16px',
                    'Main Axis: justify-content (space-between / center)',
                    'Cross Axis: align-items (center / stretch)',
                    'Child Sizing: flex-basis -> flex-grow / flex-shrink',
                    'Overflow Guard: min-width: 0 on flex: 1 Child'
                ],
                graphTitle: 'Remaining Space Distribution Among Flex Children',
                graphMetricLabel: 'Share of 300px Free Space Allocated',
                graphData: [
                    { label: 'Child A (flex-grow: 1)', value: 33, displayValue: '+100 px (1/3 of free space)', note: 'Grows by 1 share' },
                    { label: 'Child B (flex-grow: 2)', value: 67, displayValue: '+200 px (2/3 of free space)', note: 'Grows by 2 shares' },
                    { label: 'Child C (flex: 0 0 120px Fixed Sidebar)', value: 5, displayValue: '+0 px (Fixed at 120px)', note: 'Neither grows nor shrinks' }
                ],
                syntaxSummaryCode: `/* 1. Navigation Header with Auto-Pushed Actions */
.navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
}

/* 2. App Shell: Fixed 256px Sidebar + Scrollable Main Content */
.app-shell {
    display: flex;
    min-height: 100dvh;
}
.sidebar {
    flex: 0 0 256px;            /* Never grow, never shrink, fixed 256px */
}
.main-content {
    flex: 1 1 0%;               /* Fill remaining width */
    min-width: 0;               /* Crucial: prevents long code blocks from blowing out width! */
}

/* 3. Sticky Footer Card (Button always pinned to bottom) */
.card-flex {
    display: flex;
    flex-direction: column;
}
.card-cta {
    margin-top: auto;           /* Absorbs vertical free space above button */
}`,
                syntaxTable: [
                    { construct: 'Flex Shorthand', syntax: 'flex: 1; /* 1 1 0% */', description: 'Grows and shrinks equally from a 0% basis to fill available space.' },
                    { construct: 'Fixed Flex Item', syntax: 'flex: 0 0 240px;', description: 'Locks item at exactly 240px (no grow, no shrink).' },
                    { construct: 'Axis Alignment', syntax: 'justify-content: space-between; align-items: center;', description: 'Spreads items along main axis and centers them on cross axis.' },
                    { construct: 'Auto Margin Push', syntax: 'margin-inline-start: auto;', description: 'Absorbs all remaining free space on the main axis before the item.' }
                ],
                examples: [
                    {
                        title: 'Solving the Flexbox Long-Text Overflow Bug with min-width: 0',
                        code: `/* Without min-width: 0, a flex child refuses to shrink below its longest word/pre block */
.user-row {
    display: flex;
    align-items: center;
    gap: 12px;
}

.user-avatar {
    flex: 0 0 40px;
}

.user-info {
    flex: 1;
    min-width: 0; /* Allows .user-email ellipsis truncation to work! */
}

.user-email {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}`,
                        output: `[40px Avatar] [Aarav Sharma (aarav.very.long.email@ethnotech...)]`,
                        explanation: 'Overriding the default min-width: auto with min-width: 0 lets the flex item shrink to fit its parent container.'
                    }
                ],
                problems: [
                    {
                        title: 'Calculate Final Pixel Widths of Flex Items After flex-grow',
                        difficulty: 'Medium',
                        statement: 'A flex container has width 800px and gap: 20px with 3 children: Item 1 (flex: 0 0 200px), Item 2 (flex: 1 1 100px), and Item 3 (flex: 2 1 100px). Compute the final rendered width of each item.',
                        sampleInput: 'Container = 800px, 2 gaps of 20px = 40px',
                        sampleOutput: 'Item 1 = 200px, Item 2 = 220px, Item 3 = 340px',
                        constraints: 'Sum of widths + gaps == 800px',
                        hint: 'Used basis + gaps = 200 + 100 + 100 + 40 = 440px. Remaining free space = 800 - 440 = 360px. Total grow shares = 0 + 1 + 2 = 3 (120px per share).'
                    },
                    {
                        title: 'Pin Card Footer Button to Bottom of Equal-Height Cards',
                        difficulty: 'Easy',
                        statement: 'In a row of cards with varying paragraph lengths, write the Flexbox rules on .card and .card-footer so all cards stretch to equal height and .card-footer always sits flush at the bottom.',
                        sampleInput: '3 cards in a row with 1, 3, and 5 lines of text',
                        sampleOutput: 'All 3 footer buttons aligned on the exact same horizontal baseline',
                        constraints: 'Pure CSS Flexbox',
                        hint: 'Set display: flex; flex-direction: column; on .card, and margin-top: auto; on .card-footer.'
                    }
                ]
            },
            {
                chapterNumber: 6,
                title: 'CSS Grid 2D Layout Architecture: fr Units, auto-fit, minmax() & Areas',
                duration: '16 min read',
                difficulty: 'Intermediate',
                summary: 'Build two-dimensional responsive page and card grids using display: grid, fractional fr tracks, repeat(auto-fit, minmax()), and subgrid.',
                overview: `While Flexbox excels at one-dimensional content distribution, CSS Grid (display: grid) is a two-dimensional layout system that controls both columns and rows simultaneously from the parent container down.

The single most powerful responsive pattern in modern CSS is the intrinsic auto-wrapping card grid:
grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
Without writing a single @media query, the browser automatically calculates how many 280px cards fit across the container, wraps excess cards onto new rows, and stretches each column equally (1fr) to fill remaining space!`,
                keyPoints: [
                    '1fr represents 1 share of available free space in the grid container (and automatically respects gap tracks, unlike % widths!).',
                    'Use minmax(0, 1fr) instead of 1fr when a grid column contains wide tables or <pre> code blocks so the track never expands past its fraction.',
                    'auto-fit collapses empty tracks to 0px so existing items expand to fill the row; auto-fill keeps empty ghost tracks.',
                    'grid-template-areas lets you sketch entire dashboard layouts visually using named ASCII art strings.'
                ],
                diagramTitle: 'CSS Grid 2D Track Sizing & Zero-Media-Query auto-fit Architecture',
                diagramSteps: [
                    'Container: display: grid; gap: 1.25rem',
                    'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
                    'Viewport 1200px -> 4 Equal Columns (1fr each)',
                    'Viewport 768px -> Auto-Wraps to 2 Columns',
                    'Viewport 360px -> Single 100% Column'
                ],
                graphTitle: 'Lines of CSS Required for 4-Breakpoint Responsive Card Grid',
                graphMetricLabel: 'Lines of Layout Code (Lower is cleaner)',
                graphData: [
                    { label: 'CSS Grid repeat(auto-fit, minmax(260px, 1fr))', value: 12, displayValue: '3 lines (0 media queries)', note: 'Container-aware intrinsic wrapping' },
                    { label: 'Manual @media (min-width: 640/768/1024/1280px)', value: 92, displayValue: '28 lines (4 media queries)', note: 'Viewport-coupled breakpoint jumps' }
                ],
                syntaxSummaryCode: `/* 1. Zero-Media-Query Responsive Card Grid */
.card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
    gap: 1.25rem;
}

/* 2. 12-Column Dashboard Layout with Named Areas */
.dashboard-layout {
    display: grid;
    grid-template-columns: 260px minmax(0, 1fr);
    grid-template-rows: 64px 1fr;
    grid-template-areas:
        "sidebar header"
        "sidebar main";
    min-height: 100dvh;
}
.dash-sidebar { grid-area: sidebar; }
.dash-header  { grid-area: header; }
.dash-main    { grid-area: main; }

/* 3. Spanning Multiple Columns (Bento Grid Card) */
.bento-featured {
    grid-column: span 2;
    grid-row: span 2;
}`,
                syntaxTable: [
                    { construct: 'Responsive Auto-Grid', syntax: 'grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));', description: 'Automatically wraps columns based on available width.' },
                    { construct: 'Overflow-Safe Track', syntax: 'grid-template-columns: 240px minmax(0, 1fr);', description: 'Prevents wide children from expanding the 1fr column.' },
                    { construct: 'Column / Row Span', syntax: 'grid-column: span 2; / grid-column: 1 / -1;', description: 'Spans 2 columns, or stretches from first to last grid line (-1).' },
                    { construct: 'Center Anything', syntax: 'display: grid; place-items: center;', description: 'Centers child horizontally and vertically in 2 properties.' }
                ],
                examples: [
                    {
                        title: 'Full-Width Header Banner Spanning All Columns via 1 / -1',
                        code: `.filter-bar-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    align-items: end;
}

.filter-bar-header {
    /* Spans from the very first grid line (1) to the very last grid line (-1) */
    grid-column: 1 / -1;
}`,
                        output: `[Header Banner Spans Full Width Across All Dynamic Columns]
[Filter 1] [Filter 2] [Filter 3] [Filter 4]`,
                        explanation: 'grid-column: 1 / -1 spans across all explicit columns regardless of how many columns are currently rendered.'
                    }
                ],
                problems: [
                    {
                        title: 'Difference Between auto-fit and auto-fill with Few Items',
                        difficulty: 'Medium',
                        statement: 'A 1000px-wide grid container has grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) vs repeat(auto-fill, minmax(200px, 1fr)) and contains only 2 child cards (with gap: 0). What is the rendered pixel width of each card under auto-fit vs auto-fill?',
                        sampleInput: 'Container = 1000px, min track = 200px, 2 cards',
                        sampleOutput: 'auto-fit: 500px each | auto-fill: 200px each (with 3 empty 200px tracks)',
                        constraints: '5 tracks of 200px fit in 1000px',
                        hint: 'auto-fill reserves 5 tracks of 200px (leaving 3 empty); auto-fit collapses the 3 empty tracks to 0px and expands the 2 occupied 1fr tracks to 1000 / 2 = 500px.'
                    },
                    {
                        title: 'Overlap Text Caption Over Hero Image Without position: absolute',
                        difficulty: 'Easy',
                        statement: 'Using CSS Grid on a <figure class="hero-stack"> containing an <img> and a <figcaption>, stack both elements into the exact same grid cell so the caption overlays the bottom of the image without using position: absolute.',
                        sampleInput: '<figure class="hero-stack"><img /><figcaption>Caption</figcaption></figure>',
                        sampleOutput: 'Both children occupy grid-area: 1 / 1',
                        constraints: 'Pure CSS Grid',
                        hint: 'Set display: grid on .hero-stack and grid-area: 1 / 1 on both img and figcaption, with align-self: end on figcaption.'
                    }
                ]
            },
            {
                chapterNumber: 7,
                title: 'Responsive Design, Mobile-First Media Queries & Container Queries',
                duration: '15 min read',
                difficulty: 'Intermediate',
                summary: 'Combine mobile-first @media queries, user preference queries (prefers-reduced-motion, prefers-color-scheme), and @container queries.',
                overview: `Mobile-First Responsive Design writes base CSS styles for narrow mobile screens first, and progressively layers on multi-column enhancements for larger screens using @media (min-width: 768px) and @media (min-width: 1024px).

While @media queries inspect the entire browser viewport width, modern CSS Container Queries (@container) allow a reusable component (like a Metric Card or Chapter Widget) to adapt its layout based on the actual width of its parent container (container-type: inline-size)—whether placed in a narrow 280px sidebar or a wide 900px main panel!`,
                keyPoints: [
                    'Modern CSS range syntax @media (width >= 768px) is cleaner and less error-prone than min-width / max-width.',
                    'Always respect @media (prefers-reduced-motion: reduce) to disable dizzying animations for users with vestibular sensitivities.',
                    'Use @media (hover: hover) and (pointer: fine) before applying complex hover effects that get stuck on touchscreens.',
                    'Declare container-type: inline-size on a wrapper element to query its width with @container (width >= 480px).'
                ],
                diagramTitle: 'Viewport @media Queries vs Component @container Queries',
                diagramSteps: [
                    'Base Styles: Mobile Single-Column Default',
                    '@media (width >= 768px) -> Page Shell Splits to Sidebar + Main',
                    '.widget-slot { container-type: inline-size; }',
                    '@container (width >= 420px) -> Card Switches Vertical to Horizontal',
                    '@media (prefers-reduced-motion: reduce) -> Instant Transitions'
                ],
                graphTitle: 'Component Reusability Across Layouts: @container vs @media',
                graphMetricLabel: 'Context Adaptability Score (%)',
                graphData: [
                    { label: '@container (width >= 400px) Component Query', value: 98, displayValue: '98% Context-Aware', note: 'Works in sidebar, modal, or main grid' },
                    { label: 'Intrinsic Grid auto-fit + clamp()', value: 94, displayValue: '94% Fluid', note: 'Zero breakpoint jumps' },
                    { label: 'Viewport-Only @media (min-width: 1024px)', value: 52, displayValue: '52% Rigid', note: 'Breaks if component is inside a narrow column on desktop' }
                ],
                syntaxSummaryCode: `/* 1. Component Container Query */
.card-slot {
    container-type: inline-size;
    container-name: card;
}

.profile-card {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

@container card (width >= 420px) {
    .profile-card {
        flex-direction: row;
        align-items: center;
    }
}

/* 2. Accessibility & User Preference Media Queries */
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}`,
                syntaxTable: [
                    { construct: 'Range Media Query', syntax: '@media (768px <= width < 1024px) { ... }', description: 'Modern mathematical range syntax for tablet viewports.' },
                    { construct: 'Container Context', syntax: 'container-type: inline-size;', description: 'Registers element as a size query container for descendants.' },
                    { construct: 'Container Rule', syntax: '@container (width >= 450px) { ... }', description: 'Applies styles when nearest container ancestor is >= 450px wide.' },
                    { construct: 'Reduced Motion', syntax: '@media (prefers-reduced-motion: reduce)', description: 'Detects OS accessibility setting to minimize motion effects.' }
                ],
                examples: [
                    {
                        title: 'Print Stylesheet Optimization (@media print) for Certificates & Reports',
                        code: `@media print {
    /* Hide navigation chrome when printing certificates or reports */
    .sidebar, .navbar, .no-print {
        display: none !important;
    }
    body, .report-container {
        background: #ffffff !important;
        color: #000000 !important;
        margin: 0;
        box-shadow: none;
    }
    .certificate-page {
        break-inside: avoid;
    }
}`,
                        output: `[Print / Save as PDF] -> Strips sidebar & navbars, forces crisp black-on-white, prevents page-break splits`,
                        explanation: '@media print lets users export clean PDF reports directly via window.print() without UI clutter.'
                    }
                ],
                problems: [
                    {
                        title: 'Convert Legacy max-width Overlap Media Queries to Clean Range Syntax',
                        difficulty: 'Easy',
                        statement: 'Two legacy rules @media (max-width: 768px) and @media (min-width: 768px) both fire simultaneously at exactly 768px width! Rewrite the mobile rule using modern CSS range syntax so there is zero overlap at 768px.',
                        sampleInput: 'Breakpoint = 768px',
                        sampleOutput: '@media (width < 768px) and @media (width >= 768px)',
                        constraints: 'Mutually exclusive at 768.0px',
                        hint: 'Use strict inequality @media (width < 768px) for mobile and @media (width >= 768px) for tablet/desktop.'
                    },
                    {
                        title: 'Build a Self-Adapting Stat Widget with @container',
                        difficulty: 'Easy',
                        statement: 'Write the CSS for a .stat-container wrapper and a .stat-box child that stacks vertically by default and switches to a 2-column grid whenever .stat-container is at least 360px wide.',
                        sampleInput: 'Wrapper width toggles between 260px and 480px',
                        sampleOutput: '1 column at 260px, 2 columns at 480px',
                        constraints: 'Use container-type: inline-size',
                        hint: 'Set container-type: inline-size on .stat-container and @container (width >= 360px) { .stat-box { grid-template-columns: 1fr 1fr; } }.'
                    }
                ]
            },
            {
                chapterNumber: 8,
                title: 'Transitions, Keyframe Animations & 60fps GPU Compositor Layering',
                duration: '15 min read',
                difficulty: 'Intermediate',
                summary: 'Create silky 60fps micro-interactions by animating only GPU-composited properties (transform and opacity) instead of layout properties.',
                overview: `To render smooth animations at 60 frames per second (or 120Hz on ProMotion displays), the browser has less than 16.6 milliseconds per frame. The browser rendering pipeline has three stages:
1. Layout (Reflow): Computes geometry (width, height, top, left, margin).
2. Paint (Repaint): Fills pixels (background-color, box-shadow, color, border-radius).
3. Composite (GPU Thread): Combines painted layers on the GPU (transform and opacity).

Golden Performance Rule: Animating width, height, top, left, or margin forces a full main-thread Layout + Paint + Composite on every single frame (causing jank). Animating transform (translate, scale, rotate) and opacity skips Layout and Paint completely and runs directly on the GPU compositor thread!`,
                keyPoints: [
                    'Only animate transform (translate3d, scale, rotate) and opacity for guaranteed 60fps/120fps GPU animations.',
                    'Instead of animating width: 0 -> 100% on a progress bar, animate transform: scaleX(0) -> scaleX(1) with transform-origin: left!',
                    'Instead of animating top: 10px -> 0px on hover, animate transform: translateY(-4px).',
                    'Use cubic-bezier(0.22, 1, 0.36, 1) for natural spring-like ease-out deceleration.'
                ],
                diagramTitle: 'Browser Rendering Pipeline: Layout Thrashing vs GPU Compositor',
                diagramSteps: [
                    'BAD: Animate width/top/margin -> Reflow + Repaint + Composite (Main Thread Jank)',
                    'GOOD: Animate transform / opacity -> Skips Reflow & Repaint!',
                    'Promoted GPU Texture Layer',
                    '120Hz Hardware Compositor Interpolation'
                ],
                graphTitle: 'Per-Frame CPU Main-Thread Cost During 60fps Animation',
                graphMetricLabel: 'Frame Processing Time (ms — Budget is 16.6ms)',
                graphData: [
                    { label: 'GPU Composited transform: translateY() & opacity', value: 6, displayValue: '0.4 ms (Smooth 120 FPS)', note: 'Zero main-thread layout or paint' },
                    { label: 'Paint-Only background-color / box-shadow transition', value: 42, displayValue: '6.8 ms (60 FPS)', note: 'Skips layout, triggers layer repaint' },
                    { label: 'Layout-Triggering top / left / width / height animation', value: 100, displayValue: '24.5 ms (Dropped Frames / Jank!)', note: 'Recalculates DOM tree geometry every frame' }
                ],
                syntaxSummaryCode: `/* 1. GPU-Accelerated Card Hover Micro-Interaction */
.interactive-card {
    transition:
        transform 220ms cubic-bezier(0.22, 1, 0.36, 1),
        box-shadow 220ms ease;
}

.interactive-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 24px -8px rgba(15, 23, 42, 0.12);
}

/* 2. GPU-Composited Progress Bar Fill via scaleX */
.progress-fill {
    transform-origin: left center;
    transform: scaleX(var(--progress-ratio, 0.75));
    transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1);
}

/* 3. Keyframe Skeleton Shimmer */
@keyframes pulse-opacity {
    0%, 100% { opacity: 1; }
    50%      { opacity: 0.45; }
}
.skeleton {
    animation: pulse-opacity 1.6s ease-in-out infinite;
}`,
                syntaxTable: [
                    { construct: 'Smooth Transition', syntax: 'transition: transform 200ms ease-out, opacity 200ms;', description: 'Interpolates specific properties without transition: all overhead.' },
                    { construct: 'GPU Translate/Scale', syntax: 'transform: translate3d(0, -4px, 0) scale(1.02);', description: 'Moves and scales element on the GPU compositor thread.' },
                    { construct: 'Keyframe Retain', syntax: 'animation: fadeIn 300ms ease-out forwards;', description: 'forwards retains the 100% keyframe styles after animation ends.' },
                    { construct: 'Grid Height Collapse', syntax: 'grid-template-rows: 0fr -> 1fr;', description: 'Modern CSS trick to animate height: 0 to auto smoothly.' }
                ],
                examples: [
                    {
                        title: 'Animating height: 0 to height: auto Smoothly Using CSS Grid 0fr -> 1fr',
                        code: `.accordion-panel {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 280ms cubic-bezier(0.22, 1, 0.36, 1);
}

.accordion-panel.is-open {
    grid-template-rows: 1fr;
}

.accordion-inner {
    overflow: hidden;
}`,
                        output: `Smoothly animates dynamic content height from 0 to auto without JavaScript offsetHeight measurements!`,
                        explanation: 'Transitioning grid-template-rows from 0fr to 1fr with an overflow: hidden child solves the classic CSS height: auto transition limitation.'
                    }
                ],
                problems: [
                    {
                        title: 'Refactor Janky Drawer Animation from left: -300px to GPU Transform',
                        difficulty: 'Easy',
                        statement: 'A sidebar drawer currently animates left: -300px to left: 0px using transition: all 0.3s, dropping frames on mobile. Rewrite it using GPU-accelerated transform.',
                        sampleInput: '.drawer { left: -300px; transition: all 0.3s; } .drawer.open { left: 0; }',
                        sampleOutput: 'left: 0; transform: translateX(-100%) -> transform: translateX(0);',
                        constraints: 'Never use transition: all',
                        hint: 'Fix the drawer at left: 0; top: 0; and transition only transform: translateX(-100%) to transform: translateX(0).'
                    },
                    {
                        title: 'Staggered List Entrance Animation Using CSS Custom Property --i',
                        difficulty: 'Easy',
                        statement: 'Given list items <li style="--i: 0">, <li style="--i: 1">, write a single CSS animation-delay rule using calc() so each item delays by 60ms * --i.',
                        sampleInput: '--i = 0, 1, 2, 3',
                        sampleOutput: 'animation-delay: calc(var(--i, 0) * 60ms);',
                        constraints: 'Pure CSS calc()',
                        hint: 'Use animation-delay: calc(var(--i, 0) * 60ms); with animation-fill-mode: both;.'
                    }
                ]
            },
            {
                chapterNumber: 9,
                title: 'Pseudo-Elements, Selectors, Counters, Gradients & Visual Filters',
                duration: '14 min read',
                difficulty: 'Intermediate',
                summary: 'Use ::before/::after decorative layers, CSS counters, backdrop-filter glassmorphism, and structural pseudo-classes.',
                overview: `CSS Pseudo-elements (::before, ::after, ::marker, ::selection, ::placeholder) let you attach decorative visual layers or generated content without cluttering the HTML DOM. Every ::before or ::after rule requires the content property (e.g., content: "";).

Modern CSS also provides hardware-accelerated visual effects:
- backdrop-filter: blur(12px) saturates and blurs background content behind translucent sticky headers or modals.
- Pure CSS Counters (counter-reset, counter-increment, content: counter(step)) automatically number steps, code lines, and chapters purely in CSS.`,
                keyPoints: [
                    '::before and ::after will NOT render unless content: "" (or a string/counter) is declared.',
                    'Screen readers may announce non-empty content: "text" in ::before/::after—never put critical semantic content inside pseudo-elements.',
                    ':nth-child(2n) or :nth-child(even) zebra-stripes table rows; :nth-child(3n + 1) targets every 3rd item starting at 1.',
                    'box-shadow supports multiple comma-separated layers (e.g., a crisp 1px border ring plus a soft ambient elevation shadow).'
                ],
                diagramTitle: 'DOM Element with ::before & ::after Virtual Children',
                diagramSteps: [
                    '<button class="badge"> Element Box',
                    '::before Virtual First Child (Icon / Dot)',
                    'Actual DOM Text Node Content',
                    '::after Virtual Last Child (Tooltip / Underline)',
                    'backdrop-filter: blur(12px) Glass Layer'
                ],
                graphTitle: 'Selector Matching Efficiency in Browser Style Engine (Right-to-Left)',
                graphMetricLabel: 'Style Recalculation Speed (Higher is faster)',
                graphData: [
                    { label: 'Single Flat Class (.chapter-card)', value: 98, displayValue: 'O(1) Hash Lookup', note: 'Browsers match selectors right-to-left!' },
                    { label: 'Direct Child Combinator (.nav > .nav-link)', value: 90, displayValue: 'O(1) Parent Check', note: 'Checks immediate parent only' },
                    { label: 'Deep Universal Descendant (.app div ul li a *)', value: 25, displayValue: 'O(Depth) Tree Walk', note: 'Walks entire ancestor chain on every node' }
                ],
                syntaxSummaryCode: `/* 1. Automatic Pure-CSS Step Numbering via Counters */
.steps-list {
    counter-reset: step-counter;
}

.step-item::before {
    counter-increment: step-counter;
    content: "0" counter(step-counter);
    font-weight: 800;
    color: #0284c7;
}

/* 2. Pulsing Live Status Dot via ::before */
.status-live::before {
    content: "";
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 9999px;
    background: #10b981;
    margin-right: 6px;
}

/* 3. Multi-Layer Elevation Shadow */
.elevated-surface {
    box-shadow:
        0 1px 2px rgba(15, 23, 42, 0.06),
        0 12px 32px -8px rgba(15, 23, 42, 0.10);
}`,
                syntaxTable: [
                    { construct: 'Pseudo-Element', syntax: '.badge::before { content: ""; ... }', description: 'Inserts virtual first-child box inside element for decorative styling.' },
                    { construct: 'Zebra Striping', syntax: 'tbody tr:nth-child(even) { background: #f8fafc; }', description: 'Styles every even-numbered row in a table body.' },
                    { construct: 'Glass Blur', syntax: 'backdrop-filter: blur(12px) saturate(150%);', description: 'Applies frosted-glass blur to content behind translucent element.' },
                    { construct: 'CSS Counter', syntax: 'counter-increment: line; content: counter(line);', description: 'Auto-increments and renders sequential numbers in CSS.' }
                ],
                examples: [
                    {
                        title: 'Pure CSS Numbered Code Line Gutter Using CSS Counters',
                        code: `pre.numbered-code {
    counter-reset: code-line;
}

pre.numbered-code .line::before {
    counter-increment: code-line;
    content: counter(code-line);
    display: inline-block;
    width: 2.5rem;
    padding-right: 0.75rem;
    text-align: right;
    color: #64748b;
    user-select: none; /* Prevents line numbers from being copied! */
}`,
                        output: `  1  #include <stdio.h>
  2  int main(void) {
  3      return 0;
  4  }  (Copying code copies only source text, not line numbers!)`,
                        explanation: 'Because ::before generated content with user-select: none is excluded from clipboard selection, users can copy-paste code cleanly.'
                    }
                ],
                problems: [
                    {
                        title: 'Write an :nth-child Formula to Select Items 4 Through 8 Only',
                        difficulty: 'Medium',
                        statement: 'Write a single CSS selector on li elements that matches only the 4th, 5th, 6th, 7th, and 8th items in a list.',
                        sampleInput: 'List of 12 <li> items',
                        sampleOutput: 'li:nth-child(n + 4):nth-child(-n + 8)',
                        constraints: 'Chain two :nth-child pseudo-classes',
                        hint: ':nth-child(n + 4) selects items >= 4, and chaining :nth-child(-n + 8) caps selection at <= 8.'
                    },
                    {
                        title: 'Create an Animated Underline Reveal on Hover Using ::after & scaleX',
                        difficulty: 'Easy',
                        statement: 'Write the CSS for .nav-link and .nav-link::after so a 2px bottom bar smoothly grows from left to right (0% to 100%) on hover using GPU transform.',
                        sampleInput: 'Hover on .nav-link',
                        sampleOutput: '::after scales from scaleX(0) to scaleX(1) with transform-origin: left',
                        constraints: 'Do not animate width',
                        hint: 'Position ::after at bottom: 0; left: 0; right: 0; height: 2px; transform: scaleX(0); transform-origin: left; transition: transform 200ms; and set transform: scaleX(1) on .nav-link:hover::after.'
                    }
                ]
            },
            {
                chapterNumber: 10,
                title: 'CSS Architecture at Scale: Design Tokens, BEM, Utility Systems & Performance',
                duration: '15 min read',
                difficulty: 'Advanced',
                summary: 'Architect maintainable design systems using Design Tokens, BEM vs Utility-First (Tailwind) composition, and content-visibility rendering optimization.',
                overview: `As applications scale to hundreds of components, unstructured CSS suffers from specificity wars and dead-code bloat. Three complementary architectural patterns solve this:
1. Design Tokens (CSS Custom Properties): Centralize spacing scales, color palettes, typography ramps, and border radii in :root.
2. BEM (Block__Element--Modifier) or Scoped Modules: Keep component selectors flat at (0, 1, 0) specificity (.quiz-card__header--active).
3. Utility-First Composition (Tailwind CSS): Composes atomic single-purpose classes directly in templates, capping total production CSS bundle size under 15 KB gzipped regardless of app growth!

For long pages with 50+ sections or cards, CSS content-visibility: auto; contain-intrinsic-size: 400px; instructs the browser to skip layout and painting of off-screen sections until the user scrolls near them—cutting initial render time by up to 70%!`,
                keyPoints: [
                    'content-visibility: auto provides native browser virtualization for long off-screen article sections and lists.',
                    'Keep component selector specificity flat (1–2 classes max) and never nest selectors more than 2 levels deep.',
                    'Avoid @import inside CSS files because it serializes network downloads into a waterfall; use parallel <link rel="stylesheet"> or Vite bundler imports.',
                    'Audit unused CSS and layout shifts in Chrome DevTools Performance & Coverage panels.'
                ],
                diagramTitle: 'Enterprise CSS Architecture & content-visibility Rendering Pipeline',
                diagramSteps: [
                    'Layer 1: Design Tokens (:root --space, --color, --font)',
                    'Layer 2: Reset & Base Defaults (@layer reset, base)',
                    'Layer 3: Reusable Components & Atomic Utilities',
                    'Offscreen Optimization: content-visibility: auto',
                    'Purged & Minified Production Bundle (<15 KB Gzip)'
                ],
                graphTitle: 'Initial Page Render Time for 80-Chapter Long Document',
                graphMetricLabel: 'Initial Rendering Time in Milliseconds (Lower is faster)',
                graphData: [
                    { label: 'With content-visibility: auto on Offscreen Sections', value: 18, displayValue: '28 ms', note: 'Skips layout/paint of offscreen chapters' },
                    { label: 'Standard Full-Document Eager Layout & Paint', value: 96, displayValue: '165 ms', note: 'Lays out all 80 sections upfront' }
                ],
                syntaxSummaryCode: `/* 1. Native Offscreen Rendering Virtualization */
.chapter-section {
    content-visibility: auto;
    contain-intrinsic-size: auto 500px; /* Placeholder height before scroll */
}

/* 2. Clean BEM Component Architecture (Flat 0,1,0 Specificity) */
.code-panel {
    border: 1px solid var(--border-subtle, #e2e8f0);
    border-radius: 0.75rem;
}
.code-panel__header {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem 1rem;
}
.code-panel__badge--success {
    background: #dcfce7;
    color: #047857;
}`,
                syntaxTable: [
                    { construct: 'Offscreen Virtualize', syntax: 'content-visibility: auto; contain-intrinsic-size: 400px;', description: 'Skips layout and painting of off-screen elements until scrolled near.' },
                    { construct: 'Layout Containment', syntax: 'contain: layout paint;', description: 'Isolates internal DOM changes so they do not trigger full-page reflow.' },
                    { construct: 'Scroll Margin', syntax: 'scroll-margin-top: 5rem;', description: 'Prevents sticky navbar from covering anchor #id jump targets!' },
                    { construct: 'Color Mix Token', syntax: 'color-mix(in srgb, var(--brand) 15%, white)', description: 'Generates dynamic tint/shade palettes from a single hex variable.' }
                ],
                examples: [
                    {
                        title: 'Preventing Sticky Header Overlap on Anchor Links with scroll-margin-top',
                        code: `html {
    scroll-behavior: smooth;
}

/* Whenever user clicks <a href="#syntax-ref">, leave 5rem clearance for sticky navbar! */
section[id], h2[id], h3[id] {
    scroll-margin-top: 5rem;
}`,
                        output: `Clicking #syntax-ref smoothly scrolls the heading to 5rem below the viewport top, never hidden under the fixed 4rem navbar!`,
                        explanation: 'scroll-margin-top is a one-line CSS fix for the common bug where sticky headers cover hash-link target headings.'
                    }
                ],
                problems: [
                    {
                        title: 'Calculate WCAG Relative Luminance Contrast Ratio Validity',
                        difficulty: 'Medium',
                        statement: 'Given two pre-computed relative luminance values L1 and L2 (where 0.0 <= L <= 1.0), compute the WCAG contrast ratio (L_lighter + 0.05) / (L_darker + 0.05) and return whether it passes WCAG AA for normal text (>= 4.5) and AAA (>= 7.0).',
                        sampleInput: 'L1 = 1.0 (White #FFFFFF), L2 = 0.07 (Dark Blue #004AAD)',
                        sampleOutput: 'Ratio = 8.75:1 | AA = true | AAA = true',
                        constraints: '0.0 <= L1, L2 <= 1.0',
                        hint: 'Let hi = Math.max(L1, L2) and lo = Math.min(L1, L2); ratio = (hi + 0.05) / (lo + 0.05).'
                    },
                    {
                        title: 'Optimize Long Feed Container with CSS Containment & Scroll Margin',
                        difficulty: 'Easy',
                        statement: 'Write the CSS class .feed-card that enables automatic offscreen rendering virtualization with a 320px intrinsic height placeholder and leaves 80px top scroll clearance for anchor jumps.',
                        sampleInput: '500 feed cards on page',
                        sampleOutput: 'content-visibility: auto; contain-intrinsic-size: auto 320px; scroll-margin-top: 80px;',
                        constraints: 'Valid modern CSS3',
                        hint: 'Combine content-visibility: auto, contain-intrinsic-size: auto 320px, and scroll-margin-top: 80px.'
                    }
                ]
            }
        ]
    },

    /* =========================================================================
       8. OOPs (OBJECT-ORIENTED PROGRAMMING) (10 CHAPTERS)
       ========================================================================= */
    {
        slug: 'oops',
        name: 'OOPs',
        fullName: 'Object-Oriented Programming, SOLID Principles & Design Patterns',
        badge: 'OOP',
        tagline: 'Master the 4 pillars of OOP, UML modeling, SOLID architecture, and Gang of Four (GoF) Design Patterns for interviews.',
        description:
            'A complete language-agnostic and multi-language (Java / C++ / Python) engineering guide covering Classes, Encapsulation, Abstraction, Inheritance, Polymorphism, Association/Composition, SOLID Principles, and Design Patterns.',
        accentColor: '#7C3AED',
        secondaryColor: '#EDE9FE',
        fileExtension: '.oop',
        paradigm: 'Object-Oriented Architecture, SOLID & GoF Design Patterns',
        creatorInfo: 'Alan Kay, Bjarne Stroustrup, James Gosling & Gang of Four (GoF)',
        sortOrder: 8,
        chapters: [
            {
                chapterNumber: 1,
                title: 'OOP Paradigm, Classes vs Objects, Identity, State & Behavior',
                duration: '15 min read',
                difficulty: 'Beginner',
                summary: 'Understand the shift from procedural functions to autonomous objects combining State (attributes), Behavior (methods), and Identity.',
                overview: `Object-Oriented Programming (OOP) models complex software systems as a collection of collaborating Objects rather than a flat sequence of global procedures mutating shared data.
- A Class is a compile-time blueprint or user-defined type specification (occupying zero instance heap memory by itself).
- An Object is a concrete runtime instance of a class allocated in memory (typically on the Heap), possessing three core characteristics:
  1. State: The data stored in its instance fields/attributes (e.g., balance = 5000, usn = "4MT22CS001").
  2. Behavior: The operations and state transitions exposed via its methods (deposit(), submitExam()).
  3. Identity: A unique memory address or reference distinguishing two objects even when their field values are identical.`,
                keyPoints: [
                    'A Class is a blueprint/schema; an Object is a concrete runtime instance allocated in memory.',
                    'Instance members belong to each individual object on the heap; static/class members belong to the class itself and are shared by all instances.',
                    'Every instance method receives an implicit reference to the invoking object (this in Java/C++/JS, self in Python).',
                    'Cohesion measures how focused a class responsibilities are (aim for High Cohesion and Low Coupling).'
                ],
                diagramTitle: 'Class Blueprint vs Heap Object Instances & this Pointer',
                diagramSteps: [
                    'Class Blueprint Student (Schema in Code/Metaspace)',
                    'Instantiation: new Student("Aarav", 9.2)',
                    'Heap Object #1 (0x2000): State [name="Aarav", cgpa=9.2]',
                    'Heap Object #2 (0x2080): State [name="Diya", cgpa=9.5]',
                    'Shared Method Code + Implicit this/self Pointer'
                ],
                graphTitle: 'Architecture Maintainability: High-Cohesion OOP vs Global Procedural State',
                graphMetricLabel: 'Long-Term Modularity & Testability Score',
                graphData: [
                    { label: 'High-Cohesion, Low-Coupling Domain Objects', value: 95, displayValue: '95 / 100', note: 'State invariants protected inside class' },
                    { label: 'Modular Service + Immutable Value Objects', value: 92, displayValue: '92 / 100', note: 'Thread-safe & easy to unit test' },
                    { label: 'Unstructured Global Variables & God Functions', value: 20, displayValue: '20 / 100', note: 'Any function can corrupt shared state' }
                ],
                syntaxSummaryCode: `// Cross-Language Class Blueprint & Object Instantiation (Java / C++ / Python)

// --- JAVA ---
class Student {
    private final String usn;
    private double cgpa;

    public Student(String usn, double cgpa) {
        this.usn = usn;
        this.cgpa = cgpa;
    }
    public boolean isEligible(double cutoff) {
        return this.cgpa >= cutoff;
    }
}

// --- C++ ---
// Student sStack("4MT22CS001", 9.1);                  // Stack allocation
// auto sHeap = std::make_unique<Student>("CS02", 8.8); // Heap via RAII`,
                syntaxTable: [
                    { construct: 'Class Blueprint', syntax: 'class Account { ... }', description: 'Defines the structure (fields) and capabilities (methods) of a type.' },
                    { construct: 'Instance Reference', syntax: 'this (Java/C++/JS) / self (Python)', description: 'Implicit pointer/reference to the current object instance.' },
                    { construct: 'Static Member', syntax: 'static int count; / @staticmethod', description: 'Shared at the class level across all instances.' },
                    { construct: 'Identity vs Value', syntax: 'a == b (Address) vs a.equals(b) (State)', description: 'Distinguishes whether two references point to the same object or equal state.' }
                ],
                examples: [
                    {
                        title: 'State, Behavior & Identity Trace Across Multiple Instances',
                        code: `class ExamSession:
    active_sessions = 0  # Class-level shared attribute

    def __init__(self, key: str, duration_min: int):
        self.key = key                  # Instance state
        self.duration_min = duration_min
        ExamSession.active_sessions += 1

    def extend_time(self, extra_min: int) -> int:
        self.duration_min += extra_min  # Behavior mutating own state
        return self.duration_min

s1 = ExamSession("ETH-101", 45)
s2 = ExamSession("ETH-102", 60)
s1.extend_time(15)
print(f"s1={s1.duration_min}m, s2={s2.duration_min}m | Total={ExamSession.active_sessions}")`,
                        output: `s1=60m, s2=60m | Total=2`,
                        explanation: 'Mutating s1.duration_min affects only s1 instance state, while ExamSession.active_sessions is shared across the class.'
                    }
                ],
                problems: [
                    {
                        title: 'Design an Immutable Money Value Object Class',
                        difficulty: 'Easy',
                        statement: 'Design a Money(long minorUnits, String currency) class where fields cannot be modified after creation. Implement add(Money other) and multiply(int factor) that return brand-new Money instances and throw an error if currencies do not match.',
                        sampleInput: 'Money(5000, "INR").add(Money(2500, "INR"))',
                        sampleOutput: 'Money(7500, "INR") (Rs. 75.00)',
                        constraints: 'Reject adding "INR" to "USD"',
                        hint: 'Mark fields private final, verify this.currency.equals(other.currency), and return new Money(this.minorUnits + other.minorUnits, this.currency).'
                    },
                    {
                        title: 'Track Active & Peak Object Instances Using Static Counters',
                        difficulty: 'Easy',
                        statement: 'Create a Connection class that increments activeCount on construction, updates peakCount = max(peakCount, activeCount), and decrements activeCount when close() is called (idempotently).',
                        sampleInput: 'Open c1, Open c2, Close c1, Open c3, Close c2, Close c3',
                        sampleOutput: 'Active = 0 | Peak Concurrent = 2',
                        constraints: 'Calling close() twice on the same instance must only decrement once',
                        hint: 'Maintain a private boolean isClosed = false; guard inside close().'
                    }
                ]
            },
            {
                chapterNumber: 2,
                title: 'Pillar 1 — Encapsulation, Access Modifiers & Invariant Protection',
                duration: '14 min read',
                difficulty: 'Beginner',
                summary: 'Protect domain invariants through data hiding, access modifiers (private, protected, public), defensive copying, and Tell-Dont-Ask.',
                overview: `Encapsulation is two things working together:
1. Bundling data (state) and the methods that operate on that data into a single cohesive unit (class).
2. Data Hiding (Information Hiding): Restricting direct external access to internal representation (private fields) so that outside code cannot place the object into an invalid or corrupted state.

A common anti-pattern in beginner OOP is creating a class with private fields and then immediately generating public getters and setters for every single field without validation (turning the class into a glorified public struct). True encapsulation enforces Domain Invariants inside behavior methods (e.g., account.withdraw(amount) verifies amount > 0 && amount <= balance) and returns Defensive Copies of internal mutable collections (Collections.unmodifiableList(items)).`,
                keyPoints: [
                    'Never return a direct reference to an internal private mutable List or Array from a getter—return an unmodifiable view or defensive copy!',
                    'Follow the "Tell, Don\'t Ask" principle: tell an object to perform an operation on its own state rather than pulling its state out and mutating it externally.',
                    'Access levels: private (same class only), default/package (same package), protected (same package + subclasses), public (everywhere).',
                    'Law of Demeter (Principle of Least Knowledge): talk only to your immediate friends (avoid train-wreck chains like a.getB().getC().getD().mutate()).'
                ],
                diagramTitle: 'Encapsulation Boundary & Defensive Copy Protection',
                diagramSteps: [
                    'External Caller Invokes batch.enrollStudent(s)',
                    'Public Method Gatekeeper Validates Invariants',
                    'Checks: capacity < max && !isDuplicate(s)',
                    'Mutates private final List<Student> roster',
                    'getRoster() Returns Unmodifiable View (Read-Only)'
                ],
                graphTitle: 'State Corruption Risk by Encapsulation Level',
                graphMetricLabel: 'Invariant Safety Score (Higher is safer)',
                graphData: [
                    { label: 'Private Final Fields + Validated Domain Methods + Unmodifiable Getters', value: 98, displayValue: '98% Invariant-Safe', note: 'Impossible to corrupt from outside' },
                    { label: 'Private Fields with Unchecked Public Setters & Raw List Getters', value: 35, displayValue: '35% Leaky Encapsulation', note: 'Caller can call getList().clear()!' },
                    { label: 'Public Mutable Fields (public int balance;)', value: 10, displayValue: '10% Zero Protection', note: 'Direct negative balance assignment possible' }
                ],
                syntaxSummaryCode: `import java.util.*;

public class BatchCohort {
    private final String batchName;
    private final int maxCapacity;
    private final List<String> enrolledUsns = new ArrayList<>();

    public BatchCohort(String batchName, int maxCapacity) {
        if (maxCapacity <= 0) throw new IllegalArgumentException("Capacity must be > 0");
        this.batchName = Objects.requireNonNull(batchName);
        this.maxCapacity = maxCapacity;
    }

    // Domain behavior enforcing invariants
    public void enroll(String usn) {
        if (enrolledUsns.size() >= maxCapacity) {
            throw new IllegalStateException("Batch is full");
        }
        if (!enrolledUsns.contains(usn)) {
            enrolledUsns.add(usn);
        }
    }

    // Defensive read-only view prevents external .clear() or .add()!
    public List<String> getEnrolledUsns() {
        return Collections.unmodifiableList(enrolledUsns);
    }
}`,
                syntaxTable: [
                    { construct: 'Private State', syntax: 'private final List<Item> items;', description: 'Hides internal representation from external classes and subclasses.' },
                    { construct: 'Protected Hook', syntax: 'protected void onValidate()', description: 'Visible to subclasses for customization but hidden from public callers.' },
                    { construct: 'Defensive Getter', syntax: 'return List.copyOf(internalList);', description: 'Prevents caller from mutating private collection state.' },
                    { construct: 'Property Setter (Python)', syntax: '@score.setter def score(self, val):', description: 'Intercepts attribute assignment with validation logic.' }
                ],
                examples: [
                    {
                        title: 'Fixing a Defensive Copy Vulnerability on Mutable Fields',
                        code: `import java.util.*;

class ExamPaper {
    private final List<String> questions;

    public ExamPaper(List<String> initialQuestions) {
        // 1. Defensive copy on construction so caller cannot mutate their input list later
        this.questions = new ArrayList<>(initialQuestions);
    }

    public List<String> getQuestions() {
        // 2. Return unmodifiable view so caller cannot call getQuestions().clear()
        return Collections.unmodifiableList(this.questions);
    }
}

public class EncapsulationDemo {
    public static void main(String[] args) {
        List<String> external = new ArrayList<>(List.of("Q1", "Q2"));
        ExamPaper paper = new ExamPaper(external);
        external.clear(); // Does NOT affect paper!
        System.out.println("Safe internal questions: " + paper.getQuestions());
    }
}`,
                        output: `Safe internal questions: [Q1, Q2]`,
                        explanation: 'Defensive copying on both constructor input and getter output guarantees 100% encapsulation of mutable collections.'
                    }
                ],
                problems: [
                    {
                        title: 'Spot & Fix 3 Encapsulation Leaks in a ShoppingCart Class',
                        difficulty: 'Easy',
                        statement: 'A ShoppingCart class has public double totalPrice;, a constructor that assigns this.items = itemsRef; directly, and a getter public List<Item> getItems() { return items; }. Fix all 3 encapsulation leaks.',
                        sampleInput: 'External list mutated after cart creation',
                        sampleOutput: 'Cart state remains completely isolated and totalPrice is computed dynamically',
                        constraints: 'Enforce invariants',
                        hint: 'Make fields private, copy the input list in the constructor, return an unmodifiable list from getItems(), and compute getTotalPrice() from items instead of exposing a mutable public field.'
                    },
                    {
                        title: 'Implement a Bounded Temperature Sensor with Invariant Guards',
                        difficulty: 'Easy',
                        statement: 'Create a Thermostat class encapsulating temperatureCelsius clamped strictly between [10.0, 35.0] and exposing getFahrenheit() as a computed read-only property (C * 9/5 + 32).',
                        sampleInput: 'setCelsius(42.0) -> clamped or rejected; setCelsius(25.0) -> getFahrenheit()',
                        sampleOutput: '77.0 °F',
                        constraints: 'Never store redundant fahrenheit field',
                        hint: 'Store only private double celsius; and compute fahrenheit on the fly in getFahrenheit().'
                    }
                ]
            },
            {
                chapterNumber: 3,
                title: 'Constructors, Destructors, Copy Semantics (Shallow vs Deep) & Object Lifecycle',
                duration: '15 min read',
                difficulty: 'Intermediate',
                summary: 'Trace object birth and teardown: default/parameterized/copy constructors, shallow vs deep copying, and RAII vs Garbage Collection.',
                overview: `An object's lifecycle spans three phases: Allocation, Initialization (Constructor), and Deallocation (Destructor or Garbage Collection).
- Constructors initialize invariants at birth. They can be Default (0 args), Parameterized, Copy Constructors (C++ ClassName(const ClassName &other)), or Move Constructors (C++ ClassName(ClassName &&other) noexcept).
- Shallow Copy vs Deep Copy: A default compiler-generated copy copies member values bit-for-bit (Shallow Copy). If an object holds a pointer or reference to a heap array/object, a shallow copy causes both objects to point to the exact same heap buffer—leading to shared-mutation bugs and double-free crashes! A Deep Copy allocates a separate independent copy of all referenced heap objects.`,
                keyPoints: [
                    'Shallow Copy duplicates top-level references (aliasing the same inner heap data); Deep Copy duplicates the entire referenced object graph.',
                    'In C++, destructors (~ClassName()) run deterministically on scope exit (RAII). In Java/Python/JS, the Garbage Collector reclaims unreachable heap objects asynchronously.',
                    'Private constructors are used to prevent direct external instantiation in the Singleton Pattern, Builder Pattern, and Static Utility classes.',
                    'Constructor chaining (this(...) in Java, delegating constructors : Foo(0) in C++) avoids duplicating initialization logic.'
                ],
                diagramTitle: 'Shallow Copy (Shared Alias) vs Deep Copy (Independent Heap)',
                diagramSteps: [
                    'Original Object A -> Points to Heap Buffer [10, 20, 30]',
                    'Shallow Copy B = A -> Points to SAME Buffer [10, 20, 30] (Danger!)',
                    'Deep Copy C = A.deepClone() -> Allocates NEW Buffer [10, 20, 30]',
                    'Mutating C[0] = 99 Leaves Original Object A Untouched'
                ],
                graphTitle: 'Memory & Safety Comparison: Shallow vs Deep vs Copy-On-Write',
                graphMetricLabel: 'Mutation Isolation Safety (%)',
                graphData: [
                    { label: 'Deep Copy (Independent Heap Graph)', value: 100, displayValue: '100% Isolated (O(N) copy)', note: 'Safe for independent mutations' },
                    { label: 'Copy-on-Write / Immutable Persistent Structure', value: 98, displayValue: '98% Safe + O(1) Share', note: 'Clones only when modified' },
                    { label: 'Shallow Copy of Mutable Nested References', value: 25, displayValue: '25% Aliasing Bug Risk', note: 'Mutating copy corrupts original!' }
                ],
                syntaxSummaryCode: `// C++ Deep Copy Constructor & Copy-and-Swap Idiom
#include <algorithm>
#include <iostream>

class IntBuffer {
    size_t size_;
    int *data_;
public:
    explicit IntBuffer(size_t n) : size_(n), data_(new int[n]{0}) {}

    // Deep Copy Constructor (allocates independent heap array!)
    IntBuffer(const IntBuffer &other)
        : size_(other.size_), data_(new int[other.size_]) {
        std::copy(other.data_, other.data_ + size_, data_);
    }

    // Copy Assignment via Copy-and-Swap
    IntBuffer &operator=(IntBuffer other) noexcept {
        std::swap(size_, other.size_);
        std::swap(data_, other.data_);
        return *this;
    }

    ~IntBuffer() { delete[] data_; }
};`,
                syntaxTable: [
                    { construct: 'Parameterized Ctor', syntax: 'Student(String usn, double cgpa)', description: 'Initializes object with required domain dependencies.' },
                    { construct: 'Copy Constructor', syntax: 'Buffer(const Buffer &other)', description: 'Constructs a new object as a copy of an existing object.' },
                    { construct: 'Delegating Ctor', syntax: 'this(defaultA, defaultB);', description: 'Forwards construction to a master canonical constructor.' },
                    { construct: 'Deterministic Dtor', syntax: '~Buffer() { /* release */ }', description: 'C++ destructor invoked automatically when object leaves scope.' }
                ],
                examples: [
                    {
                        title: 'Demonstrating Shallow vs Deep Copy in Python & Java',
                        code: `import copy

class CourseSyllabus:
    def __init__(self, title: str, modules: list[str]):
        self.title = title
        self.modules = modules

orig = CourseSyllabus("DSA", ["Arrays", "Trees"])
shallow = copy.copy(orig)       # Copies outer object, shares .modules list!
deep = copy.deepcopy(orig)      # Recursively copies outer object AND .modules list!

deep.modules.append("Graphs")
print("Original modules after deep mutation:", orig.modules)

shallow.modules.append("Leaked!")
print("Original modules after shallow mutation:", orig.modules)`,
                        output: `Original modules after deep mutation: ['Arrays', 'Trees']
Original modules after shallow mutation: ['Arrays', 'Trees', 'Leaked!']`,
                        explanation: 'copy.copy() performs a shallow copy where shallow.modules and orig.modules reference the same list, whereas copy.deepcopy() clones nested containers recursively.'
                    }
                ],
                problems: [
                    {
                        title: 'Deep Clone a Linked List with Random Pointers',
                        difficulty: 'Medium',
                        statement: 'A linked list of length n is given such that each node contains an additional random pointer, which could point to any node in the list, or null. Construct a deep copy of the list.',
                        sampleInput: '[[7,null],[13,0],[11,4],[10,2],[1,0]]',
                        sampleOutput: 'Deep cloned list with zero pointers pointing to original nodes',
                        constraints: 'O(N) time',
                        hint: 'Use a HashMap<Node, Node> mapping each original node to its newly allocated clone in pass 1, then wire clone.next and clone.random in pass 2 (or interleave cloned nodes in O(1) space).'
                    },
                    {
                        title: 'Trace Constructor & Destructor Execution Order in Inheritance',
                        difficulty: 'Easy',
                        statement: 'Class Child inherits from Parent, and Child contains a member object Engine. When a Child instance is created and later destroyed, in what exact order do the Constructors and Destructors execute?',
                        sampleInput: '{ Child c; }',
                        sampleOutput: 'Ctors: Parent -> Engine -> Child | Dtors: ~Child -> ~Engine -> ~Parent',
                        constraints: 'Standard C++ object lifecycle rules',
                        hint: 'Constructors run from Base class -> Member objects -> Derived class; Destructors always run in the exact reverse order!'
                    }
                ]
            },
            {
                chapterNumber: 4,
                title: 'Pillar 2 — Abstraction: Abstract Classes vs Interfaces & Contract Design',
                duration: '15 min read',
                difficulty: 'Intermediate',
                summary: 'Separate "What an object does" from "How it does it" using Abstract Classes, Interfaces, and API boundary contracts.',
                overview: `Abstraction hides complex internal implementation details and exposes only the essential, high-level behavioral contract to the caller. While Encapsulation is about hiding data ("locking the engine under the hood"), Abstraction is about simplifying the interface ("exposing only the steering wheel and pedals").

In OOP languages, abstraction is achieved through Abstract Classes and Interfaces:
- Use an Abstract Class when subclasses share common identity ("IS-A"), common instance state fields, constructors, and template workflow logic.
- Use an Interface (or pure virtual class in C++ / ABC Protocol in Python) when unrelated classes must fulfill a shared capability contract ("CAN-DO", such as Comparable, Serializable, Runnable, PaymentProcessor) without sharing state.`,
                keyPoints: [
                    'Encapsulation = Data Hiding (implementation security via private); Abstraction = Design Hiding (interface simplicity via abstract/interface).',
                    'An Abstract Class cannot be instantiated directly with new; it can have constructors, instance variables, and both concrete and abstract methods.',
                    'An Interface defines a behavioral contract; a single class can implement multiple interfaces without suffering from the Diamond State problem.',
                    'Program to an Interface (List<String>, Map<K,V>, NotificationGateway), not a concrete implementation (ArrayList, HashMap).'
                ],
                diagramTitle: 'Abstraction Layer: Client -> Interface Contract -> Concrete Engines',
                diagramSteps: [
                    'Caller / Controller Depends ONLY on StorageEngine Interface',
                    'Contract: save(key, bytes), load(key), delete(key)',
                    'Adapter A: S3CloudStorage (AWS SDK Internals Hidden)',
                    'Adapter B: LocalDiskStorage (POSIX File Internals Hidden)',
                    'Adapter C: InMemoryMockStorage (Fast Unit Tests)'
                ],
                graphTitle: 'Abstract Class vs Interface Comparison Matrix',
                graphMetricLabel: 'Feature & Decoupling Capability Score',
                graphData: [
                    { label: 'Interface (Multiple Implementation + Zero State Coupling)', value: 96, displayValue: 'Best for API Contracts', note: 'Any class can implement multiple interfaces' },
                    { label: 'Abstract Base Class (Shared State + Template Hook Methods)', value: 82, displayValue: 'Best for Family Hierarchy', note: 'Single inheritance with shared fields' }
                ],
                syntaxSummaryCode: `// Programming to an Interface Contract (Java)
public interface CodeExecutor {
    ExecutionResult run(String sourceCode, String stdin);
}

// Concrete Implementation 1: Docker Sandbox
public class DockerSandboxExecutor implements CodeExecutor {
    @Override
    public ExecutionResult run(String sourceCode, String stdin) {
        // Complex container orchestration hidden behind 1 method!
        return new ExecutionResult(0, "Passed", 14);
    }
}

// Concrete Implementation 2: In-Memory Test Double
public class MockExecutor implements CodeExecutor {
    @Override
    public ExecutionResult run(String sourceCode, String stdin) {
        return new ExecutionResult(0, "Mock Output", 1);
    }
}`,
                syntaxTable: [
                    { construct: 'Java Interface', syntax: 'public interface Exporter { byte[] export(); }', description: 'Declares pure behavioral contract.' },
                    { construct: 'Java Abstract Class', syntax: 'public abstract class BaseReport { abstract void build(); }', description: 'Partial base class holding shared state and abstract hooks.' },
                    { construct: 'C++ Pure Virtual', syntax: 'virtual void serialize() const = 0;', description: 'Makes a C++ class abstract (cannot be instantiated).' },
                    { construct: 'Python ABC', syntax: 'class Plugin(ABC): @abstractmethod def run(self): ...', description: 'Enforces abstract method implementation in Python subclasses.' }
                ],
                examples: [
                    {
                        title: 'Template Method Pattern Using an Abstract Base Class',
                        code: `from abc import ABC, abstractmethod

class DataExporter(ABC):
    # Concrete Template Method defining the invariant skeleton algorithm
    def export_pipeline(self, records: list[dict]) -> str:
        cleaned = [r for r in records if r.get("active")]
        payload = self.format_records(cleaned)
        return f"HEADER({len(cleaned)} items)\\n{payload}"

    @abstractmethod
    def format_records(self, records: list[dict]) -> str:
        pass

class CsvExporter(DataExporter):
    def format_records(self, records: list[dict]) -> str:
        return "\\n".join(f"{r['usn']},{r['score']}" for r in records)

exporter = CsvExporter()
print(exporter.export_pipeline([
    {"usn": "CS01", "score": 91, "active": True},
    {"usn": "CS02", "score": 40, "active": False}
]))`,
                        output: `HEADER(1 items)
CS01,91`,
                        explanation: 'The abstract base class enforces the filtering and header workflow while delegating only the format step to subclasses.'
                    }
                ],
                problems: [
                    {
                        title: 'Choose Abstract Class vs Interface for Multi-Trait Domain Entities',
                        difficulty: 'Easy',
                        statement: 'You are modeling Birds (Eagle, Penguin, Sparrow), Airplanes, and Drones. Eagles, Sparrows, Airplanes, and Drones can fly(), while Penguins can swim(). Explain why Flyable and Swimmable should be Interfaces rather than a method on an abstract Bird base class.',
                        sampleInput: 'Penguin extends Bird',
                        sampleOutput: 'Bird (Abstract Class) + Flyable / Swimmable (Interfaces)',
                        constraints: 'Avoid forcing Penguin.fly() to throw UnsupportedOperationException',
                        hint: 'Putting fly() on Bird violates the Liskov Substitution Principle for Penguins and prevents non-birds (Airplanes, Drones) from sharing the Flyable contract.'
                    },
                    {
                        title: 'Design a Pluggable Cache Provider Abstraction',
                        difficulty: 'Easy',
                        statement: 'Define a CacheProvider<K, V> interface with get(K), put(K, V), and evict(K), and implement an InMemoryCacheProvider backed by a HashMap so business services never depend on Redis or Memcached directly.',
                        sampleInput: 'cache.put("user:1", "Aarav"); cache.get("user:1")',
                        sampleOutput: '"Aarav"',
                        constraints: 'Program to the CacheProvider interface',
                        hint: 'Inject CacheProvider<String, String> into the service constructor.'
                    }
                ]
            },
            {
                chapterNumber: 5,
                title: 'Pillar 3 — Inheritance, Diamond Problem & Composition Over Inheritance',
                duration: '15 min read',
                difficulty: 'Intermediate',
                summary: 'Explore Single, Multilevel, Hierarchical, and Multiple Inheritance, the Diamond Problem, and why Composition ("HAS-A") beats deep inheritance.',
                overview: `Inheritance allows a Derived class (Subclass) to acquire the properties and behaviors of a Base class (Superclass), modeling an "IS-A" taxonomic relationship.
- Single Inheritance: B -> A
- Multilevel Inheritance: C -> B -> A
- Hierarchical Inheritance: B -> A and C -> A
- Multiple Inheritance: D inherits from both B and C.

The Diamond Problem occurs when B and C both inherit from A, and D inherits from both B and C—creating ambiguity over whether D contains one or two copies of A's state and which overridden method in B or C wins.
- C++ solves this with Virtual Inheritance (class B : virtual public A).
- Java/C# disallow multiple class inheritance entirely, allowing multiple stateless Interfaces instead.
- Python resolves multiple inheritance deterministically using the C3 Linearization Method Resolution Order (ClassName.__mro__).`,
                keyPoints: [
                    'Only use Inheritance when a strict "IS-A" relationship holds and the subclass can safely substitute the base class everywhere.',
                    'The Fragile Base Class Problem: changes to a superclass implementation can unexpectedly break subclasses several levels down.',
                    'Favor Composition over Inheritance ("HAS-A" instead of "IS-A"): assembling objects from small pluggable strategy components allows runtime behavior swapping.',
                    'Mark classes final (Java/C++) when they are not explicitly designed and documented for subclassing.'
                ],
                diagramTitle: 'The Diamond Problem vs Composition ("HAS-A") Component Assembly',
                diagramSteps: [
                    'Diamond: Base A -> (Left B, Right C) -> Bottom D',
                    'C++ Fix: virtual public A | Java Fix: Multiple Interfaces',
                    'Python Fix: C3 Linearization (__mro__)',
                    'Modern Alternative: Composition (Engine + Logger + Storage)'
                ],
                graphTitle: 'Design Coupling & Runtime Flexibility: Inheritance vs Composition',
                graphMetricLabel: 'Runtime Flexibility & Decoupling Score',
                graphData: [
                    { label: 'Composition ("HAS-A" Injected Components)', value: 96, displayValue: '96/100 (Swappable at Runtime)', note: 'Black-box reuse, easy testing' },
                    { label: 'Shallow Inheritance (1 Level Abstract Base)', value: 78, displayValue: '78/100 (Clean Hierarchy)', note: 'Good for strict IS-A taxonomy' },
                    { label: 'Deep Multi-Level Inheritance Tree (4+ Levels)', value: 24, displayValue: '24/100 (Tight Compile-Time Coupling)', note: 'Fragile base class explosion' }
                ],
                syntaxSummaryCode: `// Why Composition Beats Inheritance (Stack Example)
// ANTI-PATTERN: class BadStack<T> extends ArrayList<T>
// (Caller can call stack.add(0, item) or stack.remove(2), breaking LIFO invariant!)

// CORRECT PATTERN: Composition ("HAS-A" private storage)
import java.util.*;

public class SafeStack<T> {
    private final Deque<T> storage = new ArrayDeque<>(); // HAS-A Deque

    public void push(T item) { storage.push(item); }
    public T pop()           { return storage.pop(); }
    public T peek()          { return storage.peek(); }
    public int size()        { return storage.size(); }
}`,
                syntaxTable: [
                    { construct: 'IS-A Inheritance', syntax: 'class Car extends Vehicle (Java) / : public Vehicle (C++)', description: 'Compile-time white-box reuse of base class interface and state.' },
                    { construct: 'HAS-A Composition', syntax: 'private final Engine engine;', description: 'Black-box delegation to an internal component field.' },
                    { construct: 'C++ Virtual Base', syntax: 'class B : virtual public A', description: 'Ensures only a single shared subobject of A exists in a diamond hierarchy.' },
                    { construct: 'Python MRO Inspect', syntax: 'ChildClass.mro() / super().__init__()', description: 'Inspects C3 linearization method resolution order.' }
                ],
                examples: [
                    {
                        title: 'Python C3 Linearization MRO & Cooperative super() in Diamond Hierarchy',
                        code: `class A:
    def ping(self): return ["A"]

class B(A):
    def ping(self): return ["B"] + super().ping()

class C(A):
    def ping(self): return ["C"] + super().ping()

class D(B, C):
    def ping(self): return ["D"] + super().ping()

d = D()
print("Call chain:", " -> ".join(d.ping()))
print("MRO:", [cls.__name__ for cls in D.mro()])`,
                        output: `Call chain: D -> B -> C -> A
MRO: ['D', 'B', 'C', 'A', 'object']`,
                        explanation: 'C3 Linearization ensures every class in a diamond hierarchy is visited exactly once, with base class A visited last.'
                    }
                ],
                problems: [
                    {
                        title: 'Refactor Combinatorial Subclass Explosion Using Composition',
                        difficulty: 'Medium',
                        statement: 'A reporting module has PdfStudentReport, ExcelStudentReport, PdfTrainerReport, ExcelTrainerReport, PdfAttendanceReport, and ExcelAttendanceReport (M * N classes!). Refactor this into M + N classes using Composition (Bridge Pattern).',
                        sampleInput: '3 Report Types x 4 Export Formats',
                        sampleOutput: '3 + 4 = 7 classes instead of 3 * 4 = 12 classes',
                        constraints: 'Adding a new JSON format should require only 1 new class',
                        hint: 'Give the Report base class a composed ReportFormatter formatter field: new StudentReport(new PdfFormatter()).generate().'
                    },
                    {
                        title: 'Explain Why Stack Inheriting From Vector/ArrayList Violates OOP',
                        difficulty: 'Easy',
                        statement: 'In early Java 1.0, java.util.Stack extended java.util.Vector. Identify the exact LIFO invariant violation this caused and write a 10-line composed Stack wrapper that prevents it.',
                        sampleInput: 'stack.insertElementAt(x, 0)',
                        sampleOutput: 'Composition exposes ONLY push(), pop(), peek(), isEmpty()',
                        constraints: 'Hide random-index mutation methods',
                        hint: 'When Stack extends Vector, callers can insert or delete elements at index 0, corrupting the LIFO stack guarantee.'
                    }
                ]
            },
            {
                chapterNumber: 6,
                title: 'Pillar 4 — Polymorphism: Compile-Time Overloading vs Runtime Dynamic Dispatch',
                duration: '16 min read',
                difficulty: 'Intermediate',
                summary: 'Master Ad-hoc Overloading, Parametric Generics, Subtype Overriding, vtable mechanics, Covariant Returns, and Duck Typing.',
                overview: `Polymorphism ("many forms") allows a single symbol or interface to operate across multiple underlying types. Computer science classifies polymorphism into two execution phases:
1. Compile-Time (Static / Early Binding) Polymorphism:
   - Method & Operator Overloading: Multiple functions with the same name but distinct parameter types/counts resolved at compile time.
   - Parametric Polymorphism: C++ Templates and Java Generics.
2. Runtime (Dynamic / Late Binding) Polymorphism:
   - Method Overriding: A subclass provides a specialized implementation of a virtual method defined in its base class or interface. When invoked through a base reference (Shape s = new Circle(); s.draw();), the runtime looks up the concrete object's vtable to execute Circle.draw().`,
                keyPoints: [
                    'Method Overloading CANNOT be resolved by return type alone—parameter types, count, or order must differ!',
                    'Static methods, private methods, and final methods are bound at compile time and CANNOT be dynamically overridden (defining a static method with the same name in a subclass is Method Hiding, not Overriding).',
                    'Covariant Return Types: An overriding method in a subclass can return a more specific subtype of the base method return type.',
                    'Field/Variable access is NEVER polymorphic in Java or C++—only virtual instance methods are dynamically dispatched!'
                ],
                diagramTitle: 'Static Compile-Time Binding vs Dynamic Runtime vtable Dispatch',
                diagramSteps: [
                    'Compile-Time: Overloading + Templates + static/private/final Methods',
                    'Resolved by Declared Reference Type at Compile Time',
                    'Runtime: Overridden Virtual Instance Methods',
                    'Follows Object vptr -> Class vtable Slot at Runtime',
                    'Executes Actual Heap Object Implementation'
                ],
                graphTitle: 'Java / C++ Binding Resolution Rules by Member Kind',
                graphMetricLabel: 'Dispatch Mechanism (0 = Static Compile-Time, 100 = Dynamic Runtime)',
                graphData: [
                    { label: 'Virtual / Overridden Instance Method (base.speak())', value: 100, displayValue: 'Dynamic Runtime (Heap Object Type)', note: 'True runtime polymorphism' },
                    { label: 'Overloaded Method Parameter Resolution', value: 10, displayValue: 'Static Compile-Time (Declared Arg Type)', note: 'Resolved by compiler before execution' },
                    { label: 'static Method / private Method / Instance Field (base.x)', value: 10, displayValue: 'Static Compile-Time (Reference Type)', note: 'Shadowed/Hidden, never overridden!' }
                ],
                syntaxSummaryCode: `// Tricky Interview Case: Virtual Methods vs Static Methods vs Fields in Java
class Base {
    String label = "BaseField";
    static String kind() { return "BaseStatic"; }
    String identify()    { return "BaseVirtual"; }
}

class Derived extends Base {
    String label = "DerivedField";                  // Shadows field
    static String kind() { return "DerivedStatic"; }// Hides static method
    @Override
    String identify()    { return "DerivedVirtual"; }// Overrides virtual method
}

// Base ref = new Derived();
// ref.label      -> "BaseField"      (Fields use reference type!)
// ref.kind()     -> "BaseStatic"     (Statics use reference type!)
// ref.identify() -> "DerivedVirtual" (Instance methods use runtime object type!)`,
                syntaxTable: [
                    { construct: 'Method Overloading', syntax: 'add(int a, int b) vs add(double a, double b)', description: 'Same method name, distinct parameter list (Compile-time).' },
                    { construct: 'Method Overriding', syntax: '@Override public double area() (or C++ override)', description: 'Same signature in subclass replacing base virtual method (Runtime).' },
                    { construct: 'Covariant Return', syntax: 'Base: Shape clone() -> Sub: Circle clone()', description: 'Overridden method returns a narrower subclass of base return type.' },
                    { construct: 'Upcasting', syntax: 'Animal a = new Dog();', description: 'Implicit safe cast from derived instance to base/interface reference.' }
                ],
                examples: [
                    {
                        title: 'Tracing Field Shadowing, Static Hiding, and Virtual Overriding',
                        code: `public class BindingQuiz {
    static class Parent {
        int val = 10;
        static String tag() { return "Parent.tag"; }
        String run()        { return "Parent.run"; }
    }
    static class Child extends Parent {
        int val = 20;
        static String tag() { return "Child.tag"; }
        @Override
        String run()        { return "Child.run"; }
    }

    public static void main(String[] args) {
        Parent p = new Child();
        System.out.println("Field p.val:   " + p.val);
        System.out.println("Static p.tag:  " + p.tag());
        System.out.println("Virtual p.run: " + p.run());
    }
}`,
                        output: `Field p.val:   10
Static p.tag:  Parent.tag
Virtual p.run: Child.run`,
                        explanation: 'This is one of the most frequent technical interview questions: only non-static, non-private instance methods use dynamic runtime dispatch.'
                    }
                ],
                problems: [
                    {
                        title: 'Predict Overloaded Method Resolution with Upcast Reference',
                        difficulty: 'Medium',
                        statement: 'Class Printer defines print(Animal a) and print(Dog d). Given Animal pet = new Dog(); printer.print(pet);, which overloaded method executes and why?',
                        sampleInput: 'Animal pet = new Dog(); printer.print(pet);',
                        sampleOutput: 'print(Animal a) executes!',
                        constraints: 'Overload resolution vs Override resolution',
                        hint: 'Method Overloading is resolved at compile time using the declared reference type of the argument (Animal pet), NOT its runtime heap type!'
                    },
                    {
                        title: 'Replace Conditional Type Switch with Polymorphic Dispatch',
                        difficulty: 'Easy',
                        statement: 'Refactor a function computeBonus(Employee e) that switches on e.type ("MANAGER", "ENGINEER", "INTERN") into a polymorphic Employee hierarchy where adding a "DIRECTOR" role requires zero modifications to existing classes.',
                        sampleInput: 'List of mixed Employee objects',
                        sampleOutput: 'Total payroll bonus computed via e.computeBonus()',
                        constraints: 'Open-Closed Principle compliant',
                        hint: 'Declare abstract double computeBonus() on Employee and override it in Manager, Engineer, and Intern.'
                    }
                ]
            },
            {
                chapterNumber: 7,
                title: 'Object Relationships & UML: Association, Aggregation & Composition',
                duration: '14 min read',
                difficulty: 'Intermediate',
                summary: 'Distinguish Dependency (Uses-A), Association, Weak Aggregation (Shared HAS-A), and Strong Composition (Exclusive Owns-A) in UML.',
                overview: `In Object-Oriented System Design and UML Class Diagrams, relationships between classes are classified by their coupling strength and lifecycle ownership:
1. Dependency ("USES-A" — Dashed Arrow - - ->): Class A temporarily uses Class B as a method parameter or local variable without storing it as a field.
2. Association ("KNOWS-A" — Solid Line ———): Class A holds a reference to Class B (1-to-1, 1-to-Many, or Many-to-Many), such as a Trainer teaching multiple Batches.
3. Aggregation ("Weak HAS-A" — Hollow Diamond ◇———): A whole-part relationship where the part CAN exist independently of the whole. If a Department closes, its Professors still exist.
4. Composition ("Strong OWNS-A" — Filled Black Diamond ◆———): Exclusive lifecycle ownership where the part CANNOT exist without the whole. If a House (or Order) is destroyed, its Rooms (or OrderLineItems) are destroyed with it.`,
                keyPoints: [
                    'Inheritance ("IS-A"): Solid line with hollow triangle arrowhead (———▷).',
                    'Interface Realization: Dashed line with hollow triangle arrowhead (- - -▷).',
                    'Aggregation (Hollow Diamond ◇): Part is injected from outside and survives when the container is destroyed.',
                    'Composition (Filled Diamond ◆): Part is instantiated inside the owner and destroyed when the owner is destroyed.'
                ],
                diagramTitle: 'UML Relationship Spectrum from Weakest to Strongest Ownership',
                diagramSteps: [
                    '1. Dependency (Uses-A: Method Parameter) [- - ->]',
                    '2. Association (Peers: Trainer <-> Batch) [———]',
                    '3. Aggregation (Shared HAS-A: College ◇— Student)',
                    '4. Composition (Exclusive OWNS-A: Exam ◆— QuestionSection)',
                    '5. Inheritance (IS-A: Admin —▷ User)'
                ],
                graphTitle: 'Lifecycle Coupling Strength Across UML Relationships',
                graphMetricLabel: 'Coupling & Ownership Tightness (%)',
                graphData: [
                    { label: 'Dependency (Method Parameter Only)', value: 15, displayValue: '15% (Transient Call)', note: 'Loosest coupling' },
                    { label: 'Association / Aggregation (◇ Injected Reference)', value: 45, displayValue: '45% (Independent Lifecycles)', note: 'Child outlives parent container' },
                    { label: 'Composition (◆ Exclusive Lifecycle Ownership)', value: 78, displayValue: '78% (Bound Lifecycles)', note: 'Child destroyed with parent' },
                    { label: 'Inheritance (—▷ Compile-Time Base Subclassing)', value: 98, displayValue: '98% (Tightest Coupling)', note: 'Exposes protected base internals' }
                ],
                syntaxSummaryCode: `// 1. AGGREGATION (Weak HAS-A: Trainer survives if Batch is deleted)
class Batch {
    private final String batchName;
    private final Trainer assignedTrainer; // Injected from outside!

    public Batch(String batchName, Trainer trainer) {
        this.batchName = batchName;
        this.assignedTrainer = trainer;
    }
}

// 2. COMPOSITION (Strong OWNS-A: Heart is created and destroyed with Human)
class Human {
    private final Heart heart;

    public Human() {
        this.heart = new Heart(); // Owned exclusively; never exposed outside
    }
}`,
                syntaxTable: [
                    { construct: 'Dependency', syntax: 'void export(Printer p) { p.print(this); }', description: 'Uses Printer temporarily during method execution.' },
                    { construct: 'Aggregation (◇)', syntax: 'Library(List<Book> existingBooks)', description: 'Holds references to externally managed objects.' },
                    { construct: 'Composition (◆)', syntax: 'Order() { this.items = new ArrayList<>(); }', description: 'Exclusively owns child objects and their lifecycle.' },
                    { construct: 'Cardinality', syntax: '1..1, 1..*, 0..*, *..*', description: 'UML multiplicity notation for one-to-many and many-to-many links.' }
                ],
                examples: [
                    {
                        title: 'Modeling an Assessment Portal Domain Using Composition & Aggregation',
                        code: `class Question:
    def __init__(self, text: str, points: int):
        self.text = text
        self.points = points

class Exam:
    def __init__(self, title: str, creator_trainer):
        self.title = title
        # Aggregation (◇): Trainer exists independently of this Exam
        self.creator = creator_trainer
        # Composition (◆): Exam exclusively owns its internal Question instances
        self._questions: list[Question] = []

    def add_question(self, text: str, points: int):
        self._questions.append(Question(text, points))
        return len(self._questions)

exam = Exam("C Pointers Assessment", creator_trainer="Jaswanth")
exam.add_question("What does sizeof(void*) return on 64-bit?", 5)
print(f"{exam.title} by {exam.creator}: {len(exam._questions)} question(s)")`,
                        output: `C Pointers Assessment by Jaswanth: 1 question(s)`,
                        explanation: 'If exam is deleted, its composed Question objects are garbage-collected with it, while the aggregated Trainer remains.'
                    }
                ],
                problems: [
                    {
                        title: 'Classify 4 Real-World Relationships into Aggregation vs Composition',
                        difficulty: 'Easy',
                        statement: 'Classify each pair as either Aggregation (◇) or Composition (◆): (1) University and Professor, (2) Browser Window and Tab, (3) Playlist and Song, (4) Database Table and Database Row.',
                        sampleInput: '4 domain pairs',
                        sampleOutput: '(1) Aggregation, (2) Composition, (3) Aggregation, (4) Composition',
                        constraints: 'Test lifecycle independence: "Does B survive if A is deleted?"',
                        hint: 'A Song survives if a Playlist is deleted (Aggregation), whereas a Table Row vanishes if its Database Table is dropped (Composition).'
                    },
                    {
                        title: 'Design a Bidirectional 1-to-Many Department <-> Employee Association Safely',
                        difficulty: 'Medium',
                        statement: 'Write Department and Employee classes where calling dept.assign(emp) automatically sets emp.department = dept AND removes emp from their old department so bidirectional links never become inconsistent.',
                        sampleInput: 'deptA.assign(emp); deptB.assign(emp);',
                        sampleOutput: 'deptA.size === 0, deptB.size === 1, emp.department === deptB',
                        constraints: 'Maintain referential integrity',
                        hint: 'In assign(emp), if emp.department != null, first remove emp from emp.department.employees before adding to this.employees.'
                    }
                ]
            },
            {
                chapterNumber: 8,
                title: 'SOLID Architecture Principles in Depth (SRP, OCP, LSP, ISP, DIP)',
                duration: '18 min read',
                difficulty: 'Advanced',
                summary: 'Master Robert C. Martin’s 5 SOLID object-oriented design principles with concrete violations and refactored production code.',
                overview: `The five SOLID principles are the gold standard for designing maintainable, extensible, and testable object-oriented systems:
- S — Single Responsibility Principle (SRP): A class should have one, and only one, reason to change (one actor/domain responsibility). Separate persistence, business logic, and formatting into distinct classes.
- O — Open/Closed Principle (OCP): Software entities should be Open for extension (adding new behaviors via new classes/strategies) but Closed for modification (no editing existing tested if/else chains).
- L — Liskov Substitution Principle (LSP): Subtypes must be substitutable for their base types without breaking program correctness or expectations (e.g., Square inheriting from mutable Rectangle violates LSP when setWidth() silently mutates height!).
- I — Interface Segregation Principle (ISP): Clients should not be forced to depend on fat interfaces with methods they do not use. Split fat interfaces into focused role interfaces (Readable, Writable).
- D — Dependency Inversion Principle (DIP): High-level policy modules should not depend on low-level implementation details; both should depend on abstractions (Interfaces) injected via Dependency Injection.`,
                keyPoints: [
                    'SRP: Split a God Class (OrderProcessor that validates, charges Stripe, saves SQL, and sends SMTP email) into focused collaborators.',
                    'OCP: Use polymorphic Strategy / Plugin interfaces so adding a new payment gateway or grading rule requires 0 edits to existing core code.',
                    'LSP Classic Interview Trap: A mutable Square extending a mutable Rectangle violates LSP because r.setWidth(5); r.setHeight(4); assert r.area() == 20 fails on Square!',
                    'DIP: Pass abstractions (interfaces) into constructors (Constructor Dependency Injection) instead of calling new MySqlDatabase() inside business logic.'
                ],
                diagramTitle: 'SOLID Architecture & Dependency Inversion (DIP) Flow',
                diagramSteps: [
                    'SRP: 1 Class = 1 Cohesive Responsibility',
                    'OCP: Extend via New Strategy Class, Not If-Else Edits',
                    'LSP: Subclass Honors Base Pre/Post-Conditions',
                    'ISP: Small Role Interfaces (Readable, Printable)',
                    'DIP: High-Level Service -> Interface <- Low-Level Adapter'
                ],
                graphTitle: 'Regression Bug Rate When Adding Features: SOLID vs Monolithic Classes',
                graphMetricLabel: 'Code Stability & Testability Score (%)',
                graphData: [
                    { label: 'SOLID + Constructor Dependency Injection', value: 96, displayValue: '96% Isolated & Testable', note: 'New features added as new classes' },
                    { label: 'Partial OOP with Hardcoded new ConcreteDeps()', value: 52, displayValue: '52% Coupled', note: 'Cannot unit test without live DB/network' },
                    { label: 'God Class Violating SRP, OCP & LSP', value: 18, displayValue: '18% High Regression Risk', note: 'Every edit touches 1,000-line switch' }
                ],
                syntaxSummaryCode: `// 1. Fixing the Rectangle-Square LSP Violation
// Solution: Make both immutable implementations of a common Shape interface!
interface Shape {
    int area();
}
record ImmutableRectangle(int width, int height) implements Shape {
    @Override public int area() { return width * height; }
}
record ImmutableSquare(int side) implements Shape {
    @Override public int area() { return side * side; }
}

// 2. Dependency Inversion Principle (DIP) via Constructor Injection
interface NotificationGateway {
    void notify(String userId, String message);
}

class ExamSubmissionService {
    private final NotificationGateway notifier; // Depends on Abstraction, NOT concrete SmtpClient!

    public ExamSubmissionService(NotificationGateway notifier) {
        this.notifier = notifier;
    }

    public void submit(String userId, int score) {
        notifier.notify(userId, "Assessment submitted. Score: " + score);
    }
}`,
                syntaxTable: [
                    { construct: 'S — SRP', syntax: 'One reason to change per class', description: 'Decouples business rules from persistence and UI formatting.' },
                    { construct: 'O — OCP', syntax: 'Open for extension, Closed for modification', description: 'Add behavior by implementing an interface rather than editing switch blocks.' },
                    { construct: 'L — LSP', syntax: 'Subtypes must honor base behavioral contract', description: 'Never strengthen preconditions or throw UnsupportedOperationException.' },
                    { construct: 'I & D — ISP / DIP', syntax: 'Focused interfaces + Constructor Injection', description: 'Inject small role abstractions into high-level domain services.' }
                ],
                examples: [
                    {
                        title: 'Interface Segregation Principle (ISP) & Dependency Injection in Action',
                        code: `// Violating ISP: Fat Worker interface forces RobotWorker to implement eatLunch()!
// Fixed with ISP: Segregated role interfaces
interface Workable { void work(); }
interface Feedable { void eatLunch(); }

class HumanEngineer implements Workable, Feedable {
    public void work()     { System.out.println("Human writing clean code"); }
    public void eatLunch() { System.out.println("Human taking lunch break"); }
}

class AutomatedBot implements Workable {
    public void work()     { System.out.println("Bot running CI/CD pipeline"); }
}

public class SolidDemo {
    public static void main(String[] args) {
        for (Workable w : java.util.List.of(new HumanEngineer(), new AutomatedBot())) {
            w.work();
        }
    }
}`,
                        output: `Human writing clean code
Bot running CI/CD pipeline`,
                        explanation: 'Segregating Workable and Feedable ensures AutomatedBot never implements dummy methods that throw UnsupportedOperationException.'
                    }
                ],
                problems: [
                    {
                        title: 'Identify & Fix the Liskov Substitution Principle (LSP) Violation',
                        difficulty: 'Medium',
                        statement: 'Class ReadOnlyFile extends File and overrides write(byte[] data) to throw new UnsupportedOperationException("Read-only!"). Explain why this violates LSP and redesign the hierarchy so read-only and read-write files satisfy LSP and ISP.',
                        sampleInput: 'void saveLog(File f) { f.write(bytes); } called with ReadOnlyFile',
                        sampleOutput: 'ReadableStream interface (read()) + WritableStream interface (write())',
                        constraints: 'Compile-time prevention of write() on read-only streams',
                        hint: 'Split capabilities into ReadableFile and WritableFile interfaces (or make MutableFile extend ReadableFile) so saveLog(WritableFile f) rejects ReadOnlyFile at compile time!'
                    },
                    {
                        title: 'Refactor Hardcoded PaymentProcessor to Satisfy OCP and DIP',
                        difficulty: 'Easy',
                        statement: 'An OrderService instantiates new RazorpayClient() inside checkout() and uses if (mode == "UPI") ... else if (mode == "CARD"). Refactor it using a PaymentMethod interface and Constructor Injection.',
                        sampleInput: 'OrderService(new UpiPaymentMethod()).checkout(500)',
                        sampleOutput: 'Paid 500 via UPI (0 if/else branches in OrderService)',
                        constraints: 'Satisfy both OCP and DIP',
                        hint: 'Pass PaymentMethod paymentMethod into OrderService constructor and call paymentMethod.charge(amount).'
                    }
                ]
            },
            {
                chapterNumber: 9,
                title: 'Creational & Structural Design Patterns (Singleton, Factory, Builder, Adapter, Decorator)',
                duration: '16 min read',
                difficulty: 'Advanced',
                summary: 'Master GoF Creational patterns (Thread-Safe Singleton, Factory Method, Builder) and Structural patterns (Adapter, Decorator, Facade, Proxy).',
                overview: `The Gang of Four (GoF) Design Patterns catalog proven object-oriented solutions to recurring architectural challenges:
1. Creational Patterns (Object Instantiation):
   - Singleton: Ensures a class has only one global instance (e.g., ConfigurationPool, Logger) using Bill Pugh's Static Holder idiom or an Enum Singleton.
   - Factory Method / Abstract Factory: Decouples callers from concrete class constructors by centralizing object creation.
   - Builder: Constructs complex immutable objects step-by-step via fluent chaining, eliminating telescoping constructor anti-patterns.
2. Structural Patterns (Object Composition):
   - Adapter: Converts an incompatible third-party interface into the target interface expected by your domain.
   - Decorator: Wraps an object dynamically to layer on cross-cutting behaviors (compression, encryption, caching, logging) while implementing the exact same interface.`,
                keyPoints: [
                    'In Java, the cleanest thread-safe Singleton is either the Initialization-on-Demand Holder Idiom or a 1-element enum Singleton.',
                    'Use the Builder Pattern whenever a constructor has more than 4 parameters or optional configuration flags.',
                    'Adapter changes an object interface to match what the client expects; Decorator keeps the same interface and enhances behavior; Proxy keeps the same interface and controls access.',
                    'Java java.io.BufferedReader(new InputStreamReader(in)) is a classic real-world example of the Decorator Pattern!'
                ],
                diagramTitle: 'GoF Creational (Factory / Builder) & Structural (Decorator / Adapter) Flow',
                diagramSteps: [
                    'Builder: new Exam.Builder("DSA").duration(60).proctored(true).build()',
                    'Factory: NotificationFactory.create("EMAIL") -> EmailSender',
                    'Adapter: ThirdPartySdk -> PaymentGatewayTarget',
                    'Decorator: LoggingGateway(RetryGateway(CoreGateway))'
                ],
                graphTitle: 'Pattern Selection Guide by Architectural Goal',
                graphMetricLabel: 'Applicability & Interview Frequency (%)',
                graphData: [
                    { label: 'Builder Pattern (Complex Immutable Configs)', value: 96, displayValue: '96% Frequency', note: 'Eliminates telescoping constructors' },
                    { label: 'Factory / Abstract Factory (Decoupled Creation)', value: 92, displayValue: '92% Frequency', note: 'Centralizes polymorphic instantiation' },
                    { label: 'Decorator & Adapter (Wrapping & Integration)', value: 88, displayValue: '88% Frequency', note: 'Dynamic behavior composition' },
                    { label: 'Thread-Safe Singleton (Shared Pool / Registry)', value: 85, displayValue: '85% Frequency', note: 'Double-checked locking or Holder idiom' }
                ],
                syntaxSummaryCode: `// 1. Thread-Safe Initialization-on-Demand Holder Singleton (Zero Lock Overhead!)
public final class ConfigRegistry {
    private ConfigRegistry() {}

    private static final class Holder {
        static final ConfigRegistry INSTANCE = new ConfigRegistry();
    }

    public static ConfigRegistry getInstance() {
        return Holder.INSTANCE; // Loaded lazily & thread-safely by JVM ClassLoader!
    }
}

// 2. Decorator Pattern: Layering Caching & Logging Over a DataService
interface DataService {
    String fetch(String key);
}

class LoggingDecorator implements DataService {
    private final DataService delegate;
    public LoggingDecorator(DataService delegate) { this.delegate = delegate; }

    @Override
    public String fetch(String key) {
        System.out.println("[LOG] Fetching key=" + key);
        return delegate.fetch(key);
    }
}`,
                syntaxTable: [
                    { construct: 'Holder Singleton', syntax: 'private static class Holder { static final S INST = new S(); }', description: 'Lazy, lock-free thread-safe singleton guaranteed by JVM class initialization.' },
                    { construct: 'Fluent Builder', syntax: 'new Config.Builder().host("...").port(8080).build()', description: 'Constructs immutable object with readable named fluent setters.' },
                    { construct: 'Adapter Wrapper', syntax: 'class LegacyAdapter implements TargetInterface', description: 'Translates calls from TargetInterface to an incompatible Adaptee.' },
                    { construct: 'Decorator Stack', syntax: 'new EncryptedStream(new CompressedStream(new FileStream()))', description: 'Wraps component recursively to add layered responsibilities.' }
                ],
                examples: [
                    {
                        title: 'Composable Coffee / Pricing Decorator Chain in Python',
                        code: `from abc import ABC, abstractmethod

class Subscription(ABC):
    @abstractmethod
    def cost(self) -> int: pass
    @abstractmethod
    def label(self) -> str: pass

class BasePortalPlan(Subscription):
    def cost(self) -> int: return 1000
    def label(self) -> str: return "Base LMS"

class AddOnDecorator(Subscription):
    def __init__(self, wrapped: Subscription):
        self._wrapped = wrapped

class Code2CareerAddOn(AddOnDecorator):
    def cost(self) -> int: return self._wrapped.cost() + 500
    def label(self) -> str: return self._wrapped.label() + " + Code2Career Compiler"

class ProctoringAddOn(AddOnDecorator):
    def cost(self) -> int: return self._wrapped.cost() + 300
    def label(self) -> str: return self._wrapped.label() + " + AI Proctoring"

plan = ProctoringAddOn(Code2CareerAddOn(BasePortalPlan()))
print(f"{plan.label()} => Rs. {plan.cost()}")`,
                        output: `Base LMS + Code2Career Compiler + AI Proctoring => Rs. 1800`,
                        explanation: 'Decorators wrap any Subscription instance transparently, allowing add-ons to be combined in any order at runtime.'
                    }
                ],
                problems: [
                    {
                        title: 'Why Double-Checked Locking Singleton Needs volatile in Java',
                        difficulty: 'Hard',
                        statement: 'In a Double-Checked Locking Singleton (if (instance == null) { synchronized(Cls.class) { if (instance == null) instance = new Cls(); } }), explain why private static volatile Cls instance; MUST be marked volatile.',
                        sampleInput: 'Thread A initializes instance while Thread B reads instance',
                        sampleOutput: 'volatile prevents instruction reordering of memory allocation vs constructor execution',
                        constraints: 'Java Memory Model (JMM) happens-before guarantee',
                        hint: 'instance = new Cls() is 3 steps: (1) allocate memory, (2) run constructor, (3) assign pointer. Without volatile, the CPU/JIT can reorder (3) before (2), causing Thread B to read a non-null but partially uninitialized object!'
                    },
                    {
                        title: 'Build an Adapter for a Third-Party Analytics SDK',
                        difficulty: 'Easy',
                        statement: 'Your application expects AnalyticsTracker with trackEvent(String name, Map<String, String> props), but a new vendor library exposes VendorTelemetry.record(String payloadJson). Write an Adapter class bridging the two.',
                        sampleInput: 'adapter.trackEvent("exam_submit", Map.of("usn", "CS01"))',
                        sampleOutput: 'VendorTelemetry.record called with serialized JSON',
                        constraints: 'Do not modify existing application callers',
                        hint: 'Create VendorAnalyticsAdapter implements AnalyticsTracker holding a private final VendorTelemetry vendor field.'
                    }
                ]
            },
            {
                chapterNumber: 10,
                title: 'Behavioral Design Patterns & Low-Level Design (LLD) Case Studies',
                duration: '18 min read',
                difficulty: 'Advanced',
                summary: 'Master Observer, Strategy, Command, State, and Iterator patterns, and apply OOP + SOLID to real Low-Level Design (LLD) interview problems.',
                overview: `Behavioral Design Patterns govern how objects communicate and distribute responsibilities at runtime:
- Strategy Pattern: Encapsulates interchangeable algorithms (e.g., RankingMode: AverageScoreStrategy vs CumulativeScoreStrategy, or PaymentMode) behind a common interface and swaps them dynamically.
- Observer (Pub/Sub) Pattern: Defines a 1-to-Many dependency so when a Subject changes state (e.g., Trainer starts live exam session), all subscribed Observers (student waiting room clients, audit logger, notification bell) are notified automatically.
- State Pattern: Allows an object (e.g., ExamAttempt: Draft -> Started -> Paused -> Completed) to alter its behavior when its internal state transitions, eliminating sprawling state flags.

In Low-Level Design (LLD) interviews (Parking Lot, Online Assessment Engine, Elevator Controller, Rate Limiter), start by clarifying requirements, identifying core domain entities, applying SOLID + Strategy/Observer patterns, and ensuring thread safety.`,
                keyPoints: [
                    'Strategy Pattern replaces conditional algorithm selection; State Pattern manages legal lifecycle transitions (Draft -> Live -> Closed).',
                    'Observer Pattern decouples event producers from event consumers (e.g., WebSockets, DOM addEventListener, RxJS).',
                    'In LLD interviews, follow the 4-Step Framework: (1) Clarify Use Cases -> (2) Core Entities & UML Relationships -> (3) Interfaces & Design Patterns -> (4) Concurrency & Edge Cases.',
                    'Always separate Entity Models (Data + Invariants) from Service Orchestrators and Repository/DAO Interfaces.'
                ],
                diagramTitle: 'LLD Architecture: Online Assessment & Code2Career Evaluation Engine',
                diagramSteps: [
                    'ExamSession (State Pattern: Waiting -> Live -> Ended)',
                    'Observer Pattern: Notifies Subscribed Student Clients',
                    'QuestionEvaluator (Strategy: MCQGradingStrategy vs CodeTestCaseStrategy)',
                    'LeaderboardService (Strategy: AvgPercentageRanker vs TotalScoreRanker)',
                    'Repository Abstraction (DIP Persistence Layer)'
                ],
                graphTitle: 'Low-Level Design (LLD) Interview Evaluation Rubric Weights',
                graphMetricLabel: 'Interviewer Scoring Weight (%)',
                graphData: [
                    { label: 'Clean Domain Entities, Encapsulation & Invariants', value: 95, displayValue: '30% Weight', note: 'Clear separation of responsibilities' },
                    { label: 'Extensibility via SOLID & Appropriate Design Patterns', value: 92, displayValue: '30% Weight', note: 'Strategy / Observer / Factory where needed' },
                    { label: 'Correct UML Relationships (Composition vs Aggregation)', value: 82, displayValue: '20% Weight', note: 'Lifecycle & cardinality accuracy' },
                    { label: 'Thread Safety, Edge Cases & Clean Code Execution', value: 85, displayValue: '20% Weight', note: 'Concurrency locks & validation guards' }
                ],
                syntaxSummaryCode: `import java.util.*;

// 1. Strategy Pattern: Pluggable Leaderboard Ranking Modes
interface RankingStrategy {
    List<String> rank(Map<String, List<Integer>> studentScores);
}

class AverageScoreRanking implements RankingStrategy {
    @Override
    public List<String> rank(Map<String, List<Integer>> scores) {
        return scores.entrySet().stream()
            .sorted((a, b) -> Double.compare(
                b.getValue().stream().mapToInt(i -> i).average().orElse(0),
                a.getValue().stream().mapToInt(i -> i).average().orElse(0)
            ))
            .map(Map.Entry::getKey)
            .toList();
    }
}

// 2. State Pattern: Exam Attempt Lifecycle
interface AttemptState {
    AttemptState submitAnswer(int qId, String ans);
    AttemptState finalizeAttempt();
}`,
                syntaxTable: [
                    { construct: 'Strategy Pattern', syntax: 'context.setStrategy(new FastSortStrategy());', description: 'Swaps interchangeable algorithm implementation at runtime.' },
                    { construct: 'Observer Pattern', syntax: 'subject.subscribe(observer); subject.notifyAll(evt);', description: 'Broadcasts state changes to decoupled subscribers.' },
                    { construct: 'State Pattern', syntax: 'this.state = this.state.transitionToNext();', description: 'Delegates state-specific behavior and legal transitions to State objects.' },
                    { construct: 'Command Pattern', syntax: 'invoker.execute(new SubmitCodeCommand(payload));', description: 'Encapsulates a request as an object supporting undo, queueing, and audit logs.' }
                ],
                examples: [
                    {
                        title: 'LLD Case Study: Pluggable Exam Question Evaluator (OCP + Strategy)',
                        code: `from abc import ABC, abstractmethod

class GradingStrategy(ABC):
    @abstractmethod
    def grade(self, question: dict, response) -> float:
        pass

class SingleMcqGrader(GradingStrategy):
    def grade(self, q: dict, response) -> float:
        return float(q["points"]) if response == q["answer"] else -float(q.get("neg", 0))

class CodingTestCaseGrader(GradingStrategy):
    def grade(self, q: dict, passed_cases: int) -> float:
        total = len(q["test_cases"])
        return round((passed_cases / total) * q["points"], 2) if total else 0.0

class EvaluationEngine:
    def __init__(self):
        self._graders: dict[str, GradingStrategy] = {
            "mcq": SingleMcqGrader(),
            "coding": CodingTestCaseGrader(),
        }

    def evaluate(self, q: dict, response) -> float:
        grader = self._graders[q["type"]]
        return grader.grade(q, response)

engine = EvaluationEngine()
print("MCQ Score:", engine.evaluate({"type": "mcq", "points": 2, "answer": "B"}, "B"))
print("Coding Score:", engine.evaluate({"type": "coding", "points": 10, "test_cases": [1,2,3,4]}, 3))`,
                        output: `MCQ Score: 2.0
Coding Score: 7.5`,
                        explanation: 'Registering GradingStrategy implementations in a map allows new question types (Numeric, Fill-in-Blank, SQL) to be added without modifying EvaluationEngine.'
                    }
                ],
                problems: [
                    {
                        title: 'LLD Challenge: Design a Multi-Tier Parking Lot Pricing & Spot Allocator',
                        difficulty: 'Medium',
                        statement: 'Design an extensible ParkingLot LLD with VehicleType (BIKE, CAR, TRUCK), ParkingSpot, Ticket, and a PricingStrategy interface (HourlyPricingStrategy vs FlatDayPricingStrategy). Ensure assigning a vehicle picks the lowest available spot matching its type in O(1) or O(log N) time.',
                        sampleInput: 'Park CAR-101 for 3 hours under HourlyPricingStrategy(Rs. 40/hr)',
                        sampleOutput: 'Allocated Spot #C-1 | Exit Fee = Rs. 120',
                        constraints: 'Thread-safe spot allocation',
                        hint: 'Maintain a Map<VehicleType, PriorityQueue<Integer>> of free spot IDs so polling the nearest free spot is O(log N) and returning a spot on exit is O(log N).'
                    },
                    {
                        title: 'Implement State Pattern for an Assessment Session (Draft -> Live -> Paused -> Closed)',
                        difficulty: 'Medium',
                        statement: 'Model an ExamSession with four states (Draft, Live, Paused, Closed) where students can submit answers ONLY when the session is in the Live state, and calling start() on a Closed session throws an IllegalStateException.',
                        sampleInput: 'Draft -> start() -> Live -> submitAnswer() [OK] -> pause() -> Paused -> submitAnswer() [Blocked]',
                        sampleOutput: 'State transitions enforced cleanly without nested boolean flags',
                        constraints: 'Eliminate isStarted / isPaused / isClosed boolean flag soup',
                        hint: 'Create an ExamSessionState interface with start(), pause(), resume(), close(), and canAcceptAnswers(), implemented by DraftState, LiveState, PausedState, and ClosedState.'
                    }
                ]
            }
        ]
    }
];
