const linkinator = require('linkinator');
const allPosts = require('./all-posts.json');

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

  // checker.on('link', result => {
  //   console.log(`${result.url} ${result.status} (${result.state})`);
  // });

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

  if (brokenLinks.length) {
    process.stdout.write(`\x1b[31mDetected ${brokenLinks.length} broken links.\x1b[0m\n`);
  }

  return { url: link, brokenLinks: brokenLinks };
};

(async function() {
  let inspectedPages = [];

  for (const postLink of allPosts) {
    inspectedPages = inspectedPages.concat(await checkLink(postLink));
    await waitForMilliseconds(1000);
  }

  for (const inspectedPage of inspectedPages) {
    console.log('-----------------------')
    console.log('Broken page: ', inspectedPage.url);
    console.log('Broken links: ', inspectedPage.brokenLinks);
    console.log('-----------------------')
  }
}());
