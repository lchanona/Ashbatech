const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('/Users/chanonaruizluis/Desktop/portfolio/index.html', 'utf8');

const dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable" });

dom.window.document.addEventListener('DOMContentLoaded', () => {
    try {
        const script1 = fs.readFileSync('/Users/chanonaruizluis/Desktop/portfolio/js/translations.js', 'utf8');
        dom.window.eval(script1);
        const script2 = fs.readFileSync('/Users/chanonaruizluis/Desktop/portfolio/js/script.js', 'utf8');
        dom.window.eval(script2);

        console.log("Scripts loaded.");
        const btn = dom.window.document.getElementById('lang-toggle');
        if (btn) {
            console.log("Before click:", dom.window.document.documentElement.lang);
            btn.click();
            console.log("After click:", dom.window.document.documentElement.lang);
        } else {
            console.log("Button not found");
        }
    } catch (e) {
        console.error("Error:", e);
    }
});
