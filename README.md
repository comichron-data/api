# comichron-data/api

JSON api for monthly sales data from comichron.com

## Client

See [comichron-data/browser-client](https://github.com/comichron-data/browser-client) for a browser client.

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
- `month` is a 2 digit month (e.g. `02`, `11`)

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
