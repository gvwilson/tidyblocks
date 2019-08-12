function showCode() {
  toggleVisibility('codeOutput')
  toggleVisibility('plotOutput')
}

function toggleVisibility(elementId) {
  const node = document.getElementById(elementId)
  if (node.style.display === 'none') {
    node.style.display = 'block'
  } else {
    node.style.display = 'none'
  }
}
