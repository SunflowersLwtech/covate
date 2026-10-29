// The Chinese edition of the article in ./page.tsx: same sections, figures, dates and
// links, rendered when the visitor picked 中文. Change both together. The JSON-LD and
// the English metadata stay in page.tsx (crawlers carry no locale cookie and get English).
import { getTranslations } from "next-intl/server";
import { GITHUB, SITE } from "../../../lib/site";
import { Evidence } from "../../../_geo/Evidence";
import { SignInCta } from "../../../_components/SignInCta";
import { ArticleByline } from "../../../_components/ArticleByline";

export const TITLE = "如何快速读懂一个新代码库";
export const DESCRIPTION =
  "刚加入一个项目，或者打开了一个庞大又陌生的仓库？从头读到尾是行不通的。这里有一套 7 步的实用方法，帮你快速理解新代码库——先把它跑起来，端到端追踪一个真实请求，读测试，利用 git 历史——以及怎样在还没弄懂一切之前就开始有产出。";

const STEPS = [
  {
    n: "01",
    title: "先看地图，再看代码",
    body: "在打开任何一个源文件之前，先读 README、现有的文档，以及依赖清单（package.json、requirements.txt、go.mod、pom.xml）。它们给你一个 30,000 英尺高空的俯瞰视角：这个项目做什么、怎么运行，还能从依赖里看出架构的大致轮廓（一个 Web 框架、一个 ORM、一个消息队列、一个状态管理库，都在告诉你这东西是怎么搭起来的）。再粗略扫一眼顶层目录结构。你是在搭一张心智地图，好让以后的细节有处可挂，现在还不用记住任何东西。",
  },
  {
    n: "02",
    title: "先跑起来，再动手戳一戳",
    body: "在本地把项目跑起来，并且真正去用它——在应用里点一遍、调一调 API、看着日志滚动。然后改一处小而明显的地方（一个按钮上的文字、一个返回值），看看会发生什么。亲手把“这个文件”和“那个行为”对应起来，是让一个代码库变得真切的最快方式，没有之一。如果连跑都跑不起来，那这就是你的第一项任务，而且一路上它会教会你项目的构建和环境配置。",
  },
  {
    n: "03",
    title: "端到端追踪一个真实请求",
    body: "挑一个你作为用户已经理解的功能——登录、“创建订单”、某一个 API 端点——沿着每一层追踪下去：路由 → 处理器/控制器 → 服务层/业务逻辑 → 数据库 → 响应。这样一个纵向切片，比横向读十个文件更快地教会你这个项目真实的架构、命名和约定。一旦你把一个请求从头到尾走了一遍，下一个基本就是套用同样的模式了。",
  },
  {
    n: "04",
    title: "读测试",
    body: "测试是可执行的文档。它们展示了代码应该怎样被调用、哪些输入是要紧的，以及作者认为哪些情况重要到值得保护。先从你正在探索的那块区域的测试读起——它们往往是整个仓库里对意图最清晰的表述；而且和注释不同，测试一旦与代码脱节，整套测试就会变红，所以它没法悄悄过时。",
  },
  {
    n: "05",
    title: "用 git 历史找“为什么”",
    body: "代码告诉你“是什么”；git 告诉你“为什么”。当某一行看起来奇怪或随意时，对它跑一下 git blame，然后读那条提交信息，以及关联的 PR 或 issue。历史能把一个让人困惑的文件变成一个故事：这个 hack 是为了绕开那个 bug，这层抽象是在那个功能上线时加的。“为什么”正是你单凭当前代码根本无法还原的那部分上下文。",
  },
  {
    n: "06",
    title: "用工具导航——让 AI 当导游，而不是神谕",
    body: "用“转到定义”“查找所有引用”和调用层次结构在代码里穿行，而不是靠 grep 瞎猜。让你的 AI 助手解释一个陌生的文件或函数——要快速找到方向，它确实是个好导游。但要拿真实的代码和测试去核对它说的话：它会自信地给出看似合理、实则错误的解释，因为它是在做模式匹配，而不是在读你这个具体的项目。把 AI 当作一份快速的理解初稿，永远别把它当作事实的来源。",
  },
  {
    n: "07",
    title: "做一个小改动，并把它发布出去",
    body: "检验理解的真正标准是动手。修一个小 bug 或加一个小功能，然后一路走完评审和合并。这会逼着你接触构建、测试、约定和评审流程——也就是整台机器——并把被动的阅读转化为持久的知识，而这种知识只有在你让代码库做出新东西时才能获得。发布一次改动，比滚动浏览一整天学到的更多。",
  },
] as const;

