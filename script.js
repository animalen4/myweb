document.addEventListener('DOMContentLoaded', () => {
    const magnifier = document.getElementById('magnifier');
    const magnifierContent = document.getElementById('magnifier-content');
    const contentArea = document.querySelector('.content-area');
    const sampleText = document.querySelector('.sample-text');
    
    // Control elements
    const magnifierSizeControl = document.getElementById('magnifier-size');
    const zoomLevelControl = document.getElementById('zoom-level');
    const fontSizeControl = document.getElementById('font-size');
    
    // Initial settings
    let magnifierSize = 180;
    let zoomLevel = 1.5;
    let fontSizeMultiplier = 1;
    let magnifierActive = false;
    
    // Update magnifier position and content
    function updateMagnifier(e) {
        if (!magnifierActive) return;
        
        const rect = document.body.getBoundingClientRect();
        
        // Calculate position (center the magnifier on cursor)
        const x = e.clientX - magnifierSize / 2;
        const y = e.clientY - magnifierSize / 2;
        
        // Update magnifier position
        magnifier.style.left = `${x}px`;
        magnifier.style.top = `${y}px`;
        
        // Get the element under the cursor
        const elemUnderCursor = document.elementFromPoint(e.clientX, e.clientY);
        if (!elemUnderCursor) return;
        
        // Clone the content at the cursor position
        let targetElem = elemUnderCursor.closest('p, h1, h2, h3, h4, h5, h6, div, section, article') || document.body;
        const clonedContent = targetElem.cloneNode(true);
        
        // Position the cloned content to align with original content
        const targetRect = targetElem.getBoundingClientRect();
        const offsetX = -(e.clientX - targetRect.left) * (zoomLevel - 1) - (x - targetRect.left);
        const offsetY = -(e.clientY - targetRect.top) * (zoomLevel - 1) - (y - targetRect.top);
        
        // Clear previous content and add new cloned content
        magnifierContent.innerHTML = '';
        magnifierContent.appendChild(clonedContent);
        
        // Style the cloned content
        clonedContent.style.position = 'absolute';
        clonedContent.style.left = `${offsetX}px`;
        clonedContent.style.top = `${offsetY}px`;
        clonedContent.style.transform = `scale(${zoomLevel})`;
        clonedContent.style.transformOrigin = 'top left';
        clonedContent.style.width = `${targetElem.offsetWidth}px`;
        clonedContent.style.color = 'white';
        
        // Apply font size multiplier to all text elements
        const textElements = clonedContent.querySelectorAll('p, h2, h3, span, a, div, li, td, th');
        textElements.forEach(el => {
            const computedStyle = window.getComputedStyle(el);
            const currentSize = parseFloat(computedStyle.fontSize);
            el.style.fontSize = `${currentSize * fontSizeMultiplier}px`;
        });
    }
    
    // Toggle magnifier with double click
    document.addEventListener('dblclick', (e) => {
        magnifierActive = !magnifierActive;
        
        if (magnifierActive) {
            magnifier.style.display = 'block';
            updateMagnifier(e);
        } else {
            magnifier.style.display = 'none';
        }
    });
    
    // Update magnifier position on mouse move
    document.addEventListener('mousemove', updateMagnifier);
    
    // Enhanced touch events for better mobile support
    document.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            // Toggle magnifier with two-finger tap
            magnifierActive = !magnifierActive;
            if (magnifierActive) {
                magnifier.style.display = 'block';
                updateMagnifier(e.touches[0]);
            } else {
                magnifier.style.display = 'none';
            }
            e.preventDefault();
            return;
        }
        
        if (!magnifierActive) return;
        e.preventDefault();
        updateMagnifier(e.touches[0]);
    });
    
    document.addEventListener('touchmove', (e) => {
        if (!magnifierActive) return;
        e.preventDefault();
        updateMagnifier(e.touches[0]);
    });
    
    // Update controls
    magnifierSizeControl.addEventListener('input', () => {
        magnifierSize = parseInt(magnifierSizeControl.value);
        magnifier.style.width = `${magnifierSize}px`;
        magnifier.style.height = `${magnifierSize}px`;
    });
    
    zoomLevelControl.addEventListener('input', () => {
        zoomLevel = parseFloat(zoomLevelControl.value);
    });
    
    fontSizeControl.addEventListener('input', () => {
        fontSizeMultiplier = parseFloat(fontSizeControl.value);
    });
});