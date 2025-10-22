Image Converter - Client-Side Image Converter

Version: 1.0.0
Author: Amekr
Contact: info@amekr.com

We're excited to have you on board. This documentation will guide you through the setup and customization of the tool.

TABLE OF CONTENTS

1. Overview
2. Key Features
3. Package Contents (File Structure)
4. Installation
5. Customization
6. Credits
7. Support
8. Changelog

**OVERVIEW**

Image Converter is a modern, secure, and high-performance image conversion tool
that runs entirely in the user's browser. It allows users to convert images
between JPEG, PNG, and WebP formats with ease.

Because the tool is 100% client-side, no files are ever uploaded to a server.
This guarantees user privacy and makes the tool incredibly fast. It's the perfect
solution for developers, designers, photographers, or anyone needing a quick and
private way to convert images without relying on third-party websites.

This project is built with clean, semantic HTML, modern CSS, and vanilla
JavaScript. It requires no backend, no database, and no complex setup.

**KEY FEATURES**

100% Client-Side & Private: All processing happens in the browser. No
server uploads, no data collection.

Multiple Format Support: Convert to and from JPG, PNG, and WebP.

Batch Processing: Upload and convert multiple images at once.

Adjustable Quality Control: Fine-tune the compression quality for JPG
and WebP files.

Download All as .zip: Package all converted images into a single zip
file for convenience.

Drag & Drop Upload: A modern, intuitive interface for selecting files.

Fully Responsive: A sleek, modern design that works beautifully on
desktop, tablets, and mobile phones.

No Backend Needed: Deploy on any static hosting service (like GitHub
Pages, Netlify, Vercel) or a simple shared hosting plan.

Well-Structured Code: Easy to read and customize.

**PACKAGE CONTENTS (FILE STRUCTURE)**

Your download package contains the following files:

/
├── index.html              (The main image converter application)
├── howitworks.html         (A page explaining the client-side process)
├── faq.html                (An interactive FAQ page for users)
│
├── assets/
│   └── index.html          (Access Denied page to prevent directory browsing)
│
└── README.txt              (This documentation file)

Note: The assets/index.html file is a security measure to prevent users from
seeing a list of files if they try to browse the /assets/ directory directly.

**INSTALLATION**

Installation is incredibly straightforward. No database or backend
configuration is required.

Unzip the main download file.

Upload the index.html, howitworks.html, faq.html, and the assets
folder to your web server's root directory (e.g., public_html, www,
or htdocs).

That's it! Your Image Converter tool is now live.

**CUSTOMIZATION**

The code is designed to be easy to customize.

a. Changing Colors and Fonts:

All primary colors and fonts are controlled by CSS variables at the top of the
<style> block in each HTML file.

Open any .html file and find the :root section in the CSS:

:root {
    --bg-color: #111015;
    --glass-bg: rgba(22, 21, 28, 0.5);
    --border-color: rgba(255, 255, 255, 0.1);
    --text-primary: #f0f0f5;
    --text-secondary: #a0a0b0;
    --accent-gradient: linear-gradient(90deg, #c084fc, #ff71cd);
    --accent-glow: rgba(192, 132, 252, 0.4);
    --radius: 16px;
}


You can change these values here to update the theme across the entire page.

**CREDITS**

This project utilizes the following third-party library:

JSZip: A JavaScript library for creating, reading and editing .zip files.

Website: https://stuk.github.io/jszip/

SUPPORT

If you have any questions, encounter a bug, or need assistance, please contact us
through the comments section on the ThemeForest item page or via the email
provided at the top of this document.

Please note that support covers:

Answering questions about features.

Assistance with reported bugs and issues.

Support does not cover:

Customization services (e.g., adding new features).

Installation on your web server.

**CHANGELOG**

v1.0.0 - Initial Release

Initial launch of Image Converter.

Features: Convert to JPG, PNG, WebP; quality control; batch processing;
drag & drop; download all as zip.

Includes "How It Works" and interactive "FAQ" pages.

================================================================================ Thank you again for your purchase. We hope you enjoy using the Image Converter!
