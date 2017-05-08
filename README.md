# comichron-data/api

JSON api for monthly sales data from comichron.com

## Routes

See [urls.md](https://github.com/comichron-data/api/blob/master/urls.md).

## Versioning

The version number of this api is in [`package.json`](https://github.com/comichron-data/api/blob/master/package.json#L3).

This project follows Semver

- Major version number changes - Existing API clients may be broken and should be updated
- Minor version number changes - No change necessary to existing clients
- Patch version number changes - No change necessary to existing clients

## FAQ

### 1. Where did this data come from?

It was compiled by the fine folks at http://www.comichron.com/.

### 2. How good is this data?

Good but not great.

- If a comic didn't sell enough to make the top ~300 for a given month, there is no data for it. So it looks like zero when it could have been a couple thousand.
- Issues that come out early in the month will have better by-month numbers than issues coming out later in the month.
- The numbers do not include digital sales.
- The numbers do not include sales outside of North America.

More discussion [here](http://www.comichron.com/faq.html).

### 3. What about comics that reuse issue numbers?

The by-issue data for that comic will be weird.

## Related Projects

https://github.com/comichron-data
