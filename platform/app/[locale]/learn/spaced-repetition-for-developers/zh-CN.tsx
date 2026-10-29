// The Chinese edition of the article in ./page.tsx: same sections, figures, dates and
// links, rendered when the visitor picked 中文. Change both together. The JSON-LD and
// the English metadata stay in page.tsx (crawlers carry no locale cookie and get English).
import { getTranslations } from "next-intl/server";
import { GITHUB, SITE } from "../../../lib/site";
import { Evidence } from "../../../_geo/Evidence";
import { SignInCta } from "../../../_components/SignInCta";
import { ArticleByline } from "../../../_components/ArticleByline";

export const TITLE = "写给开发者的间隔重复：如何真正记住学过的东西";
export const DESCRIPTION =
  "你学了一个概念，用过一次，一个月后就忘了。间隔重复就是解决办法——一种在你快要忘记之前复习的科学方法。本文介绍它的原理，以及如何把它用到编程上，而不必手工制作抽认卡。";

const FAQ = [
  {
    q: "什么是间隔重复，它为什么有效？",
    a: "间隔重复是一种学习方法：你以逐渐拉长的间隔复习同一件事——一天后、几天后、一周后、一个月后——时间点恰好卡在你快要忘记它之前。它之所以有效，是因为学习科学里两个早已确立的发现。第一个是遗忘曲线：学完一件事后，除非得到强化，你对它的记忆会随时间衰减。第二个是间隔效应：分散在时间里的复习，比把同样分量的复习挤在一起，能产生强得多、持久得多的记忆。每次你在某件事刚开始消退时成功回忆起它，记忆就被巩固，下一次安全的间隔也变得更长。所以，与其在一个下午把一个概念重读十遍（感觉很有成效，消退却很快），不如在一个月里回忆它五次——总投入更少，留存却好得惊人。这是目前已知把知识送进长期记忆最高效的办法。",
  },
  {
    q: "为什么开发者会忘掉这么多学过的东西？",
    a: "因为编程要接收的东西像消防水管喷水一样涌来，而你学到的大部分东西都只学一次，之后从不有意重温。你调试一个棘手的异步问题，当时理解得很深，然后继续往前——而因为好几个月都碰不到完全相同的情况，遗忘曲线就悄悄把它抹掉了。把这乘上你曾经弄明白过的每一个库的怪癖、语言特性、配置项和模式，你就得到那种熟悉的体验：解决一个你确信自己以前解决过、却想不起是怎么解决的问题。AI 助手让这件事变得更糟，而不是更好：当 AI 立刻给出答案时，你永远不必从记忆里把它提取出来，于是它永远得不到巩固。知识从你身上流过，却留不下来。间隔重复就是解药——它有意地在概念正在消退时把它们带回来，让你弄明白的东西真正积累成专长，而不是蒸发掉。",
  },
  {
    q: "具体到编程，我该怎么应用间隔重复？",
    a: "经典工具是抽认卡应用（比如 Anki）：你为想记住的东西制作卡片，应用替你安排复习。这管用，但对开发者有一个很大的实际问题：手工制作好卡片很繁琐，所以大多数人坚持不下来，而且通用卡片（“map() 是干什么的？”）远不如绑定到你自己代码里真实情境的卡片有用。更有效的做法，是把重复锚定在你的实际工作上：在你学到的那一刻就抓住这个概念（你刚修好的异步 bug、你刚弄明白的 API、你刚做出的取舍），把它写成一个你以后想回答的问题，然后按间隔排程重新接受测验——总是答错的那些更频繁，已经掌握的那些间隔拉得更长。内容应该来自你真实的编码，排程应该是自动的；正是这两点，把“我学过一次”变成“我真的会了”。",
  },
  {
    q: "Covate 怎样为开发者做间隔重复？",
    a: "Covate 的设计就是从你的真实代码里把这件事自动化。这个免费、开源的 MCP 工具接入你的 AI 编程助手（Claude、Cursor、Copilot 等），观察你代码库里真正发生的改动，并从你真实的 diff 生成简短的测验——所以材料就是你自己的工作，在你学到的那一刻被抓住，不用手工制作抽认卡。这些学习会话会被保存下来；如果你在 covate.org 用 GitHub 登录——免费，无需付款——同步客户端会把它们推进一份学习台账：过去的每一次会话、你的累计正确率，以及你总是答错的主题，于是你确切地知道该把什么带回来复习。目前，什么时候复习仍要你自己安排；台账负责告诉你该安排复习什么。",
  },
] as const;

