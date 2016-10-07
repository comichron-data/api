# comichron-data/api

JSON api for monthly sales data from comichron.com

## Routes

Prepend `http://comichron-data.github.io` to all routes shown below to form the full url.

### `/api/titles.json`

List of all comics in the api, sorted by title.

#### Example

```js
[
  {
    "id": "saga-image",
    "title": "Saga",
    "publisher": "Image"
  },
  {
    "id": "shutter-image",
    "title": "Shutter",
    "publisher": "Image"
  },
  // and so on
]
```

### `/api/titles/{id}/by-issue.json`

Comic's sales numbers by issue.

- `id` is the comic's id (see `/api/titles.json`)

#### Example

```js
[
  {
    "issue": 1,
    "count": 5000
  },
  {
    "issue": 2,
    "count": 4000
  },
  // and so on
]
```

### `/api/titles/{id}/by-month.json`

Comic's sales numbers by month.

- `id` is the comic's id (see `/api/titles.json`)

#### Example

```js
[
  {
    "year": 2012,
    "month": 3,
    "count": 37641
  },
  {
    "year": 2012,
    "month": 4,
    "count": 46526
  },
  // and so on
]
```

### `/api/source-data/{year}-{month}.json`

Data scraped from comichron. All other routes are based on this data.

- `year` is a 4 digit year.
- `month` is a 2 digit month (e.g. `02`, `11`). January is `01`.

#### Example

```js
[
  {
    "rank": 1,
    "title": "Star Wars Shattered Empire",
    "id": "star-wars-shattered-empire-marvel",
    "issue": 1,
    "price": "$3.99",
    "publisher": "Marvel",
    "count": 208884
  },
  {
    "rank": 2,
    "title": "Star Wars",
    "id": "star-wars-marvel",
    "issue": 9,
    "price": "$3.99",
    "publisher": "Marvel",
    "count": 135817
  },
  // and so on
]
```

## FAQ

### Where did this data come from?

It was compiled by the fine folks at http://www.comichron.com/.

### How good is this data?

Good but not great.

- If a comic didn't sell enough to make the top ~300 for a given month, there is no data for it. So it looks like zero when it could have been a couple thousand.
- Issues that come out early in the month will have better by-month numbers than issues coming out later in the month.
- The numbers do not include digital sales.
- The numbers do not include sales outside of North America.

More discussion [here](http://www.comichron.com/faq.html).

### What about comics that reuse issue numbers?

The by-issue data for that comic will be weird.

## Related Projects

- Graphs - https://comichron-data.github.io/graphs/
- Browser client - https://github.com/comichron-data/browser-client
