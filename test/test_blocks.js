'use strict'

import assert from 'assert'
import Blockly from 'blockly/blockly_compressed'

import blocks from '../blocks/blocks'
import helpers from '../blocks/helpers'

const MESSAGES = {
  commonName: {
    aa: 'Afar commonName',
    en: 'default commonName'
  },
  blockName: {
    fieldName: {
      aa: 'Afar fieldName',
      en: 'default fieldName'
    }
  }
}

describe('handles translations correctly', () => {
  it('sets up configuration XML', (done) => {
    const xml = blocks.createXmlConfig('en')
    assert(xml.includes('name="data"'),
           `Expected configuration XML to include data category`)
    done()
  })

  it('looks up a shared message value', (done) => {
    const msg = new helpers.Messages(MESSAGES, 'aa')
    const result = msg.get('commonName')
    assert.equal(result, 'Afar commonName',
                 `Did not get expected common name`)
    done()
  })

  it('returns a default shared message value', (done) => {
    const msg = new helpers.Messages(MESSAGES, 'zu')
    const result = msg.get('commonName')
    assert.equal(result, 'default commonName',
                 `Did not get default common name`)
    done()
  })

  it('looks up a block message value', (done) => {
    const msg = new helpers.Messages(MESSAGES, 'aa')
    const result = msg.get('blockName.fieldName')
    assert.equal(result, 'Afar fieldName',
                 `Did not get expected field name`)
    done()
  })

  it('returns a default block message value', (done) => {
    const msg = new helpers.Messages(MESSAGES, 'zu')
    const result = msg.get('blockName.fieldName')
    assert.equal(result, 'default fieldName',
                 `Did not get default field name`)
    done()
  })

  it('returns undefined for missing keys', (done) => {
    const msg = new helpers.Messages(MESSAGES, 'aa')
    const result = msg.get('non.existent')
    assert.equal(result, helpers.Messages.UNDEFINED,
                 `Did not get "${helpers.Messages.UNDEFINED}"`)
    done()
  })

  it('handles a missing default value', (done) => {
    const msg = new helpers.Messages(MESSAGES, 'zz', 'zz')
    const result = msg.get('blockName.fieldName')
    assert.equal(result, helpers.Messages.UNDEFINED,
                 `Did not get "${helpers.Messages.UNDEFINED}"`)
    done()
  })
})
