# hotel-data-merge

The objective of the applications is shown as below:

- Querying multiple hotels data from different sources
- Building a complete data set from different data sources
- Sanitizing and remove dirty data

### Tech stack

- Node.JS
- Express
- Typescript
- [Vitest](https://vitest.dev/guide/).

### Prerequisites

Ensure [Node.js](https://nodejs.org/en/) installed.

#### Step-by-step

1. Clone this repository with command below, can copy and paste to the cmd.

```bash
git clone https://github.com/wng97/hotel-data-merge.git
```

2. Open up the folder in VS code

3. Install dependencies

```bash
npm install
```

4. Run up the app

```bash
npm run dev
```

5. The server will listening on port `5001`. Can start playing around with the API, enjoy!

### API Design

There is only 1 API.

```bash
POST http://localhost:5001/hotels
```

Request body:

- **ids** : string[], optional
- **destination_id** : number, optional
- **These two request body params must provide atleast one**

### Solution Design

1. Firstly the application will fetch the data from those 3 API.
2. Then the data will be formatted to key-value pairs with data source as the key and responses as the value, example:

```bash
{
  "acme":[{id: "abcd", ...}]
}
```

3. After that, application will pass the formatted data to `hotelDataIntegrationFactory` to sanitize, normalize and merge the data based on the data source.

4. All the completed data will be saved into the memory cache with key-value pairs, example:

```bash
{
  "iJhz":{id: "iJhz", ...}
}
```

5. After the data has been loaded into the cache, the data will be get from the cache by the ids provided from the request body.

### Final Data Format

- **_id_**: string
- **_destination_id_**: number
- **_name_**: string
- **_location_**: Object
  - **_address_**: string
  - **_city_**: string
  - **_country_**: string
  - **_postal_code_**: string
  - **_latitude_**: number
  - **_longitude_**: number
- **_description_**: string
- **_amenities_**: string[]
- **_images_**: Object
  - **_rooms_**: Object[]
    - **_url_**: string
    - **_captions_**: string
  - **_amenities_**: Object[]
    - **_url_**: string
    - **_captions_**: string
- **_notes_**: string[]

### Merging Techniques

- **_id_**: No merging needed
- **_destination_id_**: No merging needed
- **_name_**: Take the longer value
- **_location.address_**: Take the longer value
- **_location.city_**: Take the longer value
- **_location.country_**: Take the longer value
- **_location.postal_code_**: Take the longer value
- **_location.latitude_**: Take the value type which equal to number
- **_location.longitude_**: Take the value type which equal to number
- **_description_**: Take the longer value
- **_amenities_**: Filter out duplicated value(Case sensitive) and merge the rest
- **_images.rooms_**: Filter out duplicated value by using url and merge the rest
- **_images.amenities_**: Filter out duplicated value by using url and merge the rest, merging images.amenities and images.site
- **_notes_**: Filter out duplicated value and merge the rest

### Unit Test

Unit test for this project is using [vitest](https://vitest.dev/guide/).

```bash
# to run up unit test
npm run test

# to run up test coverage
npm run coverage
```
