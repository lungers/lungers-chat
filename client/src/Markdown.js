import React from 'react';
import Markdown from 'simple-markdown';
import Highlight from 'react-highlight.js';

let currentOrder = 0;

const rules = {
    escape: {
        ...Markdown.defaultRules.escape,
        order: currentOrder++,
    },
    url: {
        ...Markdown.defaultRules.url,
        order: currentOrder++,
        react(node, output, state) {
            return Markdown.reactElement('a', state.key, {
                href: Markdown.sanitizeUrl(node.target),
                title: node.title,
                target: '_blank',
                children: output(node.content, state),
            });
        },
    },
    link: {
        ...Markdown.defaultRules.link,
        order: currentOrder++,
        react(node, output, state) {
            return Markdown.reactElement('a', state.key, {
                href: Markdown.sanitizeUrl(node.target),
                title: node.title,
                target: '_blank',
                children: output(node.content, state),
            });
        },
    },
    strong: {
        ...Markdown.defaultRules.strong,
        order: currentOrder++,
        match(source) {
            return /^\*\*([\s\S]+?)\*\*/.exec(source);
        },
        parse(capture, parse, state) {
            return {
                content: parse(capture[1], state),
            };
        },
    },
    underline: {
        order: currentOrder++,
        match(source) {
            return /^__([\s\S]+?)__/.exec(source);
        },
        parse(capture, parse, state) {
            return {
                content: parse(capture[1], state),
            };
        },
        react(node, output, state) {
            return Markdown.reactElement('u', state.key, {
                children: output(node.content),
            });
        },
    },
    em: {
        order: currentOrder++,
        match(source) {
            return /^(\*|_)([\s\S]+?)\1/.exec(source);
        },
        parse(capture, parse, state) {
            return {
                content: parse(capture[2], state),
            };
        },
        react(node, output, state) {
            return Markdown.reactElement('em', state.key, {
                children: output(node.content, state),
            });
        },
    },
    codeBlock: {
        order: currentOrder++,
        match(source) {
            return /^```(\w*)\n+([\s\S]+?)\n+```$/.exec(source);
        },
        parse(capture) {
            return {
                lang: capture[1].trim(),
                content: capture[2],
            };
        },
        react(node) {
            return <Highlight language={node.lang}>{node.content}</Highlight>;
        },
    },
    inlineCode: {
        order: currentOrder++,
        match: Markdown.inlineRegex(/^`([^`]+?)`/),
        parse(capture) {
            return {
                content: capture[1],
            };
        },
        react(node, _, state) {
            return Markdown.reactElement('code', state.key, {
                children: node.content,
            });
        },
    },
    emDash: {
        order: currentOrder++,
        match(source) {
            return /^--/.exec(source);
        },
        parse() {
            return {};
        },
        react() {
            // https://www.thepunctuationguide.com/em-dash.html
            return '—';
        },
    },
    text: {
        order: currentOrder++,
        match(source) {
            return /^[\s\S]+/.exec(source);
        },
        parse(capture) {
            return {
                content: capture[0],
            };
        },
        react(node) {
            return node.content;
        },
    },
};

const parser = Markdown.parserFor(rules);
const reactOutput = Markdown.reactFor(Markdown.ruleOutput(rules, 'react'));

export default source => {
    const parseTree = parser(source, { inline: true });
    const outputResult = reactOutput(parseTree);

    return outputResult;
};
