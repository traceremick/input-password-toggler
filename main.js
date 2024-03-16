function enhancePasswordField(input) {
    if (input.dataset.enhanced) return;
    input.dataset.enhanced = true;

    const button = document.createElement('button');
    button.setAttribute('tabindex', '-1');
    button.type = "button";
    button.style.cssText = `height: ${input.clientHeight}px; position: absolute; left: ${input.offsetLeft + input.clientWidth - 38}px; top: ${input.offsetTop}px; background: none; outline: none; fontSize: 1.2em; border: none;`;
    button.textContent = '🙈';
    input.parentNode.insertBefore(button, input.nextSibling);

    function toggle() {
        input.type = input.type === 'text' ? 'password' : 'text';
        button.textContent = input.type === 'password' ? '🙈' : '🙉';
    }

    button.addEventListener('click', () => toggle());
}

const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) {
                if (node.matches('input[type="password"]')) enhancePasswordField(node);
                node.querySelectorAll('input[type="password"]').forEach(enhancePasswordField);
            }
        });
    });
});

observer.observe(document.body, { childList: true, subtree: true });
document.querySelectorAll('input[type="password"]').forEach(enhancePasswordField);
