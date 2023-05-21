<a name="readme-top"></a>

***NOTE: The backend  of the MovieRate can be found [here](https://github.com/2022-csc-59866/movierate/tree/main/backend)!***
***NOTE: The frontend of the MovieRate can be found [here](https://github.com/2022-csc-59866/movierate/tree/main/frontend)!***

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]
[![GitHub][github-shield]][github-url]

# [MovieRate](https://app.movierate.tv/) | Movie Review Platform

<br />
<div align="center">
  <a href="https://app.movierate.tv/">
    <img src="logo.png" alt="Logo" width="200" height="80">
  </a>

<h3 align="center">MovieRate</h3>

  <p align="center">
    MovieRate is a movie review platform to give the chance to people to rate movies/series and also make them aware if something is worth the time, effort, and money to watch.
    <br />
    <a href="https://github.com/GeorgiosIoannouCoder/movierate-backend"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://app.movierate.tv/">View Web Application</a>
    ·
    <a href="https://github.com/GeorgiosIoannouCoder/movierate-backend/issues">Report Bug</a>
    ·
    <a href="https://github.com/GeorgiosIoannouCoder/movierate-backend/issues">Request Feature</a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#key-features">Key Features</a></li>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

## About The Project

[![Product Name Screen Shot][product-screenshot]](https://app.movierate.tv/)

### MovieRate tries to solve the following problem statement in the film industry

- **People need to be aware of what they are going to watch so that they know if that movie or series is worth watching!**

### Key Features

1. **Directors must be able to create an account:**
    - Insert pictures and videos to promote their movies or series.
    - Include the cast.
    - Insert the release date.
    - Include the genres.
    - Insert language.
    - Insert film rating.
    - Edit a movie or series.
    - Delete a movie or series.
    - Add actors.
    - Edit actors.
    - Delete actors.
2. **Allow movies and series to be featured on the carousel of the home page of the full-stack application.**
3. **Allow users to create an account and also give them the option to sign in using a One Time Password (OTP).**
4. **Display streaming sercives using the public APIs WatchMode API and Streaming Availability API.**
5. **A fully functional review system for each movie and series. Enable users to write reviews and comments for each movie and series.**
6. **Reset password functionality for both the director account and the user account.**
7. **Infinite scroll to fetch more movies, series, and actors as users keep scrolling down the list.**
8. **Dark mode functionality where a button will allow users to toggle between light and dark mode.**
9. **Live search functionality where users can search for movies, series, and actors.**
10. **Create movies/series/documentaries.**
11. **Create actors.**
12. **Give the ability to users to become Admins and contribute to the open soruce moview review platform MovieRate.**
13. **Third-party Authentication using Passport.js for Google and GitHub.**
14. **Fully functional and responsive web application with the main focus on desktops, mobile devices, and tables.**

<p align="right"><a href="#readme-top">Back to top</a></p>

### Built With

[![Figma][Figma]][Figma-url]
[![Postman][Postman]][Postman-url]
[![MongoDB][MongoDB]][MongoDB-url]
[![Node][Node.js]][Node-url]
[![Express][Express.js]][Express-url]
[![JWT][JWT]][JWT-url]
[![Passport][Passport]][Passport-url]
[![JavaScript][Javascript]][Javascript-url]
[![HTML][HTML]][HTML-url]
[![CSS][CSS]][CSS-url]
[![React][React]][React-url]
[![ReactIcons][ReactIcons]][ReactIcons-url]
[![TailwindCSS][TailwindCSS]][TailwindCSS-url]
[![Nodemailer][Nodemailer]][Nodemailer-url]
[![Mailtrap][Mailtrap]][Mailtrap-url]
[![Brevo][Brevo]][Brevo-url]
[![Cloudinary][Cloudinary]][Cloudinary-url]
[![Git][Git]][Git-url]
[![Heroku][Heroku]][Heroku-url]
[![Namecheap][Namecheap]][Namecheap-url]
[![WatchModeAPI][WatchModeAPI]][WatchModeAPI-url]
[![StreamingAvailabilityAPI][StreamingAvailabilityAPI]][StreamingAvailabilityAPI-url]

<p align="right"><a href="#readme-top">Back to top</a></p>

## Getting Started

**To get a local copy of MovieRate up and running locally follow these simple example steps:**

### Prerequisites

**NOTE:** How to check if Node and NPM are installed and what is their versions

```sh
  node -v
  npm -v
```

**NOTE:** How to check if Git is installed and what is its version

```sh
  git -v
```

1. Please make sure you have Node installed and use Node version: **v16.15.0**
    - You can use nvm to switch between different node versions:
      - Windows: [https://github.com/coreybutler/nvm-windows](https://github.com/coreybutler/nvm-windows)
      - Mac: [https://www.youtube.com/watch?v=BhLFxy6Jz8c](https://www.youtube.com/watch?v=BhLFxy6Jz8c)
      - Linux: [https://www.youtube.com/watch?v=tm1XllMkbAU](https://www.youtube.com/watch?v=tm1XllMkbAU)

1. Please make sure you have NPM installed (it usually comes with Node installation)

    ```sh
      npm install npm@latest -g
    ```

1. Please make sure you have git installed
    - Windows: [https://git-scm.com/download/win](https://git-scm.com/download/win)
    - Mac: [https://git-scm.com/download/mac](https://git-scm.com/download/mac)
    - Linux: [https://git-scm.com/download/linux](https://git-scm.com/download/linux)

1. Please make sure you have MongoDB Compass installed
    - MongoDB Compass: [https://www.mongodb.com/try/download/compass/](https://www.mongodb.com/try/download/compass)

### Installation

#### APIs

1. Get a free WatchMode API Key at [https://rapidapi.com/meteoric-llc-meteoric-llc-default/api/watchmode](https://rapidapi.com/meteoric-llc-meteoric-llc-default/api/watchmode) or at [https://api.watchmode.com](https://api.watchmode.com). (for getting Streaming Services)

1. Get a free Streaming Availability API Key at [https://rapidapi.com/movie-of-the-night-movie-of-the-night-default/api/streaming-availability](https://rapidapi.com/movie-of-the-night-movie-of-the-night-default/api/streaming-availability). (for getting Streaming Services)

1. Get a free Mailtap API Username and Password at [https://mailtrap.io/signin](https://mailtrap.io/signin). (for sending emails during production. Switch to **Brevo** for deployment.)

1. Get a free Cloudinary Username, API Key, and API Secret at [https://cloudinary.com](https://cloudinary.com). (for uploading and storing images and videos)

1. Get a free Google API Key at [https://console.developers.google.com](https://console.developers.google.com). (for Google third-party authentication)
    - When you sign-in to [https://console.developers.google.com](https://console.developers.google.com) create a new project.
    - Create OAuth 2.0 Client IDs.
    - Set Authorized JavaScript origins to: http://localhost:3000
    - Set Authorized redirect URIs to: http://localhost:8000/auth/google/callback

1. Get a free GitHub API Key at [https://github.com/settings/developers](https://github.com/settings/developers). (for GitHub third-party authentication)
    - When you sign-in to [https://github.com/settings/developers](https://github.com/settings/developers) create a new project.
    - Create OAuth 2.0 Client ID and Client Secret.
    - Set Homepage URL to: http://localhost:3000
    - Set Authorization callback URL to: http://localhost:8000/auth/github/callback

#### SetUp

1. Navigate to the directory where you want to clone/run/save the application

    ```sh
    cd your_selected_directory
    ```

1. Clone this repository (backend)

   ```sh
   git clone https://github.com/GeorgiosIoannouCoder/movierate-backend.git
   ```

1. Clone this repository (frontend)

   ```sh
   git clone https://github.com/GeorgiosIoannouCoder/movierate-frontend.git
   ```

1. Navigate to the movierate-backend git repository

   ```sh
   cd movierate-backend
   ```

1. Git chekout to the first version/commit of this repository (backend) because now it is setup for deployment

   ```sh
   git checkout ecc661073823ba01d74a483a6c7fda0405473853
   ```

1. Install NPM packages

   ```sh
   npm i
   ```

1. Create a .env file inside the movierate-backend directory

    ```js
    MONGO_URI=mongodb://127.0.0.1:27017/movierate_db
    JWT_SECRET=here_have_a_random_secret_code
    MAIL_TRAP_USER=user_get_it_from_mailtrap
    MAIL_TRAP_PASS=password_get_it_from_mailtrap
    CLOUD_NAME=name_get_it_from_cloudinary
    CLOUD_API_KEY=api_key_get_it_from_cloudinary
    CLOUD_API_SECRET=api_secret__get_it_from_cloudinary
    GOOGLE_CLIENT_ID=client_id_get_it_from_google
    GOOGLE_CLIENT_SECRET=client_secret_get_it_from_google
    GITHUB_CLIENT_ID=client_id_get_it_from_github
    GITHUB_CLIENT_SECRET=client_secret_get_it_from_github
    ```

1. Run the backend server application (running at port 8000)

   ```sh
   npm start
   ```

1. Open MongoDB Compass and connect to the URI mongodb://127.0.0.1:27017/movierate_db. Here you will see your database movierate_db being created and storing the data of the web application

1. Open a second terminal

1. Navigate to the directory selected at Step 1

   ```sh
   cd directory_selected_at_step_1
   ```

1. Navigate to the movierate-frontend git repository

   ```sh
   cd movierate-frontend
   ```

1. Git chekout to the first version/commit of this repository (fronted) because now it is setup for deployment

   ```sh
   git checkout 649e6c09590d49a63d25226f0df844e6cb2c7297
   ```

1. Install NPM packages

   ```sh
   npm i
   ```

1. Run the frontend application (running at port 3000)

   ```sh
   npm start
   ```

<p align="right"><a href="#readme-top">Back to top</a></p>

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right"><a href="#readme-top">Back to top</a></p>

## License

Distributed under the MIT License. See [LICENSE](https://github.com/GeorgiosIoannouCoder/movierate-backend/blob/master/LICENSE) for more information.

MIT License

Copyright (c) 2023 Georgios Ioannou

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

<p align="right"><a href="#readme-top">Back to top</a></p>

## Contact

Georgios Ioannou - [@LinkedIn](https://linkedin.com/in/georgiosioannoucoder)

Georgios Ioannou - [@georgiosioannoucoder](https://georgiosioannoucoder.github.io/) - Please contact me via the form in my portfolio.

Project Link: [https://github.com/GeorgiosIoannouCoder/movierate-backend](https://github.com/GeorgiosIoannouCoder/movierate-backend)

<p align="right"><a href="#readme-top">Back to top</a></p>

[contributors-shield]: https://img.shields.io/github/contributors/GeorgiosIoannouCoder/movierate-backend.svg?style=for-the-badge
[contributors-url]: https://github.com/GeorgiosIoannouCoder/movierate-backend/graphs/contributors

[forks-shield]: https://img.shields.io/github/forks/GeorgiosIoannouCoder/movierate-backend.svg?style=for-the-badge
[forks-url]: https://github.com/GeorgiosIoannouCoder/movierate-backend/network/members

[stars-shield]: https://img.shields.io/github/stars/GeorgiosIoannouCoder/movierate-backend.svg?style=for-the-badge
[stars-url]: https://github.com/GeorgiosIoannouCoder/movierate-backend/stargazers

[issues-shield]: https://img.shields.io/github/issues/GeorgiosIoannouCoder/movierate-backend.svg?style=for-the-badge
[issues-url]: https://github.com/GeorgiosIoannouCoder/movierate-backend/issues

[license-shield]: https://img.shields.io/github/license/GeorgiosIoannouCoder/movierate-backend.svg?style=for-the-badge
[license-url]: https://github.com/GeorgiosIoannouCoder/movierate-backend/blob/master/LICENSE

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=0077B5
[linkedin-url]: https://linkedin.com/in/georgiosioannoucoder

[github-shield]: https://img.shields.io/badge/-GitHub-black.svg?style=for-the-badge&logo=github&colorB=000
[github-url]: https://github.com/GeorgiosIoannouCoder/

[product-screenshot]: logo.png

[Figma]: https://img.shields.io/badge/figma-a259ff?style=for-the-badge&logo=figma&logoColor=1abcfe
[Figma-url]: https://www.figma.com/

[Postman]: https://img.shields.io/badge/postman-000000?style=for-the-badge&logo=postman&logoColor=orange
[Postman-url]: https://www.postman.com/

[MongoDB]: https://img.shields.io/badge/mongodb-001e2b?style=for-the-badge&logo=mongodb&logoColor=00ed64
[MongoDB-url]: https://www.mongodb.com/

[Node.js]: https://img.shields.io/badge/node.js-303030?style=for-the-badge&logo=nodedotjs&logoColor=3c873a
[Node-url]: https://nodejs.org/en

[Express.js]: https://img.shields.io/badge/express.js-000000?style=for-the-badge&logo=express&logoColor=ffffff
[Express-url]: https://expressjs.com/

[JWT]: https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens
[JWT-url]: https://jwt.io/

[Passport]: https://img.shields.io/badge/passport.js-000000?style=for-the-badge&logo=passport&logoColor=d4fd02
[Passport-url]: https://www.passportjs.org/

[JavaScript]: https://img.shields.io/badge/javascript-323330?style=for-the-badge&logo=javascript&logoColor=f0db4f
[JavaScript-url]: https://www.javascript.com/

[HTML]: https://img.shields.io/badge/html-e34c26?style=for-the-badge&logo=html5&logoColor=ffffff
[HTML-url]: https://developer.mozilla.org/en-US/docs/Web/HTML

[CSS]: https://img.shields.io/badge/css-ffffff?style=for-the-badge&logo=css3&logoColor=264de4
[CSS-url]: https://developer.mozilla.org/en-US/docs/Web/CSS

[React]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://react.dev/

[ReactIcons]: https://img.shields.io/badge/react--icons-e91e63?style=for-the-badge
[ReactIcons-url]: https://react-icons.github.io/react-icons/

[TailwindCSS]: https://img.shields.io/badge/tailwindcss-ffffff?style=for-the-badge&logo=tailwindcss&logoColor=07b6d5
[TailwindCSS-url]: https://tailwindcss.com/

[Nodemailer]: https://img.shields.io/badge/nodemailer-000000?style=for-the-badge&logo=nodemailer&logoColor=07b6d5
[Nodemailer-url]: https://nodemailer.com/about/

[Mailtrap]: https://img.shields.io/badge/mailtrap-000000?style=for-the-badge&logo=mailtrap&logoColor=07b6d5
[Mailtrap-url]: https://mailtrap.io/

[Brevo]: https://img.shields.io/badge/brevo-ffffff?style=for-the-badge&logo=sendinblue&logoColor=07b6d5
[Brevo-url]: https://www.brevo.com/

[Cloudinary]: https://img.shields.io/badge/cloudinary-000000?style=for-the-badge&logo=cloudinary&logoColor=07b6d5
[Cloudinary-url]: https://cloudinary.com/

[Git]: https://img.shields.io/badge/git-000000?style=for-the-badge&logo=git&logoColor=orange
[Git-url]: https://git-scm.com/

[Heroku]: https://img.shields.io/badge/heroku-6762A6?style=for-the-badge&logo=heroku&logoColor=ffffff
[Heroku-url]: https://www.heroku.com/

[Namecheap]: https://img.shields.io/badge/namecheap-000000?style=for-the-badge&logo=namecheap&logoColor=fe5803
[Namecheap-url]: https://www.namecheap.com/

[WatchModeAPI]: https://img.shields.io/badge/watchmode%20api-000000?style=for-the-badge
[WatchModeAPI-url]: https://api.watchmode.com/

[StreamingAvailabilityAPI]: https://img.shields.io/badge/streaming%20availability%20api-000000?style=for-the-badge
[StreamingAvailabilityAPI-url]: https://www.movieofthenight.com/about/api#:~:text=Streaming%20Availability%20API%20enables%20you,its%20TMDb%20or%20IMDb%20id.