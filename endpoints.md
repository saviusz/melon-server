| Endpoint                 | GET                                    | POST                   | PUT | PATCH | DELETE                                                     |
| -----------------------  | -------------------------------------- | ---------------------- | --- | ----- | ---------------------------------------------------------- |
| /v1.0/songs              | 🚧 List of song titles and ids         | 🚧 New song            | ❌  | ❌    | ❌                                                         |
| /v1.0/songs/$id          | 🚧 Song by id (with default text)      | ❌                     | ❌  | ❌    | ❌                                                         |
| /v1.0/songs/$id/versions | 🚧 List of song version names and ids  | 🚧 New version of song | ❌  | ❌    | ❌                                                         |
| /v1.0/songs/$id/$ver     | 🚧 Song by id (with specified version) | ❌                     | ❌  | ❌    | ❌                                                         |
| /v1.0/users              | ❌                                     | 🚧 New user            | ❌  | ❌    | ❌                                                         |
| /v1.0/users/$id          | 🚧 User metadata                       | ❌                     | ❌  | ❌    | 🚧 Delete user (only logged in and current or privillaged) |
| /v1.0/authors            | 🚧 List of authors                     | ❌                     | ❌  | ❌    | ❌                                                         |

## `/v1.0/songs`

```json
[
  {
    "id": "----long-UUID----",
    "titles": ["mulitple", "titles"],
    "authors": [
      {
        "id": "----long-UUID----",
        "name": "Stanislaw",
        "surname": "Rutkowski",
        "pseudonym": "Rysiu"
      }
    ],
    "textAuthors": [
      {
        "id": "----long-UUID----",
        "name": "Stanislaw",
        "surname": "Rutkowski",
        "pseudonym": "Rysiu"
      }
    ]
  }
  // ...
]
```
