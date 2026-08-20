import { downloadHref, release } from "./site-content.mjs";

function App() {
  const href = downloadHref(import.meta.env.BASE_URL);

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="LangFlip: к началу страницы">
          <img src="./langflip-icon.png" alt="" width="42" height="42" />
          <span>LangFlip</span>
        </a>
        <nav className="header-nav" aria-label="Основная навигация">
          <a href="#features">Возможности</a>
          <a href="#privacy">Приватность</a>
          <a href="#install">Установка</a>
        </nav>
        <a className="header-download" href={href} download>
          Скачать
        </a>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">Бесплатно для macOS</p>
            <h1 id="hero-title">Исправляет раскладку, пока вы печатаете.</h1>
            <p className="hero-description">
              LangFlip замечает слова в неправильной раскладке, исправляет их автоматически
              и по двойному нажатию <span className="keyboard-key">⌘</span>.
            </p>
            <a className="download-button" href={href} download>
              Скачать LangFlip {release.version}
              <span aria-hidden="true">↓</span>
            </a>
            <p className="release-note">
              {release.macOS} <span aria-hidden="true">·</span> DMG <span aria-hidden="true">·</span>{" "}
              около {release.sizeLabel}
            </p>
          </div>

          <div className="document-demo" aria-label="Демонстрация исправления раскладки: ghbdtn превращается в привет">
            <div className="document-topbar" aria-hidden="true">
              <span />
              <span />
              <span />
              <i />
            </div>
            <div className="document-body">
              <div className="document-label">
                <span className="document-mark" aria-hidden="true" />
                Живой ввод
              </div>
              <div className="color-bar color-bar--blue" aria-hidden="true" />
              <div className="color-bar color-bar--violet color-bar--short" aria-hidden="true" />
              <p className="correction-line">
                <span className="typed-word">ghbdtn</span>
                <span className="arrow" aria-hidden="true">→</span>
                <strong>привет</strong>
                <span className="text-cursor" aria-hidden="true" />
              </p>
              <div className="color-bar color-bar--coral color-bar--medium" aria-hidden="true" />
              <div className="color-bar color-bar--lime color-bar--short" aria-hidden="true" />
              <div className="dictation-status">
                <span className="microphone" aria-hidden="true">●</span>
                Диктовка готова
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default App;
