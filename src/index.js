const timeout = () => {
window.setTimeout("redirect()",2000)
}

const redirect = () => {
    window.location.href = 'index.html';
 
}
window.onload = timeout;
