// The Learning Center hub in Chinese: its <title> and description, and the category,
// title and summary on each guide's card. The guide list itself is app/lib/articles.ts;
// every slug there needs an entry here, or its card falls back to English (which the
// language gate, scripts/zh-coverage.mjs, then fails). Each guide's own Chinese text
// is in app/[locale]/learn/<slug>/zh-CN.tsx.
import type { Article } from "../../lib/articles";

export const TITLE = "学习中心——和 AI 一起学编程，而不是让它替你学";
export const DESCRIPTION =
  "Covate 学习中心：关于在用 AI 构建的同时保持扎实开发能力的坦诚、实用指南——如何从 AI 生成的代码中学习、如何评审它、如何记住学到的东西，以及到底还要不要学编程。免费阅读，就像会就你自己的代码向你提问的 Covate MCP、以及保存这些结果的学习台账一样免费。";

export const ARTICLES: Record<string, Omit<Article, "slug">> = {
  "what-is-vibe-coding": {
    category: "基础概念",
    title: "什么是氛围编程（vibe coding）？含义、来历与适用场景",
    description:
      "氛围编程（vibe coding）指的是用日常语言告诉 AI 你想要什么，然后基本照单全收它生成的东西，不去细读代码。本文给出清晰的定义，讲清这个词的来历（Andrej Karpathy，2025 年）、它真正适用的地方、会在哪里坑你，以及怎样用它而不让自己的技能悄悄退化。",
  },
  "how-to-learn-from-ai-generated-code": {
    category: "技能保持",
    title: "如何真正从 AI 生成的代码中学到东西（而不让技能退化）",
    description:
      "如今你的大部分代码都由 AI 来写——那怎样才能继续学习，而不是让技能悄悄流失？这是一份实用指南：如何读懂 AI 生成的代码，避免氛围编程带来的技能退化，并用主动回忆把每一个 diff 变成长期掌握的知识。",
  },
  "how-to-learn-a-new-codebase-fast": {
    category: "上手新项目",
    title: "如何快速读懂一个新代码库",
    description:
      "刚加入一个项目，或者打开了一个庞大又陌生的仓库？从头读到尾是行不通的。这里有一套 7 步的实用方法，帮你快速理解新代码库——先把它跑起来，端到端追踪一个真实请求，读测试，利用 git 历史——而不必先试图弄懂一切。",
  },
  "does-ai-make-you-a-worse-programmer": {
    category: "AI 与技能",
    title: "用 AI 会让你变成更差的程序员吗？一次坦诚的审视",
    description:
      "依赖 AI 编程助手会让你变成更差的程序员吗？坦白说：有可能——通过技能退化——但并非必然。本文平衡地审视正反两方面的证据，以及决定你走向哪一边的那个关键因素：主动使用还是被动使用。",
  },
  "how-to-avoid-over-relying-on-ai-when-coding": {
    category: "保持敏锐",
    title: "写代码时如何避免过度依赖 AI",
    description:
      "你在用 AI 编程助手，也喜欢它们——这篇文章不是劝你戒掉。真正的风险不在于使用 AI，而在于被动地用：接受你并不理解的输出。本文列出过度依赖的信号、它为什么重要，以及一份具体的习惯清单，让你在继续用 AI 交付的同时保持自己的优势。",
  },
  "should-you-still-learn-to-code-with-ai": {
    category: "职业发展",
    title: "AI 时代，还值得学编程吗？",
    description:
      "既然 AI 能写代码，学编程还值得吗？坦白的答案是：值得——但需要学的东西正在变化。本文说明为什么理解比以往任何时候都更重要，以及应该把精力放在哪里。",
  },
  "how-to-review-ai-generated-code": {
    category: "代码评审",
    title: "合并之前，如何评审 AI 生成的代码",
    description:
      "代码是 AI 写的，但责任仍然在你。这是一份在合并前评审 AI 生成代码的实用清单：到底该检查什么、要警惕哪些典型的出错方式，以及如何趁你还理解它的时候完成评审。",
  },
  "prompt-engineering-for-coding": {
    category: "提示词",
    title: "面向编程的提示词工程",
    description:
      "AI 编程助手的表现，取决于你怎么问它。这是一份写好提示词的实用指南——提供上下文、说得具体、设定约束、先做计划、反复迭代——帮你从 Claude、Cursor、Copilot 和 ChatGPT 那里拿到可用的代码，并说明为什么你仍然必须理解和验证它返回的东西。",
  },
  "spaced-repetition-for-developers": {
    category: "记忆与巩固",
    title: "写给开发者的间隔重复：如何真正记住学过的东西",
    description:
      "你学了一个概念，用过一次，一个月后就忘了。间隔重复就是解决办法——一种在你快要忘记之前复习的科学方法。本文介绍它的原理，以及如何把它用到编程上，而不必手工制作抽认卡。",
  },
  "cant-code-without-ai-anymore": {
    category: "AI 与技能",
    title: "“离了 AI 我已经不会写代码了”——到底该怎么办",
    description:
      "如果现在离开 AI 助手就觉得写不了代码，解决办法是有计划地重新练习，而不是一下子彻底戒断：按固定节奏，从你已经理解的代码开始，重新培养自己写小段代码的能力。本文教你诊断自己到底丢掉了什么——语法、问题拆解、调试，还是对代码库的了解——并逐项重建。",
  },
  "when-to-write-code-by-hand-vs-let-ai": {
    category: "保持敏锐",
    title: "什么时候亲手写代码，什么时候交给 AI",
    description:
      "当目标是学习、逻辑很棘手，或者代码处在系统核心位置时，自己写；当它是样板代码、人人熟悉的常见模式，或者你能轻松验证的东西时，交给 AI。本文给出一个逐个场景判断的决策框架，核心只有一个问题：如果现在不理解它，以后要付出什么代价？",
  },
  "how-juniors-should-use-ai": {
    category: "职业发展",
    title: "初级开发者如何用 AI，又不耽误自己的成长",
    description:
      "初级开发者只要一直留在验证环节里，就能安全地使用 AI：可以让它解释、让它起草，但要亲自追踪、测试并改写足够多的代码，让衡量进步的单位始终是理解，而不是产出。本文讲述“先接受再说”这种危险的默认做法、六种安全的用法，以及永远不该交出去的技能。",
  },
  "keep-a-learning-ledger-from-your-commits": {
    category: "记忆与巩固",
    title: "如何从你的提交中记一份学习台账",
    description:
      "学习台账是一份持续更新的记录，写下每次编码会话真正教会了你什么——改了什么、为什么改、被测验了什么、哪些地方总是出错。本文介绍记录的五个层级，从规范地写提交信息，到一份从你的工作中自动生成的台账，还有让它真正发挥作用的每周回顾。",
  },
  "code-reading-routine-for-ai-heavy-teams": {
    category: "代码评审",
    title: "重度使用 AI 的团队：一套固定的读代码流程",
    description:
      "当合并进来的代码大部分由 AI 生成时，读代码就必须从偶尔为之变成定期安排：每周一次改动面评审、以 diff 为先的站会、轮值讲解人，以及一份共享的薄弱点清单。这是一套任何团队每周花大约一小时就能执行的具体流程。",
  },
  "how-to-explain-ai-generated-code-in-a-code-review": {
    category: "代码评审",
    title: "在代码评审中如何讲清楚 AI 生成的代码",
    description:
      "一句“这是 AI 写的”会让讨论就此结束，你的可信度也随之打了折扣。本文给出解释生成代码改动的四问结构——它做了什么、为什么用这种做法、哪里可能出问题、你是怎么验证的——以及 PR 描述里需要写什么，还有在你不知道答案时该怎么说。",
  },
  "onboard-to-a-repo-with-an-mcp-learning-tool": {
    category: "上手新项目",
    title: "如何借助 MCP 学习工具上手一个代码仓库",
    description:
      "在 AI 承担大部分编写工作的情况下上手新项目是危险的，除非有东西在衡量你是否真的在形成理解。本文介绍如何把常规的上手方法与一个 MCP 学习伴侣结合起来，让它就你自己的改动向你提问——并坦诚列出它做不到的事。",
  },
  "how-to-learn-a-new-programming-language-with-ai": {
    category: "技能保持",
    title: "如何用 AI 学一门新的编程语言",
    description:
      "用 AI 学一门新语言，关键是诚实地守住“生成”与“理解”的比例：让 AI 来解释、评判你的写法是否地道、辅导你读真实的代码，而起承重作用的那部分代码由你自己写。本文给出一个四阶段方法——以及一种会悄悄吃掉你六周时间的失败模式。",
  },
  "how-to-debug-with-ai-without-losing-the-skill": {
    category: "保持敏锐",
    title: "如何用 AI 调试，又不丢掉调试能力",
    description:
      "用 AI 调试要奏效，AI 应该是第二步而不是第一步：先读调用栈，认定一个假设，然后带着你的推理去找助手。本文介绍让诊断能力保持活跃的五步循环——以及会让这种能力慢慢消失的“先粘贴再说”的习惯。",
  },
  "coding-interviews-in-the-age-of-ai": {
    category: "职业发展",
    title: "AI 时代的编程面试：还有哪些值得练",
    description:
      "面试正在适应人人都有 AI 助手的现实：少考语法记忆，多考解释决策、阅读陌生代码和现场调试。本文介绍值得专门训练的五种形式变化、哪些内容仍需轻量练习，以及如何坦诚地回答“你是怎么用 AI 的？”。",
  },
};
