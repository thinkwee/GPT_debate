const enNavbar = {
  hideOnScroll: true,
  title: "GPT Debate",
  logo: {
    alt: "GPT Debate",
    src: "img/logo.svg",
  },
  items: [
    { type: "localeDropdown", position: "right" },
    {
      href: "https://github.com/rockbenben/ChatGPT-Shortcut",
      position: "right",
      className: "header-github-link",
    }
  ],
};

module.exports = enNavbar;
