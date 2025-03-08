import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getLandingPage(): string {
    return `
      <!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SUPMAP - Real-time Navigation System</title>
      <link rel="icon" type="image/png" href="/favicon.ico" />
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        color: #333;
        margin: 0;
        padding: 20px;
        text-align: center;
      }
      .container {
        max-width: 800px;
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        margin: auto;
      }
      h1 {
        color: #0073e6;
      }
      img {
        max-width: 200px;
        margin-bottom: 20px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }
      th,
      td {
        border: 1px solid #ddd;
        padding: 10px;
        text-align: left;
      }
      th {
        background-color: #0073e6;
        color: white;
      }
      a {
        color: #0073e6;
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <img src="/logo-full-white.png" alt="SUPMAP Logo">

      <h1>SUPMAP - Real-time Navigation System</h1>
      <p>
        Welcome to the <strong>SUPMAP API</strong> ! 
      </p>

      <h2>Project Documentation</h2>
      <p>
        You can find the API documentation for SUPMAP on the Swagger page:
        <a href="/api">/api</a>

      <h2>Project Repositories</h2>
      <table>
        <tr>
          <th>Repository</th>
          <th>Description</th>
        </tr>
        <tr>
          <td>
            <a href="https://github.com/SUPMAP-DELTA-FORCE/supmap-backend.git"
              >Backend</a
            >
          </td>
          <td>
            This repository hosts the backend services, including APIs and
            database management for SUPMAP.
          </td>
        </tr>
        <tr>
          <td>
            <a
              href="https://github.com/SUPMAP-DELTA-FORCE/supmap-mobile-app.git"
              >Mobile App</a
            >
          </td>
          <td>
            The mobile application repository, designed for both Android and
            iOS, providing real-time navigation and traffic updates on the go.
          </td>
        </tr>
        <tr>
          <td>
            <a href="https://github.com/SUPMAP-DELTA-FORCE/supmap-webapp.git"
              >Webapp</a
            >
          </td>
          <td>
            The web-based interface for users to access SUPMAP’s features
            through a browser.
          </td>
        </tr>
      </table>
    </div>
  </body>
</html>

    `;
  }
}
