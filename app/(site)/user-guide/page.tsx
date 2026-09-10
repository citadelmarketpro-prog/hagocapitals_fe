"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReadyToInvest from "@/components/ReadyToInvest";
import { FadeUp } from "@/components/ScrollReveal";

const NAV_SECTIONS = [
  { id: "onboarding", label: "Onboarding" },
  { id: "dashboard",  label: "Dashboard" },
  { id: "leaders",    label: "Leaders" },
  { id: "markets",    label: "Markets" },
  { id: "community",  label: "Community" },
  { id: "account",    label: "Account" },
];

export default function UserGuidePage() {
  const [activeId, setActiveId] = useState("onboarding");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    NAV_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id); },
        { rootMargin: "-10% 0px -75% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveId(id);
    setMobileNavOpen(false);
  };

  return (
    <>
      <Navbar />

      <div className="w-full bg-white">

        {/* ── Mobile section nav ── */}
        <div className="lg:hidden sticky top-[80px] z-30 bg-white border-b border-[#e5e5e5]">
          <button
            onClick={() => setMobileNavOpen((o) => !o)}
            className="w-full flex items-center justify-between px-6 py-3.5 text-[13px] text-[#001011]"
          >
            <span className="font-medium truncate pr-2">
              {NAV_SECTIONS.find((s) => s.id === activeId)?.label}
            </span>
            <ChevronDownIcon open={mobileNavOpen} />
          </button>
          {mobileNavOpen && (
            <div className="border-t border-[#e5e5e5] bg-white">
              {NAV_SECTIONS.map(({ id, label }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={(e) => handleNavClick(e, id)}
                  className={`block px-6 py-3 text-[13px] border-b border-[#e5e5e5] last:border-b-0 transition-colors ${
                    activeId === id
                      ? "bg-[#f2f2ec] text-[#001011]"
                      : "text-[#555555]"
                  }`}
                >
                  {label}
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="max-w-[1440px] mx-auto px-6 lg:px-[72px] py-10 lg:py-16">
          <div className="flex gap-8 lg:gap-14 items-start">

            {/* ── Sticky Sidebar (desktop only) ── */}
            <aside className="hidden lg:block w-[230px] shrink-0 sticky top-[88px]">
              <div className="border border-[#e5e5e5] rounded-lg overflow-hidden">
                {NAV_SECTIONS.map(({ id, label }) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    onClick={(e) => handleNavClick(e, id)}
                    className={`block px-4 py-3.5 text-[13px] leading-snug border-b border-[#e5e5e5] last:border-b-0 transition-colors ${
                      activeId === id
                        ? "bg-[#f2f2ec] text-[#001011]"
                        : "bg-white text-[#555555] hover:bg-[#fafaf8] hover:text-[#001011]"
                    }`}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </aside>

            {/* ── Main Content ── */}
            <main className="flex-1 min-w-0 flex flex-col gap-16 pb-4">

              {/* ═══════════════════════════════════
                  1. ONBOARDING
              ═══════════════════════════════════ */}
              <section id="onboarding" className="flex flex-col gap-6 scroll-mt-[136px] lg:scroll-mt-28">
        <FadeUp>
                <SectionHeading>HagoCapitals Leaders</SectionHeading>

                {/* A. Login */}
                <div className="flex flex-col gap-3">
                  <LimeSubHeading>A. Login</LimeSubHeading>
                  <BodyText>
                    You can login to your account by entering your HagoCapitals Username or your
                    HagoCapitals registered email address, together with your HagoCapitals password.
                  </BodyText>
                </div>

                {/* B. Registration */}
                <div className="flex flex-col gap-4">
                  <LimeSubHeading>B. Registration</LimeSubHeading>
                  <BodyText>
                    Upon your registration, a free Demo account will be automatically created for you,
                    with exactly the same functionality as a Live account. This means that you can try
                    out HagoCapitals risk-free and experiment with different CopyTrading strategies before
                    investing any real funds!
                  </BodyText>
                  <BulletList
                    items={[
                      "Demo is designed to provide the same experience as your Real account, irrespective to your selected Broker",
                      "Rates accurately represent the market at all times",
                      "Comprehensive Stop Out level at your desired level",
                    ]}
                  />
                  <div>
                    <LimeLink href="#">Try now</LimeLink>
                  </div>

                  {/* a. Personal Details */}
                  <div className="flex flex-col gap-2 mt-1">
                    <SmallSubHeading>a. Personal Details</SmallSubHeading>
                    <BodyText>
                      After registration you will be prompted to complete your account. The first step
                      is to enter your personal details, like name, country and phone number. Please
                      note that it is not possible to change your e-mail address later, but we can
                      change it for you with a simple e-mail request to:{" "}
                      <LimeLink href="mailto:support@HagoCapitals.com">support@HagoCapitals.com</LimeLink>
                    </BodyText>
                    <BodyText>
                      In order to ensure smooth connectivity please note that your e-mail address at
                      HagoCapitals should be the same as in your broker(s).
                    </BodyText>
                  </div>

                  {/* b. Setup Broker Account */}
                  <div className="flex flex-col gap-3 mt-1">
                    <SmallSubHeading>b. Setup Broker Account</SmallSubHeading>
                    <BodyText>
                      After that you will be prompted to add a Live trading account. You can create a
                      new trading account with one of our supported brokerage firms.
                    </BodyText>

                    <p className="text-[14px] font-semibold text-[#001011]">
                      Connect an existing broker account
                    </p>
                    <BodyText>
                      You can connect any MT4, MT5, ActTrader, XOH account you already own from any
                      broker by following the on-screen instructions.
                    </BodyText>
                    <BodyText>
                      In case your broker is not on our list you may select &quot;Other Brokers&quot; and you
                      will be asked to provide the brokers IP in addition to your Broker Account
                      Username and Password.
                    </BodyText>
                    <BodyText>
                      Please note that the required password is the MT4, MT5, ActTrader, XOH Master
                      password, and not the Read-Only (Investor) password. If you provide the Read-Only
                      (Investor) password, although your HagoCapitals account will be connected to your
                      Broker account, you will not be able to receive any signals as it will be set to
                      read-only mode.
                    </BodyText>
                    <BodyText>
                      If you do not have the Broker Account Username, Broker Account Password
                      available, then please contact your Broker as they can remind/reset them for you
                      — unfortunately, HagoCapitals does not have access to this information and thus
                      cannot provide it.
                    </BodyText>

                    <p className="text-[14px] font-semibold text-[#001011]">
                      Create a new broker account
                    </p>
                    <BodyText>
                      You can also create a new Trading Account through HagoCapitals with our supported
                      brokerage firms. In order to do so, please follow the on-screen instructions for
                      each broker account.
                    </BodyText>
                    <BodyText>
                      Keep in mind that for some brokers you will be directed to the broker&apos;s website
                      to create your trading account. After that you will need to return to HagoCapitals
                      to eventually connect your new trading account. You will be provided with
                      instructions (on-screen or via email) that you need to follow for the specific
                      broker.
                    </BodyText>
                    <NoteBlock>
                      Please remember that if you ever change your Broker Password, connectivity with
                      your HagoCapitals account will be lost, so you will need to repeat this process,
                      and re-connect your Broker account to HagoCapitals using the updated Broker
                      Password.
                    </NoteBlock>
                  </div>
                </div>

                {/* C. Applicable Fees */}
                <div className="flex flex-col gap-3">
                  <LimeSubHeading>C. Applicable Fees</LimeSubHeading>
                  <BodyText>
                    In order to be able to CopyTrade with a Live Trading Account you do not need to
                    pay any subscription fee. The HagoCapitals Platform is available to all End-Users
                    holding a linked trading account with a Co-operating Broker.
                  </BodyText>
                </div>
              </FadeUp>
        </section>

              {/* ═══════════════════════════════════
                  2. DASHBOARD
              ═══════════════════════════════════ */}
              <section id="dashboard" className="flex flex-col gap-6 scroll-mt-[136px] lg:scroll-mt-28">
        <FadeUp>
                <SectionHeading>Dashboard</SectionHeading>

                {/* A. Basic Information */}
                <div className="flex flex-col gap-3">
                  <LimeSubHeading>A. Basic Information</LimeSubHeading>
                  <BodyText>
                    On the Home/Dashboard you will find information like your accounts&apos; Equity, PnL,
                    ROI and performance chart, as well as the Leaders you are CopyTrading and your
                    trades.
                  </BodyText>
                  <BodyText>
                    In case you have multiple trading accounts, you can select the account of your
                    choice to display the relevant information, by using the account selector.
                  </BodyText>
                </div>

                {/* B. My Trades */}
                <div className="flex flex-col gap-4">
                  <LimeSubHeading>B. My Trades</LimeSubHeading>
                  <BodyText>
                    This is where executed signals that Leaders place in your account and trades that
                    you have placed on your own will show up. Here you can see what your current
                    earnings or losses are at the moment for each trade. Trades are organised in open,
                    pending orders and closed trades.
                  </BodyText>

                  {/* a. Trade Details */}
                  <div className="flex flex-col gap-3 mt-1">
                    <SmallSubHeading>a. Trade Details</SmallSubHeading>
                    <BodyText>
                      Clicking on any trade will show additional information for the specific
                      trade/order. Here you can also find the Trader Ticket and Broker Ticket, which
                      are essential IDs if you wish to contact HagoCapitals over specific trades.
                    </BodyText>

                    {/* 1. Update */}
                    <NumberedItem n="1" title="Update an open trade or a pending order:">
                      <BodyText>
                        By clicking &quot;Update&quot; on an open trade, you will bring up a popup window where
                        you can change the Stop Loss or Take Profit rates.
                      </BodyText>
                      <BodyText>
                        On a pending order you can update the Stop Loss, Take Profit Rates, as well as
                        the BUY or SELL rates that were previously set.
                      </BodyText>
                      <BodyText>
                        When updating copied trades, you will overwrite any Stop Loss, Take Profit or
                        BUY/SELL rates previously set by the Leader or by yourself. Please note that
                        after you have updated any of these rates, any new updates on copied trades
                        will be received normally at your account.
                      </BodyText>
                    </NumberedItem>

                    {/* 2. Close */}
                    <NumberedItem n="2" title="Close an open trade:">
                      <BodyText>
                        By choosing to close a trade you will then be prompted to a confirmation
                        window, where you can either confirm or cancel your Close request. Upon
                        confirmation the trade will close and should no longer appear in your trades.
                      </BodyText>
                      <BodyText>
                        Take into consideration that sometimes there may be a brief delay of a few
                        seconds between closing the trades and displaying that on your trades; if you
                        notice a delay, please try using the Refresh option.
                      </BodyText>
                    </NumberedItem>

                    {/* 3. Cancel */}
                    <NumberedItem n="3" title="Cancel a pending order:">
                      <BodyText>
                        By choosing to cancel a pending order you will then be prompted to a
                        confirmation window. Upon confirmation the order will close and should no
                        longer appear in your orders. If you notice a delay, please try using the
                        Refresh option.
                      </BodyText>
                    </NumberedItem>
                  </div>
                </div>

                {/* C. My Leaders */}
                <div className="flex flex-col gap-4">
                  <LimeSubHeading>C. My Leaders</LimeSubHeading>
                  <BodyText>
                    This is where the Leaders that you already copy will appear. By clicking on any
                    Leader you will see your PnL, ROI and the investment you have made on a specific
                    Leader, as well as all the trades that have been copied by the specific Leader.
                  </BodyText>

                  {/* a. Copied Trades */}
                  <div className="flex flex-col gap-2 mt-1">
                    <SmallSubHeading>a. Copied Trades</SmallSubHeading>
                    <BodyText>
                      Copied trades are organised in open, pending orders and closed trades exactly
                      like your own (manual) trades. You can also update any open trade or pending
                      order, in the same way you can do it for your own trades.
                    </BodyText>
                    <BodyText>
                      By updating copied trades, you will overwrite any Stop Loss, Take Profit or
                      BUY/SELL rates previously set by the Leader or by yourself. Please note that
                      after you have updated any of these rates, any new updates on copied trades will
                      be received normally at your account.
                    </BodyText>
                  </div>

                  {/* b. Update Strategy */}
                  <div className="flex flex-col gap-2 mt-1">
                    <SmallSubHeading>b. Update Strategy</SmallSubHeading>
                    <BodyText>
                      You can update the CopyTrading settings of a specific Leader&apos;s strategy by
                      clicking/tapping on &quot;Update&quot; next to the Leader&apos;s name. On the web app this
                      option is under the context menu (3 dots). A new window will open where you can
                      change the &quot;Investment amount&quot;, &quot;Copy ratio&quot;, &quot;Take Profit amount&quot;, as well as
                      set or remove the &quot;Trailing Stop&quot; for the whole strategy.
                    </BodyText>
                    <div>
                      <LimeLink href="#">Learn more on</LimeLink>
                    </div>
                  </div>

                  {/* c. Stop Copying */}
                  <div className="flex flex-col gap-2 mt-1">
                    <SmallSubHeading>c. Stop Copying Strategy</SmallSubHeading>
                    <BodyText>
                      From the &quot;Update Strategy&quot; window you can also stop copying a Leader&apos;s
                      strategy. Once you stop copying a Leader you will stop receiving new trades by
                      this specific Leader.
                    </BodyText>
                    <BodyText>
                      In case you have open trades at the time you stop copying a Leader you will be
                      asked if you want to keep or close all the open trades by this Leader&apos;s strategy
                      as well.
                    </BodyText>
                    <BodyText>
                      If you choose to keep all open trades from a strategy you are stop copying, you
                      will still receive signals for these trades until you close them manually or get
                      closed by the Leader. New trades will not get copied though.
                    </BodyText>
                  </div>
                </div>
              </FadeUp>
        </section>

              {/* ═══════════════════════════════════
                  3. LEADERS
              ═══════════════════════════════════ */}
              <section id="leaders" className="flex flex-col gap-5 scroll-mt-[136px] lg:scroll-mt-28">
        <FadeUp>
                <SectionHeading>Leaders</SectionHeading>

                <BodyText>
                  If you click on the &quot;See all Leaders&quot; button, you will be directed to the Leaders&apos;
                  page to check the Leaders and select which you wish to copy.
                </BodyText>
                <BodyText>To copy a Leader, follow the steps below:</BodyText>

                <div className="flex flex-col gap-4">
                  {[
                    {
                      n: "1",
                      title: "Navigate to the Leaders\u2019 tab.",
                      text: "Here you can explore all of the Leader\u2019s that are available for copytrading in HagoCapitals. You can click/tap on any of the Leaders to open their profiles, where you can view all of the Leader\u2019s trading statistics.",
                    },
                    {
                      n: "2",
                      title: "Click/tap the \u201cCopy Strategy\u201d button",
                      text: "A pop-up will open.",
                    },
                    {
                      n: "3",
                      title: "Select a trading account",
                      text: "In case you have multiple trading accounts make sure you have selected the one with which you want to invest.",
                    },
                    {
                      n: "4",
                      title: "Specify the funds you wish to invest",
                      text: "AutoGuard\u2122 \u2013 This is the amount you wish to invest by following this Leader. You may adjust the amount according to your balance. In case you experience a loss equal to your investment amount, AutoGuard\u2122 will automatically get activated to safeguard your invested capital.",
                    },
                    {
                      n: "5",
                      title: "Advanced Settings (optional):",
                      text: "",
                    },
                  ].map((step) => (
                    <div key={step.n} className="flex gap-3">
                      <span className="shrink-0 mt-[2px] text-[14px] font-semibold text-[#06811d] leading-none">
                        {step.n}.
                      </span>
                      <div className="flex flex-col gap-1">
                        <p className="text-[14px] font-semibold text-[#001011] leading-snug">
                          {step.title}
                        </p>
                        {step.text && <BodyText>{step.text}</BodyText>}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Advanced settings bullet list */}
                <BulletList
                  items={[
                    "Custom Copy Ratio: By setting a \u201cCustom Copy Ratio\u201d you will override our algorithm and the Leader\u2019s trades will be copied with the ratio you set.",
                    "Take Profit: When you make this amount of profit by the copied trades from this Leader, you will automatically stop copying the Leader and all of the open copied trades will get closed.",
                    "Trailing Stop Loss: If you set Capital Protection to $500, in case the Leader is losing $500 in your account, AutoGuard\u2122 will step in. However, this mode will move up exactly like a trailing stop for the whole strategy. If the Leader has closed trades that have a PnL of $2,000 in your account and his next trade has floating losses of -$500, then AutoGuard\u2122 will step in, and secure profits of $1,500!",
                    "Copy Open Trades: Enabling this will copy all of the Leader\u2019s open trades at market price at the time you copy the Leader.",
                  ]}
                />

                <BodyText>
                  By default all your CopyTrading investment is protected by AutoGuard™, which
                  creates a protection shield for your investment capital. AutoGuard™ monitors each
                  Leader&apos;s trading behaviour and automatically takes action when a radical change in
                  his trading strategy is detected.
                </BodyText>
              </FadeUp>
        </section>

              {/* ═══════════════════════════════════
                  4. MARKETS
              ═══════════════════════════════════ */}
              <section id="markets" className="flex flex-col gap-4 scroll-mt-[136px] lg:scroll-mt-28">
        <FadeUp>
                <SectionHeading>Markets</SectionHeading>

                <BodyText>
                  Here you can place manual trades as you see fit. The rates displayed are received
                  directly from your broker, so it is the same as if you were trading from your broker
                  platform. You will see the BUY price per instrument as well as the change percentage
                  since the previous market close.
                </BodyText>
                <BodyText>
                  When the market is open, rates will be constantly highlighted alternating between
                  green and red, indicating whether market tendencies are currently up or downwards for
                  this pair.
                </BodyText>
                <BodyText>
                  You can click/tap on any of the available instruments to open its page and see its
                  chart as well as useful statistics and news.
                </BodyText>
                <BodyText>
                  If you wish to place a manual trade, simply click on either Buy or Sell. A popup
                  window will then appear. This window will consist of the current market price and
                  some options that you can set to place your trade/order.
                </BodyText>
                <BodyText>
                  You may open a trade at market price or set a specific price to place a pending
                  order by selecting the &quot;Limit Order&quot; option and then setting your desired price.
                </BodyText>
                <BodyText>
                  The investment amount can be set by entering the amount of Lots, Units or Margin (in
                  your trading account&apos;s currency).
                </BodyText>
                <BodyText>
                  You may also amend the default Stop and Limit, and it is possible to set a Trailing
                  Stop as well. Please note that if you select the Trailing Stop option, the Stop will
                  start trailing immediately as soon as the trade is opened. For example, a BUY
                  EUR/USD trade is set with -30 pips Trailing Stop and opened at 1.383. The trade is
                  opened with a Stop of -30 pips (at 1.380), and if it starts winning even by one pip,
                  the Trailing Stop will be updated accordingly. So when the trade reaches a High of 5
                  pips (rate 1.3835), the Stop will be updated 30 pips away from this new rate, at
                  1.3805 (-25 pips away from the trade&apos;s opening price). After a Trailing Stop is set,
                  it is updated automatically as described above without the need to remain logged in
                  the account.
                </BodyText>
                <BodyText>
                  Once you have entered the information you wish, simply click on OK and the trade
                  will appear either in your open positions or pending orders accordingly.
                </BodyText>
              </FadeUp>
        </section>

              {/* ═══════════════════════════════════
                  5. COMMUNITY
              ═══════════════════════════════════ */}
              <section id="community" className="flex flex-col gap-5 scroll-mt-[136px] lg:scroll-mt-28">
        <FadeUp>
                <SectionHeading>Community</SectionHeading>

                <BodyText>
                  Here you can learn what is happening in the HagoCapitals community and participate in
                  discussions about investment topics. This is where HagoCapitals&apos;s users are sharing
                  their thoughts about the markets.
                </BodyText>

                <BulletList
                  items={[
                    "You can follow any hashtag of your interest so that you can stay up-to-date on a specific topic.",
                    "You can create your own posts to initiate a discussion in the community.",
                    "You can upload media (pictures and images) on your posts.",
                    "You can like and comment on any post.",
                  ]}
                />

                <div className="flex flex-col gap-3">
                  <p className="text-[14px] font-semibold text-[#001011]">
                    Follow a Leader:
                  </p>
                  <BodyText>
                    In order to stay updated about specific Leaders&apos; posts, you can add them to your
                    watchlist, by visiting their profiles and tapping the &quot;Star&quot; button (on mobile) or
                    by clicking the &quot;Add to watchlist&quot; button (on web). Once you add a Leader to your
                    watchlist you automatically &quot;Follow&quot; him/her so that you can see what they are
                    posting in the community.
                  </BodyText>
                </div>
              </FadeUp>
        </section>

              {/* ═══════════════════════════════════
                  6. ACCOUNT
              ═══════════════════════════════════ */}
              <section id="account" className="flex flex-col gap-6 scroll-mt-[136px] lg:scroll-mt-28">
        <FadeUp>
                <SectionHeading>Account</SectionHeading>

                {/* A. My Profile */}
                <div className="flex flex-col gap-3">
                  <LimeSubHeading>A. My Profile</LimeSubHeading>
                  <BodyText>
                    &quot;My Profile&quot; is available only on our mobile apps.
                  </BodyText>
                  <BodyText>
                    On &quot;My Profile&quot; you will find an overview of your accounts with information like
                    your accounts&apos; Equity, PnL, ROI and performance chart, as well as the Leaders you
                    are CopyTrading and your trades.
                  </BodyText>
                  <div className="flex flex-col gap-1">
                    <div>
                      <span className="text-[14px] text-[#444444]">Learn more about </span>
                      <LimeLink href="#">My Trades.</LimeLink>
                    </div>
                    <div>
                      <span className="text-[14px] text-[#444444]">Learn more about </span>
                      <LimeLink href="#">My Leaders.</LimeLink>
                    </div>
                  </div>
                  <BodyText>
                    In case you have multiple trading accounts, you can select the account of your
                    choice to display the relevant information, by using the account selector.
                  </BodyText>
                  <BodyText>
                    Additionally you can see all of your community posts in one place under the tab
                    &quot;Posts&quot;.
                  </BodyText>
                </div>

                {/* B. Watchlist */}
                <div className="flex flex-col gap-3">
                  <LimeSubHeading>B. Watchlist</LimeSubHeading>
                  <BodyText>
                    The watchlist allows you to easily keep an eye on the market assets and Leaders
                    that you&apos;re interested in. You can add any asset or leader to your watchlist by
                    using the star icon on asset&apos;s and Leader profiles, and then easily monitor their
                    performance in real-time.
                  </BodyText>
                  <BodyText>
                    Whether you&apos;re a seasoned trader or just getting started, the watchlist is an
                    invaluable tool for keeping track of the market and staying up-to-date on the
                    latest trends. You can use it to quickly identify trading opportunities, track your
                    favorite leaders.
                  </BodyText>
                  <BodyText>
                    With the watchlist, you&apos;re always in control. You can add and remove assets and
                    leaders as you see fit, and customize your watchlist to suit your specific
                    investing style, so you can easily access all the information you need to make
                    informed trading decisions.
                  </BodyText>
                </div>

                {/* C. Settings */}
                <div className="flex flex-col gap-4">
                  <LimeSubHeading>C. Settings</LimeSubHeading>

                  {/* a. Security */}
                  <div className="flex flex-col gap-3">
                    <SmallSubHeading>a. Security</SmallSubHeading>

                    <NumberedItem n="1" title="Change Password">
                      <BodyText>
                        You can also change your password for logging into your HagoCapitals account —
                        in order to do that you will need your Current Password. If you have forgotten
                        your Current Password, you can always reset it by clicking on the Forgot
                        Password.
                      </BodyText>
                    </NumberedItem>

                    <NumberedItem n="2" title="Biometrics">
                      <BodyText>Only available on Mobile devices.</BodyText>
                    </NumberedItem>
                  </div>

                  {/* b. Display Currency */}
                  <div className="flex flex-col gap-3">
                    <SmallSubHeading>b. Display Currency</SmallSubHeading>
                    <BodyText>
                      Here you can select a display currency to view your (total) balance and stats
                      (of all your live trading accounts).
                    </BodyText>
                    <BulletList
                      items={[
                        "This currency will be used on your statistics when \u201cAll accounts\u201d is selected in your home/dashboard or profile.",
                        "Specific account portfolios, trades and statistics will still be displayed in each account currency as set by your broker.",
                        "Transactions will always be executed in each account\u2019s currency as set by your broker.",
                      ]}
                    />
                  </div>

                  {/* c. Delete Account */}
                  <div className="flex flex-col gap-2">
                    <SmallSubHeading>c. Delete Account</SmallSubHeading>
                    <BodyText>
                      In order to process the deletion of your account please send an email to{" "}
                      <LimeLink href="mailto:support@HagoCapitals.com">
                        support@HagoCapitals.com
                      </LimeLink>{" "}
                      with the title &apos;Delete Account&apos;. Kindly note that due to regulatory obligations
                      HagoCapitals is legally obliged to maintain data for Live accounts for a period of
                      time as per respective licences for EU and Global regions.
                    </BodyText>
                  </div>
                </div>
              </FadeUp>
        </section>

            </main>
          </div>
        </div>
      </div>

      <ReadyToInvest />
      <Footer />
    </>
  );
}

/* ── Shared primitives ───────────────────────────────────────────── */

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-[28px] lg:text-[34px] font-bold text-[#001011] leading-tight">
        {children}
      </h2>
      <hr className="border-t border-[#e5e5e5]" />
    </div>
  );
}

function LimeSubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[15px] font-semibold text-[#06811d] leading-snug">{children}</h3>
  );
}

function SmallSubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-[14px] font-semibold text-[#001011] leading-snug">
      {children}
    </h4>
  );
}

function BodyText({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[14px] leading-[1.8] text-[#444444]">{children}</p>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2.5 pl-5 list-disc">
      {items.map((item, i) => (
        <li key={i} className="text-[14px] leading-[1.8] text-[#444444] marker:text-[#444444]">
          {item}
        </li>
      ))}
    </ul>
  );
}

function LimeLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="text-[#06811d] hover:underline underline-offset-2 transition-opacity hover:opacity-80">
      {children}
    </a>
  );
}

function NumberedItem({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="shrink-0 mt-[2px] text-[14px] font-semibold text-[#06811d] leading-none">{n}.</span>
      <div className="flex flex-col gap-2">
        <p className="text-[14px] font-semibold text-[#001011] leading-snug">{title}</p>
        {children}
      </div>
    </div>
  );
}

function NoteBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border-l-2 border-[#06811d] pl-4 py-1 bg-[#fafaf8]">
      <p className="text-[13px] font-semibold text-[#06811d] mb-1">Note:</p>
      <p className="text-[13px] leading-[1.8] text-[#444444]">{children}</p>
    </div>
  );
}

function ChevronDownIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16" height="16" viewBox="0 0 16 16"
      fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round"
      className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <polyline points="3,6 8,11 13,6" />
    </svg>
  );
}
