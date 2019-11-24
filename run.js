const linkinator = require('linkinator');

const waitForMilliseconds = (milliseconds) => {
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds);
  });
};

const checkLink = async (link) => {
  const checker = new linkinator.LinkChecker();

  checker.on('pagestart', url => {
    console.log(`Scanning ${url}`);
  });

  checker.on('link', result => {
    console.log(`${result.url} ${result.status} (${result.state})`);
  });

  const result = await checker.check({
    path: link,
    linksToSkip: [
      'https://help.medium.com',
      'https://cdn-client.medium.com',
      'https://hackernoon.com/tagged/wrong'
    ]
  });

  console.log(`Scanned total of ${result.links.length} links!`);

  const brokenLinks = result.links
    .filter(link => link.state === 'BROKEN')
    .filter(link => link.status !== 409);

  console.log(`Detected ${brokenLinks.length} broken links.`);

  return {
    url: link,
    brokenLinks: brokenLinks
  };
};

(async function() {
  let inspectedPages = [];

  // TODO: Add remaining links from medium.com

  inspectedPages = inspectedPages.concat(await checkLink('https://medium.com/hackernoon/the-danger-of-relying-on-abstractions-dfa04a8d553d'));
  inspectedPages = inspectedPages.concat(await checkLink('https://medium.com/hackernoon/how-to-do-pair-programming-wrong-dab72fd15bef'));
  inspectedPages = inspectedPages.concat(await checkLink('https://medium.com/free-code-camp/the-power-of-pair-programming-lies-on-the-execution-a27938447994'));

  inspectedPages = inspectedPages.concat(await checkLink('https://medium.com/@fagnerbrack/how-to-find-the-best-context-for-pair-programming-711b8fdcd259'));
  inspectedPages = inspectedPages.concat(await checkLink('https://medium.com/@fagnerbrack/pair-programming-8cfbf2dc4d00'));
  inspectedPages = inspectedPages.concat(await checkLink('https://medium.com/@fagnerbrack/code-smell-92ebb99a62d0'));
  inspectedPages = inspectedPages.concat(await checkLink('https://medium.com/@fagnerbrack/code-review-and-test-driven-development-4c19b69b5761'));
  inspectedPages = inspectedPages.concat(await checkLink('https://medium.com/free-code-camp/the-benefits-of-typing-instead-of-copying-54ed734ad849'));
  await waitForMilliseconds(5000);

  inspectedPages = inspectedPages.concat(await checkLink('https://medium.com/hackernoon/the-angry-programmer-52a93bfcbc3c'));
  inspectedPages = inspectedPages.concat(await checkLink('https://medium.com/@fagnerbrack/code-comment-is-a-smell-4e8d78b0415b'));
  inspectedPages = inspectedPages.concat(await checkLink('https://medium.com/@fagnerbrack/repairing-the-leaky-abstraction-e726baab91b5'));
  inspectedPages = inspectedPages.concat(await checkLink('https://medium.com/@fagnerbrack/7-predictions-for-the-web-in-the-next-5-years-d57322717df3'));
  inspectedPages = inspectedPages.concat(await checkLink('https://medium.com/@fagnerbrack/mocking-can-lean-to-nondeterministic-tests-4ba8aef977a0'));
  await waitForMilliseconds(5000);

  inspectedPages = inspectedPages.concat(await checkLink('https://medium.com/@fagnerbrack/one-pull-request-one-concern-e84a27dfe9f1'));
  inspectedPages = inspectedPages.concat(await checkLink('https://medium.com/@fagnerbrack/personal-experience-doesnt-matter-cb060b42f99a'));
  inspectedPages = inspectedPages.concat(await checkLink('https://medium.com/@fagnerbrack/library-internals-do-not-exist-1ff50a30e3b0'));
  inspectedPages = inspectedPages.concat(await checkLink('https://medium.com/@fagnerbrack/the-strictness-principle-9997e483cafb'));
  inspectedPages = inspectedPages.concat(await checkLink('https://medium.com/@fagnerbrack/one-commit-one-change-3d10b10cebbf'));
  await waitForMilliseconds(5000);

  inspectedPages = inspectedPages.concat(await checkLink('https://medium.com/@fagnerbrack/why-small-modules-matter-4e4d629321b8'));
  inspectedPages = inspectedPages.concat(await checkLink('https://medium.com/@fagnerbrack/wittgenstein-s-beetle-in-software-engineering-dcea89a5db92'));
  inspectedPages = inspectedPages.concat(await checkLink('https://medium.com/@fagnerbrack/why-aligning-statements-will-haunt-you-c7385a3b24d'));
  inspectedPages = inspectedPages.concat(await checkLink('https://medium.com/@fagnerbrack/promises-sync-code-disaster-e9d41a3c7279'));
  inspectedPages = inspectedPages.concat(await checkLink('https://medium.com/hackernoon/promises-are-not-proxies-fd00751eb980'));

  for (const inspectedPage of inspectedPages) {
    console.log('Broken page: ', inspectedPage.url);
    console.log('Broken links: ', inspectedPage.brokenLinks);
  }
}());