const FAQ = [
  {
    q: "理解一个新代码库最快的方法是什么？",
    a: "不是从头读到尾——那是慢办法，而且大部分内容你都会忘掉。快办法是围绕真实的行为有目的地探索。先拿到地图：读 README、文档和依赖列表，粗略看一遍目录结构，大致知道这东西是怎么组织的。然后把它跑起来、用一用，再改一处小地方，把文件和行为对应起来。杠杆最高的单个动作，是挑一个你作为用户理解的功能，把那个请求端到端地追踪下去，穿过每一层——这样一个纵向切片，比读十个文件更快地教会你真实的架构和约定。再辅以读测试（它们是对意图的可执行文档），以及用 git blame 还原那些让人困惑的代码背后的“为什么”。贯穿始终的思路是按需深入：先建一张宽泛的地图，然后真实任务把你带到哪里，就在哪里深挖下去。",
  },
  {
    q: "在一个新代码库里，多久才能开始有产出？",
    a: "比“理解整个东西”所需的时间短——因为你从来不需要一次性理解整个东西。争取在最初几天内做出一个小而真实的改动（修一个小 bug 或加一个小功能）；这一次发布的改动会逼你走一遍构建、测试、约定和评审，抵得上一周的被动阅读。宽泛的熟悉——知道东西都在哪、一个请求怎么流转——几天就能做到。深入的理解则要在几周里一点点积累，一次一个任务：每项工作把你拉进一个新区域，你就在需要的时候即时学会它。在做任何事之前试图完全理解一个庞大的代码库，是让新工程师卡住的经典陷阱；产出来自一张好地图，加上一套可靠的按需深入的方法，而不是先把所有东西读一遍。",
  },
  {
    q: "我应该用 AI 帮我理解新代码库吗？",
    a: "应该——但要把它当导游，而不是当作事实的来源。让 AI 助手解释一个陌生的文件、总结一个模块，或者勾勒某个功能是怎么串起来的，是快速找到方向的好办法，它还能给你指出该去看哪里。但你必须拿真实的代码和测试去核对它说的话，因为它是在拿训练数据做模式匹配，对你这个具体的项目并没有真正的认识；它会给出自信满满、听起来很有道理、实际上却有细微错误甚至完全错误的解释。健康的做法是用 AI 来加速你自己的追踪——先快速拿到一份心智模型的初稿，再亲自在代码里跟着一个真实请求走一遍来确认它。如果跳过核对这一步，你学到的就不是这个代码库，而是 AI 对它的猜测。",
  },
  {
    q: "Covate 怎样帮我学习一个新的（或 AI 生成的）代码库？",
    a: "学习一个陌生的代码库和学习 AI 生成的代码，练的是同一块肌肉：两种情况下，你面对的都是并非出自你手的代码，需要真正理解它，而不只是接受它。Covate 把这个理解的环节嵌进你的工作流程。它是一个免费、开源的 MCP 工具，接入你的 AI 编程助手（Claude、Cursor、Copilot 等），观察你代码库里真正发生的改动，并把你真实的 diff 变成简短、有针对性的测验，考你其中的概念、API、边界情况和取舍——在你答上来之前暂停后续生成。所以当你在新项目里做出最初几处改动时，Covate 会趁上下文还新鲜，检查你是否真的理解自己正在动的东西。每次会话都会保存下来，同步客户端会把它们推送到你在 covate.org 上的学习台账——免费，无需付款——在那里你可以回顾过去的每一次会话、你的累计正确率，以及你总是答错的主题——把“快速上手”变成不断累积的理解，而不是一次性的手忙脚乱。",
  },
] as const;

