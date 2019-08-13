//
// Set the display property of the two input panes.
//
function initializeDisplay() {
  for (let [nodeId, state] of [['codeOutput', 'none'],
                               ['blockOutput', 'block']]) {
    document.getElementById(nodeId).style.display = state
  }
}

//
// Toggle between block input and text input panes.
//
function blockToText() {
  for (let nodeId of ['codeOutput', 'blockOutput']) {
    const node = document.getElementById(nodeId)
    if (node.style.display === 'none') {
      node.style.display = 'block'
    } else {
      node.style.display = 'none'
    }
  }
}

//
// Setup after DOM has initialized.
//
document.addEventListener("DOMContentLoaded", (event) => {
  initializeDisplay()
})
