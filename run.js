const fs = require('fs');
const linkinator = require('linkinator');
const allPosts = require('./all-posts.json');
const alreadyChecked = require('./already-checked.json');

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

    // For some reason a lot of links have this status, mot sure why
    .filter(link => link.status !== 409)

    // Linkedin always returns status 999 for machine requests
    .filter(link => link.status !== 999);

  if (brokenLinks.length) {
    process.stdout.write(`\x1b[31mDetected ${brokenLinks.length} broken links.\x1b[0m\n`);
  }

  return { url: link, brokenLinks: brokenLinks };
};

(async function() {
  let inspectedPages = [];

  for (const postLink of allPosts) {
    if (!alreadyChecked[postLink]) {
      inspectedPages = inspectedPages.concat(await checkLink(postLink));
      alreadyChecked[postLink] = true;
      fs.writeFileSync('./already-checked.json', JSON.stringify(alreadyChecked, null, 4), { encoding: 'UTF-8' });
      await waitForMilliseconds(1000);
    }
  }

  for (const inspectedPage of inspectedPages) {
    console.log('-----------------------')
    console.log('Inspected page: ', inspectedPage.url);
    console.log('Broken links: ', inspectedPage.brokenLinks);
    console.log('-----------------------')
  }

  console.log('Dead link check: Done!');
}());
