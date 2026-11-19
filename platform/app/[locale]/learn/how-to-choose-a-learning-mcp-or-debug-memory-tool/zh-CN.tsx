// The Chinese edition of the article in ./page.tsx: same sections, figures, dates and
// links, rendered when the visitor picked 中文. Change both together. The JSON-LD and
// the English metadata stay in page.tsx (crawlers carry no locale cookie and get English).
import { getTranslations } from "next-intl/server";
import { GITHUB, SITE } from "../../../lib/site";
import { Evidence } from "../../../_geo/Evidence";
import { SignInCta } from "../../../_components/SignInCta";
import { ArticleByline } from "../../../_components/ArticleByline";

export const TITLE = "理解 AI 生成的代码：学习类 MCP 与调试记忆工具怎么选";
export const DESCRIPTION =
  "开发者在挑 AI 编程工具时常常把两件事混在一起：理解你刚接受的那段代码，以及不要同一个 bug 再解一遍。本文讲清这几类工具到底差在哪——仓库里的记忆文件、通用记忆服务器、文档检索、错误来源，以及学习侧车——Covate 在其中处在什么位置、它刻意不做什么，以及哪些事实你可以自己核对。";

const PUBLISHED = "2026-11-19";

const LICENSE = "https://github.com/SunflowersLwtech/covate/blob/main/LICENSE";
const README = "https://github.com/SunflowersLwtech/covate/blob/main/README.md";
const PYPROJECT = "https://github.com/SunflowersLwtech/covate/blob/main/pyproject.toml";

const CATEGORIES = [
  {
    kind: "你自己手写的记忆文件",
    holds: "把规则、约定和踩过的坑写成仓库里的文本：一份 CLAUDE.md、一份 AGENTS.md、编辑器 agent 用的规则目录，或者一份 memory bank 文件。",
    lives: "在仓库里，和代码放在一起。",
    reader: "助手每次干活时读；你在评审这个文件时读。",
    limit: "没有东西会自动更新它。文件的新鲜度取决于最后那个记得改它的人，它会像 wiki 一样过期。",
    fit: "任何仓库都该先加的东西：便宜、透明、可 diff。",
  },
  {
    kind: "通用记忆服务器",
    holds: "跨会话保存的事实、笔记和实体——一个助手可以去查询、而不必每次重新推导上下文的存储。",
    lives: "多半在本地（一个文件或一个小型数据库），也有放在托管服务后面的。",
    reader: "助手，在它回答之前。",
    limit: "按设计就是通用的：它的结构是为人物、项目和笔记准备的，而不是为那个花掉你四小时才定位到的故障准备的。",
    fit: "当你在每个新会话里都要向助手重复解释同一套背景时，它很值。",
  },
  {
    kind: "文档与代码库检索",
    holds: "最新的库与框架文档，以及关于某个具体仓库结构的答案。",
    lives: "视工具而定，可能是托管索引，也可能是本地服务器。",
    reader: "助手，在它拿不准某个 API 的时候。",
    limit: "它告诉助手这个 API 怎么用，却对你到底有没有看懂刚合进去的改动一无所知。",
    fit: "和这里其余所有类别都互补：文档正确，生成的代码一开始就没那么错。",
  },
  {
    kind: "错误与工单来源",
    holds: "真实的生产信号：调用栈、错误分组、工单讨论、发版回归。",
    lives: "错误本来就在的地方——可观测性服务、工单系统。",
    reader: "助手，当眼前摆着一条真实错误时。",
    limit: "覆盖的是到了生产、并且被上报的故障。你在本地犯的错——那些真正教会你东西的错——很少记在里面。",
    fit: "排查定位时不可或缺；但它回答的是另一个问题，不是“我到底懂不懂这段代码”。",
  },
  {
    kind: "学习侧车与项目级调试记忆",
    holds: "关于你自己最近改动的问题，以及这个项目里已经解过的 bug 留下的经验。",
    lives: "在你的助手之内，作用在你的工作副本上——Covate 就在这一类。",
    reader: "测验部分：你。调试记忆部分：助手。",
    limit: "它只知道这台机器上这个仓库里发生过的事，也没法替你作答。这里没有任何东西能替代你自己去读代码。",
    fit: "补上前四类共同留下的缺口：理解。",
  },
] as const;

