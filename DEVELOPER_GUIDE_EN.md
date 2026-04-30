# Developer Guide - Portfolio Management

Welcome to your professional portfolio developer guide. This document is your comprehensive reference for adding, editing, or removing any content on your website by yourself without needing a programmer. The website is designed to be highly dynamic, reading data from simple JavaScript Arrays.

All content modifications (Projects, Services, Testimonials, Experience) are done through a single file: **`script.js`**.

---

## 1. Project Management (Projects)

All projects are stored in an array called `projects` at the top of `script.js`.
The counter on the website automatically reads the total number of these projects (and adds 20 extra out-of-system projects as configured).

### 💡 How to add a new project?
Search in `script.js` for the word `const projects = [`.
At the end of the list (before the last closing bracket `]`), add the following code block for the new project and modify its data:

```javascript
{
    id: 10, // A unique number that should not be repeated
    title_en: "Project Name Here",
    title_ar: "اسم المشروع بالعربي",
    category: "Data Visualization & Dashboard", // Must match one of the existing filter categories
    desc_en: "Short description in English.",
    desc_ar: "وصف قصير يظهر على الكارت من الخارج.",
    details_en: "Full long details for the popup modal.",
    details_ar: "وصف طويل ومفصل يظهر عند الضغط على تفاصيل المشروع.",
    enhancements_en: "Future enhancements...",
    enhancements_ar: "التطويرات المستقبلية...",
    thumbnail: "projectX/image_name.png", // Image path
    videoSrc: null, // Put a video link here if available, otherwise leave it as null
    githubLink: "https://github.com/your-link" // Project GitHub link
}
```

> **Important Note:** Make sure to put a comma `,` after the preceding project. The currently available Categories are: `Data Visualization & Dashboard`, `Data Analysis`, `Exploratory Data Analysis`, `Reporting Automation`. Spacing and letter casing are important for the filter to work.

---

## 2. Service Management (Services)

Services are managed in the `services` array in `script.js`.

### 💡 How to add a new service?
To add a service, search for `const services = [`, and add a new service to the list like this:

```javascript
{
    id: 's4', // A unique identifier
    category: "Data Analytics & AI", // Must match a filter category
    title_en: "Service Title",
    title_ar: "عنوان الخدمة بالعربي",
    desc_en: "Short description.",
    desc_ar: "وصف قصير يظهر في الخارج.",
    icon: "fas fa-database", // A free icon from FontAwesome 5
    details_en: "Long service details.",
    details_ar: "تفاصيل الخدمة الطويلة.",
    links: [ // Contact or purchase buttons inside the service details modal
        { 
            name: "Direct", 
            url: "https://wa.me/201148295790", 
            icon: "btn-direct", 
            label_en: "Direct Request", 
            label_ar: "طلب مباشر" 
        }
    ]
}
```

---

## 3. Client Feedback (Testimonials)

Client reviews are managed through the `testimonials` array in `script.js`.

### 💡 How to add a new client review?
Search for `const testimonials = [` and add the following code:

```javascript
{
    name_en: "Client Name",
    name_ar: "اسم العميل",
    role_en: "CEO",
    role_ar: "المدير التنفيذي",
    content_en: "English review text.",
    content_ar: "نص التقييم أو الرأي بالعربي.",
    avatar: "https://i.pravatar.cc/150?u=client_name" // Image link. You can leave this as is to generate a placeholder avatar based on the name.
}
```

---

## 4. Professional Experience & Certifications

The exact same concept applies here. You will find the `experience` array for work history and the `certifications` array for certificates.
You can append new bracket blocks `{ ... }` inside them to automatically update your data across all languages.

---

## 5. Professional Statistics (Hero Section)

- **Years of Experience**: Calculated dynamically (Current Year - 2023), with a minimum of 3 years. You can modify the `startYear` variable in the `updateDynamicStats()` function.
- **Number of Projects**: Calculated dynamically from the number of projects in the `projects` array, reading at an increment of 20 additional projects (`projects.length + 20`).

---

## General Tips to Avoid Errors
1. **Commas:** Always ensure there is a comma `,` between each object `{}` block in the arrays. The very last object does not need a comma after it.
2. **Characters:** If a file path contains spaces, it's better to replace them with `%20` or rename the file to avoid spaces.
3. **Icons:** You can use any free icon from FontAwesome 5 by putting its class name in the `icon` field.

*Maintained by Antigravity AI to ensure fast and effective portfolio management.*
