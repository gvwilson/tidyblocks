//
// Set the display property of the three output panes.
//
function initializeDisplay() {
  for (let [nodeId, state] of [['codeOutput', 'none'],
                               ['plotOutput', 'block'],
                               ['dataOutput', 'block']]) {
    document.getElementById(nodeId).style.display = state
  }
}

//
// Toggle between code output and plot output panes.
//
function toggleCodeAndPlot() {
  for (let nodeId of ['codeOutput', 'plotOutput']) {
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