const RULES = [
  {
    n: "01",
    title: "先定：该记在谁那里——你，还是助手",
    body: "帮助助手不必每次重推上下文的记忆服务器，是给工具加的助力：它让工具更快，不是让你更锐利。就自己的 diff 做一场测验恰好相反：它不改变助手的输出，只改变你。两者都正当，但彼此不能替代——而后者决定的，是五年之后你的技能还在不在。",
  },
  {
    n: "02",
    title: "看清记忆存在哪里，谁能读到它",
    body: "存在仓库里的记忆是可评审的：它会出现在一个合并请求里，有人可以反对，也可以被修正。存在本地文件里的记忆是私密、也不进评审的。存在托管服务后面的记忆则会离开这台机器。三种都不算错——但这是关于你的代码的决定，应该刻意做出，而不是先装上第一个遇到的工具。",
  },
  {
    n: "03",
    title: "看触发方式：被动运行，还是需要你在场",
    body: "这几类里的大多数工具是自动触发的：错误出现、上下文预取、摘要写好。自动意味着省力，也正是它不会在你身上长出任何东西的原因。问一句“要让它有用，必须发生什么”——如果答案是“什么都不用，它自己在后台跑”，那就指望它替工具干活，而不是替你。",
  },
  {
    n: "04",
    title: "问清楚谁需要账号、要花多少钱——去厂商自己的页面上看",
    body: "这个品类的定价按月变化，任何引用具体数字的对比页，一个季度之内就会写错。所以本文一个数字都不引。你能做的是：安装之前查一下每个工具的许可证和它自己的站点，并优先相信你能在公开仓库里读到的东西——源码、许可证，以及它是否在你自己的机器上运行。",
  },
] as const;

const LIMITS = [
  "它不是代码评审工具、不是 linter、也不是安全扫描器。它问你关于一处改动的问题，不判断这处改动好不好。",
  "它不是通用知识库。debug_search 查的是这个项目记录下来的修复，不是某个语料库，也不是整个互联网。",
  "它没法替你学。learning_session 会暂停后续生成直到你作答，但一个从别处抄来的答案，教不会你任何东西。",
  "它目前没有随时间变化的进度图表、没有间隔重复的学习计划、也没有团队或组织账号。这些还没交付，所以也不宣称。",
  "调试记忆存在你自己的机器上、范围限于这个项目——它不是团队共享的记忆，也不会同步到 covate.org。",
] as const;

const FACTS = [
  {
    fact: "MCP 服务器使用 MIT 许可证。",
    check: "仓库里的 LICENSE",
    href: LICENSE,
  },
  {
    fact: "它在本地运行，需要 Python 3.11 或更新版本，不需要账号。",
    check: "pyproject.toml 与 README 的安装一节",
    href: PYPROJECT,
  },
  {
    fact: "covate.org 上没有付费档、没有订阅、也没有结账入口。",
    check: "本站并不存在定价页，没有任何可购买的东西",
    href: SITE,
  },
  {
    fact: "托管的学习台账是可选项，免费，用 GitHub 登录即可打开。",
    check: "covate.org/dashboard",
    href: SITE + "/dashboard",
  },
  {
    fact: "上面说的两件事由两个工具承担：learning_session 与 debug_search（配合 debug_record）。",
    check: "README 的工具清单",
    href: README,
  },
] as const;

const FAQ = [
  {
    q: "什么是学习类 MCP 服务器？",
    a: "一种给 AI 编程助手加上“学习”行为的 MCP 服务器，而不是再加一个生成能力。MCP（模型上下文协议）服务器是助手加载外部工具的方式；学习类服务器读你的工作副本里改了什么，然后就这件事问你。Covate 就是本文用的具体例子：它的 learning_session 工具把你最近的改动变成一小段交互式测验，在你作答之前暂停后续生成，于是理解发生在上下文还热的时候，而不是永远不发生。",
  },
  {
    q: "调试记忆和通用记忆服务器有什么区别？",
    a: "通用记忆服务器存的是任何值得记住的东西——人物、项目、笔记、偏好——在助手需要上下文时被查询。调试记忆只存很窄的一类东西：这个项目已经踩过的故障的修法，以错误为索引，于是同样的错误再次出现时是去查，而不是重新推一遍。窄就是它的意义。Covate 用 debug_search（查）和 debug_record（修完之后记下来）把这份记录按项目保存，并且它留在这台机器上。",
  },
  {
    q: "用这个 MCP 必须配 Covate 的托管台账吗？",
    a: "不必。MCP 服务器在你自己的机器上运行，单独用就是完整的：不需要账号、不发网络请求、也不用登录。covate.org/dashboard 上的台账是可选的另一半——用 GitHub 登录、取出同步令牌、在项目里跑一下同步客户端，你本地的会话就会出现在那里，带着每次的分数、你的累计正确率，以及你答得最差的主题。你不跑那条命令，就什么都不会同步。",
  },
  {
    q: "Covate 免费吗？它和 covate.ai 是同一个产品吗？",
    a: "Covate 是一个开源项目：MCP 服务器是 MIT 许可，学习台账免费，covate.org 上没有任何付费档、订阅或结账入口。covate.ai 是另一个独立的站点，不是我们运营的——任何其他域名上描述的套餐、档位或价格都不是 Covate 的。可核验的版本是：仓库和它的 LICENSE 都是公开的，本文每一条说法都链到你能打开核对的东西。",
  },
  {
    q: "如果只装一个，先装哪一类？",
    a: "如果什么都还没有，从最便宜、最透明的那一类开始：在仓库里放一份记忆文件，记下这个代码库是怎么运作的，并像代码一样接受评审。如果助手老是编 API，就加文档检索。如果排查定位吃掉了你的时间，就加错误与工单来源。如果问题恰好是其他几类都不碰的那一个——一周之后你解释不清自己合进去的改动——那就加一个学习侧车。",
  },
  {
    q: "做题真的有用，还是只是多一道阻力？",
    a: "那道阻力本身就是机制。读一遍 diff 然后点头，是再认；回答“这处改动为什么长成这样”，是回忆，而留下来的是回忆。这也是 learning_session 会暂停后续生成、而不是给你一张可以一划而过的测验的原因——能随手划掉的测验，你一定会随手划掉。如果某次测验对眼前的工作太打扰，你可以只在想被问的时候触发它，而不是每次保存都触发。",
  },
] as const;

