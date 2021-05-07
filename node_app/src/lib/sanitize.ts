import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';

const config = {
  ALLOWED_TAGS: ['p', 'span', 'br', 'a'],
};

const { window } = new JSDOM('');
const { document } = window;
const DOMPurify = createDOMPurify(window);
DOMPurify.addHook('afterSanitizeAttributes', function (node) {
  // set all elements owning target to target=_blank
  if ('target' in node) {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }
  // set non-HTML/MathML links to xlink:show=new
  if (
    !node.hasAttribute('target') &&
    (node.hasAttribute('xlink:href') || node.hasAttribute('href'))
  ) {
    node.setAttribute('xlink:show', 'new');
  }
});

// allowed URI schemes
const allowList = ['http', 'https'];

// build fitting regex
const regex = RegExp('^(' + allowList.join('|') + '):', 'gim');

// Add a hook to enforce URI scheme allow-list
DOMPurify.addHook('afterSanitizeAttributes', function (node) {
  // build an anchor to map URLs to
  const anchor = document.createElement('a');

  // check all href attributes for validity
  if (node.hasAttribute('href')) {
    anchor.href = node.getAttribute('href');
    if (anchor.protocol && !anchor.protocol.match(regex)) {
      node.removeAttribute('href');
    }
  }
  // check all action attributes for validity
  if (node.hasAttribute('action')) {
    anchor.href = node.getAttribute('action');
    if (anchor.protocol && !anchor.protocol.match(regex)) {
      node.removeAttribute('action');
    }
  }
  // check all xlink:href attributes for validity
  if (node.hasAttribute('xlink:href')) {
    anchor.href = node.getAttribute('xlink:href');
    if (anchor.protocol && !anchor.protocol.match(regex)) {
      node.removeAttribute('xlink:href');
    }
  }
});

export function sanitize(dirtyHtml: string): string {
  return DOMPurify.sanitize(dirtyHtml, config);
}
