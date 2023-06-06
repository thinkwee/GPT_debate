const zhNavbar = {
  hideOnScroll: true,
  title: "GPT Debate",
  logo: {
    alt: "GPT Debate",
    src: "img/logo.svg",
  },
  items: [
    {
      to: "https://newzone.top/posts/2023-02-27-chatgpt_shortcuts.html",
      label: "About GPT Debate",
      position: "left",
    },
    { type: "localeDropdown", position: "right" },
    {
      href: "https://github.com/rockbenben/ChatGPT-Shortcut",
      position: "right",
      className: "header-github-link",
    }
  ],
};

module.exports = zhNavbar;
