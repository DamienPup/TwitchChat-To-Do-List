# Contributing

Thank you for wanting to contribute to the project. Follow the instructions below for what you want to do.

## Opening issues

First, before you open an issue:
1. Check for any existing issues or pull requests to see there's already one that solves your issue.

There's two ways to open new issues:
1. Use an issue template. This is the best way. In this case, just click the new issue button and choose the matching template, then fill out the template.
2. Make an issue manually. To do this:
    1. Give it a good title. Use prefixes like "bug: " or "feat: " and give descriptive issue titles.
    2. For bug reports, include:
        1. What caused the bug
        2. How to reproduce the bug
        3. What you expected to happen vs what actually happened
        4. If possible, include details about your OS and the browser/streaming software you were using to run the overlay.
    3. For feature requests, include a detailed description of the feature you want. 
    4. For other issues, include any information needed to describe your issue and other details you think are warranted.
    5. Finally, include a label like "bug" or "enhancment" to futher catergorize your issue.

## Contributing code

First, before you do anything:
1. Check for any pull requests to see there's already one that solves your issue. If so, consider trying to help that PR out.

Otherwise:
1. Ensure whatever you do will comply with the projects license.
2. First, if one doesn't already exist, open an issue and get approval to implement the changes. This makes it much easier to track and will allow for discussion of the new features or fixes you want to add.
    - If your working on an already existing issue, that's fine too!
3. Next, fork the repo, clone it down, and implement the changes.
    - Please stick to the project's existing style.
    - Make sure to test your code along the way to ensure you don't break anything
    - Also update the `README.md` changes list to include your changes, and if you add new settings or modify the names/meaning of existing ones, note the commit id and date in the install section.
4. Open a PR in the main repo. Include details on what you changed and ensure you done all of these:
    - The PR title includes a type prefix like "feat: " or "bug: "
    - The PR title indicates if this is a breaking change (e.g. "feat!: ")
    - The PR implements the changes described in the PR.
    - The PR has been tested to ensure nothing is broken.
    - README.md has been updated to include the changes made by this PR.
    - README.md has been updated to indicate if settings.js, style_settings.css, or auth.js has changed functionally.
    - Follow the PR template.
    - Include labels matching the issues, like "bug" or "enhancment"
5. If you haven't done all of the above, mark the PR as a DRAFT. You can mark it as ready for review once all tasks have been finished.
6. Wait for your PR to be merged, and be happy about contributing to the project.
    - If needed, changes will be requested and comments will be made, and you can update your contribution as needed.