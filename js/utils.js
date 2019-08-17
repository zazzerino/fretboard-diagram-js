export function empty(elem) {
    while (elem.firstChild) {
        elem.removeChild(elem.firstChild);
    }

    return elem;
}