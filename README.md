![Logo](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/th5xamgrr6se0x5ro4g6.png)

# GQLink - GraphQL Made Easy

GQLink is a package that simplifies the process of exposing GraphQL server functions to clients, while ensuring type safety. It is designed to integrate seamlessly and is easy to set up. In addition, GQLink enables live synchronization during development, which enhances collaboration between team members. Overall, GQLink makes it easier for developers to work with GraphQL by simplifying the integration process and providing a more efficient workflow.

## Features

- Light/dark mode toggle
- Live previews
- Fullscreen mode
- Cross platform

## Installation & Setup Process

Install the package using npm

```bash
  npm install gqlink
```

### Setup Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`GQLINK_API` (Pointing to a GQLink Enabled Server)

### Add custom start script

To run this package on development environment, please setup your dev script like so:

#### NextJS Example

```bash
  "dev": "gqlink npm run dev"
```

For any other solutions, you'd place your commands after **gqlink**. Simply run _npm run dev_ to get GQLink started.

## Usage/Examples

GQLink will expose all your API functions in frontend. Each function has three params you can pass in. First two params are required and has type validations. The last param being an optional, extra for headers you can pass in (Eg. Auth Token).

- First param- input: `{ first_input: data, second_input: secondData }`
- Second param - expectedResult: `"{ first_name, last_name, cars { _id, name, color } }"`
- Headers - headers: `{ "Content-Type": "application/json" }`;

### Eg. 1 - Vanilla React

```javascript
// Simply import your GraphQL functions with import
import { User } from "@gqlink/types";
import { getUser } from "@gqlink/methods"; // These are functions fetched from your API

export default function Home() {
    const [userData, setUserData] = useState(null);

    const useEffect(() => {
        getUser({ userId: "63fbf65276cc59134a9ce167" },
        `{
            verified,
            _id,
            first_name,
            email,
        }`).then(user => setUserData(user));
    }), [];

    return (
        <div>
            <p>User's name is {userData?.first_name}</span>
        </div>
    );
}
```

### Eg. 1 - Using React Query

```javascript
// Simply import your GraphQL functions with import
import { User } from "@gqlink/types";
import { getUser } from "@gqlink/methods"; // These are functions fetched from your API

export default function Home() {
    const [userData, setUserData] = useState(null);

    const useEffect(() => {
        getUser({ userId: "63fbf65276cc59134a9ce167" },
        `{
            verified,
            _id,
            first_name,
            email,
        }`).then(user => setUserData(user));
    }), [];

    return (
        <div>
            <p>User's name is {userData?.first_name}</span>
        </div>
    );
}
```
