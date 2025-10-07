# Nmoji

Nmoji is a straightforward web application designed for quick emoji selection and filtering. This documentation provides an overview of the project, installation instructions, and contributing guidelines. 🔎😉

## Tech Stack

<table>
    <tr>
     <td>Frontend</td>
     <td><img src="https://skillicons.dev/icons?i=react,astro,typescript" /></td>
    </tr>
    <tr>
     <td>CI/CD</td>
     <td><img src="https://skillicons.dev/icons?i=netlify,githubactions" /></td>
    </tr>
</table>

## Table of Contents
- [Usage](#usage)
- [Contributing](#contributing)
  - [Forking the Repository](#forking-the-repository)
  - [Cloning the Repository](#cloning-the-repository)
  - [Creating a Branch](#creating-a-branch)
  - [Making Changes](#making-changes)
  - [Committing Changes](#committing-changes)
  - [Pushing Changes](#pushing-changes)
  - [Creating a Pull Request](#creating-a-pull-request)
- [Project Structure](#project-structure)
- [Contributors](#contributors)
- [License](#license)

## Usage

1. Open `src/pages/index.html` in your preferred web browser to view the application.

## Project Structure

```
nmoji/
├── src/                      # Source files
│   ├── assets/              # Static assets
│   │   └── images/         # Image files
│   ├── components/         # React components
│   │   ├── EmojiApp.tsx   # Main application component
│   │   ├── EmojiGrid.tsx  # Emoji grid display
│   │   ├── FilterBar.tsx  # Category and tag filtering
│   │   ├── SearchBar.tsx  # Search functionality
│   │   ├── ThemeToggle.tsx # Dark/light mode toggle
│   │   └── EmojiDescription.tsx # Emoji details panel
│   ├── layouts/           # Astro layouts
│   │   └── Layout.astro   # Main layout template
│   ├── pages/             # Astro pages
│   │   ├── index.astro    # Landing page
│   │   └── app.html       # Application entry
│   ├── scripts/           # Client-side scripts
│   │   ├── app.js        # App initialization
│   │   └── main.js       # Core functionality
│   └── styles/            # Global styles
│       ├── landing.css    # Landing page styles
│       ├── main.css       # Main styles
│       └── theme.css      # Theme variables
├── extension/             # Browser extension files
│   ├── manifest.json     # Extension manifest
│   ├── NmojiList.json   # Emoji data
│   ├── popup.html       # Extension popup
│   ├── popup.js        # Popup logic
│   └── styles.css      # Extension styles
├── astro.config.mjs      # Astro configuration
├── tsconfig.json         # TypeScript configuration
├── Contributors.md       # List of contributors
├── MIT-LICENSE.txt      # License information
└── README.md            # Project documentation
```

## Contributing

We welcome contributions! To contribute to Nmoji, follow these steps:

### Forking the Repository

1. Fork the repository by clicking the "Fork" button at the top right of the repository page on GitHub.
   ![Forking the Repository](https://github-images.s3.amazonaws.com/help/bootcamp/Bootcamp-Fork.png)

### Cloning the Repository

2. Clone your forked repository to your local machine:
    ```sh
    git clone https://github.com/your-username/Nmoji.git
    ```
3. Navigate to the project directory:
    ```sh
    cd Nmoji
    ```

### Creating a Branch

4. Create a new branch for your feature or bug fix (create a branch according to the issue you're working on):
    ```sh
    git switch -c your-branch-name
    ```

### Making Changes

5. Make your changes to the codebase. You can edit the files using your preferred code editor.

6. Don't forget to add your name to `Contributors.md` after contributing
    ```sh
    -[Username](https://github.com/your-username) **Your message** 
    ```

### Committing Changes

7. Add the changes to the staging area:
    ```sh
    git add .
    ```
8. Commit the changes with a descriptive message:
    ```sh
    git commit -m "Description of your changes"
    ```

### Pushing Changes

9. Push the changes to your forked repository:
    ```sh
    git push origin your-branch-name
    ```

### Creating a Pull Request

9. Create a pull request from your forked repository to the main repository. Go to the "Pull Requests" tab on the main repository, and click "New Pull Request". Follow the instructions to create your pull request.
   ![Creating a Pull Request](https://github-images.s3.amazonaws.com/help/pull_requests/pull-request-start-review-button.png)

## Project Structure

- `assets`: Contains the assets like images, fonts, etc.
- `css`: Contains the CSS files for styling.
- `js`: Contains the JavaScript files for functionality.
- `data`: Contains any data files used by the application.
- `index.html`: The main HTML file of the application.

## Contributors

We appreciate the contributions of the following individuals: [Contributors](https://github.com/narainkarthikv/Nmoji/blob/main/Contributors.md)

This is just the beginning! I look forward to making more meaningful contributions and collaborating with this amazing community. Let's build something great together and make Nmoji the best it can be! ❤️🤝

## License

This project is licensed under the MIT License - see the [LICENSE]([LICENSE](https://github.com/narainkarthikv/Nmoji/blob/main/MIT-LICENSE.txt)) file for details.
