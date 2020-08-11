// Check for gaps in block message translations.

const BLOCKS = ['blocks', 'combine', 'data', 'op', 'plot', 'stats', 'transform', 'value']
const LANGUAGES = ['ar', 'en', 'es', 'ko', 'it']

const search = (path, current) => {
  if ('en' in current) {
    const missing = []
    for (const lang of LANGUAGES) {
      if (!(lang in current)) {
        missing.push(lang)
      }
    }
    if (missing.length > 0) {
      console.warn(`${path.join('.')} missing ${missing.join(', ')}`)
    }
  }
  else {
    for (const key in current) {
      path.push(key)
      search(path, current[key])
      path.pop()
    }
  }
}

const messages = BLOCKS.reduce((accum, current) => {
  const module = require(`../blocks/${current}`)
  accum[current] = module.MESSAGES
  return accum
}, {})

search([], messages)