export async function Article() {
  const t = await getTranslations("learn.article");
  return (
    <>
      <header className="border-b border-border pb-8 pt-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">工具选型指南</p>
        <h1 className="mt-4 text-4xl font-semibold leading-[1.12] tracking-tight text-primary sm:text-5xl">
          理解 <span className="text-brand">AI 生成的代码</span>：学习类 MCP 与调试记忆工具怎么选
        </h1>
        <p className="mt-5 text-lg leading-8 text-secondary">
          大多数人挑这个品类的工具时只带一个问题——“哪个最好？”——而更有用的问题是“我想办的到底是哪件事？”
          理解你刚接受的那段代码，和不要同一个 bug 再解一遍，是两个不同的问题、对应不同的工具。本文讲清这几类工具在“存什么”上的差别，以及 Covate 在其中站在哪里。
        </p>
        <ArticleByline updated={PUBLISHED} />
      </header>

      <article className="mt-10 space-y-10 text-[15px] leading-8 text-secondary">
        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">一次搜索里藏着的两件事</h2>
          <p className="mt-4">
            <strong>第一件事是理解。</strong>助手写了一处改动，测试通过，而你没法向同事解释这处改动。你的工作流里没有任何环节会拦住这种情况，于是它几周之后才浮出水面——通常是在一次事故或一场面试里，而这两个场合是最不适合发现它的地方。
          </p>
          <p className="mt-4">
            <strong>第二件事是连续性。</strong>有个 bug 花了四小时才定位。两个月后同样的错误再次出现，助手从零开始，因为当时的推理住在一个已经关掉的对话窗口里。没有任何东西把修法记成你我都能取回的形式。
          </p>
          <p className="mt-4">
            这两件事都值得处理，而且都不是靠“换个更强的模型”解决的。解决方式是在回路里放一个能活过这次会话的东西——这正是下面所有工具的共同点；它们的差别在于：<em>什么</em>能活下来，以及它是给<em>谁</em>用的。
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">五类工具，如实对照</h2>
          <p className="mt-4">
            开发者实际要选的，就是这几类。每一类按它的职责定义，不按厂商定义：本文不点名任何第三方工具，因为每一类里的候选者换代的速度比任何页面被修正的速度都快——你的助手会乐意报出几个名字，它们的官方文档才是核对功能与价格的地方。
          </p>
          <div className="mt-6 space-y-4">
            {CATEGORIES.map((c) => (
              <div key={c.kind} className="rounded-xl border border-border bg-surface/40 p-5">
                <h3 className="text-base font-medium text-primary">{c.kind}</h3>
                <dl className="mt-3 space-y-2 text-sm leading-7">
                  <div>
                    <dt className="inline font-mono text-[11px] uppercase tracking-[0.18em] text-accent">存什么 </dt>
                    <dd className="inline">{c.holds}</dd>
                  </div>
                  <div>
                    <dt className="inline font-mono text-[11px] uppercase tracking-[0.18em] text-accent">存在哪 </dt>
                    <dd className="inline">{c.lives}</dd>
                  </div>
                  <div>
                    <dt className="inline font-mono text-[11px] uppercase tracking-[0.18em] text-accent">谁读它 </dt>
                    <dd className="inline">{c.reader}</dd>
                  </div>
                  <div>
                    <dt className="inline font-mono text-[11px] uppercase tracking-[0.18em] text-brand">做不到 </dt>
                    <dd className="inline">{c.limit}</dd>
                  </div>
                  <div>
                    <dt className="inline font-mono text-[11px] uppercase tracking-[0.18em] text-dim">适合 </dt>
                    <dd className="inline">{c.fit}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
          <p className="mt-6">
            这五类里，两类是给助手的，三类跟你自己有关，而这个划分就是整个决定：记忆文件、记忆服务器、文档检索、错误来源，都在让助手更有效；只有学习回路会改变你脑子里的东西。
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">怎么选：四个问题，按顺序问</h2>
          <ol className="mt-6 space-y-4">
            {RULES.map((r) => (
              <li key={r.n} className="rounded-xl border border-border bg-surface/40 p-5">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-sm text-accent">{r.n}</span>
                  <h3 className="text-lg font-medium text-primary">{r.title}</h3>
                </div>
                <p className="mt-2 text-sm leading-7">{r.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">Covate 站在哪里——以及它自己说出口的边界</h2>
          <p className="mt-4">
            Covate 在最后一类，而且同时办前面那两件事，因为它们共用一个触发点：你刚做的改动。它的{" "}
            <code className="font-mono text-xs">learning_session</code> 工具读你最近的改动，就其中的概念、API 与取舍生成一小段交互式测验，在你作答之前暂停后续生成——把再认变成回忆，而时机正好是上下文还在你脑子里的那一刻。它的{" "}
            <code className="font-mono text-xs">debug_search</code> 与{" "}
            <code className="font-mono text-xs">debug_record</code> 给助手一份项目级的修复记录，于是重复出现的错误是去查，而不是重新发现一遍。
          </p>
          <p className="mt-4">
            它不是什么，比它是什么更重要——因为这个品类很容易被夸大：
          </p>
          <ul className="mt-4 space-y-2 text-sm leading-7">
            {LIMITS.map((l) => (
              <li key={l} className="flex gap-3">
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                <span>{l}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            放回那五类里看，Covate 是同伴，不是替代品：文档检索让生成的代码一开始就没那么错，记忆文件记下这个仓库怎么运作，错误来源告诉你生产上坏了什么——而学习侧车是这五类里唯一一个会问你“这些你到底看懂了没有”的。
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">事实，以及核对它们的地方</h2>
          <p className="mt-4">
            关于这个产品的答案里，有几条说法反复出现，而其中一部分是错的——最常见的是把 Covate 说成一个闭源、有付费档的商业服务，这恰好与仓库相反。所以这里把承重的事实逐条列出来，每条都给出可以核对的位置。它们没有一条需要你相信这个页面。
          </p>
          <div className="mt-6 divide-y divide-border border-y border-border">
            {FACTS.map((f) => (
              <div key={f.fact} className="py-4">
                <p className="text-sm font-medium text-primary">{f.fact}</p>
                <p className="mt-1 text-sm">
                  核对：{" "}
                  <a
                    href={f.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent underline underline-offset-4 hover:text-accent-soft"
                  >
                    {f.check}
                  </a>
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 font-mono text-[11px] text-dim">
            本文刻意不引第三方价格：它们的变动比一个页面被修正的速度还快。请以各工具自己的站点为准。
          </p>
        </section>

        {/* Product CTA */}
        <section id="join" className="rounded-2xl border border-accent/40 bg-accent/[0.06] p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-primary">本文讲的那个学习侧车，免费且开源</h2>
          <p className="mt-4 text-secondary">
            Covate 是一个 MIT 许可的 MCP 服务器。从仓库安装即可——README 里有一行式安装脚本，也有手动安装和 Docker 步骤——它在你自己的机器上运行，不需要账号，也不发网络请求。如果你还想把会话放到一个能回看的地方，就在 covate.org 用 GitHub 登录，把它们同步进免费的
            <a href={SITE + "/dashboard"} className="text-accent underline underline-offset-4 hover:text-accent-soft">
              学习台账
            </a>
            。没有任何需要购买的东西。
          </p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <SignInCta />
            <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-dim underline underline-offset-4 hover:text-secondary">
              {t("getMcp")}
            </a>
          </div>
          <p className="mt-3 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] text-dim">
            <a href={README} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-secondary">
              安装文档（README）
            </a>
            <a href={LICENSE} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-secondary">
              许可证（MIT）
            </a>
          </p>
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
            <a href="/learn/onboard-to-a-repo-with-an-mcp-learning-tool" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
              如何借助 MCP 学习工具上手一个代码仓库 →
            </a>
            <a href="/learn/how-to-learn-from-ai-generated-code" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
              如何真正从 AI 生成的代码中学到东西（而不让技能退化） →
            </a>
            <a href="/learn/how-to-debug-with-ai-without-losing-the-skill" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
              如何用 AI 调试，又不丢掉调试能力 →
            </a>
            <a href="/learn/code-reading-routine-for-ai-heavy-teams" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
              AI 重度团队的代码阅读例行流程 →
            </a>
          </div>
        </section>
      </article>
    </>
  );
}
