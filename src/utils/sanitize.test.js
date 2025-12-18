import { describe, it, expect } from 'vitest'
import {
  sanitizeInput,
  sanitizeArray,
  sanitizeObject,
  validateLength,
  validateTag,
  LENGTH_LIMITS
} from './sanitize'

describe('sanitizeInput', () => {
  describe('XSS Protection', () => {
    it('should remove script tags', () => {
      const input = '<script>alert("XSS")</script>Hello'
      const output = sanitizeInput(input, 'BASIC')
      expect(output).toBe('Hello')
    })

    it('should remove event handlers', () => {
      const input = '<img src=x onerror="alert(1)">'
      const output = sanitizeInput(input, 'BASIC')
      expect(output).toBe('<img src="x">')
    })

    it('should remove javascript protocol', () => {
      const input = '<a href="javascript:alert(1)">Click</a>'
      const output = sanitizeInput(input, 'BASIC')
      expect(output).toBe('<a>Click</a>')
    })

    it('should remove iframe tags', () => {
      const input = '<iframe src="evil.com"></iframe>Hello'
      const output = sanitizeInput(input, 'BASIC')
      expect(output).toBe('Hello')
    })

    it('should remove style attributes', () => {
      const input = '<div style="position:fixed">Content</div>'
      const output = sanitizeInput(input, 'BASIC')
      expect(output).toBe('<div>Content</div>')
    })

    it('should remove onclick handlers', () => {
      const input = '<button onclick="hack()">Click</button>'
      const output = sanitizeInput(input, 'BASIC')
      expect(output).toBe('Click')
    })

    it('should handle multiple XSS attempts', () => {
      const input = '<script>hack()</script><img src=x onerror="alert(1)">Safe text'
      const output = sanitizeInput(input, 'BASIC')
      expect(output).toBe('<img src="x">Safe text')
    })
  })

  describe('Sanitization Levels', () => {
    it('STRICT: should remove all HTML tags', () => {
      const input = '<b>Bold</b> <i>Italic</i> Plain'
      const output = sanitizeInput(input, 'STRICT')
      expect(output).toBe('Bold Italic Plain')
    })

    it('BASIC: should allow basic formatting', () => {
      const input = '<b>Bold</b> <i>Italic</i> <p>Paragraph</p>'
      const output = sanitizeInput(input, 'BASIC')
      expect(output).toContain('<b>Bold</b>')
      expect(output).toContain('<i>Italic</i>')
      expect(output).toContain('<p>Paragraph</p>')
    })

    it('BASIC: should remove disallowed tags', () => {
      const input = '<b>Bold</b> <ul><li>Item</li></ul>'
      const output = sanitizeInput(input, 'BASIC')
      expect(output).toContain('<b>Bold</b>')
      expect(output).not.toContain('<ul>')
      expect(output).not.toContain('<li>')
    })

    it('MEDIUM: should allow lists', () => {
      const input = '<b>Bold</b> <ul><li>Item</li></ul>'
      const output = sanitizeInput(input, 'MEDIUM')
      expect(output).toContain('<b>Bold</b>')
      expect(output).toContain('<ul>')
      expect(output).toContain('<li>Item</li>')
    })

    it('WITH_LINKS: should allow links with href', () => {
      const input = '<a href="https://example.com">Link</a>'
      const output = sanitizeInput(input, 'WITH_LINKS')
      expect(output).toContain('<a')
      expect(output).toContain('href="https://example.com"')
      expect(output).toContain('Link</a>')
    })

    it('WITH_LINKS: should sanitize javascript links', () => {
      const input = '<a href="javascript:alert(1)">Click</a>'
      const output = sanitizeInput(input, 'WITH_LINKS')
      expect(output).not.toContain('javascript:')
    })
  })

  describe('Edge Cases', () => {
    it('should handle null input', () => {
      const output = sanitizeInput(null, 'BASIC')
      expect(output).toBeNull()
    })

    it('should handle undefined input', () => {
      const output = sanitizeInput(undefined, 'BASIC')
      expect(output).toBeUndefined()
    })

    it('should handle empty string', () => {
      const output = sanitizeInput('', 'BASIC')
      expect(output).toBe('')
    })

    it('should handle non-string input', () => {
      const output = sanitizeInput(123, 'BASIC')
      expect(output).toBe(123)
    })

    it('should handle plain text without HTML', () => {
      const input = 'Just plain text'
      const output = sanitizeInput(input, 'BASIC')
      expect(output).toBe('Just plain text')
    })
  })
})

