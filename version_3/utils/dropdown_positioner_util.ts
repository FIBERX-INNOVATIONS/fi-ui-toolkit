type Position = 'top' | 'bottom' | 'left' | 'right';

interface PositionResult {
    top: number;
    left: number;
    placement: Position;
}

interface Options {
    preferredPosition?: Position;
    offset?: number;
    autoApplyStyles?: boolean;
    watch?: boolean;
}

export const positionDropdownRelative = (
    triggerEl: HTMLElement | null,
    dropdownEl: HTMLElement | null,
    options: Options = {}
): PositionResult | null => {

    if(!triggerEl || !dropdownEl ) {
        return null;
    }

    const {
        preferredPosition = 'bottom',
        offset = 8,
        autoApplyStyles = false,
        watch = false
    } = options;

    const parent = triggerEl.offsetParent as HTMLElement;

    if (!parent) {
        throw new Error('No offsetParent found. Ensure parent has position: relative.');
    }

    const parentRect = parent.getBoundingClientRect();
    const triggerRect = triggerEl.getBoundingClientRect();
    const dropdownRect = dropdownEl.getBoundingClientRect();

    // Position relative to parent
    const trigger = {
        top: triggerRect.top - parentRect.top,
        left: triggerRect.left - parentRect.left,
        width: triggerRect.width,
        height: triggerRect.height,
        right: (triggerRect.left - parentRect.left) + triggerRect.width,
        bottom: (triggerRect.top - parentRect.top) + triggerRect.height
    };

    const parentWidth = parent.clientWidth;
    const parentHeight = parent.clientHeight;

    const space = {
        top: trigger.top,
        bottom: parentHeight - trigger.bottom,
        left: trigger.left,
        right: parentWidth - trigger.right
    };

    // Determine best placement
    let placement: Position = preferredPosition;

    const fits = {
        bottom: space.bottom >= dropdownRect.height,
        top: space.top >= dropdownRect.height,
        right: space.right >= dropdownRect.width,
        left: space.left >= dropdownRect.width
    };

    if (!fits[preferredPosition]) {
        placement =
            (fits.bottom && 'bottom') ||
            (fits.top && 'top') ||
            (fits.right && 'right') ||
            (fits.left && 'left') ||
            preferredPosition;
    }

    let top = 0;
    let left = 0;

    switch (placement) {
        case 'bottom':
            top = trigger.bottom + offset;
            left = trigger.left + (trigger.width - dropdownRect.width) / 2;
            break;

        case 'top':
            top = trigger.top - dropdownRect.height - offset;
            left = trigger.left + (trigger.width - dropdownRect.width) / 2;
            break;

        case 'right':
            top = trigger.top + (trigger.height - dropdownRect.height) / 2;
            left = trigger.right + offset;
            break;

        case 'left':
            top = trigger.top + (trigger.height - dropdownRect.height) / 2;
            left = trigger.left - dropdownRect.width - offset;
            break;
    }

    // Clamp within parent
    top = Math.max(0, Math.min(top, parentHeight - dropdownRect.height));
    left = Math.max(0, Math.min(left, parentWidth - dropdownRect.width));

    if (autoApplyStyles) {
        Object.assign(dropdownEl.style, {
            position: 'absolute',
            top: `${top}px`,
            left: `${left}px`
        });
    }

    // Watch for updates
    if (watch) {
        const update = () =>
            positionDropdownRelative(triggerEl, dropdownEl, options);

        window.addEventListener('resize', update);
        parent.addEventListener('scroll', update);

        (dropdownEl as any).__cleanup = () => {
            window.removeEventListener('resize', update);
            parent.removeEventListener('scroll', update);
        };
    }

    return { top, left, placement };
};