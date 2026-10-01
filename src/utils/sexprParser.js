import { healSExprString } from './astQuestionExtractor';
/**
 * Strips Lisp-style comments (; or ;;) that occur outside of quoted strings.
 */
export function stripSExprComments(str) {
    if (!str || typeof str !== 'string')
        return '';
    let result = '';
    let inQuote = false;
    let escapeNext = false;
    for (let i = 0; i < str.length; i++) {
        const ch = str[i];
        if (escapeNext) {
            result += ch;
            escapeNext = false;
            continue;
        }
        if (ch === '\\') {
            result += ch;
            escapeNext = true;
            continue;
        }
        if (ch === '"') {
            inQuote = !inQuote;
            result += ch;
            continue;
        }
        if (!inQuote && ch === ';') {
            while (i < str.length && str[i] !== '\n' && str[i] !== '\r') {
                i++;
            }
            result += '\n';
            continue;
        }
        result += ch;
    }
    return result;
}
export function parseSExpr(input) {
    if (!input || typeof input !== 'string')
        return null;
    const decommented = stripSExprComments(input);
    const healed = healSExprString(decommented);
    const tokens = tokenize(healed);
    let cursor = 0;
    function parseNode() {
        if (cursor >= tokens.length)
            return null;
        const token = tokens[cursor++];
        if (token === '(' || token === '[') {
            const closeDelim = token === '(' ? ')' : ']';
            // Empty list: () or []
            if (cursor < tokens.length && tokens[cursor] === closeDelim) {
                cursor++;
                return [];
            }
            // Lookahead: check if next token is a nested expression, a keyword argument, or an array of items
            const next = tokens[cursor];
            if (next === '(' ||
                next === '[' ||
                (typeof next === 'string' && (next.startsWith(':') || next.startsWith('"') || !isNaN(Number(next))))) {
                const items = [];
                while (cursor < tokens.length && tokens[cursor] !== closeDelim) {
                    items.push(parseNode());
                }
                if (tokens[cursor] === closeDelim)
                    cursor++; // consume closing delimiter
                return items;
            }
            const tag = cursor < tokens.length ? tokens[cursor++] : 'node';
            const props = {};
            const children = [];
            while (cursor < tokens.length && tokens[cursor] !== closeDelim) {
                const current = tokens[cursor];
                if (typeof current === 'string' && current.startsWith(':')) {
                    const key = current.slice(1);
                    cursor++;
                    props[key] = parseNode();
                }
                else {
                    children.push(parseNode());
                }
            }
            if (tokens[cursor] === closeDelim)
                cursor++; // consume closing delimiter
            return { tag, props, children };
        }
        // Primitive conversions
        if (token === 'true')
            return true;
        if (token === 'false')
            return false;
        if (token === 'nil' || token === 'null')
            return null;
        if (!isNaN(Number(token)))
            return Number(token);
        if (token && token.startsWith('"') && token.endsWith('"')) {
            return token.slice(1, -1).replace(/\\(["\\\/bfnrt])/g, (_, esc) => {
                switch (esc) {
                    case '"': return '"';
                    case '\\': return '\\';
                    case 'n': return '\n';
                    case 't': return '\t';
                    case 'r': return '\r';
                    case 'b': return '\b';
                    case 'f': return '\f';
                    default: return esc;
                }
            });
        }
        return token;
    }
    return parseNode();
}
/**
 * Tokenizes an S-Expression string into individual atomic tokens, delimiters, and quoted literals.
 * Implemented as a strictly linear O(n) character scanner without backtracking regular expressions
 * to guarantee complete immunity against Polynomial/Exponential ReDoS attacks (CodeQL: js/polynomial-redos).
 * Handles escaped quotes within strings cleanly.
 */
export function tokenize(str) {
    if (!str || typeof str !== 'string')
        return [];
    const tokens = [];
    const len = str.length;
    let i = 0;
    while (i < len) {
        const ch = str[i];
        // Skip whitespace
        if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r' || ch === '\f') {
            i++;
            continue;
        }
        // Delimiters
        if (ch === '(' || ch === ')' || ch === '[' || ch === ']') {
            tokens.push(ch);
            i++;
            continue;
        }
        // Quoted string literal
        if (ch === '"') {
            const start = i;
            i++; // skip opening quote
            let inEscape = false;
            while (i < len) {
                const c = str[i];
                if (inEscape) {
                    inEscape = false;
                    i++;
                }
                else if (c === '\\') {
                    inEscape = true;
                    i++;
                }
                else if (c === '"') {
                    i++; // include closing quote
                    break;
                }
                else {
                    i++;
                }
            }
            tokens.push(str.slice(start, i));
            continue;
        }
        // Atomic symbol, keyword (:kw), number, or identifier
        const start = i;
        while (i < len &&
            str[i] !== ' ' &&
            str[i] !== '\t' &&
            str[i] !== '\n' &&
            str[i] !== '\r' &&
            str[i] !== '\f' &&
            str[i] !== '(' &&
            str[i] !== ')' &&
            str[i] !== '[' &&
            str[i] !== ']' &&
            str[i] !== '"') {
            i++;
        }
        if (i > start) {
            tokens.push(str.slice(start, i));
        }
    }
    return tokens;
}
/**
 * Robust S-Expression AST question extractor.
 * Replaces legacy brittle regular expression matchers (:prompt, :options regexes).
 * Uses recursive tokenizer and parser to safely parse:
 * - Escaped double-quotes inside prompt/options
 * - Nested parentheses and lists
 * - Multi-line strings
 * - S-expression comments (; or ;;)
 * - Shorthand keywords (:q, :opts, :choices, :answer, etc.)
 */