describe('sanitizeArray', () => {
  it('should sanitize all strings in array', () => {
    const input = ['<b>Item1</b>', '<script>hack()</script>Item2', 'Item3']
    const output = sanitizeArray(input, 'STRICT')
    expect(output).toEqual(['Item1', 'Item2', 'Item3'])
  })

  it('should handle empty array', () => {
    const output = sanitizeArray([], 'BASIC')
    expect(output).toEqual([])
  })

  it('should handle non-array input', () => {
    const output = sanitizeArray(null, 'BASIC')
    expect(output).toBeNull()
  })

  it('should preserve array with no HTML', () => {
    const input = ['Travel', 'Adventure', 'Food']
    const output = sanitizeArray(input, 'STRICT')
    expect(output).toEqual(['Travel', 'Adventure', 'Food'])
  })

  it('should apply correct sanitization level', () => {
    const input = ['<b>Bold</b>', '<i>Italic</i>']
    const outputStrict = sanitizeArray(input, 'STRICT')
    const outputBasic = sanitizeArray(input, 'BASIC')

    expect(outputStrict).toEqual(['Bold', 'Italic'])
    expect(outputBasic[0]).toContain('<b>Bold</b>')
  })
})

describe('sanitizeObject', () => {
  it('should sanitize string properties', () => {
    const input = {
      title: '<script>hack()</script>Title',
      content: '<b>Content</b>',
      id: 123
    }
    const output = sanitizeObject(input, { title: 'STRICT', content: 'BASIC' })

    expect(output.title).toBe('Title')
    expect(output.content).toContain('<b>Content</b>')
    expect(output.id).toBe(123)
  })

  it('should sanitize array properties', () => {
    const input = {
      tags: ['<b>Tag1</b>', '<script>hack()</script>Tag2'],
      count: 5
    }
    const output = sanitizeObject(input, { tags: 'STRICT' })

    expect(output.tags).toEqual(['Tag1', 'Tag2'])
    expect(output.count).toBe(5)
  })

  it('should handle null object', () => {
    const output = sanitizeObject(null)
    expect(output).toBeNull()
  })

  it('should handle empty object', () => {
    const output = sanitizeObject({})
    expect(output).toEqual({})
  })

  it('should use BASIC level by default', () => {
    const input = { text: '<b>Bold</b>' }
    const output = sanitizeObject(input)
    expect(output.text).toContain('<b>Bold</b>')
  })
})

describe('validateLength', () => {
  it('should accept valid length', () => {
    const result = validateLength('Hello', 1, 10)
    expect(result.valid).toBe(true)
    expect(result.error).toBeNull()
  })

  it('should reject too short input', () => {
    const result = validateLength('Hi', 5, 10)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('al menos 5')
  })

  it('should reject too long input', () => {
    const result = validateLength('Very long text here', 1, 10)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('No puede exceder 10')
  })

  it('should trim input before validation', () => {
    const result = validateLength('  Hi  ', 2, 10)
    expect(result.valid).toBe(true)
  })

  it('should reject empty string', () => {
    const result = validateLength('', 1, 10)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('obligatorio')
  })

  it('should reject null input', () => {
    const result = validateLength(null, 1, 10)
    expect(result.valid).toBe(false)
  })

  it('should accept exact min length', () => {
    const result = validateLength('12345', 5, 10)
    expect(result.valid).toBe(true)
  })

  it('should accept exact max length', () => {
    const result = validateLength('1234567890', 5, 10)
    expect(result.valid).toBe(true)
  })
})

describe('validateTag', () => {
  it('should accept valid tag', () => {
    const result = validateTag('Travel')
    expect(result.valid).toBe(true)
    expect(result.cleaned).toBe('Travel')
    expect(result.error).toBeNull()
  })

  it('should accept tag with spaces', () => {
    const result = validateTag('Travel Tips')
    expect(result.valid).toBe(true)
    expect(result.cleaned).toBe('Travel Tips')
  })

  it('should accept tag with hyphens', () => {
    const result = validateTag('Travel-Tips')
    expect(result.valid).toBe(true)
    expect(result.cleaned).toBe('Travel-Tips')
  })

  it('should accept tag with accents', () => {
    const result = validateTag('Viaje-España')
    expect(result.valid).toBe(true)
    expect(result.cleaned).toBe('Viaje-España')
  })

  it('should sanitize HTML in tags', () => {
    const result = validateTag('<b>Travel</b>')
    expect(result.valid).toBe(true)
    expect(result.cleaned).toBe('Travel')
  })

  it('should reject too short tag', () => {
    const result = validateTag('A')
    expect(result.valid).toBe(false)
    expect(result.error).toContain('al menos 2')
  })

  it('should reject too long tag', () => {
    const longTag = 'a'.repeat(31)
    const result = validateTag(longTag)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('No puede exceder 30')
  })

  it('should reject tag with special characters', () => {
    const result = validateTag('Travel@Home')
    expect(result.valid).toBe(false)
    expect(result.error).toContain('caracteres no permitidos')
  })

  it('should reject tag with symbols', () => {
    const result = validateTag('Travel$$$')
    expect(result.valid).toBe(false)
    expect(result.error).toContain('caracteres no permitidos')
  })

  it('should reject empty tag', () => {
    const result = validateTag('')
    expect(result.valid).toBe(false)
  })

  it('should reject null tag', () => {
    const result = validateTag(null)
    expect(result.valid).toBe(false)
  })

  it('should trim whitespace', () => {
    const result = validateTag('  Travel  ')
    expect(result.valid).toBe(true)
    expect(result.cleaned).toBe('Travel')
  })

  it('should accept numbers in tag', () => {
    const result = validateTag('Travel2024')
    expect(result.valid).toBe(true)
    expect(result.cleaned).toBe('Travel2024')
  })

  it('should accept exact min length', () => {
    const result = validateTag('AB')
    expect(result.valid).toBe(true)
  })

  it('should accept exact max length', () => {
    const tag = 'a'.repeat(30)
    const result = validateTag(tag)
    expect(result.valid).toBe(true)
  })
})

