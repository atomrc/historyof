var defaultListener = {
    next: console.log.bind(console),
    error: console.error.bind(console),
    complete: console.log.bind(console)
}
export function generateListener(props) {
    return Object.assign({}, defaultListener, props);
}