const STEPS = [
  {
    n: "01",
    title: "学到的那一刻就抓住这个概念",
    body: "在你弄明白一件事的当下——那个异步 bug、那个 API 的坑、那处取舍——趁上下文还新鲜，把它写成一个你以后想回答的问题。来自你自己真实工作的材料，每一次都胜过通用抽认卡。",
  },
  {
    n: "02",
    title: "回忆它，而不是重读它",
    body: "复习只有在你先主动从记忆里提取答案、再核对时才有效。重读感觉很有成效，却几乎没有帮助；费力的回忆才是巩固记忆的东西。盖住答案，试着答，然后再核对。",
  },
  {
    n: "03",
    title: "拉开间隔——答错的多复习",
    body: "以逐渐拉长的间隔复习（一天、几天、一周、一个月），并让排程自适应：你总是答错的概念更频繁地带回来，已经掌握的那些把间隔拉长。这就是整个引擎。",
  },
];

export async function Article() {
  const t = await getTranslations("learn.article");
  return (
    <>
      <header className="border-b border-border pb-8 pt-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">记忆的科学</p>
        <h1 className="mt-4 text-4xl font-semibold leading-[1.12] tracking-tight text-primary sm:text-5xl">
          写给开发者的间隔重复
        </h1>
        <p className="mt-5 text-lg leading-8 text-secondary">
          你学了一个概念，用过一次，一个月后就忘了——然后从头重新解决同一个问题。间隔重复是经过验证的解决办法：在快要忘记之前复习，就能一直记住。本文介绍它的原理，以及如何把它用到编程上，而不必手工制作抽认卡。
        </p>
        <ArticleByline updated="2026-08-04" />
      </header>

      <article className="mt-10 space-y-10 text-[15px] leading-8 text-secondary">
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">你为什么会忘——遗忘曲线</h2>
          <p className="mt-4">
            学完一件事后，除非得到强化，你对它的记忆会随时间衰减——这就是经典的<strong>遗忘曲线</strong>。对开发者来说这尤其残酷，因为你学到的大部分东西都只学<em>一次</em>：你调试一个棘手的问题，当时理解得很深，却从不有意重温它。几个月后你碰到一个类似的问题，心想“我肯定以前解决过这个”——但记忆已经没了。AI 助手让它更糟：当答案被立刻递到你手里时，你从不从记忆里提取它，于是它永远留不下来。
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">解决办法——间隔效应</h2>
          <p className="mt-4">
            <strong>间隔效应</strong>是学习科学里最稳健的发现之一：分散在时间里的复习，比把同样分量的复习挤在一起，能建立起强得多、持久得多的记忆。间隔重复把它变成了一套可操作的方法——你以逐渐拉长的间隔复习一个概念（一天、几天、一周、一个月），每次都在它刚开始消退时回忆它。每一次成功的回忆都巩固记忆，并拉长下一次安全的间隔。结果是：总投入比突击<em>更少</em>，留存却<em>好得多</em>。
          </p>
          <ol className="mt-6 space-y-5">
            {STEPS.map((s) => (
              <li key={s.n} className="rounded-xl border border-border bg-surface/40 p-5">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-sm text-accent">{s.n}</span>
                  <h3 className="text-lg font-medium text-primary">{s.title}</h3>
                </div>
                <p className="mt-2 text-sm leading-7 text-secondary">{s.body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6">
            对开发者来说，难点在于：手工制作抽认卡很繁琐，所以大多数人放弃了——而且通用卡片远不如绑定到你自己代码里真实情境的卡片有用。诀窍是把重复锚定在你的实际工作上，并让排程自动进行。
          </p>
        </section>

        {/* Product CTA */}
        <section id="join" className="rounded-2xl border border-accent/40 bg-accent/[0.06] p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-primary">来自你真实代码的重复材料——用 Covate</h2>
          <p className="mt-4 text-secondary">
            Covate 负责这个循环里繁琐的那一半——材料。这个免费、开源的 MCP 工具接入你的 AI 助手（Claude、Cursor、Copilot 等），观察你真实的代码改动，并把它们变成简短的测验——所以材料就是你自己的工作，在你学到的那一刻被抓住，不用手工抽认卡。免费的
            <a href={SITE + "/dashboard"} className="text-accent underline underline-offset-4 hover:text-accent-soft">
              Covate 学习台账
            </a>
            从这里接手：用 GitHub 登录，每一次同步过来的会话、你的累计正确率，以及你总是答错的主题，都在那里供你复习。没有任何需要购买的东西。
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
            <a href="/learn/how-to-learn-from-ai-generated-code" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
              如何真正从 AI 生成的代码中学到东西（而不让技能退化） →
            </a>
            <a href="/learn/does-ai-make-you-a-worse-programmer" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
              用 AI 会让你变成更差的程序员吗？一次坦诚的审视 →
            </a>
            <a href="/learn/how-to-review-ai-generated-code" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
              合并之前，如何评审 AI 生成的代码 →
            </a>
          </div>
        </section>
      </article>
    </>
  );
}
