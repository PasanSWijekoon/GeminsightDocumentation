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
      { text: "Guide", link: "/guide" },
      
    ],
    // Social Icons
    socialLinks: [
      { icon: "github", link: "https://github.com/Evavic44/adocs" },
      { icon: "twitter", link: "https://twitter.com/victorekea" },
      { icon: "discord", link: "..." },
      
    ],
    // Sidebar
    sidebar: [
      {
        text: "Section A",
        collapsible: true,
        items: [
          { text: "Introduction", link: "/introduction" },
          { text: "Getting Started", link: "/get-started" },
        ],
      },
      {
        text: "Section B",
        collapsible: false,
        items: [
          { text: "Customer Registration", link: "/Customer-Registration" },
          { text: "Getting Started", link: "/getting-started" },
        ],
      },
      {
        text: "Section C",
        collapsible: true,
        items: [
          { text: "Introduction", link: "/introduction" },
          { text: "Getting Started", link: "/getting-started" },
        ],
      },
    ],
    // you can disable the previous and next page here
    docFooter: {
      prev: false,
      next: true,
    },
    editLink: {
      pattern: 'https://github.com/Evavic44/adocs/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
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