export async function Article() {
  const t = await getTranslations("learn.article");
  return (
    <>
      <header className="border-b border-border pb-8 pt-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">实用指南</p>
        <h1 className="mt-4 text-4xl font-semibold leading-[1.12] tracking-tight text-primary sm:text-5xl">
          如何快速读懂一个新代码库
        </h1>
        <p className="mt-5 text-lg leading-8 text-secondary">
          你刚加入一个项目、接手了一个服务，或者打开了一个庞大而陌生的仓库——也许它大部分还是 AI 替你写的。从头读到尾行不通，也永远读不完。理解一个代码库最快的方法，是围绕真实的行为有目的地去探索，只在需要的地方深入下去。下面是一套实用的 7 步方法。
        </p>
        <ArticleByline updated="2026-08-05" />
      </header>

      <article className="mt-10 space-y-10 text-[15px] leading-8 text-secondary">
        <section>
          <p>
            第一天的本能是把所有东西都读一遍——一个文件接一个文件地打开，直到一切都说得通。可它永远不会说得通，因为代码库不是一本书：它是一张由行为构成的图，而理解行为要靠顺着它走，而不是按字母顺序读文件。你不需要理解它的全部。你需要的是一张好的<em>地图</em>，外加一套可靠的、<em>按需深入</em>的方法。下面这七步就能帮你做到。
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-primary">7 步方法</h2>
          <ol className="mt-6 space-y-5">
            {STEPS.map((c) => (
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
          <h2 className="text-2xl font-semibold tracking-tight text-primary">别想着先把一切都弄懂</h2>
          <p className="mt-4">
            让新工程师卡住的陷阱，就是试图在动任何东西之前，先完全理解一个庞大的代码库。你不需要这样做，也做不到——就连写它的人，脑子里也装不下全部。先<strong>宽泛地了解架构</strong>（有哪些组成部分、一个请求如何流转），再在每个任务把你带进新区域时，<strong>即时学习细节</strong>。深度跟着需要走。第三天发布的一个改动，胜过第三十天建立起的完美心智模型——何况，心智模型本来就是靠这些改动建立起来的。
          </p>
        </section>

        {/* Product CTA */}
        <section id="join" className="rounded-2xl border border-accent/40 bg-accent/[0.06] p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-primary">用 Covate 读懂不是你写的代码</h2>
          <p className="mt-4 text-secondary">
            新代码库和 AI 生成的代码是同一个问题：代码不是你写的，你却需要真正理解它，而不只是接受它。Covate 把这道检查嵌进你的工作流程。它是一个免费、开源的 MCP 工具，接入你的 AI 助手（Claude、Cursor、Copilot 等），观察你工作时真正发生的改动，并把你真实的 diff 变成简短、有针对性的测验，考你其中的概念、边界情况和取舍——让你趁上下文还新鲜就理解每一处改动。每次会话都会保存下来；免费的
            <a href={SITE + "/dashboard"} className="text-accent underline underline-offset-4 hover:text-accent-soft">
              Covate 学习台账
            </a>
            接手后续：用 GitHub 登录，每一次同步过来的会话、你的累计正确率，以及你总是答错的主题都可以随时回顾。没有任何需要购买的东西。
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
            <a href="/learn/how-to-learn-from-ai-generated-code" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
              如何真正从 AI 生成的代码中学到东西（而不让技能退化） →
            </a>
            <a href="/learn/how-to-review-ai-generated-code" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
              合并之前，如何评审 AI 生成的代码 →
            </a>
            <a href="/learn" className="text-sm text-accent underline underline-offset-4 hover:text-accent-soft">
              浏览 Covate 学习中心 →
            </a>
          </div>
        </section>
      </article>
    </>
  );
}
