# Artist Resource

### Artist model:
| Name      | Type   |
| --------- | ------ |
| authorId  | string |
| name      | string |
| pseudonym | string |
| surname   | string |


## Get list of all artists
Endpoint: `GET /authors`

Response type: `Artist[]`

Example response:
```json
[
    {
        "authorId": "f68be8aa-a45e-4de6-91bc-b7b2516b64fd",
        "name": "imie",
        "pseudonym": null,
        "surname": "nazwisko"
    },
    {
        "authorId": "f68be8aa-a45e-4de6-91bc-elonifdfs4fd",
        "name": "author",
        "pseudonym": "sebix",
        "surname": null
    }
]
```

## Create new artist
Endpoint: `POST /authors`

### Params:
| Name      | Type   | Required? | Default Value |
| --------- | ------ | --------- | ------------- |
| name      | string | no*       | null          |
| pseudonym | string | no*       | null          |
| surname   | string | no*       | null          |



### Example request
```json
{
    "name": "imie",
    "surname": "nazwisko"
}
```

### 201 Created
Created author
```json
{
    "authorId": "f68be8aa-a45e-4de6-91bc-b7b2516b64fd",
    "name": "imie",
    "pseudonym": null,
    "surname": "nazwisko"
}
```

### 303 See Other
There's author with that data
```http
HTTP/1.1 303 See Other
Location: /authors/f68be8aa-a45e-4de6-91bc-b7b2516b64fd
```


### 400 Bad Request
There's problem in your JSON
```json
{
  "errors": [
    {
      "message": "Unexpected string in JSON at position 13"
    }
  ]
}
```

### 422 Unprocessable Entity
Provided wrong data
```json
{
  "type": "about:blank",
  "title": "Unprocessable Request Body",
  "detail": "Missing Props",
  "instance": "hOqYXWu",
  "errors": [
    {
      "code": "Missing one or more",
      "detail": "Missing one of props: name, pseudonym or surname",
      "pointer": "#/-"
    }
  ]
}
```
