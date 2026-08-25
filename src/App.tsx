import { copy, downloadHref, meta, release } from "./site-content.mjs";

type Locale = "ru" | "en";

/// `assets` is a parameter because Vite rewrites BASE_URL to "/" in the SSR build used by
/// the prerender step, and because the English page sits one directory deeper: both need
/// their own prefix for the files served next to the HTML.
function App({
  locale = "ru",
  assets = import.meta.env.BASE_URL,
}: {
  locale?: Locale;
  assets?: string;
}) {
  const t = copy[locale];
  const { docsHref, switchHref } = meta[locale];
  const href = downloadHref();
  const icon = `${assets.endsWith("/") ? assets : `${assets}/`}langflip-icon.png`;

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#top" aria-label={t.backToTop}>
            <img src={icon} alt={t.iconAlt} width="42" height="42" />
            <span>LangFlip</span>
          </a>
          <nav className="header-nav" aria-label={t.navLabel}>
            <a href="#features">{t.navFeatures}</a>
            <a href="#privacy">{t.navPrivacy}</a>
            <a href="#install">{t.navInstall}</a>
            {docsHref ? <a href={docsHref}>{t.navDocs}</a> : null}
            <a className="language-switch" href={switchHref} aria-label={t.languageLabel}>
              {t.languageSwitch}
            </a>
          </nav>
          <a className="header-download" href={href}>
            {t.navDownload}
          </a>
        </div>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="product-badge">
              <img src={icon} alt={t.heroIconAlt} width="48" height="48" />
              <div>
                <strong>LangFlip</strong>
                <span>{t.badgeFree}</span>
              </div>
            </div>
            <p className="eyebrow">{t.heroEyebrow}</p>
            <h1 id="hero-title">{t.heroTitle}</h1>
            <p className="hero-description">
              {t.heroDescriptionBefore} <span className="keyboard-key">⌘</span>
              {t.heroDescriptionAfter}
            </p>
            <a className="download-button" href={href}>
              {t.downloadCta}
              <span aria-hidden="true">↓</span>
            </a>
            <p className="release-note">
              {release.macOS} <span aria-hidden="true">·</span> DMG <span aria-hidden="true">·</span>{" "}
              {t.releaseNoteSize}
            </p>
          </div>

          <div className="conversion-demo" aria-label={t.demoLabel}>
            <div className="conversion-glow" aria-hidden="true" />
            <div className="command-orbit" aria-hidden="true">
              <span>⌘</span>
              <span>⌘</span>
            </div>
            <div className="conversion-word conversion-before">
              <span>{t.demoBefore}</span>
              <strong>ghbdtn</strong>
            </div>
            <div className="conversion-pulse" aria-hidden="true">
              <i />
              <span>→</span>
              <i />
            </div>
            <div className="conversion-word conversion-after">
              <span>{t.demoAfter}</span>
              <strong>привет</strong>
            </div>
            <div className="dictation-chip">
              <span className="dictation-dot" aria-hidden="true" />
              {t.dictationChip} <span className="keyboard-key">⌘</span>
            </div>
          </div>
        </section>

        <section className="features section-shell" id="features" aria-labelledby="features-title">
          <div className="section-heading">
            <p className="eyebrow">{t.featuresEyebrow}</p>
            <h2 id="features-title">{t.featuresTitle}</h2>
            <p>{t.featuresLead}</p>
          </div>
          <div className="feature-grid">
            <article className="feature-card feature-card--blue">
              <span className="feature-number" aria-hidden="true">01</span>
              <div className="feature-icon" aria-hidden="true">А↔A</div>
              <h3>{t.feature1Title}</h3>
              <p>{t.feature1Body}</p>
            </article>
            <article className="feature-card feature-card--violet">
              <span className="feature-number" aria-hidden="true">02</span>
              <div className="feature-icon feature-keys" aria-hidden="true">
                <span>⌘</span><span>⌘</span>
              </div>
              <h3>{t.feature2Title}</h3>
              <p>
                {t.feature2Before} <span className="keyboard-key">⌘</span>
                {t.feature2Middle} <span className="keyboard-key">⌥⌘Z</span>.
              </p>
            </article>
            <article className="feature-card feature-card--periwinkle">
              <span className="feature-number" aria-hidden="true">03</span>
              <div className="feature-icon" aria-hidden="true">●)))</div>
              <h3>{t.feature3Title}</h3>
              <p>{t.feature3Body}</p>
            </article>
          </div>
        </section>

        <section className="dictation section-shell" aria-labelledby="dictation-title">
          <div className="dictation-copy">
            <p className="eyebrow">{t.dictationEyebrow}</p>
            <h2 id="dictation-title">{t.dictationTitle}</h2>
            <p>
              {t.dictationBodyBefore} <strong>WhisperKit</strong> {t.dictationBodyMiddle}{" "}
              <strong>{t.dictationModelSize}</strong> {t.dictationBodyAfter}
            </p>
          </div>
          <ol className="dictation-steps" aria-label={t.dictationStepsLabel}>
            <li><span>1</span><strong>{t.dictationStep1}</strong><small>{t.dictationStep1Note}</small></li>
            <li><span>2</span><strong>{t.dictationStep2}</strong><small>{t.dictationStep2Note}</small></li>
            <li><span>3</span><strong>{t.dictationStep3}</strong><small>{t.dictationStep3Note}</small></li>
          </ol>
        </section>

        <section className="privacy" id="privacy" aria-labelledby="privacy-title">
          <div className="privacy-inner">
            <div className="privacy-intro">
              <p className="eyebrow">{t.privacyEyebrow}</p>
              <h2 id="privacy-title">{t.privacyTitle}</h2>
              <p>{t.privacyLead}</p>
            </div>
            <ul className="privacy-list">
              {t.privacyItems.map((item, index) => (
                <li key={item}>
                  <span aria-hidden="true">0{index + 1}</span>
                  <p>{item}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="install section-shell" id="install" aria-labelledby="install-title">
          <div className="section-heading install-heading">
            <p className="eyebrow">{t.installEyebrow}</p>
            <h2 id="install-title">{t.installTitle}</h2>
            <p>{t.installLead}</p>
          </div>
          <ol className="install-steps">
            <li>
              <span className="step-number">01</span>
              <div><h3>{t.install1Title}</h3><p>{t.install1Body}</p></div>
            </li>
            <li>
              <span className="step-number">02</span>
              <div><h3>{t.install2Title}</h3><p>{t.install2Body}</p></div>
            </li>
            <li>
              <span className="step-number">03</span>
              <div><h3>{t.install3Title}</h3><p>{t.install3Body}</p></div>
            </li>
            <li>
              <span className="step-number">04</span>
              <div><h3>{t.install4Title}</h3><p>{t.install4Body}</p></div>
            </li>
          </ol>
        </section>

        <section className="final-cta" aria-labelledby="download-title">
          <div className="final-cta-art" aria-hidden="true">
            <span className="final-command">⌘</span>
            <div className="final-conversion">
              <span>ghbdtn</span>
              <i>→</i>
              <strong>привет</strong>
            </div>
          </div>
          <div className="final-cta-copy">
            <p className="eyebrow">{t.finalEyebrow}</p>
            <h2 id="download-title">{t.finalTitle}</h2>
            <p>{t.finalLead}</p>
            <a className="download-button download-button--dark" href={href}>
              {t.downloadCta}
              <span aria-hidden="true">↓</span>
            </a>
            <small>{release.macOS} · {t.releaseNoteSize}</small>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#top" aria-label={t.backToTop}>
          <img src={icon} alt={t.iconAlt} width="36" height="36" />
          <span>LangFlip</span>
        </a>
        <p>{t.footerVersion}</p>
        <nav aria-label={t.footerLinksLabel}>
          {docsHref ? <a href={docsHref}>{t.navDocs}</a> : null}
          <a href="#privacy">{t.navPrivacy}</a>
          <a href="#install">{t.navInstall}</a>
          <a href={switchHref}>{t.languageSwitch}</a>
        </nav>
      </footer>
    </>
  );
}

export default App;
