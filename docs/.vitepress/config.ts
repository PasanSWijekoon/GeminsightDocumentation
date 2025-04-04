export default {
  title: "Geminsight",
  description: "Geminsight Gem Certificate Generator. Project Documentation Version 1.22",
  lang: 'en-US',
  cleanUrls: true,
  // If this is disabled, when building it it will give deadlink errors if your markdown has the wrong links
  ignoreDeadLinks: true,
  
  themeConfig: {
    logo: "/logo.png",
    siteTitle: "Geminsight",
    search: {
      provider: "local",
    },
    // Navbar Link
    nav: [
      { text: "About", link: "/about" },
      { text: "Contact", link: "/contact" },
     // { text: "Guide", link: "/guide" },
      
    ],
    // Social Icons
    socialLinks: [
      { icon: "github", link: "https://github.com/PasanSWijekoon" },
      { icon: "twitter", link: "https://x.com/pasan_wijekoon" },
      { icon: "instagram", link: "https://www.instagram.com/pasanwijekoon" },
      
    ],
    // Sidebar
    sidebar: [
      {
        text: "Project Overview",
        collapsible: true,
        items: [
          { text: "Introduction", link: "/introduction" },
          { text: "Getting Started", link: "/getstarted" },
        ],
      },
      {
        text: "Main Activities",
        collapsible: false,
        items: [
          { text: "Login", link: "/login" },
          { text: "Dash Board", link: "/dashborad" },
          { text: "Customer Registration", link: "/CustomerRegistration" },
          { text: "Create Gem Order", link: "/gemorder" },
          { text: "Create Lab Report", link: "/labreport" },
          { text: "Generate Certificate", link: "/generatecertificate" },
         
        ],
      },
      {
        text: "Other Activities",
        collapsible: true,
        items: [
          { text: "Screenshots", link: "/screenshots" },
        ],
      },
    ],
    // you can disable the previous and next page here
    docFooter: {
      prev: false,
      next: true,
    },
  
    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2024-present Adocs",
    },
    markdown: {
      theme: "material-palenight",
      lineNumbers: true,
    },
    // Mobile Config only
    returnToTopLabel: 'Go to Top',
    sidebarMenuLabel: 'Menu',
  },
};