describe('LENGTH_LIMITS', () => {
  it('should define forum title limits', () => {
    expect(LENGTH_LIMITS.FORUM_TITLE.min).toBe(5)
    expect(LENGTH_LIMITS.FORUM_TITLE.max).toBe(100)
  })

  it('should define forum description limits', () => {
    expect(LENGTH_LIMITS.FORUM_DESCRIPTION.min).toBe(10)
    expect(LENGTH_LIMITS.FORUM_DESCRIPTION.max).toBe(500)
  })

  it('should define post title limits', () => {
    expect(LENGTH_LIMITS.POST_TITLE.min).toBe(5)
    expect(LENGTH_LIMITS.POST_TITLE.max).toBe(150)
  })

  it('should define post content limits', () => {
    expect(LENGTH_LIMITS.POST_CONTENT.min).toBe(10)
    expect(LENGTH_LIMITS.POST_CONTENT.max).toBe(10000)
  })

  it('should define comment content limits', () => {
    expect(LENGTH_LIMITS.COMMENT_CONTENT.min).toBe(1)
    expect(LENGTH_LIMITS.COMMENT_CONTENT.max).toBe(2000)
  })

  it('should define tag limits', () => {
    expect(LENGTH_LIMITS.TAG.min).toBe(2)
    expect(LENGTH_LIMITS.TAG.max).toBe(30)
  })

  it('should define max tag count', () => {
    expect(LENGTH_LIMITS.TAG_MAX_COUNT).toBe(10)
  })
})

describe('Real World Scenarios', () => {
  it('should handle forum form submission', () => {
    const formData = {
      title: '<script>hack()</script>My Travel Forum',
      description: '<b>Welcome</b> to my forum about <i>traveling</i>!',
      categoryId: 1
    }

    const sanitized = sanitizeObject(formData, {
      title: 'BASIC',
      description: 'BASIC'
    })

    expect(sanitized.title).not.toContain('<script>')
    expect(sanitized.title).toContain('My Travel Forum')
    expect(sanitized.description).toContain('<b>Welcome</b>')
    expect(sanitized.description).toContain('<i>traveling</i>')
  })

  it('should handle post form submission with tags', () => {
    const formData = {
      title: '<img src=x onerror="alert(1)">My Trip to Spain',
      content: '<b>Amazing</b> trip with <ul><li>beaches</li></ul>',
      tags: ['<script>hack()</script>Travel', 'Spain@2024', 'Beach']
    }

    const sanitized = sanitizeObject(formData, {
      title: 'BASIC',
      content: 'MEDIUM',
      tags: 'STRICT'
    })

    expect(sanitized.title).not.toContain('onerror')
    expect(sanitized.content).toContain('<ul>')
    expect(sanitized.tags[0]).toBe('Travel')
  })

  it('should handle comment submission', () => {
    const content = '<script>steal()</script>Great post! <b>Thanks</b> for sharing.'
    const sanitized = sanitizeInput(content, 'BASIC')

    expect(sanitized).not.toContain('<script>')
    expect(sanitized).toContain('Great post!')
    expect(sanitized).toContain('<b>Thanks</b>')
  })

  it('should validate and sanitize user tag input', () => {
    const userInput = '  <b>Travel-España</b>  '
    const validation = validateTag(userInput)

    expect(validation.valid).toBe(true)
    expect(validation.cleaned).toBe('Travel-España')
    expect(validation.cleaned).not.toContain('<b>')
  })

  it('should reject malicious tag attempts', () => {
    const maliciousTags = [
      '<script>alert(1)</script>',
      'tag;drop table users',
      '../../../etc/passwd',
      'tag<img src=x onerror=alert(1)>'
    ]

    maliciousTags.forEach(tag => {
      const validation = validateTag(tag)
      expect(validation.valid).toBe(false)
    })
  })
})
