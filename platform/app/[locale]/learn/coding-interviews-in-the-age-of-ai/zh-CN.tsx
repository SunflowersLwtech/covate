// The Chinese edition of the article in ./page.tsx: same sections, figures, dates and
// links, rendered when the visitor picked 中文. Change both together. The JSON-LD and
// the English metadata stay in page.tsx (crawlers carry no locale cookie and get English).
import { getTranslations } from "next-intl/server";
import { GITHUB, SITE } from "../../../lib/site";
import { Evidence } from "../../../_geo/Evidence";
import { SignInCta } from "../../../_components/SignInCta";
import { ArticleByline } from "../../../_components/ArticleByline";

export const TITLE = "AI 时代的编程面试：还有哪些值得练";
export const DESCRIPTION =
  "面试正在适应人人都有 AI 助手的现实：少考语法记忆，多考解释决策、阅读陌生代码和现场调试。本文介绍值得专门训练的五种形式变化、哪些内容仍需轻量练习，以及如何坦诚地回答“你是怎么用 AI 的？”。";

const SHIFTS = [
  {
    n: "01",
    title: "讲清楚代码，正在成为核心考题",
    body: "当带回家完成的作业（take-home）可以由 AI 写出来，面试就会转向那些当场没法委托出去的东西：“带我过一遍这个函数”“为什么这里慢”“如果这个输入是 null 会坏在哪里”。对着一段不是你写的代码，不做准备、当场大声讲清楚——这是一项可以训练的技能，而几乎没人训练它。练法是读真实的 diff 并口述它们：做了什么、为什么、会在哪里坑人。",
  },
  {
    n: "02",
    title: "读陌生代码，比背算法更重要",
    body: "越来越多的面试会丢给你一个陌生的代码库，让你找一个 bug 或追踪一个功能。考的正是日常使用 AI 会悄悄侵蚀的那项技能——在不是你写的代码里找路。有意识地读代码库（哪怕是小仓库，每月一个），对这种形式的面试准备来说，比再刷一百道数组题更有用。",
  },
  {
    n: "03",
    title: "现场调试是新的白板",
    body: "“这里有一个失败的测试和一段调用栈——修掉它”是一种 AI 帮不上忙、而日常对 AI 的依赖会实实在在拖后腿的形式。挣扎的人，是那些一整年都没有不靠帮助形成过一个假设的人。修复办法很便宜：每一个 bug，先读调用栈，并在任何工具看到它之前先认定一个假设。",
  },
  {
    n: "04",
    title: "语法记忆仍然重要——只是更少，也不同了",
    body: "经典的算法刷题不是没用：它锻炼拆解问题的肌肉，让你调取语法的速度保持在线，而且仍有不少面试官在用。但把它当作体能训练，而不是比赛本身。杠杆最高的版本，是定期从一份空白文件开始写小程序——而这恰恰也是 AI 接手你日常代码时退化得最厉害的那项技能。",
  },
  {
    n: "05",
    title: "坦诚说明你如何使用 AI，现在也是面试的一部分",
    body: "有些面试官现在会直接问你怎么用 AI。“我什么都委托出去，然后评审输出”听起来是个减分项；“我用它处理样板代码和解释，核心部分我能自己重新推导，我是这样验证的”听起来像资深开发者。你的回答好不好，只取决于它背后的真实性——而这又绕回到：上面那些技能得是真的。",
  },
] as const;

const FAQ = [
  {
    q: "既然 AI 能写代码，编程面试还值得练吗？",
    a: "值得——形式正在转向 AI 没法当着一个陌生人的面当场完成的事情：解释陌生代码、调试一个失败的测试、为设计决策辩护，以及从一份空白文件开始写小程序。如果说有什么变化，那就是日常使用 AI 让面试练习变得更重要，而不是更不重要，因为自然的工作流不再自动锻炼这些技能了。高效的做法是把刷题时间转向这些变化后的形式，而不是放弃练习。",
  },
  {
    q: "AI 时代，LeetCode 已经死了吗？",
    a: "没死——只是占比在下降，角色在变化。算法题仍然会出现，也仍然能练出真正的问题拆解能力，但越来越多的面试官会把它和读代码、调试、讲解这几轮搭配在一起，而这几轮考的，正是 AI 辅助完成的带回家作业无法核实的东西。把算法练习当作一场更宽的比赛的体能训练：保持轻量、保持规律，把省下来的时间花在读真实的代码库、以及大声口述决策上。",
  },
  {
    q: "2026 年的技术面试，我该练哪些技能？",
    a: "四项，大致按权重上升的顺序：阅读并解释陌生代码（定期口述真实的 diff）；从一段调用栈开始现场调试（在查阅任何东西之前先形成一个假设）；不靠帮助从一份空白文件开始写小程序（空白文件测试）；以及大声讲清楚取舍（“为什么用这种做法而不是那个替代方案”）。这四项也正是在“先生成再说”的日常工作流里退化得最快的技能。",
  },
  {
    q: "面试中我应该提到自己使用 AI 吗？",
    a: "如果被问到，就具体而坦诚地回答：你委托出去什么（样板代码、解释、脚手架），你自己留着什么（核心逻辑、验证、调试时的假设），以及你如何验证 AI 写的东西。面试官筛的不是你戒没戒掉 AI——他们筛的是你离开它还能不能思考。一个具体的、属于你自己的验证习惯是好答案；一句含糊的“我什么都评审”是弱答案。",
  },
  {
    q: "Covate 怎样帮你为 AI 时代的面试做准备？",
    a: "Covate 用你的日常工作当材料，训练的正是这些变化后的形式所考的技能。它免费、开源的 MCP 接入你的 AI 编程助手（Claude、Cursor、Copilot 等），把你真实的 diff 变成简短、有针对性的测验——相当于在你真正交付的代码上演练“讲清楚这段代码”这一轮——并保留项目级的调试记忆，让诊断时摸出的规律留得住。covate.org 上的免费台账（用 GitHub 登录，没有任何需要购买的东西）追踪正确率和薄弱主题：在别人问你“不靠帮助你到底有多扎实？”之前，先给你一个有事实依据的答案。",
  },
] as const;

