<p align="center">
  <img src="https://github.com/uol-feps-soc-comp2913-2324s2-classroom/team-project-team-25/assets/87960642/ebd3e173-ec95-4e39-840a-bfbe13c58296" />
</p>
- Track 25 is a web app for users to upload, view and share their geolocation data, premium features are also offered.

# Technical Design
## Diagram of Technical Design
<img width="1475" alt="image" src="https://github.com/uol-feps-soc-comp2913-2324s2-classroom/team-project-team-25/assets/87960642/8477ef31-f047-4bea-b666-66457c54b540">

## Tech Stack and Explanation
- Fullstack framework: [NextJS](https://nextjs.org/)
    - Using the latest version NextJS 14 with [React Server Component](https://react.dev/reference/rsc/server-components)
    - Components are rendered on the server first, alleviating the pressure of rendering fully on the client side compared to older versions of `React`. Developers can opt out of server-side components by adding `use client` at the top of a file, giving them the flexibility to fully control the behavior of the app.
    - NextJS 14 introduced server actions, which are similar to the concept of `Rest APIs`, but now we can fetch data directly inside our components instead of using hooks like `useEffect`. However, `Rest APIs` can still be used in the app; we use them specifically when interacting with third-party services.
- Language: [TypeScript](https://www.typescriptlang.org/community/)
- Styling: [TailwindCSS](https://tailwindcss.com/), [ShadCN](https://ui.shadcn.com/)
    - `TailwindCSS` and `ShadCN` are among the modern choices for web development. Compared to traditional component libraries that are downloaded and hidden in `node_modules`, `ShadCN`, as a component library, exposes the source code of its components to developers, allowing them to fully customize the behavior of reusable web components.
- State management: [Zustand](https://zustand-demo.pmnd.rs/)
    - Used to improve the interactivity of the map, this allows the map to listen to and react to custom events. For example, when clicking the details of a track, the `Zustand store` dispatches an event that is listened to by the map to perform a zoom in.
- Database and Orm: [PostgreSQL](https://www.postgresql.org/), [DrizzleORM](https://orm.drizzle.team/)
    - `DrizzleORM` is one of the best choices for modern `TypeScript/JavaScript` backend development as it generates editable `SQL` for migrations, which allows developers to gain control of the process instead of black-boxing `SQL` queries
- Testing: [Jest](https://jestjs.io/), [Cypress](https://www.cypress.io/)
    - See full [testing explanation](https://github.com/uol-feps-soc-comp2913-2324s2-classroom/team-project-team-25/wiki/Testing). 
- Third Party Services
    - Map: [Mapbox](https://www.mapbox.com/)
    - Payment: [Stripe](https://dashboard.stripe.com/dashboard)
    - File Storage and Hosting: [Vercel](https://vercel.com)
    - CI/CD: [Github Actions](https://github.com/features/actions)


## Feature Implementation Design
### Authentication
<img width="1575" alt="image" src="https://github.com/uol-feps-soc-comp2913-2324s2-classroom/team-project-team-25/assets/87960642/b101f026-39ec-4430-9c21-36b2e6bcc801">

- When a user performs a register or login form action, client-side validation is first performed before the form submission reaches the server. This validation checks whether the form values are acceptable.
- When the form submission reaches the server, server-side validation is performed, checking the form values. For registrations, the server checks whether there are duplicate usernames, while for login, it checks whether the user exists and if the password is correct. The server then attempts to generate a sessionId and a userId (the latter only during registration) and stores them in the database. 
- If an error occurs, the server responds with error messages, and the client renders a toast with error information. 
- If no error occurs, the server sets the cookie and returns success to the client; the client will then be redirected to the main app page.
 
### File
<img width="1363" alt="image" src="https://github.com/uol-feps-soc-comp2913-2324s2-classroom/team-project-team-25/assets/87960642/e0dc1ae6-1c54-494c-af64-f121b110e995">

- When a user performs an upload file action, the client first performs client-side validation to check whether the file is a valid `GPX` file. Then the form submission reaches an API that interacts with the `Vercel Blob` file storage service to store the file. Upon successful upload, `Vercel storage` returns the download URL of the file.
- With the success API call for uploading the file, another API to update the data is then been called, which parses the data of the `GPX` file to calculate the distance and elevation change of it. The API then submits the data to the database. Upon successful submission, message are sent back to the client and a toast is rendered.
- When user performs a download file actions, the client directly call the download URL provided by `Vercel Storage` and performs a download. 

### Map Rendering
<img width="1538" alt="image" src="https://github.com/uol-feps-soc-comp2913-2324s2-classroom/team-project-team-25/assets/87960642/e621a61b-75d9-49d0-a189-1bcd9018dd81">

- When a user interacts with the map-related part of the website, the state of the app changes and triggers an action dispatched by the `Zustand store`, which is then listened to by the map to perform the corresponding action.
- When a user successfully uploads a file, the track state of the app changes since the total number of tracks to display has increased. The `Zustand store` dispatches an action to re-render the map and zoom in on the track just uploaded.
- When a user switches between the light and dark color themes of the map or changes data to view between 'my tracks' and 'all tracks', the `Zustand store` dispatches an action to re-render the whole map.
- When a user clicks on the sidebar to view details of a track or interacts directly with the map to view map details, the zoom state of the map changes, and the `Zustand store` dispatches an action to zoom the map to the corresponding track. And when the user clicks the back button, another zoom action is dispatched, zooming out the map to the original state.

### Payment
<img width="1251" alt="image" src="https://github.com/uol-feps-soc-comp2913-2324s2-classroom/team-project-team-25/assets/87960642/b64e234b-663b-4ca1-9aad-48fab03b2567">

- When a user wants to subscribe or change their subscription plan, the user will be redirected to a checkout session managed by Stripe. Upon successful payment, the user will be redirected back to an info page showing the details of their subscription. Then, a server action is called to update the subscription info in the database.
- When a user wants to cancel a subscription, a server action is called to cancel the subscription by interacting with the Stripe service. The server then updates the state of the subscription in the database.
- When a user logs in or enters the app, a validation of the subscription status is automatically performed to validate the state of the user.

### Social(friends, groups, track sharing)
<img width="1195" alt="image" src="https://github.com/uol-feps-soc-comp2913-2324s2-classroom/team-project-team-25/assets/87960642/068103ac-7223-4724-bb0e-806a321ae4c7">