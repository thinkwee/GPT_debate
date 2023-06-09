<h1 align="center">
GPT Debate
</h1>
<p align="center" width="100%">
<img src="icon.png" alt="GPT Debate" style="width: 20%; height: auto; display: inline-block; margin: auto; border-radius: 50%;">
</p>
<p align="center">
<font face="黑体" color=orange size=5"> GPT bots Debate with Themselves </font>
</p>
<p align="center">
<font face="黑体" color=orange size=5"> 探究GPT的辩论能力 </font>
</p>
<p align="center">
    <a href="./README-en.md">English</a> | 中文
</p>

# Intro
- 这是一个基于[ChatGPT-Shortcut](https://github.com/rockbenben/ChatGPT-Shortcut)更改的项目，展示一些GPT自己和自己辩论的记录。这是一个纯前端展示页面，不包含任何的模型、数据、训练过程，也不是一个平台，没有ChatGPT-Shortcut的登录和平台共享功能。
- 这只是一个爱好、偏收集的项目，没有研究目的和商业目的。此类项目也已经有很多不错的尝试，比如b站上的[AI-talk](https://space.bilibili.com/405083326)或者油管上的[Watch GPT-4 Debate with Itself! (About whether it is an AGI)](https://www.youtube.com/watch?v=OdixRqJsA_4)
- 你可以为你支持的bot投票！
- 体验网址：[GPT Debate](https://thinkwee.top/debate/)

# Prompt
- 以单句辩论为例，给予GPT的background prompt类似于："你是一个具有顶尖水平的专业辩手。现在你参加了一个特殊的辩论，每次发言不能超过一句话。你将会得到一个辩题和你方观点，你需要引经据典，整理语言，逻辑严谨的为这个辩题辩护。你需要首先阐述观点，之后你会得到多轮对方的阐释，你需要不断驳斥他直到说服对方。记住，每次发言不能超过一句话。所有回答以中文呈现。"
- 之后给出论点：“辩题为：{}.你方观点是支持/反对。”
- 之后在两个GPT bots之间传递观点：“对方发言：“ {}”，请反驳他，依然发言不超过一句。不要重复你方观点。不要重复之前的发言。尽可能找出对方观点漏洞。尽可能提出新证据攻击对方。”

# Discovery
- 该项目想通过辩论这一极具挑战和思辨的语言应用来探索一下GPT的语言能力、逻辑能力，以及探索人类的思想究竟是否可以被概率所拟合
- 可以设计许多有意思的场景，观察GPT如何给出他的最优解，例如：
  - 限制每次只能发言一句进行辩论
  - 设计一个反事实的辩题
  - 引入第三个gpt作为裁判
  - 三方乃至n方辩论
  - 只提供背景，gpt自己设计辩题
  - 何时一个GPT bot才会被另一个GPT bot说服
  - and more

# Template and Contribute
- TBD