export async function Article() {
  const t = await getTranslations("learn.article");
  return (
    <>
      <header className="border-b border-border pb-8 pt-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">实用指南</p>
        <h1 className="mt-4 text-4xl font-semibold leading-[1.12] tracking-tight text-primary sm:text-5xl">
          AI 时代的编程面试：还有哪些值得练
        </h1>
        <p className="mt-5 text-lg leading-8 text-secondary">
          面试正在适应一个人人都有助手的世界：少考语法记忆，多考解释决策、阅读陌生代码和现场调试。这对你的练习时间意味着什么——以及哪些内容你可以安心地不再死磕。
        </p>
        <ArticleByline updated="2026-08-16" />
      </header>

      <article className="mt-10 space-y-10 text-[15px] leading-8 text-secondary">
        <section>
          <p>
            对每个每天都和 AI 一起写代码的人来说，有一个不太舒服的事实：面试间是仅存的少数几个助手不在你身边的地方，而它悄悄停止锻炼的那些技能，恰恰是正在被考的技能。这不是恐慌的理由——这是把练习转向如今真正出现的那些形式的理由，而不是继续死磕那些一年比一年更不重要的东西。
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">值得专门训练的五种变化</h2>
          <ol className="mt-6 space-y-5">
            {SHIFTS.map((c) => (
              <li key={c.n} className="rounded-xl border border-border bg-surface/40 p-5">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-sm text-accent">{c.n}</span>
                  <h3 className="text-lg font-medium text-primary">{c.title}</h3>
                </div>
                <p className="mt-2 text-sm leading-7 text-secondary">{c.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">底下的那条主线</h2>
          <p className="mt-4">
            每一种变化后的形式，考的都是同一件底层的事：你还能不能在不靠帮助的情况下，大声地思考代码？这正是我们其他指南从日常工作那一侧绕着走的同一个问题——
            <a href="/learn/should-you-still-learn-to-code-with-ai" className="text-accent underline underline-offset-4 hover:text-accent-soft">
              AI 时代，还值得学编程吗？
            </a>
            、
            <a href="/learn/cant-code-without-ai-anymore" className="text-accent underline underline-offset-4 hover:text-accent-soft">
              “离了 AI 我已经不会写代码了”——到底该怎么办
            </a>
            ，以及
            <a href="/learn/how-to-explain-ai-generated-code-in-a-code-review" className="text-accent underline underline-offset-4 hover:text-accent-soft">
              在代码评审中如何讲清楚 AI 生成的代码
            </a>
            。面试准备和技能保持已经汇合了：现在一套练习方案同时服务两者，而空白文件测试是它的检查点。
          </p>
        </section>

        {/* Product CTA */}
        <section id="join" className="rounded-2xl border border-accent/40 bg-accent/[0.06] p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-primary">用 Covate，每天演练真正的面试形式</h2>
          <p className="mt-4 text-secondary">
            Covate 把你日常由 AI 辅助的工作变成面试的重复训练。这个免费、开源的 MCP 接入你的助手（Claude、Cursor、Copilot 等），就你真实的 diff 向你提问——“讲清楚这段代码”这一轮，用的是你真正交付的代码——而它的调试记忆让你解决过的失败模式随时可以取回。covate.org 上免费的
            <a href={SITE + "/dashboard"} className="text-accent underline underline-offset-4 hover:text-accent-soft">
              学习台账
            </a>
            追踪正确率和最薄弱的主题，于是准备对准的是你的缺口，而不是你的舒适区。没有任何需要购买的东西。
          </p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <SignInCta />
            <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-dim underline underline-offset-4 hover:text-secondary">
              {t("getMcp")}
            </a>
          </div>
          <p className="mt-4 font-mono text-[11px] text-dim">{t("finePrint")}</p>
        </section>

        {/* Shared evidence layer (app/_geo/Evidence.tsx), already in the visitor's language. */}
        <Evidence />

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">{t("faq")}</h2>
          <div className="mt-4 divide-y divide-border border-y border-border">
            {FAQ.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="cursor-pointer list-none">
                  <h3 className="text-sm font-medium text-primary transition group-open:text-accent hover:text-accent">{f.q}</h3>
                </summary>
                <p className="mt-2 text-sm leading-7 text-secondary">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Related */}
        <section className="border-t border-border pt-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-dim">{t("related")}</p>
          <div className="mt-3 flex flex-col gap-2">
            <a href="/learn/should-you-still-learn-to-code-with-ai" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
              AI 时代，还值得学编程吗？ →
            </a>
            <a href="/learn/how-to-learn-a-new-programming-language-with-ai" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
              如何用 AI 学一门新的编程语言 →
            </a>
          </div>
        </section>
      </article>
    </>
  );
}
