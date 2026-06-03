import partial from "/partial.html" with { type: "text" };
import text from "/plus-icon.svg" with { type: "text" };
const div = document.getElementById('target');
div.textContent = text;


const htmlExample = document.querySelector('.html-example');
htmlExample.setHTML(partial, {sanitizer: {}});

console.log(partial);
console.log(htmlExample)