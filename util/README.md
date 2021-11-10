# SolidPG
This folder contains utility shell scripts for interacting with a Solid account from the command line

### Content of `solid-pg/util`
The following are the files contained in the `solid-pg/util` folder:
##### Shell:
- `create_container.sh` [`DEFUNCT`]:
  - Input:
    - First ($1): Target endpoint
    - Second ($2): Container (folder) name
  - Output: `N/A`
  - Effect: Creates new container as child of target endpoint
  - Sample Call: `./create_container.sh https://${SOLID_USER}.solid.inrupt.net/public/ ${FOLDER_NAME}`
- `delete.sh`:
  - Input:
    - First ($1): Target file location
  - Output: `N/A`
  - Effect: Deletes file at target location
  - Sample Call: `./delete.sh https://${SOLID_USER}.solid.inrupt.net/public/${TARGET_FILE}`
- `get.sh`:
  - Input:
    - First ($1): Target file location
  - Output: Content of file at target location
  - Effect: Fetches content of file at target location and writes result to standard output
  - Sample Call: `./get.sh https://${SOLID_USER}.solid.inrupt.net/public/${TARGET_FILE}`
- `head.sh`:
  - Input:
    - First ($1): Target file location
  - Output: Response status and header information of file at target location
  - Effect: Fetches response status and header information of file at target location and writes result to standard output
  - Sample Call: `./head.sh https://${SOLID_USER}.solid.inrupt.net/public/${TARGET_FILE}`
- `login.sh`:
  - Input:
    - First: config file (silently read from script)
  - Output: `N/A`
  - Effect: Authenticates user to Solid account
  - Sample Call: `./login.sh`
- `options.sh`:
  - Input:
    - First ($1): Target file location
    - Output: HTTP methods (`GET`, `HEAD`, `POST`, `PUT`, `DELETE`) that can be used for a resource located at target file location
  - Effect: Determine which HTTP method (`GET`, `HEAD`, `POST`, `PUT`, `DELETE`) can be used for a resource located at target file location
  - Sample Call: `./options.sh https://${SOLID_USER}.solid.inrupt.net/public/${TARGET_FILE}`
- `patch.sh`:
  - Input:
    - First ($1): Target file location
    - Second ($2): `SPARQL` file indicating `PATCH` query to perform on target file
  - Output: Query result or `N/A`
  - Effect: Perform `PATCH` operation specified by `SPARQL` file
  - Sample Call: `./patch.sh https://${SOLID_USER}.solid.inrupt.net/public/${TARGET_FILE} ${SPARQL_QUERY}`
- `post.sh`:
  - Input:
    - First ($1): Target file location
    - Second ($2): Local file location containing `POST` body data
  - Output: `N/A`
  - Effect: Posts content of local file to target location
  - Sample Call: `./post.sh https://${SOLID_USER}.solid.inrupt.net/public/${TARGET_FILE} ${LOCAL_FILE}`

##### JSON:
- `json.js`: Utility module for `JSON` operations [useful for performing reading and writing operations on `config.json` during execution of `npm run setup`, `./login.sh`, and `post.sh`]
- `uri.js`: Utility module for `URI` operations [useful for extracting useful information from Solid WebID during execution of `npm run setup`, `./login.sh`, and `post.sh`]
