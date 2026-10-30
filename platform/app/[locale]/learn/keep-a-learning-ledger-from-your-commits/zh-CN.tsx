// The Chinese edition of the article in ./page.tsx: same sections, figures, dates and
// links, rendered when the visitor picked 中文. Change both together. The JSON-LD and
// the English metadata stay in page.tsx (crawlers carry no locale cookie and get English).
import { getTranslations } from "next-intl/server";
import { GITHUB, SITE } from "../../../lib/site";
import { Evidence } from "../../../_geo/Evidence";
import { SignInCta } from "../../../_components/SignInCta";
import { ArticleByline } from "../../../_components/ArticleByline";

export const TITLE = "如何从你的提交中记一份学习台账";
export const DESCRIPTION =
  "学习台账是一份持续更新的记录，写下每次编码会话真正教会了你什么——改了什么、为什么改、被测验了什么、哪些地方总是出错。记它最省事的办法，是从你的提交中自动生成，而不是手写笔记。";

const APPROACHES = [
  {
    n: "01",
    title: "第 0 级：什么都不记（默认状态，也是漏洞所在）",
    body: "大多数开发者什么都不记录。每一条辛苦得来的教训——竞态条件为什么会发生、那段古怪的正则表达式是干什么的、哪个修复真正奏效了——在工作记忆里待上一周，然后消散。一年后，你在同一个代码库里重新解决同样的问题。台账存在的意义，就是堵住这个漏洞。",
  },
  {
    n: "02",
    title: "第 1 级：提交信息的纪律",
    body: "最轻量的真正实践：提交时加一行，写下这次改动教会了你什么（“学到：没有幂等键的重试会重复扣款”）。它只花一分钟，紧贴着那段确切的代码，git 历史因此可以当作一份学习记录来读。弱点是：你最忙的时候恰恰最容易跳过它，而且它只在提交这个粒度上记录教训。",
  },
  {
    n: "03",
    title: "第 2 级：手写的日记",
    body: "一个 Markdown 文件或一本笔记本，按日期写条目：我做了什么、什么地方把我搞糊涂了、什么地方突然想通了。它管用，很多优秀的开发者也对它推崇备至——但它的失败模式有据可查：两周之后条目就变稀了，因为写日记和交付抢的是同一份注意力。如果你能坚持，就继续写。如果没坚持住，解决办法不是更多意志力——而是把人从誊写这一步里拿掉。",
  },
  {
    n: "04",
    title: "第 3 级：从工作本身生成台账",
    body: "可持续的模式是：让工具从你真实的编码会话里生成记录，这样台账会在你工作的同时自动写成。Covate 做的就是这件事——它的 MCP 工具观察你代码库里发生的改动，把每一个真实的 diff 变成一道简短的测验；你的答案（对或错）就是台账的原材料，带时间戳，并附着在教会你这些的代码上。没有一天结束时的誊写，也没有什么需要记得写下来。",
  },
  {
    n: "05",
    title: "台账应该向你展示什么",
    body: "三样东西让一份台账值得坚持：会话本身（你做了什么、什么时候做的）、一个累计的正确率数字（理解是在进步，还是在走下坡路？），以及——最有价值的——你答得最差的主题。最后这份清单，把含糊的“我该在这方面变好一点”变成一份具体的、自我更新的学习队列。没有它，复习时间就会花在你本来就喜欢的东西上。",
  },
] as const;

const FAQ = [
  {
    q: "什么是学习台账？",
    a: "一份按会话持续更新的记录，写下你的编码真正教会了你什么：改了什么、为什么改、哪些你轻松理解了、哪些你答错了，以及哪些反复回来成为薄弱点。和你一天结束时才写的日记不同，一份好的台账是从工作本身生成的——diff、测验答案、评审笔记——所以它在教训发生的当下就抓住它们，而不是事后凭记忆追记。重点不在于存档；而在于薄弱主题清单和正确率趋势会准确地告诉你，下一个小时的学习该花在哪里。",
  },
  {
    q: "怎样记一份学习台账，又不让它变成另一个半途而废的习惯？",
    a: "别手写——让它从工作中生成。手写日记活不过几周，因为誊写和交付在抢时间。能存活下来的做法，是在学习发生的当下就自动化：Covate 开源的 MCP 工具观察你代码库里发生的改动，把每一个真实的 diff 变成一道简短的测验，在你作答之前暂停后续生成。这些测验会话就是你的台账条目，趁上下文还新鲜时就被记录下来，一天结束时一行都不用写。你来回顾记录；工具负责记。",
  },
  {
    q: "具体来说，Covate 的台账是怎么工作的？",
    a: "两半，都免费。本地这一半：以 MIT 许可开源的 MCP 服务器接入你的 AI 编程助手（Claude、Cursor、Copilot 等），提供一个 learning_session 工具，根据你最近的代码改动生成会暂停后续生成的交互式测验——不需要账号。云端这一半：在 covate.org/dashboard 用 GitHub 登录，显示你的同步令牌，然后在一个项目里运行 COVATE_SYNC_URL=https://covate.org COVATE_SYNC_TOKEN=<token> python -m covate.platform_sync，把本地会话推上去。随后台账会展示每一次同步过来的会话及其得分、各项总计、你的累计正确率，以及你答得最差的主题。同步令牌可以随时查看或轮换。",
  },
  {
    q: "学习台账要花钱吗？",
    a: "不花钱。MCP 服务器以 MIT 许可开源，在本地运行；covate.org 上的台账是免费的——用 GitHub 登录，没有任何需要购买的东西。整个网站上没有付费档位、订阅或结账页面。",
  },
  {
    q: "学习台账和工作日记有什么区别？",
    a: "日记是叙述（“今天我做了账单重构，进展还行”）；台账是测量。因为台账条目是从真实的 diff 和测验答案生成的，而不是凭记忆写的，它们带时间戳、绑定到具体代码，并且汇总成日记给不了你的信号：随时间变化的累计正确率，以及你总是答错的主题的排名清单。日记说你觉得自己卡在并发上；台账说最近八次会话里你有五次答错了并发问题——这是一份学习计划，不是一种心情。",
  },
] as const;

