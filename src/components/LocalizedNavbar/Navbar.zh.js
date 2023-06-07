const zhNavbar = {
  hideOnScroll: true,
  title: "GPT Debate",
  logo: {
    alt: "GPT Debate",
    src: "img/logo.svg",
  },
  items: [
    {
      to: "https://github.com/thinkwee/GPT_debate",
      label: "About GPT Debate",
      position: "left",
    },
    { type: "localeDropdown", position: "right" },
    {
      href: "https://github.com/thinkwee/GPT_debate",
      position: "right",
      className: "header-github-link",
    }
  ],
};

module.exports = zhNavbar;
