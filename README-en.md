# Intro
- This is a project based on [ChatGPT-Shortcut](https://github.com/rockbenben/ChatGPT-Shortcut) to showcase some of GPT's own records of debates with themselves. This is a pure front-end display page, containing no models, data, training process, nor is it a platform with the login and platform sharing features of ChatGPT-Shortcut.
- This is just a hobby, collective-favour project, with no research purpose or commercial purpose. There have been many good attempts at such projects, such as [AI-talk](https://space.bilibili.com/405083326) on bilibili or [Watch GPT-4 Debate with Itself! (About whether it is an AGI)](https://www.youtube.com/watch?v=OdixRqJsA_4) on YouTube
- The website is [here](https://gpt-debate.vercel.app/)

# Prompt
- Take the example of a one-sentence debate, where the background prompt given to the GPT is something like: "You are a professional debater at the top of your game. Now you are taking part in a special debate where you can speak no more than one sentence at a time. You will be given a topic and your side of the argument, and you will be required to defend it logically, using quotations from the classics and organising your language. You will be given several rounds of elucidation from your opponent, and you will have to refute him until you are convinced. Remember, no more than one sentence per statement. All responses will be presented in Chinese."
- The argument is then given: "The debate is entitled: {}. Your side's argument is for/against."
- Then pass the argument between the two GPT bots: "The other side speaks:" {}", please rebut him, still speaking in no more than one sentence. Do not repeat your side of the argument. Do not repeat what you have said before. Find as many holes in the other person's argument as possible. Present new evidence to attack the other person whenever possible."

# Discovery
- This project is intended to explore the verbal and logical skills of the GPT through debate.
- There are many interesting restrictions that can be designed to see how the GPT gives his optimal solution, such as limiting each statement to one sentence, or designing a counterfactual debate, or introducing a third GPT as a judge.