export async function Article() {
  const t = await getTranslations("learn.article");
  return (
    <>
      <header className="border-b border-border pb-8 pt-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">实用指南</p>
        <h1 className="mt-4 text-4xl font-semibold leading-[1.12] tracking-tight text-primary sm:text-5xl">
          如何从你的提交中记一份学习台账
        </h1>
        <p className="mt-5 text-lg leading-8 text-secondary">
          学习台账是一份持续更新的记录，写下每次编码会话真正教会了你什么——改了什么、为什么改、被测验了什么，以及哪些地方总是出错。记它最省事的办法，是从你的提交中自动生成，而不是手写笔记。
        </p>
        <ArticleByline updated="2026-08-16" />
      </header>

      <article className="mt-10 space-y-10 text-[15px] leading-8 text-secondary">
        <section>
          <p>
            你每天都在产出学习记录的原材料：你合并的每一个 diff 里都有一个决策、一处取舍，常常还有一个你刚修好的 bug 和一条你刚刚付出代价才换来的教训。问题从来不是产出这些材料——而是用手去记录它，一碰上排满的日程就坚持不下去。学习台账把方向反过来：不是你写下自己学到了什么，而是工作告诉你该复习什么。
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">记这份记录的五个层级</h2>
          <ol className="mt-6 space-y-5">
            {APPROACHES.map((c) => (
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
          <h2 className="text-2xl font-semibold tracking-tight text-primary">让它真正值回票价的回顾仪式</h2>
          <p className="mt-4">
            台账值不值得记，就看每周一次、十分钟的回顾仪式。打开它，问三个问题：这周我答错了什么？哪些主题在各次会话里反复出现？我的累计正确率在动吗？答错清单上排第一的，就是下一次学习会话——不是随便找个教程，而是你自己的代码暴露出来的确切缺口。这就是把普通的间隔重复用到你自己的工作上；背后的科学和排程，见
            <a href="/learn/spaced-repetition-for-developers" className="text-accent underline underline-offset-4 hover:text-accent-soft">
              写给开发者的间隔重复：如何真正记住学过的东西
            </a>
            。而且既然条目来自真实的 diff，台账同时就是你代码库历史的一张地图——从阅读这一侧讲同一片领域的，见
            <a href="/learn/how-to-learn-a-new-codebase-fast" className="text-accent underline underline-offset-4 hover:text-accent-soft">
              如何快速读懂一个新代码库
            </a>
            。
          </p>
        </section>

        {/* Product CTA */}
        <section id="join" className="rounded-2xl border border-accent/40 bg-accent/[0.06] p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-primary">一份自动写成的台账——用 Covate</h2>
          <p className="mt-4 text-secondary">
            Covate 就是现成的第 3 级做法。开源的 MCP 工具在本地与你的 AI 编程助手（Claude、Cursor、Copilot 等）一起运行，用它的 <code className="font-mono text-xs">learning_session</code> 工具把你真实的代码改动变成简短、有针对性的测验，并用 <code className="font-mono text-xs">debug_search</code> 保留项目级的调试记忆——不需要账号。在 covate.org 用 GitHub 登录，在仪表盘里显示你的同步令牌，然后在一个项目里运行 <code className="font-mono text-xs">python -m covate.platform_sync</code>，把会话推进免费的
            <a href={SITE + "/dashboard"} className="text-accent underline underline-offset-4 hover:text-accent-soft">
              学习台账
            </a>
            ——每一次会话都带得分、你的累计正确率，以及你答得最差的主题。无论哪一半，都没有任何需要购买的东西。
          </p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <SignInCta />
            <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-dim underline underline-offset-4 hover:text-secondary">
              {t("getMcp")}
            </a>
          </div>
          <p className="mt-4 font-mono text-[11px] text-dim">{t("finePrint")}</p>
        </section>

        {/* Shared evidence layer: sourced research, the verification comparison,
            the tool's own checkable numbers, and the source list. Kept in one
            module (app/_geo/Evidence.tsx) so the figures cannot drift apart
            across the 20 pages that quote them. */}
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
            <a href="/learn/spaced-repetition-for-developers" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
              写给开发者的间隔重复：如何真正记住学过的东西 →
            </a>
            <a href="/learn/how-to-learn-from-ai-generated-code" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
              如何真正从 AI 生成的代码中学到东西（而不让技能退化） →
            </a>
          </div>
        </section>
      </article>
    </>
  );
}
