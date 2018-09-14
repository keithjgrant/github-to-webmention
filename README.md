# Github to Webmention

Send [webmentions](https://www.w3.org/TR/webmention) for new and updated posts on a static site.

This is still in a proof of concept stage, but it is working. I will clean it up and flush out documentation soon.

Variable | Description
-------- | -----------
`PORT` | Port number
`BRANCH_NAME` | Git branch name to watch (defaults to `master`)
`CONTENT_DIRECTORY` | The directory in your repository to monitor for changes
`WEBSITE_URL` | URL where your site is hosted
`RETRY_DELAY_SECONDS` | If your page is not found, number of seconds to wait before retrying (defaults to `45`)
`MAX_RETRIES` | If your page is not found, max number of times to retry (defaults to `5`)

This app assumes you have some sort of automatic build of your site from GitHub, whether GitHub pages, Netlify, or some other service. Because builds can take a little time to finish and publish, your newly posted pages may not be available as soon as GitHub notifies _github-to-webmention_ of the change. If your page is not found, _github-to-webmention_ will wait and retry several times until it is found (or `MAX_RETRIES` is exceeded).
