function enhancePasswordField(input) {
    if (input.dataset.enhanced) {
        return;
    }

    input.dataset.enhanced = true;

    const hasExistingToggle = (() => {
        const parentElement = input.parentElement;
        const grandParentElement = parentElement?.parentElement;

        if ((! parentElement && ! grandParentElement) || grandParentElement?.tagName === 'FORM') {
            return false;
        }

        const hasToggleElement = (element) => {
            if (! element) { 
                return false;
            }
            
            if (element.tagName === 'BUTTON' || element.matches('[role="button"]')) { 
                return true; 
            }
            
            if (element.className && (
                element.className.toLowerCase().includes('icon') ||
                element.className.toLowerCase().includes('eye') ||
                element.className.toLowerCase().includes('password') ||
                element.className.toLowerCase().includes('toggle')
            )) {
                return true;
            }
            
            return element.querySelector('button, [role="button"], [class*="icon" i], [class*="eye" i], [class*="password" i], [class*="toggle" i]') !== null;
        };
        
        let prevSibling = input.previousElementSibling;
        while (prevSibling) {
            if (hasToggleElement(prevSibling)) {
                return true;
            }

            prevSibling = prevSibling.previousElementSibling;
        }

        let nextSibling = input.nextElementSibling;
        while (nextSibling) {
            if (hasToggleElement(nextSibling)) {
                return true;
            }

            nextSibling = nextSibling.nextElementSibling;
        }

        const nearbyElements = [
            ...(parentElement?.querySelectorAll('button, [role="button"], [class*="icon" i], [class*="eye" i], [class*="password" i], [class*="toggle" i]') || []),
            ...(grandParentElement?.querySelectorAll('button, [role="button"], [class*="icon" i], [class*="eye" i], [class*="password" i], [class*="toggle" i]') || [])
        ];
        
        return nearbyElements.some(element => {
            if (element.dataset.generatedToggle) {
                return false;
            }

            const rect = element.getBoundingClientRect();
            const inputRect = input.getBoundingClientRect();

            return Math.abs(rect.left - inputRect.right) < 100 && Math.abs(rect.top - inputRect.top) < 100;
        });
    })();

    if (hasExistingToggle) {
        return;
    }

    const button = document.createElement('button');
    button.setAttribute('tabindex', '-1');
    button.type = "button";
    button.dataset.generatedToggle = 'true';
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
