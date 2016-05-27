var defaultListener = {
    next: console.log.bind(console),
    error: console.error.bind(console),
    complete: () => null
}
export function generateListener(props) {
    return Object.assign({}, defaultListener, props);
}