export function parseAstNode(input) {
    const ast = typeof input === 'string' ? parseSExpr(input) : input;
    if (!ast) {
        throw new Error('Invalid AST: Empty or unparseable S-expression');
    }
    let route = 'quiz:mcq';
    let calc = undefined;
    let prompt = undefined;
    let options = [];
    let answerKey = 0;
    const extractString = (val) => {
        if (val === null || val === undefined)
            return '';
        if (typeof val === 'string')
            return val;
        if (typeof val === 'number' || typeof val === 'boolean')
            return String(val);
        if (typeof val === 'object') {
            if (val.props?.text)
                return String(val.props.text);
            if (Array.isArray(val.children) && val.children.length > 0)
                return extractString(val.children[0]);
        }
        return String(val);
    };
    const processProps = (props) => {
        if (!props || typeof props !== 'object')
            return;
        if (props.route && typeof props.route === 'string')
            route = props.route;
        if (props.calc && typeof props.calc === 'string')
            calc = props.calc;
        const rawPrompt = props.prompt ?? props.q ?? props.question ?? props.stem;
        if (rawPrompt !== undefined && rawPrompt !== null) {
            prompt = extractString(rawPrompt);
        }
        const rawKey = props['answer-key'] ?? props.answerKey ?? props.answer ?? props.key;
        if (rawKey !== undefined && rawKey !== null) {
            const parsed = parseInt(String(rawKey), 10);
            if (!isNaN(parsed))
                answerKey = parsed;
        }
        const rawOpts = props.options ?? props.opts ?? props.choices;
        if (rawOpts) {
            if (Array.isArray(rawOpts)) {
                options = rawOpts.map(extractString).filter(Boolean);
            }
            else if (typeof rawOpts === 'object') {
                if (Array.isArray(rawOpts.children)) {
                    options = rawOpts.children.map(extractString).filter(Boolean);
                }
            }
        }
    };
    if (Array.isArray(ast)) {
        const props = {};
        for (let i = 0; i < ast.length; i++) {
            const item = ast[i];
            if (typeof item === 'string' && item.startsWith(':')) {
                const key = item.slice(1);
                const val = i + 1 < ast.length ? ast[i + 1] : true;
                props[key] = val;
                i++;
            }
            else if (typeof item === 'object' && item !== null && 'tag' in item) {
                if (!prompt && (item.props?.prompt || item.props?.question)) {
                    processProps(item.props);
                    if (item.tag && item.tag !== 'node')
                        route = item.tag;
                }
            }
            else if (typeof item === 'string' && i === 0 && !item.startsWith(':')) {
                route = item;
            }
        }
        processProps(props);
    }
    else if (typeof ast === 'object' && ast !== null && 'tag' in ast) {
        if (ast.tag && ast.tag !== 'node')
            route = ast.tag;
        if (ast.props)
            processProps(ast.props);
        if (Array.isArray(ast.children)) {
            for (const child of ast.children) {
                if (typeof child === 'object' && child !== null && 'tag' in child) {
                    if (child.tag === 'option') {
                        const optText = child.props?.text || (child.children && child.children[0]) || '';
                        if (optText)
                            options.push(extractString(optText));
                        if (child.props?.correct === true || child.props?.correct === '#t') {
                            answerKey = options.length - 1;
                        }
                    }
                    else if (!prompt && (child.tag === 'prompt' || child.tag === 'question')) {
                        prompt = extractString(child.props?.text || child.children[0] || '');
                    }
                }
            }
        }
    }
    if (!prompt) {
        throw new Error('Invalid AST: Missing :prompt token');
    }
    if (options.length === 0) {
        options = ['Option A', 'Option B', 'Option C', 'Option D'];
    }
    return { route, calc, prompt, options, answerKey };
}
export class AstParser {
    /**
     * Parses S-Expression into ParsedAstNode using robust recursive tokenizer.
     * Replaces legacy regex matchers.
     */
    static parse(sExpr) {
        return parseAstNode(sExpr);
    }
}
